# Portafolio — Alexis González Pérez

Portafolio personal en línea (página única, estática) publicado en **GitHub Pages**, con presentación de proyectos, habilidades, certificaciones y contacto.

## Contenido

- **Hero** con presentación y slider de fondo.
- **Sobre mí** con foto y datos personales.
- **Tecnologías** en 6 categorías balanceadas: Frontend, Backend, Datos, Videojuegos, IA/datos y Herramientas y despliegue.
- **Proyectos** en carrusel con lightbox para ver las capturas en grande.
- **Certificados** (AWS: Cloud Foundations, Cloud Security y ML for NLP).
- **Contacto** con formulario que envía por Formspree.

## Tecnologías del sitio

- HTML5 + CSS3 con variables CSS y layout responsive.
- JavaScript vanilla (carrusel, lightbox, acordeón móvil, menú lateral).
- Google Fonts: Bebas Neue, Inter y Space Mono.
- Iconos: Devicon y Font Awesome.
- Despliegue: GitHub Pages.

## Ejecutar en local

No requiere build ni dependencias:

```sh
python3 -m http.server
```

O abrir `index.html` directamente en el navegador.

## Estructura

```
├── index.html   # Página única
├── style.css    # Estilos y sistema de diseño (:root)
├── script.js    # Interacciones (carrusel, lightbox, formulario, menú)
├── img/         # Imágenes (foto y capturas de proyectos)
└── AGENTS.md    # Notas de desarrollo y estructura
```

## Despliegue

Publicado en GitHub Pages desde la rama `main`.
