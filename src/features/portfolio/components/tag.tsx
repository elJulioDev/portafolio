import { cn } from "@/lib/utils"

function Tag({
  className,
  children,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li className="flex" {...props}>
      <span
        className={cn(
          "inline-flex items-center rounded-full border bg-zinc-50 px-1.5 py-0.5 font-mono text-xs text-muted-foreground dark:bg-zinc-900 [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
          className
        )}
      >
        {children}
      </span>
    </li>
  )
}

export { Tag }
