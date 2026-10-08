/* Original-screen previews: autoplay while visible, with pause and accessible progress controls. */
(function () {
  'use strict';
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('[data-case-loop]').forEach(function (root) {
    const frames = Array.from(root.querySelectorAll('.case-loop-frame'));
    const steps = Array.from(root.querySelectorAll('[data-loop-step]'));
    const label = root.querySelector('.case-loop-label');
    if (frames.length < 2) return;
    const duration = 4000;
    let index = 0, running = !motion.matches, visible = false, timer = null;
    let elapsed = 0, hovering = false, focused = false;
    function render() {
      root.dataset.currentFrame = String(index);
      frames.forEach(function (frame, n) {
        frame.classList.toggle('is-current', n === index);
        if (n === index) frame.removeAttribute('aria-hidden');
        else frame.setAttribute('aria-hidden', 'true');
      });
      steps.forEach(function (step, n) {
        step.classList.toggle('is-complete', n < index);
        if (n === index) step.setAttribute('aria-current', 'step');
        else step.removeAttribute('aria-current');
      });
      if (label) label.textContent = frames[index].dataset.loopLabel || '';
      root.style.setProperty('--loop-progress', (elapsed / duration * 100) + '%');
    }
    function schedule() {
      clearInterval(timer); timer = null;
      const active = running && visible && !document.hidden && !hovering && !focused;
      root.dataset.playing = String(active);
      if (active) {
        let previous = performance.now();
        timer = setInterval(function () {
          const now = performance.now(); elapsed += now - previous; previous = now;
          if (elapsed >= duration) { elapsed = 0; index = (index + 1) % frames.length; render(); }
          root.style.setProperty('--loop-progress', (elapsed / duration * 100) + '%');
        }, 100);
      }
    }
    steps.forEach(function (step) {
      step.addEventListener('click', function () { elapsed = 0; index = Number(step.dataset.loopStep); render(); schedule(); });
    });
    root.addEventListener('pointerenter', function (event) { if (event.pointerType === 'mouse') { hovering = true; schedule(); } });
    root.addEventListener('pointerleave', function () { hovering = false; schedule(); });
    root.addEventListener('focusin', function () { focused = true; schedule(); });
    root.addEventListener('focusout', function (event) { if (!root.contains(event.relatedTarget)) { focused = false; schedule(); } });
    const observer = new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting && entries[0].intersectionRatio >= .15; schedule(); }, {threshold:0.15});
    observer.observe(root);
    document.addEventListener('visibilitychange', schedule);
    motion.addEventListener('change', function () { running = !motion.matches; render(); schedule(); });
    render();
  });
})();
