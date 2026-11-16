/* Motion for the homepage tiles in index.html.
   - Videos play only while on screen (so the looping copies stay light).
   - Animation iframes load when they first come near the screen.
   - Image reels cross-fade between real screens on a shared timer.
   - Spotlight: hover a tile (or focus it with the keyboard) and only that tile moves; the rest pause
     and dim slightly. Move off the tiles and everything plays again. On phones the tile in the middle
     of the screen is the one that plays.
   Reduced motion: videos stay on their poster and reels stay on frame one. */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var tiles = document.querySelector('.tiles');
  if (!tiles) return;
  var hover = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  var inView = new Set();
  var lit = null; /* the tile in the spotlight, or null when everything plays */

  function tileOf(el) { return el.closest('.tile'); }
  function allowed(el) { return !lit || tileOf(el) === lit; }
  function send(frame, action) {
    try { frame.contentWindow.postMessage({ type: 'valideity-motion', action: action }, location.origin); } catch (e) {}
  }
  function apply(el) {
    var on = !reduce && inView.has(el) && allowed(el);
    if (el.tagName === 'VIDEO') {
      if (on) { var p = el.play(); if (p && p.catch) p.catch(function () {}); } else el.pause();
    } else if (el.tagName === 'IFRAME' && el.getAttribute('src')) {
      send(el, on ? 'play' : 'pause');
    }
  }
  function applyAll() { tiles.querySelectorAll('.tile-media video, .tile-media iframe').forEach(apply); }

  var io = 'IntersectionObserver' in window
    ? new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          var el = e.target;
          if (e.isIntersecting) inView.add(el); else inView.delete(el);
          if (el.tagName === 'IFRAME' && e.isIntersecting && !el.getAttribute('src')) {
            el.addEventListener('load', function () { apply(el); });
            el.setAttribute('src', el.getAttribute('data-src'));
          }
          apply(el);
        });
      }, { root: null, rootMargin: '240px 0px', threshold: 0.01 })
    : null;

  tiles.querySelectorAll('.tile-media video, .tile-media iframe').forEach(function (el) {
    if (io) io.observe(el);
    else { inView.add(el); if (el.tagName === 'IFRAME') el.setAttribute('src', el.getAttribute('data-src')); else if (!reduce) el.play(); }
  });

  function spotlight(tile) {
    if (tile === lit) return;
    if (lit) lit.classList.remove('is-lit');
    lit = tile;
    if (lit) lit.classList.add('is-lit');
    tiles.classList.toggle('is-spotlight', !!lit && hover);
    applyAll();
  }

  if (hover) {
    /* the focus follows the cursor from tile to tile, and lets go when the cursor leaves the tiles */
    tiles.addEventListener('pointerover', function (e) { var t = e.target.closest && e.target.closest('.tile'); if (t) spotlight(t); });
    tiles.addEventListener('pointerleave', function () { spotlight(null); });
    tiles.addEventListener('focusin', function (e) { var t = e.target.closest && e.target.closest('.tile'); if (t) spotlight(t); });
    tiles.addEventListener('focusout', function (e) { if (!tiles.contains(e.relatedTarget)) spotlight(null); });
  } else if ('IntersectionObserver' in window) {
    /* phones: the tile crossing the middle of the screen plays */
    var mid = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) spotlight(e.target); });
    }, { root: tiles, rootMargin: '-48% 0px -48% 0px', threshold: 0 });
    tiles.querySelectorAll('.tile').forEach(function (t) { mid.observe(t); });
  }

  if (reduce) return;
  tiles.querySelectorAll('.reel').forEach(function (reel) {
    var imgs = reel.querySelectorAll('img');
    if (imgs.length < 2) return;
    var step = parseInt(reel.getAttribute('data-step'), 10) || 3200;
    var tile = tileOf(reel);
    var i = 0;
    window.setInterval(function () {
      if (lit && tile !== lit) return; /* reels outside the spotlight hold still */
      imgs[i].classList.remove('is-on');
      i = (i + 1) % imgs.length;
      imgs[i].classList.add('is-on');
    }, step);
  });
})();
