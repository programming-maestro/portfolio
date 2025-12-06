(function () {
  function resolveBasePath() {
    var path = window.location.pathname || "";
    if (
      path.indexOf("/companies/") !== -1 ||
      path.indexOf("/projects/") !== -1
    ) {
      return "../";
    }
    return "";
  }

  function buildHeader(base) {
    return (
      '<header class="site-header">' +
      '<div class="brand">' +
      '<a href="' +
      base +
      'index.html" class="avatar" aria-label="Home">CM</a>' +
      "<div>" +
      '<a href="' +
      base +
      'index.html" class="brand-name">Chetan Maikhuri</a>' +
      '<div class="brand-tagline">Quality Engineering Leader</div>' +
      "</div>" +
      "</div>" +
      '<nav class="nav" data-nav>' +
      '<a href="' +
      base +
      'index.html" data-route="home">About</a>' +
      '<a href="' +
      base +
      'companies/index.html" data-route="companies">Companies</a>' +
      '<a href="' +
      base +
      'projects/index.html" data-route="projects">Projects</a>' +
      '<a href="' +
      base +
      'contact.html" data-route="contact">Contact</a>' +
      "</nav>" +
      '<div class="header-controls">' +
      '<button type="button" class="theme-toggle" data-theme-toggle aria-label="Toggle theme">🌓</button>' +
      '<button type="button" class="lang-toggle" data-lang-toggle aria-label="Toggle language">EN</button>' +
      '<button type="button" class="hamburger" data-menu-toggle aria-label="Toggle navigation">' +
      "<span>☰</span>" +
      "</button>" +
      "</div>" +
      "</header>"
    );
  }

  function buildFooter() {
    var year = new Date().getFullYear();
    return (
      '<footer class="footer">' +
      '<div class="container1">' +
      "<div>© " +
      year +
      " Chetan Maikhuri · Quality Engineering Leader</div>" +
      "</div>" +
      "</footer>"
    );
  }

  function getHeaderContainer() {
    return (
      document.querySelector("[data-site-header]") ||
      document.getElementById("site-header") ||
      document.querySelector("header[data-inject='site-header']") ||
      document.querySelector("header.site-header-placeholder")
    );
  }

  function getFooterContainer() {
    return (
      document.querySelector("[data-site-footer]") ||
      document.getElementById("site-footer") ||
      document.querySelector("footer[data-inject='site-footer']") ||
      document.querySelector("footer.site-footer-placeholder")
    );
  }

  function injectChrome(base) {
    var headerTarget = getHeaderContainer();
    var footerTarget = getFooterContainer();

    if (headerTarget) {
      headerTarget.innerHTML = buildHeader(base);
    } else {
      var existingHeader = document.querySelector("header.site-header");
      if (!existingHeader) {
        var firstChild = document.body.firstElementChild;
        var header = document.createElement("div");
        header.innerHTML = buildHeader(base);
        if (firstChild) {
          document.body.insertBefore(header.firstElementChild, firstChild);
        } else {
          document.body.appendChild(header.firstElementChild);
        }
      }
    }

    if (footerTarget) {
      footerTarget.innerHTML = buildFooter();
    } else {
      var existingFooter = document.querySelector("footer.footer");
      if (!existingFooter) {
        var footerWrapper = document.createElement("div");
        footerWrapper.innerHTML = buildFooter();
        document.body.appendChild(footerWrapper.firstElementChild);
      }
    }
  }

  function normalizePath(path) {
    if (!path) return "/";
    var qIndex = path.indexOf("?");
    if (qIndex !== -1) path = path.slice(0, qIndex);
    var hashIndex = path.indexOf("#");
    if (hashIndex !== -1) path = path.slice(0, hashIndex);
    if (path.length > 1 && path.charAt(path.length - 1) === "/") {
      path = path.slice(0, -1);
    }
    return path || "/";
  }

  function highlightActiveNav(base) {
    var nav = document.querySelector("nav[data-nav]");
    if (!nav) return;

    var path = normalizePath(window.location.pathname || "");
    var rootIndex = base + "index.html";
    var companiesIndex = base + "companies/index.html";
    var projectsIndex = base + "projects/index.html";
    var contactPage = base + "contact.html";

    var links = nav.querySelectorAll("a[href]");
    for (var i = 0; i < links.length; i++) {
      links[i].classList.remove("active");
    }

    var activeRoute = "home";

    if (path.indexOf("/companies") !== -1) {
      activeRoute = "companies";
    } else if (path.indexOf("/projects") !== -1) {
      activeRoute = "projects";
    } else if (path.indexOf("/contact") !== -1) {
      activeRoute = "contact";
    } else if (path === "/" || path.endsWith("/index.html")) {
      activeRoute = "home";
    }

    var activeLink =
      nav.querySelector('a[data-route="' + activeRoute + '"]') ||
      nav.querySelector('a[href="' + rootIndex + '"]') ||
      nav.querySelector('a[href="' + companiesIndex + '"]') ||
      nav.querySelector('a[href="' + projectsIndex + '"]') ||
      nav.querySelector('a[href="' + contactPage + '"]');

    if (activeLink) {
      activeLink.classList.add("active");
    }
  }

  function getPreferredTheme() {
    try {
      var stored = localStorage.getItem("site_theme");
      if (stored === "light" || stored === "dark") return stored;
    } catch (e) {}

    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: light)").matches
    ) {
      return "light";
    }
    return "dark";
  }

  function applyTheme(theme) {
    var effective = theme === "light" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", effective);
    try {
      localStorage.setItem("site_theme", effective);
    } catch (e) {}
  }

  function initThemeToggle() {
    var button = document.querySelector("[data-theme-toggle]");
    if (!button) return;

    var current = getPreferredTheme();
    applyTheme(current);

    button.addEventListener("click", function () {
      var next =
        document.documentElement.getAttribute("data-theme") === "light"
          ? "dark"
          : "light";
      applyTheme(next);
    });
  }

  function initLanguageToggle() {
    var button = document.querySelector("[data-lang-toggle]");
    if (!button) return;

    var currentLang = document.documentElement.lang || "en";
    if (currentLang.toLowerCase() === "hi") {
      button.textContent = "हिन्दी";
    } else {
      button.textContent = "EN";
    }

    button.addEventListener("click", function () {
      var current = document.documentElement.lang || "en";
      var next = current.toLowerCase() === "en" ? "hi" : "en";
      document.documentElement.lang = next;
      button.textContent = next === "en" ? "EN" : "हिन्दी";
    });
  }

  function initMobileNav() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var nav = document.querySelector("nav[data-nav]");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", function () {
      var isOpen = nav.getAttribute("data-open") === "true";
      var next = !isOpen;
      nav.setAttribute("data-open", next ? "true" : "false");
      toggle.setAttribute("aria-expanded", next ? "true" : "false");
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var base = resolveBasePath();
    injectChrome(base);
    highlightActiveNav(base);
    initThemeToggle();
    initLanguageToggle();
    initMobileNav();
  });
})();
