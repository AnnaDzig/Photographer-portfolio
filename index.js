document.addEventListener("DOMContentLoaded", () => {
  setupBurger();
  setupPortfolioSlider();
  setupFaqAccordions();
  setupBookingModal();
  setupScrollDown();
});

/* =========================================
        BURGER 
   ========================================= */
function setupBurger() {
  const header = document.querySelector(".site-header");
  const burger = document.querySelector(".burger");
  const menu = document.querySelector(".menu");
  const drawer = document.getElementById("mobile-menu");

  if (!header || !burger || !menu) return;

  const setHeaderH = () => {
    const h = header.offsetHeight || 56;
    document.documentElement.style.setProperty("--header-h", `${h}px`);
  };
  setHeaderH();
  window.addEventListener("resize", setHeaderH);

  const open = () => {
    document.body.classList.add("menu-open");
    burger.classList.add("is-active");
    burger.setAttribute("aria-expanded", "true");

    if (drawer) {
      drawer.hidden = false;
      drawer.classList.add("offcanvas--open");
      drawer.setAttribute("aria-hidden", "false");
      const first = drawer.querySelector(
        'a,button,[tabindex]:not([tabindex="-1"])',
      );
      first && first.focus({ preventScroll: true });
    }
  };

  const close = () => {
    document.body.classList.remove("menu-open");
    burger.classList.remove("is-active");
    burger.setAttribute("aria-expanded", "false");

    if (drawer) {
      drawer.classList.remove("offcanvas--open");
      drawer.setAttribute("aria-hidden", "true");
      setTimeout(() => (drawer.hidden = true), 350);
    }
  };

  const isOpen = () => burger.classList.contains("is-active");

  burger.addEventListener("click", () => (isOpen() ? close() : open()));

  if (drawer) {
    drawer.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", close);
    });
  }

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen()) close();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 769 && isOpen()) close();
  });
}

/* =========================
   PORTFOLIO SLIDER (PF)
   ========================= */
function setupPortfolioSlider() {
  const viewport = document.querySelector(".pf-viewport");
  const track = document.querySelector(".pf-track");

  if (!viewport || !track) return;

  const PF_IMAGES = [
    { src: "image/png/img-20.png", alt: "Portfolio photo 1" },
    { src: "image/png/img-17.png", alt: "Portfolio photo 2" },
    { src: "image/png/img-1.png", alt: "Portfolio photo 3" },
    { src: "image/png/img-2.png", alt: "Portfolio photo 4" },
    { src: "image/png/img-5.png", alt: "Portfolio photo 5" },
    { src: "image/png/img-6.png", alt: "Portfolio photo 6" },
    { src: "image/png/img-7.png", alt: "Portfolio photo 7" },
    { src: "image/png/img-8.png", alt: "Portfolio photo 8" },
    { src: "image/png/img-9.png", alt: "Portfolio photo 9" },
    { src: "image/png/img-12.png", alt: "Portfolio photo 10" },
    { src: "image/png/img-13.png", alt: "Portfolio photo 11" },
    { src: "image/png/img-14.png", alt: "Portfolio photo 12" },
    { src: "image/png/img-15.png", alt: "Portfolio photo 13" },
    { src: "image/png/img-16.png", alt: "Portfolio photo 14" },
    { src: "image/png/img-18.png", alt: "Portfolio photo 15" },
    { src: "image/png/img-19.png", alt: "Portfolio photo 16" },
    { src: "image/png/img-21.png", alt: "Portfolio photo 17" },
    { src: "image/png/img-22.png", alt: "Portfolio photo 18" },
    { src: "image/png/img-3.png", alt: "Portfolio photo 19" },
    { src: "image/png/img-4.png", alt: "Portfolio photo 20" },
  ];

  const PATTERN = {
    desktop: [
      { w: 270, h: 380, y: 70 },
      { w: 180, h: 250, y: -120 },
      { w: 360, h: 500, y: 20 },
      { w: 210, h: 210, y: -170 },
      { w: 260, h: 360, y: 120 },
      { w: 420, h: 560, y: -10 },
      { w: 190, h: 260, y: -135 },
      { w: 300, h: 420, y: 80 },
    ],
    tablet: [
      { w: 220, h: 310, y: 55 },
      { w: 160, h: 220, y: -95 },
      { w: 300, h: 420, y: 15 },
      { w: 180, h: 180, y: -135 },
      { w: 220, h: 310, y: 95 },
      { w: 340, h: 460, y: -5 },
    ],
    mobile: [
      { w: 150, h: 210, y: 35 },
      { w: 120, h: 170, y: -60 },
      { w: 210, h: 280, y: 10 },
      { w: 110, h: 110, y: -80 },
      { w: 160, h: 220, y: 60 },
      { w: 230, h: 300, y: -5 },
    ],
  };

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const getBreakpoint = () => {
    if (window.innerWidth >= 1201) return "desktop";
    if (window.innerWidth >= 601) return "tablet";
    return "mobile";
  };

  const getPatternItem = (index) => {
    const currentPattern = PATTERN[getBreakpoint()];
    return currentPattern[index % currentPattern.length];
  };

  let shift = 0;
  let baseOffset = 0;
  let minShift = 0;
  let maxShift = 0;
  let rafId = null;
  let hoverSpeed = 0;
  let lastTs = 0;

  const hoverMedia = window.matchMedia("(hover: hover) and (pointer: fine)");

  function renderSlides() {
    track.innerHTML = "";

    PF_IMAGES.forEach((item, index) => {
      const pattern = getPatternItem(index);

      const card = document.createElement("figure");
      card.className = "pf-card";

      card.style.setProperty("--pf-w", `${pattern.w}px`);
      card.style.setProperty("--pf-h", `${pattern.h}px`);
      card.style.setProperty("--pf-y", `${pattern.y}px`);

      const img = document.createElement("img");
      img.className = "pf-img";
      img.src = item.src;
      img.alt = item.alt || "Portfolio photo";
      img.loading = "lazy";
      img.decoding = "async";

      card.appendChild(img);
      track.appendChild(card);
    });
  }

  function getContentWidth() {
    const cards = Array.from(track.children);
    const gap = parseFloat(getComputedStyle(track).columnGap) || 28;

    const cardsWidth = cards.reduce((sum, card) => {
      return sum + card.getBoundingClientRect().width;
    }, 0);

    return cardsWidth + gap * Math.max(0, cards.length - 1);
  }

  function calcGeometry() {
    const viewportWidth = viewport.clientWidth;
    const contentWidth = getContentWidth();

    baseOffset = (viewportWidth - contentWidth) / 2;

    maxShift = -baseOffset;
    minShift = viewportWidth - contentWidth - baseOffset;

    shift = clamp(shift, minShift, maxShift);

    applyTransform();
  }

  function applyTransform() {
    const x = Math.round(baseOffset + shift);
    track.style.transform = `translate3d(${x}px, -50%, 0)`;
  }

  function step(timestamp) {
    const delta = Math.max(0, (timestamp - lastTs) / 1000);
    lastTs = timestamp;

    if (hoverSpeed !== 0) {
      shift = clamp(shift + hoverSpeed * delta, minShift, maxShift);
      applyTransform();
      rafId = requestAnimationFrame(step);
    } else {
      rafId = null;
    }
  }

  function onPointerMoveDesktop(event) {
    const rect = viewport.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const width = rect.width;
    const zone = width * 0.28;

    if (x < zone) {
      const power = 1 - x / zone;
      hoverSpeed = 180 + 520 * power;
    } else if (x > width - zone) {
      const power = 1 - (width - x) / zone;
      hoverSpeed = -(180 + 520 * power);
    } else {
      hoverSpeed = 0;
    }

    if (rafId === null && hoverSpeed !== 0) {
      lastTs = performance.now();
      rafId = requestAnimationFrame(step);
    }
  }

  function onPointerLeaveDesktop() {
    hoverSpeed = 0;
  }

  let dragging = false;
  let startX = 0;
  let startShift = 0;

  const isTouchLike = () => {
    return (
      window.matchMedia("(pointer: coarse)").matches || window.innerWidth <= 600
    );
  };

  function onPointerDown(event) {
    if (!isTouchLike()) return;

    dragging = true;
    startX = event.clientX;
    startShift = shift;

    viewport.setPointerCapture(event.pointerId);
    viewport.classList.add("is-dragging");

    event.preventDefault();
  }

  function onPointerMove(event) {
    if (!dragging) return;

    const dx = event.clientX - startX;
    shift = clamp(startShift + dx, minShift, maxShift);

    applyTransform();
    event.preventDefault();
  }

  function onPointerUp(event) {
    if (!dragging) return;

    dragging = false;
    viewport.classList.remove("is-dragging");

    if (viewport.hasPointerCapture(event.pointerId)) {
      viewport.releasePointerCapture(event.pointerId);
    }
  }

  function toggleHoverHandlers() {
    viewport.removeEventListener("pointermove", onPointerMoveDesktop);
    viewport.removeEventListener("pointerleave", onPointerLeaveDesktop);

    if (hoverMedia.matches) {
      viewport.addEventListener("pointermove", onPointerMoveDesktop);
      viewport.addEventListener("pointerleave", onPointerLeaveDesktop);
    }
  }

  function waitForImagesThenCalc() {
    const images = Array.from(track.querySelectorAll("img"));

    if (images.length === 0) {
      calcGeometry();
      return;
    }

    let loadedCount = 0;

    const done = () => {
      loadedCount++;

      if (loadedCount >= images.length) {
        calcGeometry();
      }
    };

    images.forEach((img) => {
      if (img.complete) {
        done();
      } else {
        img.addEventListener("load", done, { once: true });
        img.addEventListener("error", done, { once: true });
      }
    });
  }

  function init() {
    renderSlides();
    waitForImagesThenCalc();

    viewport.addEventListener("pointerdown", onPointerDown);
    viewport.addEventListener("pointermove", onPointerMove);
    viewport.addEventListener("pointerup", onPointerUp);
    viewport.addEventListener("pointercancel", onPointerUp);

    toggleHoverHandlers();
  }

  init();

  let resizeTimer = 0;

  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() => {
      const oldShift = shift;

      renderSlides();
      waitForImagesThenCalc();

      shift = oldShift;
      calcGeometry();
      toggleHoverHandlers();
    }, 120);
  });

  hoverMedia.addEventListener?.("change", toggleHoverHandlers);
}

/* =========================
     FAQ accordions
   ========================= */

function setupFaqAccordions() {
  const list = document.querySelector(".faq__list");
  if (!list) return;

  const items = Array.from(list.querySelectorAll(".faq-item"));
  if (!items.length) return;
  let saved = parseInt(localStorage.getItem("faqOpenIndex"), 10);
  if (Number.isNaN(saved) || saved < 0 || saved >= items.length) saved = 0;

  items.forEach((d, i) => {
    d.open = i === saved;
  });

  items.forEach((d, i) => {
    d.addEventListener("toggle", () => {
      if (d.open) {
        items.forEach((other) => {
          if (other !== d) other.open = false;
        });
        localStorage.setItem("faqOpenIndex", String(i));
      } else {
        const anyOpen = items.some((it) => it.open);
        if (!anyOpen) localStorage.setItem("faqOpenIndex", "-1");
      }
    });

    const header = d.querySelector(".faq-q");
    if (header) {
      header.style.cursor = "pointer";
    }
  });
}

/* =========================
     Modal
   ========================= */
function setupBookingModal() {
  const openers = document.querySelectorAll(".price-card__btn");
  const modal = document.getElementById("booking-modal");
  if (!openers.length || !modal) return;

  const dialog = modal.querySelector(".modal__dialog");

  const open = () => {
    modal.classList.add("modal--open");
    modal.removeAttribute("hidden");
    document.body.classList.add("no-scroll");
    dialog.focus({ preventScroll: true });
  };

  const close = () => {
    modal.classList.remove("modal--open");
    document.body.classList.remove("no-scroll");
    modal.setAttribute("hidden", "");
  };

  openers.forEach((btn) => btn.addEventListener("click", open));

  modal.addEventListener("click", (e) => {
    if (e.target.hasAttribute("data-close")) close();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });

  const form = modal.querySelector(".modal__form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      close();
    });
  }
}

/* =========================================
        Scroll Down
   ========================================= */
function setupScrollDown() {
  const scrollBtn = document.querySelector(".scroll");
  const aboutSection = document.querySelector("#about");
  if (!scrollBtn || !aboutSection) return;

  scrollBtn.addEventListener("click", (e) => {
    e.preventDefault();
    aboutSection.scrollIntoView({ behavior: "smooth" });
  });
}
