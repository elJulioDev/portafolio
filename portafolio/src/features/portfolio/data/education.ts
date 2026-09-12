export interface Education {
  institution: string
  degree: string
  period: string
  location?: string
}

export const EDUCATION: Education[] = [
  {
    institution: "INACAP",
    degree: "Ingeniería en Informática",
    period: "2020 — 2024",
    location: "Rancagua, Chile",
  },
]
