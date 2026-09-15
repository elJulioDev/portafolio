"use client"

import { useRef, useState } from "react"
import { GraduationCapIcon, InfinityIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { IconTile } from "./icon-tile"
import { Tag } from "./tag"
import { Separator } from "./separator"
import { ChevronsUpDownIcon, type ChevronsUpDownIconHandle } from "@/components/animated-icons/chevrons-up-down-icon"
import { EDUCATION, type Education } from "@/features/portfolio/data/education"
import {
  Panel,
  PanelHeader,
  PanelTitle,
} from "./panel"
import { PanelTitleCopy } from "./panel-title-copy"

const ID = "education"

export function Education() {
  const [expandedPositions, setExpandedPositions] = useState<Set<string>>(new Set())
  const chevronRefs = useRef<Map<string, ChevronsUpDownIconHandle>>(new Map())

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
    <Panel id={ID}>
      <PanelHeader>
        <PanelTitle>
          <a href={`#${ID}`}>Education</a>
          <PanelTitleCopy id={ID} />
        </PanelTitle>
      </PanelHeader>

      {EDUCATION.map((item, i) => {
        const isExpanded = expandedPositions.has(item.id)
        const hasDescription = !!item.description

        return (
          <div key={i} className="group/education screen-line-bottom scroll-mt-14 space-y-4 bg-background p-4">
            <div className="relative before:absolute before:left-3 before:h-full before:w-px before:bg-border">
              <div
                className="pointer-events-none absolute bottom-0 left-3 hidden size-4 bg-background group-last/education:flex"
                aria-hidden
              >
                <span className="size-full -translate-y-2.25 rounded-bl-sm border-b border-l" />
              </div>
              <div data-slot="collapsible" className="group/education-item relative">
                <div key={item.id} id={`education-${item.id}`}>
                  {hasDescription ? (
                    <div data-closed={!isExpanded} className="group/education-item relative">
                      <button
                        type="button"
                        data-slot="collapsible-trigger"
                        onClick={() => togglePosition(item.id)}
                        className={cn(
                          "group block w-full text-left",
                          "relative before:absolute before:-top-1 before:-right-1 before:-bottom-1.5 before:left-7 before:rounded-lg before:transition-[background-color] before:ease-out hover:before:bg-accent-muted",
                          "outline-none focus-visible:before:inset-ring-2 focus-visible:before:inset-ring-ring/50"
                        )}
                      >
                        <div className="relative z-1 mb-1 flex items-start gap-3 text-base">
                          <IconTile>
                            <GraduationCapIcon />
                          </IconTile>

                          <h3 className="flex-1 font-medium text-balance">{item.school}</h3>

                          <div className="shrink-0 text-muted-foreground group-data-disabled:hidden [&_svg]:h-lh [&_svg]:w-4">
                            <ChevronsUpDownIcon
                              ref={(el) => {
                                if (el) chevronRefs.current.set(item.id, el)
                              }}
                              duration={0.15}
                            />
                          </div>
                        </div>

                        <dl className="flex flex-wrap items-center gap-x-2 pl-9 text-sm text-muted-foreground relative z-1">
                          <div>
                            <dt className="sr-only">Study period</dt>
                            <dd className="flex items-center gap-0.5 tabular-nums">
                              <span>{item.period.start}</span>
                              <span className="font-mono">—</span>
                              {item.period.end ? (
                                <span>{item.period.end}</span>
                              ) : (
                                <InfinityIcon
                                  className="size-4.5 translate-y-[0.5px]"
                                  aria-label="Present"
                                  strokeWidth={1.5}
                                />
                              )}
                            </dd>
                          </div>

                          {item.location && (
                            <>
                              <Separator
                                className="data-vertical:h-4 data-vertical:self-center"
                                orientation="vertical"
                                aria-hidden
                              />
                              <div>
                                <dt className="sr-only">Location</dt>
                                <dd>{item.location}</dd>
                              </div>
                            </>
                          )}

                          {item.degree && (
                            <>
                              <Separator
                                className="data-vertical:h-4 data-vertical:self-center"
                                orientation="vertical"
                                aria-hidden
                              />
                              <div>
                                <dt className="sr-only">Degree</dt>
                                <dd>{item.degree}</dd>
                              </div>
                            </>
                          )}

                          {item.fieldOfStudy && (
                            <>
                              <Separator
                                className="data-vertical:h-4 data-vertical:self-center"
                                orientation="vertical"
                                aria-hidden
                              />
                              <div>
                                <dt className="sr-only">Field of study</dt>
                                <dd>{item.fieldOfStudy}</dd>
                              </div>
                            </>
                          )}
                        </dl>
                      </button>

                      <div className={`overflow-hidden transition-all duration-200 ${isExpanded ? "max-h-96" : "max-h-0"}`}>
                        {item.description && (
                          <div className="typeset typeset-description pt-3 pb-1 pl-9 text-sm text-muted-foreground">
                            <p>{item.description}</p>
                          </div>
                        )}
                      </div>

                      {Array.isArray(item.skills) && item.skills.length > 0 && (
                        <ul className="flex flex-wrap gap-1.5 pt-3 pl-9">
                          {item.skills.map((skill, index) => (
                            <Tag key={index}>{skill}</Tag>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <div className="group/education-item relative">
                      <div className="relative z-1 mb-1 flex items-start gap-3 text-base">
                        <IconTile>
                          <GraduationCapIcon />
                        </IconTile>

                        <h3 className="flex-1 font-medium text-balance">{item.school}</h3>
                      </div>

                      <dl className="flex flex-wrap items-center gap-x-2 pl-9 text-sm text-muted-foreground">
                        <div>
                          <dt className="sr-only">Study period</dt>
                          <dd className="flex items-center gap-0.5 tabular-nums">
                            <span>{item.period.start}</span>
                            <span className="font-mono">—</span>
                            {item.period.end ? (
                              <span>{item.period.end}</span>
                            ) : (
                              <InfinityIcon
                                className="size-4.5 translate-y-[0.5px]"
                                aria-label="Present"
                                strokeWidth={1.5}
                              />
                            )}
                          </dd>
                        </div>

                        {item.location && (
                          <>
                            <Separator
                              className="data-vertical:h-4 data-vertical:self-center"
                              orientation="vertical"
                              aria-hidden
                            />
                            <div>
                              <dt className="sr-only">Location</dt>
                              <dd>{item.location}</dd>
                            </div>
                          </>
                        )}

                        {item.degree && (
                          <>
                            <Separator
                              className="data-vertical:h-4 data-vertical:self-center"
                              orientation="vertical"
                              aria-hidden
                            />
                            <div>
                              <dt className="sr-only">Degree</dt>
                              <dd>{item.degree}</dd>
                            </div>
                          </>
                        )}

                        {item.fieldOfStudy && (
                          <>
                            <Separator
                              className="data-vertical:h-4 data-vertical:self-center"
                              orientation="vertical"
                              aria-hidden
                            />
                            <div>
                              <dt className="sr-only">Field of study</dt>
                              <dd>{item.fieldOfStudy}</dd>
                            </div>
                          </>
                        )}
                      </dl>

                      {Array.isArray(item.skills) && item.skills.length > 0 && (
                        <ul className="flex flex-wrap gap-1.5 pt-3 pl-9">
                          {item.skills.map((skill, index) => (
                            <Tag key={index}>{skill}</Tag>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </Panel>
  )
}