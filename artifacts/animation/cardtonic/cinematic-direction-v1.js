(() => {
  const root = document.querySelector('[data-film]');
  const scenes = [...root.querySelectorAll('.scene')];
  const progress = root.querySelector('[data-progress]');
  const toggle = root.querySelector('[data-toggle]');
  const replay = root.querySelector('[data-replay]');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const durations = [4700, 4400, 4600];
  let index = 0, elapsed = 0, last = 0, raf = 0, paused = reduce.matches;
  function render() {
    scenes.forEach((scene, i) => {
      scene.classList.toggle('is-active', i === index);
      if (i === index) scene.removeAttribute('aria-hidden');
      else scene.setAttribute('aria-hidden', 'true');
    });
    const activeImage = scenes[index].querySelector('img');
    if (activeImage) activeImage.loading = 'eager';
    elapsed = 0;
    progress.style.width = '0%';
  }
  function tick(now) {
    if (!paused && !document.hidden) {
      if (!last) last = now;
      elapsed += now - last;
      progress.style.width = `${Math.min(100, elapsed / durations[index] * 100)}%`;
      if (elapsed >= durations[index]) { index = (index + 1) % scenes.length; render(); }
    }
    last = now;
    raf = requestAnimationFrame(tick);
  }
  toggle.addEventListener('click', () => {
    paused = !paused;
    toggle.textContent = paused ? 'Play' : 'Pause';
    toggle.setAttribute('aria-label', `${paused ? 'Play' : 'Pause'} animation`);
    last = 0;
  });
  replay.addEventListener('click', () => { index = 0; paused = false; toggle.textContent = 'Pause'; toggle.setAttribute('aria-label','Pause animation'); render(); last = 0; });
  document.addEventListener('visibilitychange', () => { last = 0; });
  reduce.addEventListener('change', event => { paused = event.matches; toggle.textContent = paused ? 'Play' : 'Pause'; last = 0; });
  render();
  raf = requestAnimationFrame(tick);
})();
