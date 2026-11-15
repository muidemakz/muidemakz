/* Motion for the homepage tiles in index.html.
   - Videos play only while on screen (so the looping copies stay light).
   - Animation iframes load when they first come near the screen.
   - Image reels cross-fade between real screens on a shared timer.
   Reduced motion: videos stay on their poster and reels stay on frame one. */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var tiles = document.querySelector('.tiles');
  if (!tiles) return;

  var io = 'IntersectionObserver' in window
    ? new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          var el = e.target;
          if (el.tagName === 'VIDEO') {
            if (e.isIntersecting && !reduce) { var p = el.play(); if (p && p.catch) p.catch(function () {}); }
            else el.pause();
          } else if (el.tagName === 'IFRAME' && e.isIntersecting && !el.getAttribute('src')) {
            el.setAttribute('src', el.getAttribute('data-src'));
          }
        });
      }, { root: null, rootMargin: '240px 0px', threshold: 0.01 })
    : null;

  tiles.querySelectorAll('.tile-media video, .tile-media iframe').forEach(function (el) {
    if (io) io.observe(el);
    else if (el.tagName === 'IFRAME') el.setAttribute('src', el.getAttribute('data-src'));
    else if (!reduce) el.play();
  });

  if (reduce) return;
  tiles.querySelectorAll('.reel').forEach(function (reel) {
    var imgs = reel.querySelectorAll('img');
    if (imgs.length < 2) return;
    var step = parseInt(reel.getAttribute('data-step'), 10) || 3200;
    var i = 0;
    window.setInterval(function () {
      imgs[i].classList.remove('is-on');
      i = (i + 1) % imgs.length;
      imgs[i].classList.add('is-on');
    }, step);
  });
})();
