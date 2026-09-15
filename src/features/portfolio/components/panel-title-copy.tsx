"use client"

import { LinkIcon } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function PanelTitleCopy({
  id,
  className,
  ...props
}: React.ComponentProps<"button"> & {
  id: string
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    const url = typeof window !== "undefined" ? window.location.origin + window.location.pathname + "#" + id : ""
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-[min(var(--radius-lg),10px)] text-muted-foreground opacity-0 transition-opacity group-hover/panel-title:opacity-100 hover:bg-accent-muted",
        "absolute top-1 ml-1 size-7 shrink-0 border-none",
        copied && "text-primary",
        className
      )}
      onClick={handleCopy}
      aria-label={copied ? "Copied!" : "Copy link to section"}
      {...props}
    >
      <LinkIcon className="size-4" aria-hidden="true" />
    </button>
  )
}