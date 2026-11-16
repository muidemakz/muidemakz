/* Warms the browser cache so a case study opens fast: once Home is up and the browser is idle, it quietly
   fetches each case study page plus its styles, scripts and first picture, two at a time. Hovering or
   touching a link jumps that page to the front. Skipped on Data Saver and very slow connections. */
(function () {
  var c = navigator.connection || {};
  if (c.saveData || /(^|-)2g$/.test(c.effectiveType || '')) return;
  var PAGES = ['omnione', 'omnibiz-speech-to-order', 'teesaslms', 'fundall', 'valideity', 'empty-state', 'moniepoint-verification', 'sun-king', 'nsimbi-three-purchases', 'cancel-flow', 'cardtonic', 'coreloops', 'venx', 'raven-pay'];
  var queue = ['my-work', 'about'].concat(PAGES).map(function (n) { return n + '.html?embed=1'; });
  var seen = {}, running = 0, started = false;

  function warm(url) {
    if (seen[url]) return Promise.resolve();
    seen[url] = 1;
    return fetch(url, { credentials: 'same-origin' }).then(function (r) { return r.ok ? r.text() : ''; }).then(function (html) {
      if (!html) return;
      var base = new URL(url, location.href), subs = [], m, re;
      re = /<link[^>]+rel=["']stylesheet["'][^>]*href=["']([^"']+)["']|<script[^>]+src=["']([^"']+)["']/gi;
      while ((m = re.exec(html))) subs.push(m[1] || m[2]);
      var im = /<img(?![^>]*loading=["']lazy["'])[^>]*src=["']([^"']+)["']/i.exec(html);
      if (im) subs.push(im[1]);
      return Promise.all(subs.map(function (s) {
        var u = new URL(s, base);
        if (u.origin !== location.origin || seen[u.href]) return null;
        seen[u.href] = 1;
        return fetch(u.href, { credentials: 'same-origin' }).catch(function () {});
      }));
    }).catch(function () {});
  }
  function pump() {
    while (running < 2 && queue.length) {
      running++;
      warm(queue.shift()).then(function () { running--; setTimeout(pump, 300); });
    }
  }
  function hint(e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var h = a.getAttribute('href') || '';
    if (/^(https?:|mailto:|#)/.test(h)) return;
    var f = h.replace(/^\//, '').split(/[?#]/)[0];
    if (!/\.html$/.test(f)) f = f + '.html';
    var i = queue.indexOf(f + '?embed=1');
    if (i > -1) queue.splice(i, 1);
    warm(f + '?embed=1');
  }
  document.addEventListener('pointerover', hint, { passive: true });
  document.addEventListener('touchstart', hint, { passive: true });

  function go() {
    if (started) return; started = true;
    (window.requestIdleCallback || function (f) { setTimeout(f, 600); })(pump, { timeout: 3000 });
  }
  if (window.__bootPending) window.addEventListener('boot:done', function () { setTimeout(go, 800); }, { once: true });
  else setTimeout(go, 1200);
})();
