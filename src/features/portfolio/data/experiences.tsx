export interface ExperiencePosition {
  title: string
  icon: "code" | "lightbulb" | "design" | "chart"
  employmentType: string
  period: string
  duration: string
  description?: string
  tags?: string[]
}

export interface Experience {
  company: string
  companyUrl?: string
  logo?: string
  location: string
  locationType: "Remoto" | "Presencial"
  status?: "Actual"
  positions: ExperiencePosition[]
}

export const EXPERIENCES: Experience[] = [
  {
    company: "Municipalidad de Coltauco",
    companyUrl: "https://coltauco.cl",
    logo: "https://www.google.com/s2/favicons?domain=coltauco.cl&sz=24",
    location: "Coltauco, Chile",
    locationType: "Presencial",
    positions: [
      {
        title: "Programador Full Stack",
        icon: "code",
        employmentType: "Práctica",
        period: "feb. 2026 — abr. 2026",
        duration: "3 meses",
        description: `Durante mi práctica profesional, fui integrado como soporte TI para optimizar los procesos internos de la municipalidad. Mi labor principal consistió en tomar bases de código y requerimientos específicos para expandirlos, mejorarlos a profundidad y llevarlos a producción, impactando directamente en la eficiencia de los funcionarios.

**Desarrollo y Optimización de Sistemas (PHP / MySQL):**
• Sistema de Bodega: Perfeccionamiento de un sistema para el registro eficiente y la localización física de productos, facilitando la gestión de inventario a los encargados de diversas áreas municipales.
• Sistema de Marcaciones (RRHH): Mejoras estructurales y de funcionalidad en la plataforma interna para el control de asistencia del personal.
• Sistema de Licencias de Conducir: Desarrollo de módulos para la solicitud de horas, gestión de cupos y administración del flujo de usuarios en la plataforma de licencias.

**Soporte TI y Gestión Institucional:**
• Mantenimiento Web: Implementación de mejoras, ajustes y soporte continuo en el portal web oficial de la municipalidad (coltauco.cl).
• Gestión de Datos: Ejecución de migraciones de bases de datos y despliegue técnico para la generación e impresión de credenciales del personal.
• Soporte de Hardware: Asistencia técnica y mantenimiento correctivo de equipos de impresión (reparación, cambio de piezas y gestión de insumos).`,
        tags: ["PHP", "MySQL", "JavaScript", "HTML", "SQL", "GitHub"],
      },
    ],
  },
]
