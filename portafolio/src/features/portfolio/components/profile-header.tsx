"use client"

import Image from "next/image"
import { FlipSentences } from "./flip-sentences"
import { USER } from "../data/user"

export function ProfileHeader() {
  return (
    <div className="screen-line-bottom grid grid-cols-[auto_1fr] overflow-y-clip border-x screen-line-bottom-border after:z-1">
      
      {/* Banner T-Rex (Fila 1, Ocupa todo el ancho) */}
      <div className="relative col-span-2 w-full aspect-[3/1] max-h-[280px] border-b border-line bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
        
        {/* Contador de Puntuación */}
        <div 
          className="absolute top-4 right-4 sm:top-6 sm:right-8 z-30 text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-400 tracking-widest"
          style={{ fontFamily: 'var(--font-pixel, monospace)' }}
        >
          00000
        </div>

        {/* LÍNEA BASE DEL ESCENARIO (Sube todo el conjunto aquí: bottom-20 o 24 para que libre la foto) */}
        <div className="absolute bottom-20 sm:bottom-24 left-0 w-full h-0">
          
          {/* Suelo (Lo desfasamos ligeramente hacia abajo con top-[-12px] para alinear la raya de tierra) */}
          <div 
            className="absolute top-[-10px] left-0 w-full h-[22px] z-0 dark:invert transition-colors duration-300 opacity-80"
            style={{
              backgroundImage: "url('/images/dino/ground.png')",
              backgroundRepeat: "repeat-x",
              backgroundPosition: "left top",
              imageRendering: "pixelated"
            }}
          />

          {/* Cactus (Al usar bottom-0, se apoya perfectamente en la línea base) */}
          <div 
            className="absolute bottom-[-8px] right-12 z-10 dark:invert transition-colors duration-300"
            style={{
              width: "77px", 
              height: "52px", 
              backgroundImage: "url('/images/dino/cactusspritesheet.png')",
              backgroundPosition: "0px 0px", 
              backgroundRepeat: "no-repeat",
              imageRendering: "pixelated"
            }}
          />

          {/* Dinosaurio (Al usar bottom-0, se apoya perfectamente en la línea base) */}
          <div className="absolute bottom-[-4px] left-8 sm:left-16 z-20">
            <Image
              src="/images/dino/dinospritesheet.png"
              alt="Dinosaurio"
              width={61} 
              height={49}
              className="[image-rendering:pixelated] object-none object-left-top"
              unoptimized
            />
          </div>

        </div>
      </div>

      {/* Avatar (Fila 2, Columna 1) */}
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

      {/* Nombre + FlipSentences (Fila 2, Columna 2) */}
      <div className="relative z-20 flex flex-col min-w-0 bg-background">
        <div className="flex items-center h-8 sm:h-9 pl-3 sm:pl-4 overflow-hidden">
          <h1 className="truncate text-xl sm:text-2xl font-medium tracking-tight leading-none">
            {USER.displayName}
          </h1>
        </div>
        <FlipSentences
          className="flex items-center h-8 sm:h-9 border-t border-line pl-3 sm:pl-4 font-mono text-xs sm:text-sm text-muted-foreground"
          sentences={USER.flipSentences}
        />
      </div>

    </div>
  )
}