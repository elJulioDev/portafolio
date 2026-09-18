// Utilidades internas de la solicitud.

const FALLBACK = "unknown"
const LOCAL =
  /^(::1$|fe80:|f[cd][0-9a-f]{2}:|127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.)/i

function tidy(value: string): string {
  let v = value.trim()
  if (!v) return ""

  if (v.startsWith("[")) {
    const end = v.indexOf("]")
    if (end !== -1) v = v.slice(1, end)
  }
  if (/^\d{1,3}(\.\d{1,3}){3}:\d+$/.test(v)) v = v.slice(0, v.lastIndexOf(":"))
  if (v.toLowerCase().startsWith("::ffff:")) v = v.slice(7)

  return v
}

export function getRequestMeta(headers: Headers) {
  const sources = [
    headers.get("x-forwarded-for"),
    headers.get("x-real-ip"),
    headers.get("x-vercel-forwarded-for"),
    headers.get("cf-connecting-ip"),
    headers.get("true-client-ip"),
    headers.get("x-client-ip"),
  ]

  const found: string[] = []
  for (const raw of sources) {
    if (!raw) continue
    for (const part of raw.split(",")) {
      const v = tidy(part)
      if (v && !found.includes(v)) found.push(v)
    }
  }

  return {
    // Valor real de la solicitud; se prefiere el primero no local.
    source: found.find((v) => !LOCAL.test(v)) ?? found[0] ?? FALLBACK,
    agent: (headers.get("user-agent") || FALLBACK).slice(0, 500),
  }
}
