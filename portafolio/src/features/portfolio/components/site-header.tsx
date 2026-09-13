"use client"

import Link from "next/link"
import dynamic from "next/dynamic"

import { MAIN_NAV } from "@/config/site"
import { Separator } from "@/components/ui/separator"
import { ElJulioDevMark } from "@/components/eljuliodev-mark"
import { NavDesktop } from "@/components/nav-desktop"
import { NavItemGitHub } from "@/components/nav-item-github"
import { ThemeToggle } from "@/components/theme-toggle"

const CommandMenu = dynamic(() => import("@/components/command-menu"))

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="screen-line-top screen-line-bottom mx-auto flex h-(--header-height) items-center gap-2 border-x screen-line-bottom-border px-2 pl-4 sm:gap-4 md:max-w-3xl">
        <Link href="/" aria-label="Home">
          <ElJulioDevMark className="h-6 shrink-0" />
        </Link>

        <div className="flex-1" />

        <NavDesktop items={MAIN_NAV} />

        <div className="flex items-center max-sm:*:data-[slot=command-menu-trigger]:hidden">
          <Separator
            orientation="vertical"
            className="mr-2 max-sm:hidden data-vertical:h-5 data-vertical:self-center"
          />
          <CommandMenu />
          <Separator
            orientation="vertical"
            className="mx-2 max-sm:hidden data-vertical:h-5 data-vertical:self-center"
          />
          <NavItemGitHub />
          <Separator
            orientation="vertical"
            className="mx-2 data-vertical:h-5 data-vertical:self-center"
          />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}