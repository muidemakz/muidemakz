/* Endless looping feed for index-preview.html (desktop). Clones the tile set
   so there are three copies, keeps the scroll position inside the middle
   copy, and re-seats it by exactly one set height whenever it drifts out.
   Nothing here animates. Scrolling is the visitor's own: wheel, trackpad,
   touch or keyboard. Phones use the normal page scroll. */
(function () {
  var feed = document.querySelector('.tiles');
  var first = feed && feed.querySelector('.tiles-set');
  if (!feed || !first || !window.matchMedia) return;

  var wide = window.matchMedia('(min-width: 861px)');
  var rail = document.querySelector('.rail');
  var root = document.documentElement;
  var sets = [first];
  var H = 0;
  var queued = false;

  function clone() {
    var c = first.cloneNode(true);
    c.setAttribute('aria-hidden', 'true');
    c.querySelectorAll('a').forEach(function (a) { a.setAttribute('tabindex', '-1'); });
    feed.appendChild(c);
    sets.push(c);
  }

  function measure() {
    H = sets[1].offsetTop - sets[0].offsetTop;
  }

  function wrap() {
    if (!H) return;
    var t = feed.scrollTop;
    if (t >= H * 2) feed.scrollTop = t - H;
    else if (t < 1) feed.scrollTop = t + H;
  }

  function enable() {
    if (!wide.matches) { root.classList.remove('loop'); return; }
    root.classList.add('loop');
    if (sets.length === 1) { clone(); clone(); }
    var ratio = H ? feed.scrollTop / H : 1;
    measure();
    feed.scrollTop = H * (ratio >= 1 ? ratio : 1);
  }

  feed.setAttribute('tabindex', '0');
  feed.setAttribute('role', 'region');
  feed.setAttribute('aria-label', 'Selected work, scrolls in a loop');

  feed.addEventListener('scroll', function () {
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(function () { wrap(); queued = false; });
  }, { passive: true });

  /* Wheel over the rail scrolls the feed too, since the page itself no longer scrolls. */
  if (rail) {
    rail.addEventListener('wheel', function (e) {
      if (!root.classList.contains('loop')) return;
      feed.scrollTop += e.deltaY;
      e.preventDefault();
    }, { passive: false });
  }

  window.addEventListener('resize', function () {
    if (!root.classList.contains('loop')) return;
    var ratio = feed.scrollTop / (H || 1);
    measure();
    feed.scrollTop = ratio * H;
  });

  if (wide.addEventListener) wide.addEventListener('change', enable);
  else wide.addListener(enable);

  enable();
})();
