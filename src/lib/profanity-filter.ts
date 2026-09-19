import type { RegExpMatcher } from "obscenity"

import { pool } from "./db"
import { buildMatcher, isProfane, type Term } from "./profanity"

export { isProfane }

// ponytail: caché en memoria por instancia con TTL; cambios en la BD tardan
// hasta TTL en verse. Subir a cache compartida (Redis) si hace falta.
const CACHE_TTL_MS = 60_000

let cache: { matcher: RegExpMatcher; expiresAt: number } | null = null

async function ensureSchema(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS blocked_terms (
      id serial PRIMARY KEY,
      term text NOT NULL,
      kind text NOT NULL DEFAULT 'block' CHECK (kind IN ('block', 'allow')),
      enabled boolean NOT NULL DEFAULT true,
      created_at timestamptz NOT NULL DEFAULT now(),
      UNIQUE (term, kind)
    )
  `)
}

async function loadTerms(): Promise<Term[]> {
  await ensureSchema()
  const { rows } = await pool.query<Term>(
    "SELECT term, kind FROM blocked_terms WHERE enabled ORDER BY term"
  )
  return rows
}

export async function getMatcher(): Promise<RegExpMatcher> {
  const now = Date.now()
  if (cache && cache.expiresAt > now) return cache.matcher

  try {
    const matcher = buildMatcher(await loadTerms())
    cache = { matcher, expiresAt: now + CACHE_TTL_MS }
    return matcher
  } catch (error) {
    // ponytail: fail-open si la BD cae; el honeypot y el rate-limit siguen activos.
    console.error("Error loading blocked terms:", error)
    return buildMatcher([])
  }
}
