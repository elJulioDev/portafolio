export interface Project {
  key: string
  title: string
  desc: string
  url: string
  techs: string[]
  images?: string[]
  date?: string
  icon?: string
}

export const PROJECTS: Project[] = [
  {
    key: "proyecto_bodega",
    title: "Sistema Bodega",
    icon: "Warehouse",
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
    icon: "Clock",
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
    key: "proyecto_survivor",
    title: "ProyectSurvivor",
    icon: "Gamepad2",
    date: "ene. 2026",
    desc: `Videojuego 2D de supervivencia top-down (estilo Vampire Survivors) desarrollado en Python utilizando la librería Pygame. Construido sobre un motor personalizado enfocado en la optimización extrema de memoria y CPU para soportar hordas masivas de entidades, incluyendo compatibilidad multiplataforma para PC y dispositivos móviles (Android).

**Arquitectura del Motor y Optimización:**
- Bucle de juego independiente de los fotogramas (*Frame-rate independent*) basado en multiplicadores de *DeltaTime*, permitiendo físicas e interpolaciones fluidas a tasas de refresco variables (60, 120, 240 y desbloqueado).
- Gestor de memoria en bucle cerrado (*Object Pooling* estricto) para el reciclaje continuo de proyectiles, partículas y enemigos, eliminando la creación de objetos en tiempo real y los picos de latencia (*stutters*) por el *Garbage Collector*.
- Sistema de renderizado espacial por *Chunks* que "hornea" (*bakes*) las calcomanías estáticas (como sangre) en texturas dinámicas, reduciendo la saturación de RAM al descargar zonas lejanas del mapa de forma automática (*eviction*).
- Algoritmo de Nivel de Detalle Dinámico (*LOD*) que monitoriza la carga computacional (partículas vivas y enemigos renderizados) para degradar o simplificar la complejidad de los efectos visuales según las capacidades de la plataforma.

**Lógica Matemática y Sistemas de Colisión:**
- Detección de colisión continua (*Swept Collision / Line Sweeping*) para proyectiles supersónicos, utilizando algoritmos de intersección de vectores (\`rect.clipline\`) y posiciones históricas para asegurar el registro de impactos entre fotogramas y evitar el traspaso de *hitboxes*.
- Motor de particionamiento espacial (*Spatial Grid*) optimizado con algoritmos de hashing unidimensional (claves numéricas combinadas en lugar de tuplas de coordenadas) para resolver proximidad y colisiones en un tiempo constante ultrarrápido O(1).
- Inteligencia Artificial de enjambre con sistema *Anti-Clustering*, combinando repulsión radial cuadrática entre agentes, carriles paramétricos espaciales y cálculo de vectores predictivos que anticipan la trayectoria del jugador.

**Mecánicas y Plataformas:**
- Árbol de progresión sistémico (*Vampire Survivors style*) donde las estadísticas de la horda enemiga (velocidad, daño y salud máxima) escalan matemáticamente de forma proporcional al nivel alcanzado y los minutos de supervivencia del jugador.
- Integración paramétrica *Multi-Touch* para Android, implementando *joysticks* virtuales multipunto, reescalado dinámico de los límites de cámara y módulos de auto-apuntado según la detección del sistema operativo subyacente.`,
    url: "https://github.com/elJulioDev/ProyectSurvivor",
    techs: ["Python", "Pygame", "Android", "Game Dev", "Matemáticas"],
    images: [
      "/images/proyectos/proyecto_ps.png",
      "/images/proyectos/proyecto_ps_2.png"
    ],
  },
  {
    key: "proyecto_clubhouse",
    title: "ClubHouse Digital",
    icon: "Dumbbell",
    date: "dic. 2025",
    desc: `Plataforma web integral para la administración y gestión operativa de gimnasios, desarrollada como proyecto de título para Ingeniería en Informática en INACAP. Construida con un enfoque en la automatización del control de acceso y la escalabilidad del negocio.

**Arquitectura y Backend (Django):**
- Desarrollada en Python con Django 5, incorporando soporte híbrido para bases de datos relacionales (PostgreSQL vía Neon para producción y MySQL para entornos locales).
- Backend de autenticación personalizado que permite inicios de sesión seguros tanto por RUT como por correo electrónico, bloqueando el acceso de superusuarios desde el front-end.
- Despliegue optimizado con \`WhiteNoise\` para la gestión de archivos estáticos y scripts de inicialización por consola (\`init_system\`) para automatizar la creación de entornos y el poblamiento de datos con \`Faker\`.

**Control de Acceso y Seguridad (Tecnología QR):**
- Arquitectura basada en tres niveles de roles estrictos (Administrador, Moderador, Socio) que delimitan el acceso a dashboards, funciones operativas y endpoints de la API interna.
- Sistema generador de códigos QR únicos utilizando \`qrcode[pil]\`, integrados en un pase digital para cada socio activo.
- Escáner QR desarrollado en JavaScript puro capaz de validar accesos en tiempo real mediante solicitudes asíncronas, verificando la vigencia de la membresía y evitando accesos duplicados en el mismo día.

**Gestión Operativa y Automatización:**
- Motor de planes y membresías que procesa renovaciones, cambios y cancelaciones, calculando automáticamente fechas de vencimiento y prorrateos.
- Generación dinámica de documentos en PDF utilizando \`xhtml2pdf\`, permitiendo la creación y envío automático de contratos de servicio y comprobantes de pago por correo electrónico (\`smtp\`).
- Dashboards analíticos personalizados por rol que muestran métricas financieras (ingresos mensuales, ticket promedio), tendencias de retención y bitácoras de asistencia en vivo.`,
    url: "https://github.com/elJulioDev/GimnasioQR",
    techs: ["Python", "Django", "PostgreSQL", "MySQL", "JavaScript", "HTML/CSS"],
  },
  {
    key: "proyecto_nn",
    title: "Neural Network",
    icon: "Brain",
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
    icon: "Keyboard",
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
  {
    key: "proyecto_uw",
    title: "Ultimate Warriors",
    icon: "Swords",
    date: "2018 - 2025",
    desc: `Juego de peleas 2D completo desarrollado enteramente en PowerPoint utilizando VBA. Este proyecto tiene un inmenso valor personal, ya que fue donde aprendí a programar y forjé las bases de la Programación Orientada a Objetos (POO), con un desarrollo técnico y evolutivo continuo que abarcó desde 2018 hasta su finalización en 2025.

**Arquitectura y Motor del Juego:**
- Motor gráfico propio (dbxwCore) construido en VBA con un *Game Loop* sincronizado por DeltaTime (vía \`GetTickCount\`) e integración de APIs nativas de Windows (\`GetAsyncKeyState\`, \`winmm.dll\`) para controles cero-latencia y gestión de audio.
- Sistema de físicas y colisiones calculadas por frame, incluyendo gravedad, límites de pantalla dinámicos y detección precisa mediante *hitboxes* y *hurtboxes*.
- Renderizado de sprites optimizado con sistema de caché en memoria, permitiendo animaciones de combate fluidas y renderizado de capas para efectos visuales complejos (auras y transformaciones).

**Mecánicas de Combate y Escalamiento Dinámico:**
- Sistema de transformaciones de fases infinitas que recalcula estadisticas base (velocidad, daño, defensa) en tiempo real mediante algoritmos matemáticos, incluyendo estados de riesgo/recompensa como el *Kaioken* (drenaje de vida calculado por tick).
- Mecánicas avanzadas propias de *Fighting Games*: sistema de *Input Buffer* para lectura de combos, guardia, choques de embestidas, alteraciones de tiempo (*TimeJump*) y un sistema de físicas direccionales de retroceso (*knockback*).
- Más de 25 habilidades pasivas y activas desarrolladas de forma modular (teletransporte, auto-evasiones con probabilidad estadística, manipulación de dimensiones y bloqueos de habilidades).

**Diseño Data-Driven e Inteligencia Artificial:**
- Arquitectura 100% basada en datos (Data-Driven Design): un parser JSON desarrollado a medida para VBA permite cargar dinámicamente 30 personajes, 22 escenarios y configuraciones de combate.
- Desarrollo de un bot de Inteligencia Artificial externo en Python que funciona en paralelo, reaccionando al entorno del juego en tiempo real a través del intercambio estructurado y ultrarrápido de archivos JSON con el motor de VBA.`,
    url: "https://github.com/elJulioDev/Ultimate-Warriors",
    techs: ["VBA", "PowerPoint", "Python", "POO", "JSON", "Game Dev"],
  },
]