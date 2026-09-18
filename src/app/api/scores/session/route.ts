import { NextResponse } from "next/server"
import { createSessionToken } from "@/lib/score-guard"

export async function POST() {
  return NextResponse.json(
    { token: createSessionToken() },
    { headers: { "Cache-Control": "no-store" } }
  )
}
