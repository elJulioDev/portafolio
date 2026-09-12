"use client"

import Image from "next/image"
import { useState } from "react"

import { FlipSentences } from "./flip-sentences"
import { USER } from "../data/user"

export function ProfileHeader() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="screen-line-bottom grid grid-cols-[auto_1fr] overflow-y-clip border-x">
      {/* Avatar circular con efecto hover */}
      <figure
        className="relative col-span-2 p-4 sm:col-span-1 sm:col-start-2 sm:p-6"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative size-32 overflow-hidden rounded-full sm:size-40 mx-auto ring-2 ring-line ring-offset-2 ring-offset-background transition-all duration-300 hover:ring-foreground/20 hover:ring-offset-4">
          <Image
            src={USER.avatar}
            alt={USER.displayName}
            fill
            className={`object-cover transition-transform duration-500 ${isHovered ? "scale-110" : "scale-100"}`}
            priority
          />
        </div>

        <figcaption className="pointer-events-none absolute right-2 bottom-2 text-sm leading-none tracking-wide text-muted-foreground/60 tabular-nums select-none sm:right-6 sm:bottom-6">
          Fig. 1.
        </figcaption>
      </figure>

      {/* Nombre + flip sentences */}
      <div className="flex flex-col border-l border-line">
        <div className="z-1 mt-auto border-t border-line">
          <div className="flex items-center gap-2 pl-4 pt-1">
            <h1 className="-translate-y-px text-[2rem]/none font-medium tracking-tight">
              {USER.displayName}
            </h1>
          </div>

          <FlipSentences
            className="h-9 border-t border-line py-1 pl-4 font-mono text-sm text-muted-foreground"
            sentences={USER.flipSentences}
          />
        </div>
      </div>
    </div>
  )
}
