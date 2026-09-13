"use client"

import { cn } from "@/lib/utils"
import { ChevronsUpDownIcon } from "@/components/animated-icons/chevrons-up-down-icon"
import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible"

export function Collapsible({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
  return (
    <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />
  )
}

export function CollapsibleTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Trigger> & {
  children: React.ReactNode
}) {
  return (
    <CollapsiblePrimitive.Trigger
      className={cn(
        "group block w-full text-left",
        "relative before:absolute before:-top-1 before:-right-1 before:-bottom-1.5 before:left-7 before:-z-1 before:rounded-lg before:transition-[background-color] before:ease-out hover:before:bg-accent-muted",
        "outline-none focus-visible:before:inset-ring-2 focus-visible:before:inset-ring-ring/50",
        "data-disabled:before:content-none",
        className
      )}
      data-slot="collapsible-trigger"
      {...props}
    >
      {children}
    </CollapsiblePrimitive.Trigger>
  )
}

export function CollapsibleContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Panel>) {
  return (
    <CollapsiblePrimitive.Panel
      className={cn("overflow-hidden data-[state=open]:animate-collapsible-down", className)}
      data-slot="collapsible-content"
      {...props}
    >
      <div className="overflow-hidden">{children}</div>
    </CollapsiblePrimitive.Panel>
  )
}

export function CollapsibleChevronsUpDownIcon({
  className,
  duration = 0.15,
  ...props
}: React.ComponentProps<typeof ChevronsUpDownIcon> & {
  duration?: number
}) {
  return (
    <div className={cn("shrink-0 text-muted-foreground [&_svg]:h-lh [&_svg]:w-4", className)}>
      <ChevronsUpDownIcon duration={duration} {...props} />
    </div>
  )
}