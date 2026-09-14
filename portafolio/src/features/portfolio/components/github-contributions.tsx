"use client"

import { useEffect, useState, useMemo } from "react"

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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface Activity {
  date: string
  count: number
  level: number
}

export function GitHubContributions() {
  const [contributions, setContributions] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

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
        setContributions(data.contributions || [])
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          setContributions([])
        }
      } finally {
        setLoading(false)
      }
    }
    
    fetchContributions()
    return () => controller.abort()
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

  const totalCount = contributions.reduce((sum, c) => sum + c.count, 0)

  const firstDate = contributions[0]?.date || ""
  const lastDate = contributions.at(-1)?.date || ""

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

  return (
    <Panel className="screen-line-top-none">
      <h2 className="sr-only">GitHub contributions</h2>

      <div className="bg-background">
        {loading ? (
          <div className="flex h-45 w-full items-center justify-center">
            <div className="size-5 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
          </div>
        ) : data.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No se pudieron cargar las contribuciones.
          </p>
        ) : (
        <ContributionGraph
          className="mx-auto gap-4 py-4"
          data={data}
          blockSize={12}
          blockMargin={2}
          blockRadius={0}
        >
          <TooltipProvider>
            <ContributionGraphCalendar
              className="px-4 **:data-[slot=month-labels]:text-muted-foreground"
              title="GitHub Contributions"
            >
              {({ activity, dayIndex, weekIndex }) => (
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <g data-slot="tooltip-trigger" />
                    }
                  >
                    <ContributionGraphBlock
                      activity={activity}
                      dayIndex={dayIndex}
                      weekIndex={weekIndex}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    {activity.count} contribuciones, {formatTooltipDate(activity.date)}
                  </TooltipContent>
                </Tooltip>
              )}
            </ContributionGraphCalendar>
          </TooltipProvider>

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

      <div className="h-px" />
    </Panel>
  )
}
