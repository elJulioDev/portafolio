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
  const reqRef = useRef<number>(0)

  const gameLoopRef = useRef<(time: number) => void>(() => {})
  const startGameRef = useRef<() => void>(() => {})

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
      { x: 600, y: 40, speed: 2 },
      { x: 1100, y: 55, speed: 2.3 },
      { x: 1700, y: 45, speed: 2.6 }
    ],
    yPos: 0,
    yVelocity: 0,
    isJumping: false,
    isDucking: false,
    frame: 0,
    lastTime: 0,
    nextThemeScore: 700
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
    state.score += 0.08 * (state.speed / 5) * timeScale
    const currentScore = Math.floor(state.score).toString().padStart(5, '0')
    if (scoreRef.current && scoreRef.current.innerText !== currentScore) {
      scoreRef.current.innerText = currentScore
    }

    // CAMBIO DE TEMA SUAVE
    if (state.score >= state.nextThemeScore) {
      const { resolvedTheme, systemTheme } = themeStateRef.current
      const nextTheme = resolvedTheme === "dark" ? "light" : "dark"
      const targetTheme = nextTheme === systemTheme ? "system" : nextTheme
      
      // Agregamos clase para forzar la transición CSS
      document.documentElement.classList.add('dino-theme-transition')
      
      // Usamos el setter de next-themes puro, tal cual lo hace la tecla 'D'
      setTheme(targetTheme)
      
      // Limpiamos la transición una vez que termina el efecto
      setTimeout(() => {
        document.documentElement.classList.remove('dino-theme-transition')
      }, 1000)

      state.nextThemeScore += 700
    }

    // Velocidad y fondo
    state.speed += 0.001 * timeScale
    state.groundX = (state.groundX - state.speed * timeScale) % 1200
    if (groundRef.current) groundRef.current.style.backgroundPositionX = `${state.groundX}px`

    // Nubes — se mueven más lento que el suelo
    state.clouds.forEach((cloud, i) => {
      cloud.x -= cloud.speed * timeScale
      if (cloud.x < -120) {
        const maxX = Math.max(...state.clouds.map(c => c.x))
        cloud.x = Math.max(containerWidth, maxX) + 200 + Math.random() * 400
        cloud.y = 30 + Math.random() * 35
        cloud.speed = 2 + Math.random() * 0.8
        if (cloudRefs.current[i]) {
          cloudRefs.current[i].style.top = `${cloud.y}px`
        }
      }
      if (cloudRefs.current[i]) {
        cloudRefs.current[i].style.transform = `translateX(${cloud.x}px)`
      }
    })

    // Hitbox del dinosaurio
    const dinoX = window.innerWidth >= 640 ? 64 : 32
    const dinoHitbox = { x: dinoX + 15, y: state.yPos, w: 30, h: state.isDucking ? 25 : 40 }
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

      const cactusHitbox = { x: cactus.x + 25, y: 0, w: 25, h: 45 }
      if (
        dinoHitbox.x < cactusHitbox.x + cactusHitbox.w &&
        dinoHitbox.x + dinoHitbox.w > cactusHitbox.x &&
        dinoHitbox.y < cactusHitbox.y + cactusHitbox.h &&
        dinoHitbox.y + dinoHitbox.h > cactusHitbox.y
      ) {
        hit = true
      }
    })

    if (hit) {
      state.isPlaying = false
      state.isGameOver = true
      setShowOverlay('GAME_OVER')
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
        { x: containerWidth * 0.5, y: 40, speed: 2 },
        { x: containerWidth * 0.9, y: 55, speed: 2.3 },
        { x: containerWidth * 1.4, y: 45, speed: 2.6 }
      ],
      yPos: 0,
      yVelocity: 0,
      isJumping: false,
      isDucking: false,
      frame: 0,
      lastTime: performance.now(),
      nextThemeScore: 700
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
      <style dangerouslySetInnerHTML={{ __html: `
        .dino-theme-transition, .dino-theme-transition * {
          transition: background-color 0.8s ease-in-out, color 0.8s ease-in-out, border-color 0.8s ease-in-out, fill 0.8s ease-in-out, stroke 0.8s ease-in-out, filter 0.8s ease-in-out !important;
        }
      `}} />

      <div id="inicio" className="screen-line-bottom grid grid-cols-[auto_1fr] overflow-y-clip border-x screen-line-bottom-border after:z-1">
        
        <div ref={containerRef} className="relative col-span-2 w-full aspect-[3/1] max-h-[280px] border-b border-line bg-zinc-50 dark:bg-zinc-950 overflow-hidden group" style={{ touchAction: 'manipulation' }}>
          
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
              }
            }}
          >
            {showOverlay === 'START' && (
              <div className="bg-background/80 px-3 py-1.5 rounded-lg backdrop-blur-sm pointer-events-none animate-pulse">
                <span className="text-[10px] sm:text-xs font-medium tracking-widest text-foreground" style={{ fontFamily: 'var(--font-pixel, monospace)' }}>
                  JUGAR (ESPACIO/CLICK)
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
          
          <div 
            ref={scoreRef}
            className="absolute top-4 right-4 sm:top-6 sm:right-8 z-30 text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-400 tracking-widest"
            style={{ fontFamily: 'var(--font-pixel, monospace)' }}
          >
            00000
          </div>

          {[0, 1, 2].map((i) => (
            <div
              key={`cloud-${i}`}
              ref={(el) => { if (el) cloudRefs.current[i] = el }}
              className="absolute left-0 z-0 dark:invert opacity-60"
              style={{
                width: "96px",
                height: "32px",
                backgroundImage: "url('/images/dino/cloud.webp')",
                backgroundRepeat: "no-repeat",
                backgroundSize: "contain",
                imageRendering: "pixelated",
                transform: "translateX(1500px)",
                display: showOverlay === 'START' ? 'none' : 'block'
              }}
            />
          ))}

          <div className="absolute bottom-20 sm:bottom-24 left-0 w-full h-0">
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

        <div className="relative flex flex-col justify-end border-r border-line bg-background">
          <div className="relative z-30 -mt-16 sm:-mt-18 size-32 sm:size-36 shrink-0 rounded-full border-[3px] sm:border-4 border-background bg-background">
            <Image
              src={USER.avatar}
              alt={USER.displayName}
              fill
              sizes="(max-width: 640px) 128px, 160px"
              className="object-cover rounded-full inset-ring-1 inset-ring-foreground/10"
              priority
            />
          </div>
        </div>

        <div className="relative z-20 flex flex-col min-w-0 bg-background">
          <div className="flex items-center h-8 sm:h-9 pl-3 sm:pl-4 overflow-hidden">
            <h1 className="truncate text-xl sm:text-2xl font-medium tracking-tight leading-none">
              {USER.displayName}
            </h1>
          </div>
          <FlipSentences
            className="flex items-center h-8 sm:h-9 border-t border-line pl-3 sm:pl-4 font-mono text-xs sm:text-sm text-muted-foreground"
            sentences={USER.flipSentences}
            interval={5}
          />
        </div>
      </div>
    </>
  )
}