// nsimbi-three-purchases.html
// 1. Play each clip only while it is on screen.
// 2. Phone screens taller than the phone scroll inside it, like the real app:
//    rest at the top, glide to the part the section is about, hold, read on to
//    the end, then return. Each loop runs only while its phone is visible.
// Both are progressive: without this script the clip has controls and the tall
// screens simply show their top. Reduced motion never autoplays or loops and
// rests each tall screen on the part that matters.
(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- clips ----------
  const videos = Array.from(document.querySelectorAll("[data-ns-video]"));
  if (videos.length && !reduce && "IntersectionObserver" in window) {
    const vio = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const video = e.target;
          if (e.isIntersecting) {
            const p = video.play();
            if (p && p.catch) p.catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.4 }
    );
    videos.forEach((v) => { v.muted = true; vio.observe(v); });
  }

  // ---------- scrolling phone screens ----------
  const screens = Array.from(document.querySelectorAll("[data-ns-scroll]"));
  if (!screens.length) return;

  const easeInOut = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

  function build(screen) {
    const img = screen.querySelector("img");
    const natural = parseFloat(img.getAttribute("width")) || 390;
    const k = img.clientWidth / natural;
    const max = Math.max(0, img.offsetHeight - screen.clientHeight);
    const focus = Math.min(max, (parseFloat(screen.dataset.focus) || 0) * k);
    return { img, max, focus };
  }

  // a timeline of holds and glides, in milliseconds and pixels
  function timeline(max, focus) {
    const seg = [{ d: 1300, a: 0, b: 0 }];
    if (focus > 4) seg.push({ d: Math.max(1500, focus / 0.14), a: 0, b: focus, ease: true });
    seg.push({ d: 2800, a: focus, b: focus });
    if (max - focus > 4) {
      seg.push({ d: Math.max(1600, (max - focus) / 0.1), a: focus, b: max, ease: true });
      seg.push({ d: 1400, a: max, b: max });
    }
    if (max > 4) seg.push({ d: 1500, a: max, b: 0, ease: true });
    const total = seg.reduce((s, x) => s + x.d, 0);
    return { seg, total };
  }

  function at(tl, t) {
    let m = t % tl.total;
    for (const s of tl.seg) {
      if (m <= s.d) {
        const x = s.d ? m / s.d : 1;
        return s.a + (s.b - s.a) * (s.ease ? easeInOut(x) : x);
      }
      m -= s.d;
    }
    return 0;
  }

  screens.forEach((screen) => {
    let state = build(screen);
    let tl = timeline(state.max, state.focus);
    let raf = 0;
    let t0 = 0;
    let visible = false;
    let inView = false;

    const sync = () => {
      visible = inView && !document.hidden;
      if (visible) start();
    };

    const place = (y) => {
      state.img.style.transform = "translate3d(0," + (-y).toFixed(1) + "px,0)";
      screen.classList.toggle("is-scrolled", y > 6);
    };

    function frame(now) {
      if (!visible) { raf = 0; return; }
      place(at(tl, now - t0));
      raf = requestAnimationFrame(frame);
    }

    function start() {
      if (raf) return;
      t0 = performance.now();
      raf = requestAnimationFrame(frame);
    }

    function refresh() {
      state = build(screen);
      tl = timeline(state.max, state.focus);
      if (reduce) place(state.focus);
    }

    // the image may not have loaded when the script runs
    if (state.img.complete) refresh();
    else state.img.addEventListener("load", refresh, { once: true });

    if (reduce) { place(state.focus); return; }

    if ("ResizeObserver" in window) new ResizeObserver(refresh).observe(screen);

    if (!("IntersectionObserver" in window)) return;
    new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          inView = e.isIntersecting;
          sync();
        });
      },
      { threshold: 0.35 }
    ).observe(screen);

    document.addEventListener("visibilitychange", sync);
  });
})();
