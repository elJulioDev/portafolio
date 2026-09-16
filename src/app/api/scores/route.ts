import { NextResponse } from "next/server"
import { pool } from "@/lib/db"

const MIN_SCORE = 100

export async function POST(request: Request) {
  try {
    const { score, playerName } = await request.json()

    if (typeof score !== "number" || score <= MIN_SCORE) {
      return NextResponse.json({ error: "Score must be > 100" }, { status: 400 })
    }

    if (typeof playerName !== "string" || !playerName.trim()) {
      return NextResponse.json({ error: "playerName required" }, { status: 400 })
    }

    const { rows } = await pool.query(
      "INSERT INTO dino_scores (player_name, score) VALUES ($1, $2) RETURNING id, score, created_at",
      [playerName.trim(), Math.floor(score)]
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
      "SELECT id, player_name, score, created_at FROM dino_scores ORDER BY score DESC LIMIT 10"
    )
    return NextResponse.json(rows)
  } catch (error) {
    console.error("Error fetching scores:", error)
    return NextResponse.json({ error: "Failed to fetch scores" }, { status: 500 })
  }
}
