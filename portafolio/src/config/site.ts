import type { Route } from "next"

import type { NavItem } from "@/types/nav"

export const siteConfig = {
  name: "elJulioDev",
  title: "elJulioDev — Desarrollador Full Stack",
  description:
    "Portafolio profesional de Alexis González.",
  url: "https://eljuliodev.github.io",
  author: "Alexis González Pérez",
  username: "elJulioDev",
  email: "alexisdevelopgz@gmail.com",
  github: "https://github.com/elJulioDev",
  linkedin: "https://www.linkedin.com/in/alexis-gonz%C3%A1lez-p%C3%A9rez/",
  location: "Coltauco, Región de O'Higgins, Chile",
  ogImage: "/og.png",
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

export const GITHUB_USERNAME = "elJulioDev"

export const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
}