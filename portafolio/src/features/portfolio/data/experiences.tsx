export interface Experience {
  role: string
  company: string
  period: string
  desc: string
  techs?: string[]
}

export const EXPERIENCES: Experience[] = [
  {
    role: "Desarrollador Full Stack",
    company: "Municipalidad de Coltauco",
    period: "2023 — 2024",
    desc: "Lideré el despliegue técnico y la refactorización backend (PHP/MySQL) de herramientas clave de gestión institucional. Sistema de asistencia laboral con importación de relojes biométricos, cálculo de horas e incidencias, y exportación XLSX.",
    techs: ["PHP", "MySQL", "JavaScript", "XAMPP"],
  },
  {
    role: "Freelance Developer",
    company: "Independiente",
    period: "2022 — Presente",
    desc: "Desarrollo de sistemas de gestión (bodegas, inventario), herramientas de escritorio y librerías de Deep Learning. Enfoque en soluciones modulares y escalables.",
    techs: ["PHP", "Python", "NumPy", "Godot"],
  },
]
