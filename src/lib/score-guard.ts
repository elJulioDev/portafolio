import { createHmac, randomBytes, timingSafeEqual } from "node:crypto"

// Clave fuera del código (variables de entorno).
const KEY = process.env.SCORE_TOKEN_SECRET ?? process.env.DATABASE_URL ?? ""

// Parámetros reales del juego para acotar el puntaje máximo teórico.
const START_SPEED = 5.5
const MAX_SPEED = 13
const SPEED_PER_SECOND = 0.06 // aceleración de la velocidad
const RATE = 1.68 // puntos por segundo por unidad de velocidad
const TOLERANCE = 1.15
const MIN_SECONDS = 3

export const MAX_SESSION_AGE_MS = 6 * 60 * 60 * 1000

export function createSessionToken(): string {
  const iat = Date.now()
  const nonce = randomBytes(9).toString("hex")
  const payload = `${iat}.${nonce}`
  const sig = createHmac("sha256", KEY).update(payload).digest("hex")
  return `${payload}.${sig}`
}

export function readSessionToken(token: unknown): { iat: number } | null {
  if (typeof token !== "string") return null
  const parts = token.split(".")
  if (parts.length !== 3) return null

  const [iatStr, nonce, sig] = parts
  const expected = createHmac("sha256", KEY)
    .update(`${iatStr}.${nonce}`)
    .digest("hex")

  const a = Buffer.from(sig, "hex")
  const b = Buffer.from(expected, "hex")
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null

  const iat = Number(iatStr)
  if (!Number.isFinite(iat)) return null
  return { iat }
}

// Puntaje máximo teórico para una duración dada, integrando la aceleración.
export function maxScoreForDuration(seconds: number): number {
  const tToMax = (MAX_SPEED - START_SPEED) / SPEED_PER_SECOND
  if (seconds <= tToMax) {
    return (
      RATE * (START_SPEED * seconds + 0.5 * SPEED_PER_SECOND * seconds * seconds)
    )
  }
  const atMax =
    RATE * (START_SPEED * tToMax + 0.5 * SPEED_PER_SECOND * tToMax * tToMax)
  return atMax + RATE * MAX_SPEED * (seconds - tToMax)
}

export function isPlausibleScore(score: number, seconds: number): boolean {
  if (!Number.isFinite(seconds) || seconds < MIN_SECONDS) return false
  if (!Number.isFinite(score) || score < 0) return false
  return score <= maxScoreForDuration(seconds) * TOLERANCE
}
