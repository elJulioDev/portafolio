export type Education = {
  id: string
  school: string
  degree?: string
  fieldOfStudy?: string
  period: {
    start: string
    end?: string
  }
  location?: string
  description?: string
  skills?: string[]
  isExpanded?: boolean
}

export const EDUCATION: Education[] = [
  {
    id: "inacap",
    school: "Universidad Tecnológica de Chile, INACAP",
    degree: "Ingeniería",
    fieldOfStudy: "Computer Science",
    period: { start: "mar. 2022", end: "dic. 2025" },
    description:
      "Formación en ingeniería informática con foco en desarrollo de software, bases de datos, arquitectura de sistemas y metodologías ágiles. Proyectos académicos incluyen sistemas de gestión, aplicaciones web full-stack y análisis de datos.",
    skills: [
      "PHP",
      "MySQL",
      "Python",
      "JavaScript",
      "TypeScript",
      "React",
      "Node.js",
      "Bases de Datos",
      "Ingeniería de Software",
      "Metodologías Ágiles",
    ],
    
  },
]