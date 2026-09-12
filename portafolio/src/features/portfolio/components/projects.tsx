"use client"

import { useState } from "react"
import Image from "next/image"

import { Panel, PanelHeader, PanelTitle } from "./panel"
import { CollapsibleList } from "./collapsible-list"
import { IconTile } from "./icon-tile"
import { Tag } from "./tag"
import { PROJECTS } from "../data/projects"

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function LinkIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  )
}

function ProjectItem({ project }: { project: typeof PROJECTS[number] }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="group">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center text-left hover:bg-accent-muted transition-colors"
      >
        <div className="mx-4">
          <IconTile>
            <span className="text-xs font-medium">{project.title.charAt(0)}</span>
          </IconTile>
        </div>

        <div className="flex flex-1 items-center gap-2 border-l border-dashed border-line p-4 pr-2">
          <div className="flex-1">
            <h3 className="text-sm leading-snug font-medium text-balance">
              {project.title}
            </h3>
          </div>

          <a
            href={project.url}
            target="_blank"
            rel="noopener"
            className="relative flex size-6 shrink-0 items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            onClick={(e) => e.stopPropagation()}
            aria-label="Open project"
          >
            <LinkIcon />
          </a>

          <ChevronDownIcon
            className={`size-4 shrink-0 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      <div className={`overflow-hidden transition-all duration-200 ${open ? "max-h-96" : "max-h-0"}`}>
        <div className="space-y-4 border-t border-line p-4">
          <p className="typeset typeset-description">{project.desc}</p>

          {project.images.length > 0 && (
            <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
              <Image
                src={project.images[0]}
                alt={project.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          {project.techs.length > 0 && (
            <ul className="flex flex-wrap gap-1.5">
              {project.techs.map((tech) => (
                <Tag key={tech}>{tech}</Tag>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export function Projects() {
  return (
    <Panel id="projects">
      <PanelHeader>
        <PanelTitle>
          <a href="#projects">Projects</a>
          <sup className="top-[-0.75em] ml-1 text-sm font-medium tracking-normal text-muted-foreground">
            ({PROJECTS.length})
          </sup>
        </PanelTitle>
      </PanelHeader>

      <CollapsibleList
        items={PROJECTS}
        max={4}
        renderItem={(project) => <ProjectItem project={project} />}
      />
    </Panel>
  )
}
