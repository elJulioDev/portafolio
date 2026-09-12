"use client"

import { useEffect, useState } from "react"

import { Panel } from "./panel"
import { siteConfig } from "@/config/site"

interface ContributionDay {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

export function GitHubContributions() {
  const [contributions, setContributions] = useState<ContributionDay[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchContributions() {
      try {
        const username = siteConfig.github.split("/").pop()
        const res = await fetch(
          `https://github-contributions-api.jogruber.de/v4/${username}`
        )
        const data = await res.json()
        setContributions(data.contributions?.slice(-365) || [])
      } catch {
        setContributions([])
      } finally {
        setLoading(false)
      }
    }
    fetchContributions()
  }, [])

  const total = contributions.reduce((sum, d) => sum + d.count, 0)

  // Group by week
  const weeks: ContributionDay[][] = []
  for (let i = 0; i < contributions.length; i += 7) {
    weeks.push(contributions.slice(i, i + 7))
  }

  // Gray scale matching ncdai
  const levelColors = [
    "bg-muted",
    "bg-zinc-200 dark:bg-zinc-800",
    "bg-zinc-300 dark:bg-zinc-700",
    "bg-zinc-400 dark:bg-zinc-600",
    "bg-zinc-500 dark:bg-zinc-500",
  ]

  const firstDate = contributions[0]?.date || ""
  const lastDate = contributions[contributions.length - 1]?.date || ""

  return (
    <Panel className="screen-line-top-none">
      <h2 className="sr-only">GitHub contributions</h2>

      <figure className="py-4 px-4">
        {loading ? (
          <div className="flex h-45 w-full items-center justify-center">
            <div className="size-5 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
          </div>
        ) : contributions.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No se pudieron cargar las contribuciones.
          </p>
        ) : (
          <>
            {/* Graph */}
            <div className="overflow-x-auto">
              <div className="flex gap-[3px]">
                {weeks.map((week, wi) => (
                  <div key={wi} className="flex flex-col gap-[3px]">
                    {week.map((day) => (
                      <div
                        key={day.date}
                        className={`size-[10px] rounded-[2px] ${levelColors[day.level]}`}
                        title={`${day.count} contribuciones el ${day.date}`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 flex items-center justify-between text-sm">
              <figcaption className="text-pretty tabular-nums text-muted-foreground">
                <span className="mr-2 tracking-wide text-muted-foreground/80">
                  Fig. 2.
                </span>
                {total.toLocaleString()} contribuciones, {firstDate} – {lastDate}.{" "}
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

              {/* Legend */}
              <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                <span>Menos</span>
                {levelColors.map((color, i) => (
                  <div key={i} className={`size-[10px] rounded-[2px] ${color}`} />
                ))}
                <span>Más</span>
              </div>
            </div>
          </>
        )}
      </figure>

      <div className="h-px" />
    </Panel>
  )
}
