import { Panel, PanelHeader, PanelTitle } from "./panel"
import { IconTile } from "./icon-tile"
import { Tag } from "./tag"
import { EDUCATION } from "../data/education"

function GraduationCapIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.42 10.922l-2.36-1.18a2 2 0 0 0-2.32.42l-1.08.96a1 1 0 0 1-1.2.12L10 11" />
      <path d="M14 5l1.57.78 1.04 2.08a2 2 0 0 0 2.32.42L20 6" />
      <path d="M21 12v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6" />
      <path d="m6 12 6-6 6 6" />
    </svg>
  )
}

export function Education() {
  return (
    <Panel id="education">
      <PanelHeader>
        <PanelTitle>
          <a href="#education">Educación</a>
        </PanelTitle>
      </PanelHeader>

        {EDUCATION.map((edu, i) => (
          <div
            key={i}
            id={`education-${i}`}
            className="screen-line-bottom scroll-mt-14 bg-background p-4 pr-2"
          >
          <div className="flex items-start gap-3">
            <IconTile>
              <GraduationCapIcon />
            </IconTile>

            <div className="flex-1 space-y-1">
              <h3 className="text-sm leading-snug font-medium text-balance">
                {edu.institution}
              </h3>

              <p className="text-sm text-muted-foreground">{edu.degree}</p>

              {edu.fieldOfStudy && (
                <p className="text-sm text-muted-foreground">
                  {edu.fieldOfStudy}
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
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      ))}
    </Panel>
  )
}
