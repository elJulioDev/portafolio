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

// --- Dificultad del juego ---
// Velocidad tope: evita que la partida se vuelva imposible con el tiempo.
const START_SPEED = 5.5
const MAX_SPEED = 13
// Pool de cactus: cada elemento es UN sprite de la sheet.
const MAX_CACTI = 9

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

// Nº máximo de cactus visibles a la vez: 1 al inicio (el siguiente aparece
// recién cuando el anterior salió de pantalla) y 2 cuando sube la velocidad.
const maxVisibleCacti = (speed: number) => (speed < 6.5 ? 1 : 2)

const pickCactusSprite = () =>
  CACTUS_SPRITES[Math.floor(Math.random() * CACTUS_SPRITES.length)]

interface Cactus {
  x: number
  frameX: number
  frameY: number
  width: number
  pad: number
  // Activo = está en juego (recorriendo la pantalla); si no, está aparcado.
  active: boolean
}

export function ProfileHeader({ topScore: initialTopScore = 0 }: { topScore?: number }) {
  const { resolvedTheme } = useTheme()
  const themeStateRef = useRef(resolvedTheme)

  // Mantenemos sincronizado el tema de la web sin re-crear el game loop.
  useEffect(() => {
    themeStateRef.current = resolvedTheme
  }, [resolvedTheme])

  const [showOverlay, setShowOverlay] = useState<'START' | 'PLAYING' | 'GAME_OVER'>('START')
  
  const containerRef = useRef<HTMLDivElement>(null)
  const dinoRef = useRef<HTMLDivElement>(null)
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

  const CACTUS_HITBOXES: { x: number, y: number, w: number, h: number }[] = [
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

  const loadResources = () => {
    if (resourcesLoaded.current) return
    resourcesLoaded.current = true

    sfxJump.current = new Audio("/sounds/dino/jump.wav")
    sfxDie.current = new Audio("/sounds/dino/die.wav")
    sfxPoint.current = new Audio("/sounds/dino/point.wav")
    sfxJump.current.preload = "auto"
    sfxDie.current.preload = "auto"
    sfxPoint.current.preload = "auto"
  }

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
    dinoX: 64,
    // El contenedor de cactus/dino se escala en móvil; `viewWidth` es el ancho
    // lógico visible (containerWidth / scale) para posicionarlos fuera de pantalla.
    scale: 1,
    viewWidth: 800,
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
    state.groundSpeedMul = state.isMobile ? 0.65 : 1
    state.dinoX = state.isMobile ? 32 : 64
    state.scale = state.isMobile ? 0.65 : 1
    state.viewWidth = state.containerWidth / state.scale
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
      }
    })
  }, [])

  const applyCacti = useCallback(
    (cacti: Cactus[]) => {
      cacti.forEach((cactus, i) => {
        const el = cactusRefs.current[i]
        if (el) {
          el.style.left = "0px"
          el.style.transform = `translate3d(${cactus.x}px, 0, 0)`
          el.style.backgroundPosition = `-${cactus.frameX}px -${cactus.frameY}px`
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
    const safeDelta = Math.min(delta, 33)
    const timeScale = safeDelta / 16.66
    
    const containerWidth = state.containerWidth

    // Puntuación
    state.score += 0.14 * (state.speed / 5) * timeScale
    const currentScore = Math.floor(state.score).toString().padStart(5, '0')
    if (scoreRef.current) {
      if (state.scoreFlashUntil > time) {
        const blink = Math.floor(time / 100) % 2 === 0
        scoreRef.current.style.opacity = blink ? '1' : '0.2'
        scoreRef.current.innerText = state.scoreFlashValue.toString().padStart(5, '0')
      } else {
        scoreRef.current.style.opacity = '1'
        if (scoreRef.current.innerText !== currentScore) {
          scoreRef.current.innerText = currentScore
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
    if (state.groundX <= -1200) {
      state.groundX += 1200
    }

    if (groundRef.current) {
      groundRef.current.style.backgroundPositionX = `${Math.round(state.groundX)}px`
    }

    // Nubes — se mueven más lento que el suelo
    state.clouds.forEach((cloud, i) => {
      cloud.x -= cloud.speed * timeScale
      if (cloud.x < -120) {
        const maxX = Math.max(...state.clouds.map(c => c.x))
        cloud.x = Math.max(containerWidth, maxX) + 200 + Math.random() * 400
        cloud.y = state.isMobile ? 15 + Math.random() * 25 : 30 + Math.random() * 35
        cloud.speed = 2 + Math.random() * 0.8
        if (cloudRefs.current[i]) {
          cloudRefs.current[i].style.top = `${cloud.y}px`
        }
      }
      if (cloudRefs.current[i]) {
        cloudRefs.current[i].style.transform = `translate3d(${cloud.x}px, 0, 0)`
      }
    })

    // Hitbox del dinosaurio — relativo al frame (61×49), y=0 arriba del sprite
    const dinoX = state.dinoX
    // frame 61×49: sprite bottom=-6, sprite top=-6+49=43 en world coords
    // Hitboxes definidas como { x, y, w, h } donde y=0 es arriba del frame (igual que cactus)
    const dinoSpriteTop = 43 + state.yPos
    const dinoHB_raw = state.isDucking
      ? { x: 10, y: 24, w: 35, h: 20 }
      : { x: 20, y: 7,  w: 22, h: 35 }
    const dinoHB = {
      x: dinoX + dinoHB_raw.x,
      y: dinoSpriteTop - dinoHB_raw.y - dinoHB_raw.h,
      w: dinoHB_raw.w,
      h: dinoHB_raw.h,
    }
    let hit = false

    // 1) Mover los cactus activos y aparcar los que salen de pantalla.
    let activeCount = 0
    let rightmost: Cactus | null = null

    for (let i = 0; i < state.cacti.length; i++) {
      const cactus = state.cacti[i]
      if (!cactus.active) continue

      cactus.x -= state.speed * timeScale

      if (cactus.x < -100) {
        cactus.active = false
        cactus.x = -1000
        const parkEl = cactusRefs.current[i]
        if (parkEl) parkEl.style.transform = "translate3d(-1000px, 0, 0)"
        continue
      }

      activeCount++
      if (!rightmost || cactus.x > rightmost.x) rightmost = cactus

      const el = cactusRefs.current[i]
      if (el) el.style.transform = `translate3d(${cactus.x}px, 0, 0)`

      // Cactus hitbox — relativo al frame (77×52), y=0 arriba del sprite
      // Sprite bottom=-8, sprite top=-8+52=44 en world coords
      const frameIdx =
        Math.floor(cactus.frameX / 77) + Math.floor(cactus.frameY / 52) * 5
      const hb = CACTUS_HITBOXES[frameIdx]
      const cactusSpriteTop = 44
      const cactusHB = {
        x: cactus.x + hb.x,
        y: cactusSpriteTop - hb.y - hb.h,
        w: hb.w,
        h: hb.h,
      }

      // AABB — ambos en world coords (y crece hacia arriba)
      if (
        dinoHB.x < cactusHB.x + cactusHB.w &&
        dinoHB.x + dinoHB.w > cactusHB.x &&
        dinoHB.y < cactusHB.y + cactusHB.h &&
        dinoHB.y + dinoHB.h > cactusHB.y
      ) {
        hit = true
      }
    }

    // 2) Generar el siguiente cactus (sprite al azar de la sheet) solo si hay
    //    cupo en pantalla: al inicio 1 (el siguiente aparece cuando el anterior
    //    ya salió), luego 2.
    const maxVisible = maxVisibleCacti(state.speed)
    let spawnGuard = 0
    while (spawnGuard++ < MAX_CACTI) {
      if (activeCount >= maxVisible) break

      const sprite = pickCactusSprite()
      // Separación pensada para que quepan ~`maxVisible` cactus a la vez.
      const base =
        maxVisible <= 1
          ? state.viewWidth + 80
          : state.viewWidth / maxVisible - sprite.width
      const gap = Math.round(base * 1.1 * (1 + Math.random() * 0.15))

      if (rightmost) {
        const prevRight = rightmost.x + rightmost.pad + rightmost.width
        // El anterior todavía no dejó hueco suficiente en pantalla.
        if (prevRight + gap > state.viewWidth + sprite.width) break
      }

      const parkIndex = state.cacti.findIndex((c) => !c.active)
      if (parkIndex === -1) break

      const cactus = state.cacti[parkIndex]
      // Aparece justo fuera del borde derecho.
      const x = state.viewWidth + sprite.width - sprite.pad

      cactus.active = true
      cactus.x = x
      cactus.frameX = sprite.frameX
      cactus.frameY = sprite.frameY
      cactus.width = sprite.width
      cactus.pad = sprite.pad

      const spawnEl = cactusRefs.current[parkIndex]
      if (spawnEl) {
        spawnEl.style.backgroundPosition = `-${sprite.frameX}px -${sprite.frameY}px`
        spawnEl.style.transform = `translate3d(${x}px, 0, 0)`
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
        dinoRef.current.style.backgroundPosition = "-61px -49px"
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
    let bgPos = "0px 0px"
    
    if (state.yPos > 0) {
      bgPos = "0px 0px"
    } else if (state.isDucking) {
      bgPos = Math.floor(state.frame / 8) % 2 === 0 ? "-61px -98px" : "-122px -98px"
    } else {
      bgPos = Math.floor(state.frame / 8) % 2 === 0 ? "-122px 0px" : "0px -49px" 
    }

    if (dinoRef.current) {
      dinoRef.current.style.transform = `translate3d(0, -${state.yPos}px, 0)`
      dinoRef.current.style.backgroundPosition = bgPos
    }

    reqRef.current = requestAnimationFrame(gameLoopRef.current)
  }

  startGameRef.current = () => {
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
      scoreFlashValue: 0
    }

    if (scoreRef.current) scoreRef.current.innerText = '00000'
    if (dinoRef.current) dinoRef.current.style.backgroundPosition = "0px 0px"

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
    const bindKeyboard = () => {
      if (keyboardBound) return
      keyboardBound = true
      window.addEventListener("keydown", onKeyDown)
      window.addEventListener("keyup", onKeyUp)
      window.addEventListener("resize", updateMetrics)
    }
    const unbindKeyboard = () => {
      if (!keyboardBound) return
      keyboardBound = false
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("keyup", onKeyUp)
      window.removeEventListener("resize", updateMetrics)
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
              <div className="bg-background/80 px-3 py-1.5 rounded-lg backdrop-blur-sm pointer-events-none animate-pulse">
                <span className="text-[10px] sm:text-xs font-medium tracking-widest text-foreground" style={{ fontFamily: 'var(--font-pixel, monospace)' }}>
                  CLICK PARA JUGAR
                </span>
              </div>
            )}
            {showOverlay === 'GAME_OVER' && (
              <div className="flex flex-col items-center gap-2 pointer-events-none">
                <div className="bg-background/80 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                  <span className="text-[10px] sm:text-xs font-medium tracking-widest text-foreground" style={{ fontFamily: 'var(--font-pixel, monospace)' }}>
                    GAME OVER
                  </span>
                </div>
                <div className="bg-background/80 px-3 py-1.5 rounded-lg backdrop-blur-sm animate-pulse">
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
            <div
              ref={groundRef}
              className="absolute top-[-10px] left-0 w-full h-[22px] z-0 dark:invert opacity-80"
              style={{
                backgroundImage: "url('/images/dino/ground.webp')",
                backgroundRepeat: "repeat-x",
                backgroundPosition: "0px top",
                imageRendering: "pixelated",
                transition: "filter 700ms var(--expo-out)",
              }}
            />

            <div className="sm:scale-100 max-sm:scale-[0.65] max-sm:origin-bottom-left">
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
                  width: "61px",
                  height: "49px",
                  backgroundImage: "url('/images/dino/dinospritesheet.webp')",
                  backgroundPosition: "0px 0px",
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
          <div className="flex items-center h-7 sm:h-9 pl-3 sm:pl-4 overflow-hidden">
            <h1 className="truncate text-lg sm:text-2xl font-medium tracking-tight leading-none">
              {USER.displayName}
            </h1>
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