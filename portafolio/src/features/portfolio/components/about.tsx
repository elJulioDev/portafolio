"use client"

import { useEffect, useState } from "react"

import { USER } from "../data/user"

function getGreeting() {
  const hour = parseInt(
    new Date().toLocaleString("es-CL", { timeZone: "America/Santiago", hour: "numeric", hour12: false }),
    10
  )
  if (hour >= 0 && hour < 12) return "Buenos días"
  if (hour >= 12 && hour < 17) return "Buenas tardes"
  return "Buenas noches"
}

export function About() {
  const [greeting, setGreeting] = useState("")

  useEffect(() => {
    setGreeting(getGreeting())
  }, [])

  return (
    <section
      data-slot="panel"
      className="screen-line-top screen-line-bottom border-x screen-line-bottom-border screen-line-bottom-none"
    >
      <header
        data-slot="panel-header"
        className="screen-line-bottom px-4 has-data-[slot=panel-description]:*:data-[slot=panel-title]:screen-line-bottom"
      >
        <h2 className="sr-only">Sobre mí</h2>
        <div
          data-slot="panel-title"
          className="group/panel-title text-3xl font-medium tracking-tight text-balance font-handwritten leading-none"
        >
          {greeting || "\u00A0"}
        </div>
      </header>

      <div data-slot="panel-body" className="p-4 bg-background">
        <div className="typeset typeset-description [&_li]:ps-0.5 [&_ul]:ps-3.5">
          <p>{USER.about}</p>
        </div>
      </div>

      <div className="screen-line-bottom h-px" />
      <div className="h-4" />
      <div className="screen-line-bottom h-px screen-line-bottom-border" />
    </section>
  )
}
