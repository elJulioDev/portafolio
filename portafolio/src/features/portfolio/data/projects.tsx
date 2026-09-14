export interface Project {
  key: string
  title: string
  desc: string
  url: string
  techs: string[]
  images?: string[]
  date?: string
}

export const PROJECTS: Project[] = [
  {
    key: "proyecto_bodega",
    title: "Sistema Bodega",
    date: "abr. 2026",
    desc: `Plataforma web modular orientada a la administración eficiente de inventario, control de stock y seguimiento de solicitudes de materiales organizacionales. Desarrollada en PHP y MySQL con un enfoque estricto en seguridad, escalabilidad y trazabilidad.

**Arquitectura y Core de Seguridad:**
- Control de Acceso Basado en Roles (RBAC) con tres niveles jerárquicos (Administrador, Encargado, Solicitante) y validación estricta en la protección de rutas.
- Protección integrada contra ataques de falsificación mediante tokens CSRF nativos (generados con random_bytes) y gestión segura de sesiones.
- Estructura lógica escalable, separando el negocio por dominios (Bodegas, Productos, Movimientos, Facturas) apoyada por un motor de helpers de UI personalizados.

**Gestión de Flujos e Inventario:**
- Motor avanzado de Solicitudes de Consumo con sistema de caducidad automática programada para evitar embotellamientos operativos.
- Resoluciones granulares: permite aprobaciones o rechazos parciales por ítem, exigiendo justificación y generando un historial de auditoría automático (logs) por cada interacción.
- Trazabilidad total y automatizada: el despacho de solicitudes y los traslados inter-bodegas actualizan el stock en tiempo real mediante transacciones atómicas.

**Experiencia de Usuario (UI/UX):**
- Sistema de diseño a medida basado en Bootstrap 5.3 con soporte nativo y fluido para temas Claro/Oscuro/Sistema, guardando preferencias localmente.
- Dashboards analíticos dinámicos que se adaptan al rol del usuario, mostrando KPIs en tiempo real, alertas de stock bajo mínimo y gráficos de tendencias.
- Layout responsivo con menú lateral colapsable y vistas de comprobantes de traslado estructuradas específicamente para una impresión física limpia.`,
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
    date: "abr. 2026",
    desc: `Plataforma web corporativa para la gestión integral de la asistencia laboral municipal. Desarrollada completamente desde cero en PHP y MariaDB sin dependencias de terceros (cero uso de Composer), priorizando la estabilidad y el máximo rendimiento en servidores institucionales.

**Arquitectura y Motor Interno:**
- Diseño basado en capas (MVC) con un Front Controller exclusivo, enrutador ligero y autoloader PSR-4 personalizado.
- Importación masiva desde relojes biométricos procesada mediante streaming de archivos NDJSON e inserciones por lotes.
- Exportador nativo de archivos Excel (.xlsx) construido a medida, incluyendo un motor de compresión ZIP implementado en PHP puro.

**Gestión de Asistencia e Incidencias:**
- Algoritmo automatizado que clasifica el estado de los registros (OK, Observado, Incompleto, Error) y calcula las horas trabajadas.
- Deduplicación criptográfica (Hash MD5) de marcaciones para prevenir colisiones en la base de datos y permitir reimportaciones seguras.
- Sistema de recálculo parcial inteligente que respeta y blinda las correcciones manuales ejecutadas por Recursos Humanos.

**Interfaz y Herramientas (UI/UX):**
- Calendario interactivo con vistas de día, matriz semanal y mensual, renderizado de forma fluida vía peticiones AJAX.
- Dashboard analítico, bandeja de resolución de incidencias con filtros avanzados y generación de reportes operativos en un clic.
- Interfaz responsiva moderna con soporte a cambio de tema (claro/oscuro) y validación de RUT chileno (Módulo 11).`,
    url: "https://github.com/elJulioDev/Sistema-Marcaciones",
    techs: ["HTML", "CSS", "JavaScript", "PHP", "MySQL", "XAMPP"],
    images: [
      "/images/proyectos/proyecto_marcaciones.webp",
    ],
  },
  {
    key: "proyecto_nn",
    title: "Neural Network",
    date: "dic. 2025",
    desc: `Librería de Deep Learning vectorizada, modular y desarrollada desde cero en Python y NumPy. Diseñada con una API intuitiva estilo Keras, optimizada para producción y orientada a la estabilidad numérica.

**Arquitectura y Diseño Core:**
- Cachés externos (estado inmutable) para el aislamiento seguro en arquitecturas avanzadas como Redes Siamesas.
- Propagación de dimensiones (Shape Propagation) con validación "fail-fast" en tiempo de compilación.
- Persistencia portable y segura sin usar Pickle (topología en JSON y pesos en NPZ).

**Características Matemáticas:**
- Gradientes verificados numéricamente para garantizar la precisión milimétrica del Backpropagation.
- Eliminación del acoplamiento matemático: Softmax implementa su propio Jacobiano real, y las pérdidas (CCE/BCE) soportan atajos estables mediante "from_logits=True".
- Interfaz genérica entre capas y optimizadores mediante paso de diccionarios por referencia.

**Ecosistema Implementado:**
- Optimizadores: Adam, RMSprop, AdaGrad y SGD (con Momentum, Nesterov y gradient clipping).
- Capas y Regularización: Dense, Dropout, BatchNormalization, L1, L2.
- Utilidades: Callbacks (EarlyStopping, ReduceLROnPlateau, Checkpoints) y múltiples métricas (R2, Accuracy).`,
    url: "https://github.com/elJulioDev/Neural_Network",
    techs: ["Python", "NumPy", "Deep Learning", "Keras API", "Matemáticas"],
  },
  {
    key: "proyecto_kf",
    title: "Key Forge",
    desc: `Herramienta de escritorio desarrollada en Python para la gestión y remapeo de teclas en tiempo real. Utiliza una arquitectura modular que separa la lógica de intercepción (Hooks de bajo nivel) de la interfaz gráfica, garantizando un rendimiento óptimo sin input lag.

**Motor de Remapeo Híbrido:**
- Modos "Hold" (mantener) y "Toggle" (interruptor) para automatizar acciones.
- Algoritmo optimizado de latencia cero mediante búsquedas O(1) en Hash Maps.
- Sistema interno de prevención de recursividad para evitar bucles infinitos.

**Smart Focus (Detección Contextual):**
- Permite vincular perfiles de teclas a ventanas o procesos específicos.
- Optimizado con la API de bajo nivel WinEventHook en Windows para reducir el uso de CPU.
- Soporte integrado para Linux mediante wmctrl y xdotool.

**Experiencia de Usuario (UI/UX):**
- Interfaz gráfica moderna con soporte multitema (claro/oscuro) y cambio de idioma en caliente.
- Widget flotante (Mini-Mode) minimalista que indica el estado del script.
- Splash Screen dinámica y sistema de actualizaciones automáticas desde GitHub Releases.`,
    url: "https://github.com/elJulioDev/KeyForge",
    techs: ["Python", "ttkbootstrap", "WinAPI", "Linux"],
    images: [
      "/images/proyectos/proyecto_kf.webp",
      "/images/proyectos/proyecto_kf_2.webp",
      "/images/proyectos/proyecto_kf_3.webp",
    ],
    date: "nov. 2026",
  },
]