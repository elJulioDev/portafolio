"use client"

import { useState } from "react"

import { Panel, PanelHeader, PanelTitle } from "./panel"
import { Tag } from "./tag"
import { EXPERIENCES } from "../data/experiences"

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

const MAX = 3

export function Experiences() {
  const [open, setOpen] = useState(false)

  const visibleExperiences = open ? EXPERIENCES : EXPERIENCES.slice(0, MAX)
  const hasMore = EXPERIENCES.length > MAX

  return (
    <Panel id="experience">
      <PanelHeader>
        <PanelTitle>
          <a href="#experience">Experiencia</a>
        </PanelTitle>
      </PanelHeader>

      <div className="pr-2 pl-4">
        {visibleExperiences.map((exp, i) => (
          <div key={i} className="border-b border-line py-4 last:border-none">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex-1">
                <h3 className="text-sm font-medium">{exp.company}</h3>
                <p className="text-xs text-muted-foreground">
                  {exp.location} · {exp.locationType}
                </p>
              </div>
            </div>

            {exp.positions.map((pos, j) => (
              <div key={j} className="space-y-2 mt-2">
                <div className="flex items-baseline justify-between gap-2">
                  <h4 className="text-sm font-medium text-foreground">
                    {pos.title}
                  </h4>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {pos.period}
                  </span>
                </div>

                {pos.employmentType && (
                  <p className="text-xs text-muted-foreground">
                    {pos.employmentType}
                  </p>
                )}

                {pos.bullets && pos.bullets.length > 0 && (
                  <ul className="list-disc space-y-1 pl-4 text-sm">
                    {pos.bullets.map((b, k) => (
                      <li key={k}>{b}</li>
                    ))}
                  </ul>
                )}

                {pos.tags && pos.tags.length > 0 && (
                  <ul className="flex flex-wrap gap-1.5 pt-1">
                    {pos.tags.map((tag) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="screen-line-top -mt-px flex items-center justify-center py-4">
          <button
            onClick={() => setOpen(!open)}
            className="inline-flex items-center gap-2 rounded-lg bg-secondary px-3 py-1.5 text-sm text-secondary-foreground shadow-[inset_0_0_1px] shadow-foreground/20 transition-colors hover:bg-secondary/80"
          >
            <span>{open ? "Show less" : "Show more"}</span>
            <ChevronDownIcon className={`size-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
          </button>
        </div>
      )}
    </Panel>
  )
}
