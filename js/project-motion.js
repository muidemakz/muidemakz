/* Shared video loops: visible case studies, active homepage cards, Work hover/focus. */
(function () {
  'use strict';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const players = new Map();

  function attachFrame(root, frame) {
    if (players.has(root)) return;
    const mode = root.dataset.motionMode;
    const toggle = root.querySelector('[data-motion-toggle]');
    const replay = root.querySelector('[data-motion-replay]');
    const label = root.dataset.motionLabel || 'animation';
    let visible = false, hovered = false, focused = false;
    let requested = null, failed = false, ready = false, wasEligible = false, playing = false;

    function eligible() {
      if (!root.isConnected || !visible || document.hidden || failed) return false;
      if (mode === 'story') return root.classList.contains('is-active');
      if (mode === 'hover') return (hovered || focused) && !root.closest('.work-grid.is-list');
      return true;
    }
    function wantsPlayback() {
      if (mode === 'story') {
        const shelf = root.closest('.story-shelf');
        return shelf.dataset.motionPaused !== 'true' &&
          (!reducedMotion.matches || shelf.dataset.motionExplicit === 'true');
      }
      return requested === true || (requested === null && !reducedMotion.matches);
    }
    function send(action) {
      if (frame.contentWindow) frame.contentWindow.postMessage({ type: 'valideity-motion', action }, location.origin);
    }
    function buttons() {
      if (!toggle) return;
      toggle.textContent = playing ? 'Pause' : 'Play';
      toggle.setAttribute('aria-label', (playing ? 'Pause ' : 'Play ') + label);
      toggle.disabled = failed || !ready;
      if (replay) replay.disabled = failed || !ready;
    }
    function sync() {
      const active = eligible();
      const shouldPlay = active && wantsPlayback();
      if (shouldPlay && ready) {
        root.dataset.motionShown = 'true';
        if (!playing) { send('play'); playing = true; }
      } else {
        if (playing) { send('pause'); playing = false; }
        if (wasEligible && !active && mode !== 'visible' && !document.hidden) {
          send('reset');
          requested = null;
        }
        root.dataset.motionShown = 'false';
      }
      wasEligible = active;
      buttons();
    }
    const viewport = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting && entries[0].intersectionRatio >= .2;
      sync();
    }, { threshold: .2 });
    viewport.observe(root);
    const storyState = mode === 'story' ? new MutationObserver(sync) : null;
    if (storyState) storyState.observe(root, { attributes: true, attributeFilter: ['class'] });
    if (mode === 'hover') {
      root.addEventListener('pointerenter', event => {
        if (event.pointerType === 'mouse') { hovered = true; sync(); }
      });
      root.addEventListener('pointerleave', () => { hovered = false; sync(); });
      root.addEventListener('focusin', () => { focused = true; sync(); });
      root.addEventListener('focusout', event => { focused = root.contains(event.relatedTarget); sync(); });
    }
    if (toggle) toggle.addEventListener('click', () => {
      requested = !playing;
      sync();
    });
    if (replay) replay.addEventListener('click', () => {
      requested = true;
      if (eligible() && ready && wantsPlayback()) {
        send('replay');
        playing = true;
      }
      sync();
    });
    frame.addEventListener('load', () => { ready = true; sync(); });
    frame.addEventListener('error', () => { failed = true; sync(); });
    players.set(root, {
      sync,
      preferenceChanged() { requested = null; sync(); },
      destroy() { send('pause'); viewport.disconnect(); if (storyState) storyState.disconnect(); }
    });
    sync();
  }

  function attach(root) {
    if (players.has(root)) return;
    const frame = root.querySelector('[data-motion-frame]');
    if (frame) { attachFrame(root, frame); return; }
    const video = root.querySelector('[data-motion-video]');
    if (!video) return;
    const mode = root.dataset.motionMode;
    const toggle = root.querySelector('[data-motion-toggle]');
    const replay = root.querySelector('[data-motion-replay]');
    const label = root.dataset.motionLabel || 'animation';
    let visible = false, hovered = false, focused = false;
    let requested = null, failed = false, ready = false, wasEligible = false;
    let playPending = false;
    video.muted = true;
    video.loop = true;
    if (mode === 'visible') video.controls = false;
    root.querySelectorAll('[data-motion-controls]').forEach(el => { el.hidden = false; });

    function eligible() {
      if (!root.isConnected || !visible || document.hidden || failed) return false;
      if (mode === 'story') return root.classList.contains('is-active');
      if (mode === 'hover') return (hovered || focused) && !root.closest('.work-grid.is-list');
      return true;
    }
    function wantsPlayback() {
      if (mode === 'story') {
        const shelf = root.closest('.story-shelf');
        return shelf.dataset.motionPaused !== 'true' &&
          (!reducedMotion.matches || shelf.dataset.motionExplicit === 'true');
      }
      return requested === true || (requested === null && !reducedMotion.matches);
    }
    function buttons() {
      if (!toggle) return;
      const playing = !video.paused;
      toggle.textContent = playing ? 'Pause' : 'Play';
      toggle.setAttribute('aria-label', (playing ? 'Pause ' : 'Play ') + label);
      toggle.disabled = failed;
      if (replay) replay.disabled = failed;
    }
    function sync() {
      const active = eligible();
      if (!active) {
        video.pause();
        if (wasEligible && mode !== 'visible' && !document.hidden) {
          video.currentTime = 0;
          requested = null;
        }
        root.dataset.motionShown = 'false';
      } else if (wantsPlayback()) {
        root.dataset.motionShown = String(ready);
        if (video.paused && !playPending) {
          playPending = true;
          video.play().catch(() => {
            // A browser may reject autoplay. Leave an explicit Play action.
            if (eligible()) requested = false;
          }).finally(() => {
            playPending = false;
            // A card can leave the view while play() is still resolving.
            if (!eligible() || !wantsPlayback()) video.pause();
            buttons();
          });
        }
      } else {
        video.pause();
        root.dataset.motionShown = String(ready && video.currentTime > 0);
      }
      wasEligible = active;
      buttons();
    }
    const viewport = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting && entries[0].intersectionRatio >= .2;
      sync();
    }, { threshold: .2 });
    viewport.observe(root);

    const storyState = mode === 'story' ? new MutationObserver(sync) : null;
    if (storyState) storyState.observe(root, { attributes: true, attributeFilter: ['class'] });
    if (mode === 'hover') {
      root.addEventListener('pointerenter', event => {
        if (event.pointerType === 'mouse') { hovered = true; sync(); }
      });
      root.addEventListener('pointerleave', () => { hovered = false; sync(); });
      root.addEventListener('focusin', () => { focused = true; sync(); });
      root.addEventListener('focusout', event => {
        focused = root.contains(event.relatedTarget); sync();
      });
    }
    if (toggle) toggle.addEventListener('click', () => {
      requested = video.paused;
      sync();
    });
    if (replay) replay.addEventListener('click', () => {
      video.currentTime = 0;
      requested = true;
      sync();
    });
    video.addEventListener('loadeddata', () => { ready = true; sync(); });
    video.addEventListener('playing', () => {
      if (eligible() && wantsPlayback()) root.dataset.motionShown = 'true';
      else video.pause();
      buttons();
    });
    video.addEventListener('pause', buttons);
    video.addEventListener('error', () => { failed = true; ready = false; sync(); });
    players.set(root, {
      sync,
      preferenceChanged() { requested = null; sync(); },
      destroy() { video.pause(); viewport.disconnect(); if (storyState) storyState.disconnect(); }
    });
    sync();
  }

  function refresh() {
    players.forEach((player, root) => {
      if (!root.isConnected) { player.destroy(); players.delete(root); }
    });
    document.querySelectorAll('[data-project-motion]').forEach(attach);
    players.forEach(player => player.sync());
  }
  document.addEventListener('visibilitychange', refresh);
  document.addEventListener('projectmotionrefresh', refresh);
  reducedMotion.addEventListener('change', () => {
    players.forEach(player => player.preferenceChanged());
  });
  const grid = document.getElementById('workGrid');
  if (grid) new MutationObserver(refresh).observe(grid, {
    childList: true, attributes: true, attributeFilter: ['class']
  });
  refresh();
})();
