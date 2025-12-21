// ============================================================
// ga.js
// GA4 Event Consumer
// ============================================================
(function mixpanelEventBridge() {
  if (!window.mixpanel) return;

  window.addEventListener("cm:analytics", function (e) {
    const { event, payload } = e.detail || {};
    if (!event || !payload) return;

    mixpanel.track(event, payload);
  });
})();
