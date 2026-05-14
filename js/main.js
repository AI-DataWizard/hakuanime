// main.js — Core functionality, mobile nav, hero carousel

document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  markActiveNavLink();
});

// ---- Mobile Navigation ----
function initMobileNav() {
  const hamburger = document.querySelector(".hamburger");
  const mobileNav = document.querySelector(".mobile-nav");
  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener("click", () => {
    mobileNav.classList.toggle("open");
    const spans = hamburger.querySelectorAll("span");
    if (mobileNav.classList.contains("open")) {
      spans[0].style.transform = "rotate(45deg) translate(5px, 5px)";
      spans[1].style.opacity = "0";
      spans[2].style.transform = "rotate(-45deg) translate(5px, -5px)";
    } else {
      spans.forEach((s) => {
        s.style.transform = "";
        s.style.opacity = "";
      });
    }
  });

  // Close on outside click
  document.addEventListener("click", (e) => {
    if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
      mobileNav.classList.remove("open");
      hamburger.querySelectorAll("span").forEach((s) => {
        s.style.transform = "";
        s.style.opacity = "";
      });
    }
  });
}

// ---- Active Nav Link ----
function markActiveNavLink() {
  const path = window.location.pathname;
  document
    .querySelectorAll(".nav-link, .mobile-nav .nav-link")
    .forEach((link) => {
      const href = link.getAttribute("href") || "";
      if (
        ((path.endsWith("index.html") || path === "/" || path.endsWith("/")) &&
          href.includes("index")) ||
        (path.includes("watchlist") && href.includes("watchlist")) ||
        (path.includes("about") && href.includes("about")) ||
        (path.includes("contact") && href.includes("contact")) ||
        (path.includes("anime-detail") && href.includes("anime-detail"))
      ) {
        link.classList.add("active");
      }
    });
}

// ---- Hero Carousel ----
window.initHeroCarousel = function (slides) {
  if (!slides || slides.length === 0) return;

  let current = 0;
  let timer;

  function goTo(index) {
    slides[current].classList.remove("active");
    document.querySelectorAll(".hero-dot")[current]?.classList.remove("active");
    current = (index + slides.length) % slides.length;
    slides[current].classList.add("active");
    document.querySelectorAll(".hero-dot")[current]?.classList.add("active");
  }

  function next() {
    goTo(current + 1);
  }
  function start() {
    timer = setInterval(next, 5000);
  }
  function stop() {
    clearInterval(timer);
  }

  // Dots click
  document.querySelectorAll(".hero-dot").forEach((dot, i) => {
    dot.addEventListener("click", () => {
      stop();
      goTo(i);
      start();
    });
  });

  goTo(0);
  start();

  // Pause on hover
  document.getElementById("hero")?.addEventListener("mouseenter", stop);
  document.getElementById("hero")?.addEventListener("mouseleave", start);
};
