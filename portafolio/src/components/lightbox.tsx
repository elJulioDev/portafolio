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

export function Lightbox({ images, index, alt = "", onClose }: LightboxProps) {
  const [current, setCurrent] = useState(index)
  const [swipeX, setSwipeX] = useState(0)
  const [swiping, setSwiping] = useState(false)
  const swipeStart = useRef(0)
  const trackRef = useRef<HTMLDivElement>(null)

  const total = images.length
  const hasPrev = current > 0
  const hasNext = current < total - 1
  const multi = total > 1

  const goPrev = useCallback(() => {
    if (hasPrev) setCurrent((i) => i - 1)
  }, [hasPrev])

  const goNext = useCallback(() => {
    if (hasNext) setCurrent((i) => i + 1)
  }, [hasNext])

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") goPrev()
      if (e.key === "ArrowRight") goNext()
    }
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [onClose, goPrev, goNext])

  // Touch swipe
  const onTouchStart = (e: React.TouchEvent) => {
    if (!multi) return
    swipeStart.current = e.touches[0].clientX
    setSwiping(true)
    setSwipeX(0)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    if (!swiping) return
    const delta = e.touches[0].clientX - swipeStart.current
    const atStart = current === 0 && delta > 0
    const atEnd = current === total - 1 && delta < 0
    setSwipeX(atStart || atEnd ? delta * 0.3 : delta)
  }

  const onTouchEnd = () => {
    if (!swiping) return
    setSwiping(false)
    if (Math.abs(swipeX) > 60) {
      const width = trackRef.current?.clientWidth || 300
      setSwipeX(swipeX < 0 ? -width : width)
      setTimeout(() => {
        if (swipeX < 0) goNext()
        else goPrev()
        setSwipeX(0)
      }, 200)
    } else {
      setSwipeX(0)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center bg-black/85 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      {/* Close */}
      <button
        type="button"
        onClick={onClose}
        className="fixed top-3 right-3 z-[102] flex size-9 items-center justify-center rounded-full border border-border bg-background/80 text-foreground text-lg backdrop-blur-sm transition-colors hover:border-accent-foreground/50 sm:top-4 sm:right-4 sm:size-10"
        aria-label="Cerrar"
      >
        ×
      </button>

      {/* Body: arrows + image */}
      <div className="flex flex-1 items-center gap-2 w-full sm:max-w-5xl sm:px-4">
        {multi && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); goPrev() }}
            disabled={!hasPrev}
            className={cn(
              "z-[102] hidden sm:flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-background/80 text-foreground backdrop-blur-sm transition-colors hover:border-accent-foreground/50 sm:size-12",
              !hasPrev && "opacity-30 pointer-events-none"
            )}
            aria-label="Anterior"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
        )}

        <div
          ref={trackRef}
          className="relative flex-1 h-[100dvh] sm:h-[75vh] overflow-hidden sm:rounded-xl"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div
            className="flex h-full transition-transform duration-200 ease-out"
            style={{ transform: `translateX(calc(-${current * 100}% + ${swiping ? swipeX : 0}px))` }}
          >
            {images.map((img, i) => (
              <div key={i} className="relative h-full w-full shrink-0">
                <Image
                  src={img}
                  alt={`${alt} ${i + 1}`}
                  fill
                  className="object-contain"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>

        {multi && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); goNext() }}
            disabled={!hasNext}
            className={cn(
              "z-[102] hidden sm:flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-background/80 text-foreground backdrop-blur-sm transition-colors hover:border-accent-foreground/50 sm:size-12",
              !hasNext && "opacity-30 pointer-events-none"
            )}
            aria-label="Siguiente"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        )}
      </div>

      {/* Counter (desktop) */}
      {multi && (
        <span className="mt-3 mb-2 hidden sm:block rounded-full border border-border bg-background/80 px-3 py-1 text-xs tabular-nums text-muted-foreground backdrop-blur-sm sm:mb-4 sm:text-sm">
          {current + 1} / {total}
        </span>
      )}

      {/* Dots (mobile) */}
      {multi && (
        <div className="flex gap-1.5 py-4 sm:hidden">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrent(i)}
              className={cn(
                "size-1.5 rounded-full transition-all",
                i === current ? "bg-foreground scale-125" : "bg-foreground/40"
              )}
              aria-label={`Imagen ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
