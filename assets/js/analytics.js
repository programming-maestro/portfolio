// ============================================================
// Analytics Intelligence Layer
// File: assets/js/analytics.js
// ============================================================
//
// Responsibilities:
// • First-touch attribution (UTM)
// • First-touch device context
// • Navigation / card / CTA click tracking
// • Emit vendor-agnostic analytics events
// ============================================================

(function analyticsEngine() {
  // ============================================================
  // FIRST-TOUCH ATTRIBUTION (UTM)
  // ============================================================
  const FIRST_TOUCH_KEY = "cm_first_touch";

  try {
    if (!localStorage.getItem(FIRST_TOUCH_KEY)) {
      const params = new URLSearchParams(window.location.search);

      const attribution = {
        source: params.get("utm_source") || "direct",
        medium: params.get("utm_medium") || "none",
        campaign: params.get("utm_campaign") || "none",
        landing_page: window.location.pathname,
        first_seen_at: new Date().toISOString(),
      };

      localStorage.setItem(FIRST_TOUCH_KEY, JSON.stringify(attribution));
    }
  } catch (e) {
    console.warn("Analytics: First-touch attribution failed", e);
  }

  // ============================================================
  // FIRST-TOUCH DEVICE CONTEXT
  // ============================================================
  const DEVICE_KEY = "cm_device_context";

  try {
    if (!localStorage.getItem(DEVICE_KEY)) {
      // Device type
      let device_type = "desktop";
      if (window.matchMedia("(max-width: 767px)").matches) {
        device_type = "mobile";
      } else if (
        window.matchMedia("(min-width: 768px) and (max-width: 1024px)").matches
      ) {
        device_type = "tablet";
      }

      // OS detection
      function detectOS() {
        if (navigator.userAgentData?.platform) {
          return navigator.userAgentData.platform.toLowerCase();
        }

        const ua = navigator.userAgent.toLowerCase();
        if (ua.includes("android")) return "android";
        if (/iphone|ipad|ipod/.test(ua)) return "ios";
        if (ua.includes("win")) return "windows";
        if (ua.includes("mac")) return "macos";
        if (ua.includes("linux")) return "linux";
        return "unknown";
      }

      const payload = {
        device_type,
        os: detectOS(),
        captured_at: new Date().toISOString(),
      };

      localStorage.setItem(DEVICE_KEY, JSON.stringify(payload));
    }
  } catch (e) {
    console.warn("Analytics: Device context capture failed", e);
  }

  // ============================================================
  // NAVIGATION & INTERACTION TRACKING
  // ============================================================

  // Single source of truth
  const INTERACTION_DEPTH_MAP = {
    nav: "primary",
    cta: "primary",
    card: "primary",
    breadcrumb: "secondary",
  };

  function emit(event, payload) {
    window.dispatchEvent(
      new CustomEvent("cm:analytics", {
        detail: { event, payload },
      }),
    );
  }

  document.addEventListener("click", function (e) {
    const el = e.target.closest("[data-analytics]");
    if (!el) return;

    const href = el.getAttribute("href");
    if (href && href.startsWith("#")) return;

    // Only internal navigation (if href exists)
    if (href) {
      const isInternal =
        href.startsWith("/") || href.startsWith(window.location.origin);

      if (!isInternal) return;
    }

    const navigationType = el.getAttribute("data-analytics");
    const navigationLabel =
      el.getAttribute("data-label") || el.textContent?.trim() || "unknown";

    emit("navigation_click", {
      navigation_type: navigationType, // nav | card | cta | breadcrumb
      navigation_label: navigationLabel,
      interaction_depth: INTERACTION_DEPTH_MAP[navigationType] || "unknown",
      destination: href ? new URL(href, window.location.origin).pathname : null,
      page_path: window.location.pathname,
    });
  });
})();
