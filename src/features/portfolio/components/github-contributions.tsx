"use client"

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  startTransition,
  type PointerEvent as ReactPointerEvent,
} from "react"

import { Panel } from "./panel"
import { siteConfig } from "@/config/site"
import {
  ContributionGraph,
  ContributionGraphBlock,
  ContributionGraphCalendar,
  ContributionGraphFooter,
  ContributionGraphLegend,
  ContributionGraphTotalCount,
} from "@/registry/components/contribution-graph"

interface Activity {
  date: string
  count: number
  level: number
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return `${d.getDate().toString().padStart(2, "0")}.${(d.getMonth() + 1).toString().padStart(2, "0")}.${d.getFullYear()}`
}

function formatTooltipDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00")
  return d.toLocaleDateString("es-CL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export function GitHubContributions() {
  const [contributions, setContributions] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  // Solo montamos el gráfico (≈365 bloques) cuando la sección está por entrar en
  // pantalla, para no bloquear la carga inicial de la página.
  const [inView, setInView] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const tooltipTextRef = useRef<HTMLSpanElement>(null)
  const tooltipArrowRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function fetchContributions() {
      try {
        const username = siteConfig.github.split("/").pop()
        const res = await fetch(
          `https://github-contributions-api.jogruber.de/v4/${username}?y=last`,
          { signal: controller.signal }
        )
        const data = await res.json()
        // Transición no urgente: React puede interrumpir el render del gráfico
        // para atender la interacción del usuario.
        startTransition(() => setContributions(data.contributions || []))
      } catch (error) {
        if (!(error instanceof Error) || error.name !== "AbortError") {
          setContributions([])
        }
      } finally {
        setLoading(false)
      }
    }
    
    fetchContributions()
    return () => controller.abort()
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    if (typeof IntersectionObserver === "undefined") {
      const id = requestAnimationFrame(() => setInView(true))
      return () => cancelAnimationFrame(id)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startTransition(() => setInView(true))
          observer.disconnect()
        }
      },
      { rootMargin: "300px 0px" }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const data = useMemo(
    () =>
      contributions.map((c) => ({
        date: c.date,
        count: c.count,
        level: c.level,
      })),
    [contributions]
  )

  // Tooltip único actualizado de forma imperativa: mover el mouse entre celdas no
  // provoca ningún re-render de React (a diferencia de un Tooltip por bloque).
  const hideTooltip = useCallback(() => {
    const el = tooltipRef.current
    if (el) el.style.opacity = "0"
  }, [])

  const showTooltip = useCallback((target: Element) => {
    const el = tooltipRef.current
    const text = tooltipTextRef.current
    const arrow = tooltipArrowRef.current
    if (!el || !text || !arrow) return

    const count = Number(target.getAttribute("data-count") ?? 0)
    const date = target.getAttribute("data-date") ?? ""
    text.textContent = `${count} contribuciones, ${formatTooltipDate(date)}`

    const rect = target.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2

    // Mide el ancho real para centrar y limitar el tooltip al viewport.
    const width = Math.min(el.offsetWidth, window.innerWidth - 16)
    const half = width / 2
    const clampedX = Math.min(
      Math.max(centerX, half + 8),
      window.innerWidth - half - 8
    )

    el.style.left = `${Math.round(clampedX)}px`
    el.style.top = `${Math.round(rect.top - 8)}px`
    el.style.opacity = "1"
    el.style.transform = "translate(-50%, -100%) scale(1)"

    const arrowX = Math.min(
      Math.max(centerX - (clampedX - half), 14),
      width - 14
    )
    arrow.style.left = `${Math.round(arrowX)}px`
  }, [])

  const handlePointerOver = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const target = (event.target as Element).closest?.("[data-date]")
      if (target) showTooltip(target)
    },
    [showTooltip]
  )

  const firstDate = contributions[0]?.date || ""
  const lastDate = contributions.at(-1)?.date || ""

  return (
    <Panel className="screen-line-top-none">
      <h2 className="sr-only">GitHub contributions</h2>

      <div ref={containerRef} className="bg-background">
        {loading || (data.length > 0 && !inView) ? (
          <div className="flex h-45 w-full items-center justify-center">
            {loading && (
              <div className="size-5 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
            )}
          </div>
        ) : data.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No se pudieron cargar las contribuciones.
          </p>
        ) : (
        <ContributionGraph
          className="mx-auto gap-4 py-4 animate-in fade-in duration-500"
          data={data}
          blockSize={12}
          blockMargin={2}
          blockRadius={0}
        >
          <ContributionGraphCalendar
            className="px-4 **:data-[slot=month-labels]:text-muted-foreground"
            title="GitHub Contributions"
            onPointerOver={handlePointerOver}
            onPointerLeave={hideTooltip}
            onScroll={hideTooltip}
          >
            {({ activity, dayIndex, weekIndex }) => (
              <ContributionGraphBlock
                activity={activity}
                dayIndex={dayIndex}
                weekIndex={weekIndex}
              />
            )}
          </ContributionGraphCalendar>

          <ContributionGraphFooter className="px-4 text-sm sm:gap-x-4">
            <ContributionGraphTotalCount>
              {({ totalCount: tc }) => (
                <figcaption className="text-pretty tabular-nums">
                  <span className="mr-2 tracking-wide text-muted-foreground/80">
                    Fig. 2.
                  </span>
                  {tc.toLocaleString()} contributions, {formatDate(firstDate)} – {formatDate(lastDate)}. Source:{" "}
                  <a
                    href={siteConfig.github}
                    className="link-underline"
                    target="_blank"
                    rel="noopener"
                  >
                    GitHub
                  </a>
                  .
                </figcaption>
              )}
            </ContributionGraphTotalCount>

            <ContributionGraphLegend aria-hidden />
          </ContributionGraphFooter>
        </ContributionGraph>
        )}
      </div>

      {/* Tooltip único del gráfico: se posiciona imperativamente, así mover el
          mouse entre celdas no re-renderiza React. */}
      <div
        ref={tooltipRef}
        aria-hidden
        className="pointer-events-none fixed z-50 w-fit max-w-xs rounded-lg bg-foreground px-4 py-2 text-sm text-background opacity-0 transition-[opacity,transform] duration-150 ease-out"
        style={{
          left: 0,
          top: 0,
          transform: "translate(-50%, -100%) scale(0.96)",
          transformOrigin: "center bottom",
        }}
      >
        <span ref={tooltipTextRef} />
        <span
          ref={tooltipArrowRef}
          className="absolute -bottom-[5px] size-2.5 rounded-xs bg-foreground"
          style={{ left: "50%", transform: "translateX(-50%) rotate(45deg)" }}
        />
      </div>

      <div className="h-px" />
    </Panel>
  )
}
