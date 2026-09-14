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
    date: "abr. 2026",
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