"use client"

import { Panel, PanelContent } from "./panel"
import { IconTile } from "./icon-tile"
import { USER } from "../data/user"

function MapPinIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  )
}

function GenderIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="14" r="5" />
      <path d="M19 5v7h-7" />
      <path d="M12 19l7-7" />
    </svg>
  )
}

function BriefcaseIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      <rect width="20" height="14" x="2" y="6" rx="2" />
    </svg>
  )
}

export function Overview() {
  return (
    <Panel className="screen-line-bottom-none">
      <h2 className="sr-only">Overview</h2>

      <PanelContent className="grid gap-x-4 gap-y-2.5 sm:grid-cols-2">
        {USER.roles.map((r, i) => (
          <div key={i} className="flex items-center gap-4 font-mono text-sm">
            <IconTile>
              <BriefcaseIcon />
            </IconTile>
            <p className="text-balance">
              {r.title} @{" "}
              <a href={r.anchor} className="link font-medium text-foreground">
                {r.company}
              </a>
            </p>
          </div>
        ))}

        <div className="flex items-center gap-4 font-mono text-sm">
          <IconTile>
            <MapPinIcon />
          </IconTile>
          <p className="text-balance">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(USER.location)}`}
              target="_blank"
              rel="noopener"
              className="link"
            >
              {USER.location}
            </a>
          </p>
        </div>

        <div className="flex items-center gap-4 font-mono text-sm">
          <IconTile>
            <MailIcon />
          </IconTile>
          <p>
            <a href={`mailto:${USER.email}`} className="link">
              {USER.email}
            </a>
          </p>
        </div>

        <div className="flex items-center gap-4 font-mono text-sm">
          <IconTile>
            <GitHubIcon />
          </IconTile>
          <p>
            <a
              href="https://github.com/elJulioDev"
              target="_blank"
              rel="noopener"
              className="link"
            >
              github.com/{USER.username}
            </a>
          </p>
        </div>

        <div className="flex items-center gap-4 font-mono text-sm">
          <IconTile>
            <GenderIcon />
          </IconTile>
          <p>{USER.pronoun}</p>
        </div>
      </PanelContent>

      <div className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-2.5 border-r border-dashed border-line max-sm:hidden" />
    </Panel>
  )
}
