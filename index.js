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
  const section = document.querySelector(".portfolio");
  const viewport = document.querySelector(".pf-viewport");
  const track = document.querySelector(".pf-track");

  if (!section || !viewport || !track) return;

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

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const getBreakpoint = () => {
    if (window.innerWidth >= 1201) return "desktop";
    if (window.innerWidth >= 601) return "tablet";
    return "mobile";
  };

  const getPatternItem = (index) => {
    const pattern = PATTERN[getBreakpoint()];
    return pattern[index % pattern.length];
  };

  let x = 0;
  let minX = 0;
  let maxX = 0;
  let rafId = null;
  let lastTime = 0;

  let hoverSpeed = 0;
  let isDragging = false;
  let startX = 0;
  let startSliderX = 0;

  let hasIntroPlayed = false;
  let introActive = false;
  let introTargetX = 0;

  function renderSlides() {
    track.innerHTML = "";

    PF_IMAGES.forEach((item, index) => {
      const pattern = getPatternItem(index);

      const figure = document.createElement("figure");
      figure.className = "pf-card";

      figure.style.setProperty("--pf-w", `${pattern.w}px`);
      figure.style.setProperty("--pf-h", `${pattern.h}px`);
      figure.style.setProperty("--pf-y", `${pattern.y}px`);

      const img = document.createElement("img");
      img.className = "pf-img";
      img.src = item.src;
      img.alt = item.alt;
      img.loading = "lazy";
      img.decoding = "async";

      figure.appendChild(img);
      track.appendChild(figure);
    });
  }

  function applyTransform() {
    track.style.transform = `translate3d(${Math.round(x)}px, -50%, 0)`;
  }

  function calculateLimits() {
    const viewportWidth = viewport.clientWidth;
    const trackWidth = track.scrollWidth;

    maxX = 0;
    minX = Math.min(0, viewportWidth - trackWidth);

    x = clamp(x, minX, maxX);
    applyTransform();
  }

  function waitForImages() {
    const images = Array.from(track.querySelectorAll("img"));

    if (!images.length) {
      calculateLimits();
      return;
    }

    let loaded = 0;

    function done() {
      loaded++;

      if (loaded >= images.length) {
        calculateLimits();
      }
    }

    images.forEach((img) => {
      if (img.complete) {
        done();
      } else {
        img.addEventListener("load", done, { once: true });
        img.addEventListener("error", done, { once: true });
      }
    });
  }

  function startAnimation() {
    if (rafId !== null) return;

    lastTime = performance.now();
    rafId = requestAnimationFrame(animate);
  }

  function stopAnimationIfIdle() {
    if (introActive || hoverSpeed !== 0 || isDragging) return;

    cancelAnimationFrame(rafId);
    rafId = null;
  }

  function animate(timestamp) {
    const delta = Math.min((timestamp - lastTime) / 1000, 0.04);
    lastTime = timestamp;

    if (introActive) {
      x += (introTargetX - x) * 0.075;

      if (Math.abs(introTargetX - x) < 1) {
        x = introTargetX;
        introActive = false;
        track.classList.add("pf-track--intro-done");
      }

      applyTransform();
    }

    if (!introActive && hoverSpeed !== 0 && !isDragging) {
      x = clamp(x + hoverSpeed * delta, minX, maxX);
      applyTransform();
    }

    rafId = requestAnimationFrame(animate);
    stopAnimationIfIdle();
  }

  function playIntroAnimation() {
    if (hasIntroPlayed || prefersReducedMotion) return;

    hasIntroPlayed = true;
    introActive = true;

    const introOffset = viewport.clientWidth * 0.65;

    x = clamp(-introOffset, minX, maxX);
    introTargetX = 0;

    track.classList.add("pf-track--intro");
    applyTransform();
    startAnimation();
  }

  function setupIntroObserver() {
    if (!("IntersectionObserver" in window)) {
      playIntroAnimation();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry.isIntersecting) {
          playIntroAnimation();
          observer.disconnect();
        }
      },
      {
        threshold: 0.35,
      },
    );

    observer.observe(section);
  }

  function handleDesktopMove(event) {
    if (isDragging) return;

    const rect = viewport.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const width = rect.width;
    const zone = width * 0.3;

    if (mouseX < zone) {
      const power = 1 - mouseX / zone;

      // Mouse on the left side -> images move to the right.
      hoverSpeed = 180 + 520 * power;
    } else if (mouseX > width - zone) {
      const power = 1 - (width - mouseX) / zone;

      // Mouse on the right side -> images move to the left.
      hoverSpeed = -(180 + 520 * power);
    } else {
      hoverSpeed = 0;
    }

    startAnimation();
  }

  function handleDesktopLeave() {
    hoverSpeed = 0;
  }

  function handlePointerDown(event) {
    isDragging = true;
    startX = event.clientX;
    startSliderX = x;

    introActive = false;
    hoverSpeed = 0;

    viewport.classList.add("is-dragging");
    viewport.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event) {
    if (!isDragging) return;

    const dx = event.clientX - startX;
    x = clamp(startSliderX + dx, minX, maxX);

    applyTransform();
    event.preventDefault();
  }

  function handlePointerUp(event) {
    if (!isDragging) return;

    isDragging = false;
    viewport.classList.remove("is-dragging");

    if (viewport.hasPointerCapture(event.pointerId)) {
      viewport.releasePointerCapture(event.pointerId);
    }
  }

  function init() {
    renderSlides();
    waitForImages();
    setupIntroObserver();

    viewport.addEventListener("mousemove", handleDesktopMove);
    viewport.addEventListener("mouseleave", handleDesktopLeave);

    viewport.addEventListener("pointerdown", handlePointerDown);
    viewport.addEventListener("pointermove", handlePointerMove);
    viewport.addEventListener("pointerup", handlePointerUp);
    viewport.addEventListener("pointercancel", handlePointerUp);
  }

  init();

  let resizeTimer = 0;

  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() => {
      const wasIntroPlayed = hasIntroPlayed;

      renderSlides();
      waitForImages();

      if (wasIntroPlayed) {
        x = clamp(x, minX, maxX);
        applyTransform();
      }
    }, 120);
  });
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
