"use client"

import { useEffect, useRef } from "react"

import { cn } from "@/lib/utils"

const VERTEX_SHADER = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`

const FRAGMENT_SHADER = `
#extension GL_OES_standard_derivatives : enable
precision highp float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec3 u_bgColor;
uniform vec3 u_lineColor;
uniform float u_lineOpacity;
uniform float u_scale;
uniform float u_levels;
uniform float u_lineWidth;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 10.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.5 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 105.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

float fbm(vec3 p) {
  float n = snoise(p) * 0.65;
  n += snoise(p * 2.0) * 0.35;
  return n;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);
  vec2 p = (uv - 0.5) * aspect * u_scale;

  float n = fbm(vec3(p, u_time * 0.045));
  n = (n + 1.0) / 2.0;

  float scaled = n * u_levels;
  float lower = floor(scaled);
  float diff = scaled - lower;
  float distToEdge = min(diff, 1.0 - diff);

  float aa = clamp(fwidth(scaled), 0.001, 0.08);
  float line = 1.0 - smoothstep(u_lineWidth, u_lineWidth + aa, distToEdge);

  vec3 color = mix(u_bgColor, u_lineColor, line * u_lineOpacity);
  gl_FragColor = vec4(color, 1.0);
}
`

let colorProbeCanvas: HTMLCanvasElement | null = null

function cssColorToRgb(value: string): [number, number, number] {
  if (!colorProbeCanvas) colorProbeCanvas = document.createElement("canvas")
  colorProbeCanvas.width = 1
  colorProbeCanvas.height = 1
  const ctx = colorProbeCanvas.getContext("2d", { willReadFrequently: true })
  if (!ctx) return [0, 0, 0]
  ctx.fillStyle = value
  ctx.fillRect(0, 0, 1, 1)
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
  return [r / 255, g / 255, b / 255]
}

function readThemeColors() {
  const probe = document.createElement("div")
  probe.style.position = "fixed"
  probe.style.opacity = "0"
  probe.style.pointerEvents = "none"
  probe.className = "bg-background text-foreground"
  document.body.appendChild(probe)
  const style = getComputedStyle(probe)
  const bg = cssColorToRgb(style.backgroundColor)
  const fg = cssColorToRgb(style.color)
  document.body.removeChild(probe)
  return { bg, fg }
}

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)
    return null
  }
  return shader
}

interface TopographicBackgroundProps {
  className?: string
  lineOpacity?: number
  scale?: number
  levels?: number
  lineWidth?: number
  blur?: number
}

export function TopographicBackground({
  className,
  lineOpacity = 0.05,
  scale = 3.2,
  levels = 10,
  lineWidth = 0.045,
  blur = 0,
}: TopographicBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const colorsRef = useRef({ bg: [0, 0, 0] as [number, number, number], fg: [1, 1, 1] as [number, number, number] })

  useEffect(() => {
    const updateColors = () => {
      colorsRef.current = readThemeColors()
    }
    updateColors()

    const observer = new MutationObserver(updateColors)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext("webgl", { alpha: false, antialias: false, powerPreference: "low-power" })
    if (!gl) return

    gl.getExtension("OES_standard_derivatives")

    const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER)
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER)
    if (!vs || !fs) return

    const program = gl.createProgram()
    if (!program) return
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return
    gl.useProgram(program)

    const positionBuffer = gl.createBuffer()
    if (!positionBuffer) return
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const positionLoc = gl.getAttribLocation(program, "a_position")
    gl.enableVertexAttribArray(positionLoc)
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0)

    const uTime = gl.getUniformLocation(program, "u_time")
    const uResolution = gl.getUniformLocation(program, "u_resolution")
    const uBgColor = gl.getUniformLocation(program, "u_bgColor")
    const uLineColor = gl.getUniformLocation(program, "u_lineColor")
    const uLineOpacity = gl.getUniformLocation(program, "u_lineOpacity")
    const uScale = gl.getUniformLocation(program, "u_scale")
    const uLevels = gl.getUniformLocation(program, "u_levels")
    const uLineWidth = gl.getUniformLocation(program, "u_lineWidth")

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const dpr = Math.min(window.devicePixelRatio || 1, 1)
    // Renderizamos el fondo a resolución reducida: el patrón es de baja frecuencia
    // y solo tiene líneas sutiles, así que el ahorro de GPU es enorme sin cambio perceptible.
    const resolutionScale = window.innerWidth < 768 ? 0.55 : 0.75
    const start = performance.now()
    // El ruido se desplaza muy lento: redibujar a ~30 fps es visualmente idéntico
    // y reduce a la mitad el trabajo de GPU por segundo.
    const frameInterval = 1000 / 30
    let raf = 0
    let visible = true
    let lastW = 0
    let lastH = 0
    let lastDraw = 0
    let revealed = false
    let revealTimeout: NodeJS.Timeout | undefined

    // Revela el canvas con fundido + desenfoque suave tras dibujar el primer frame.
    function reveal() {
      if (revealed) return
      revealed = true
      requestAnimationFrame(() => {
        canvas!.style.opacity = "1"
        canvas!.style.filter = blur > 0 ? `blur(${blur}px)` : "blur(0px)"
        revealTimeout = setTimeout(() => {
          canvas!.style.transition = "none"
          canvas!.style.filter = blur > 0 ? `blur(${blur}px)` : "none"
        }, 950)
      })
    }

    function resize() {
      const w = Math.max(1, Math.floor(canvas!.clientWidth * dpr * resolutionScale))
      const h = Math.max(1, Math.floor(canvas!.clientHeight * dpr * resolutionScale))
      if (lastW !== w || lastH !== h) {
        lastW = w
        lastH = h
        canvas!.width = w
        canvas!.height = h
        gl!.viewport(0, 0, w, h)
        // Al redimensionar el canvas se limpia: con reduce-motion no hay loop que lo repinte.
        if (reduceMotion) drawFrame(performance.now())
      }
    }

    let resizeTimeout: NodeJS.Timeout
    function handleResize() {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(resize, 150)
    }

    function drawFrame(now: number) {
      const t = reduceMotion ? 0 : (now - start) / 1000
      const { bg, fg } = colorsRef.current

      gl!.uniform1f(uTime, t)
      gl!.uniform2f(uResolution, lastW, lastH)
      gl!.uniform3f(uBgColor, bg[0], bg[1], bg[2])
      gl!.uniform3f(uLineColor, fg[0], fg[1], fg[2])
      gl!.uniform1f(uLineOpacity, lineOpacity)
      gl!.uniform1f(uScale, scale)
      gl!.uniform1f(uLevels, levels)
      gl!.uniform1f(uLineWidth, lineWidth)

      gl!.drawArrays(gl!.TRIANGLES, 0, 3)
      reveal()
    }

    function render(now: number) {
      if (!visible) return
      raf = requestAnimationFrame(render)

      if (now - lastDraw < frameInterval) return
      lastDraw = now
      drawFrame(now)
    }

    function handleVisibility() {
      visible = document.visibilityState === "visible"
      if (visible) {
        resize()
        if (reduceMotion) {
          drawFrame(performance.now())
        } else {
          raf = requestAnimationFrame(render)
        }
      }
    }

    window.addEventListener("resize", handleResize)

    document.addEventListener("visibilitychange", handleVisibility)
    if (reduceMotion) {
      // Sin animación: mostrar el fondo directamente.
      canvas.style.transition = "none"
      canvas.style.opacity = "1"
      canvas.style.filter = blur > 0 ? `blur(${blur}px)` : "none"
      revealed = true
    }

    resize()
    if (reduceMotion) {
      drawFrame(start)
    } else {
      raf = requestAnimationFrame(render)
    }

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(resizeTimeout)
      if (revealTimeout) clearTimeout(revealTimeout)
      
      window.removeEventListener("resize", handleResize)
      
      document.removeEventListener("visibilitychange", handleVisibility)
      gl.deleteProgram(program)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
      gl.deleteBuffer(positionBuffer)
    }
  }, [lineOpacity, scale, levels, lineWidth, blur])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn("pointer-events-none fixed inset-0 -z-10 h-full w-full scale-110", className)}
      style={{
        contain: "strict",
        // Arranca plano (sin fondo) y el efecto lo revela con fundido + blur.
        opacity: 0,
        filter: "blur(12px)",
        transition: "opacity 900ms ease, filter 900ms ease",
      }}
    />
  )
}
