// Motor de filtrado de lenguaje ofensivo, independiente de la base de datos.
// Los términos NO viven aquí: se cargan desde la tabla `blocked_terms` (ver
// `profanity-filter.ts`). Este módulo solo construye el matcher y lo aplica.

import {
  RegExpMatcher,
  collapseDuplicatesTransformer,
  parseRawPattern,
  remapCharactersTransformer,
  resolveLeetSpeakTransformer,
  toAsciiLowerCaseTransformer,
} from "obscenity"

export type TermKind = "block" | "allow"

export type Term = {
  term: string
  kind: TermKind
}

// Variantes acentuadas -> carácter base. La ñ se deja intacta ("coño" ≠ "cono").
const ACCENTS: Record<string, string> = {
  a: "áàäâã",
  e: "éèëê",
  i: "íìïî",
  o: "óòöôõ",
  u: "úùüû",
  c: "ç",
}

// Mapa inverso carácter -> base, para normalizar términos sin tocar la ñ.
const FOLD_MAP = new Map<string, string>()
for (const [base, variants] of Object.entries(ACCENTS)) {
  for (const variant of variants + variants.toUpperCase()) {
    FOLD_MAP.set(variant, base)
  }
}

// Normaliza un término con el mismo criterio que los transformers del matcher:
// sin acentos, minúsculas y sin letras repetidas.
export function fold(text: string): string {
  let out = ""
  for (const char of text) out += FOLD_MAP.get(char) ?? char
  return out
    .toLowerCase()
    .replace(/(.)\1+/g, "$1")
    .trim()
}

const rawPattern = (term: string) => escapePattern(fold(term))

function escapePattern(term: string): string {
  // Escapa los metacaracteres del mini-lenguaje de obscenity: \ ? [ ] |
  return term.replace(/[\\?[\]|]/g, (c) => `\\${c}`)
}

const ACCENT_TRANSFORMER = remapCharactersTransformer(
  Object.fromEntries(
    Object.entries(ACCENTS).map(([base, variants]) => [
      base,
      variants + variants.toUpperCase(),
    ])
  )
)

export function buildMatcher(terms: Term[]): RegExpMatcher {
  const blacklistedTerms = terms
    .filter((t) => t.kind === "block" && t.term.trim())
    .map((t, id) => ({
      id,
      // Los `|` aseguran límites de palabra (no marca "penetrar" por "pene").
      pattern: parseRawPattern(`|${rawPattern(t.term)}|`),
    }))

  const whitelistedTerms = terms
    .filter((t) => t.kind === "allow" && t.term.trim())
    .map((t) => fold(t.term))

  return new RegExpMatcher({
    blacklistedTerms,
    whitelistedTerms,
    blacklistMatcherTransformers: [
      resolveLeetSpeakTransformer(), // p3n3 -> pene
      ACCENT_TRANSFORMER, // maricón -> maricon
      toAsciiLowerCaseTransformer(),
      collapseDuplicatesTransformer(), // putaaaa -> puta
      // ponytail: sin resolveConfusablesTransformer (convierte ñ->n y rompería
      // "coño" vs "cono") y sin skipNonAlphabeticTransformer (falsos positivos).
      // Añadir solo si aparece esa evasión concreta.
    ],
    whitelistMatcherTransformers: [toAsciiLowerCaseTransformer()],
  })
}

export function isProfane(matcher: RegExpMatcher, text: string): boolean {
  return matcher.hasMatch(text)
}
