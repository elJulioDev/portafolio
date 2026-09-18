import { NextResponse } from "next/server"
import { pool } from "@/lib/db"
import { getRequestMeta } from "@/lib/request-meta"
import {
  MAX_SESSION_AGE_MS,
  isPlausibleScore,
  readSessionToken,
} from "@/lib/score-guard"

const MIN_SCORE = 100

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null)
    const score = body?.score
    const token = body?.token

    // Validaciones silenciosas: si algo no cuadra, no se guarda nada.
    if (
      typeof score !== "number" ||
      !Number.isFinite(score) ||
      score <= MIN_SCORE
    ) {
      return NextResponse.json({ ok: true })
    }

    const session = readSessionToken(token)
    if (!session) return NextResponse.json({ ok: true })

    const elapsedMs = Date.now() - session.iat
    if (elapsedMs <= 0 || elapsedMs > MAX_SESSION_AGE_MS) {
      return NextResponse.json({ ok: true })
    }
    if (!isPlausibleScore(Math.floor(score), elapsedMs / 1000)) {
      return NextResponse.json({ ok: true })
    }

    const meta = getRequestMeta(request.headers)

    const { rows } = await pool.query(
      "INSERT INTO dino_scores (score, ip, user_agent) VALUES ($1, $2, $3) RETURNING id, score, created_at",
      [Math.floor(score), meta.source, meta.agent]
    )

    return NextResponse.json(rows[0])
  } catch (error) {
    console.error("Error saving score:", error)
    return NextResponse.json({ error: "Failed to save score" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { rows } = await pool.query(
      "SELECT id, score, created_at FROM dino_scores ORDER BY score DESC LIMIT 10"
    )
    return NextResponse.json(rows)
  } catch (error) {
    console.error("Error fetching scores:", error)
    return NextResponse.json({ error: "Failed to fetch scores" }, { status: 500 })
  }
}
