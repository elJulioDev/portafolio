"use client"

import React from "react"
import type { Route } from "next"
import Link from "next/link"
import type { NavItem } from "@/types/nav"
import { cn } from "@/lib/utils"

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
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const strHref = href.toString()
    const hashIndex = strHref.indexOf("#")
    
    // Smooth scroll automático si navegamos por un ID de la página actual
    if (hashIndex !== -1) {
      const hash = strHref.substring(hashIndex)
      const element = document.querySelector(hash)
      if (element) {
        e.preventDefault()
        element.scrollIntoView({ behavior: "smooth" })
        window.history.pushState(null, "", strHref)
      }
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