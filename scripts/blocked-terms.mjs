#!/usr/bin/env node
// Administra los términos del filtro en la tabla `blocked_terms`.
// Uso:
//   node scripts/blocked-terms.mjs list
//   node scripts/blocked-terms.mjs add "palabra" ["otra" ...]
//   node scripts/blocked-terms.mjs allow "palabra"   # excepción / falso positivo
//   node scripts/blocked-terms.mjs remove "palabra"
//   node scripts/blocked-terms.mjs enable|disable "palabra"

import { readFileSync } from "node:fs"
import pg from "pg"

for (const file of [".env", ".env.local"]) {
  try {
    for (const line of readFileSync(file, "utf8").split("\n")) {
      const match = /^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/.exec(line)
      if (match && !process.env[match[1]]) {
        process.env[match[1]] = match[2].replace(/^["']|["']$/g, "")
      }
    }
  } catch {
    // sin archivo, seguimos
  }
}

if (!process.env.DATABASE_URL) {
  console.error("Falta DATABASE_URL (en el entorno o en .env.local).")
  process.exit(1)
}

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

const [command, ...args] = process.argv.slice(2)
const terms = args.filter((a) => !a.startsWith("--")).map((t) => t.trim()).filter(Boolean)

async function main() {
  await client.connect()
  await client.query(`
    CREATE TABLE IF NOT EXISTS blocked_terms (
      id serial PRIMARY KEY,
      term text NOT NULL,
      kind text NOT NULL DEFAULT 'block' CHECK (kind IN ('block', 'allow')),
      enabled boolean NOT NULL DEFAULT true,
      created_at timestamptz NOT NULL DEFAULT now(),
      UNIQUE (term, kind)
    )
  `)

  if (command === "list") {
    const { rows } = await client.query(
      "SELECT term, kind, enabled FROM blocked_terms ORDER BY kind, term"
    )
    if (!rows.length) console.log("(sin términos)")
    for (const row of rows) {
      console.log(`${row.enabled ? " " : "-"} [${row.kind}] ${row.term}`)
    }
    return
  }

  if (!terms.length) throw new Error("Indica al menos un término.")

  if (command === "add" || command === "allow") {
    const kind = command === "add" ? "block" : "allow"
    for (const term of terms) {
      await client.query(
        `INSERT INTO blocked_terms (term, kind) VALUES ($1, $2)
         ON CONFLICT (term, kind) DO UPDATE SET enabled = true`,
        [term, kind]
      )
    }
    console.log(`${terms.length} término(s) registrados como "${kind}".`)
    return
  }

  if (command === "remove") {
    const { rowCount } = await client.query(
      "DELETE FROM blocked_terms WHERE term = ANY($1)",
      [terms]
    )
    console.log(`${rowCount} término(s) eliminados.`)
    return
  }

  if (command === "enable" || command === "disable") {
    const { rowCount } = await client.query(
      "UPDATE blocked_terms SET enabled = $1 WHERE term = ANY($2)",
      [command === "enable", terms]
    )
    console.log(`${rowCount} término(s) ${command === "enable" ? "activados" : "desactivados"}.`)
    return
  }

  throw new Error(`Comando desconocido: ${command}`)
}

main()
  .then(() => console.log("Listo. El filtro refresca en ≤60s."))
  .catch((error) => {
    console.error(error.message)
    process.exitCode = 1
  })
  .finally(() => client.end())
