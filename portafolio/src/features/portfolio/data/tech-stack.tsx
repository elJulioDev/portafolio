import {
  SiHtml5,
  SiCss,
  SiJavascript,
  SiPhp,
  SiPython,
  SiDjango,
  SiMysql,
  SiMariadb,
  SiMongodb,
  SiSharp,
  SiUnity,
  SiGodotengine,
  SiNumpy,
  SiGooglecolab,
  SiGit,
  SiGithub,
  SiVercel,
  SiSupabase,
} from "react-icons/si"

function OracleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
    </svg>
  )
}

function PowerBIIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.5 2a1.5 1.5 0 0 1 1.5 1.5v5a1.5 1.5 0 0 1-3 0v-5A1.5 1.5 0 0 1 11.5 2zm5 4a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-3 0v-3A1.5 1.5 0 0 1 16.5 6zm-10 3a1.5 1.5 0 0 1 1.5 1.5v6a1.5 1.5 0 0 1-3 0v-6A1.5 1.5 0 0 1 6.5 9zm5 2a1.5 1.5 0 0 1 1.5 1.5v4a1.5 1.5 0 0 1-3 0v-4A1.5 1.5 0 0 1 11.5 11z" />
    </svg>
  )
}

function XAMPPIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#fb7a24">
      <path d="M16.792 11.923c.113.043.226.079.334.128.45.203.715.553.748 1.044.041.634.044 1.271.002 1.905-.049.732-.725 1.292-1.483 1.271-.735-.021-1.369-.62-1.397-1.341-.017-.441-.003-.884-.006-1.326-.001-.239-.003-.242-.245-.243-1.363-.001-2.726.008-4.089-.003-.888-.007-1.421.482-1.471 1.46-.019.38-.1.727-.357 1.018-.397.451-.898.601-1.472.466-.554-.131-.867-.522-1.035-1.048-.117-.367-.056-.737.012-1.094.341-1.797 1.366-3.006 3.125-3.555.357-.112.731-.166 1.105-.166.94.001 1.881.001 2.821-.001.128 0 .257-.012.385-.021.702-.051 1.166-.511 1.22-1.352.004-.064 0-.129.001-.193.011-.788.605-1.396 1.393-1.425.787-.029 1.438.527 1.493 1.318.076 1.083-.265 2.046-.913 2.907-.11.172-.194.237-.221.344zM8.249 10.436c-.258-.008-.571.018-.882-.035-.536-.09-.876-.39-1.02-.916-.057-.38.003-.904.451-1.332.456-.434.996-.56 1.587-.315.52.216.859.731.89 1.293.012.444-.01.89-.006 1.334.001.116-.043.167-.161.165-.282-.002-.521 0-.809-.001zM21.682 0H2.318C1.102 0 .116.986.116 2.202v19.317c0 1.37 1.111 2.481 2.481 2.481h18.807c1.37 0 2.481-1.111 2.481-2.481V2.202C23.884.986 22.898 0 21.682 0z" />
    </svg>
  )
}

export interface TechItem {
  name: string
  icon: React.ComponentType<{ className?: string }>
  level: "high" | "mid" | "low"
}

export interface TechCategory {
  tag: string
  title: string
  desc: string
  items: TechItem[]
}

export const TECH_STACK: TechCategory[] = [
  {
    tag: "Frontend",
    title: "Interfaces y experiencia de usuario",
    desc: "Maquetación y estilado de interfaces responsivas, accesibles y con buen rendimiento visual.",
    items: [
      { name: "HTML", icon: SiHtml5, level: "high" },
      { name: "CSS", icon: SiCss, level: "high" },
      { name: "JavaScript", icon: SiJavascript, level: "high" },
    ],
  },
  {
    tag: "Backend",
    title: "Lógica de servidor y APIs",
    desc: "Desarrollo y refactorización de sistemas, servicios y APIs, con entornos de desarrollo locales (XAMPP).",
    items: [
      { name: "PHP", icon: SiPhp, level: "high" },
      { name: "Python", icon: SiPython, level: "high" },
      { name: "Django", icon: SiDjango, level: "high" },
      { name: "XAMPP", icon: XAMPPIcon, level: "high" },
    ],
  },
  {
    tag: "Datos",
    title: "Datos y análisis",
    desc: "Modelado relacional, consultas SQL, migraciones y visualización de datos (phpMyAdmin, Power BI).",
    items: [
      { name: "MySQL", icon: SiMysql, level: "high" },
      { name: "OracleDB", icon: OracleIcon, level: "mid" },
      { name: "MariaDB", icon: SiMariadb, level: "mid" },
      { name: "MongoDB", icon: SiMongodb, level: "mid" },
      { name: "Power BI", icon: PowerBIIcon, level: "mid" },
    ],
  },
  {
    tag: "Videojuegos",
    title: "Game dev y prototipos",
    desc: "Creación de mecánicas, físicas y prototipos interactivos en motores profesionales.",
    items: [
      { name: "C#", icon: SiSharp, level: "mid" },
      { name: "Unity", icon: SiUnity, level: "mid" },
      { name: "Godot", icon: SiGodotengine, level: "mid" },
      { name: "Pygame", icon: SiPython, level: "mid" },
    ],
  },
  {
    tag: "IA y datos",
    title: "Machine learning",
    desc: "Implementación de librerías de Deep Learning con matemáticas y optimización desde los fundamentos.",
    items: [
      { name: "Python", icon: SiPython, level: "high" },
      { name: "NumPy", icon: SiNumpy, level: "mid" },
      { name: "Google Colab", icon: SiGooglecolab, level: "mid" },
    ],
  },
  {
    tag: "Despliegue",
    title: "Flujo de trabajo y publicación",
    desc: "Control de versiones, colaboración en equipo y publicación de proyectos en la nube.",
    items: [
      { name: "Git", icon: SiGit, level: "high" },
      { name: "GitHub", icon: SiGithub, level: "high" },
      { name: "Vercel", icon: SiVercel, level: "high" },
      { name: "Supabase", icon: SiSupabase, level: "mid" },
    ],
  },
]
