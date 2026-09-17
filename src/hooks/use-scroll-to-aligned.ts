"use client"

import { useCallback } from "react"
import { useLenis } from "lenis/react"

/**
 * Espacio de separación entre el header fijo y el elemento al que hacemos scroll.
 */
const HEADER_GAP = 12

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
}

/**
 * Devuelve una función que desplaza la página de forma suave para alinear la parte
 * superior del elemento justo debajo del header fijo.
 *
 * Usa Lenis cuando está disponible para mantener la misma inercia del scroll global.
 */
export function useScrollToAligned() {
  const lenis = useLenis()

  return useCallback(
    (target: HTMLElement | null) => {
      if (!target || typeof window === "undefined") return

      const header = document.querySelector<HTMLElement>("[data-site-header]")
      const headerHeight = header?.offsetHeight ?? 56
      const top =
        target.getBoundingClientRect().top +
        window.scrollY -
        (headerHeight + HEADER_GAP)

      if (prefersReducedMotion()) {
        window.scrollTo({ top })
        return
      }

      if (lenis) {
        lenis.scrollTo(top, { duration: 0.7 })
      } else {
        window.scrollTo({ top, behavior: "smooth" })
      }
    },
    [lenis]
  )
}
