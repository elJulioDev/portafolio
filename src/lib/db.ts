import { Pool } from "pg"

const globalForPg = globalThis as unknown as { pool: Pool }

export const pool =
  globalForPg.pool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  })

if (process.env.NODE_ENV !== "production") globalForPg.pool = pool

// Crea el índice en la columna score si no existe (una sola vez).
// `CONCURRENTLY` evita bloquear la tabla durante la creación.
pool
  .query(
    "CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_dino_scores_score_desc ON dino_scores (score DESC)"
  )
  .catch(() => {
    // Ignora errores silenciosamente (p. ej. si el índice ya existe o falta la tabla).
  })
