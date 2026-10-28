// Site-wide UI motion (css/motion.css). Loaded on every page by js/header.js.
//
// What it does:
//   1. Tags content so it springs in: .m-enter for what is already on screen at
//      load, .m-reveal for what is below the fold (revealed on scroll).
//   2. Staggers items that sit together in a grid.
//   3. Splits the case-study hero title into words that bounce in.
//   4. Removes its own classes once an element has landed, so each component's
//      hover and press transforms are never overridden.
//
// Nothing is hidden unless this script runs, and the whole layer is skipped for
// visitors who prefer reduced motion. If anything throws, content is shown.
(function () {
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;

  // Grids whose items should arrive one after another, not as one block.
  var GRID_ITEMS = [
    ".case-problem-grid > .case-problem",
    ".case-outcome-grid > .case-outcome",
    ".case-other-grid > .case-other-card",
    ".case-fact-grid > .case-fact",
    ".case-steps > li",
    ".case-phones > .case-phone",
    ".case-figures > .case-figure",
    ".case-leadership-grid > *",
    ".shelf-links > .shelf-link",
    ".exp-card", ".ab-stat", ".edu-item", ".testimonial-card", ".tools-group"
  ];

  // Other blocks that reveal as a single piece. The hero's supporting lines
  // enter one after another; the title is handled separately (splitTitle).
  var SINGLES = [
    ".case-hero > .wrap > *:not(.case-title)",
    ".case-section > .wrap > *",
    ".story-row", ".ledger-row", ".sec-label", ".footer-top"
  ];

  // Never touch: things with their own motion, and live widgets.
  var SKIP = ".mv-reveal, .mv-decision, .ba, .mv-study, .mv-bars, .mv-details, [data-project-motion], " +
             ".case-quicknav, .case-hero-cover, .case-hero-media, .site-header, .ticker, .hero-static";

  // Anything even partly on screen at load enters straight away. (Using a stricter
  // cut-off left a one-screen page's bottom row hidden: it never scrolls, so a
  // scroll reveal would never fire for it.)
  function inViewAtLoad(el) {
    var r = el.getBoundingClientRect();
    return r.top < window.innerHeight && r.bottom > 0;
  }

  // Sideways off-screen (carousels, marquees): a vertical reveal cannot be seen
  // there, so leave those elements visible and untouched.
  function offScreenSideways(el) {
    var r = el.getBoundingClientRect();
    return r.left >= window.innerWidth || r.right <= 0;
  }

  function splitTitle() {
    var h = document.querySelector(".case-title");
    if (!h || h.children.length) return; // only plain-text titles
    var text = h.textContent.trim();
    if (!text) return;
    h.setAttribute("aria-label", text);
    h.textContent = "";
    text.split(/\s+/).forEach(function (word, i, all) {
      var s = document.createElement("span");
      s.className = "m-word";
      s.setAttribute("aria-hidden", "true");
      s.style.setProperty("--w", String(i));
      s.textContent = word;
      h.appendChild(s);
      if (i < all.length - 1) h.appendChild(document.createTextNode(" "));
    });
  }

  function collect() {
    var seen = new Set();
    var groups = []; // [{ el, group, index }]

    function add(el, group, index) {
      if (seen.has(el)) return;
      if (el.closest(SKIP) || el.matches(SKIP)) return;
      // skip anything nested inside something already being revealed
      for (var p = el.parentElement; p; p = p.parentElement) if (seen.has(p)) return;
      // ...and never reveal a wrapper whose children are already tagged
      for (var i = 0; i < groups.length; i++) if (el.contains(groups[i].el)) return;
      seen.add(el);
      groups.push({ el: el, group: group, index: index });
    }

    GRID_ITEMS.forEach(function (sel) {
      var byParent = new Map();
      document.querySelectorAll(sel).forEach(function (el) {
        var list = byParent.get(el.parentElement) || [];
        list.push(el);
        byParent.set(el.parentElement, list);
      });
      byParent.forEach(function (list) { list.forEach(function (el, i) { add(el, list, i); }); });
    });

    // direct children of a grid are claimed above, so containers must not be revealed
    var claimed = new Set(groups.map(function (g) { return g.el.parentElement; }));
    SINGLES.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        if (claimed.has(el)) return;
        add(el, null, 0);
      });
    });
    return groups;
  }

  function settle(el, cls) {
    // once landed, drop the helper classes so hover transforms work again
    window.setTimeout(function () { el.classList.remove("m-reveal", "m-in", "m-enter"); el.style.removeProperty("--m-d"); }, cls);
  }

  function init() {
    try {
      splitTitle();
      document.documentElement.classList.add("m-js");

      var items = collect();
      var enterCount = 0;
      var io = "IntersectionObserver" in window ? new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          var el = en.target;
          io.unobserve(el);
          el.classList.add("m-in");
          settle(el, 1700);
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -7% 0px" }) : null;

      // a page that does not scroll can never fire a scroll reveal
      var fits = document.documentElement.scrollHeight <= window.innerHeight + 4;

      items.forEach(function (it) {
        var el = it.el;
        if (offScreenSideways(el)) return;
        // stagger by position in its grid (capped so late items are not slow)
        var d = Math.min(it.index, 6) * 85;
        if (fits || inViewAtLoad(el)) {
          el.style.setProperty("--m-d", String(240 + enterCount * 90 + d));
          enterCount = Math.min(enterCount + 1, 6);
          el.classList.add("m-enter");
          settle(el, 2400 + d + enterCount * 90);
        } else if (io) {
          el.style.setProperty("--m-d", String(d));
          el.classList.add("m-reveal");
          io.observe(el);
        }
      });
    } catch (e) {
      // never leave content hidden because of a script error
      document.querySelectorAll(".m-reveal").forEach(function (el) { el.classList.remove("m-reveal"); });
      if (window.console) console.warn("motion.js:", e);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
