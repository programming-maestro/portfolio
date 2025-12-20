// assets/js/analytics.js
(function () {
  // -----------------------------
  // First-touch attribution
  // -----------------------------
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
    console.warn("First-touch attribution storage failed", e);
  }

  // -----------------------------
  // First-touch device context
  // -----------------------------
  const DEVICE_KEY = "cm_device_context";

  try {
    if (localStorage.getItem(DEVICE_KEY)) return;

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
  } catch (e) {
    console.warn("Device context storage failed", e);
  }
})();
