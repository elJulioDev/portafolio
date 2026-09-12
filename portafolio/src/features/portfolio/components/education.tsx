import { Panel, PanelHeader, PanelTitle, PanelContent } from "./panel"
import { Separator } from "./separator"
import { EDUCATION } from "../data/education"

function GraduationCapIcon() {
  return (
    <svg className="size-5 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.42 10.922l-2.36-1.18a2 2 0 0 0-2.32.42l-1.08.96a1 1 0 0 1-1.2.12L10 11" />
      <path d="M14 5l1.57.78 1.04 2.08a2 2 0 0 0 2.32.42L20 6" />
      <path d="M21 12v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6" />
      <path d="m6 12 6-6 6 6" />
    </svg>
  )
}

export function Education() {
  return (
    <>
      <Separator />

      <Panel id="education" className="screen-line-top">
        <PanelHeader>
          <PanelTitle>
            <a href="#education">Educación</a>
          </PanelTitle>
        </PanelHeader>

        <PanelContent className="p-0">
          {EDUCATION.map((edu, i) => (
            <div key={i} className="relative flex pr-2 hover:bg-accent-muted transition-colors">
              <div className="mx-4 mt-4 flex size-6 shrink-0 items-center justify-center rounded bg-muted text-muted-foreground">
                <GraduationCapIcon />
              </div>

              <div className="flex-1 space-y-2 border-l border-dashed border-line p-4 pr-2">
                <h3 className="text-sm leading-snug font-medium text-balance">
                  {edu.institution}
                </h3>

                <p className="text-sm text-muted-foreground">{edu.degree}</p>

                {edu.fieldOfStudy && (
                  <p className="text-sm text-muted-foreground">
                    Campo de estudio: {edu.fieldOfStudy}
                  </p>
                )}

                <dl className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <dt className="sr-only">Duración</dt>
                  <dd>
                    <time>{edu.period}</time>
                  </dd>
                  {edu.location && (
                    <>
                      <div className="h-4 w-px bg-line" aria-hidden />
                      <dt className="sr-only">Ubicación</dt>
                      <dd>{edu.location}</dd>
                    </>
                  )}
                </dl>

                {edu.tags && edu.tags.length > 0 && (
                  <ul className="flex flex-wrap gap-1.5 pt-1">
                    {edu.tags.map((tag) => (
                      <li key={tag} className="flex">
                        <span className="inline-flex items-center rounded-md border border-border bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground">
                          {tag}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </PanelContent>
      </Panel>
    </>
  )
}
