import { Panel, PanelHeader, PanelTitle } from "./panel"
import { Separator } from "./separator"
import { TECH_STACK } from "../data/tech-stack"

export function TechStack() {
  const totalItems = TECH_STACK.reduce((sum, cat) => sum + cat.items.length, 0)

  return (
    <>
      <Separator />

      <Panel id="tech-stack" className="screen-line-top">
        <PanelHeader>
          <PanelTitle>
            <a href="#tech-stack">Stack tecnológico</a>
            <sup className="top-[-0.75em] ml-1 text-sm font-medium tracking-normal text-muted-foreground">
              ({totalItems})
            </sup>
          </PanelTitle>
        </PanelHeader>

        <div className="grid grid-cols-1 gap-px bg-line sm:grid-cols-3">
          {TECH_STACK.map((category) => (
            <div key={category.title} className="relative p-4 bg-background">
              <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {category.title}
              </h3>

              <ul className="space-y-2">
                {category.items.map((item) => {
                  const Icon = item.icon
                  return (
                    <li key={item.name} className="flex items-center gap-2 text-sm text-foreground">
                      <span className="flex size-5 items-center justify-center shrink-0">
                        <Icon className="size-4" />
                      </span>
                      <span className="truncate">{item.name}</span>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      </Panel>
    </>
  )
}
