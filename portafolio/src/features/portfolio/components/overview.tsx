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

function BriefcaseIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      <rect width="20" height="14" x="2" y="6" rx="2" />
    </svg>
  )
}

function GraduationCapIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  )
}

export function Overview() {
  return (
    <Panel className="screen-line-bottom-none">
      <h2 className="sr-only">Overview</h2>
      <PanelContent className="grid gap-x-4 gap-y-2.5 sm:grid-cols-2">
        <div className="flex items-center gap-4 font-mono text-sm">
          <IconTile>
            <BriefcaseIcon />
          </IconTile>
          <p className="text-balance">
            Desarrollador Full Stack / Freelance
          </p>
        </div>
        <div className="flex items-center gap-4 font-mono text-sm">
          <IconTile>
            <GraduationCapIcon />
          </IconTile>
          <p className="text-balance">
            Ingeniería en Informática · INACAP
          </p>
        </div>
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
      </PanelContent>
      <div className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-2.5 border-r border-dashed border-line max-sm:hidden" />
    </Panel>
  )
}