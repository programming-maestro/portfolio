// assets/js/template.js

(function () {
  const CURRENT_PATH = window.location.pathname;

  // -----------------------------
  // Theme handling
  // -----------------------------
  const THEME_KEY = "cm_theme";

  function getInitialTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "light" || stored === "dark") return stored;

    // Fall back to system preference
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "dark";
    }
    return "light";
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);

    const toggleLabel = document.querySelector("[data-role='theme-label']");
    const toggleIcon = document.querySelector("[data-role='theme-icon']");
    if (toggleLabel)
      toggleLabel.textContent = theme === "dark" ? "Dark" : "Light";
    if (toggleIcon) toggleIcon.textContent = theme === "dark" ? "🌙" : "☀️";
  }

  // -----------------------------
  // Header / nav template
  // -----------------------------
  function buildHeader() {
    // Define your nav items here; adjust paths as per your repo
    const NAV_ITEMS = [
      { href: "/index.html", label: "Home", pill: "Overview" },
      { href: "/projects/index.html", label: "Projects", pill: "Case studies" },
      { href: "/companies/index.html", label: "Experience", pill: "Roles" },
      { href: "/contact.html", label: "Contact", pill: "Say hi" },
    ];

    // Normalise the current path once
    const currentCleanPath = window.location.pathname.replace(/\/$/, "");

    const navLinks = NAV_ITEMS.map((item) => {
      const cleanItemHref = item.href.replace(/\/$/, "");

      // base active check: exact match
      let isActive = currentCleanPath === cleanItemHref;

      // ⭐ Optional enhancement:
      // Treat "/" (root) as /index.html so Home is active there too
      if (
        (currentCleanPath === "" || currentCleanPath === "/") &&
        item.href === "/index.html"
      ) {
        isActive = true;
      }

      return `
      <a href="${item.href}" class="${isActive ? "is-active" : ""}">
        <span class="label">${item.label}</span>
        <span class="pill">${item.pill}</span>
      </a>
    `;
    }).join("");

    return `
    <header class="site-header">
      <div class="site-header-inner">
        <a href="/index.html" class="brand">
          <span class="brand-avatar">CM</span>
          <span class="brand-text">
            <span class="brand-name">Chetan Maikhuri</span>
            <span class="brand-tagline">
              Quality Engineering · SDET · Leader
            </span>
          </span>
        </a>

        <nav class="site-nav">
          <!-- Keep this wrapper for layout, but no links here to avoid duplicates -->
          <div class="site-nav-links"></div>

          <button
            class="theme-toggle"
            type="button"
            data-role="theme-toggle"
          >
            <span class="theme-toggle-icon" data-role="theme-icon">☀️</span>
            <span data-role="theme-label">Light</span>
          </button>

          <button
            class="nav-toggle"
            type="button"
            aria-label="Toggle navigation"
            data-role="nav-toggle"
          >
            <span></span>
          </button>
        </nav>
      </div>

      <div class="nav-menu" data-role="nav-menu">
        <div class="nav-menu-inner">
          ${navLinks}
        </div>
      </div>
    </header>
  `;
  }

  function buildFooter() {
    const year = new Date().getFullYear();
    return `
      <footer class="site-footer">
        <div class="site-footer-inner">
          <div>© ${year} Chetan Maikhuri. All rights reserved.</div>
          <div class="footer-links">
            <a href="https://www.linkedin.com" target="_blank" rel="noopener">LinkedIn</a>
            <a href="https://github.com/programming-maestro" target="_blank" rel="noopener">GitHub</a>
            <a href="/contact.html">Contact</a>
          </div>
        </div>
      </footer>
    `;
  }

  function injectChrome() {
    const headerHost = document.getElementById("site-header");
    const footerHost = document.getElementById("site-footer");

    if (headerHost) headerHost.innerHTML = buildHeader();
    if (footerHost) footerHost.innerHTML = buildFooter();

    // After injecting, wire up interactivity
    setupThemeToggle();
    setupNavToggle();
    setupHeaderScroll();
  }

  // -----------------------------
  // Interactions
  // -----------------------------
  function setupThemeToggle() {
    const initial = getInitialTheme();
    applyTheme(initial);

    const toggle = document.querySelector("[data-role='theme-toggle']");
    if (!toggle) return;

    toggle.addEventListener("click", () => {
      const current =
        document.documentElement.getAttribute("data-theme") || initial;
      const next = current === "dark" ? "light" : "dark";
      applyTheme(next);
    });
  }

  function setupNavToggle() {
    const btn = document.querySelector("[data-role='nav-toggle']");
    const menu = document.querySelector("[data-role='nav-menu']");
    if (!btn || !menu) return;

    btn.addEventListener("click", () => {
      const isOpen = btn.classList.toggle("is-open");
      menu.classList.toggle("is-open", isOpen);
    });

    // Close menu when navigating
    menu.addEventListener("click", (evt) => {
      if (evt.target.closest("a")) {
        btn.classList.remove("is-open");
        menu.classList.remove("is-open");
      }
    });
  }

  function setupHeaderScroll() {
    const header = document.querySelector(".site-header");
    if (!header) return;

    const SCROLLED_CLASS = "site-header--scrolled";

    function handleScroll() {
      const offset = window.scrollY || window.pageYOffset || 0;

      if (offset > 16) {
        header.classList.add(SCROLLED_CLASS);
      } else {
        header.classList.remove(SCROLLED_CLASS);
      }
    }

    // Run once on load in case user refreshes mid-page
    handleScroll();

    // Listen to scroll – passive for better performance
    window.addEventListener("scroll", handleScroll, { passive: true });
  }

  // -----------------------------
  // Init
  // -----------------------------
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectChrome);
  } else {
    injectChrome();
  }
})();
