"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { Separator } from "./separator"
import { SOCIAL_LINKS } from "../data/social-links"
import { FOOTER_INFO } from "../data/footer"
import { siteConfig } from "@/config/site"

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="m22.991 23-8.533-12.612L22.42 1h-2.77l-6.422 7.575L8.105 1H1.123l8.225 12.158L1 23h2.77l6.81-8.03L16.015 23H23zM7.193 2.769l12.49 18.462h-2.76L4.43 2.769z" />
    </svg>
  )
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 0C5.37 0 0 5.372 0 11.997 0 17.3 3.438 21.795 8.205 23.38c.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.725-4.042-1.609-4.042-1.609C4.422 17.77 3.633 17.4 3.633 17.4c-1.087-.744.084-.73.084-.73 1.205.085 1.838 1.237 1.838 1.237 1.07 1.834 2.809 1.304 3.495.997.108-.775.417-1.304.76-1.604-2.665-.3-5.466-1.332-5.466-5.929 0-1.31.465-2.38 1.235-3.219-.135-.303-.54-1.523.105-3.175 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.006 2.04.138 3 .404 2.28-1.551 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.608-2.805 5.623-5.475 5.918.42.36.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.284 0 .315.21.69.825.57C20.565 21.79 24 17.291 24 11.997 24 5.372 18.627 0 12 0" />
    </svg>
  )
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M22.274 0H1.728C.692 0 0 .685 0 1.715v20.569C0 23.316.864 24 1.727 24h20.546C23.31 24 24 23.315 24 22.285V1.716C24.001.684 23.31 0 22.274 0M7.08 20.4H3.454V8.915h3.625zM5.352 7.371c-1.209 0-2.07-.856-2.07-2.056s.863-2.059 2.07-2.059c1.21 0 2.073.859 2.073 2.059S6.388 7.37 5.352 7.37M20.548 20.4h-3.626v-5.485c0-1.371 0-3.087-1.9-3.087-1.898 0-2.073 1.372-2.073 2.916V20.4H9.325V8.915h3.454v1.541c.69-1.2 2.073-1.885 3.453-1.885 3.627 0 4.316 2.4 4.316 5.485z" />
    </svg>
  )
}

function DmcaIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 85 24" fill="currentColor" aria-hidden>
      <path d="M22.689 5.234 21.056 3.6l-1.104 1.104a11.5 11.5 0 1 0 3.046 7.78c.001-2.086-.572-4.132-1.656-5.915l1.347-1.335Zm-1.965 7.24a9.236 9.236 0 1 1-2.328-6.158l-7.979 7.978-3.785-3.785-1.688 1.622 5.419 5.418 9.312-9.313a9.156 9.156 0 0 1 1.05 4.237ZM30.852 14h-4.854V0h4.595c.6-.004 1.198.03 1.792.104.553.068 1.098.2 1.622.392a5.644 5.644 0 0 1 2.737 2.084 7.299 7.299 0 0 1 1.25 4.328c0 4.72-2.381 7.084-7.142 7.092Zm2.795-9.786a3.089 3.089 0 0 0-2.535-1.105h-1.577v7.737h1.577a3.142 3.142 0 0 0 2.602-1.072c.57-.808.844-1.787.777-2.773a4.34 4.34 0 0 0-.844-2.787Zm18.184 9.74.097-10.511-2.853 10.511h-2.24L44.001 3.444 44.1 13.92h-3.101V0h4.307l2.628 9.18L50.528 0h4.47v14l-3.167-.046Zm19.166-5.236a6.75 6.75 0 0 1-2.49 3.827 7.303 7.303 0 0 1-9.413-.562 6.621 6.621 0 0 1-2.093-5.03 6.62 6.62 0 0 1 2.071-4.952A6.964 6.964 0 0 1 64.11.004a6.733 6.733 0 0 1 5.963 3.2c.466.658.782 1.411.925 2.205H67.36a3.307 3.307 0 0 0-3.306-2.349 3.36 3.36 0 0 0-2.634 1.18 4.05 4.05 0 0 0-.96 2.713 4.127 4.127 0 0 0 .992 2.78 3.305 3.305 0 0 0 2.658 1.224 3.406 3.406 0 0 0 3.25-2.271l3.637.032ZM81.148 14l-.719-2.026h-4.842L74.845 14h-3.848l5.63-14h2.833l5.537 14h-3.849Zm-3.07-9.671-1.451 4.802h2.889l-1.439-4.802ZM25.997 24v-6.998h2.463c.334-.008.668.014 1 .067.289.045.565.156.81.326.22.18.4.411.526.675.131.3.2.626.2.957a2.199 2.199 0 0 1-.537 1.508 2.417 2.417 0 0 1-1.915.619H26.86V24h-.863Zm.863-3.669h1.694c.422.044.843-.076 1.19-.336.25-.234.383-.58.357-.935a1.334 1.334 0 0 0-.21-.754.94.94 0 0 0-.547-.416 4.084 4.084 0 0 0-.81-.056H26.86v2.497Zm6.137 3.635v-6.963h3.01a3.99 3.99 0 0 1 1.391.19c.319.126.585.359.756.66.187.32.285.683.285 1.053a1.78 1.78 0 0 1-.472 1.254 2.372 2.372 0 0 1-1.445.639c.192.093.372.21.536.347.288.277.541.59.757.929l1.182 1.892h-1.095l-.898-1.445c-.204-.33-.423-.652-.657-.962a1.73 1.73 0 0 0-.449-.46 1.378 1.378 0 0 0-.416-.19 2.557 2.557 0 0 0-.504 0h-1.062V24l-.92-.034Zm.92-3.884h1.937c.327.012.653-.033.964-.134.213-.08.396-.224.526-.415a1.138 1.138 0 0 0-.311-.367Z" />
    </svg>
  )
}

function ChanhDaiMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" aria-hidden>
      <path
        fill="currentColor"
        d="m77.4 86.7c3.6 1.9 7.8-1.5 6.7-5.4-2.1-7.6-4.1-15.9-5.1-18.9-0.7-2.2 0.3-4.5 2.4-5.5 5.2-2.5 11-6.2 13.9-8.2 1.6-1.1 2.4-3 2.1-5-0.4-2.6-2.9-4.3-5.5-4.1-3.6 0.3-8.3 0.6-12.8 0.8-2.4 0.1-4.5-1.7-4.8-4.1-1.4-14-4.1-30.7-20.5-30.9-18.8-0.2-27.1 16.9-30 31.3-0.4 2.2-2.5 3.7-4.8 3.6-3.9-0.2-7.8-0.5-10.9-0.7-2.6-0.2-5.1 1.5-5.5 4.1-0.3 2 0.5 3.9 2.1 5 3.2 2.2 9.9 6.6 15.5 8.9 1.5 0.7 2.6 2.1 2.7 3.8 0.3 4-0.8 14.5-2.4 23.9-0.7 4.1 4 7 7.4 4.5 2.6-1.9 5.3-3.4 7.3-3.4 6.2-0.1 10.8 8.9 18 8.4 7.2-0.5 11.5-9.6 17.8-9.9 1.9-0.2 4.1 0.6 6.4 1.8zm-36.1-51c-2.3 0-4.2-3.1-4.2-6.9 0-3.8 1.9-6.9 4.2-6.9 2.3 0 4.2 3.1 4.2 6.9 0 3.8-1.9 6.9-4.2 6.9zm8.4 12.7c-2.3 0-4.2-1.9-4.2-4.3 0-2.3 1.9-4.3 4.2-4.3 2.3 0 4.2 1.9 4.2 4.3-0.1 2.4-1.9 4.3-4.2 4.3zm8.4-12.7c-2.3 0-4.2-3.1-4.2-6.9 0-3.8 1.9-6.9 4.2-6.9 2.3 0 4.2 3.1 4.2 6.9-0.1 3.8-1.9 6.9-4.2 6.9z"
      />
    </svg>
  )
}

function Field({
  className,
  label,
  children,
}: {
  className?: string
  label: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col gap-1 bg-background px-4 py-3",
        className
      )}
    >
      <dt className="text-[0.625rem]/4 font-medium tracking-wider text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="text-sm">{children}</dd>
    </div>
  )
}

export function Footer() {
  const githubLink = SOCIAL_LINKS.find((s) => s.name === "github")!
  const linkedinLink = SOCIAL_LINKS.find((s) => s.name === "linkedin")!

  return (
    <footer className="max-w-screen overflow-x-clip px-2">
      <div className="mx-auto border-x group-has-data-[slot=layout-wide]/layout:container md:max-w-3xl">
        <div className="screen-line-top screen-line-bottom screen-line-top-border before:z-1">
          <div className="stripe-divider h-12" />
        </div>

        <div className="relative">
          <div className="screen-line-bottom flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-4 py-3 font-mono text-sm">
            <span className="font-medium">{siteConfig.name}</span>
            <span className="font-sans text-muted-foreground">
              {siteConfig.description}
            </span>
          </div>

          <dl className="grid grid-cols-2 gap-px bg-line font-mono md:grid-cols-4">
            <Field label="Crafted by">
              <a className="link-underline" href={githubLink.href} target="_blank" rel="noopener">
                @{githubLink.handle}
              </a>
            </Field>

            <Field label="Build">
              <span className="text-muted-foreground">unavailable</span>
            </Field>

            <Field label="Date">
              <time dateTime="2026-09-12">2026-09-12</time>
            </Field>

            <Field label="Projects">
              <span>5</span>
            </Field>

            <Field label="Deployed on">
              <span className="font-sans" aria-hidden>▲</span>
              <span className="sr-only">Vercel</span>
            </Field>

            <Field label="Source code">
              <a className="link-underline" href={FOOTER_INFO.sourceCodeUrl} target="_blank" rel="noopener">
                GitHub
              </a>
            </Field>

            <Field label="License">
              <a className="link-underline" href={FOOTER_INFO.licenseUrl} target="_blank" rel="noopener">
                {FOOTER_INFO.license}
              </a>
            </Field>

            <Field label="Certifications">
              <span>4</span>
            </Field>

            <Field className="col-span-2" label="Stack">
              <ul className="flex flex-col gap-0.5">
                {FOOTER_INFO.stack.map((entry) => (
                  <li key={entry.name}>{entry.name}@{entry.version}</li>
                ))}
              </ul>
            </Field>

            <Field className="col-span-2" label="Typeface">
              {FOOTER_INFO.typeface}
            </Field>

            <Field className="col-span-2 md:col-span-4" label="Inspired by">
              <ol className="grid grid-cols-2 gap-x-px gap-y-0.5 font-sans md:grid-cols-4">
                {FOOTER_INFO.inspiredBy.map((item, index) => (
                  <li key={item.name} className="flex gap-2 px-4">
                    <span className="font-mono text-muted-foreground/80" aria-hidden>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {item.name}
                  </li>
                ))}
              </ol>
            </Field>
          </dl>
        </div>

        <div className="screen-line-top h-4" />

        <div className="screen-line-top screen-line-bottom flex items-center gap-3 screen-line-bottom-border px-4 py-3 text-muted-foreground">
          <Link
            href="/"
            className="mr-auto text-muted-foreground transition-[color] hover:text-foreground"
            aria-label="Home"
          >
            <ChanhDaiMark className="h-4" />
          </Link>

          <a
            className="flex items-center transition-[color] hover:text-foreground"
            href="https://x.com/elJulioDev"
            target="_blank"
            rel="noopener"
            aria-label="X Profile"
          >
            <XIcon className="size-4" />
          </a>

          <Separator orientation="vertical" className="data-vertical:h-4 data-vertical:self-center" />

          <a
            className="flex items-center transition-[color] hover:text-foreground"
            href={githubLink.href}
            target="_blank"
            rel="noopener"
            aria-label="GitHub Profile"
          >
            <GitHubIcon className="size-4" />
          </a>

          <Separator orientation="vertical" className="data-vertical:h-4 data-vertical:self-center" />

          <a
            className="flex items-center transition-[color] hover:text-foreground"
            href={linkedinLink.href}
            target="_blank"
            rel="noopener"
            aria-label="LinkedIn Profile"
          >
            <LinkedInIcon className="size-4" />
          </a>

          <Separator orientation="vertical" className="data-vertical:h-4 data-vertical:self-center" />

          <a
            className="flex items-center transition-[color] hover:text-foreground"
            href="https://www.dmca.com/ProtectionPro.aspx"
            target="_blank"
            rel="noopener"
            aria-label="DMCA.com Protection Status"
          >
            <DmcaIcon className="h-4 w-auto" />
          </a>
        </div>
      </div>

      <div className="screen-line-bottom after:z-1 after:bg-foreground/15">
        <div className="overflow-hidden">
          <div className="flex w-full translate-y-[37.5%] items-center justify-center">
            <svg className="container size-full" viewBox="0 0 1410 258" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M129 33H161V65H129V33ZM33 33V1H129V33H33ZM33 225H1V33H33V225ZM129 225V257H33V225H129ZM129 225V193H161V225H129ZM193 1H225V65H321V97H225V257H193V1ZM321 97H353V257H321V97ZM417 65H545V257H513V225H481V193H513V97H417V65ZM417 225H385V97H417V225ZM417 225V257H481V225H417ZM577 65H705V97H609V257H577V65ZM705 97H737V257H705V97ZM769 1H801V65H897V97H801V257H769V1ZM897 97H929V257H897V97ZM961 1H1057V33H993V225H1057V257H961V1ZM1089 193V225H1057V193H1089ZM1089 65H1121V193H1089V65ZM1089 65V33H1057V65H1089ZM1185 65H1313V257H1281V225H1249V193H1281V97H1185V65ZM1185 225H1153V97H1185V225ZM1185 225V257H1249V225H1185ZM1377 1H1409V33H1377V1Z"
                fill="url(#paint0_linear_1145_73)"
              />
              <path d="M1345 65V97H1377V257H1409V65H1345Z" fill="url(#paint0_linear_1145_73)" />
              <path
                className="stroke-foreground/10"
                d="M129 33H161V65H129V33ZM129 33V1H33V33M129 33H33M33 33H1V225H33M33 33V225M33 225V257H129V225M33 225H129M129 225V193H161V225H129ZM321 97V65H225V1H193V257H225V97H321ZM321 97H353V257H321V97ZM481 225H513V257H545V65H417V97M481 225V193H513V97H417M481 225V257H417V225M481 225H417M417 97H385V225H417M417 97V225M705 97V65H577V257H609V97H705ZM705 97H737V257H705V97ZM897 97V65H801V1H769V257H801V97H897ZM897 97H929V257H897V97ZM1057 33V1H961V257H1057V225M1057 33H993V225H1057M1057 33H1089V65M1057 33V65H1089M1057 225H1089V193M1057 225V193H1089M1089 193H1121V65H1089M1089 193V65M1249 225H1281V257H1313V65H1185V97M1249 225V193H1281V97H1185M1249 225V257H1185V225M1249 225H1185M1185 97H1153V225H1185M1185 97V225M1377 1H1409V33H1377V1ZM1345 65V97H1377V257H1409V65H1345Z"
                strokeWidth="2"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_1145_73"
                  y1="1"
                  x2="705"
                  y2="258"
                  gradientUnits="userSpaceOnUse"
                  x1="705"
                >
                  <stop offset="0.625" stopColor="var(--foreground)" stopOpacity="0" />
                  <stop offset="1" stopColor="var(--foreground)" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        <div
          className="pointer-events-none absolute bottom-0 left-1/2 hidden h-px w-[50%] max-w-full -translate-x-1/2 dark:block"
          style={{
            background:
              "linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(255, 255, 255, 0) 0%, rgba(228, 228, 231, 0.3) 50%, rgba(0, 0, 0, 0) 100%)",
          }}
          aria-hidden
        />
      </div>

      <div className="h-(--fade-bottom-height)" />
      <div className="pb-[env(safe-area-inset-bottom,0)]" />
    </footer>
  )
}