(() => {
  const stage = document.querySelector('[data-stage]');
  const allFrames = [...stage.querySelectorAll('.frame')];
  const canvasMode = document.documentElement.dataset.canvas === 'true';
  // Keep the original Figma cover as the opening frame in every placement.
  const frames = allFrames;
  const caption = stage.querySelector('[data-caption]');
  const toggle = stage.querySelector('[data-toggle]');
  const replay = stage.querySelector('[data-replay]');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const embedded = document.documentElement.dataset.embed === 'true';
  let index = 0;
  let timer;
  let paused = reduced;
  const hold = [3200, 2600, 2800, 2600, 2600, 2600, 2600, 3000];

  function show(next) {
    frames[index].classList.remove('is-active');
    index = next % frames.length;
    frames[index].classList.add('is-active');
    caption.classList.remove('is-visible');
    caption.textContent = frames[index].dataset.caption;
    requestAnimationFrame(() => caption.classList.add('is-visible'));
    schedule();
  }
  function schedule() {
    clearTimeout(timer);
    if (!paused) timer = setTimeout(() => show(index + 1), hold[index]);
  }
  function setPaused(value) {
    paused = value;
    toggle.textContent = paused ? 'Play' : 'Pause';
    toggle.setAttribute('aria-label', paused ? 'Play animation' : 'Pause animation');
    if (!paused) schedule(); else clearTimeout(timer);
  }
  toggle.addEventListener('click', () => setPaused(!paused));
  replay.addEventListener('click', () => { setPaused(false); show(0); });
  if (!embedded) {
    stage.addEventListener('mouseenter', () => { if (!reduced) clearTimeout(timer); });
    stage.addEventListener('mouseleave', () => { if (!paused && !reduced) schedule(); });
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) setPaused(true);
  });
  window.addEventListener('message', event => {
    if (event.origin !== location.origin || event.data?.type !== 'valideity-motion') return;
    if (event.data.action === 'play') setPaused(false);
    if (event.data.action === 'pause') setPaused(true);
    if (event.data.action === 'replay') { setPaused(false); show(0); }
    if (event.data.action === 'reset') { setPaused(true); show(0); }
  });
  caption.textContent = frames[0].dataset.caption;
  caption.classList.add('is-visible');
  setPaused(paused);
})();
