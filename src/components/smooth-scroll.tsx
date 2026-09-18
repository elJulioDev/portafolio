"use client"

import { useEffect, type ReactNode } from "react"
import { ReactLenis, useLenis } from "lenis/react"

/**
 * Permite que el scroll nativo (arrastrar la barra, usar teclado, etc.) tome el
 * control de inmediato.
 *
 * Por diseño, Lenis ignora los eventos de scroll nativos mientras está animando
 * (`isScrolling === "smooth"`). Por eso, si se toma la barra durante la inercia
 * del smooth scroll, esta parece quedar bloqueada hasta que la animación termina
 * (bug conocido de Lenis: issues #168 / #365).
 *
 * Detectamos esas interacciones y sincronizamos/cortamos la animación de Lenis
 * para cederle el control al scroll nativo.
 */
function ScrollbarSync() {
  const lenis = useLenis()

  useEffect(() => {
    if (!lenis) return

    // Sincroniza Lenis con la posición real y detiene su animación en curso.
    const releaseControl = () => {
      lenis.scrollTo(lenis.actualScroll, { immediate: true, force: true })
    }

    // Refuerzo: si se presiona sobre la barra nativa, cortamos la animación al
    // instante. Escuchamos pointerdown y mousedown porque no todos los navegadores
    // emiten ambos sobre la barra.
    const onPointerDown = (event: PointerEvent | MouseEvent) => {
      if ("pointerType" in event && event.pointerType === "touch") return

      const root = document.documentElement
      const scrollbarWidth = window.innerWidth - root.clientWidth
      const scrollbarHeight = window.innerHeight - root.clientHeight

      const onVerticalScrollbar =
        scrollbarWidth > 0 && event.clientX >= root.clientWidth
      const onHorizontalScrollbar =
        scrollbarHeight > 0 && event.clientY >= root.clientHeight

      if (onVerticalScrollbar || onHorizontalScrollbar) releaseControl()
    }

    // Respaldo robusto (no depende de que la barra emita eventos de puntero): si la
    // posición real se separa de la posición animada por Lenis, el scroll vino de
    // una interacción nativa y le cedemos el control.
    const onScroll = () => {
      if (lenis.isScrolling !== "smooth") return
      if (Math.abs(lenis.actualScroll - lenis.animatedScroll) <= 1) return
      releaseControl()
    }

    document.addEventListener("pointerdown", onPointerDown, true)
    document.addEventListener("mousedown", onPointerDown, true)
    window.addEventListener("scroll", onScroll, { passive: true })

    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true)
      document.removeEventListener("mousedown", onPointerDown, true)
      window.removeEventListener("scroll", onScroll)
    }
  }, [lenis])

  return null
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  // lerp: Controla la inercia (menor valor = más lento y fluido). El por defecto es 0.1.
  // smoothWheel: Activa el scroll fluido para el ratón.
  return (
    <ReactLenis root options={{ lerp: 0.05, smoothWheel: true }}>
      <ScrollbarSync />
      {children}
    </ReactLenis>
  )
}
