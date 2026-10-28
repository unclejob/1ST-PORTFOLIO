/* ========================================
   Ulo Job Joseph — Portfolio scripts
   Modular IIFE, no globals. Edit CONFIG below.
   ======================================== */
(function () {
  "use strict";

  /* ---------------- CONFIG (edit here) ---------------- */
  const CONFIG = {
    formEndpoint: "https://formspree.io/f/[ADD]", // EDIT: replace with your Formspree form endpoint
    copySuccessText: "Copied!",
  };

  const doc = document;
  const win = window;
  const htmlEl = doc.documentElement;
  const THEME_KEY = "ulo-theme";
  const REDUCED_MOTION = win.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- helpers ---------- */
  const throttle = (fn, limit) => {
    let waiting = false;
    return function (...args) {
      if (!waiting) {
        fn.apply(this, args);
        waiting = true;
        setTimeout(() => { waiting = false; }, limit);
      }
    };
  };

  const $ = (sel, root = doc) => root.querySelector(sel);
  const $$ = (sel, root = doc) => Array.from(root.querySelectorAll(sel));

  /* ---------- theme ---------- */
  function getInitialTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) return saved;
    return win.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }
  function applyTheme(theme) {
    htmlEl.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
    const btn = $("#theme-toggle");
    if (btn) {
      btn.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
      const icon = btn.querySelector(".theme-toggle__icon");
      if (icon) icon.textContent = theme === "dark" ? "☀️" : "🌙";
    }
  }
  function toggleTheme() {
    const current = htmlEl.getAttribute("data-theme") || "dark";
    applyTheme(current === "dark" ? "light" : "dark");
  }

  const themeBtn = $("#theme-toggle");
  if (themeBtn) {
    applyTheme(getInitialTheme());
    themeBtn.addEventListener("click", toggleTheme);
  }

  /* ---------- mobile menu ---------- */
  const menuBtn = $("#mobile-menu-btn");
  const navList = $("#nav-list");
  function closeMenu() {
    if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
    if (navList) navList.hidden = true;
  }
  function toggleMenu() {
    const expanded = menuBtn.getAttribute("aria-expanded") === "true";
    menuBtn.setAttribute("aria-expanded", !expanded);
    navList.hidden = expanded;
  }
  if (menuBtn && navList) {
    menuBtn.addEventListener("click", toggleMenu);
    $$("a", navList).forEach((a) => a.addEventListener("click", closeMenu));
  }

  /* ---------- scroll progress (CSS custom property) ---------- */
  function updateScrollProgress() {
    const total = htmlEl.scrollHeight - win.innerHeight;
    if (total > 0) {
      const pct = Math.min(1, Math.max(0, win.pageYOffset / total));
      htmlEl.style.setProperty("--scroll-progress", pct);
    }
  }
  win.addEventListener("scroll", throttle(updateScrollProgress, 50), { passive: true });
  updateScrollProgress();

  /* ---------- reveal on scroll ---------- */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { root: null, threshold: 0.12, rootMargin: "0 0 -80px 0" }
  );
  $$(".reveal").forEach((el) => observer.observe(el));

  /* ---------- count-up stats ---------- */
  function countUp(el) {
    const target = el.getAttribute("data-target");
    const num = Number(target);
    if (!Number.isFinite(num)) {
      // placeholder left as-is until a real number is provided
      return;
    }
    const duration = 1200;
    const start = 0;
    let startTime = null;
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.floor(progress * num);
      el.textContent = value.toLocaleString();
      if (progress < 1) {
        win.requestAnimationFrame(step);
      }
    }
    win.requestAnimationFrame(step);
  }
  const statObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          countUp(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    },
    { root: null, threshold: 0.5, rootMargin: "0 0 -60px 0" }
  );
  $$(".stat__number").forEach((el) => statObserver.observe(el));

  /* ---------- canvas network animation (hero) ---------- */
  const canvas = $("#hero-canvas");
  if (canvas && !REDUCED_MOTION.matches) {
    const ctx = canvas.getContext("2d");
    let width = 0, height = 0;
    let particles = [];
    let animId = null;
    let visible = true;

    const PARTICLE_COUNT = 34;
    const CONNECT_DIST = 130;

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      width = canvas.width = rect.width;
      height = canvas.height = rect.height;
    }
    function createParticles() {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          radius: Math.random() * 1.6 + 0.6,
        });
      }
    }
    function draw() {
      if (!visible) return;
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = colorMixRgba(varColor("--color-accent"), 0.35);
      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = varColor("--color-accent");
        ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < CONNECT_DIST) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }
      animId = win.requestAnimationFrame(draw);
    }
    function varColor(name) {
      return win.getComputedStyle(htmlEl).getPropertyValue(name).trim() || "#d9a427";
    }
    function colorMixRgba(hex, alpha) {
      let c = hex.charAt(0) === "#" ? hex.substring(1) : hex;
      if (c.length === 3) c = c.split("").join("");
      const r = parseInt(c.substring(0, 2), 16);
      const g = parseInt(c.substring(2, 4), 16);
      const b = parseInt(c.substring(4, 6), 16);
      return `rgba(${r},${g},${b},${alpha})`;
    }
    const heroSection = $("#hero");
    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0].isIntersecting;
        if (visible) {
          if (!animId) draw();
        } else if (animId) {
          win.cancelAnimationFrame(animId);
          animId = null;
        }
      },
      { root: null, threshold: 0.1, rootMargin: "0 0 -100px 0" }
    );
    io.observe(heroSection);
    win.addEventListener("resize", throttle(resize, 150));
    resize();
    createParticles();
    draw();
  }

  /* ---------- project filter ---------- */
  const filterBtns = $$(".filter-btn");
  const projectCards = $$(".project-card");
  function filterProjects(category) {
    filterBtns.forEach((b) => {
      b.classList.toggle("active", b.getAttribute("data-filter") === category);
      b.setAttribute("aria-pressed", b.getAttribute("data-filter") === category);
    });
    projectCards.forEach((card) => {
      const match = category === "all" || card.getAttribute("data-category") === category;
      card.style.display = match ? "contents" : "none";
    });
  }
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => filterProjects(btn.getAttribute("data-filter")));
  });

  /* ---------- modal (accessible, focus trap) ---------- */
  const modals = $$(".modal");
  let activeModal = null;
  let lastFocused = null;

  function focusableElements(container) {
    return $$(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      container
    ).filter((el) => !el.hasAttribute("disabled") && el.offsetParent !== null);
  }

  function openModal(id) {
    const modal = $(`#${id}`);
    if (!modal) return;
    lastFocused = doc.activeElement;
    activeModal = modal;
    modal.style.display = "grid";
    doc.body.style.overflow = "hidden";
    const focusables = focusableElements(modal);
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const closeBtn = $(`.modal__close`, modal);

    function trapFocus(e) {
      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (doc.activeElement === first || doc.activeElement === closeBtn) {
            e.preventDefault();
            last.focus();
          }
        } else if (doc.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    modal.addEventListener("keydown", trapFocus);
    modal._trap = trapFocus;

    setTimeout(() => {
      (closeBtn || first).focus();
    }, 50);

    modal.addEventListener("click", (e) => {
      if (e.target === modal.querySelector(".modal__overlay")) closeModal();
    });
    win.addEventListener("keydown", escHandler);
  }

  function escHandler(e) {
    if (e.key === "Escape") closeModal();
  }

  function closeModal() {
    if (!activeModal) return;
    activeModal.style.display = "none";
    doc.body.style.overflow = "";
    activeModal.removeEventListener("keydown", activeModal._trap);
    win.removeEventListener("keydown", escHandler);
    if (lastFocused) lastFocused.focus();
    activeModal = null;
    lastFocused = null;
  }
  $$(".project-card__modal-btn").forEach((btn) => {
    btn.addEventListener("click", () => openModal(btn.getAttribute("data-modal")));
  });
  $$(".modal__close").forEach((btn) => {
    btn.addEventListener("click", closeModal);
  });

  /* ---------- testimonial slider ---------- */
  const testimonials = $$(".testimonial");
  let currentTestimonial = 0;
  let testimonialTimer = null;
  function showTestimonial(index) {
    testimonials.forEach((t, i) => {
      t.classList.toggle("testimonial--visible", i === index);
    });
  }
  function nextTestimonial() {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    showTestimonial(currentTestimonial);
  }
  if (testimonials.length) {
    showTestimonial(0);
    if (!REDUCED_MOTION.matches) {
      testimonialTimer = setInterval(nextTestimonial, 5000);
      $$(".testimonials__slider").forEach((slider) => {
        slider.addEventListener("mouseenter", () => clearInterval(testimonialTimer));
        slider.addEventListener("mouseleave", () => {
          testimonialTimer = setInterval(nextTestimonial, 5000);
        });
      });
    }
  }

  /* ---------- contact form ---------- */
  const form = $("#contact-form");
  const formStatus = $("#form-status");
  function setFormStatus(message, type) {
    if (!formStatus) return;
    formStatus.textContent = message;
    formStatus.className = "form-status form-status--" + type;
    formStatus.setAttribute("role", type === "success" ? "status" : "alert");
    formStatus.setAttribute("aria-live", "polite");
  }
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const hp = form.elements["hp"];
      if (hp && hp.value.trim() !== "") {
        setFormStatus("Thank you!", "success");
        form.reset();
        return;
      }
      const btn = form.querySelector('button[type="submit"]');
      const originalLabel = btn.textContent;
      setFormStatus("Sending…", "");
      btn.disabled = true;
      btn.textContent = "Sending…";
      try {
        const res = await fetch(CONFIG.formEndpoint, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
        });
        if (res.ok) {
          setFormStatus("Message sent. I will get back to you shortly.", "success");
          form.reset();
        } else {
          throw new Error("Submission failed");
        }
      } catch (err) {
        setFormStatus("Something went wrong. Please email ulojob@gmail.com directly.", "error");
      } finally {
        btn.disabled = false;
        btn.textContent = originalLabel;
      }
    });
  }

  /* ---------- copy-to-clipboard ---------- */
  const copyBtn = $("#copy-email");
  if (copyBtn) {
    copyBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      try {
        await win.navigator.clipboard.writeText("ulojob@gmail.com");
        const original = copyBtn.textContent;
        copyBtn.textContent = CONFIG.copySuccessText;
        setTimeout(() => { copyBtn.textContent = original; }, 1600);
      } catch (err) {
        win.location.href = "mailto:ulojob@gmail.com";
      }
    });
  }

  /* ---------- back-to-top ---------- */
  const backToTop = $("#back-to-top");
  if (backToTop) {
    function toggleBackToTop() {
      backToTop.style.opacity = win.pageYOffset > 400 ? "1" : "0";
      backToTop.style.pointerEvents = win.pageYOffset > 400 ? "auto" : "none";
    }
    win.addEventListener("scroll", throttle(toggleBackToTop, 100), { passive: true });
    toggleBackToTop();
    backToTop.addEventListener("click", () => {
      win.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- scroll spy for active nav ---------- */
  const sections = $$("section[id]");
  const navLinks = $$(".nav__link");
  function onScrollSpy() {
    let current = null;
    const fromTop = win.pageYOffset + 120;
    sections.forEach((section) => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      if (fromTop >= top && fromTop <= bottom) current = section.getAttribute("id");
    });
    navLinks.forEach((a) => {
      const isCurrent = a.getAttribute("href") === "#" + current;
      a.setAttribute("aria-current", isCurrent ? "page" : null);
    });
  }
  win.addEventListener("scroll", throttle(onScrollSpy, 100), { passive: true });
  onScrollSpy();

})();