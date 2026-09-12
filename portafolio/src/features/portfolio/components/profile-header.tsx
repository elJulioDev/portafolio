"use client"

import Image from "next/image"

import { FlipSentences } from "./flip-sentences"
import { USER } from "../data/user"

export function ProfileHeader() {
  return (
    <div className="screen-line-bottom grid grid-cols-[auto_1fr] grid-rows-[1fr_auto] overflow-y-clip border-x screen-line-bottom-border after:z-1">
      {/* Avatar — columna 1, ambas filas */}
      <div className="flex flex-col sm:row-span-2 sm:row-start-1">
        <div className="screen-line-top mt-auto shrink-0 border-r border-line flex flex-col items-center justify-end p-4">
          <div className="pointer-events-none relative size-30 min-[24rem]:size-32 sm:size-40">
            <Image
              src={USER.avatar}
              alt={USER.displayName}
              fill
              className="object-cover rounded-full inset-ring-1 inset-ring-foreground/10"
              priority
            />
          </div>
        </div>
      </div>

      {/* Nombre + FlipSentences — columna 2, fila 2 */}
      <div className="flex flex-col">
        <div className="z-1 mt-auto border-t border-line">
          <div className="flex items-center gap-2 pl-4 pt-1">
            <h1 className="-translate-y-px text-[2rem]/none font-medium tracking-tight">
              {USER.displayName}
            </h1>
          </div>

          <FlipSentences
            className="h-12.5 sm:h-9 border-t border-line py-1 pl-4 font-mono text-sm text-muted-foreground"
            sentences={USER.flipSentences}
          />
        </div>
      </div>
    </div>
  )
}
