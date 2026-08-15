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
      d.querySelectorAll(".project-description.is-expanded").forEach((block) => {
        block.classList.remove("is-expanded");
        const btn = block.querySelector(".project-desc-toggle");
        if (btn) { btn.textContent = "Leer más..."; btn.setAttribute("aria-expanded", "false"); }
      });
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
    carousel.addEventListener("keydown", (e) => {e});

    /* Swipe táctil con animación de arrastre para el Carrusel */
    let trackStartX = 0;
    let trackStartY = 0;
    let trackIsDragging = false;
    let trackDirectionLocked = false;
    let trackIsHorizontal = false;

    track.addEventListener('touchstart', (e) => {
      trackIsDragging = true;
      trackDirectionLocked = false;
      trackIsHorizontal = false;
      trackStartX = e.touches[0].clientX;
      trackStartY = e.touches[0].clientY;
      track.style.transition = 'none'; 
    }, { passive: true });

    track.addEventListener('touchmove', (e) => {
      if (!trackIsDragging) return;
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const diffX = currentX - trackStartX;
      const diffY = currentY - trackStartY;

      if (!trackDirectionLocked) {
        if (Math.abs(diffX) > 10 || Math.abs(diffY) > 10) {
          trackDirectionLocked = true;
          trackIsHorizontal = Math.abs(diffX) > Math.abs(diffY);
        }
        return;
      }

      if (!trackIsHorizontal) return;

      e.preventDefault();
      const baseTranslate = -index * 100;
      track.style.transform = `translateX(calc(${baseTranslate}% + ${diffX}px))`;
    }, { passive: false });

    track.addEventListener('touchend', (e) => {
      if (!trackIsDragging) return;
      trackIsDragging = false;
      track.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
      
      if (!trackIsHorizontal) {
        track.style.transform = "translateX(" + -index * 100 + "%)";
        return;
      }

      const endX = e.changedTouches[0].clientX;
      const diffX = endX - trackStartX;
      const threshold = 80;
      const prevIndex = index;

      if (diffX < -threshold && index < count - 1) {
        index++;
      } else if (diffX > threshold && index > 0) {
        index--;
      }

      if (index !== prevIndex) {
        update();
      } else {
        track.style.transform = "translateX(" + -index * 100 + "%)";
      }
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
      btn.classList.toggle("is-visible", p.scrollHeight > p.clientHeight + 1);
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
    const img = d.createElement("img");
    img.src = images[0];
    img.alt = altText;
    img.loading = "lazy";
    vis.appendChild(img);

    if (count > 1) {
      const badge = d.createElement("div");
      badge.className = "project-visual__badge";
      badge.setAttribute("aria-hidden", "true");
      badge.innerHTML =
        '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>' +
        "<span>+" + (count - 1) + "</span>";
      vis.appendChild(badge);
    }
  }

  /* ---------- Lightbox: carrusel de imágenes ---------- */
  const lightbox = d.getElementById("lightbox");
  const lightboxViewport = d.getElementById("lightboxViewport");
  const lightboxTrack = d.getElementById("lightboxTrack");
  const lightboxImg = d.getElementById("lightboxImg");
  const lightboxImgPrev = d.getElementById("lightboxImgPrev");
  const lightboxImgNext = d.getElementById("lightboxImgNext");
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
    if (lightboxTrack) {
      lightboxTrack.style.transition = "none";
      lightboxTrack.style.transform = "translateX(0)";
    }
    lightboxImg.src = lbImages[lbIndex];
    lightboxImg.alt = "Imagen " + (lbIndex + 1) + " de " + lbImages.length;
    if (lightboxImgPrev) lightboxImgPrev.src = lbIndex > 0 ? lbImages[lbIndex - 1] : "";
    if (lightboxImgNext) lightboxImgNext.src = lbIndex < lbImages.length - 1 ? lbImages[lbIndex + 1] : "";
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
    lbResetZoom();
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

  /* Zoom táctil (pinch) + arrastre dentro del lightbox */
  let lbScale = 1;
  let lbTx = 0;
  let lbTy = 0;
  let lbPinch = null;
  let lbPan = null;
  let lbSwipeX = 0;
  let lbSwipeDelta = 0;
  let lbSwiping = false;
  let lbLastTap = 0;
  let lbBox = null;

  function lbClamp(v, min, max) { return Math.min(max, Math.max(min, v)); }

  function lbApplyZoom() {
    lightboxImg.style.transform = "translate(" + lbTx + "px," + lbTy + "px) scale(" + lbScale + ")";
    if (lightboxViewport) lightboxViewport.classList.toggle("is-zooming", lbScale > 1);
  }

  function lbCaptureBox() {
    const vr = lightboxViewport.getBoundingClientRect();
    const r = lightboxImg.getBoundingClientRect();
    lbBox = { left: r.left - vr.left, top: r.top - vr.top, width: r.width, height: r.height };
  }

  function lbResetZoom() {
    lbScale = 1;
    lbTx = 0;
    lbTy = 0;
    lbPinch = null;
    lbPan = null;
    lightboxImg.style.transition = "transform 0.25s ease";
    lbApplyZoom();
    setTimeout(() => {
      lightboxImg.style.transition = "none";
      lbCaptureBox();
    }, 260);
  }

  function lbClampPan() {
    if (!lbBox || !lightboxViewport) return;
    const vw = lightboxViewport.clientWidth;
    const vh = lightboxViewport.clientHeight;
    const cx = lbBox.left + lbBox.width / 2;
    const cy = lbBox.top + lbBox.height / 2;
    const sw = lbScale * lbBox.width;
    const sh = lbScale * lbBox.height;
    const minCx = sw >= vw ? vw - sw / 2 : vw / 2;
    const maxCx = sw >= vw ? sw / 2 : vw / 2;
    const minCy = sh >= vh ? vh - sh / 2 : vh / 2;
    const maxCy = sh >= vh ? sh / 2 : vh / 2;
    lbTx = lbClamp(lbTx, minCx - cx, maxCx - cx);
    lbTy = lbClamp(lbTy, minCy - cy, maxCy - cy);
  }

  function lbHandleTap() {
    const now = Date.now();
    if (now - lbLastTap < 300) {
      lbLastTap = 0;
      if (lbScale > 1) {
        lbResetZoom();
      } else {
        lbScale = 2.5;
        lightboxImg.style.transition = "transform 0.3s ease";
        lbApplyZoom();
        setTimeout(() => { lightboxImg.style.transition = "none"; }, 320);
      }
    } else {
      lbLastTap = now;
    }
  }

  if (lightbox) {
    if (lightboxPrev) lightboxPrev.addEventListener("click", (e) => { e.stopPropagation(); lbPrev(); });
    if (lightboxNext) lightboxNext.addEventListener("click", (e) => { e.stopPropagation(); lbNext(); });

    lightbox.addEventListener("click", (e) => {
      if (e.target.tagName !== "IMG") closeLightbox();
    });

    d.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") lbPrev();
      if (e.key === "ArrowRight") lbNext();
    });

    /* Zoom táctil (pinch) + arrastre + swipe dentro del lightbox */
    lightbox.addEventListener("touchstart", (e) => {
      if (!lightboxTrack) return;
      const t = e.touches;
      if (t.length === 2) {
        lbSwiping = false;
        lbPan = null;
        const dx = t[1].clientX - t[0].clientX;
        const dy = t[1].clientY - t[0].clientY;
        const vr = lightboxViewport.getBoundingClientRect();
        lbPinch = {
          dist: Math.hypot(dx, dy),
          midX: (t[0].clientX + t[1].clientX) / 2,
          midY: (t[0].clientY + t[1].clientY) / 2,
          scale: lbScale,
          tx: lbTx,
          ty: lbTy,
          originX: vr.left + (lbBox ? lbBox.left + lbBox.width / 2 : 0),
          originY: vr.top + (lbBox ? lbBox.top + lbBox.height / 2 : 0)
        };
        lightboxImg.style.transition = "none";
        return;
      }
      if (t.length === 1 && lbScale > 1) {
        lbPinch = null;
        lbSwiping = false;
        lbPan = { x: t[0].clientX, y: t[0].clientY, tx: lbTx, ty: lbTy };
        lightboxImg.style.transition = "none";
        return;
      }
      if (lbScale === 1) {
        lbSwipeX = t[0].clientX;
        lbSwipeDelta = 0;
        lbSwiping = true;
        lightboxTrack.style.transition = "none";
      }
    }, { passive: true });

    lightbox.addEventListener("touchmove", (e) => {
      if (!lightboxTrack) return;
      const t = e.touches;
      if (lbPinch && t.length >= 2) {
        e.preventDefault();
        const dx = t[1].clientX - t[0].clientX;
        const dy = t[1].clientY - t[0].clientY;
        const dist = Math.hypot(dx, dy);
        const midX = (t[0].clientX + t[1].clientX) / 2;
        const midY = (t[0].clientY + t[1].clientY) / 2;
        const p = lbPinch;
        const s = lbClamp(p.scale * dist / Math.max(1, p.dist), 1, 4);
        lbScale = s;
        const lx = (p.midX - p.originX - p.tx) / p.scale;
        const ly = (p.midY - p.originY - p.ty) / p.scale;
        lbTx = midX - p.originX - s * lx;
        lbTy = midY - p.originY - s * ly;
        if (s <= 1) { lbTx = 0; lbTy = 0; }
        lbClampPan();
        lbApplyZoom();
        return;
      }
      if (lbPan && t.length === 1) {
        e.preventDefault();
        lbTx = lbPan.tx + (t[0].clientX - lbPan.x);
        lbTy = lbPan.ty + (t[0].clientY - lbPan.y);
        lbClampPan();
        lbApplyZoom();
        return;
      }
      if (lbSwiping && t.length === 1) {
        const delta = t[0].clientX - lbSwipeX;
        const atStart = lbIndex === 0 && delta > 0;
        const atEnd = lbIndex === lbImages.length - 1 && delta < 0;
        lbSwipeDelta = delta * (atStart || atEnd ? 0.3 : 1);
        lightboxTrack.style.transform = "translateX(" + lbSwipeDelta + "px)";
      }
    }, { passive: false });

    lightbox.addEventListener("touchend", (e) => {
      if (!lightboxTrack) return;
      const t = e.touches;
      const ct = e.changedTouches;
      if (lbPinch && t.length < 2) {
        lbPinch = null;
        if (lbScale > 1 && t.length === 1) {
          lbPan = { x: t[0].clientX, y: t[0].clientY, tx: lbTx, ty: lbTy };
        }
        return;
      }
      if (lbPan) {
        const last = ct.length ? ct[ct.length - 1] : null;
        const moved = last ? Math.hypot(last.clientX - lbPan.x, last.clientY - lbPan.y) : 0;
        lbPan = null;
        if (t.length === 0 && moved < 10) {
          lbHandleTap();
        }
        return;
      }
      if (lbSwiping) {
        lbSwiping = false;
        if (Math.abs(lbSwipeDelta) < 10) {
          lbHandleTap();
          return;
        }
        lightboxTrack.style.transition = "transform 0.3s ease";
        const threshold = 60;
        const width = lightboxTrack.clientWidth;
        if (lbSwipeDelta < -threshold && lbIndex < lbImages.length - 1) {
          lightboxTrack.style.transform = "translateX(" + (-width) + "px)";
          setTimeout(() => { lbIndex++; updateLightbox(); }, 300);
        } else if (lbSwipeDelta > threshold && lbIndex > 0) {
          lightboxTrack.style.transform = "translateX(" + width + "px)";
          setTimeout(() => { lbIndex--; updateLightbox(); }, 300);
        } else {
          lightboxTrack.style.transform = "translateX(0)";
        }
      }
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

  /* ---------- Modal de certificados ---------- */
  const certModal = d.getElementById("certModal");
  const certModalImg = d.getElementById("certModalImg");
  const certModalTitle = d.getElementById("certModalTitle");
  const certModalDesc = d.getElementById("certModalDesc");
  const certModalIssuer = d.getElementById("certModalIssuer");
  const certModalDate = d.getElementById("certModalDate");
  const certModalUrl = d.getElementById("certModalUrl");

  function openCertModal(card) {
    if (!certModal) return;
    certModalImg.src = card.dataset.certImg;
    certModalImg.alt = card.dataset.certTitle;
    certModalTitle.textContent = card.dataset.certTitle;
    certModalDesc.textContent = card.dataset.certDesc;
    certModalIssuer.textContent = card.dataset.certIssuer;
    certModalDate.textContent = card.dataset.certDate;
    certModalUrl.href = card.dataset.certUrl;
    certModal.setAttribute("aria-hidden", "false");
    d.body.classList.add("no-scroll");
  }

  function closeCertModal() {
    if (!certModal) return;
    certModal.setAttribute("aria-hidden", "true");
    d.body.classList.remove("no-scroll");
  }

  d.querySelectorAll(".cert-card__badge-wrap").forEach((wrap) => {
    wrap.addEventListener("click", () => {
      openCertModal(wrap.closest(".cert-card"));
    });
  });

  if (certModal) {
    certModal.querySelectorAll("[data-cert-close]").forEach((el) => {
      el.addEventListener("click", closeCertModal);
    });
    d.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && certModal.getAttribute("aria-hidden") === "false") {
        closeCertModal();
      }
    });
  }
})();