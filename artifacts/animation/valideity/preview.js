(() => {
  const area = document.getElementById('scrollArea');
  const overview = document.getElementById('overviewView');
  const reports = document.getElementById('reportsView');
  const dialog = document.getElementById('dialogScrim');
  const copyButton = document.getElementById('copyButton');
  const beatLabel = document.getElementById('beatLabel');
  const playPause = document.getElementById('playPause');
  const replay = document.getElementById('replay');
  const screen = document.querySelector('.screen');
  const app = document.getElementById('app');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const steps = [
    { label: 'Overview · opening frame', duration: 1800, run: () => showPage('overview', false) },
    { label: 'Study overview · scroll down', duration: 1500, run: () => area.scrollTo({ top: 190, behavior: motionBehavior() }) },
    { label: 'Study overview · return to top', duration: 950, run: () => area.scrollTo({ top: 0, behavior: motionBehavior() }) },
    { label: 'Reports · open the report', duration: 1900, run: () => showPage('reports', true) },
    { label: 'Reports · review the finding', duration: 1250, run: () => area.scrollTo({ top: 120, behavior: motionBehavior() }) },
    { label: 'Reports · return to summary', duration: 900, run: () => area.scrollTo({ top: 0, behavior: motionBehavior() }) },
    { label: 'Share · open the dialog', duration: 1500, run: openDialog },
    { label: 'Copy · link copied', duration: 1700, run: copyLink },
    { label: 'Share · close the dialog', duration: 800, run: closeDialog },
    { label: 'Overview · return to the start', duration: 1800, run: () => showPage('overview', true) }
  ];

  let index = 0;
  let timer = 0;
  let deadline = 0;
  let remaining = 0;
  let playing = false;
  let copyReset = 0;

  function fitScreenPerspective() {
    const width = screen.clientWidth;
    const height = screen.clientHeight;
    if (!width || !height) return;
    // Project the reconstructed interface onto the four corners of the banner's display glass.
    const points = [
      [0, 0, 0.01, 0.116],
      [1, 0, 0.985, 0],
      [1, 1, 1, 1],
      [0, 1, 0, 0.974]
    ];
    const rows = [];
    for (const [x, y, u, v] of points) {
      rows.push([x, y, 1, 0, 0, 0, -u * x, -u * y, u]);
      rows.push([0, 0, 0, x, y, 1, -v * x, -v * y, v]);
    }
    for (let col = 0; col < 8; col += 1) {
      let pivot = col;
      for (let row = col + 1; row < 8; row += 1) {
        if (Math.abs(rows[row][col]) > Math.abs(rows[pivot][col])) pivot = row;
      }
      [rows[col], rows[pivot]] = [rows[pivot], rows[col]];
      const divisor = rows[col][col];
      if (!divisor) return;
      for (let j = col; j <= 8; j += 1) rows[col][j] /= divisor;
      for (let row = 0; row < 8; row += 1) {
        if (row === col) continue;
        const factor = rows[row][col];
        for (let j = col; j <= 8; j += 1) rows[row][j] -= factor * rows[col][j];
      }
    }
    const [a, b, c, d, e, f, g, h] = rows.map(row => row[8]);
    const values = [
      a, d * height / width, 0, g / width,
      b * width / height, e, 0, h / height,
      0, 0, 1, 0,
      c * width, f * height, 0, 1
    ];
    app.style.transform = `matrix3d(${values.join(',')})`;
  }

  fitScreenPerspective();
  new ResizeObserver(fitScreenPerspective).observe(screen);

  function motionBehavior() { return reducedMotion.matches ? 'instant' : 'smooth'; }
  function showPage(name, animate) {
    const isReports = name === 'reports';
    overview.hidden = isReports;
    reports.hidden = !isReports;
    document.querySelectorAll('.tab').forEach(tab => tab.classList.toggle('is-active', tab.dataset.tab === name));
    area.scrollTo({ top: 0, behavior: animate ? motionBehavior() : 'instant' });
  }
  function openDialog() { dialog.classList.add('is-open'); dialog.setAttribute('aria-hidden', 'false'); }
  function closeDialog() { dialog.classList.remove('is-open'); dialog.setAttribute('aria-hidden', 'true'); }
  function copyLink() {
    copyButton.classList.add('is-copied');
    copyButton.innerHTML = '<span aria-hidden="true">✓</span> Copied';
    clearTimeout(copyReset);
    copyReset = setTimeout(resetCopy, 1500);
  }
  function resetCopy() {
    copyButton.classList.remove('is-copied');
    copyButton.innerHTML = '<span aria-hidden="true">▢</span> Copy';
  }
  function setBeat() {
    beatLabel.textContent = steps[index].label;
    document.body.dataset.motionStep = String(index);
  }
  function runCurrent() {
    if (!playing) return;
    setBeat();
    steps[index].run();
    remaining = steps[index].duration;
    deadline = performance.now() + remaining;
    timer = setTimeout(next, remaining);
  }
  function next() {
    if (index === steps.length - 1) {
      index = 0;
      document.body.dataset.motionCycle = String(Number(document.body.dataset.motionCycle || 0) + 1);
    } else {
      index += 1;
    }
    runCurrent();
  }
  function start(fromBeginning) {
    clearTimeout(timer);
    if (fromBeginning) {
      index = 0;
      document.body.dataset.motionCycle = '0';
      closeDialog();
      resetCopy();
      area.scrollTo({ top: 0, behavior: 'instant' });
      showPage('overview', false);
    }
    playing = true;
    document.body.classList.remove('paused');
    playPause.textContent = 'Pause';
    if (fromBeginning || remaining === 0) {
      runCurrent();
    } else {
      setBeat();
      deadline = performance.now() + remaining;
      timer = setTimeout(next, remaining);
    }
  }
  function pause() {
    if (!playing) return;
    remaining = Math.max(0, deadline - performance.now());
    clearTimeout(timer);
    playing = false;
    document.body.classList.add('paused');
    playPause.textContent = 'Play';
  }
  function rewind() {
    clearTimeout(timer);
    playing = false;
    index = 0;
    remaining = 0;
    closeDialog();
    resetCopy();
    showPage('overview', false);
    document.body.classList.add('paused');
    playPause.textContent = 'Play';
    setBeat();
  }

  document.querySelector('[data-tab="overview"]').addEventListener('click', () => {
    showPage('overview', true);
    beatLabel.textContent = 'Overview · opening frame';
  });
  document.querySelector('[data-tab="reports"]').addEventListener('click', () => {
    showPage('reports', true);
    beatLabel.textContent = 'Reports · open the report';
  });
  document.getElementById('shareOpen').addEventListener('click', () => {
    openDialog();
    beatLabel.textContent = 'Share · open the dialog';
  });
  document.getElementById('shareClose').addEventListener('click', () => {
    closeDialog();
    beatLabel.textContent = 'Share · close the dialog';
  });
  copyButton.addEventListener('click', () => {
    copyLink();
    beatLabel.textContent = 'Copy · link copied';
  });
  dialog.addEventListener('click', event => { if (event.target === dialog) closeDialog(); });
  playPause.addEventListener('click', () => playing ? pause() : start(false));
  replay.addEventListener('click', () => start(true));
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
  window.__valideityPreview = { reset: () => start(true), play: () => start(false), pause, get step() { return index; } };
  window.addEventListener('message', event => {
    if (event.origin !== location.origin || event.data?.type !== 'valideity-motion') return;
    if (event.data.action === 'play') start(false);
    if (event.data.action === 'pause') pause();
    if (event.data.action === 'replay') start(true);
    if (event.data.action === 'reset') rewind();
  });

  if (reducedMotion.matches || document.documentElement.dataset.embed === 'true') {
    playPause.textContent = 'Play';
    document.body.classList.add('paused');
    beatLabel.textContent = 'Overview · opening frame';
  } else {
    start(true);
  }
})();
