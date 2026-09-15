"use client"

import { useRef, useState } from "react"

import { cn } from "@/lib/utils"
import {
  ChevronsUpDownIcon,
  type ChevronsUpDownIconHandle,
} from "@/components/animated-icons/chevrons-up-down-icon"

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
  const chevronRef = useRef<ChevronsUpDownIconHandle>(null)
  const hasMore = items.length > max
  const visibleItems = expanded ? items : items.slice(0, max)

  const toggleExpand = () => {
    if (expanded) {
      chevronRef.current?.stopAnimation()
    } else {
      chevronRef.current?.startAnimation()
    }
    setExpanded(!expanded)
  }

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
            onClick={toggleExpand}
            className="inline-flex items-center gap-1.5 rounded-[min(var(--radius-lg),10px)] bg-secondary px-2.5 py-1.5 text-sm text-secondary-foreground shadow-[inset_0_0_1px] shadow-foreground/20 transition-colors hover:bg-secondary/80"
          >
            <span>{expanded ? "Show less" : `Show all (${items.length})`}</span>
            <div className="shrink-0 text-muted-foreground [&_svg]:h-lh [&_svg]:w-4">
              <ChevronsUpDownIcon ref={chevronRef} duration={0.15} />
            </div>
          </button>
        </div>
      )}
    </div>
  )
}

export { CollapsibleList }
