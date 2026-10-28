// Before / after comparison (css/before-after.css).
//
// Markup contract: a `.ba` element holding two <img>, `.ba-img--before` and
// `.ba-img--after`, with --ba-w / --ba-ch / --ba-ct set inline (the crop
// window, in source pixels). This script adds everything interactive: the
// clipped After layer, drag handle, a hidden range input (so the keyboard
// and screen readers get a real slider), Before / Split / After buttons, and
// change markers.
//
// Markers come from an optional "what changed" list elsewhere on the page:
//   <ol data-ba-target="ID"><li><button data-box="x y w h">…</button></li></ol>
// where the box is in source pixels. Activating one slides the comparison to
// After and outlines that region.
(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const SVG_GRIP =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" ' +
    'stroke-linecap="square" aria-hidden="true"><path d="M9 6 3 12l6 6"/><path d="m15 6 6 6-6 6"/></svg>';

  const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  // a ball landing: reaches the target, rebounds back inward, settles. Unlike an
  // overshoot spring it never leaves the 0 to 100 range, so the line can bounce
  // against the image edge without being clipped.
  const easeOutBounce = (t) => {
    const n = 7.5625, d = 2.75;
    if (t < 1 / d) return n * t * t;
    if (t < 2 / d) return n * (t -= 1.5 / d) * t + 0.75;
    if (t < 2.5 / d) return n * (t -= 2.25 / d) * t + 0.9375;
    return n * (t -= 2.625 / d) * t + 0.984375;
  };
  const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));
  const cssNum = (el, name) => parseFloat(getComputedStyle(el).getPropertyValue(name));

  function el(tag, cls, attrs) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (attrs) Object.keys(attrs).forEach((k) => node.setAttribute(k, attrs[k]));
    return node;
  }

  function init(stage) {
    const before = stage.querySelector(".ba-img--before");
    const after = stage.querySelector(".ba-img--after");
    if (!before || !after) return;

    const W = cssNum(stage, "--ba-w");
    const CH = cssNum(stage, "--ba-ch");
    const CT = cssNum(stage, "--ba-ct") || 0;
    const label = stage.getAttribute("data-ba-label") || "screen";

    // After layer: the clip lives on a wrapper so the <img> keeps its crop offset
    const afterLayer = el("div", "ba-after");
    stage.appendChild(afterLayer);
    afterLayer.appendChild(after);

    // the in-image tags are real buttons: press one and the line glides there
    const chipBefore = el("button", "ba-chip ba-chip--before", { type: "button", "aria-pressed": "false", "aria-label": "Show the before version" });
    chipBefore.textContent = "Before";
    const chipAfter = el("button", "ba-chip ba-chip--after", { type: "button", "aria-pressed": "false", "aria-label": "Show the after version" });
    chipAfter.textContent = "After";

    const range = el("input", "ba-range", {
      type: "range", min: "0", max: "100", step: "2", value: "50",
      "aria-label": "Compare before and after, " + label
    });
    const handle = el("div", "ba-handle", { "aria-hidden": "true" });
    const grip = el("span", "ba-grip");
    grip.innerHTML = SVG_GRIP;
    handle.appendChild(grip);

    stage.setAttribute("role", "group");
    stage.setAttribute("aria-label", "Before and after comparison: " + label);
    stage.append(range, handle);

    // the tags go in a row above the image, so they can never cover what it shows
    const bar = el("div", "ba-bar");
    bar.append(chipBefore, chipAfter);
    stage.parentNode.insertBefore(bar, stage);

    // ---------- state ----------
    let pos = 50;
    let raf = 0;

    function paint() {
      stage.style.setProperty("--ba-pos", pos.toFixed(2));
      range.value = String(Math.round(pos));
      stage.dataset.side = pos > 70 ? "before" : pos < 30 ? "after" : "split";
      chipBefore.setAttribute("aria-pressed", String(pos >= 98));
      chipAfter.setAttribute("aria-pressed", String(pos <= 2));
      range.setAttribute(
        "aria-valuetext",
        pos >= 98 ? "Showing the before version" :
        pos <= 2 ? "Showing the after version" :
        "Before on the left " + Math.round(pos) + " percent, after on the right"
      );
    }

    function stop() { if (raf) { cancelAnimationFrame(raf); raf = 0; } }

    function setPos(v) { pos = clamp(v, 0, 100); paint(); }

    function animateTo(target, ms, ease) {
      stop();
      target = clamp(target, 0, 100);
      if (reduceMotion.matches || !ms || Math.abs(target - pos) < 0.5) { setPos(target); return Promise.resolve(); }
      const from = pos;
      const t0 = performance.now();
      const curve = ease || easeInOut;
      return new Promise((resolve) => {
        (function frame(now) {
          const t = clamp((now - t0) / ms, 0, 1);
          setPos(from + (target - from) * curve(t));
          if (t < 1) raf = requestAnimationFrame(frame);
          else { raf = 0; resolve(); }
        })(t0);
      });
    }

    // ---------- Before / After tags ----------
    // The tags inside the image are the controls: press one and the line travels
    // there and bounces to rest. Their pointerdown must not reach the stage, or
    // its drag handler would jump the line to the click point and swallow the click.
    const GLIDE_MS = 950;
    [[chipBefore, 100], [chipAfter, 0]].forEach(([chip, p]) => {
      chip.addEventListener("pointerdown", (e) => e.stopPropagation());
      chip.addEventListener("click", () => { markers.clear(); animateTo(p, GLIDE_MS, easeOutBounce); });
    });

    // ---------- pointer drag ----------
    let dragging = false, startX = 0, startY = 0, committed = false;

    function posFromEvent(e) {
      const r = stage.getBoundingClientRect();
      return ((e.clientX - r.left) / r.width) * 100;
    }

    stage.addEventListener("pointerdown", (e) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      stop();
      dragging = true;
      startX = e.clientX; startY = e.clientY;
      // a finger might be starting a vertical scroll, so only commit once the
      // gesture is clearly horizontal; a mouse commits straight away
      committed = e.pointerType === "mouse";
      if (committed) {
        stage.setPointerCapture(e.pointerId);
        stage.classList.add("is-dragging");
        markers.clear();
        setPos(posFromEvent(e));
      }
    });

    stage.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      if (!committed) {
        const dx = Math.abs(e.clientX - startX), dy = Math.abs(e.clientY - startY);
        if (dx < 6 && dy < 6) return;
        if (dy > dx) { dragging = false; return; }
        committed = true;
        stage.setPointerCapture(e.pointerId);
        stage.classList.add("is-dragging");
        markers.clear();
      }
      setPos(posFromEvent(e));
    });

    function end(e) {
      if (!dragging) return;
      // a quick tap on a touch screen (no drag) jumps the handle to the tap
      if (!committed && e.type === "pointerup" && Math.abs(e.clientX - startX) < 6 && Math.abs(e.clientY - startY) < 6) {
        markers.clear();
        animateTo(posFromEvent(e), 260);
      }
      dragging = false; committed = false;
      stage.classList.remove("is-dragging");
    }
    stage.addEventListener("pointerup", end);
    stage.addEventListener("pointercancel", end);

    // ---------- keyboard / assistive tech ----------
    range.addEventListener("input", () => { stop(); markers.clear(); setPos(Number(range.value)); });

    // ---------- change markers ----------
    const markers = (function () {
      const marks = [];
      const buttons = [];
      const list = stage.id ? document.querySelector('[data-ba-target="' + stage.id + '"]') : null;
      if (list) {
        list.querySelectorAll("[data-box]").forEach((btn, i) => {
          // one change can point at several regions: data-box="x y w h; x y w h"
          const own = btn.dataset.box.split(";").map((part) => {
            const [x, y, w, h] = part.trim().split(/\s+/).map(Number);
            const m = el("span", "ba-mark", { "aria-hidden": "true" });
            m.style.left = (x / W) * 100 + "%";
            m.style.top = ((y - CT) / CH) * 100 + "%";
            m.style.width = (w / W) * 100 + "%";
            m.style.height = (h / CH) * 100 + "%";
            const n = el("span", "ba-mark-n");
            n.textContent = String(i + 1);
            m.appendChild(n);
            stage.insertBefore(m, handle);
            marks.push(m);
            return m;
          });
          buttons.push(btn);
          btn.setAttribute("aria-pressed", "false");
          btn.addEventListener("click", () => {
            const on = btn.getAttribute("aria-pressed") === "true";
            api.clear();
            if (!on) {
              btn.setAttribute("aria-pressed", "true");
              own.forEach((m) => m.classList.add("is-on"));
              if (pos > 12) animateTo(0, 900, easeOutBounce);
            }
          });
        });
      }
      const api = {
        clear() {
          marks.forEach((m) => m.classList.remove("is-on"));
          buttons.forEach((b) => b.setAttribute("aria-pressed", "false"));
        }
      };
      return api;
    })();

    paint();

    // ---------- one demonstration sweep, the first time it scrolls into view ----------
    if (!reduceMotion.matches && "IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => {
        if (!entries.some((en) => en.isIntersecting)) return;
        io.disconnect();
        if (dragging) return;
        animateTo(84, 700)
          .then(() => (dragging ? null : animateTo(16, 1000)))
          .then(() => (dragging ? null : animateTo(50, 650)));
      }, { threshold: 0.5 });
      io.observe(stage);
    }
  }

  function boot() {
    document.documentElement.classList.add("mv-js");
    document.querySelectorAll(".ba").forEach(init);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
