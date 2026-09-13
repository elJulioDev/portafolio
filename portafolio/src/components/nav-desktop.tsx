"use client"

import { useEffect, useState } from "react"
import type { Route } from "next"
import type { NavItem } from "@/types/nav"
import { Nav } from "@/components/nav"

export function NavDesktop({ items }: { items: NavItem<Route>[] }) {
  const [activeHash, setActiveHash] = useState<string>("")

  useEffect(() => {
    // Obtenemos todos los IDs a observar
    const sectionIds = items
      .map((item) => item.href.toString().split("#")[1])
      .filter(Boolean)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHash(`/#${entry.target.id}`)
          }
        })
      },
      {
        // El margen determina en qué punto de la pantalla se activa la "vista"
        rootMargin: "-100px 0px -50% 0px",
      }
    )

    sectionIds.forEach((id) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    // Chequeo inicial si el usuario entra directo por una URL con ancla (ej: /#projects)
    if (window.location.hash) {
      setActiveHash(`/${window.location.hash}`)
    } else {
      setActiveHash(items[0]?.href.toString() || "")
    }

    return () => observer.disconnect()
  }, [items])

  return <Nav className="max-sm:hidden" items={items} activeId={activeHash} />
}