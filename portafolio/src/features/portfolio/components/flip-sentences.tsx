"use client"

import { useState, useEffect, useCallback } from "react"

import { cn } from "@/lib/utils"

interface FlipSentencesProps {
  sentences: string[]
  interval?: number
  className?: string
}

export function FlipSentences({
  sentences,
  interval = 3,
  className,
}: FlipSentencesProps) {
  const [index, setIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  const nextSentence = useCallback(() => {
    setIsVisible(false)
    setTimeout(() => {
      setIndex((prev) => (prev + 1) % sentences.length)
      setIsVisible(true)
    }, 300)
  }, [sentences.length])

  useEffect(() => {
    if (sentences.length <= 1) return
    const timer = setInterval(nextSentence, interval * 1000)
    return () => clearInterval(timer)
  }, [nextSentence, interval, sentences.length])

  return (
    <div
      className={cn(
        "font-mono text-sm text-muted-foreground",
        className
      )}
      aria-live="polite"
    >
      <span
        className={cn(
          "inline-block transition-all duration-300",
          isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2"
        )}
      >
        {sentences[index]}
      </span>
    </div>
  )
}
