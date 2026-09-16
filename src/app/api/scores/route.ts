import { NextResponse } from "next/server"
import { pool } from "@/lib/db"

const MIN_SCORE = 100

export async function POST(request: Request) {
  try {
    const { score } = await request.json()

    if (typeof score !== "number" || score <= MIN_SCORE) {
      return NextResponse.json({ error: "Score must be > 100" }, { status: 400 })
    }

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || request.headers.get("x-real-ip")
      || "unknown"
    const userAgent = request.headers.get("user-agent") || "unknown"

    const { rows } = await pool.query(
      "INSERT INTO dino_scores (score, ip, user_agent) VALUES ($1, $2, $3) RETURNING id, score, created_at",
      [Math.floor(score), ip, userAgent]
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
      "SELECT id, score, ip, user_agent, created_at FROM dino_scores ORDER BY score DESC LIMIT 10"
    )
    return NextResponse.json(rows)
  } catch (error) {
    console.error("Error fetching scores:", error)
    return NextResponse.json({ error: "Failed to fetch scores" }, { status: 500 })
  }
}
