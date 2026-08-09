# AGENTS.md

Static single-page portfolio (Spanish), published on **GitHub Pages** as an online presentation of the author. No build system, no package.json, no tests, no lint. Open `index.html` directly or run `python3 -m http.server`. `node` is not installed — for sanity checks use Python one-liners, e.g. tag balance on HTML or brace balance on CSS:

```sh
python3 -c "import html.parser
class V(html.parser.HTMLParser):
  def __init__(s): super().__init__(); s.st=[]
  def handle_starttag(s,t,a):
    if t not in ('meta','link','img','br','input','hr','path','svg','source','stop','rect','line'): s.st.append(t)
  def handle_endtag(s,t):
    if s.st and s.st[-1]==t: s.st.pop()
v=V(); v.feed(open('index.html').read()); print(v.st or 'ok')"
python3 -c "s=open('static/css/style.css').read(); print('braces:', s.count('{')==s.count('}'))"
```

## Source of truth for personal data

`info/` (gitignoreado) holds the real data (skills, LinkedIn info, certificate PDFs). Fill placeholders in `index.html` from there:

- Name: **Alexis González Pérez** · GitHub: `github.com/elJulioDev` · LinkedIn: `linkedin.com/in/alexis-gonzález-pérez/` · Email: `alexisdevelopgz@gmail.com`
- All personal data is filled in: hero/about bio, tech section as 6 balanced category boxes (3–4 items each) — Frontend, Backend, Datos, Videojuegos, IA/datos, Herramientas y despliegue — with context descriptions + level labels (volt = Avanzado, amarillo #f2c94c = Intermedio, coral = Bajo), contact and footer. C# lives only in Videojuegos; XAMPP sits in Backend (local PHP/MySQL env); Vercel/Supabase merged into Herramientas y despliegue.
- **Regression gotcha**: the tech section has reverted to 7 cards before (Herramientas and Despliegue split). If it shows 7 `tech-cat`, merge those two back into one "Herramientas y despliegue" card (Git, GitHub, Vercel, Supabase).
- Certificates: only the 3 AWS badges are on the page (Cloud Foundations 2024, Cloud Security 2026, ML for NLP 2026) — each with the Credly badge image (`images.credly.com/.../blob`) and a "Ver insignia" link. `mi informacion/` also holds 6 INACAP certificates requested but NOT yet added: 5 dated 31-jul-2024 (Soporte Computacional, Desarrollo de aplicaciones básicas, Desarrollador Full Stack, Diseño ágil de sistemas, Diseño y gestión de base de datos) + the 2026 "Aceptación Certificado_encrypted_.pdf" (título profesional Ingeniero en Informática). `pdftotext`/`pdfinfo`/`pdftoppm` are installed to read them. The degree PDF's filename is an ugly email artifact — rename it before linking.
- Tech icons: Devicon font classes with custom color modifiers for icons without a visible brand color (Django volt, Unity/Vercel white, Oracle rojo, MariaDB azul, Supabase verde). XAMPP has no Devicon icon — it uses an inline SVG (`#fb7a24`, simple-icons path) inside the Backend card. Pygame has no Devicon/Simple Icons glyph — it reuses the Python Devicon icon (its base library). Power BI uses the official Wikimedia SVG (3 yellow/orange bars, gradients `pbi-g1/g2/g3`) inside the Datos card.
- CV button points to `static/CV_ALEXIS_GONZALEZ_PEREZ.pdf` (public in the repo, downloadable). Keep `download` attribute.
- `static/img/me.jpeg` is the real photo (640x640, square) — used only in "Sobre mí" (`index.html:95`), NOT in the hero (the hero uses the Unsplash slider).

## Design system

- All colors/fonts live in `:root` (static/css/style.css): volt `#afff47` (base accent), `--volt-bright: #c8ff4d` (hover-only emphasis), coral `#ff6b84`, bg `#0b0e11`. Fonts: Bebas Neue (headings, uppercase), Inter (body), Space Mono (eyebrows/labels).
- Palette + font trio are modeled on `ejemplo/landing.css` (a gym landing — reference only, do not wire it in).
- Needs internet: Google Fonts, Devicon CDN (`<i class="devicon-xxx colored">` for tech icons), and 3 Unsplash URLs in the hero slider. Offline breaks visuals.
- Buttons: GitHub/CTA/submit = `btn--primary` (volt fill, brightens on hover); LinkedIn/CV = `btn--solid` (dark fill, fills volt on hover). Keep both solid. The projects' "Ver código" is NOT a button — it's a `.project-link` inline link (arrow SVG + volt hover) styled separately in style.css.
- **`.container` is fluid on purpose**: `width: calc(100% - 4rem)` (2rem margin each side). It previously had a fixed 1100px cap; a user request made it stretch with the viewport — do not reintroduce a small fixed max-width. Text blocks self-cap via `ch`-based max-widths where it matters.
- Hero title: `.hero__title-name` span is `display: block`, forcing "González." onto its own line under "Alexis".

## Structure quirks worth knowing

- **Hero slider**: crossfade via `fadeCrossfade` keyframes (15s cycle, 3 `.hero__bg-slide` divs + `.hero__bg-overlay`). Edit URLs around index.html:58-61.
- **About photo**: `.about__frame` wraps the `<img>` — the frame carries the coral border (2px) + ring + `overflow: hidden`; the hover zoom (`scale(1.08)`) applies ONLY to the inner `<img>`, never to the frame. Square `1/1` aspect matches the source. `.about` uses `align-items: center` so the photo centers vertically against the text.
- **Projects = carousel** (`#proyectosCarousel`): each project is a `.project-row` card (grid image `16/9` left + content right, stacks on mobile) inside `.carousel__track`. Add a project by duplicating `<article class="project-row">` (`.project-visual` + `.project-info` with a `.project-techs` icon list and a `.project-link`). First row is "Sistema Bodega" with `static/img/proyecto_sistema-bodega.png`; rows 2–3 are placeholder cards awaiting real content.
  - Technologies render as Devicon icons + label (like the tech section): `<i class="devicon-xxx-... colored project-techs__icon">`. XAMPP has no Devicon glyph — it reuses the inline SVG (`#fb7a24`) from the Backend card. Express has no `colored` variant, so it uses `.project-techs__icon--light` (white) to stay visible on dark bg.
  - Carousel is JS-driven (static/js/script.js): dots are generated from slide count, plus prev/next arrows and arrow-key nav, with `disabled` states at the ends. No drag/swipe (removed by request). `.carousel__arrow`, `.carousel__dot` live in static/css/style.css.
  - **Gotcha (lightbox order)**: the `#lightbox` markup must stay BEFORE `<script src="static/js/script.js">` — the script reads `#lightbox`/`#lightboxImg` at load, so if the div comes after, `openLightbox` silently fails.
  - **Lightbox**: clicking the project image (`cursor: zoom-in`) opens `#lightbox` (fixed overlay + `#lightboxImg`); close via × button, clicking the backdrop, or Escape. Adds/removes `body.no-scroll`. Only real `<img>`s open it (placeholders don't).
- **Mobile nav = right-side drawer**, and this is fragile:
  - `<header class="navbar">` has `backdrop-filter`, which makes it a containing block for fixed descendants. The fixed drawer still resolves correctly (top:0 / right:0 / height:100dvh), but `#menuBackdrop` MUST stay outside `<header>` or it clips to the 72px navbar.
  - z-index layering is intentional: navbar `106` > backdrop `105` (the drawer is inside the navbar's stacking context; if navbar drops below 105, the backdrop blurs over and blocks the drawer — known bug, already fixed).
  - The drawer has NO side box-shadow (removed by request); it separates from the backdrop via `border-left` only. Drawer links are borderless with a rounded volt-tinted hover background.
  - `.navbar__menu-footer` (the Contacto CTA) must stay `display: flex` on desktop; only `.navbar__menu-header` is hidden on desktop.
- Contact form sends via **Formspree** (AJAX `fetch`). Endpoint is already real: `FORMSPREE_ENDPOINT = "https://formspree.io/f/mvkpzjyd"` (`script.js:129`) — do not overwrite it back to a placeholder. Hidden `_subject` input sets the email subject; `name="email"` acts as Formspree reply-to. The form shows sending/ok/error states via `#formStatus` and disables the button while sending.
