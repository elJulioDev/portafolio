"use client"

import { useState, type FormEvent } from "react"

import { Panel, PanelContent, PanelHeader, PanelTitle } from "./panel"

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xbglleba"

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">(
    "idle"
  )

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)

    // Basic validation
    const nombre = (data.get("nombre") as string || "").trim()
    const email = (data.get("email") as string || "").trim()
    const mensaje = (data.get("mensaje") as string || "").trim()

    if (nombre.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || mensaje.length < 5) {
      return
    }

    setStatus("sending")

    try {
      // Asunto personalizado para poder responder directamente
      data.set("_subject", `[Portafolio] Mensaje de ${nombre}`)

      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      })

      if (!res.ok) throw new Error("Formspree error")
      setStatus("ok")
      form.reset()
    } catch {
      setStatus("error")
    }
  }

  return (
    <Panel id="contact">
      <PanelHeader>
        <PanelTitle>Contacto</PanelTitle>
      </PanelHeader>

      <PanelContent>
        <p className="mb-4 text-sm text-muted-foreground">
          Si tienes un proyecto en mente, una oportunidad laboral o solo
          quieres saludar, no dudes en escribirme.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="nombre" className="text-sm font-medium">
              Nombre
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              required
              minLength={2}
              placeholder="Tu nombre"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="tucorreo@ejemplo.com"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="mensaje" className="text-sm font-medium">
              Mensaje
            </label>
            <textarea
              id="mensaje"
              name="mensaje"
              required
              minLength={5}
              rows={5}
              placeholder="Cuéntame sobre tu proyecto..."
              className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <button
            type="submit"
            disabled={status === "sending"}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90 disabled:opacity-50"
          >
            {status === "sending" ? "Enviando..." : "Enviar mensaje"}
          </button>

          {status === "ok" && (
            <p className="text-center text-sm text-green-600 dark:text-green-400">
              ¡Gracias por tu mensaje! Te responderé pronto.
            </p>
          )}

          {status === "error" && (
            <p className="text-center text-sm text-red-600 dark:text-red-400">
              No se pudo enviar el mensaje. Inténtalo de nuevo.
            </p>
          )}
        </form>
      </PanelContent>
    </Panel>
  )
}
