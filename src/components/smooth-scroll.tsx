"use client"

import { ReactLenis } from 'lenis/react'
import { ReactNode } from 'react'

export function SmoothScroll({ children }: { children: ReactNode }) {
  // lerp: Controla la inercia (menor valor = más lento y fluido). El por defecto es 0.1.
  // smoothWheel: Activa el scroll fluido para el ratón.
  return (
    <ReactLenis root options={{ lerp: 0.05, smoothWheel: true }}>
      {children}
    </ReactLenis>
  )
}