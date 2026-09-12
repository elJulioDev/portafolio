"use client"

import { USER } from "../data/user"

function VerifiedIcon() {
  return (
    <svg className="inline-block size-4 ml-1 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" />
    </svg>
  )
}

export function Overview() {
  return (
    <div className="space-y-6 border-x">
      {/* Fingerprint logo */}
      <div className="flex items-center justify-center pt-4">
        <div className="relative size-20 rounded-full bg-muted/50 flex items-center justify-center">
          <svg className="size-12 text-foreground/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 4" />
            <path d="M5 19.5C5.5 18 6 15 6 12c0-3.5 2.5-6 6-6 2 0 3.5 1 4.5 2" />
            <path d="M8 12c0-2 1-3.5 2.5-3.5S13 10 13 12c0 4-2 6-4 8" />
            <path d="M12 12c0 6-4 8-4 8" />
          </svg>
        </div>
      </div>

      {/* Biography */}
      <div className="typeset typeset-description space-y-3 px-4 pb-4">
        {USER.about.map((paragraph: string, i: number) => (
          <p key={i}>{paragraph}</p>
        ))}

        <p className="flex items-center gap-1">
          <span>@</span>
          <a href="https://github.com/elJulioDev" className="link-underline font-medium text-foreground" target="_blank" rel="noopener">
            {USER.username}
          </a>
          <VerifiedIcon />
        </p>
      </div>
    </div>
  )
}
