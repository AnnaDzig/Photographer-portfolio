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
      { w: 360, h: 520, mt: 56, mb: 0 },
      { w: 280, h: 374, mt: 0, mb: 158 },
      { w: 220, h: 220, mt: 0, mb: 215 },
      { w: 280, h: 374, mt: 0, mb: 280 },
      { w: 400, h: 534, mt: 0, mb: 0 },
    ],
    tablet: [
      { w: 260, h: 360, mt: 40, mb: 0 },
      { w: 280, h: 374, mt: 0, mb: 36 },
      { w: 220, h: 220, mt: 0, mb: 72 },
      { w: 280, h: 374, mt: 0, mb: 110 },
      { w: 400, h: 534, mt: 0, mb: 0 },
    ],
    mobile: [
      { w: 180, h: 250, mt: 20, mb: 0 },
      { w: 160, h: 220, mt: 64, mb: 0 },
      { w: 120, h: 120, mt: 84, mb: 0 },
      { w: 180, h: 250, mt: 0, mb: 52 },
      { w: 220, h: 300, mt: 0, mb: 40 },
    ],
  };

  const getBP = () => {
    const w = window.innerWidth;
    if (w >= 1201) return "desktop";
    if (w >= 601) return "tablet";
    return "mobile";
  };
  const getPatternItem = (index, bp) => {
    const p = PATTERN[bp];
    return p[index % p.length];
  };

  let shift = 0;
  let baseOffset = 0;
  let minShift = 0,
    maxShift = 0;
  let gapPx = 20;

  function renderSlides() {
    track.innerHTML = "";
    const bp = getBP();

    PF_IMAGES.forEach((item, i) => {
      const img = document.createElement("img");
      const pat = getPatternItem(i, bp);

      img.src = item.src;
      img.alt = item.alt || "Portfolio photo";
      img.className = "pf";
      img.loading = "lazy";

      img.style.width = `${pat.w}px`;
      img.style.height = `${pat.h}px`;
      img.style.objectFit = "cover";
      img.style.marginTop = pat.mt ? `${pat.mt}px` : "0";
      img.style.marginBottom = pat.mb ? `${pat.mb}px` : "0";

      track.appendChild(img);
    });
  }

  function calcGeometry() {
    const cs = getComputedStyle(track);
    const gapStr = cs.gap || cs.columnGap || "20px";
    gapPx = parseFloat(gapStr) || 20;

    const slides = Array.from(track.children);
    const widths = slides.map((el) => el.getBoundingClientRect().width);
    const contentWidth =
      widths.reduce((a, b) => a + b, 0) +
      gapPx * Math.max(0, slides.length - 1);

    const vw = viewport.clientWidth;

    baseOffset = (vw - contentWidth) / 2;

    maxShift = -baseOffset;
    minShift = vw - contentWidth - baseOffset;

    shift = clamp(shift, minShift, maxShift);

    applyTransform();
  }

  function clamp(v, a, b) {
    return Math.min(Math.max(v, a), b);
  }

  function applyTransform() {
    const y = window.innerWidth > 600 ? "-50%" : "0";
    const x = Math.round(baseOffset + shift);
    track.style.transform = `translate3d(${x}px, ${y}, 0)`;
  }

  let rafId = null;
  let hoverSpeed = 0; // px/s
  let lastTs = 0;
  const mqlHover = window.matchMedia("(hover: hover) and (pointer: fine)");

  function onPointerMoveDesktop(e) {
    const rect = viewport.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const w = rect.width;
    const zone = w * 0.3;

    if (x < zone) {
      const t = 1 - x / zone;
      hoverSpeed = +(160 + 520 * t);
    } else if (x > w - zone) {
      const t = 1 - (w - x) / zone;
      hoverSpeed = -(160 + 520 * t);
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

  function step(ts) {
    const dt = Math.max(0, (ts - lastTs) / 1000);
    lastTs = ts;

    if (hoverSpeed !== 0) {
      shift = clamp(shift + hoverSpeed * dt, minShift, maxShift);
      applyTransform();
      rafId = requestAnimationFrame(step);
    } else {
      rafId = null;
    }
  }

  let dragging = false;
  let startX = 0;
  let startShift = 0;

  const isCoarse = () =>
    window.matchMedia("(pointer: coarse)").matches || window.innerWidth <= 600;

  function onPointerDown(e) {
    if (!isCoarse()) return;
    dragging = true;
    startX = e.clientX;
    startShift = shift;
    viewport.setPointerCapture(e.pointerId);
    e.preventDefault();
  }
  function onPointerMove(e) {
    if (!dragging) return;
    const dx = e.clientX - startX;
    shift = clamp(startShift + dx, minShift, maxShift);
    applyTransform();
    e.preventDefault();
  }
  function onPointerUp(e) {
    if (!dragging) return;
    dragging = false;
    viewport.releasePointerCapture(e.pointerId);
  }

  function init() {
    renderSlides();
    const imgs = Array.from(track.querySelectorAll("img"));
    let left = imgs.length;
    const tryCalc = () => {
      left--;
      if (left <= 0) {
        calcGeometry();
      }
    };
    if (left === 0) calcGeometry();
    imgs.forEach((img) => {
      if (img.complete) tryCalc();
      else img.addEventListener("load", tryCalc, { once: true });
    });

    viewport.onpointerdown = onPointerDown;
    viewport.onpointermove = onPointerMove;
    viewport.onpointerup = onPointerUp;
    viewport.onpointercancel = onPointerUp;

    toggleHoverHandlers();
  }

  function toggleHoverHandlers() {
    viewport.removeEventListener("pointermove", onPointerMoveDesktop);
    viewport.removeEventListener("pointerleave", onPointerLeaveDesktop);

    if (mqlHover.matches) {
      viewport.addEventListener("pointermove", onPointerMoveDesktop);
      viewport.addEventListener("pointerleave", onPointerLeaveDesktop);
    }
  }

  init();

  let resizeTimer = 0;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const prevShift = shift;
      renderSlides();
      calcGeometry();
      shift = clamp(prevShift, minShift, maxShift);
      applyTransform();
      toggleHoverHandlers();
    }, 120);
  });

  mqlHover.addEventListener?.("change", toggleHoverHandlers);
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
