"use client"

import { useState } from "react"
import Image from "next/image"

import { Panel, PanelContent, PanelHeader, PanelTitle } from "./panel"
import { PROJECTS } from "../data/projects"

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`size-4 shrink-0 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
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
        {/* Icon/Logo */}
        <div className="mx-4 flex size-6 shrink-0 items-center justify-center rounded bg-muted text-muted-foreground">
          <span className="text-xs font-medium">
            {project.title.charAt(0)}
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-1 items-center gap-2 border-l border-dashed border-line p-4 pr-2">
          <div className="flex-1">
            <h3 className="mb-1 text-sm leading-snug font-medium text-balance">
              {project.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {project.techs.slice(0, 3).join(" · ")}
            </p>
          </div>

          {/* External link */}
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

          {/* Chevron */}
          <ChevronIcon open={open} />
        </div>
      </button>

      {/* Expanded content */}
      <div
        className={`overflow-hidden transition-all duration-200 ${open ? "max-h-96" : "max-h-0"}`}
      >
        <div className="space-y-4 border-t border-line p-4">
          <p className="typeset">{project.desc}</p>

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
                <li key={tech} className="flex">
                  <span className="inline-flex items-center rounded-md border border-border bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground">
                    {tech}
                  </span>
                </li>
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
          <a href="#projects">Proyectos</a>
          <sup className="top-[-0.75em] ml-1 text-sm font-medium tracking-normal text-muted-foreground">
            ({PROJECTS.length})
          </sup>
        </PanelTitle>
      </PanelHeader>

      <div className="relative py-4">
        {/* Background vertical lines */}
        <div className="pointer-events-none absolute inset-0 -z-1 grid grid-cols-1 gap-4 max-sm:hidden sm:grid-cols-2">
          <div className="border-r border-line" />
          <div className="border-l border-line" />
        </div>

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {PROJECTS.map((project) => (
            <li
              key={project.key}
              className="max-sm:screen-line-top max-sm:screen-line-bottom sm:nth-[2n+1]:screen-line-top sm:nth-[2n+1]:screen-line-bottom"
            >
              <ProjectItem project={project} />
            </li>
          ))}
        </ul>
      </div>
    </Panel>
  )
}
