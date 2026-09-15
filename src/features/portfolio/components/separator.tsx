import { cn } from "@/lib/utils"

export function Separator({
  className,
  variant = "default",
  orientation = "horizontal",
  ...props
}: React.ComponentProps<"div"> & {
  variant?: "default" | "stripe"
  orientation?: "horizontal" | "vertical"
}) {
  if (variant === "stripe") {
    return (
      <div
        className={cn("stripe-divider w-full border-x", className)}
        {...props}
      />
    )
  }

  return (
    <div
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal"
          ? "data-horizontal:h-px data-horizontal:w-full"
          : "data-vertical:w-px data-vertical:h-4 data-vertical:self-center",
        className
      )}
      data-orientation={orientation}
      role="separator"
      aria-orientation={orientation}
      data-slot="separator"
      {...props}
    />
  )
}