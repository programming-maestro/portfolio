// template.js - injects header and footer into pages, adds theme and language toggles
(function () {
  const script = Array.from(document.getElementsByTagName("script"))
    .reverse()
    .find((s) => s.src && s.src.includes("template.js"));
  let base = "";
  // relative base heuristic: if path contains /companies/ or /projects/ go up one level
  if (
    window.location.pathname.includes("/companies/") ||
    window.location.pathname.includes("/projects/")
  )
    base = "../";
  else base = "";

  // language state
  const lang = localStorage.getItem("site_lang") || "en";
  const theme =
    localStorage.getItem("site_theme") ||
    (window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark");

  document.documentElement.setAttribute("data-theme", theme);

  function t(key) {
    const strings = {
      en: {
        home: "Home",
        companies: "Companies",
        projects: "Projects",
        download: "Download Resume",
        contact: "Contact",
        theme: "Theme",
        lang: "EN",
      },
      hi: {
        home: "होम",
        companies: "कंपनियाँ",
        projects: "परियोजनाएँ",
        download: "रिज़्यूमे डाउनलोड",
        contact: "संपर्क",
        theme: "थीम",
        lang: "HI",
      },
    };
    return (strings[lang] && strings[lang][key]) || strings["en"][key];
  }

  const header = `
  <header class="site-header container card">
    <div class="brand">
      <div class="avatar"><img src="${base}assets/images/avatar.svg" alt="avatar" style="width:56px;height:56px;display:block" /></div>
      <div>
        <div style="font-weight:700;font-size:18px">Chetan Maikhuri</div>
        <div style="color:var(--muted);font-size:13px">Quality Assurance Leader • SDET Architect</div>
      </div>
    </div>
    <nav class="nav" aria-label="Main navigation">
      <a href="${base}index.html" data-nav>${t("home")}</a>
      <a href="${base}companies/index.html" data-nav>${t("companies")}</a>
      <a href="${base}projects/index.html" data-nav>${t("projects")}</a>
      <a href="${base}assets/pdfs/resume.pdf" data-nav download>${t("download")}</a>
      <a href="${base}#contact" data-nav>${t("contact")}</a>
    </nav>
    <div style="display:flex;align-items:center">
      <button class="lang-toggle" aria-label="Toggle language">${t("lang")}</button>
      <button class="theme-toggle" aria-label="Toggle theme">🌓</button>
      <button class="hamburger" aria-label="Toggle menu">☰</button>
    </div>
  </header>
  `;

  const footer = `
  <footer class="footer container">
    <div>© <strong>Chetan Maikhuri</strong> — Software Quality Engineering</div>
  </footer>
  `;

  function inject() {
    const ph = document.getElementById("site-header-placeholder");
    if (ph) ph.outerHTML = header;
    const pf = document.getElementById("site-footer-placeholder");
    if (pf) pf.outerHTML = footer;

    // highlight active nav
    setTimeout(() => {
      document.querySelectorAll("[data-nav]").forEach((a) => {
        try {
          const href = a.getAttribute("href");
          const current =
            window.location.pathname.split("/").pop() || "index.html";
          if (href && href.includes(current)) a.classList.add("active");
          if (
            window.location.pathname.includes("/companies/") &&
            href &&
            href.includes("companies")
          )
            a.classList.add("active");
          if (
            window.location.pathname.includes("/projects/") &&
            href &&
            href.includes("projects")
          )
            a.classList.add("active");
        } catch (e) {}
      });
    }, 50);

    // mobile menu
    const btn = document.querySelector(".hamburger");
    if (btn) {
      btn.addEventListener("click", () => {
        const nav = document.querySelector(".nav");
        if (nav.style.display === "flex") nav.style.display = "none";
        else nav.style.display = "flex";
      });
    }

    // theme toggle
    const themeBtn = document.querySelector(".theme-toggle");
    if (themeBtn) {
      themeBtn.addEventListener("click", () => {
        const current =
          document.documentElement.getAttribute("data-theme") || "dark";
        const next = current === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", next);
        localStorage.setItem("site_theme", next);
      });
    }

    // language toggle
    const langBtn = document.querySelector(".lang-toggle");
    if (langBtn) {
      langBtn.addEventListener("click", () => {
        const next = localStorage.getItem("site_lang") === "hi" ? "en" : "hi";
        localStorage.setItem("site_lang", next);
        // reload to apply translations (header labels)
        location.reload();
      });
    }
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", inject);
  else inject();
})();
