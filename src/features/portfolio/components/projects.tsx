"use client"

import { memo, useMemo, useRef, useState } from "react"
import { ImageIcon, Warehouse, Clock, Gamepad2, Dumbbell, Brain, Keyboard, Swords, Landmark } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { Panel, PanelHeader, PanelTitle } from "./panel"
import { CollapsibleList } from "./collapsible-list"
import { IconTile } from "./icon-tile"
import { Tag } from "./tag"
import { PROJECTS } from "../data/projects"
import {
  ChevronsUpDownIcon,
  type ChevronsUpDownIconHandle,
} from "@/components/animated-icons/chevrons-up-down-icon"
import { useScrollToAligned } from "@/hooks/use-scroll-to-aligned"
import dynamic from "next/dynamic"
const Lightbox = dynamic(() => import("@/components/lightbox").then(m => m.Lightbox), {
  ssr: false
})

const MONTHS: Record<string, number> = {
  ene: 0, feb: 1, mar: 2, abr: 3, may: 4, jun: 5,
  jul: 6, ago: 7, sep: 8, oct: 9, nov: 10, dic: 11,
}

function parseDateToTimestamp(date?: string): number {
  if (!date) return 0
  // Handle ranges like "2018 - 2025" → use end year
  const rangeMatch = date.match(/\d{4}\s*-\s*(\d{4})/)
  const yearStr = rangeMatch ? rangeMatch[1] : date.match(/\d{4}/)?.[0]
  if (!yearStr) return 0
  const year = parseInt(yearStr, 10)
  const monthMatch = date.match(/(ene|feb|mar|abr|may|jun|jul|ago|sep|oct|nov|dic)/)
  const month = monthMatch ? MONTHS[monthMatch[1]] : 0
  return new Date(year, month).getTime()
}

const ICON_MAP: Record<string, LucideIcon> = {
  Warehouse,
  Clock,
  Gamepad2,
  Dumbbell,
  Brain,
  Keyboard,
  Swords,
  Landmark,
}

// Función para parsear texto enriquecido (igual que en experiencias)
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
    } else if (trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
      inList = true
      listItems.push(trimmed.slice(2).trim())
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

// Componente visual de la descripción
const Description = memo(function Description({ text }: { text: string }) {
  const parts = useMemo(() => parseDescription(text), [text])
  return (
    <div className="pl-9 text-sm text-muted-foreground space-y-2 pt-2">
      {parts.map((part, i) => {
        if (part.type === "paragraph") {
          return <p key={i}>{part.content}</p>
        }
        if (part.type === "bold") {
          return <p key={i} className="font-medium text-foreground mt-2">{part.content}</p>
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
})

const ProjectItem = memo(function ProjectItem({ project }: { project: typeof PROJECTS[number] }) {
  const [open, setOpen] = useState(false)
  const [lightbox, setLightbox] = useState<{ images: string[], index: number } | null>(null)
  const chevronRef = useRef<ChevronsUpDownIconHandle>(null)
  const itemRef = useRef<HTMLDivElement>(null)
  const scrollToAligned = useScrollToAligned()

  const toggleOpen = () => {
    const isExpanding = !open

    if (isExpanding) {
      chevronRef.current?.startAnimation()
    } else {
      chevronRef.current?.stopAnimation()
    }

    setOpen(!open)

    if (isExpanding) {
      scrollToAligned(itemRef.current)
    }
  }

  // Validación segura: comprobar si existe array y si tiene elementos
  const hasImages = project.images && project.images.length > 0
  const Icon = project.icon ? ICON_MAP[project.icon] : null

  return (
    <>
      <div ref={itemRef} className="group/project screen-line-bottom scroll-mt-14 space-y-4 bg-background p-4">
        <div className="relative before:absolute before:left-3 before:h-full before:w-px before:bg-border">
          
          <div className="pointer-events-none absolute bottom-0 left-3 hidden size-4 bg-background group-last/project:flex" aria-hidden="true">
            <span className="size-full -translate-y-2.25 rounded-bl-sm border-b border-l" />
          </div>

          <div data-slot="collapsible" data-closed={!open} className="group/project-item relative">
            <button
              type="button"
              data-slot="collapsible-trigger"
              onClick={toggleOpen}
              className="group block w-full text-left relative before:absolute before:-top-1 before:-right-1 before:-bottom-1.5 before:left-7 before:rounded-lg before:transition-[background-color] before:ease-out hover:before:bg-accent-muted outline-none focus-visible:before:inset-ring-2 focus-visible:before:inset-ring-ring/50"
            >
              <div className="relative z-1 mb-1 flex items-start gap-3 text-base">
                <IconTile>
                  {Icon ? (
                    <Icon className="size-4" />
                  ) : (
                    <span className="text-xs font-medium">{project.title.charAt(0)}</span>
                  )}
                </IconTile>
                <h3 className="flex-1 font-medium text-balance">{project.title}</h3>
                
                {/* Contenedor de iconos alineados a la derecha */}
                <div className="flex shrink-0 items-center gap-3 text-muted-foreground group-data-disabled:hidden">
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()} // Evita que se despliegue el acordeón al hacer clic en el enlace
                      className="hover:text-foreground transition-colors"
                      aria-label="Abrir repositorio"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-link pointer-events-none size-4" aria-hidden="true">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                      </svg>
                    </a>
                  )}
                  <div className="[&_svg]:h-lh [&_svg]:w-4">
                    <ChevronsUpDownIcon ref={chevronRef} duration={0.15} />
                  </div>
                </div>
              </div>

              {/* Subtítulo: Muestra la fecha del proyecto */}
              <dl className="flex items-center gap-2 pl-9 text-sm text-muted-foreground relative z-1">
                <div>
                  <dt className="sr-only">Fecha</dt>
                  <dd className="flex items-center gap-0.5 tabular-nums">
                    <span>{project.date || "2026"}</span>
                  </dd>
                </div>
              </dl>
            </button>

            {/* Contenido desplegable (Imágenes + Descripción Enriquecida) */}
            <div className={`overflow-hidden transition-all duration-200 ${open ? "max-h-[2000px]" : "max-h-0"}`}>
              {hasImages && (
                <div className="pl-9 pt-3">
                  <button
                    type="button"
                    onClick={() => setLightbox({ images: project.images || [], index: 0 })}
                    className="inline-flex items-center gap-2 rounded-md bg-secondary/50 px-3 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary border border-border/50"
                  >
                    <ImageIcon className="size-4" />
                    Ver imágenes ({project.images!.length})
                  </button>
                </div>
              )}
              <Description text={project.desc} />
            </div>

            {/* Tags de tecnologías renderizados por fuera del contenedor desplegable */}
            {project.techs.length > 0 && (
              <ul className="flex flex-wrap gap-1.5 pt-3 pl-9">
                {project.techs.map((tech) => (
                  <Tag key={tech}>{tech}</Tag>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {lightbox && (
        <Lightbox
          images={lightbox.images}
          index={lightbox.index}
          alt={project.title}
          onClose={() => setLightbox(null)}
        />
      )}
    </>
  )
})

export function Projects() {
  const sorted = useMemo(
    () => [...PROJECTS].sort((a, b) => parseDateToTimestamp(b.date) - parseDateToTimestamp(a.date)),
    []
  )

  return (
    <Panel id="projects">
      <PanelHeader>
        <PanelTitle>
          <a href="#projects">Proyectos</a>
          <sup className="top-[-0.75em] ml-1 text-sm font-medium tracking-normal text-muted-foreground">
            ({PROJECTS.length})
          </sup>
        </PanelTitle>
      </PanelHeader>

      <CollapsibleList
        items={sorted}
        max={4}
        renderItem={(project) => <ProjectItem project={project} />}
      />
    </Panel>
  )
}