// ============================================================
// GA4 Setup — First-Touch Attribution + Device Context
// File: assets/js/ga.ts
// ============================================================
//
// What this script does:
// 1. Loads GA4 (gtag.js)
// 2. Reads first-touch attribution from localStorage
// 3. Reads device & OS context from localStorage
// 4. Sets GA4 user properties BEFORE the first page_view
// 5. Fires GA4 automatic events (first_visit, session_start, page_view)
//
// Design principles:
// • First-touch data = user properties (not events)
// • Sent once per user
// • Let GA4 handle native device dimensions
// • No custom events fired here
// ============================================================

(function () {
  const GA_ID = "G-RGT6693GGR";

  // ------------------------------------------------------------------
  // Guard: prevent GA from initializing more than once
  // ------------------------------------------------------------------
  if (window.gtag) return;

  // ------------------------------------------------------------------
  // Step 1: Prepare user properties (FIRST-TOUCH)
  // This MUST run before gtag("config") so properties
  // are attached to the initial page_view
  // ------------------------------------------------------------------
  let userProperties: Record<string, string> | null = null;

  try {
    const attribution = JSON.parse(
      localStorage.getItem("cm_first_touch") || "{}"
    );

    const device = JSON.parse(
      localStorage.getItem("cm_device_context") || "{}"
    );

    userProperties = {
      // First-touch attribution
      source: attribution.source || undefined,
      medium: attribution.medium || undefined,
      campaign: attribution.campaign || undefined,
      landing_page: attribution.landing_page || undefined,

      // First-touch device context
      device_type: device.device_type || undefined,
      os: device.os || undefined,
    };
  } catch (e) {
    console.warn("GA4: Failed to read first-touch properties", e);
  }

  // ------------------------------------------------------------------
  // Step 2: Load GA4 library (gtag.js)
  // ------------------------------------------------------------------
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);

  // ------------------------------------------------------------------
  // Step 3: Initialize dataLayer & gtag
  // ------------------------------------------------------------------
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    dataLayer.push(arguments);
  };

  gtag("js", new Date());

  // ------------------------------------------------------------------
  // Step 4: Set user properties BEFORE config
  // This ensures they are attached to:
  // • first_visit
  // • session_start
  // • page_view
  // ------------------------------------------------------------------
  if (userProperties) {
    gtag("set", "user_properties", userProperties);
  }

  // ------------------------------------------------------------------
  // Step 5: Configure GA4
  // This automatically fires:
  // • first_visit (new users)
  // • session_start
  // • page_view
  // ------------------------------------------------------------------
  gtag("config", GA_ID, {
    send_page_view: true,
  });
})();
