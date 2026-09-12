export interface ExperiencePosition {
  title: string
  employmentType: string
  period: string
  duration: string
  bullets?: string[]
  tags?: string[]
}

export interface Experience {
  company: string
  companyUrl?: string
  location: string
  locationType: string
  status?: string
  positions: ExperiencePosition[]
}

export const EXPERIENCES: Experience[] = [
  {
    company: "Independiente",
    location: "Chile",
    locationType: "Remoto",
    status: "Actual",
    positions: [
      {
        title: "Freelance Developer",
        employmentType: "Tiempo parcial",
        period: "2022 — Presente",
        duration: "3a",
        bullets: [
          "Desarrollo de sistemas de gestión (bodegas, inventario) y herramientas de escritorio.",
          "Diseño de librerías de Deep Learning con Python y NumPy desde los fundamentos.",
        ],
        tags: ["PHP", "Python", "NumPy", "Godot"],
      },
    ],
  },
  {
    company: "Municipalidad de Coltauco",
    location: "Coltauco, Chile",
    locationType: "Presencial",
    positions: [
      {
        title: "Desarrollador Full Stack",
        employmentType: "Tiempo completo",
        period: "2023 — 2024",
        duration: "1a",
        bullets: [
          "Lideré el despliegue técnico y refactorización backend (PHP/MySQL) de herramientas de gestión institucional.",
          "Sistema de asistencia laboral: importación de relojes biométricos, cálculo de horas e incidencias, exportación XLSX.",
        ],
        tags: ["PHP", "MySQL", "JavaScript", "XAMPP"],
      },
    ],
  },
]
