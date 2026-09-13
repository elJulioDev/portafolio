"use client"

import { useRef, useState } from "react"

import { Panel, PanelHeader, PanelTitle } from "./panel"
import { Tag } from "./tag"
import { EXPERIENCES } from "../data/experiences"
import {
  ChevronsUpDownIcon,
  type ChevronsUpDownIconHandle,
} from "@/components/animated-icons/chevrons-up-down-icon"

function CodeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  )
}

function LightbulbIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>
  )
}

function DesignIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="2" />
      <path d="m12.99 6.74 1.93 3.44" />
      <path d="M19.136 12a10 10 0 0 1-14.271 0" />
      <path d="m21 21-2.16-3.84" />
      <path d="m3 21 8.02-14.26" />
    </svg>
  )
}

function ChartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" />
      <path d="m19 9-5 5-4-4-3 3" />
    </svg>
  )
}

const ICONS = {
  code: CodeIcon,
  lightbulb: LightbulbIcon,
  design: DesignIcon,
  chart: ChartIcon,
}

function parseDescription(text: string) {
  const parts: Array<{ type: "paragraph" | "bold" | "list"; content: string | string[] }> = []
  const lines = text.split("\n")
  let inList = false
  let listItems: string[] = []

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) {
      if (inList && listItems.length > 0) {
        parts.push({ type: "list", content: listItems })
        listItems = []
        inList = false
      }
      continue
    }

    if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
      if (inList && listItems.length > 0) {
        parts.push({ type: "list", content: listItems })
        listItems = []
        inList = false
      }
      parts.push({ type: "bold", content: trimmed.slice(2, -2) })
    } else if (trimmed.startsWith("•")) {
      inList = true
      listItems.push(trimmed.slice(1).trim())
    } else {
      if (inList && listItems.length > 0) {
        parts.push({ type: "list", content: listItems })
        listItems = []
        inList = false
      }
      parts.push({ type: "paragraph", content: trimmed })
    }
  }

  if (inList && listItems.length > 0) {
    parts.push({ type: "list", content: listItems })
  }

  return parts
}

function Description({ text }: { text: string }) {
  const parts = parseDescription(text)

  return (
    <div className="pl-9 text-sm text-muted-foreground space-y-2 pt-2">
      {parts.map((part, i) => {
        if (part.type === "paragraph") {
          return <p key={i}>{part.content}</p>
        }
        if (part.type === "bold") {
          return <p key={i} className="font-medium text-foreground">{part.content}</p>
        }
        if (part.type === "list") {
          return (
            <ul key={i} className="list-disc space-y-1 pl-4">
              {(part.content as string[]).map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ul>
          )
        }
        return null
      })}
    </div>
  )
}

const MAX = 3

export function Experiences() {
  const [open, setOpen] = useState(false)
  const [expandedPositions, setExpandedPositions] = useState<Set<string>>(new Set())
  const chevronRefs = useRef<Map<string, ChevronsUpDownIconHandle>>(new Map())

  const visibleExperiences = open ? EXPERIENCES : EXPERIENCES.slice(0, MAX)
  const hasMore = EXPERIENCES.length > MAX

  const togglePosition = (key: string) => {
    const chevron = chevronRefs.current.get(key)
    if (expandedPositions.has(key)) {
      chevron?.stopAnimation()
    } else {
      chevron?.startAnimation()
    }

    setExpandedPositions((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  return (
    <Panel id="experience">
      <PanelHeader>
        <PanelTitle>
          <a href="#experience">Experiencia</a>
        </PanelTitle>
      </PanelHeader>

      {visibleExperiences.map((exp, i) => (
        <div key={i} className="group/experience screen-line-bottom scroll-mt-14 space-y-4 bg-background p-4">
            <div className="flex items-start gap-3 sm:items-center">
              <div className="flex size-6 shrink-0 items-center justify-center select-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:text-muted-foreground [&_svg:not([class*='size-'])]:size-5">
                {exp.logo ? (
                  <img
                    alt={`${exp.company} logo`}
                    className="rounded-full grayscale transition-[filter] duration-300 ease-[cubic-bezier(0.42,0,0.58,1)] group-hover/experience:grayscale-0"
                    src={exp.logo}
                    width={24}
                    height={24}
                  />
                ) : (
                  <div className="flex size-6 items-center justify-center rounded-full bg-muted text-muted-foreground text-xs font-medium">
                    {exp.company.charAt(0)}
                  </div>
                )}
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-x-3 gap-y-1 pr-1 sm:flex-row sm:items-baseline sm:justify-between">
                <h3 className="text-xl/6 font-medium">
                  {exp.companyUrl ? (
                    <a className="link" href={exp.companyUrl} target="_blank" rel="noopener">
                      {exp.company}
                    </a>
                  ) : (
                    exp.company
                  )}
                </h3>

                <dl className="flex min-w-0 items-center gap-1.5 text-sm whitespace-nowrap text-muted-foreground">
                  <dt className="sr-only">Ubicación</dt>
                  <dd className="truncate">{exp.location}</dd>
                  <dt className="sr-only">Tipo de ubicación</dt>
                  <dd>({exp.locationType})</dd>
                  {exp.status && (
                    <>
                      <dt className="sr-only">Estado</dt>
                      <dd>
                        <span className="sr-only">Actual</span>
                        <span className="relative flex size-2.5 translate-x-px translate-y-px items-center justify-center">
                          <span className="absolute inline-flex size-2.5 animate-ping rounded-full bg-info opacity-50" />
                          <span className="relative inline-flex size-1.5 rounded-full bg-info" />
                        </span>
                      </dd>
                    </>
                  )}
                </dl>
              </div>
            </div>

            <div className="relative space-y-4 before:absolute before:left-3 before:h-full before:w-px before:bg-border">
              {exp.positions.map((pos, j) => {
                const Icon = ICONS[pos.icon]
                const posKey = `${i}-${j}`
                const isExpanded = expandedPositions.has(posKey)
                const hasDescription = !!pos.description

                return (
                  <div key={j} className="group/experience-position relative">
                    <div className="pointer-events-none absolute bottom-0 left-3 hidden size-4 bg-background group-last/experience-position:flex">
                      <span className="size-full -translate-y-2.25 rounded-bl-sm border-b border-l" />
                    </div>

                    {hasDescription ? (
                      <div data-slot="collapsible" data-closed={!isExpanded} className="group/experience-position relative">
                        <button
                          type="button"
                          data-slot="collapsible-trigger"
                          onClick={() => togglePosition(posKey)}
                          className="group block w-full text-left relative before:absolute before:-top-1 before:-right-1 before:-bottom-1.5 before:left-7 before:rounded-lg before:transition-[background-color] before:ease-out hover:before:bg-accent-muted outline-none focus-visible:before:inset-ring-2 focus-visible:before:inset-ring-ring/50"
                        >
                          <div className="relative z-1 mb-1 flex items-start gap-3 text-base">
                            <div data-slot="icon-tile" className="flex size-6 shrink-0 items-center justify-center rounded-md select-none border border-muted-foreground/15 bg-muted text-muted-foreground ring-1 ring-border/50 ring-offset-1 ring-offset-background dark:ring-line [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
                              <Icon className="size-4" />
                            </div>
                            <h4 className="flex-1 font-medium text-balance">{pos.title}</h4>
                            <div className="shrink-0 text-muted-foreground group-data-disabled:hidden [&_svg]:h-lh [&_svg]:w-4">
                              <ChevronsUpDownIcon
                                ref={(el) => {
                                  if (el) chevronRefs.current.set(posKey, el)
                                }}
                                duration={0.15}
                              />
                            </div>
                          </div>

                          <dl className="flex items-center gap-2 pl-9 text-sm text-muted-foreground relative z-1">
                            <div>
                              <dt className="sr-only">Tipo de empleo</dt>
                              <dd>{pos.employmentType}</dd>
                            </div>
                            <div data-orientation="vertical" role="separator" aria-orientation="vertical" data-slot="separator" aria-hidden="true" className="shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:h-4 data-vertical:self-center" />
                            <div>
                              <dt className="sr-only">Período</dt>
                              <dd className="flex items-center gap-0.5 tabular-nums">
                                <span>{pos.period}</span>
                              </dd>
                            </div>
                            <div data-orientation="vertical" role="separator" aria-orientation="vertical" data-slot="separator" aria-hidden="true" className="shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:h-4 data-vertical:self-center" />
                            <div>
                              <dt className="sr-only">Duración</dt>
                              <dd className="tabular-nums">{pos.duration}</dd>
                            </div>
                          </dl>
                        </button>

                        {isExpanded && (
                          <Description text={pos.description!} />
                        )}

                        {pos.tags && pos.tags.length > 0 && (
                          <ul className="flex flex-wrap gap-1.5 pt-3 pl-9">
                            {pos.tags.map((tag) => (
                              <Tag key={tag}>{tag}</Tag>
                            ))}
                          </ul>
                        )}
                      </div>
                    ) : (
                      <div className="group/experience-position relative">
                        <div className="relative z-1 mb-1 flex items-start gap-3 text-base">
                          <div data-slot="icon-tile" className="flex size-6 shrink-0 items-center justify-center rounded-md select-none border border-muted-foreground/15 bg-muted text-muted-foreground ring-1 ring-border/50 ring-offset-1 ring-offset-background dark:ring-line [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
                            <Icon className="size-4" />
                          </div>
                          <h4 className="flex-1 font-medium text-balance">{pos.title}</h4>
                        </div>

                        <dl className="flex items-center gap-2 pl-9 text-sm text-muted-foreground">
                          <div>
                            <dt className="sr-only">Tipo de empleo</dt>
                            <dd>{pos.employmentType}</dd>
                          </div>
                          <div data-orientation="vertical" role="separator" aria-orientation="vertical" data-slot="separator" aria-hidden="true" className="shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:h-4 data-vertical:self-center" />
                          <div>
                            <dt className="sr-only">Período</dt>
                            <dd className="flex items-center gap-0.5 tabular-nums">
                              <span>{pos.period}</span>
                            </dd>
                          </div>
                          <div data-orientation="vertical" role="separator" aria-orientation="vertical" data-slot="separator" aria-hidden="true" className="shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:h-4 data-vertical:self-center" />
                          <div>
                            <dt className="sr-only">Duración</dt>
                            <dd className="tabular-nums">{pos.duration}</dd>
                          </div>
                        </dl>

                        {pos.tags && pos.tags.length > 0 && (
                          <ul className="flex flex-wrap gap-1.5 pt-3 pl-9">
                            {pos.tags.map((tag) => (
                              <Tag key={tag}>{tag}</Tag>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}

      {hasMore && (
        <div className="-mt-px flex items-center justify-center py-4">
          <button
            onClick={() => setOpen(!open)}
            className="inline-flex items-center gap-1.5 rounded-[min(var(--radius-lg),10px)] bg-secondary px-2.5 py-1.5 text-sm text-secondary-foreground shadow-[inset_0_0_1px] shadow-foreground/20 transition-colors hover:bg-secondary/80"
          >
            <span>{open ? "Show less" : "Show more"}</span>
            <div className="shrink-0 text-muted-foreground [&_svg]:h-lh [&_svg]:w-4">
              <ChevronsUpDownIcon duration={0.15} />
            </div>
          </button>
        </div>
      )}
    </Panel>
  )
}
