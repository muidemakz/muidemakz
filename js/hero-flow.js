/* Cross-fading hero walkthrough. Markup: [data-hf-flow] > .hf-stage > .hf-frame[data-label],
   plus .hf-label and .hf-dot elements in .hf-meta. Pauses on hover, off-screen and hidden tabs. */
(function () {
  var root = document.querySelector('[data-hf-flow]');
  if (!root) return;
  var frames = [].slice.call(root.querySelectorAll('.hf-frame'));
  var dots = [].slice.call(root.querySelectorAll('.hf-dot'));
  var label = root.querySelector('.hf-label');
  var MS = 3200, i = 0, timer = null, visible = true;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  root.style.setProperty('--hf-ms', MS + 'ms');
  function show(n) {
    i = n;
    frames.forEach(function (f, k) { f.classList.toggle('is-current', k === n); });
    dots.forEach(function (d, k) {
      d.classList.remove('is-current');
      d.classList.toggle('is-done', k < n);
      if (k === n) { void d.offsetWidth; d.classList.add('is-current'); }
    });
    label.textContent = frames[n].getAttribute('data-label');
  }
  function next() { show((i + 1) % frames.length); }
  function run() { clearInterval(timer); if (visible && !document.hidden) timer = setInterval(next, MS); }
  function halt() { clearInterval(timer); }
  show(0); run();
  root.addEventListener('mouseenter', function () { root.classList.add('is-paused'); halt(); });
  root.addEventListener('mouseleave', function () { root.classList.remove('is-paused'); show(i); run(); });
  document.addEventListener('visibilitychange', function () { document.hidden ? halt() : run(); });
  if ('IntersectionObserver' in window) new IntersectionObserver(function (e) { visible = e[0].isIntersecting; visible ? run() : halt(); }).observe(root);
})();
