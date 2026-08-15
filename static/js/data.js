/* ============================================================
   PORTFOLIO — Datos de contenido
   ------------------------------------------------------------
   CÓMO AÑADIR CONTENIDO:
   - Tecnología: 1) añade una clave en "icons" (define el icono UNA vez),
     2) añade { icon: "clave", level: "high|mid|low" } en la categoría.
   - Certificado: añade un objeto en "certificates".
   - Proyecto: añade un objeto en "projects" y referencia iconos por clave.
     Las imágenes se descubren solas vía gen_manifest.py (workflow).
   ============================================================ */
window.PORTFOLIO_DATA = {
  icons: {
    html5:     { cls: "devicon-html5-plain colored",        label: "HTML" },
    css3:      { cls: "devicon-css3-plain colored",         label: "CSS" },
    javascript:{ cls: "devicon-javascript-plain colored",   label: "JavaScript" },
    php:       { cls: "devicon-php-plain colored",          label: "PHP" },
    python:    { cls: "devicon-python-plain colored",       label: "Python" },
    django:    { cls: "devicon-django-plain",               label: "Django", mod: "django" },
    mysql:     { cls: "devicon-mysql-original colored",     label: "MySQL" },
    oracle:    { cls: "devicon-oracle-plain",               label: "OracleDB", mod: "oracle" },
    mariadb:   { cls: "devicon-mariadb-original",           label: "MariaDB", mod: "mariadb" },
    mongodb:   { cls: "devicon-mongodb-plain colored",      label: "MongoDB" },
    csharp:    { cls: "devicon-csharp-plain colored",       label: "C#" },
    unity:     { cls: "devicon-unity-plain",                label: "Unity", mod: "unity" },
    godot:     { cls: "devicon-godot-plain colored",        label: "Godot" },
    pygame:    { cls: "devicon-python-plain colored",       label: "Pygame" },
    numpy:     { cls: "devicon-numpy-plain colored",        label: "NumPy" },
    colab:     { cls: "devicon-googlecolab-plain colored",  label: "Google Colab" },
    git:       { cls: "devicon-git-plain colored",          label: "Git" },
    github:    { cls: "devicon-github-original",            label: "GitHub" },
    vercel:    { cls: "devicon-vercel-original",            label: "Vercel", mod: "vercel" },
    supabase:  { cls: "devicon-supabase-plain",             label: "Supabase", mod: "supabase" },
    xampp:     { svg: { attrs: {"viewBox": "0 0 24 24", "fill": "#fb7a24", "aria-hidden": "true"}, inner: "<path d=\"M16.792,11.923c0.113,0.043,0.226,0.079,0.334,0.128c0.45,0.203,0.715,0.553,0.748,1.044 c0.041,0.634,0.044,1.271,0.002,1.905c-0.049,0.732-0.725,1.292-1.483,1.271c-0.735-0.021-1.369-0.62-1.397-1.341 c-0.017-0.441-0.003-0.884-0.006-1.326c-0.001-0.239-0.003-0.242-0.245-0.243c-1.363-0.001-2.726,0.008-4.089-0.003 c-0.888-0.007-1.421,0.482-1.471,1.46c-0.019,0.38-0.1,0.727-0.357,1.018c-0.397,0.451-0.898,0.601-1.472,0.466 c-0.554-0.131-0.867-0.522-1.035-1.048c-0.117-0.367-0.056-0.737,0.012-1.094c0.341-1.797,1.366-3.006,3.125-3.555 c0.357-0.112,0.731-0.166,1.105-0.166c0.94,0.001,1.881,0.001,2.821-0.001c0.128,0,0.257-0.012,0.385-0.021 c0.702-0.051,1.166-0.511,1.22-1.352c0.004-0.064,0-0.129,0.001-0.193c0.011-0.788,0.605-1.396,1.393-1.425 c0.787-0.029,1.438,0.527,1.493,1.318c0.076,1.083-0.265,2.046-0.913,2.907C16.903,11.751,16.819,11.816,16.792,11.923z M8.249,10.436c-0.258-0.008-0.571,0.018-0.882-0.035c-0.536-0.09-0.876-0.39-1.02-0.916C6.19,8.912,6.25,8.388,6.698,7.96 C7.154,7.526,7.694,7.4,8.285,7.645c0.52,0.216,0.859,0.731,0.89,1.293C9.2,9.382,9.178,9.828,9.182,10.272 c0.001,0.116-0.043,0.167-0.161,0.165C8.781,10.434,8.542,10.436,8.249,10.436z M21.682,0H2.318C1.102,0,0.116,0.986,0.116,2.202 v19.317c0,1.37,1.111,2.481,2.481,2.481h18.807c1.37,0,2.481-1.111,2.481-2.481V2.202C23.884,0.986,22.898,0,21.682,0z M20.125,12.473c0.519,0.804,0.733,1.69,0.677,2.657c-0.108,1.886-1.413,3.474-3.25,3.916c-2.585,0.623-4.566-0.923-5.233-2.794 c-0.109-0.304-0.16-0.622-0.224-0.985c-0.068,0.414-0.115,0.789-0.264,1.134c-0.697,1.617-1.884,2.603-3.665,2.799 c-2.104,0.232-4.048-1.067-4.632-3.084c-0.25-0.863-0.175-1.747-0.068-2.625c0.08-0.653,0.321-1.268,0.632-1.848 c0.057-0.106,0.057-0.184-0.01-0.285c-0.561-0.845-0.779-1.777-0.7-2.784C3.43,8.035,3.56,7.52,3.805,7.038 C4.52,5.626,6.09,4.427,8.193,4.626c1.849,0.175,3.562,1.77,3.83,3.564c0.013,0.09,0.039,0.178,0.068,0.311 c0.044-0.241,0.076-0.439,0.118-0.636c0.344-1.63,1.94-3.335,4.201-3.357c2.292-0.021,3.99,1.776,4.31,3.446 c0.17,0.888,0.089,1.776-0.103,2.663c-0.112,0.517-0.31,1.008-0.524,1.492C20.034,12.245,20.043,12.345,20.125,12.473z\"/>" }, label: "XAMPP" },
    powerbi:   { svg: { attrs: {"viewBox": "0 0 630 630", "aria-hidden": "true"}, inner: "<defs>\n                    <linearGradient id=\"pbi-g1\" x1=\"50%\" y1=\"0%\" x2=\"50%\" y2=\"100%\">\n                      <stop stop-color=\"#EBBB14\" offset=\"0%\"></stop>\n                      <stop stop-color=\"#B25400\" offset=\"100%\"></stop>\n                    </linearGradient>\n                    <linearGradient id=\"pbi-g2\" x1=\"50%\" y1=\"0%\" x2=\"50%\" y2=\"100%\">\n                      <stop stop-color=\"#F9E583\" offset=\"0%\"></stop>\n                      <stop stop-color=\"#DE9800\" offset=\"100%\"></stop>\n                    </linearGradient>\n                    <linearGradient id=\"pbi-g3\" x1=\"50%\" y1=\"0%\" x2=\"50%\" y2=\"100%\">\n                      <stop stop-color=\"#F9E68B\" offset=\"0%\"></stop>\n                      <stop stop-color=\"#F3CD32\" offset=\"100%\"></stop>\n                    </linearGradient>\n                  </defs>\n                  <g transform=\"translate(77.5 0)\">\n                    <rect x=\"256\" y=\"0\" width=\"219\" height=\"630\" rx=\"26\" fill=\"url(#pbi-g1)\"></rect>\n                    <path d=\"M346,604 L346,630 L320,630 L153,630 C138.640597,630 127,618.359403 127,604 L127,183 C127,168.640597 138.640597,157 153,157 L320,157 C334.359403,157 346,168.640597 346,183 L346,604 Z\" fill=\"url(#pbi-g2)\"></path>\n                    <path d=\"M219,604 L219,630 L193,630 L26,630 C11.6405965,630 1.75851975e-15,618.359403 0,604 L0,341 C-1.75851975e-15,326.640597 11.6405965,315 26,315 L193,315 C207.359403,315 219,326.640597 219,341 L219,604 Z\" fill=\"url(#pbi-g3)\"></path>\n                  </g>" }, label: "Power BI" }
  },

  technologies: [
    {
      tag: "Frontend", title: "Interfaces y experiencia de usuario",
      desc: "Maquetación y estilado de interfaces responsivas, accesibles y con buen rendimiento visual.",
      items: [ { icon: "html5", level: "high" }, { icon: "css3", level: "high" }, { icon: "javascript", level: "high" } ]
    },
    {
      tag: "Backend", title: "Lógica de servidor y APIs",
      desc: "Desarrollo y refactorización de sistemas, servicios y APIs, con entornos de desarrollo locales (XAMPP).",
      items: [ { icon: "php", level: "high" }, { icon: "python", level: "high" }, { icon: "django", level: "high" }, { icon: "xampp", level: "high" } ]
    },
    {
      tag: "Datos", title: "Datos y análisis",
      desc: "Modelado relacional, consultas SQL, migraciones y visualización de datos (phpMyAdmin, Power BI).",
      items: [ { icon: "mysql", level: "high" }, { icon: "oracle", level: "mid" }, { icon: "mariadb", level: "mid" }, { icon: "mongodb", level: "mid" }, { icon: "powerbi", level: "mid" } ]
    },
    {
      tag: "Videojuegos", title: "Game dev y prototipos",
      desc: "Creación de mecánicas, físicas y prototipos interactivos en motores profesionales.",
      items: [ { icon: "csharp", level: "mid" }, { icon: "unity", level: "mid" }, { icon: "godot", level: "mid" }, { icon: "pygame", level: "mid" } ]
    },
    {
      tag: "IA y datos", title: "Machine learning",
      desc: "Implementación de librerías de Deep Learning con matemáticas y optimización desde los fundamentos.",
      items: [ { icon: "python", level: "high" }, { icon: "numpy", level: "mid" }, { icon: "colab", level: "mid" } ]
    },
    {
      tag: "Despliegue", title: "Flujo de trabajo y publicación",
      desc: "Control de versiones, colaboración en equipo y publicación de proyectos en la nube.",
      items: [ { icon: "git", level: "high" }, { icon: "github", level: "high" }, { icon: "vercel", level: "high" }, { icon: "supabase", level: "mid" } ]
    }
  ],

  certificates: [
    {
      img: "https://images.credly.com/images/e3541a0c-dd4a-4820-8052-5001006efc85/blob",
      title: "AWS Academy Graduate — Cloud Foundations",
      desc: "Fundamentos de la nube AWS: servicios clave, arquitectura, seguridad y modelos de precios.",
      date: "12 jul 2024",
      issuer: "Amazon Web Services Training and Certification",
      url: "https://www.credly.com/badges/0c12e8e5-a9aa-4e92-bb56-e37a909956ff/linked_in_profile"
    },
    {
      img: "https://images.credly.com/images/7f7ea828-a10d-44f8-8baa-58a9c1af7671/blob",
      title: "AWS Academy Graduate — Cloud Security Foundations",
      desc: "Seguridad en la nube: identidades, redes, cifrado y cumplimiento de normativas AWS.",
      date: "5 jul 2026",
      issuer: "Amazon Web Services Training and Certification",
      url: "https://www.credly.com/badges/46b3fa59-cd96-4dc4-a3d3-876eef6f6edc/linked_in_profile"
    },
    {
      img: "https://images.credly.com/images/683b2e3c-0d28-42a2-ab84-7203a209f9d0/blob",
      title: "AWS Academy Graduate — Machine Learning for NLP",
      desc: "Procesamiento de lenguaje natural con servicios de ML de AWS: comprehend, Lex y transcripción.",
      date: "2 jul 2026",
      issuer: "Amazon Web Services Training and Certification",
      url: "https://www.credly.com/badges/eb362ccb-cc96-4284-8096-76de42edcc20/linked_in_profile"
    },
    {
      img: "https://images.credly.com/images/8a28a66c-151d-4f2d-b021-ca7d3e146437/blob",
      title: "AWS Academy Graduate — Data Engineering",
      desc: "Ingeniería de datos: ETL, Data Pipeline, Glue, Redshift y analítica a escala en AWS.",
      date: "15 ago 2026",
      issuer: "Amazon Web Services Training and Certification",
      url: "https://www.credly.com/badges/9f023a99-106a-4da7-b38c-63e80bf6c131/public_url"
    }
  ],

  projects: [
    {
      key: "proyecto_bodega",
      title: "Sistema Bodega",
      desc: "Sistema modular de gestión de bodegas e inventario en PHP y MySQL: stock, productos, proveedores y movimientos.",
      url: "https://github.com/elJulioDev/Sistema-Bodega",
      techs: ["html5", "css3", "javascript", "php", "mysql", "xampp"]
    },
    {
      key: "proyecto_marcaciones",
      title: "Sistema Marcaciones",
      desc: "Plataforma web de asistencia laboral municipal: importa relojes biométricos, calcula horas e incidencias y exporta XLSX.",
      url: "https://github.com/elJulioDev/Sistema-Marcaciones",
      techs: ["html5", "css3", "javascript", "php", "mysql", "xampp"]
    },
    {
      key: "proyecto_nn",
      title: "Neural Network",
      desc: "Librería de Deep Learning desde cero con Python y NumPy: capas, optimizadores y validación numérica de gradientes.",
      url: "https://github.com/elJulioDev/Neural_Network",
      techs: ["python", "numpy"]
    },
    {
      key: "proyecto_kf",
      title: "Key Forge",
      desc: "Herramienta de escritorio en Python para remapear teclas en tiempo real, con reglas globales o por aplicación.",
      url: "https://github.com/elJulioDev/KeyForge",
      techs: ["python"]
    },
  ]
};
