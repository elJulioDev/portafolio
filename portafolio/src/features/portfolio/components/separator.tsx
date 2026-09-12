import { cn } from "@/lib/utils"

export function Separator({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & {
  variant?: "default" | "stripe"
}) {
  if (variant === "stripe") {
    return (
      <div
        className={cn(
          "stripe-divider w-full border-x border-line",
          className
        )}
        {...props}
      />
    )
  }

  return (
    <div
      className={cn(
        "screen-line-top screen-line-bottom relative h-(--separator-height) w-full border-x border-line",
        className
      )}
      {...props}
    />
  )
}
