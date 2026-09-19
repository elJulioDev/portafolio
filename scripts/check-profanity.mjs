import assert from "node:assert"

import {
  buildMatcher,
  fold,
  isProfane,
  isProfaneInAnyToken,
} from "../src/lib/profanity.ts"

// Términos de prueba (los reales viven en la BD, no en el código).
const matcher = buildMatcher([
  { term: "pene", kind: "block" },
  { term: "puta", kind: "block" },
  { term: "maricón", kind: "block" },
  { term: "zorra", kind: "block" },
  { term: "pito", kind: "block" },
  { term: "coño", kind: "block" },
  { term: "pitón", kind: "allow" },
])

const blocked = [
  "pene grande o chico",
  "P3N3 grand3",
  "putaaaa",
  "maricon de mierda",
  "zorra",
  "coño",
]

assert.equal(isProfane(matcher, "pene grande o chico"), true)
assert.equal(isProfane(matcher, "P3N3 grand3"), true)
assert.equal(isProfane(matcher, "putaaaa"), true)
assert.equal(isProfane(matcher, "maricon de mierda"), true)
assert.equal(isProfane(matcher, "ZORRA"), true)
assert.equal(isProfane(matcher, "coño"), true)

// Sin falsos positivos.
assert.equal(isProfane(matcher, "Hola, quiero hablar de un proyecto"), false)
assert.equal(isProfane(matcher, "computacion y penetrar el mercado"), false)
assert.equal(isProfane(matcher, "Concha del mar"), false)
assert.equal(isProfane(matcher, "un pitón de escalada"), false)
assert.equal(isProfane(matcher, "vendo conos de helado"), false)
assert.equal(isProfane(matcher, "el año pasado"), false)

assert.equal(fold("Maricón"), "maricon")
assert.equal(fold("coño"), "coño") // la ñ se conserva
assert.equal(fold("putaaaa"), "puta")

// Correo / nombre: palabras pegadas por separadores.
assert.equal(isProfaneInAnyToken(matcher, "el.pene.grande@gmail.com"), true)
assert.equal(isProfaneInAnyToken(matcher, "puta@gmail.com"), true)
assert.equal(isProfaneInAnyToken(matcher, "puta96@hotmail.com"), true)
assert.equal(isProfaneInAnyToken(matcher, "Juan Pene"), true)
assert.equal(isProfaneInAnyToken(matcher, "penelope@gmail.com"), false)
assert.equal(isProfaneInAnyToken(matcher, "maria.concepcion@gmail.com"), false)
assert.equal(isProfaneInAnyToken(matcher, "juan.perez@gmail.com"), false)

console.log("profanity: ok", `(${blocked.length} casos bloqueados probados)`)
