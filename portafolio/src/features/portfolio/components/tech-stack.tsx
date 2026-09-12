import { Panel, PanelHeader, PanelTitle } from "./panel"
import { TECH_STACK } from "../data/tech-stack"

export function TechStack() {
  return (
    <Panel id="tech-stack">
      <PanelHeader>
        <PanelTitle>
          <a href="#tech-stack">Stack</a>
          <sup className="top-[-0.75em] ml-1 text-sm font-medium tracking-normal text-muted-foreground">
            ({TECH_STACK.reduce((sum, cat) => sum + cat.items.length, 0)})
          </sup>
        </PanelTitle>
      </PanelHeader>

      <div className="relative [--badge-height:--spacing(6)] [--col-left-width:--spacing(48)]">
        <div
          className="pointer-events-none absolute inset-y-0 left-(--col-left-width) -z-1 w-px border-r border-dashed border-line max-sm:hidden"
          aria-hidden
        />

        {TECH_STACK.map((category, index) => (
          <div
            key={category.tag}
            className="grid items-start gap-y-2 border-b border-line py-4 last:border-none sm:grid-cols-[var(--col-left-width)_1fr]"
          >
            <div className="pl-4 text-sm/(--badge-height)">
              <span
                className="mr-1.5 font-mono text-muted-foreground/80 select-none"
                aria-hidden
              >
                {(index + 1).toString().padStart(2, "0")}
              </span>
              {category.tag}
            </div>

            <ul className="flex flex-wrap gap-1.5 px-4">
              {category.items.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.name} className="flex">
                    <span className="flex h-(--badge-height) items-center gap-1.25 rounded-full bg-zinc-50/80 px-2 font-mono text-xs text-foreground inset-ring-1 inset-ring-border dark:bg-zinc-900/80 [&_svg]:pointer-events-none [&_svg]:size-3.5 [&_svg]:shrink-0 [&_svg]:text-muted-foreground/80">
                      <Icon className="size-3.5" />
                      {item.name}
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    </Panel>
  )
}
