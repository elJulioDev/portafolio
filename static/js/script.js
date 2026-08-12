/* ============================================================
   PORTFOLIO — Interacciones base
   ============================================================ */

(function () {
  "use strict";

  const d = document;

  /* ---------- Año en el footer ---------- */
  const yearEl = d.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Menú móvil (panel lateral) ---------- */
  const toggle = d.getElementById("menuToggle");
  const menu = d.getElementById("navbarMenu");
  const menuClose = d.getElementById("menuClose");
  const menuBackdrop = d.getElementById("menuBackdrop");

  function setMenu(open) {
    menu.classList.toggle("is-open", open);
    toggle.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    if (menuBackdrop) menuBackdrop.classList.toggle("is-open", open);
    d.body.classList.toggle("no-scroll", open);
  }

  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      setMenu(!menu.classList.contains("is-open"));
    });

    // Cerrar al hacer clic en un enlace
    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setMenu(false));
    });

    // Cerrar con el botón X del panel
    if (menuClose) menuClose.addEventListener("click", () => setMenu(false));

    // Cerrar al hacer clic en el fondo oscurecido
    if (menuBackdrop) menuBackdrop.addEventListener("click", () => setMenu(false));

    // Cerrar al pulsar la tecla Escape
    d.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setMenu(false);
    });
  }

  /* ---------- Navbar: fondo al hacer scroll ---------- */
  const navbar = d.getElementById("navbar");

  function onScroll() {
    if (navbar) navbar.classList.toggle("is-scrolled", window.scrollY > 10);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Enlace activo según la sección visible ---------- */
  const sections = d.querySelectorAll("section[id]");
  const navLinks = d.querySelectorAll(".navbar__link");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((link) => {
            link.classList.toggle(
              "is-active",
              link.getAttribute("href") === "#" + entry.target.id
            );
          });
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((section) => observer.observe(section));
  }

  /* ---------- Animación reveal al hacer scroll ---------- */
  const revealEls = d.querySelectorAll(".section");

  if ("IntersectionObserver" in window) {
    revealEls.forEach((el) => el.classList.add("reveal"));

    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* ---------- Tecnologías: acordeón desplegable solo en móvil ---------- */
  const techCatHeads = d.querySelectorAll(".tech-cat__head");
  const isDesktopViewport = () =>
    window.matchMedia("(min-width: 721px)").matches;

  function syncTechAccordion() {
    techCatHeads.forEach((head) => {
      const details = head.closest(".tech-cat");
      if (!details) return;
      details.open = isDesktopViewport();
    });
  }

  techCatHeads.forEach((head) => {
    head.addEventListener("click", (e) => {
      if (isDesktopViewport()) e.preventDefault();
    });
  });

  window.addEventListener("resize", syncTechAccordion);
  syncTechAccordion();

  /* ---------- Formulario de contacto (validación + Formspree) ---------- */
  const form = d.getElementById("contactForm");
  const status = d.getElementById("formStatus");

  // Crea tu form en https://formspree.io con tu correo y pega aquí tu endpoint:
  const FORMSPREE_ENDPOINT = "https://formspree.io/f/mvkpzjyd";

  if (form) {
    const inputs = form.querySelectorAll(".contact__input");
    const submitBtn = form.querySelector('[type="submit"]');

    function clearError(input) {
      input.classList.remove("is-invalid");
    }

    function markError(input) {
      input.classList.add("is-invalid");
    }

    inputs.forEach((input) => {
      input.addEventListener("input", () => clearError(input));
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const nombre = form.querySelector("#nombre");
      const email = form.querySelector("#email");
      const mensaje = form.querySelector("#mensaje");

      let valid = true;
      [nombre, email, mensaje].forEach((input) => clearError(input));

      if (nombre.value.trim().length < 2) {
        markError(nombre);
        valid = false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        markError(email);
        valid = false;
      }
      if (mensaje.value.trim().length < 5) {
        markError(mensaje);
        valid = false;
      }

      if (!valid) {
        status.textContent = "Revisa los campos marcados en rojo.";
        return;
      }

      status.textContent = "Enviando tu mensaje...";
      submitBtn.disabled = true;

      fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Formspree error " + res.status);
          return res.json();
        })
        .then(() => {
          status.textContent = "¡Gracias por tu mensaje! Te responderé pronto.";
          form.reset();
        })
        .catch(() => {
          status.textContent = "No se pudo enviar el mensaje. Inténtalo de nuevo.";
        })
        .finally(() => {
          submitBtn.disabled = false;
        });
    });
  }

  /* ---------- Carrusel de proyectos (flechas + puntos + teclado) ---------- */
  const carousel = d.getElementById("proyectosCarousel");
  const dotsWrap = d.getElementById("proyectosDots");

  if (carousel && dotsWrap) {
    const track = carousel.querySelector(".carousel__track");
    const prevBtn = carousel.querySelector(".carousel__arrow--prev");
    const nextBtn = carousel.querySelector(".carousel__arrow--next");
    const slides = Array.from(track.children);

    const count = slides.length;
    const dots = [];
    let index = 0;

    function goTo(i) {
      index = Math.max(0, Math.min(count - 1, i));
      update();
    }

    function update() {
      track.style.transform = "translateX(" + -index * 100 + "%)";
      dots.forEach((dot, i) => {
        dot.classList.toggle("is-active", i === index);
        dot.setAttribute("aria-selected", String(i === index));
      });
      if (prevBtn) prevBtn.disabled = index === 0;
      if (nextBtn) nextBtn.disabled = index === count - 1;
    }

    // Puntos indicadores (uno por proyecto)
    for (let i = 0; i < count; i++) {
      const dot = d.createElement("button");
      dot.type = "button";
      dot.className = "carousel__dot";
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", "Ir al proyecto " + (i + 1));
      dot.addEventListener("click", () => goTo(i));
      dotsWrap.appendChild(dot);
      dots.push(dot);
    }

    // Flechas
    if (prevBtn) prevBtn.addEventListener("click", () => goTo(index - 1));
    if (nextBtn) nextBtn.addEventListener("click", () => goTo(index + 1));

    // Navegación con teclado
    carousel.setAttribute("tabindex", "-1");
    carousel.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") goTo(index - 1);
      if (e.key === "ArrowRight") goTo(index + 1);
    });

    update();
  }

  /* ---------- Leer más en descripciones (mobile) ---------- */
  const descBlocks = d.querySelectorAll(".project-description");

  function refreshDescToggles() {
    descBlocks.forEach((block) => {
      const p = block.querySelector(".project-info__description");
      const btn = block.querySelector(".project-desc-toggle");
      if (!p || !btn) return;
      if (block.classList.contains("is-expanded")) return;
      const overflowing = p.scrollHeight > p.clientHeight + 1;
      btn.classList.toggle("is-visible", overflowing);
    });
  }

  descBlocks.forEach((block) => {
    const btn = block.querySelector(".project-desc-toggle");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const expanded = block.classList.toggle("is-expanded");
      btn.textContent = expanded ? "Leer menos" : "Leer más...";
      btn.setAttribute("aria-expanded", String(expanded));
    });
  });

  refreshDescToggles();
  window.addEventListener("resize", refreshDescToggles);
  window.addEventListener("load", refreshDescToggles);

  /* ---------- Galería de imágenes en proyectos ---------- */
  const IMG_DIR = "static/img/";

  let manifestPromise = null;

  function loadManifest() {
    if (!manifestPromise) {
      manifestPromise = fetch(IMG_DIR + "manifest.json")
        .then((r) => (r.ok ? r.json() : {}))
        .catch(() => ({}));
    }
    return manifestPromise;
  }

  async function discoverImages(baseName) {
    const manifest = await loadManifest();
    return manifest[baseName] || [];
  }

  function renderGallery(vis, images, altText) {
    const count = images.length;
    if (count === 1) {
      const img = d.createElement("img");
      img.src = images[0];
      img.alt = altText;
      img.loading = "lazy";
      vis.appendChild(img);
      return;
    }
    const grid = d.createElement("div");
    grid.className = "project-gallery project-gallery--" + Math.min(count, 3);
    const visibleCount = Math.min(count, 3);
    for (let i = 0; i < visibleCount; i++) {
      const item = d.createElement("div");
      item.className = "project-gallery__item";
      const img = d.createElement("img");
      img.src = images[i];
      img.alt = altText + " " + (i + 1);
      img.loading = "lazy";
      item.appendChild(img);
      if (i === 2 && count > 3) {
        const more = d.createElement("div");
        more.className = "project-gallery__more";
        more.textContent = "+" + (count - 2);
        item.appendChild(more);
      }
      grid.appendChild(item);
    }
    vis.appendChild(grid);
  }

  /* ---------- Lightbox: carrusel de imágenes ---------- */
  const lightbox = d.getElementById("lightbox");
  const lightboxImg = d.getElementById("lightboxImg");
  const lightboxClose = d.getElementById("lightboxClose");
  const lightboxPrev = d.getElementById("lightboxPrev");
  const lightboxNext = d.getElementById("lightboxNext");
  const lightboxCounter = d.getElementById("lightboxCounter");
  const lightboxDots = d.getElementById("lightboxDots");

  let lbImages = [];
  let lbIndex = 0;
  let lbDotEls = [];

  function renderLightboxDots() {
    if (!lightboxDots) return;
    lightboxDots.innerHTML = "";
    lbDotEls = [];
    if (lbImages.length <= 1) return;
    lbImages.forEach((_, i) => {
      const dot = d.createElement("button");
      dot.type = "button";
      dot.className = "lightbox__dot";
      dot.setAttribute("aria-label", "Ir a la imagen " + (i + 1));
      dot.addEventListener("click", (e) => {
        e.stopPropagation();
        lbIndex = i;
        updateLightbox();
      });
      lightboxDots.appendChild(dot);
      lbDotEls.push(dot);
    });
  }

  function openLightbox(images, index, alt) {
    if (!lightbox || !lightboxImg) return;
    lbImages = images;
    lbIndex = index;
    renderLightboxDots();
    updateLightbox();
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    d.body.classList.add("no-scroll");
  }

  function updateLightbox() {
    if (!lightboxImg) return;
    lightboxImg.src = lbImages[lbIndex];
    lightboxImg.alt = "Imagen " + (lbIndex + 1) + " de " + lbImages.length;
    const multi = lbImages.length > 1;
    if (lightboxPrev) lightboxPrev.style.display = multi ? "" : "none";
    if (lightboxNext) lightboxNext.style.display = multi ? "" : "none";
    if (lightboxPrev) lightboxPrev.disabled = lbIndex === 0;
    if (lightboxNext) lightboxNext.disabled = lbIndex === lbImages.length - 1;
    if (lightboxCounter) {
      lightboxCounter.style.display = multi ? "" : "none";
      lightboxCounter.textContent = (lbIndex + 1) + " / " + lbImages.length;
    }
    if (lightboxDots) lightboxDots.style.display = multi ? "" : "none";
    lbDotEls.forEach((dot, i) => dot.classList.toggle("is-active", i === lbIndex));
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    d.body.classList.remove("no-scroll");
  }

  function lbPrev() {
    if (lbIndex > 0) { lbIndex--; updateLightbox(); }
  }

  function lbNext() {
    if (lbIndex < lbImages.length - 1) { lbIndex++; updateLightbox(); }
  }

  if (lightbox) {
    if (lightboxPrev) lightboxPrev.addEventListener("click", (e) => { e.stopPropagation(); lbPrev(); });
    if (lightboxNext) lightboxNext.addEventListener("click", (e) => { e.stopPropagation(); lbNext(); });

    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox || e.target === lightboxClose) closeLightbox();
    });

    d.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") lbPrev();
      if (e.key === "ArrowRight") lbNext();
    });

    /* Swipe táctil para moverse entre imágenes */
    let lbTouchStartX = 0;
    let lbTouchDeltaX = 0;

    lightbox.addEventListener("touchstart", (e) => {
      if (e.touches.length !== 1) return;
      lbTouchStartX = e.touches[0].clientX;
      lbTouchDeltaX = 0;
    }, { passive: true });

    lightbox.addEventListener("touchmove", (e) => {
      if (e.touches.length !== 1) return;
      lbTouchDeltaX = e.touches[0].clientX - lbTouchStartX;
    }, { passive: true });

    lightbox.addEventListener("touchend", () => {
      const threshold = 45;
      if (lbTouchDeltaX < -threshold) lbNext();
      else if (lbTouchDeltaX > threshold) lbPrev();
      lbTouchDeltaX = 0;
    });
  }

  /* ---------- Descubrir imágenes y generar galerías ---------- */
  const visuals = d.querySelectorAll(".project-visual[data-project]");
  const projectImagesMap = new Map();

  visuals.forEach(async (vis) => {
    const baseName = vis.dataset.project;
    if (!baseName) return;
    const images = await discoverImages(baseName);
    if (!images.length) return;
    projectImagesMap.set(vis, images);
    const altText = vis.closest(".project-row")?.querySelector(".project-info__title")?.textContent || "Proyecto";
    renderGallery(vis, images, altText);

    vis.addEventListener("click", (e) => {
      const img = e.target.closest("img");
      if (!img) return;
      e.stopPropagation();
      const all = projectImagesMap.get(vis);
      if (!all || !all.length) return;
      const imgFilename = new URL(img.src).pathname.split("/").pop();
      const idx = all.findIndex((p) => p.split("/").pop() === imgFilename);
      openLightbox(all, Math.max(0, idx), img.alt);
    });
  });
})();