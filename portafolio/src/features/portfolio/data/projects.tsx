export interface Project {
  key: string
  title: string
  desc: string
  url: string
  techs: string[]
  images: string[]
}

export const PROJECTS: Project[] = [
  {
    key: "proyecto_bodega",
    title: "Sistema Bodega",
    desc: "Sistema modular de gestión de bodegas e inventario en PHP y MySQL: stock, productos, proveedores y movimientos.",
    url: "https://github.com/elJulioDev/Sistema-Bodega",
    techs: ["HTML", "CSS", "JavaScript", "PHP", "MySQL", "XAMPP"],
    images: [
      "/images/proyectos/proyecto_bodega.webp",
      "/images/proyectos/proyecto_bodega_2.webp",
      "/images/proyectos/proyecto_bodega_3.webp",
      "/images/proyectos/proyecto_bodega_4.webp",
      "/images/proyectos/proyecto_bodega_5.webp",
      "/images/proyectos/proyecto_bodega_6.webp",
    ],
  },
  {
    key: "proyecto_marcaciones",
    title: "Sistema Marcaciones",
    desc: "Plataforma web de asistencia laboral municipal: importa relojes biométricos, calcula horas e incidencias y exporta XLSX.",
    url: "https://github.com/elJulioDev/Sistema-Marcaciones",
    techs: ["HTML", "CSS", "JavaScript", "PHP", "MySQL", "XAMPP"],
    images: [
      "/images/proyectos/proyecto_marcaciones.webp",
    ],
  },
  {
    key: "proyecto_nn",
    title: "Neural Network",
    desc: "Librería de Deep Learning desde cero con Python y NumPy: capas, optimizadores y validación numérica de gradientes.",
    url: "https://github.com/elJulioDev/Neural_Network",
    techs: ["Python", "NumPy"],
    images: [
      "/images/proyectos/proyecto_nn.webp",
    ],
  },
  {
    key: "proyecto_kf",
    title: "Key Forge",
    desc: "Herramienta de escritorio en Python para remapear teclas en tiempo real, con reglas globales o por aplicación.",
    url: "https://github.com/elJulioDev/KeyForge",
    techs: ["Python"],
    images: [
      "/images/proyectos/proyecto_kf.webp",
      "/images/proyectos/proyecto_kf_2.webp",
      "/images/proyectos/proyecto_kf_3.webp",
    ],
  },
]
