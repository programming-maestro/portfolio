// ============================================================
// GA4 Setup — First-Touch Attribution + Device Context
// File: assets/js/ga.js
// ============================================================
//
// Guarantees:
// • First-touch attribution & device context
// • User properties sent ONCE per browser
// • Properties attached to first page_view
// • No duplicate GA4 initialization
// ============================================================

(function () {
  const GA_ID = "G-RGT6693GGR";
  const SENT_KEY = "cm_ga_user_props_sent";

  // ------------------------------------------------------------
  // Guard: prevent GA from initializing more than once
  // ------------------------------------------------------------
  if (window.gtag) return;

  // ------------------------------------------------------------
  // Step 1: Decide whether to send user properties
  // ------------------------------------------------------------
  let userProperties = null;
  const alreadySent = localStorage.getItem(SENT_KEY) === "true";

  if (!alreadySent) {
    try {
      const attribution = JSON.parse(
        localStorage.getItem("cm_first_touch") || "{}",
      );

      const device = JSON.parse(
        localStorage.getItem("cm_device_context") || "{}",
      );

      const rawProps = {
        source: attribution.source,
        medium: attribution.medium,
        campaign: attribution.campaign,
        landing_page: attribution.landing_page,
        device_type: device.device_type,
        os: device.os,
      };

      // Remove undefined / non-string values
      userProperties = {};

      for (var key in rawProps) {
        if (typeof rawProps[key] === "string") {
          userProperties[key] = rawProps[key];
        }
      }

      if (Object.keys(userProperties).length === 0) {
        userProperties = null;
      }

      // Mark as sent ONLY if something valid exists
      if (Object.keys(userProperties).length > 0) {
        localStorage.setItem(SENT_KEY, "true");
      } else {
        userProperties = null;
      }
    } catch (e) {
      console.warn("GA4: Failed to prepare user properties", e);
    }
  }

  // ------------------------------------------------------------
  // Step 2: Load GA4 library
  // ------------------------------------------------------------
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);

  // ------------------------------------------------------------
  // Step 3: Initialize gtag
  // ------------------------------------------------------------
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    dataLayer.push(arguments);
  };

  gtag("js", new Date());

  // ------------------------------------------------------------
  // Step 4: Set user properties BEFORE config (only once)
  // ------------------------------------------------------------
  if (userProperties) {
    gtag("set", "user_properties", userProperties);
  }

  // ------------------------------------------------------------
  // Step 5: Configure GA4 (fires auto events)
  // ------------------------------------------------------------
  gtag("config", GA_ID, {
    send_page_view: true,
  });
})();
// ============================================================
// ga.js
// GA4 Event Consumer
// ============================================================

(function gaEventBridge() {
  if (!window.gtag) return;

  window.addEventListener("cm:analytics", function (e) {
    const { event, payload } = e.detail || {};
    if (!event || !payload) return;

    gtag("event", event, payload);
  });
})();
