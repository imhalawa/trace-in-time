// Initializes Vega-Lite chart diagrams after deferred scripts have run.
// PlantUML diagrams are pre-rendered to inline SVG at build time — no JS needed for them.
if (typeof vegaEmbed !== "undefined") {
  document.querySelectorAll(".vegalite-diagram").forEach(function (el) {
    var specEl = el.querySelector('script[type="application/json"]');
    if (!specEl) return;
    try {
      vegaEmbed(el, JSON.parse(specEl.textContent), {
        actions: false,
        renderer: "svg",
      }).catch(console.error);
    } catch (e) {
      console.error("Vega-Lite parse error:", e);
    }
  });
}
