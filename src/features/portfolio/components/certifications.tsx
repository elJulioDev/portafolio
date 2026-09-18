"use client"

import { memo } from "react"

import { Panel, PanelHeader, PanelTitle } from "./panel"
import { CollapsibleList } from "./collapsible-list"
import { IconTile } from "./icon-tile"
import { CERTIFICATIONS } from "../data/certifications"

function ArrowUpRightIcon() {
  return (
    <svg className="size-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17 17 7" /><path d="M7 7h10v10" />
    </svg>
  )
}

const CertificationItem = memo(function CertificationItem({ certification }: { certification: typeof CERTIFICATIONS[number] }) {
  return (
    <div className="group bg-background">
      <div className="relative flex items-center pr-2 hover:bg-accent-muted transition-colors">
        <div className="mx-4">
          <IconTile>
            <span className="text-xs">☁</span>
          </IconTile>
        </div>
        <div className="flex-1 space-y-1 border-l border-dashed border-line p-4 pr-2">
        <h3 className="text-sm leading-snug font-medium text-balance">
          <a href={certification.url} target="_blank" rel="noopener">
            <span className="absolute inset-0" aria-hidden />
            {certification.title}
          </a>
        </h3>

        <dl className="flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
          <div>
            <dt className="sr-only">Issued by</dt>
            <dd>
              <span aria-hidden>@</span>
              <span className="ml-0.5">{certification.issuer.split(" — ")[0]}</span>
            </dd>
          </div>

          <div className="h-4 w-px bg-line" aria-hidden />

          <div>
            <dt className="sr-only">Issued on</dt>
            <dd>
              <time>{certification.date}</time>
            </dd>
          </div>
        </dl>
      </div>

      {certification.url && (
          <ArrowUpRightIcon />
        )}
      </div>
    </div>
  )
})

export function Certifications() {
  return (
    <Panel id="certs">
      <PanelHeader>
        <PanelTitle>
          <a href="#certs">Certificaciones</a>
          <sup className="top-[-0.75em] ml-1 text-sm font-medium tracking-normal text-muted-foreground">
            ({CERTIFICATIONS.length})
          </sup>
        </PanelTitle>
      </PanelHeader>

      <CollapsibleList
        items={CERTIFICATIONS}
        max={6}
        renderItem={(cert) => <CertificationItem certification={cert} />}
      />
    </Panel>
  )
}
