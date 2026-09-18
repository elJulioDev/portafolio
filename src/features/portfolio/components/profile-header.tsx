"use client"

import Image from "next/image"
import { useCallback, useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"
import { FlipSentences } from "./flip-sentences"
import { USER } from "../data/user"

// Posición inicial de las nubes en CSS (porcentaje del contenedor) para que la
// escena de inicio se pinte completa desde el primer render, sin esperar al JS.
const CLOUD_START = [
  { left: "50%", top: 20 },
  { left: "90%", top: 35 },
  { left: "140%", top: 25 },
] as const

// --- Cielo local del banner ---
const SKY_LIGHT = "#fafafa" // zinc-50
const SKY_DARK = "#09090b" // zinc-950
const SKY_TEXT_LIGHT = "#71717a" // zinc-500
const SKY_TEXT_DARK = "#a1a1aa" // zinc-400

// --- Sprites del dinosaurio ---
// Dos variantes de la misma hoja: la normal y la de cumpleaños (con gorro de
// fiesta). La de cumpleaños solo se usa el 8 de septiembre.
type SpritePos = { x: number; y: number }

interface DinoSheet {
  src: string
  width: number
  height: number
  idle: SpritePos
  jump: SpritePos
  run: [SpritePos, SpritePos]
  duck: [SpritePos, SpritePos]
  dead: SpritePos
}

const DINO_SHEET_NORMAL: DinoSheet = {
  src: "/images/dino/dinospritesheet.webp",
  width: 61,
  height: 49,
  idle: { x: 0, y: 0 },
  jump: { x: 0, y: 0 },
  run: [
    { x: 122, y: 0 },
    { x: 0, y: 49 },
  ],
  duck: [
    { x: 61, y: 98 },
    { x: 122, y: 98 },
  ],
  dead: { x: 61, y: 49 },
}

// Hoja de cumpleaños (183×195, frames de 61×65). El cuerpo queda desplazado
// hacia abajo respecto a la hoja normal porque el gorro ocupa la parte alta
// del frame; los pies siguen apoyados al fondo.
const DINO_SHEET_BIRTHDAY: DinoSheet = {
  src: "/images/dino/dinospritesheet_bd.webp",
  width: 61,
  height: 65,
  idle: { x: 0, y: 65 },
  jump: { x: 0, y: 65 },
  run: [
    { x: 0, y: 0 },
    { x: 122, y: 0 },
  ],
  duck: [
    { x: 122, y: 65 },
    { x: 0, y: 130 },
  ],
  dead: { x: 61, y: 0 },
}

// Hitbox base, definida para un frame de 49px de alto (y=0 = arriba del frame).
// Para la hoja de cumpleaños se le suma la diferencia de altura (65 - 49 = 16),
// de modo que la hitbox en coordenadas de mundo es exactamente la misma.
const DINO_BASE_HEIGHT = 49
const DINO_BASE_HITBOX = {
  stand: { x: 20, y: 7, w: 22, h: 35 },
  duck: { x: 10, y: 24, w: 35, h: 20 },
}

// Hitboxes de los 10 sprites de cactus, relativas al frame (77×52).
type Hitbox = { x: number; y: number; w: number; h: number }
const CACTUS_HITBOXES: Hitbox[] = [
  { x: 24, y: 1, w: 31, h: 51 },
  { x: 25, y: 0, w: 27, h: 52 },
  { x: 26, y: -1, w: 25, h: 52 },
  { x: 0, y: 1, w: 78, h: 52 },
  { x: 29, y: 13, w: 19, h: 39 },
  { x: 28, y: 14, w: 21, h: 38 },
  { x: 30, y: 15, w: 17, h: 36 },
  { x: 30, y: 15, w: 18, h: 38 },
  { x: 30, y: 15, w: 18, h: 36 },
  { x: 30, y: 15, w: 18, h: 36 },
]

// Sprites que conviene decodificar antes de jugar para evitar tirones en el
// primer frame (sobre todo en gama baja).
const DINO_IMAGE_URLS = [
  "/images/dino/dinospritesheet.webp",
  "/images/dino/dinospritesheet_bd.webp",
  "/images/dino/cactusspritesheet.webp",
  "/images/dino/cloud.webp",
  "/images/dino/ground.webp",
]

// Fecha del dino de cumpleaños (mes 1-12 / día).
const BIRTHDAY_DINO_MONTH = 9
const BIRTHDAY_DINO_DAY = 8
// Mientras se prueba la variante se fuerza siempre. Poner en `false` para
// volver a mostrarla únicamente el 8 de septiembre.
const FORCE_BIRTHDAY_DINO = false

const isBirthdayDino = () => {
  if (FORCE_BIRTHDAY_DINO) return true
  const now = new Date()
  return (
    now.getMonth() + 1 === BIRTHDAY_DINO_MONTH &&
    now.getDate() === BIRTHDAY_DINO_DAY
  )
}

const bgPosStyle = (p: SpritePos) => `-${p.x}px -${p.y}px`

// --- Dificultad del juego ---
// Velocidad tope: evita que la partida se vuelva imposible con el tiempo.
const START_SPEED = 5.5
const MAX_SPEED = 13
// Pool de cactus: cada elemento es UN sprite de la sheet.
const MAX_CACTI = 9

// Ancho del tile del suelo (ground.webp = 1200px). El suelo se desplaza con
// `transform` (compositor) en vez de `background-position` (repaint) y se
// extiende un tile extra para que nunca se vea un hueco al desplazarse.
const GROUND_TILE = 1200

// Los 10 sprites de la sheet (77×52, 2 filas). `width`/`pad` describen la parte
// opaca de cada uno y deben coincidir con sus hitboxes de CACTUS_HITBOXES.
const CACTUS_SPRITES: { frameX: number; frameY: number; width: number; pad: number }[] = [
  { frameX: 0, frameY: 0, width: 25, pad: 26 }, // grande
  { frameX: 77, frameY: 0, width: 24, pad: 26 }, // grande
  { frameX: 154, frameY: 0, width: 25, pad: 26 }, // grande
  { frameX: 231, frameY: 0, width: 75, pad: 1 }, // el más ancho (frame 4)
  { frameX: 308, frameY: 0, width: 17, pad: 30 }, // pequeño
  { frameX: 0, frameY: 52, width: 17, pad: 30 }, // pequeño
  { frameX: 77, frameY: 52, width: 17, pad: 30 }, // pequeño
  { frameX: 154, frameY: 52, width: 17, pad: 30 }, // pequeño
  { frameX: 231, frameY: 52, width: 17, pad: 30 }, // pequeño
  { frameX: 308, frameY: 52, width: 17, pad: 30 }, // pequeño
]

// --- Pterodáctilo ---
// 2 frames de animación en la tercera fila de la misma spritesheet (y=104).
const PTERO_SPRITES = [
  { frameX: 0, frameY: 104, width: 77, pad: 0 },
  { frameX: 77, frameY: 104, width: 77, pad: 0 },
]

// Hitboxes relativas al frame (77×52).
const PTERO_HITBOXES = [
  { x: 18, y: 15, w: 40, h: 23 },
  { x: 20, y: 16, w: 40, h: 23 },
]

// Dos alturas posibles del pterodáctilo:
// "ground" = bajo, a la altura del cuerpo del dino → se salta.
// "high"   = a la altura de la cabeza → obliga a agacharse.
const PTERO_HEIGHTS = ["ground", "high"] as const
type PteroHeight = (typeof PTERO_HEIGHTS)[number]

// Offset vertical (px) que se suma a `bottom` del sprite según la altura.
const PTERO_Y_OFFSET: Record<PteroHeight, number> = {
  ground: 0,
  high: 30,
}

// Nº máximo de cactus/pterodáctilos visibles a la vez.
// En móvil se limita siempre a 1: la pantalla es estrecha y solo hay salto,
// así que dos obstáculos juntos serían injustos.
const maxVisibleCacti = (speed: number, isMobile: boolean) =>
  isMobile ? 1 : speed < 6.5 ? 1 : 2

const pickCactusSprite = () =>
  CACTUS_SPRITES[Math.floor(Math.random() * CACTUS_SPRITES.length)]

// Probabilidad de que aparezca un pterodáctilo en vez de un cactus.
const PTERO_SPAWN_CHANCE = 0.15
// Puntuación mínima para que empiecen a aparecer pterodáctilos.
const PTERO_MIN_SCORE = 200

interface Cactus {
  x: number
  frameX: number
  frameY: number
  width: number
  pad: number
  active: boolean
  // Tipo: "cactus" por defecto, "ptero" si es un pterodáctilo.
  type: "cactus" | "ptero"
  // Campos exclusivos del pterodáctilo (ignorados si type === "cactus").
  pteroFrame: number    // 0 o 1 (alterna para animación de vuelo)
  pteroAnimFrame: number
  pteroHeight: PteroHeight
}

export function ProfileHeader({ topScore: initialTopScore = 0 }: { topScore?: number }) {
  const { resolvedTheme } = useTheme()
  const themeStateRef = useRef(resolvedTheme)

  // Mantenemos sincronizado el tema de la web sin re-crear el game loop.
  useEffect(() => {
    themeStateRef.current = resolvedTheme
  }, [resolvedTheme])

  const [showOverlay, setShowOverlay] = useState<'START' | 'PLAYING' | 'GAME_OVER'>('START')

  // Variante del dinosaurio (normal o cumpleaños). Se guarda en un ref y se
  // resuelve en el cliente para no chocar con la fecha/hora del servidor
  // durante la hidratación. El JSX pinta siempre la hoja normal (SSR) y el
  // efecto de abajo la sustituye por la de cumpleaños cuando corresponde.
  const dinoSheetRef = useRef<DinoSheet>(DINO_SHEET_NORMAL)

  const containerRef = useRef<HTMLDivElement>(null)
  const dinoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sheet = isBirthdayDino() ? DINO_SHEET_BIRTHDAY : DINO_SHEET_NORMAL
    dinoSheetRef.current = sheet
    const el = dinoRef.current
    if (el) {
      el.style.width = `${sheet.width}px`
      el.style.height = `${sheet.height}px`
      el.style.backgroundImage = `url('${sheet.src}')`
      el.style.backgroundPosition = bgPosStyle(sheet.idle)
    }
  }, [])

  const cactusRefs = useRef<(HTMLDivElement | null)[]>([])
  const cloudRefs = useRef<(HTMLDivElement | null)[]>([])
  const groundRef = useRef<HTMLDivElement>(null)
  const scoreRef = useRef<HTMLDivElement>(null)
  const topScoreRef = useRef<HTMLSpanElement>(null)
  const hiScoreRef = useRef<HTMLSpanElement>(null)
  const reqRef = useRef<number>(0)
  const topScore = useRef(0)
  // Mejor puntaje local (por navegador), independiente del TOP global.
  const hiScore = useRef(0)
  const startedOnce = useRef(false)
  // Token de la partida en curso (lo emite el servidor al iniciar).
  const sessionRef = useRef<Promise<string | null> | null>(null)
  // Cielo local del banner: null = seguir el tema de la web (sin override).
  const skyDarkRef = useRef<boolean | null>(null)

  const gameLoopRef = useRef<(time: number) => void>(() => {})
  const startGameRef = useRef<() => void>(() => {})

  // Aplica el color de cielo al banner sin re-renderizar. Con `null` se quitan
  // los overrides y el banner vuelve al color del tema por defecto de la web.
  const applySky = useCallback((dark: boolean | null) => {
    skyDarkRef.current = dark
    const container = containerRef.current
    if (container) {
      container.style.backgroundColor =
        dark === null ? "" : dark ? SKY_DARK : SKY_LIGHT
    }
    const filter = dark === null ? "" : dark ? "invert(1)" : "none"
    cloudRefs.current.forEach((el) => {
      if (el) el.style.filter = filter
    })
    if (groundRef.current) groundRef.current.style.filter = filter
    const textColor =
      dark === null ? "" : dark ? SKY_TEXT_DARK : SKY_TEXT_LIGHT
    if (scoreRef.current) scoreRef.current.style.color = textColor
    if (topScoreRef.current) topScoreRef.current.style.color = textColor
    if (hiScoreRef.current) hiScoreRef.current.style.color = textColor
  }, [])

  const sfxJump = useRef<HTMLAudioElement | null>(null)
  const sfxDie = useRef<HTMLAudioElement | null>(null)
  const sfxPoint = useRef<HTMLAudioElement | null>(null)
  const resourcesLoaded = useRef(false)

  const loadResources = useCallback(() => {
    if (resourcesLoaded.current) return
    resourcesLoaded.current = true

    sfxJump.current = new Audio("/sounds/dino/jump.wav")
    sfxDie.current = new Audio("/sounds/dino/die.wav")
    sfxPoint.current = new Audio("/sounds/dino/point.wav")
    sfxJump.current.preload = "auto"
    sfxDie.current.preload = "auto"
    sfxPoint.current.preload = "auto"

    // Decodifica los sprites por adelantado. Sin esto, el primer frame de
    // partida puede dar un tirón mientras el navegador decodifica las imágenes.
    for (const url of DINO_IMAGE_URLS) {
      const img = new window.Image()
      img.src = url
      img.decode?.().catch(() => {
        // Si `decode` no está disponible o falla, no es crítico.
      })
    }
  }, [])

  const gameState = useRef({
    isPlaying: false,
    isGameOver: false,
    score: 0,
    speed: START_SPEED,
    groundX: 0,
    cacti: Array.from({ length: MAX_CACTI }, (): Cactus => ({
      x: -1000,
      frameX: 0,
      frameY: 0,
      width: 25,
      pad: 26,
      active: false,
      type: "cactus",
      pteroFrame: 0,
      pteroAnimFrame: 0,
      pteroHeight: "ground",
    })),
    clouds: [
      { x: 600, y: 20, speed: 2 },
      { x: 1100, y: 35, speed: 2.3 },
      { x: 1700, y: 25, speed: 2.6 }
    ],
    yPos: 0,
    yVelocity: 0,
    isJumping: false,
    isDucking: false,
    frame: 0,
    lastTime: 0,
    nextThemeScore: 700,
    nextPointScore: 100,
    scoreFlashUntil: 0,
    scoreFlashValue: 0,
    isVisible: false,
    // Métricas cacheadas: se actualizan al iniciar y al redimensionar, evitando
    // leer offsetWidth/innerWidth dentro del loop (evita forzar layout por frame).
    containerWidth: 800,
    isMobile: false,
    groundSpeedMul: 1,
    // En táctil no se puede agachar (no hay teclado): los pterodáctilos vuelan
    // siempre bajo para que la partida sea justa. Se detecta por tipo de puntero.
    noDuck: false,
    dinoX: 64,
    // El contenedor de cactus/dino se escala en móvil; `viewWidth` es el ancho
    // lógico visible (containerWidth / scale) para posicionarlos fuera de pantalla.
    scale: 1,
    viewWidth: 800,
    // --- Cachés para evitar escrituras/lecturas redundantes en el loop ---
    // Último entero de puntuación pintado (evita formatear cada frame).
    displayedScore: 0,
    // Último `background-position` y `translateY` del dino escritos.
    lastDinoBg: "",
    lastDinoY: Number.NaN,
    // Última X del suelo pintada (redondeada), para no reescribirla de más.
    lastGroundX: Number.NaN,
  })

  const GRAVITY = 0.6
  const JUMP_FORCE = 10
  // Caída rápida al mantener "abajo" en el aire: mucho más brusca que la normal.
  const FAST_FALL_GRAVITY = 4

  // Cachea las métricas del viewport/contenedor fuera del loop de render.
  const updateMetrics = useCallback(() => {
    const state = gameState.current
    state.containerWidth = containerRef.current?.offsetWidth || 800
    state.isMobile = window.innerWidth < 640
    // En móvil el mundo se mueve un poco más lento (pantalla estrecha y solo hay
    // salto). La reducción es mínima: el `scale` de 0.65 ya reduce la velocidad
    // visual, así que 0.9 evita que la partida se sienta lenta frente a PC.
    state.groundSpeedMul = state.isMobile ? 0.9 : 1
    state.dinoX = state.isMobile ? 32 : 64
    state.scale = state.isMobile ? 0.65 : 1
    state.viewWidth = state.containerWidth / state.scale
    // Puntero táctil = sin teclado para agacharse.
    state.noDuck = window.matchMedia("(hover: none) and (pointer: coarse)").matches

    // El suelo se anima con `transform`, así que debe sobresalir un tile completo
    // por la derecha para que nunca se vea un hueco (en lógico: viewWidth + 1200).
    const groundEl = groundRef.current
    if (groundEl) {
      groundEl.style.width = `${state.viewWidth + GROUND_TILE}px`
      groundEl.style.willChange = "transform"
    }
  }, [])

  // Deja el pool de cactus listo. En la escena de inicio el primero queda
  // visible (decorativo); el resto se va generando según el cupo en pantalla.
  const resetCacti = useCallback((visibleFirst: boolean) => {
    const state = gameState.current
    const viewWidth = state.containerWidth / state.scale

    return Array.from({ length: MAX_CACTI }, (_, i): Cactus => {
      const visible = visibleFirst && i === 0
      return {
        x: visible ? viewWidth * 0.72 : -1000,
        frameX: 0,
        frameY: 0,
        width: 25,
        pad: 26,
        active: visible,
        type: "cactus",
        pteroFrame: 0,
        pteroAnimFrame: 0,
        pteroHeight: "ground",
      }
    })
  }, [])

  const applyCacti = useCallback(
    (cacti: Cactus[]) => {
      cacti.forEach((cactus, i) => {
        const el = cactusRefs.current[i]
        if (el) {
          // Los cactus aparcados se ocultan: así el compositor no reserva/renderiza
          // capas que están fuera de pantalla (en móvil se nota).
          el.style.visibility = cactus.active ? "visible" : "hidden"
          el.style.left = "0px"
          el.style.transform = `translate3d(${cactus.x}px, 0, 0)`
          el.style.backgroundPosition = `-${cactus.frameX}px -${cactus.frameY}px`
          // Pterodáctilo: offset vertical según su altura de vuelo.
          if (cactus.type === "ptero") {
            el.style.bottom = `${-8 + PTERO_Y_OFFSET[cactus.pteroHeight]}px`
          } else {
            el.style.bottom = "-8px"
          }
        }
      })
    },
    []
  )

  const spawnClouds = useCallback(() => {
    const w = gameState.current.containerWidth
    return [
      { x: w * 0.5, y: 20, speed: 2 },
      { x: w * 0.9, y: 35, speed: 2.3 },
      { x: w * 1.4, y: 25, speed: 2.6 },
    ]
  }, [])

  const applyClouds = useCallback(
    (clouds: { x: number; y: number; speed: number }[]) => {
      clouds.forEach((cloud, i) => {
        const el = cloudRefs.current[i]
        if (el) {
          el.style.left = "0px"
          el.style.top = `${cloud.y}px`
          el.style.transform = `translate3d(${cloud.x}px, 0, 0)`
        }
      })
    },
    []
  )

  gameLoopRef.current = (time: number) => {
    const state = gameState.current
    const dinoSheet = dinoSheetRef.current

    if (!state.isVisible) {
      // Pausa total: el IntersectionObserver reanuda el loop al volver a ser visible.
      return
    }

    if (!state.isPlaying) return

    const delta = time - state.lastTime
    state.lastTime = time

    if (delta > 200) {
      reqRef.current = requestAnimationFrame(gameLoopRef.current)
      return
    }

    // safeDelta asegura que si React causa un micro-lag al re-renderizar el tema,
    // el juego no aplique físicas exageradas en ese frame. (Max ~2 frames)
    // Se acota a >= 0 porque al reanudar el loop el timestamp de rAF puede ser
    // anterior a `lastTime` y un delta negativo restaría puntuación/física.
    const safeDelta = Math.max(0, Math.min(delta, 33))
    const timeScale = safeDelta / 16.66
    
    const containerWidth = state.containerWidth

    // Puntuación
    state.score += 0.14 * (state.speed / 5) * timeScale
    const scoreEl = scoreRef.current
    if (scoreEl) {
      if (state.scoreFlashUntil > time) {
        // Parpadeo del hito: escribe solo cuando cambia el estado de parpadeo.
        const opacity = Math.floor(time / 100) % 2 === 0 ? "1" : "0.2"
        if (scoreEl.style.opacity !== opacity) scoreEl.style.opacity = opacity
        const flashText = state.scoreFlashValue.toString().padStart(5, "0")
        if (scoreEl.textContent !== flashText) scoreEl.textContent = flashText
      } else {
        if (scoreEl.style.opacity !== "1") scoreEl.style.opacity = "1"
        // Solo formatea/actualiza cuando cambia el entero. Antes se leía
        // `innerText` cada frame, lo que fuerza layout (reflow) en cada tick.
        const scoreInt = Math.floor(state.score)
        if (scoreInt !== state.displayedScore) {
          state.displayedScore = scoreInt
          scoreEl.textContent = scoreInt.toString().padStart(5, "0")
        }
      }
    }

    // Puntuación milestone
    if (state.score >= state.nextPointScore) {
      sfxPoint.current?.play()
      state.scoreFlashUntil = time + 1500
      state.scoreFlashValue = state.nextPointScore
      state.nextPointScore += 100
    }

    // CAMBIO DE CIELO — solo el fondo del banner (día/noche), no el tema web.
    if (state.score >= state.nextThemeScore) {
      const siteDark = themeStateRef.current === "dark"
      applySky(!(skyDarkRef.current ?? siteDark))
      state.nextThemeScore += 700
    }

    // Velocidad y fondo — con tope para que no se vuelva imposible.
    state.speed = Math.min(MAX_SPEED, state.speed + 0.001 * timeScale)
    const moveAmount = state.speed * timeScale * state.groundSpeedMul

    // Mantenemos groundX siempre en (-1200, 0] para que nunca crezca sin límite
    state.groundX -= moveAmount
    if (state.groundX <= -GROUND_TILE) {
      state.groundX += GROUND_TILE
    }

    // Suelo infinito: `background-repeat: repeat-x` sobre un elemento que cubre
    // el ancho visible + un tile extra, desplazado con `transform` (capa GPU).
    // Antes se movía con `background-position-x`, lo que forzaba un repaint del
    // ancho completo en cada frame (carísimo en móvil, sobre todo con `invert`).
    // El patrón empalma sin huecos porque se mantiene en (-1200, 0] y sobra un
    // tile por la derecha.
    const groundX = Math.round(state.groundX)
    if (groundRef.current && groundX !== state.lastGroundX) {
      state.lastGroundX = groundX
      groundRef.current.style.transform = `translate3d(${groundX}px, 0, 0)`
    }

    // Nubes — se mueven más lento que el suelo
    const clouds = state.clouds
    for (let i = 0; i < clouds.length; i++) {
      const cloud = clouds[i]
      cloud.x -= cloud.speed * timeScale
      if (cloud.x < -120) {
        let maxX = -Infinity
        for (let j = 0; j < clouds.length; j++) {
          if (clouds[j].x > maxX) maxX = clouds[j].x
        }
        cloud.x = Math.max(containerWidth, maxX) + 200 + Math.random() * 400
        cloud.y = state.isMobile ? 15 + Math.random() * 25 : 30 + Math.random() * 35
        cloud.speed = 2 + Math.random() * 0.8
        const cloudEl = cloudRefs.current[i]
        if (cloudEl) cloudEl.style.top = `${cloud.y}px`
      }
      const cloudEl = cloudRefs.current[i]
      if (cloudEl) cloudEl.style.transform = `translate3d(${cloud.x}px, 0, 0)`
    }

    // Hitbox del dinosaurio — y=0 es la parte superior del frame.
    const dinoX = state.dinoX
    // El sprite está anclado con `bottom: -6px`, así que su parte superior está
    // en `-6 + altura del frame`. La hitbox base está definida para un frame de
    // 49px; en la hoja de cumpleaños (65px) el cuerpo baja 16px, así que se
    // compensa con `heightDelta` y la hitbox de mundo no cambia.
    const dinoSpriteTop = -6 + dinoSheet.height + state.yPos
    const heightDelta = dinoSheet.height - DINO_BASE_HEIGHT
    const baseHB = state.isDucking ? DINO_BASE_HITBOX.duck : DINO_BASE_HITBOX.stand
    // Números en crudo (sin crear objetos) para no generar basura cada frame.
    const dinoHBx = dinoX + baseHB.x
    const dinoHBw = baseHB.w
    const dinoHBh = baseHB.h
    const dinoHBy = dinoSpriteTop - (baseHB.y + heightDelta) - dinoHBh
    const dinoHBr = dinoHBx + dinoHBw
    const dinoHBt = dinoHBy + dinoHBh
    let hit = false

    // 1) Mover los cactus/pterodáctilos activos y aparcar los que salen de pantalla.
    //    Los pterodáctilos se mueven un 10% más rápido y se animan.
    //    En móvil se alarga el recorrido fuera de pantalla antes de reaparecer,
    //    lo que añade una pausa extra entre obstáculos.
    const despawnX = state.isMobile ? -200 : -100
    let activeCount = 0
    let rightmost: Cactus | null = null

    for (let i = 0; i < state.cacti.length; i++) {
      const cactus = state.cacti[i]
      if (!cactus.active) continue

      // Velocidad: el obstáculo se mueve con el mundo, así que comparte el mismo
      // multiplicador que el suelo (antes no lo aplicaba y en móvil se veía más
      // rápido que el suelo). El pterodáctilo va un 10% más rápido.
      const speedMul = cactus.type === "ptero" ? 1.1 : 1
      cactus.x -= state.speed * timeScale * speedMul * state.groundSpeedMul

      if (cactus.x < despawnX) {
        cactus.active = false
        cactus.x = -1000
        cactus.type = "cactus"
        const parkEl = cactusRefs.current[i]
        if (parkEl) {
          parkEl.style.visibility = "hidden"
          parkEl.style.transform = "translate3d(-1000px, 0, 0)"
          parkEl.style.bottom = "-8px"
        }
        continue
      }

      activeCount++
      if (!rightmost || cactus.x > rightmost.x) rightmost = cactus

      const el = cactusRefs.current[i]
      if (el) el.style.transform = `translate3d(${cactus.x}px, 0, 0)`

      // Animación del pterodáctilo: alterna frame 0 y 1 cada ~12 frames.
      if (cactus.type === "ptero") {
        cactus.pteroAnimFrame += 1 * timeScale
        if (cactus.pteroAnimFrame >= 12) {
          cactus.pteroAnimFrame = 0
          cactus.pteroFrame = cactus.pteroFrame === 0 ? 1 : 0
          const sprite = PTERO_SPRITES[cactus.pteroFrame]
          if (el) el.style.backgroundPosition = `-${sprite.frameX}px -${sprite.frameY}px`
        }
      }

      // Hitbox — relativo al frame (77×52), y=0 arriba del sprite.
      // El sprite y la hitbox se mueven juntos: el mismo offset vertical se
      // aplica al CSS `bottom` del sprite y al cálculo de la hitbox.
      let hb: { x: number; y: number; w: number; h: number }
      let spriteBottom: number

      if (cactus.type === "ptero") {
        hb = PTERO_HITBOXES[cactus.pteroFrame]
        spriteBottom = -8 + PTERO_Y_OFFSET[cactus.pteroHeight]
      } else {
        const frameIdx =
          Math.floor(cactus.frameX / 77) + Math.floor(cactus.frameY / 52) * 5
        hb = CACTUS_HITBOXES[frameIdx]
        spriteBottom = -8
      }

      const spriteTop = spriteBottom + 52
      const obsX = cactus.x + hb.x
      const obsW = hb.w
      const obsH = hb.h
      const obsY = spriteTop - hb.y - obsH

      // AABB — ambos en world coords (y crece hacia arriba)
      if (
        dinoHBx < obsX + obsW &&
        dinoHBr > obsX &&
        dinoHBy < obsY + obsH &&
        dinoHBt > obsY
      ) {
        hit = true
      }
    }

    // 2) Generar el siguiente obstáculo (cactus o pterodáctilo) solo si hay
    //    cupo en pantalla: al inicio 1, luego 2 (en móvil siempre 1).
    const maxVisible = maxVisibleCacti(state.speed, state.isMobile)
    let spawnGuard = 0
    while (spawnGuard++ < MAX_CACTI) {
      if (activeCount >= maxVisible) break

      // Decidir si es cactus o pterodáctilo.
      const isPtero =
        state.score >= PTERO_MIN_SCORE &&
        Math.random() < PTERO_SPAWN_CHANCE

      const sprite = isPtero
        ? PTERO_SPRITES[0]
        : pickCactusSprite()

      // Separación pensada para que quepan ~`maxVisible` obstáculos a la vez.
      // Con `maxVisible === 1` el obstáculo anterior debe salir de pantalla
      // (ver `despawnX`) antes de generar el siguiente.
      const base =
        maxVisible <= 1
          ? state.viewWidth + 80
          : state.viewWidth / maxVisible - sprite.width
      const gap = Math.round(base * 1.1 * (1 + Math.random() * 0.15))

      if (rightmost) {
        const prevRight = rightmost.x + rightmost.pad + rightmost.width
        if (prevRight + gap > state.viewWidth + sprite.width) break
      }

      const parkIndex = state.cacti.findIndex((c) => !c.active)
      if (parkIndex === -1) break

      const cactus = state.cacti[parkIndex]
      const x = state.viewWidth + sprite.width - sprite.pad

      cactus.active = true
      cactus.x = x
      cactus.width = sprite.width
      cactus.pad = sprite.pad

      if (isPtero) {
        // Sin agacharse disponible (táctil), el pterodáctilo siempre vuela bajo
        // (saltable), nunca a la altura de la cabeza.
        const height = state.noDuck
          ? "ground"
          : PTERO_HEIGHTS[Math.floor(Math.random() * PTERO_HEIGHTS.length)]
        cactus.type = "ptero"
        cactus.pteroFrame = 0
        cactus.pteroAnimFrame = 0
        cactus.pteroHeight = height
        cactus.frameX = sprite.frameX
        cactus.frameY = sprite.frameY
      } else {
        cactus.type = "cactus"
        cactus.frameX = sprite.frameX
        cactus.frameY = sprite.frameY
        cactus.pteroFrame = 0
        cactus.pteroAnimFrame = 0
        cactus.pteroHeight = "ground"
      }

      const spawnEl = cactusRefs.current[parkIndex]
      if (spawnEl) {
        spawnEl.style.visibility = "visible"
        spawnEl.style.backgroundPosition = `-${sprite.frameX}px -${sprite.frameY}px`
        spawnEl.style.transform = `translate3d(${x}px, 0, 0)`
        if (isPtero) {
          spawnEl.style.bottom = `${-8 + PTERO_Y_OFFSET[cactus.pteroHeight]}px`
        } else {
          spawnEl.style.bottom = "-8px"
        }
      }

      rightmost = cactus
      activeCount++
    }

    if (hit) {
      state.isPlaying = false
      state.isGameOver = true
      if (reqRef.current) cancelAnimationFrame(reqRef.current)
      setShowOverlay('GAME_OVER')
      // Al morir, el cielo vuelve al color del tema por defecto de la web.
      applySky(null)
      sfxDie.current?.play()
      const finalScore = Math.floor(state.score)
      // Actualiza el TOP mostrado si superamos el máximo de la BD (el POST lo
      // persiste igualmente; esto evita esperar a un refetch).
      if (finalScore > topScore.current) {
        topScore.current = finalScore
        if (topScoreRef.current) {
          topScoreRef.current.textContent = `TOP ${finalScore.toString().padStart(5, '0')}`
        }
      }
      // Mejor puntaje local (HI) de este navegador.
      if (finalScore > hiScore.current) {
        hiScore.current = finalScore
        if (hiScoreRef.current) {
          hiScoreRef.current.textContent = `HI ${finalScore.toString().padStart(5, '0')}`
          hiScoreRef.current.style.display = "inline"
        }
        try {
          localStorage.setItem("dino_hi_score", String(finalScore))
        } catch {
          // localStorage puede no estar disponible; no es crítico.
        }
      }
      if (finalScore > 100) {
        const session = sessionRef.current ?? Promise.resolve(null)
        session.then((token) => {
          if (!token) return
          fetch("/api/scores", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ score: finalScore, token }),
          }).catch(() => {})
        })
      }
      if (dinoRef.current) {
        const deadBg = bgPosStyle(dinoSheet.dead)
        state.lastDinoBg = deadBg
        dinoRef.current.style.backgroundPosition = deadBg
      }
      return
    }

    // Físicas de Salto
    if (state.yPos > 0 || state.isJumping) {
      state.yPos += state.yVelocity * timeScale
      const currentGravity = state.isDucking ? FAST_FALL_GRAVITY : GRAVITY
      state.yVelocity -= currentGravity * timeScale

      if (state.yPos <= 0) {
        state.yPos = 0
        state.isJumping = false
        state.yVelocity = 0
      }
    }

    // Animación
    state.frame += 1 * timeScale
    // Índice 0/1 seguro: `state.frame` puede ser negativo o NaN en el primer
    // frame tras reanudar el loop, y `run[NaN]`/`run[-1]` sería `undefined`.
    const animIdx = Math.floor(state.frame / 8) % 2 === 0 ? 0 : 1
    let bgPos = bgPosStyle(dinoSheet.idle)

    if (state.yPos > 0) {
      bgPos = bgPosStyle(dinoSheet.jump)
    } else if (state.isDucking) {
      bgPos = bgPosStyle(dinoSheet.duck[animIdx])
    } else {
      bgPos = bgPosStyle(dinoSheet.run[animIdx])
    }

    const dinoEl = dinoRef.current
    if (dinoEl) {
      // `background-position` solo cambia cada 8 frames o al cambiar de estado;
      // se escribe únicamente cuando cambia.
      if (state.lastDinoBg !== bgPos) {
        state.lastDinoBg = bgPos
        dinoEl.style.backgroundPosition = bgPos
      }
      // `translateY` solo varía mientras el dino está en el aire.
      const dinoY = -state.yPos
      if (state.lastDinoY !== dinoY) {
        state.lastDinoY = dinoY
        dinoEl.style.transform = `translate3d(0, ${dinoY}px, 0)`
      }
    }

    reqRef.current = requestAnimationFrame(gameLoopRef.current)
  }

  startGameRef.current = () => {
    const dinoSheet = dinoSheetRef.current
    loadResources()
    updateMetrics()
    setShowOverlay('PLAYING')
    // Cada partida arranca con el cielo del tema por defecto de la web.
    applySky(null)

    // Solicita al servidor el token de esta partida (para validar al morir).
    sessionRef.current = fetch("/api/scores/session", { method: "POST" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) =>
        typeof data?.token === "string" ? (data.token as string) : null
      )
      .catch(() => null)

    const state = gameState.current
    const isRestart = startedOnce.current
    startedOnce.current = true

    // En la primera partida se conserva el patrón que ya estaba en pantalla; en
    // un reinicio se genera uno nuevo fuera de pantalla.
    const cacti = isRestart ? resetCacti(false) : state.cacti

    gameState.current = {
      ...state,
      isPlaying: true,
      isGameOver: false,
      score: 0,
      speed: START_SPEED,
      groundX: 0,
      cacti,
      clouds: spawnClouds(),
      yPos: 0,
      yVelocity: 0,
      isJumping: false,
      isDucking: false,
      frame: 0,
      lastTime: performance.now(),
      nextThemeScore: 700,
      nextPointScore: 100,
      scoreFlashUntil: 0,
      scoreFlashValue: 0,
      // Reinicia las cachés de pintado para forzar una primera escritura.
      displayedScore: 0,
      lastDinoBg: "",
      lastDinoY: Number.NaN,
      lastGroundX: Number.NaN,
    }

    const scoreEl = scoreRef.current
    if (scoreEl) {
      scoreEl.textContent = "00000"
      scoreEl.style.opacity = "1"
    }
    if (dinoRef.current) {
      const idleBg = bgPosStyle(dinoSheet.idle)
      gameState.current.lastDinoBg = idleBg
      dinoRef.current.style.backgroundPosition = idleBg
      // El suelo vuelve a 0 para que el siguiente frame lo repinte.
      gameState.current.lastGroundX = Number.NaN
    }

    applyCacti(gameState.current.cacti)
    applyClouds(gameState.current.clouds)
    
    if (reqRef.current) cancelAnimationFrame(reqRef.current)
    reqRef.current = requestAnimationFrame(gameLoopRef.current)
  }

  // Escena de inicio: deja un cactus y las nubes ya visibles para que al pulsar
  // "jugar" solo comience el movimiento (sin aparecer desde fuera de pantalla).
  useEffect(() => {
    updateMetrics()
    const state = gameState.current
    state.cacti = resetCacti(true)
    applyCacti(state.cacti)
    state.clouds = spawnClouds()
    applyClouds(state.clouds)
  }, [updateMetrics, resetCacti, applyCacti, spawnClouds, applyClouds])

  // Precarga audio + decodifica sprites al montar el banner, para evitar tirones
  // de descarga/decodificación en la primera partida (clave en gama baja).
  useEffect(() => {
    loadResources()
  }, [loadResources])

  // HI local: mejor puntaje guardado en este navegador.
  useEffect(() => {
    let stored = 0
    try {
      stored = Number(localStorage.getItem("dino_hi_score")) || 0
    } catch {
      stored = 0
    }
    if (stored > 0) {
      hiScore.current = stored
      if (hiScoreRef.current) {
        hiScoreRef.current.textContent = `HI ${stored.toString().padStart(5, '0')}`
        hiScoreRef.current.style.display = "inline"
      }
    }
  }, [])

  // TOP histórico: mayor puntaje recibido del servidor (ya viene cacheado).
  useEffect(() => {
    if (initialTopScore > 0) {
      topScore.current = initialTopScore
      if (topScoreRef.current) {
        topScoreRef.current.textContent = `TOP ${initialTopScore.toString().padStart(5, '0')}`
      }
    }
  }, [initialTopScore])

  useEffect(() => {
    // Ignora el teclado si el usuario está escribiendo o hay un diálogo abierto
    // (p. ej. el menú de búsqueda), o si el foco está en un elemento interactivo.
    const shouldIgnoreKeyboard = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      if (
        target?.closest?.(
          "input, textarea, select, button, a, [contenteditable='true']"
        )
      ) {
        return true
      }
      return document.querySelector('[role="dialog"]') !== null
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (shouldIgnoreKeyboard(event)) return
      const state = gameState.current
      if (!state.isVisible) return

      if (event.code === "Space" || event.code === "ArrowUp") {
        event.preventDefault()
        if (state.isGameOver || !state.isPlaying) {
          if (!event.repeat) startGameRef.current()
          return
        }
        if (state.yPos <= 0.5 && !state.isJumping) {
          state.isJumping = true
          state.yVelocity = JUMP_FORCE
          sfxJump.current?.play()
        }
      } else if (event.code === "ArrowDown") {
        if (state.isPlaying && !state.isGameOver) {
          event.preventDefault()
          state.isDucking = true
        }
      }
    }

    const onKeyUp = (event: KeyboardEvent) => {
      if (event.code === "ArrowDown") gameState.current.isDucking = false
    }

    // Los listeners se enganchan solo mientras el juego está a la vista para no
    // consumir recursos cuando el usuario está en otra parte de la página.
    let keyboardBound = false

    // En móvil el `resize` se dispara muchísimo (mostrar/ocultar la barra de
    // direcciones). Se agrupa en un frame para no recalcular métricas ni forzar
    // layout en cada evento.
    let resizeRaf = 0
    const onResize = () => {
      if (resizeRaf) return
      resizeRaf = requestAnimationFrame(() => {
        resizeRaf = 0
        updateMetrics()
      })
    }

    const bindKeyboard = () => {
      if (keyboardBound) return
      keyboardBound = true
      window.addEventListener("keydown", onKeyDown)
      window.addEventListener("keyup", onKeyUp)
      window.addEventListener("resize", onResize)
    }
    const unbindKeyboard = () => {
      if (!keyboardBound) return
      keyboardBound = false
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("keyup", onKeyUp)
      window.removeEventListener("resize", onResize)
      if (resizeRaf) {
        cancelAnimationFrame(resizeRaf)
        resizeRaf = 0
      }
      gameState.current.isDucking = false
    }

    const observer = new IntersectionObserver(([entry]) => {
      const state = gameState.current
      if (entry.isIntersecting) {
        if (!state.isVisible) {
          state.isVisible = true
          // Evita que el delta de tiempo se dispare al volver a ser visible
          state.lastTime = performance.now()
          updateMetrics()
          bindKeyboard()
          // Reanuda el loop si la partida seguía en curso y estaba pausada
          if (state.isPlaying) {
            if (reqRef.current) cancelAnimationFrame(reqRef.current)
            reqRef.current = requestAnimationFrame(gameLoopRef.current)
          }
        }
      } else if (state.isVisible) {
        state.isVisible = false
        unbindKeyboard()
      }
    }, { threshold: 0 })

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }
    return () => {
      observer.disconnect()
      unbindKeyboard()
      if (reqRef.current) cancelAnimationFrame(reqRef.current)
    }
  }, [updateMetrics])

  return (
    <>
      <div id="inicio" className="screen-line-bottom grid grid-cols-[auto_1fr] overflow-y-clip border-x screen-line-bottom-border after:z-1">
        
        <div ref={containerRef} className="relative col-span-2 w-full aspect-[2/1] sm:aspect-[3/1] sm:max-h-[280px] border-b border-line bg-zinc-50 dark:bg-zinc-950 overflow-hidden group" style={{ touchAction: 'manipulation', contain: 'content', transition: "background-color 700ms var(--expo-out)" }}>
          
          <div 
            className="absolute inset-0 z-50 cursor-pointer select-none flex flex-col items-center justify-center"
            onPointerDown={(e) => {
              e.preventDefault()
              const gs = gameState.current
              if (gs.isGameOver || !gs.isPlaying) {
                startGameRef.current()
              } else if (gs.yPos <= 0.5) {
                gs.isJumping = true
                gs.yVelocity = JUMP_FORCE
                sfxJump.current?.play()
              }
            }}
          >
            {showOverlay === 'START' && (
              <div className="bg-background/90 px-3 py-1.5 rounded-lg pointer-events-none animate-pulse">
                <span className="text-[10px] sm:text-xs font-medium tracking-widest text-foreground" style={{ fontFamily: 'var(--font-pixel, monospace)' }}>
                  CLICK PARA JUGAR
                </span>
              </div>
            )}
            {showOverlay === 'GAME_OVER' && (
              <div className="flex flex-col items-center gap-2 pointer-events-none">
                <div className="bg-background/90 px-3 py-1.5 rounded-lg">
                  <span className="text-[10px] sm:text-xs font-medium tracking-widest text-foreground" style={{ fontFamily: 'var(--font-pixel, monospace)' }}>
                    GAME OVER
                  </span>
                </div>
                <div className="bg-background/90 px-3 py-1.5 rounded-lg animate-pulse">
                  <span className="text-[9px] sm:text-[10px] font-medium tracking-widest text-muted-foreground" style={{ fontFamily: 'var(--font-pixel, monospace)' }}>
                    CLICK PARA REINICIAR
                  </span>
                </div>
              </div>
            )}
          </div>
          
          {/* TOP histórico (mayor puntaje en la base de datos), abajo a la derecha */}
          <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-8 z-30 text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-400 tracking-widest transition-colors duration-700" style={{ fontFamily: 'var(--font-pixel, monospace)' }}>
            <span ref={topScoreRef}>TOP 00000</span>
          </div>

          <div className="absolute top-4 right-4 sm:top-6 sm:right-8 z-30 flex gap-3 text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-400 tracking-widest transition-colors duration-700" style={{ fontFamily: 'var(--font-pixel, monospace)' }}>
            <span ref={hiScoreRef} className="hidden">HI 00000</span>
            <span ref={scoreRef}>00000</span>
          </div>

          {[0, 1, 2].map((i) => (
            <div
              key={`cloud-${i}`}
              ref={(el) => { if (el) cloudRefs.current[i] = el }}
              className="absolute z-0 dark:invert opacity-60 max-sm:w-10 max-sm:h-7 sm:w-24 sm:h-8"
              style={{
                backgroundImage: "url('/images/dino/cloud.webp')",
                backgroundRepeat: "no-repeat",
                backgroundSize: "contain",
                imageRendering: "pixelated",
                transition: "filter 700ms var(--expo-out)",
                // Posición inicial en CSS para pintar la escena completa de una.
                left: CLOUD_START[i].left,
                top: `${CLOUD_START[i].top}px`,
              }}
            />
          ))}

          <div className="absolute bottom-16 sm:bottom-24 left-0 w-full h-0">
            <div className="sm:scale-100 max-sm:scale-[0.65] max-sm:origin-bottom-left">
              {/* El suelo va dentro del mismo contenedor escalado que cactus/dino
                  para que en móvil escale igual (mismo tamaño y misma velocidad
                  aparente). El ancho `153.85%` compensa el `scale-[0.65]` en móvil
                  (= 1 / 0.65) para cubrir todo el ancho tras escalar. */}
              <div
                ref={groundRef}
                className="absolute top-[-10px] left-0 h-[22px] z-0 w-full max-sm:w-[153.85%] dark:invert opacity-80"
                style={{
                  backgroundImage: "url('/images/dino/ground.webp')",
                  backgroundRepeat: "repeat-x",
                  backgroundPosition: "0px top",
                  imageRendering: "pixelated",
                  transition: "filter 700ms var(--expo-out)",
                  // El ancho real lo fija `updateMetrics` (viewWidth + tile); la
                  // clase `w-full`/`w-[153.85%]` solo evita huecos antes del JS.
                  willChange: "transform",
                  backfaceVisibility: "hidden",
                }}
              />

              {/* El cactus 0 se posiciona con CSS (`left`) para que la escena se pinte
                  completa de una sola vez. En móvil 110.77% = 72% / 0.65 compensa el
                  `scale-[0.65]` del contenedor. */}
              {Array.from({ length: MAX_CACTI }, (_, i) => (
                <div 
                  key={i}
                  ref={(el) => {
                    if (el) cactusRefs.current[i] = el
                  }}
                  className={
                    i === 0
                      ? "absolute bottom-[-8px] left-[72%] z-10 max-sm:left-[110.77%]"
                      : "absolute bottom-[-8px] left-0 z-10"
                  }
                  style={{
                    width: "77px", 
                    height: "52px", 
                    backgroundImage: "url('/images/dino/cactusspritesheet.webp')",
                    backgroundRepeat: "no-repeat",
                    imageRendering: "pixelated",
                    // El cactus de inicio se posiciona con `left` (CSS) para que
                    // aparezca junto al dino y el suelo desde el primer pintado.
                    // Los del pool extendido arrancan aún más lejos.
                    transform:
                      i === 0
                        ? undefined
                        : i < 3
                          ? "translateX(1500px)"
                          : "translateX(4000px)",
                  }}
                />
              ))}

              <div 
                ref={dinoRef}
                className="absolute bottom-[-6px] left-8 sm:left-16 z-20"
                style={{
                  width: `${DINO_SHEET_NORMAL.width}px`,
                  height: `${DINO_SHEET_NORMAL.height}px`,
                  backgroundImage: `url('${DINO_SHEET_NORMAL.src}')`,
                  backgroundPosition: bgPosStyle(DINO_SHEET_NORMAL.idle),
                  backgroundRepeat: "no-repeat",
                  imageRendering: "pixelated",
                }}
              />
            </div>
          </div>
        </div>

        <div className="relative flex flex-col justify-end border-r border-line bg-background">
          <div className="relative z-30 -mt-10 sm:-mt-18 size-24 sm:size-36 shrink-0 rounded-full border-[3px] sm:border-4 border-background bg-background">
            <Image
              src={USER.avatar}
              alt={USER.displayName}
              fill
              sizes="(max-width: 640px) 96px, 160px"
              className="object-cover rounded-full inset-ring-1 inset-ring-foreground/10"
              priority
            />
          </div>
        </div>

        <div className="relative z-20 flex flex-col min-w-0 bg-background">
          <div className="flex items-center h-7 sm:h-9 pl-3 sm:pl-4 overflow-hidden gap-1.5">
            <h1 className="truncate text-lg sm:text-2xl font-medium tracking-tight leading-none">
              {USER.displayName}
            </h1>
            {/* Bandera de Chile */}
            <span
              className="shrink-0 text-sm sm:text-base leading-none"
              role="img"
              aria-label="Bandera de Chile"
            >
              🇨🇱
            </span>
          </div>
          <FlipSentences
            className="flex items-center h-7 sm:h-9 border-t border-line pl-3 sm:pl-4 font-mono text-xs sm:text-sm text-muted-foreground"
            sentences={USER.flipSentences}
            interval={5}
          />
        </div>
      </div>
    </>
  )
}