import { unstable_cache } from "next/cache"
import { pool } from "@/lib/db"

/**
 * Devuelve el mayor puntaje de la tabla `dino_scores`.
 *
 * Usa `unstable_cache` de Next.js para cachear el resultado 60 s en el
 * servidor. De esa forma, durante ese intervalo todas las peticiones
 * obtienen el valor sin tocar la base de datos.
 *
 * La query `ORDER BY score DESC LIMIT 1` es instantánea con un índice
 * btree en la columna `score`.
 */
export const getTopScore = unstable_cache(
  async (): Promise<number> => {
    try {
      const { rows } = await pool.query(
        "SELECT score FROM dino_scores ORDER BY score DESC LIMIT 1"
      )
      return Number(rows[0]?.score) || 0
    } catch {
      return 0
    }
  },
  ["dino-top-score"],
  { revalidate: 60, tags: ["scores"] }
)
