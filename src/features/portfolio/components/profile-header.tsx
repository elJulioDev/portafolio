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

export function ProfileHeader() {
  const { resolvedTheme, systemTheme, setTheme } = useTheme()
  const themeStateRef = useRef({ resolvedTheme, systemTheme })

  // Mantenemos sincronizado el estado del tema sin re-crear el game loop
  useEffect(() => {
    themeStateRef.current = { resolvedTheme, systemTheme }
  }, [resolvedTheme, systemTheme])

  const [showOverlay, setShowOverlay] = useState<'START' | 'PLAYING' | 'GAME_OVER'>('START')
  
  const containerRef = useRef<HTMLDivElement>(null)
  const dinoRef = useRef<HTMLDivElement>(null)
  const cactusRefs = useRef<(HTMLDivElement | null)[]>([])
  const cloudRefs = useRef<(HTMLDivElement | null)[]>([])
  const groundRef = useRef<HTMLDivElement>(null)
  const scoreRef = useRef<HTMLDivElement>(null)
  const hiScoreRef = useRef<HTMLDivElement>(null)
  const reqRef = useRef<number>(0)
  const hiScore = useRef(0)
  const startedOnce = useRef(false)

  const gameLoopRef = useRef<(time: number) => void>(() => {})
  const startGameRef = useRef<() => void>(() => {})

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
    speed: 5.5,
    groundX: 0,
    cacti: [
      { x: 1000, frameX: 0, frameY: 0 },
      { x: 1500, frameX: 0, frameY: 0 },
      { x: 2000, frameX: 0, frameY: 0 }
    ],
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
  const FAST_FALL_GRAVITY = 1.2

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

  // Genera la disposición de cactus. `visibleFirst` coloca el primero dentro de
  // la pantalla (escena de inicio); si no, todos aparecen fuera de pantalla.
  const spawnCacti = useCallback((visibleFirst: boolean) => {
    const state = gameState.current
    const viewWidth = state.containerWidth / state.scale
    let x = visibleFirst ? viewWidth * 0.72 : viewWidth + 120
    return [0, 1, 2].map((index) => {
      const isStartCactus = visibleFirst && index === 0
      const cactus = {
        x,
        // El cactus de inicio usa el sprite base (0,0) para coincidir con su
        // posicionamiento inicial en CSS y no cambiar de frame al medir.
        frameX: isStartCactus ? 0 : Math.floor(Math.random() * 5) * 77,
        frameY: isStartCactus ? 0 : Math.floor(Math.random() * 2) * 52,
      }
      x += 320 + Math.random() * 320
      return cactus
    })
  }, [])

  const applyCacti = useCallback(
    (cacti: { x: number; frameX: number; frameY: number }[]) => {
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

    // CAMBIO DE TEMA — instantáneo (igual que la tecla D)
    if (state.score >= state.nextThemeScore) {
      const { resolvedTheme, systemTheme } = themeStateRef.current
      const nextTheme = resolvedTheme === "dark" ? "light" : "dark"
      const targetTheme = nextTheme === systemTheme ? "system" : nextTheme
      
      setTheme(targetTheme)

      state.nextThemeScore += 700
    }

    // Velocidad y fondo
    state.speed += 0.001 * timeScale
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

    // Lógica del "Pool" de Cactus
    state.cacti.forEach((cactus, i) => {
      cactus.x -= state.speed * timeScale

      if (cactus.x < -100) {
        const maxX = Math.max(...state.cacti.map(c => c.x))
        const gap = 300 + Math.random() * 300 
        
        cactus.x = Math.max(state.viewWidth, maxX) + gap
        cactus.frameX = Math.floor(Math.random() * 5) * 77
        cactus.frameY = Math.floor(Math.random() * 2) * 52
        
        if (cactusRefs.current[i]) {
          cactusRefs.current[i].style.backgroundPosition = `-${cactus.frameX}px -${cactus.frameY}px`
        }
      }

      if (cactusRefs.current[i]) {
        cactusRefs.current[i].style.transform = `translate3d(${cactus.x}px, 0, 0)`
      }

      // Cactus hitbox — relativo al frame (77×52), y=0 arriba del sprite
      // Sprite bottom=-8, sprite top=-8+52=44 en world coords
      const frameIdx = Math.floor(cactus.frameX / 77) + Math.floor(cactus.frameY / 52) * 5
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
    })

    if (hit) {
      state.isPlaying = false
      state.isGameOver = true
      if (reqRef.current) cancelAnimationFrame(reqRef.current)
      setShowOverlay('GAME_OVER')
      sfxDie.current?.play()
      const finalScore = Math.floor(state.score)
      if (finalScore > hiScore.current) {
        hiScore.current = finalScore
        if (hiScoreRef.current) {
          hiScoreRef.current.textContent = `HI ${finalScore.toString().padStart(5, '0')}`
          hiScoreRef.current.style.display = 'block'
        }
      }
      if (finalScore > 100) {
        fetch("/api/scores", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ score: finalScore }),
        }).catch(() => {})
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

    const state = gameState.current
    const isRestart = startedOnce.current
    startedOnce.current = true

    // En la primera partida se conserva el cactus que ya estaba en pantalla; en un
    // reinicio se genera una disposición nueva fuera de pantalla.
    const cacti = isRestart ? spawnCacti(false) : state.cacti

    gameState.current = {
      ...state,
      isPlaying: true,
      isGameOver: false,
      score: 0,
      speed: 5.5,
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
    state.cacti = spawnCacti(true)
    applyCacti(state.cacti)
    state.clouds = spawnClouds()
    applyClouds(state.clouds)
  }, [updateMetrics, spawnCacti, applyCacti, spawnClouds, applyClouds])

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
        
        <div ref={containerRef} className="relative col-span-2 w-full aspect-[2/1] sm:aspect-[3/1] sm:max-h-[280px] border-b border-line bg-zinc-50 dark:bg-zinc-950 overflow-hidden group" style={{ touchAction: 'manipulation', contain: 'content' }}>
          
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
          
          <div className="absolute top-4 right-4 sm:top-6 sm:right-8 z-30 flex gap-3 text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-400 tracking-widest" style={{ fontFamily: 'var(--font-pixel, monospace)' }}>
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
              }}
            />

            <div className="sm:scale-100 max-sm:scale-[0.65] max-sm:origin-bottom-left">
              {/* El cactus 0 se posiciona con CSS (`left`) para que la escena se pinte
                  completa de una sola vez. En móvil 110.77% = 72% / 0.65 compensa el
                  `scale-[0.65]` del contenedor. */}
              {[0, 1, 2].map((i) => (
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
                    transform: i === 0 ? undefined : "translateX(1500px)",
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