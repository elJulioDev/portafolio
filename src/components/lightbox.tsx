"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface LightboxProps {
  images: string[]
  index: number
  alt?: string
  onClose: () => void
}

const MAX_SCALE = 4
const DOUBLE_TAP_SCALE = 2.5
const SWIPE_THRESHOLD = 60
const TRANSITION = "transform 300ms cubic-bezier(0.22, 1, 0.36, 1)"

const baseTransform = (i: number, offset = 0) =>
  `translate3d(calc(${-i * 100}% + ${offset}px), 0, 0)`

export function Lightbox({ images, index, alt = "", onClose }: LightboxProps) {
  const [current, setCurrent] = useState(index)
  const [zoomed, setZoomed] = useState(false)

  const total = images.length
  const multi = total > 1
  const hasPrev = current > 0
  const hasNext = current < total - 1

  const currentRef = useRef(index)
  const totalRef = useRef(total)
  const trackRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const slideRefs = useRef<(HTMLDivElement | null)[]>([])

  // Zoom transform lives in refs so gestures never trigger re-renders.
  const scaleRef = useRef(1)
  const txRef = useRef(0)
  const tyRef = useRef(0)

  useEffect(() => {
    totalRef.current = total
  }, [total])

  const resetSlide = useCallback((i: number) => {
    const node = slideRefs.current[i]
    if (node) {
      node.style.transition = "none"
      node.style.transform = ""
    }
  }, [])

  const goTo = useCallback(
    (next: number) => {
      const max = totalRef.current
      if (next < 0 || next >= max || next === currentRef.current) return

      resetSlide(currentRef.current)
      scaleRef.current = 1
      txRef.current = 0
      tyRef.current = 0
      setZoomed(false)

      currentRef.current = next
      setCurrent(next)

      const track = trackRef.current
      if (track) {
        track.style.transition = TRANSITION
        track.style.transform = baseTransform(next)
      }
    },
    [resetSlide]
  )

  // Keyboard + body scroll lock
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") goTo(currentRef.current - 1)
      if (e.key === "ArrowRight") goTo(currentRef.current + 1)
    }
    document.addEventListener("keydown", onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = previous
    }
  }, [onClose, goTo])

  // Initial position (no animation)
  useEffect(() => {
    const track = trackRef.current
    if (track) {
      track.style.transition = "none"
      track.style.transform = baseTransform(currentRef.current)
    }
  }, [])

  // Gestures: swipe between images + pan / pinch / double-tap zoom.
  useEffect(() => {
    const el = viewportRef.current
    if (!el) return

    type Mode = "idle" | "swipe" | "pan" | "pinch"
    const pointers = new Map<number, { x: number; y: number }>()

    let mode: Mode = "idle"
    let startX = 0
    let startY = 0
    let lastX = 0
    let lastY = 0
    let startTime = 0
    let moved = false
    let lastTapTime = 0
    let lastTapX = 0
    let lastTapY = 0
    let pinchStartDist = 0
    let pinchStartScale = 1
    let pinchStartTx = 0
    let pinchStartTy = 0
    let pinchMidX = 0
    let pinchMidY = 0

    const slideNode = () => slideRefs.current[currentRef.current]

    const metrics = () => {
      const r = el.getBoundingClientRect()
      return { cx: r.left + r.width / 2, cy: r.top + r.height / 2, w: r.width, h: r.height }
    }

    const applyZoom = (animate: boolean) => {
      const node = slideNode()
      if (!node) return
      node.style.transition = animate ? TRANSITION : "none"
      node.style.transform = `translate3d(${txRef.current}px, ${tyRef.current}px, 0) scale(${scaleRef.current})`
    }

    const clampZoom = () => {
      const { w, h } = metrics()
      const maxX = Math.max(0, ((scaleRef.current - 1) * w) / 2)
      const maxY = Math.max(0, ((scaleRef.current - 1) * h) / 2)
      txRef.current = Math.min(maxX, Math.max(-maxX, txRef.current))
      tyRef.current = Math.min(maxY, Math.max(-maxY, tyRef.current))
    }

    const setTrack = (i: number, offset: number, animate: boolean) => {
      const track = trackRef.current
      if (!track) return
      track.style.transition = animate ? TRANSITION : "none"
      track.style.transform = baseTransform(i, offset)
    }

    const resetZoom = (animate: boolean) => {
      scaleRef.current = 1
      txRef.current = 0
      tyRef.current = 0
      const node = slideNode()
      if (node) {
        node.style.transition = animate ? TRANSITION : "none"
        node.style.transform = ""
      }
      setZoomed(false)
    }

    const zoomAt = (clientX: number, clientY: number) => {
      const { cx, cy } = metrics()
      const mx = clientX - cx
      const my = clientY - cy
      const s = DOUBLE_TAP_SCALE
      scaleRef.current = s
      txRef.current = mx * (1 - s)
      tyRef.current = my * (1 - s)
      clampZoom()
      applyZoom(true)
      setZoomed(true)
    }

    const toggleZoom = (clientX: number, clientY: number) => {
      if (scaleRef.current > 1) resetZoom(true)
      else zoomAt(clientX, clientY)
    }

    const registerTap = (clientX: number, clientY: number) => {
      const now = performance.now()
      if (now - lastTapTime < 300 && Math.hypot(clientX - lastTapX, clientY - lastTapY) < 32) {
        lastTapTime = 0
        toggleZoom(clientX, clientY)
      } else {
        lastTapTime = now
        lastTapX = clientX
        lastTapY = clientY
      }
    }

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })
      try {
        el.setPointerCapture(e.pointerId)
      } catch {
        /* ignore */
      }

      if (pointers.size === 1) {
        startX = lastX = e.clientX
        startY = lastY = e.clientY
        startTime = performance.now()
        moved = false
        mode = scaleRef.current > 1 ? "pan" : "swipe"
        if (mode === "swipe") {
          const track = trackRef.current
          if (track) track.style.transition = "none"
        }
      } else if (pointers.size === 2) {
        const [a, b] = [...pointers.values()]
        pinchStartDist = Math.hypot(a.x - b.x, a.y - b.y)
        pinchStartScale = scaleRef.current
        pinchStartTx = txRef.current
        pinchStartTy = tyRef.current
        const { cx, cy } = metrics()
        pinchMidX = (a.x + b.x) / 2 - cx
        pinchMidY = (a.y + b.y) / 2 - cy
        mode = "pinch"
        moved = true
        const node = slideNode()
        if (node) node.style.transition = "none"
      }
    }

    const onMove = (e: PointerEvent) => {
      if (!pointers.has(e.pointerId)) return
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })

      if (pointers.size >= 2) {
        const [a, b] = [...pointers.values()]
        const dist = Math.hypot(a.x - b.x, a.y - b.y)
        const { cx, cy } = metrics()
        const midX = (a.x + b.x) / 2 - cx
        const midY = (a.y + b.y) / 2 - cy
        const ratio = pinchStartDist > 0 ? dist / pinchStartDist : 1
        const nextScale = Math.min(MAX_SCALE, Math.max(1, pinchStartScale * ratio))
        const applied = nextScale / pinchStartScale
        scaleRef.current = nextScale
        txRef.current = midX - applied * (pinchMidX - pinchStartTx)
        tyRef.current = midY - applied * (pinchMidY - pinchStartTy)
        clampZoom()
        applyZoom(false)
        moved = true
        return
      }

      if (mode === "pan") {
        txRef.current += e.clientX - lastX
        tyRef.current += e.clientY - lastY
        clampZoom()
        applyZoom(false)
        if (Math.abs(e.clientX - startX) > 6 || Math.abs(e.clientY - startY) > 6) moved = true
      } else if (mode === "swipe") {
        const totalDx = e.clientX - startX
        if (Math.abs(totalDx) > 6) moved = true
        const atStart = currentRef.current === 0 && totalDx > 0
        const atEnd = currentRef.current === totalRef.current - 1 && totalDx < 0
        setTrack(currentRef.current, atStart || atEnd ? totalDx * 0.35 : totalDx, false)
      }

      lastX = e.clientX
      lastY = e.clientY
    }

    const onUp = (e: PointerEvent) => {
      if (!pointers.has(e.pointerId)) return
      pointers.delete(e.pointerId)
      try {
        el.releasePointerCapture(e.pointerId)
      } catch {
        /* ignore */
      }

      // A pinch lost one finger: re-anchor the remaining one.
      if (pointers.size === 1) {
        const [a] = [...pointers.values()]
        startX = lastX = a.x
        startY = lastY = a.y
        startTime = performance.now()
        moved = true
        mode = scaleRef.current > 1 ? "pan" : "swipe"
        if (mode === "swipe") {
          const track = trackRef.current
          if (track) track.style.transition = "none"
        }
        return
      }
      if (pointers.size > 1) return

      if (mode === "pinch") {
        if (scaleRef.current < 1.05) {
          resetZoom(true)
        } else {
          clampZoom()
          applyZoom(true)
          setZoomed(scaleRef.current > 1)
        }
        mode = "idle"
        moved = false
        return
      }

      const now = performance.now()
      const isTap = !moved && now - startTime < 250

      if (isTap) {
        setTrack(currentRef.current, 0, true)
        registerTap(e.clientX, e.clientY)
        mode = "idle"
        return
      }

      if (mode === "swipe") {
        const dx = e.clientX - startX
        const fast = Math.abs(dx) / Math.max(now - startTime, 1) > 0.5
        const change = Math.abs(dx) > SWIPE_THRESHOLD || fast
        if (change && dx < 0 && currentRef.current < totalRef.current - 1) {
          goTo(currentRef.current + 1)
        } else if (change && dx > 0 && currentRef.current > 0) {
          goTo(currentRef.current - 1)
        } else {
          setTrack(currentRef.current, 0, true)
        }
      } else if (mode === "pan") {
        clampZoom()
        applyZoom(true)
      }

      mode = "idle"
      moved = false
    }

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const node = slideNode()
      if (!node) return
      const { cx, cy } = metrics()
      const mx = e.clientX - cx
      const my = e.clientY - cy
      const nextScale = Math.min(MAX_SCALE, Math.max(1, scaleRef.current * (1 - e.deltaY * 0.0015)))
      const applied = nextScale / scaleRef.current
      txRef.current = mx - applied * (mx - txRef.current)
      tyRef.current = my - applied * (my - tyRef.current)
      scaleRef.current = nextScale
      if (nextScale <= 1) {
        resetZoom(false)
      } else {
        clampZoom()
        applyZoom(false)
        setZoomed(true)
      }
    }

    const prevent = (ev: Event) => ev.preventDefault()

    el.addEventListener("pointerdown", onDown)
    el.addEventListener("pointermove", onMove)
    el.addEventListener("pointerup", onUp)
    el.addEventListener("pointercancel", onUp)
    el.addEventListener("contextmenu", prevent)
    el.addEventListener("wheel", onWheel, { passive: false })

    return () => {
      el.removeEventListener("pointerdown", onDown)
      el.removeEventListener("pointermove", onMove)
      el.removeEventListener("pointerup", onUp)
      el.removeEventListener("pointercancel", onUp)
      el.removeEventListener("contextmenu", prevent)
      el.removeEventListener("wheel", onWheel)
    }
  }, [goTo])

  return (
    <div className="fixed inset-0 z-[100] flex flex-col overscroll-contain bg-black/90 backdrop-blur-sm select-none">
      {/* Close */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-[max(0.75rem,env(safe-area-inset-top))] right-3 z-20 flex size-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-2xl leading-none text-white backdrop-blur-md transition-colors active:bg-white/20 sm:right-4"
        aria-label="Cerrar"
      >
        ×
      </button>

      {/* Stage */}
      <div
        className="relative flex min-h-0 w-full flex-1 items-center justify-center gap-2 sm:px-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose()
        }}
      >
        {multi && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              goTo(current - 1)
            }}
            disabled={!hasPrev}
            className={cn(
              "z-[102] hidden size-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-sm transition-colors hover:border-white/40 sm:flex sm:size-12",
              !hasPrev && "pointer-events-none opacity-30"
            )}
            aria-label="Anterior"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}

        <div
          ref={viewportRef}
          className="relative h-full w-full touch-none overflow-hidden sm:h-[75vh] sm:max-w-5xl sm:rounded-xl"
          style={{ cursor: zoomed ? "grab" : "auto" }}
        >
          <div
            ref={trackRef}
            className="flex h-full w-full will-change-transform"
            style={{ transform: baseTransform(current) }}
          >
            {images.map((img, i) => (
              <div key={i} className="relative flex h-full w-full shrink-0 items-center justify-center p-2 sm:p-0">
                <div
                  ref={(el) => {
                    slideRefs.current[i] = el
                  }}
                  className="relative h-full w-full will-change-transform"
                >
                  <Image
                    src={img}
                    alt={`${alt} ${i + 1}`}
                    fill
                    sizes="100vw"
                    className="pointer-events-none object-contain select-none"
                    draggable={false}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {multi && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              goTo(current + 1)
            }}
            disabled={!hasNext}
            className={cn(
              "z-[102] hidden size-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-sm transition-colors hover:border-white/40 sm:flex sm:size-12",
              !hasNext && "pointer-events-none opacity-30"
            )}
            aria-label="Siguiente"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )}
      </div>

      {/* Counter (desktop) */}
      {multi && (
        <span className="mt-3 mb-4 hidden rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm tabular-nums text-white/80 backdrop-blur-sm sm:mx-auto sm:block">
          {current + 1} / {total}
        </span>
      )}

      {/* Dots (mobile) */}
      {multi && (
        <div className="flex w-full shrink-0 items-center justify-center gap-2 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:hidden">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              className={cn(
                "h-2 rounded-full transition-all",
                i === current ? "w-6 bg-white" : "w-2 bg-white/40"
              )}
              aria-label={`Imagen ${i + 1}`}
              aria-current={i === current}
            />
          ))}
        </div>
      )}
    </div>
  )
}
