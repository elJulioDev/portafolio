"use client"

import React from "react"
import type { Route } from "next"
import Link from "next/link"
import type { NavItem } from "@/types/nav"
import { cn } from "@/lib/utils"
import { useScrollToHash } from "@/hooks/use-scroll-to-hash"

export function Nav({
  items,
  activeId,
  className,
}: {
  items: NavItem<Route>[]
  activeId?: string
  className?: string
}) {
  return (
    <nav
      data-active-id={activeId}
      className={cn("flex items-center gap-4", className)}
    >
      {items.map(({ title, href }) => {
        const isActive = activeId === href.toString()
        return (
          <NavItem
            key={href.toString()}
            href={href}
            aria-current={isActive ? "page" : undefined}
          >
            {title}
          </NavItem>
        )
      })}
    </nav>
  )
}

export function NavItem({
  className,
  href,
  onClick,
  ...props
}: React.ComponentProps<typeof Link>) {
  const scrollToHash = useScrollToHash()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (scrollToHash(href.toString())) {
      e.preventDefault()
    }
    if (onClick) onClick(e)
  }

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={cn(
        "text-sm font-medium tracking-wide text-muted-foreground transition-[color] hover:text-foreground aria-[current=page]:text-foreground",
        className
      )}
      {...props}
    />
  )
}