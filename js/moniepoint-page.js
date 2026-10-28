// Scroll reveals for moniepoint-verification.html: decision blocks fade up,
// and the comprehension bars grow when they first scroll into view.
// Content is visible by default; css/moniepoint.css only hides it once
// before-after.js has added the .mv-js class, so a failed script never
// leaves a blank page. Reduced motion skips all of it in CSS.
(function () {
  const targets = Array.from(document.querySelectorAll(".mv-reveal, [data-mv-bars]"));
  if (!targets.length) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) {
    targets.forEach((t) => t.classList.add("is-in"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("is-in");
        io.unobserve(e.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
  );
  targets.forEach((t) => io.observe(t));
})();
