"use client"

import { useState, type FormEvent } from "react"

import { Panel, PanelContent, PanelHeader, PanelTitle } from "./panel"

const VALIDATE_ENDPOINT = "/api/contact"
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit"

export function ContactForm() {
  const [status, setStatus] = useState<
    "idle" | "sending" | "ok" | "blocked" | "error"
  >("idle")

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)

    const nombre = ((data.get("nombre") as string) || "").trim()
    const email = ((data.get("email") as string) || "").trim()
    const mensaje = ((data.get("mensaje") as string) || "").trim()

    if (
      nombre.length < 2 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      mensaje.length < 5
    ) {
      return
    }

    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY
    if (!accessKey) {
      setStatus("error")
      return
    }

    setStatus("sending")

    try {
      // 1. El servidor valida contra la lista de palabras de la BD.
      const check = await fetch(VALIDATE_ENDPOINT, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      })
      const valid = (await check.json().catch(() => ({}))) as {
        ok?: boolean
        error?: string
      }

      if (!valid.ok) {
        setStatus(valid.error === "vulgar" ? "blocked" : "error")
        return
      }

      // 2. Envío real desde el navegador (Web3Forms no permite servidor en free).
      const payload = new FormData(form)
      payload.set("access_key", accessKey)
      payload.set("subject", `[Portafolio] Mensaje de ${nombre}`)
      payload.set("from_name", nombre)
      payload.set("name", nombre)
      payload.set("message", mensaje)
      payload.set("replyto", email)
      payload.delete("nombre")
      payload.delete("mensaje")

      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        body: payload,
        headers: { Accept: "application/json" },
      })
      const result = (await res.json().catch(() => ({}))) as {
        success?: boolean
      }

      if (!res.ok || result.success === false) throw new Error("Web3Forms")

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
          {/* Honeypot: invisible para humanos; lo usan nuestro servidor y Web3Forms. */}
          <input
            type="text"
            name="botcheck"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
          />

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

          {status === "blocked" && (
            <p className="text-center text-sm text-red-600 dark:text-red-400">
              Tu nombre, correo o mensaje contiene lenguaje inapropiado.
              Reescríbelo de forma respetuosa, por favor.
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
