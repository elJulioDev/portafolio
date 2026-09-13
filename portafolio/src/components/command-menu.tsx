"use client"

import React, { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { useHotkeys } from "react-hotkeys-hook"
import { Search } from "lucide-react"

import { MAIN_NAV } from "@/config/site"
import { ElJulioDevMark } from "@/components/eljuliodev-mark"
import { Button } from "@/components/ui/button"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command"

type CommandKind = "page" | "command"

type CommandLinkItem = {
  title: string
  href: string
  kind: CommandKind
  icon?: React.ReactElement
  shortcut?: string
}

const MENU_LINKS: CommandLinkItem[] = [
  {
    title: "Inicio",
    href: "/#inicio",
    kind: "page",
    icon: <ElJulioDevMark />,
    shortcut: "GH",
  },
  {
    title: "Stack",
    href: "/#tech-stack",
    kind: "page",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
    shortcut: "GS",
  },
  {
    title: "Experiencia",
    href: "/#experience",
    kind: "page",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    shortcut: "GE",
  },
  {
    title: "Proyectos",
    href: "/#projects",
    kind: "page",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="9" />
        <rect x="14" y="3" width="7" height="5" />
        <rect x="14" y="12" width="7" height="9" />
        <rect x="3" y="16" width="7" height="5" />
      </svg>
    ),
    shortcut: "GP",
  },
  {
    title: "Contacto",
    href: "/#contact",
    kind: "page",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    shortcut: "GC",
  },
]

const PORTFOLIO_LINKS: CommandLinkItem[] = [
  {
    title: "Inicio",
    href: "/#inicio",
    kind: "page",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  {
    title: "Stack",
    href: "/#tech-stack",
    kind: "page",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    title: "Experiencia",
    href: "/#experience",
    kind: "page",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    ),
  },
  {
    title: "Proyectos",
    href: "/#projects",
    kind: "page",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8" />
        <path d="M12 17v4" />
      </svg>
    ),
  },
]

function CommandMenuTrigger({ onClick }: { onClick: () => void }) {
  return (
    <Button
      data-slot="command-menu-trigger"
      className="gap-1.5 border-none px-1.5 text-muted-foreground will-change-[scale] select-none"
      variant="ghost"
      size="sm"
      onClick={onClick}
    >
      <Search className="size-4" />
      <span className="font-sans text-sm/4 font-medium sm:hidden">Buscar...</span>
      <KbdGroup className="hidden gap-0.75 sm:in-[.os-macos_&]:flex">
        <Kbd className="w-5 min-w-auto">⌘</Kbd>
        <Kbd className="w-5 min-w-auto">K</Kbd>
      </KbdGroup>
      <KbdGroup className="hidden gap-0.75 sm:not-[.os-macos_&]:flex">
        <Kbd>Ctrl</Kbd>
        <Kbd className="w-5 min-w-auto">K</Kbd>
      </KbdGroup>
    </Button>
  )
}

function CommandMenuInput() {
  return (
    <CommandInput placeholder="Escribe un comando o busca..." />
  )
}

function CommandMenuItem({
  children,
  onHighlight,
  ...props
}: React.ComponentProps<typeof CommandItem> & {
  onHighlight?: () => void
}) {
  return (
    <CommandItem {...props} onSelect={props.onSelect}>
      {children}
    </CommandItem>
  )
}

function CommandLinkGroup({
  heading,
  links,
  onLinkHighlight,
  onLinkSelect,
}: {
  heading: string
  links: CommandLinkItem[]
  onLinkHighlight: (link: CommandLinkItem) => void
  onLinkSelect: (href: string) => void
}) {
  return (
    <CommandGroup heading={heading}>
      {links.map((link) => (
        <CommandMenuItem
          key={link.href}
          onHighlight={() => onLinkHighlight(link)}
          onSelect={() => onLinkSelect(link.href)}
        >
          {link.icon}
          <p className="line-clamp-1">{link.title}</p>
          {link.shortcut && (
            <CommandShortcut className="font-mono tracking-[0.2em] max-sm:hidden">
              {link.shortcut}
            </CommandShortcut>
          )}
        </CommandMenuItem>
      ))}
    </CommandGroup>
  )
}

export default function CommandMenu() {
  const router = useRouter()
  const { setTheme, resolvedTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const [selectedCommandKind, setSelectedCommandKind] = useState<CommandKind | null>(null)

  useHotkeys(
    "mod+k, slash",
    (e) => {
      e.preventDefault()
      setOpen((open) => !open)
    },
    { enabled: true }
  )

  const handleOpenLink = useCallback(
    (href: string) => {
      setOpen(false)
      
      // Manejador para desplazamiento suave por hash
      if (href.includes("#")) {
        const hash = href.substring(href.indexOf("#"))
        const element = document.querySelector(hash)
        if (element) {
          element.scrollIntoView({ behavior: "smooth" })
          window.history.pushState(null, "", href)
          return
        }
      }
      
      router.push(href)
    },
    [router]
  )

  const createThemeHandler = useCallback(
    (theme: "light" | "dark" | "system") => () => {
      setOpen(false)
      setTheme(theme)
    },
    [setTheme]
  )

  const handleLinkHighlight = useCallback((link: CommandLinkItem) => {
    setSelectedCommandKind(link.kind)
  }, [])

  return (
    <>
      <CommandMenuTrigger
        onClick={() => setOpen(true)}
      />
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandMenuInput />
        <div className="rounded-xl bg-background ring-1 ring-border">
          <CommandList className="min-h-80">
            <CommandEmpty>No se encontraron resultados.</CommandEmpty>
            <CommandLinkGroup
              heading="Menú"
              links={MENU_LINKS}
              onLinkHighlight={handleLinkHighlight}
              onLinkSelect={handleOpenLink}
            />
            <CommandLinkGroup
              heading="Portafolio"
              links={PORTFOLIO_LINKS}
              onLinkHighlight={handleLinkHighlight}
              onLinkSelect={handleOpenLink}
            />
            <CommandGroup heading="Tema">
              <CommandMenuItem
                onHighlight={() => setSelectedCommandKind("command")}
                onSelect={createThemeHandler("light")}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2" />
                  <path d="M12 20v2" />
                  <path d="m4.93 4.93 1.41 1.41" />
                  <path d="m17.66 17.66 1.41 1.41" />
                  <path d="M2 12h2" />
                  <path d="M20 12h2" />
                  <path d="m6.34 17.66-1.41 1.41" />
                  <path d="m19.07 4.93-1.41 1.41" />
                </svg>
                Claro
              </CommandMenuItem>
              <CommandMenuItem
                onHighlight={() => setSelectedCommandKind("command")}
                onSelect={createThemeHandler("dark")}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4">
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
                Oscuro
              </CommandMenuItem>
              <CommandMenuItem
                onHighlight={() => setSelectedCommandKind("command")}
                onSelect={createThemeHandler("system")}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4">
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <path d="M8 21h8" />
                  <path d="M12 17v4" />
                </svg>
                Sistema
              </CommandMenuItem>
            </CommandGroup>
          </CommandList>
        </div>
        <div className="flex items-center justify-between gap-2 rounded-b-2xl px-4 text-xs font-medium">
          <ElJulioDevMark className="size-6 text-muted-foreground" />
          <div className="flex items-center gap-2 max-sm:hidden">
            <span>
              {selectedCommandKind === "page"
                ? "Ir a la página"
                : selectedCommandKind === "command"
                  ? "Ejecutar comando"
                  : "Navegar"}
            </span>
            <Kbd>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3">
                <path d="M21 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7" />
                <path d="M7 3h10a2 2 0 0 1 2 2v10" />
              </svg>
            </Kbd>
          </div>
        </div>
      </CommandDialog>
    </>
  )
}