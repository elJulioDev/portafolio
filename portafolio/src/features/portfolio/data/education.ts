export interface Education {
  institution: string
  degree: string
  fieldOfStudy?: string
  period: string
  location?: string
  tags?: string[]
}

export const EDUCATION: Education[] = [
  {
    institution: "INACAP",
    degree: "Ingeniería en Informática",
    fieldOfStudy: "Informática",
    period: "2020 — 2024",
    location: "Rancagua, Chile",
    tags: ["PHP", "MySQL", "Python", "POO", "Bases de Datos", "Ing. de Software"],
  },
]
