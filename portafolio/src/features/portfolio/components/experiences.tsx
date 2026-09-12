import { Panel, PanelHeader, PanelTitle } from "./panel"
import { Separator } from "./separator"
import { EXPERIENCES } from "../data/experiences"

function BriefcaseIcon() {
  return (
    <svg className="size-5 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      <rect width="20" height="14" x="2" y="6" rx="2" />
    </svg>
  )
}

export function Experiences() {
  return (
    <>
      <Separator />

      <Panel id="experiences" className="screen-line-top">
        <PanelHeader>
          <PanelTitle>
            <a href="#experiences">Experiencia</a>
          </PanelTitle>
        </PanelHeader>

        {EXPERIENCES.map((exp, i) => (
          <div key={i}>
            <PanelHeader>
              <div className="flex items-center gap-3">
                <BriefcaseIcon />
                <div>
                  <h3 className="text-sm font-medium">
                    {exp.company}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {exp.role}
                  </p>
                </div>
              </div>
            </PanelHeader>

            <PanelHeader>
              <span className="text-sm text-muted-foreground">
                <time>{exp.period}</time>
              </span>
            </PanelHeader>

            <div className="typeset px-4 pb-4">
              <p className="text-sm">{exp.desc}</p>

              {exp.techs && exp.techs.length > 0 && (
                <ul className="flex flex-wrap gap-1.5 mt-3">
                  {exp.techs.map((tech: string) => (
                    <li key={tech} className="flex">
                      <span className="inline-flex items-center rounded-md border border-border bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground">
                        {tech}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </Panel>
    </>
  )
}
