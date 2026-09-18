import React from "react"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

function Panel({ className, ...props }: React.ComponentProps<"section">) {
  return (
    <section
      data-slot="panel"
      className={cn(
        "screen-line-top screen-line-bottom border-x screen-line-bottom-border",
        className
      )}
      {...props}
    />
  )
}

function PanelHeader({ className, ...props }: React.ComponentProps<"header">) {
  return (
    <header
      data-slot="panel-header"
      className={cn(
        "screen-line-bottom px-4 has-data-[slot=panel-description]:*:data-[slot=panel-title]:screen-line-bottom",
        className
      )}
      {...props}
    />
  )
}

function PanelTitle({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"h2"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "h2"

  return (
    <Comp
      data-slot="panel-title"
      className={cn(
        "font-heading text-3xl font-medium tracking-tight text-balance",
        className
      )}
      {...props}
    />
  )
}

function PanelContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="panel-body" className={cn("p-4 bg-background", className)} {...props} />
  )
}

export {
  Panel,
  PanelContent,
  PanelHeader,
  PanelTitle,
}
