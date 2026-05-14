// dark-mode.js — Manages light/dark theme toggle

(function () {
  const STORAGE_KEY = "hakuanime-theme";

  function applyTheme(theme) {
    if (theme === "light") {
      document.body.classList.add("light-mode");
    } else {
      document.body.classList.remove("light-mode");
    }
    // Update toggle icons
    document.querySelectorAll(".dark-mode-icon").forEach((el) => {
      el.textContent = theme === "light" ? "🌙" : "☀️";
    });
    localStorage.setItem(STORAGE_KEY, theme);
  }

  function getTheme() {
    return localStorage.getItem(STORAGE_KEY) || "dark";
  }

  function toggleTheme() {
    const current = getTheme();
    applyTheme(current === "dark" ? "light" : "dark");
  }

  // Apply on load
  document.addEventListener("DOMContentLoaded", () => {
    applyTheme(getTheme());
    document.querySelectorAll(".theme-toggle").forEach((btn) => {
      btn.addEventListener("click", toggleTheme);
    });
  });

  window.toggleTheme = toggleTheme;
})();
