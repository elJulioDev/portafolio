"use client"

import { useCallback } from "react"
import { useLenis } from "lenis/react"

/**
 * Navegación por ancla controlada por Lenis.
 *
 * Usar `element.scrollIntoView()` nativo provoca el mismo conflicto que la barra
 * de scroll: mientras Lenis está animando ignora el scroll nativo, por lo que el
 * salto no se aplica hasta que la animación termina. Con `lenis.scrollTo(element)`
 * la animación en curso se cancela y se redirige de inmediato al destino,
 * respetando además `scroll-margin-top` (altura del header).
 *
 * Devuelve `true` si el enlace era un ancla de la página actual y fue manejado
 * (para hacer `preventDefault`).
 */
export function useScrollToHash() {
  const lenis = useLenis()

  return useCallback(
    (href: string): boolean => {
      const hashIndex = href.indexOf("#")
      if (hashIndex === -1) return false

      const hash = href.slice(hashIndex)
      const element = document.querySelector<HTMLElement>(hash)
      if (!element) return false

      if (lenis) {
        lenis.scrollTo(element)
      } else {
        element.scrollIntoView({ behavior: "smooth" })
      }

      window.history.pushState(null, "", href)
      return true
    },
    [lenis]
  )
}
