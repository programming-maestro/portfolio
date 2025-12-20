// assets/js/ga.ts
(function initGA4() {
  const GA_ID = "G-RGT6693GGR";

  if (window.gtag) return;

  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    dataLayer.push(arguments);
  };

  gtag("js", new Date());
  gtag("config", GA_ID, { send_page_view: true });
})();

// -----------------------------
// Send first-touch user properties (ONCE)
// -----------------------------
(function sendUserProperties() {
  const SENT_KEY = "cm_user_props_sent";

  if (!window.gtag) return;
  if (localStorage.getItem(SENT_KEY)) return;

  try {
    const attribution = JSON.parse(
      localStorage.getItem("cm_first_touch") || "{}",
    );
    const device = JSON.parse(
      localStorage.getItem("cm_device_context") || "{}",
    );

    if (!attribution || !device) return;

    gtag("set", "user_properties", {
      source: attribution.source,
      medium: attribution.medium,
      campaign: attribution.campaign,
      landing_page: attribution.landing_page,
      device_type: device.device_type,
      os: device.os,
    });

    localStorage.setItem(SENT_KEY, "true");

    console.info("📤 First-touch user properties sent to GA4");
  } catch (e) {
    console.warn("Failed to send GA4 user properties", e);
  }
})();
