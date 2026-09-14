"use client"

import Image from "next/image"
import { useEffect, useRef, useState, useCallback } from "react"
import { useTheme } from "next-themes"
import { FlipSentences } from "./flip-sentences"
import { USER } from "../data/user"

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
    scoreFlashValue: 0
  })

  const GRAVITY = 0.6
  const JUMP_FORCE = 10
  const FAST_FALL_GRAVITY = 1.2

  gameLoopRef.current = (time: number) => {
    const state = gameState.current
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
    
    const containerWidth = containerRef.current?.offsetWidth || 800

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
    const groundSpeedMul = window.innerWidth < 640 ? 0.65 : 1
    state.groundX = (state.groundX - state.speed * timeScale * groundSpeedMul) % 1200
    if (groundRef.current) groundRef.current.style.backgroundPositionX = `${state.groundX}px`

    // Nubes — se mueven más lento que el suelo
    state.clouds.forEach((cloud, i) => {
      cloud.x -= cloud.speed * timeScale
      if (cloud.x < -120) {
        const maxX = Math.max(...state.clouds.map(c => c.x))
        cloud.x = Math.max(containerWidth, maxX) + 200 + Math.random() * 400
        const isMobile = window.innerWidth < 640
        cloud.y = isMobile ? 15 + Math.random() * 25 : 30 + Math.random() * 35
        cloud.speed = 2 + Math.random() * 0.8
        if (cloudRefs.current[i]) {
          cloudRefs.current[i].style.top = `${cloud.y}px`
        }
      }
      if (cloudRefs.current[i]) {
        cloudRefs.current[i].style.transform = `translateX(${cloud.x}px)`
      }
    })

    // Hitbox del dinosaurio — relativo al frame (61×49), y=0 arriba del sprite
    const dinoX = window.innerWidth >= 640 ? 64 : 32
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
        
        cactus.x = Math.max(containerWidth, maxX) + gap
        cactus.frameX = Math.floor(Math.random() * 5) * 77
        cactus.frameY = Math.floor(Math.random() * 2) * 52
        
        if (cactusRefs.current[i]) {
          cactusRefs.current[i].style.backgroundPosition = `-${cactus.frameX}px -${cactus.frameY}px`
        }
      }

      if (cactusRefs.current[i]) {
        cactusRefs.current[i].style.transform = `translateX(${cactus.x}px)`
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
      dinoRef.current.style.transform = `translateY(-${state.yPos}px)`
      dinoRef.current.style.backgroundPosition = bgPos
    }

    reqRef.current = requestAnimationFrame(gameLoopRef.current)
  }

  startGameRef.current = () => {
    loadResources()
    setShowOverlay('PLAYING')
    const containerWidth = containerRef.current?.offsetWidth || 800
    
    let startX = containerWidth + 100
    const initialCacti = [0, 1, 2].map(() => {
      const c = {
        x: startX,
        frameX: Math.floor(Math.random() * 5) * 77,
        frameY: Math.floor(Math.random() * 2) * 52
      }
      startX += 300 + Math.random() * 300
      return c
    })

    gameState.current = {
      ...gameState.current,
      isPlaying: true,
      isGameOver: false,
      score: 0,
      speed: 5.5,
      groundX: 0,
      cacti: initialCacti,
      clouds: [
        { x: containerWidth * 0.5, y: 20, speed: 2 },
        { x: containerWidth * 0.9, y: 35, speed: 2.3 },
        { x: containerWidth * 1.4, y: 25, speed: 2.6 }
      ],
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
    
    gameState.current.cacti.forEach((cactus, i) => {
      if (cactusRefs.current[i]) {
        cactusRefs.current[i].style.transform = `translateX(${cactus.x}px)`
        cactusRefs.current[i].style.backgroundPosition = `-${cactus.frameX}px -${cactus.frameY}px`
      }
    })

    gameState.current.clouds.forEach((cloud, i) => {
      if (cloudRefs.current[i]) {
        cloudRefs.current[i].style.transform = `translateX(${cloud.x}px)`
        cloudRefs.current[i].style.top = `${cloud.y}px`
      }
    })
    
    if (reqRef.current) cancelAnimationFrame(reqRef.current)
    reqRef.current = requestAnimationFrame(gameLoopRef.current)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      if (['Space', 'ArrowUp', 'w'].includes(e.code) || e.code === 'Space') {
        if (gameState.current.isPlaying) {
          e.preventDefault()
          if (gameState.current.yPos <= 0.5) {
            gameState.current.isJumping = true
            gameState.current.yVelocity = JUMP_FORCE
            sfxJump.current?.play()
          }
        } else {
          if (window.scrollY < 400) {
            e.preventDefault()
            startGameRef.current()
          }
        }
      } else if (['ArrowDown', 's'].includes(e.code)) {
        if (gameState.current.isPlaying) {
          e.preventDefault()
          gameState.current.isDucking = true
        }
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['ArrowDown', 's'].includes(e.code)) {
        gameState.current.isDucking = false
      }
    }

    window.addEventListener('keydown', handleKeyDown, { passive: false })
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      if (reqRef.current) cancelAnimationFrame(reqRef.current)
    }
  }, [])

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
                  <span className="sm:hidden">CLICK PARA JUGAR</span>
                  <span className="hidden sm:inline">JUGAR (ESPACIO/CLICK)</span>
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
              className="absolute left-0 z-0 dark:invert opacity-60 max-sm:w-10 max-sm:h-7 sm:w-24 sm:h-8"
              style={{
                backgroundImage: "url('/images/dino/cloud.webp')",
                backgroundRepeat: "no-repeat",
                backgroundSize: "contain",
                imageRendering: "pixelated",
                transform: "translateX(1500px)",
                display: showOverlay === 'START' ? 'none' : 'block'
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
                backgroundPosition: "left top",
                imageRendering: "pixelated"
              }}
            />

            <div className="sm:scale-100 max-sm:scale-[0.65] max-sm:origin-bottom-left">
              {[0, 1, 2].map((i) => (
                <div 
                  key={i}
                  ref={(el) => {
                    if (el) cactusRefs.current[i] = el
                  }}
                  className="absolute bottom-[-8px] left-0 z-10"
                  style={{
                    width: "77px", 
                    height: "52px", 
                    backgroundImage: "url('/images/dino/cactusspritesheet.webp')",
                    backgroundRepeat: "no-repeat",
                    imageRendering: "pixelated",
                    transform: "translateX(1500px)",
                    display: showOverlay === 'START' ? 'none' : 'block'
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
                  imageRendering: "pixelated"
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