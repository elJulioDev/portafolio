import { NextResponse } from "next/server"

import { getMatcher, isProfane, isProfaneInAnyToken } from "@/lib/profanity-filter"
import { getRequestMeta } from "@/lib/request-meta"

// ponytail: límite en memoria por instancia (Vercel es efímero y multi-instancia).
// Suficiente para frenar floods simples; subir a Upstash/Redis si abusan de verdad.
const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 3
const hits = new Map<string, number[]>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent)
    return true
  }
  recent.push(now)
  hits.set(ip, recent)
  return false
}

// Valida el mensaje contra la lista de palabras de la BD. El envío real a
// Web3Forms lo hace el cliente: su plan gratuito no admite envíos desde servidor.
export async function POST(request: Request) {
  const data = await request.formData().catch(() => null)
  if (!data) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 })
  }

  // Honeypot: un humano no lo ve ni lo rellena.
  if (String(data.get("botcheck") ?? "").trim()) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 })
  }

  const nombre = String(data.get("nombre") ?? "").trim()
  const email = String(data.get("email") ?? "").trim()
  const mensaje = String(data.get("mensaje") ?? "").trim()

  if (
    nombre.length < 2 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    mensaje.length < 5 ||
    mensaje.length > 5000
  ) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 })
  }

  const matcher = await getMatcher()
  if (
    isProfane(matcher, mensaje) ||
    isProfaneInAnyToken(matcher, nombre) ||
    isProfaneInAnyToken(matcher, email)
  ) {
    return NextResponse.json({ ok: false, error: "vulgar" }, { status: 422 })
  }

  const { source } = getRequestMeta(request.headers)
  if (isRateLimited(source)) {
    return NextResponse.json({ ok: false, error: "rate" }, { status: 429 })
  }

  return NextResponse.json({ ok: true })
}
