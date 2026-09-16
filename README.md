# elJulioDev — Portafolio

Portafolio profesional de Alexis Gonzalez, desarrollador full stack. Sitio web personal con secciones de perfil, experiencia laboral, stack tecnologico, proyectos y certificaciones.

**Demo en vivo:** [portafolio-eljuliodev.vercel.app](https://portafolio-eljuliodev.vercel.app)

## Inspiracion

Este proyecto esta basado en el codigo fuente de [chanhdai.com](https://github.com/ncdai/chanhdai.com) de [Quang Anh Dai](https://chanhdai.com). Se adapto y personalizo el diseño, estructura y componentes para el contexto del portfolio de Alexis Gonzalez.

## Stack

- **Framework:** [Next.js 16](https://nextjs.org) (App Router)
- **UI:** [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org)
- **Estilos:** [Tailwind CSS v4](https://tailwindcss.com) (CSS-first, sin tailwind.config.js)
- **Componentes:** [shadcn/ui](https://ui.shadcn.com) (estilo base-nova)
- **Animaciones:** [Motion](https://www.framer.com/motion/) (framer-motion)
- **Smooth scroll:** [Lenis](https://lenis.darkroom.engineering)
- **Temas:** [next-themes](https://github.com/pacocoursey/next-themes) (dark/light)
- **Despliegue:** [Vercel](https://vercel.com)

## Caracteristicas

- Tema oscuro / claro con toggle
- Juego del dinosaurio de google interactivo en el header
- Seccion de perfil con avatar y frases animadas
- Overview con datos de contacto y ubicacion
- Tech Stack con 20+ tecnologias categorizadas
- Proyectos con descripciones desplegables e imagenes
- Experiencia laboral con timeline
- Educacion y certificaciones (Credly)
- Formulario de contacto
- Contribuciones de GitHub (grafico de actividad)
- SEO optimizado (Open Graph, Twitter Cards, JSON-LD, sitemap, robots.txt)
- Responsive (mobile-first)

## Requisitos

- [Node.js](https://nodejs.org) >= 18
- [pnpm](https://pnpm.io) (recomendado) o npm

## Instalacion

```bash
# Clonar el repositorio
git clone https://github.com/elJulioDev/portafolio.git
cd portafolio

# Instalar dependencias
pnpm install
```

## Desarrollo

```bash
# Iniciar servidor de desarrollo
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Scripts

| Comando | Descripcion |
|---------|-------------|
| `pnpm dev` | Servidor de desarrollo |
| `pnpm build` | Build de produccion (genera build info automaticamente) |
| `pnpm start` | Iniciar servidor de produccion |
| `pnpm lint` | ESLint (next/core-web-vitals + typescript) |

## Estructura

```
src/
  app/                    # Next.js App Router
    layout.tsx            # Layout raiz (metadata, theme, fonts)
    page.tsx              # Pagina principal (portfolio)
    globals.css           # Tokens de diseño, temas, utilidades
    robots.ts             # Reglas para crawlers
    sitemap.ts            # Sitemap dinamico
  features/
    portfolio/            # Modulo principal del portfolio
      components/         # Componentes de secciones
      data/               # Datos estaticos (proyectos, tech stack, etc.)
  components/             # UI compartida (nav, lightbox, theme-toggle, ui/)
  hooks/                  # Custom hooks
  registry/               # Componentes locales estilo shadcn
  config/site.ts          # Metadata del sitio, nav links
  lib/                    # Utilidades (cn, fonts)
  types/                  # Tipos compartidos
  utils/                  # Utilidades extra
```

## Contenido

Toda la informacion del portfolio (proyectos, tech stack, experiencia, certificaciones) se define como arrays/objetos TypeScript en `src/features/portfolio/data/`. Para actualizar el contenido, edita estos archivos, no los componentes.

## Licencia

[MIT](LICENSE) — Alexis Gonzalez (elJulioDev)

## Creditos

- [chanhdai.com](https://chanhdai.com) — Diseño y arquitectura base
- [shadcn/ui](https://ui.shadcn.com) — Sistema de componentes
- [Vercel](https://vercel.com) — Despliegue y hosting
