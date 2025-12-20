(function () {
  const CURRENT_PATH = window.location.pathname;

  // -----------------------------
  // Analytics bootstrap (FIRST)
  // analytics.js → ga.js
  // -----------------------------
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src;
      s.defer = true;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  loadScript("/assets/js/analytics.js")
    .then(() => loadScript("/assets/js/ga.js"))
    .catch((err) => {
      console.error("Analytics bootstrap failed", err);
    });

  // -----------------------------
  // Template logic starts here
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
      {
        href: "/projects/index.html",
        label: "Projects",
        pill: "QA Automation",
      },
      { href: "/companies/index.html", label: "Experience", pill: "Roles" },
      {
        href: "/edu/index.html",
        label: "Education",
        pill: "Credentials",
      },
      { href: "/contact.html", label: "Contact", pill: "Say hi" },
    ];

    // Normalise the current path once
    const currentCleanPath = window.location.pathname.replace(/\/$/, "");

    const navLinks = NAV_ITEMS.map((item) => {
      const cleanItemHref = item.href.replace(/\/$/, "");
      // Highlight menu
      let isActive =
        // 1. Exact match (e.g. /contact.html)
        currentCleanPath === cleanItemHref ||
        // 2. Home page only (/ or /index.html)
        (cleanItemHref === "/index.html" &&
          (currentCleanPath === "" ||
            currentCleanPath === "/" ||
            currentCleanPath === "/index.html")) ||
        // 3. Section-based pages (projects, companies, edu, etc.)
        (cleanItemHref !== "/index.html" &&
          cleanItemHref.endsWith("/index.html") &&
          currentCleanPath.startsWith(
            cleanItemHref.replace("/index.html", ""),
          ));

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
              Software Quality Engineering Leader
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

  // function buildFooter() {
  //   const year = new Date().getFullYear();
  //   return `
  //     <footer class="site-footer">
  //       <div class="site-footer-inner">
  //         <div>© ${year} Chetan Maikhuri. All rights reserved.</div>
  //         <div class="footer-links">
  //           <a href="https://www.linkedin.com/in/cm6" target="_blank" rel="noopener">LinkedIn</a>
  //           <a href="https://github.com/programming-maestro" target="_blank" rel="noopener">GitHub</a>
  //           <a href="/contact.html">Contact</a>
  //         </div>
  //       </div>
  //     </footer>
  //   `;
  // }

  function buildFooter() {
    const year = new Date().getFullYear();
    return `
    <footer class="site-footer">
      <div class="site-footer-inner">
        <div>© ${year} Chetan Maikhuri. All rights reserved.</div>

        <div class="footer-links">
          <a href="https://www.linkedin.com/in/cm6" target="_blank" rel="noopener">LinkedIn</a>
          <a href="https://github.com/programming-maestro" target="_blank" rel="noopener">GitHub</a>
          <a href="/contact.html">Contact</a>
        </div>

       
        
        

       <!-- Site analytics (hidden until JS populates) -->
      <div
        id="site-analytics"
        class="site-metrics"
        style="display:none; margin-top:8px; font-size:13px; opacity:0.85"
      >
        <span>
          <strong id="site-unique-count"></strong> unique visitors
        </span>
        &nbsp;·&nbsp;
        <span>
          <strong id="site-visit-count"></strong> total page visits
        </span>

        <!-- Privacy note (hidden until analytics visible) -->
        <div
          id="analytics-privacy-note"
          style="margin-top:4px; font-size:12px; opacity:0.7; display:none"
        >
          This site uses anonymous, cookie-free analytics
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

// unique visitor count
(async function () {
  function generateFingerprint() {
    return btoa(
      [
        navigator.userAgent,
        screen.width + "x" + screen.height,
        Intl.DateTimeFormat().resolvedOptions().timeZone,
        navigator.language,
        navigator.platform,
      ].join("::"),
    );
  }

  try {
    fetch(
      "https://script.google.com/macros/s/AKfycbyJ0pSglHi9wVOAAWvVBq1vvxTf56z1X-afZBPxPrp4ZmlJoOpaYKE5r7gySFxhKJit/exec",
      {
        method: "POST",
        mode: "no-cors", // ⭐ KEY FIX
        headers: {
          "Content-Type": "text/plain", // ⭐ KEY FIX
        },
        body: JSON.stringify({
          fingerprint: generateFingerprint(),
          page: window.location.pathname, // ⭐ ADD THIS
          userAgent: navigator.userAgent,
          screen: screen.width + "x" + screen.height,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          language: navigator.language,
        }),
      },
    );
  } catch (e) {
    // intentionally silent
  }
})();

// Site analytics

(async function fetchSiteAnalytics() {
  const API_URL =
    "https://script.google.com/macros/s/AKfycbyJ0pSglHi9wVOAAWvVBq1vvxTf56z1X-afZBPxPrp4ZmlJoOpaYKE5r7gySFxhKJit/exec";

  const container = document.getElementById("site-analytics");
  const uniqueEl = document.getElementById("site-unique-count");
  const visitEl = document.getElementById("site-visit-count");

  if (!container || !uniqueEl || !visitEl) return;

  /* ============================
     1. Render last-known values
     ============================ */
  const cached = localStorage.getItem("site_analytics_cache");

  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (parsed.total_unique_users && parsed.total_visits) {
        uniqueEl.innerText = parsed.total_unique_users;
        visitEl.innerText = parsed.total_visits;
        container.style.display = "block";

        const privacyNote = document.getElementById("analytics-privacy-note");
        if (privacyNote) privacyNote.style.display = "block";
      }
    } catch (_) {}
  }

  /* ============================
     2. Fetch fresh values async
     ============================ */
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    const totalUnique = data?.summary?.total_unique_users;
    const totalVisits = data?.summary?.total_visits;

    if (totalUnique && totalVisits) {
      // Update UI
      uniqueEl.innerText = totalUnique;
      visitEl.innerText = totalVisits;
      container.style.display = "block";

      const privacyNote = document.getElementById("analytics-privacy-note");
      if (privacyNote) privacyNote.style.display = "block";

      // Cache for next load
      localStorage.setItem(
        "site_analytics_cache",
        JSON.stringify({
          total_unique_users: totalUnique,
          total_visits: totalVisits,
          ts: Date.now(),
        }),
      );
    }
  } catch (err) {
    // Silent failure — cached values (if any) stay visible
  }
})();

// -----------------------------
// Global SEO schema injection
// -----------------------------
(function injectSchemaOnce() {
  if (document.getElementById("schema-loader")) return;

  // schemaScript.id = "global-schema";
  // schemaScript.type = "application/ld+json";

  const schemaScript = document.createElement("script");
  schemaScript.id = "schema-loader";
  schemaScript.src = "/assets/js/schema.js";
  schemaScript.defer = true;

  document.head.appendChild(schemaScript);
})();

console.log("before schema loader");
// -----------------------------
// Global favicon injection
// -----------------------------
(function injectFaviconsOnce() {
  if (document.getElementById("favicon-loader")) return;

  const fragment = document.createDocumentFragment();

  const links = [
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      href: "/apple-touch-icon.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      href: "/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      href: "/favicon-16x16.png",
    },
    {
      rel: "icon",
      href: "/favicon.ico",
    },
    {
      rel: "manifest",
      href: "/site.webmanifest",
    },
  ];

  links.forEach((attrs) => {
    const link = document.createElement("link");
    Object.entries(attrs).forEach(([k, v]) => link.setAttribute(k, v));
    fragment.appendChild(link);
  });

  // Marker to avoid duplicate injection
  const marker = document.createElement("meta");
  marker.id = "favicon-loader";
  fragment.appendChild(marker);

  document.head.appendChild(fragment);
})();
