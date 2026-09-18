import type { Route } from "next"

import type { NavItem } from "@/types/nav"

export const siteConfig = {
  name: "elJulioDev",
  title: "elJulioDev — Desarrollador Full Stack",
  description:
    "Portafolio de Alexis González — Desarrollador Full Stack especializado en JavaScript, Python, PHP y Machine Learning. Proyectos, experiencia y certificaciones.",
  url: "https://portafolio-eljuliodev.vercel.app",
  author: "Alexis González Pérez",
  username: "elJulioDev",
  email: "alexisdevelopgz@gmail.com",
  github: "https://github.com/elJulioDev",
  linkedin: "https://www.linkedin.com/in/alexis-gonz%C3%A1lez-p%C3%A9rez/",
  location: "Coltauco, Región de O'Higgins, Chile",
  // La versión (?v=) fuerza a los crawlers a refrescar la imagen cacheada.
  ogImage: "/og.png?v=2",
}

export const MAIN_NAV: NavItem<Route>[] = [
  {
    title: "Inicio",
    href: "/#inicio" as Route,
  },
  {
    title: "Stack",
    href: "/#tech-stack" as Route,
  },
  {
    title: "Experiencia",
    href: "/#experience" as Route,
  },
  {
    title: "Proyectos",
    href: "/#projects" as Route,
  },
  {
    title: "Contacto",
    href: "/#contact" as Route,
  },
]

export const MOBILE_NAV: NavItem<Route>[] = [...MAIN_NAV]

export const GITHUB_USERNAME = "elJulioDev"

export const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
}