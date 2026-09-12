import { Panel } from "./panel"
import { Separator } from "./separator"
import { siteConfig } from "@/config/site"
import { USER } from "../data/user"
import { SOCIAL_LINKS } from "../data/social-links"
import { FOOTER_INFO } from "../data/footer"

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  github: (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  email: (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
}

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener" className="link-underline text-foreground">
      {children}
    </a>
  )
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <dt className="text-xs text-muted-foreground">{title}</dt>
      <dd className="text-sm text-foreground">{children}</dd>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="mt-auto">
      <Panel_Wrapper />
    </footer>
  )
}

function Panel_Wrapper() {
  return (
    <>
      {/* Grid de metadata estilo chanhdai */}
      <div className="border-x border-line">
        <div className="screen-line-top screen-line-bottom px-4 py-6">
          <p className="text-sm font-medium text-foreground">{siteConfig.name}</p>
          <p className="mt-1 text-sm text-muted-foreground">{FOOTER_INFO.tagline}</p>
        </div>

        <dl className="grid grid-cols-2 gap-6 border-t border-line px-4 py-6 sm:grid-cols-4">
          <FooterCol title="Crafted by">
            <ExternalLink href={FOOTER_INFO.craftedByUrl}>@{FOOTER_INFO.craftedBy}</ExternalLink>
          </FooterCol>

          <FooterCol title="Build">
            <ExternalLink href={FOOTER_INFO.buildUrl}>{FOOTER_INFO.buildHash}</ExternalLink>
          </FooterCol>

          <FooterCol title="Date">{FOOTER_INFO.date}</FooterCol>

          <FooterCol title="Deployed on">
            <ExternalLink href={FOOTER_INFO.deployedOnUrl}>▲{FOOTER_INFO.deployedOn}</ExternalLink>
          </FooterCol>

          <FooterCol title="Source code">
            <ExternalLink href={FOOTER_INFO.sourceCodeUrl}>GitHub</ExternalLink>
          </FooterCol>

          <FooterCol title="License">
            <ExternalLink href={FOOTER_INFO.licenseUrl}>{FOOTER_INFO.license}</ExternalLink>
          </FooterCol>

          <FooterCol title="Typeface">
            <ExternalLink href={FOOTER_INFO.typefaceUrl}>{FOOTER_INFO.typeface}</ExternalLink>
          </FooterCol>

          <FooterCol title="Stack">
            <ul className="space-y-0.5">
              {FOOTER_INFO.stack.map((s) => (
                <li key={s.name}>
                  <ExternalLink href={s.url}>{s.name}</ExternalLink>
                  <span className="text-muted-foreground">@{s.version}</span>
                </li>
              ))}
            </ul>
          </FooterCol>

          <div className="col-span-2 space-y-1.5 sm:col-span-4">
            <dt className="text-xs text-muted-foreground">Inspired by</dt>
            <dd className="flex flex-wrap gap-x-1 text-sm text-foreground">
              {FOOTER_INFO.inspiredBy.map((item, i) => (
                <span key={item.name}>
                  <ExternalLink href={item.url}>{item.name}</ExternalLink>
                  {i < FOOTER_INFO.inspiredBy.length - 1 && <span className="text-muted-foreground">, </span>}
                </span>
              ))}
            </dd>
          </div>
        </dl>
      </div>

      {/* Social + firma */}
      <div className="py-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <span>{USER.name}</span>
            <span aria-hidden>·</span>
            <span>{USER.location}</span>
            <span aria-hidden>·</span>
            <span>@{USER.username}</span>
          </div>

          <div className="flex items-center justify-center gap-3">
            {SOCIAL_LINKS.map((item) => (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener"
                className="flex size-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground hover:border-foreground/20"
                aria-label={item.title}
              >
                {SOCIAL_ICONS[item.name]}
              </a>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground/50">
            <span>Crafted with</span>
            <span aria-label="love">♥</span>
            <span className="text-muted-foreground/70">by</span>
            <span className="text-muted-foreground">@{USER.username}</span>
          </div>
        </div>
      </div>
    </>
  )
}
