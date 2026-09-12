"use client"

import { useState } from "react"

import { cn } from "@/lib/utils"

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("size-4", className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function CollapsibleList<T>({
  items,
  max = 4,
  renderItem,
  className,
}: {
  items: T[]
  max?: number
  renderItem: (item: T, index: number) => React.ReactNode
  className?: string
}) {
  const [expanded, setExpanded] = useState(false)
  const hasMore = items.length > max
  const visibleItems = expanded ? items : items.slice(0, max)

  return (
    <div className={className}>
      <ul>
        {visibleItems.map((item, i) => (
          <li key={i} className="border-b border-line last:border-b-0">
            {renderItem(item, i)}
          </li>
        ))}
      </ul>

      {hasMore && (
        <div className="screen-line-top -mt-px flex items-center justify-center py-4">
          <button
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted shadow-[inset_0_0_1px] shadow-foreground/20"
          >
            <span>{expanded ? "Show less" : `Show all (${items.length})`}</span>
            <ChevronDownIcon
              className={cn(
                "transition-transform duration-200",
                expanded && "rotate-180"
              )}
            />
          </button>
        </div>
      )}
    </div>
  )
}

export { CollapsibleList }
