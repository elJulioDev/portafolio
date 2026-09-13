"use client"

import { useEffect, useState } from "react"
import { USER } from "../data/user"

function getGreeting() {
  const now = new Date()
  
  const hour = parseInt(
    now.toLocaleString("es-CL", { timeZone: "America/Santiago", hour: "numeric", hourCycle: "h23" }),
    10
  )
  const month = parseInt(
    now.toLocaleString("es-CL", { timeZone: "America/Santiago", month: "numeric" }),
    10
  )

  const isSummer = month >= 9 || month <= 4
  const eveningStart = isSummer ? 21 : 19 

  if (hour >= 0 && hour < 12) return "Buenos días"
  if (hour >= 12 && hour < eveningStart) return "Buenas tardes"
  return "Buenas noches"
}

export function About() {
  const [greeting, setGreeting] = useState("")

  useEffect(() => {
    setGreeting(getGreeting())
  }, [])

  return (
    <section
      id="hello"
      data-slot="panel"
      className="screen-line-top screen-line-bottom border-x screen-line-bottom-border screen-line-bottom-none"
    >
      <header
        data-slot="panel-header"
        className="screen-line-bottom px-4 has-data-[slot=panel-description]:*:data-[slot=panel-title]:screen-line-bottom"
      >
        <h2 className="sr-only">Sobre mí</h2>
        <div
          id="hello-greeting"
          aria-hidden="true"
          data-slot="panel-title"
          className="group/panel-title text-3xl font-medium tracking-tight text-balance font-handwritten leading-none"
        >
          {greeting || "\u00A0"}
        </div>
      </header>

      {/* 1. Restauramos bg-background */}
      <div data-slot="panel-body" className="p-4 bg-background">
        
        {/* 2. Agregamos text-sm para móvil y md:text-[15px] para escritorio */}
        <div className="typeset typeset-description text-sm md:text-[15px] [&_li]:ps-0.5 [&_ul]:ps-3.5">
          <ul>
            {USER.about.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="screen-line-bottom h-px" />
      <div className="h-4" />
      <div className="screen-line-bottom h-px screen-line-bottom-border" />
    </section>
  )
}