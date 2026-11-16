/* Shell for index.html: floating header + identity rail (left) + one raised container (right).
   Work, About and every case study open INSIDE the container: it grows over the rail to fill the
   space under the header (the header never moves), and Home folds it back to the right.
   Switching between Work / About / a case study while it is open wipes the new page over the old one.
   Routes live in the URL hash (#/work, #/about, #/case/<page>) so the browser Back button works.
   Pages open in iframes with ?embed=1; js/embed-preview.js hides their own header and talks to this file. */
(function () {
  var root = document.documentElement;
  var stage = document.getElementById('stage');
  var slot = document.getElementById('stageSlot');
  var main = document.getElementById('shellMain');
  var body = document.getElementById('stageBody');
  var loading = document.getElementById('stageLoading');
  var nav = document.getElementById('shellNav');
  var pill = document.getElementById('navPill');
  var sw = document.getElementById('themeSwitch');
  var pull = document.getElementById('themePull');
  root.classList.toggle('on-home', (location.pathname === '/' || location.pathname === '/index.html') && !/^#\/(work|about|case)/.test(location.hash));
  if (!stage || !body || !slot) return;

  /* Owner link: muidemakz.com/work?owner=<key> saves the key in this browser (the Work board reads it)
     and then tidies it out of the address bar so it is not left on screen or in the history. */
  try {
    var q = new URLSearchParams(location.search), ownerKey = q.get('owner');
    if (ownerKey) {
      localStorage.setItem('wb-owner-key', ownerKey);
      q.delete('owner');
      history.replaceState(history.state, '', location.pathname + (q.toString() ? '?' + q : '') + location.hash);
    }
  } catch (e) {}

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var FILES = { work: 'my-work.html', about: 'about.html' };
  var ORDER = { home: 0, work: 1, about: 2, case: 3 };
  var views = { home: body.querySelector('[data-view="home"]') };
  var caseView = null;
  var cur = 'home', expanded = false, busy = false, pending = null, depth = 0, returnTo = 'home', homeTop = 0;

  /* The slide-in loading overlay sits inside the stage body */
  body.appendChild(loading);

  function wait(ms) { return new Promise(function (r) { window.setTimeout(r, ms); }); }
  function embedUrl(href) { return href + (href.indexOf('?') > -1 ? '&' : '?') + 'embed=1'; }
  function px(r, radius) { return { top: r.top + 'px', left: r.left + 'px', width: r.width + 'px', height: r.height + 'px', borderRadius: radius || '30px' }; }
  function setRect(r) { stage.style.top = r.top + 'px'; stage.style.left = r.left + 'px'; stage.style.width = r.width + 'px'; stage.style.height = r.height + 'px'; }
  function clearRect() { ['top', 'left', 'width', 'height', 'borderRadius'].forEach(function (p) { stage.style[p] = ''; }); }

  var PREVIEW_MAP = {"omnione.html":"omnione.html","omnibiz-speech-to-order.html":"omnibiz-speech-to-order.html","teesaslms.html":"teesaslms.html","fundall.html":"fundall.html","valideity.html":"valideity.html","empty-state.html":"empty-state.html","moniepoint-verification.html":"moniepoint-verification.html","sun-king.html":"sun-king.html","nsimbi-three-purchases.html":"nsimbi-three-purchases.html","cancel-flow.html":"cancel-flow.html","cardtonic.html":"cardtonic.html","coreloops.html":"coreloops.html","venx.html":"venx.html","raven-pay.html":"raven-pay.html"};
  function routeFromHref(href) {
    var f = String(href).split('#')[0].split('?')[0].split('/').pop();
    if (PREVIEW_MAP[f]) href = String(href).replace(f, PREVIEW_MAP[f]);
    if (f === '' || f === 'index.html') return { name: 'home' };
    if (f === 'my-work.html') return { name: 'work' };
    if (f === 'about.html') return { name: 'about' };
    return { name: 'case', href: String(href) };
  }
  /* Clean addresses: / , /work , /about and /<case-study> (Netlify serves this page at each, see _redirects).
     Old links with #/... still work and are tidied into the clean address. */
  function parseLocation() {
    var h = location.hash.replace(/^#/, '');
    if (h.indexOf('/case/') === 0) return routeFromHref(decodeURIComponent(h.slice(6)));
    if (h === '/work') return { name: 'work' };
    if (h === '/about') return { name: 'about' };
    var p = location.pathname.replace(/^\/+|\/+$/g, '').replace(/\.html$/, '');
    if (p === '' || p === 'index') return { name: 'home' };
    if (p === 'work' || p === 'my-work') return { name: 'work' };
    if (p === 'about') return { name: 'about' };
    if (PREVIEW_MAP[p + '.html']) return { name: 'case', href: p + '.html' + location.search };
    return { name: 'home' };
  }
  function pathFor(r) {
    if (r.name === 'home') return '/';
    if (r.name !== 'case') return '/' + r.name;
    var f = String(r.href).split('#')[0], q = f.indexOf('?') > -1 ? f.slice(f.indexOf('?')) : '';
    return '/' + f.split('?')[0].split('/').pop().replace(/\.html$/, '') + q;
  }

  /* ---------- Header nav pill ---------- */
  function updateNav(name) {
    var active = null;
    Array.prototype.forEach.call(nav.querySelectorAll('a'), function (a) {
      var on = a.getAttribute('data-route') === name;
      a.classList.toggle('is-active', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
      if (on) active = a;
    });
    if (active) {
      pill.style.width = active.offsetWidth + 'px';
      pill.style.transform = 'translateX(' + active.offsetLeft + 'px)';
      pill.style.opacity = '1';
    } else pill.style.opacity = '0';
  }
  var baseTitle = document.title;
  var lastView = '';
  function track() {
    if (typeof window.gtag !== 'function' || location.pathname === lastView) return;
    lastView = location.pathname;
    window.gtag('event', 'page_view', { page_title: document.title, page_location: location.href, page_path: location.pathname });
  }
  function setTitle(route, view) {
    /* the pull cord hides on Home, and drops in with a swing when you leave it */
    var wasHome = root.classList.contains('on-home');
    root.classList.toggle('on-home', route.name === 'home');
    if (pull && wasHome && route.name !== 'home' && !reduce) {
      pull.classList.remove('is-arriving'); void pull.offsetWidth; pull.classList.add('is-arriving');
      window.setTimeout(function () { pull.classList.remove('is-arriving'); }, 1400);
    }
    try { window.dispatchEvent(new Event('shell-route')); } catch (e) {}
    if (route.name === 'work') document.title = 'Work \u00b7 Muidemakz';
    else if (route.name === 'about') document.title = 'About \u00b7 Muidemakz';
    else if (route.name === 'case' && view) loaded(view).then(function () { try { var t = view.querySelector('iframe').contentDocument.title; if (t && cur === 'case') document.title = t; } catch (e) {} track(); });
    else document.title = baseTitle;
    if (route.name !== 'case') track();
  }
  window.addEventListener('resize', function () { updateNav(cur === 'work' || cur === 'about' ? cur : ''); });

  /* ---------- Pages inside the container ---------- */
  function spinner() {
    var s = document.createElement('div');
    s.className = 'stage-loading';
    s.setAttribute('role', 'status');
    s.setAttribute('aria-label', 'Loading');
    s.innerHTML = '<div class="sk" aria-hidden="true"><span class="sk-eyebrow"></span><span class="sk-title"></span><span class="sk-title sk-title--short"></span><span class="sk-text"></span><span class="sk-text sk-text--mid"></span><span class="sk-text sk-text--short"></span><span class="sk-block"></span></div>';
    return s;
  }
  function makeFrameView(name, src) {
    var v = document.createElement('div');
    v.className = 'view';
    v.setAttribute('data-view', name);
    v.hidden = true;
    var f = document.createElement('iframe');
    f.title = name === 'case' ? 'Case study' : name === 'work' ? 'All work' : 'About';
    var sp = spinner();
    v.appendChild(f);
    v.appendChild(sp);
    /* Shown as soon as the page reports its HTML is in (embed-ready), or on load as a fallback */
    var err = null, slowT = 0;
    f._ready = function () {
      if (f.classList.contains('is-ready')) return;
      window.clearTimeout(slowT);
      if (err) { err.remove(); err = null; }
      f.classList.add('is-ready'); sp.hidden = true; f.dispatchEvent(new Event('embed-ready'));
    };
    /* Error state: the page did not arrive (offline, server error) or is taking far too long */
    f._fail = function (kind) {
      if (f.classList.contains('is-ready') && kind !== 'broken') return;
      window.clearTimeout(slowT);
      f.classList.remove('is-ready');
      sp.hidden = true;
      if (err) err.remove();
      err = loadError(kind, src, function retry() {
        err.remove(); err = null; sp.hidden = false;
        f.src = src + (src.indexOf('?') > -1 ? '&' : '?') + 'r=' + Date.now();
        arm();
      });
      v.appendChild(err);
      f.dispatchEvent(new Event('embed-ready')); /* let the transition finish so the message can show */
    };
    function arm() { slowT = window.setTimeout(function () { f._fail(navigator.onLine === false ? 'offline' : 'slow'); }, 12000); }
    f.addEventListener('load', function () {
      var ok = false;
      try { var d = f.contentDocument; ok = !!(d && d.body && d.body.childElementCount); } catch (e) { ok = false; }
      if (ok) f._ready(); else f._fail(navigator.onLine === false ? 'offline' : 'broken');
    });
    arm();
    f.src = src;
    return v;
  }
  function loadError(kind, src, retry) {
    var box = document.createElement('div');
    box.className = 'stage-error';
    box.setAttribute('role', 'alert');
    var title = kind === 'offline' ? 'You seem to be offline.' : kind === 'slow' ? 'This page is taking too long.' : 'This page didn\u2019t load.';
    var text = kind === 'offline' ? 'Check your connection, then try again.' : 'It might be a slow connection or a hiccup on my side. Try again, or reload the page.';
    box.innerHTML =
      '<div class="se-scene" aria-hidden="true"><span class="se-plug se-plug--a"></span><span class="se-cord se-cord--a"></span><span class="se-plug se-plug--b"></span><span class="se-cord se-cord--b"></span><span class="se-spark"></span></div>' +
      '<b class="se-title"></b><p class="se-text"></p>' +
      '<div class="se-actions"><button type="button" class="se-btn se-btn--primary">Try again</button><button type="button" class="se-btn se-btn--reload">Reload the page</button></div>';
    box.querySelector('.se-title').textContent = title;
    box.querySelector('.se-text').textContent = text;
    box.querySelector('.se-btn--primary').addEventListener('click', retry);
    box.querySelector('.se-btn--reload').addEventListener('click', function () { location.reload(); });
    return box;
  }
  function ensureView(route) {
    if (route.name === 'case') { var c = makeFrameView('case', embedUrl(route.href)); body.appendChild(c); return c; }
    if (!views[route.name]) { views[route.name] = makeFrameView(route.name, embedUrl(FILES[route.name])); body.appendChild(views[route.name]); }
    return views[route.name];
  }
  function viewEl(name) { return name === 'case' ? caseView : views[name]; }
  function loaded(v) {
    var f = v.querySelector('iframe');
    if (!f) return Promise.resolve();
    return new Promise(function (res) {
      if (f.classList.contains('is-ready')) return res();
      f.addEventListener('embed-ready', function () { res(); }, { once: true });
      window.setTimeout(res, 7000);
    });
  }

  /* ---------- Open: the container grows from the right over the rail ---------- */
  async function expand(route, instant) {
    busy = true;
    var S = stage.getBoundingClientRect();
    var E = main.getBoundingClientRect();
    var tv = ensureView(route);
    if (route.name === 'case') caseView = tv;
    tv.hidden = false;
    tv.style.zIndex = 4;
    tv.classList.add('is-pending');
    homeTop = views.home.querySelector('.tiles').scrollTop;
    views.home.classList.add('is-leaving');
    stage.classList.add('is-moving');
    setRect(S);
    loading.hidden = false;
    updateNav(route.name === 'case' ? '' : route.name);
    if (route.name === 'case') returnTo = 'home';
    if (!reduce && !instant) {
      var a = stage.animate([px(S), px(E)], { duration: 700, easing: 'cubic-bezier(.7,0,.2,1)', fill: 'forwards' });
      await a.finished;
      stage.classList.remove('is-moving');
      stage.classList.add('is-expanded');
      clearRect();
      a.cancel();
    } else {
      stage.classList.remove('is-moving');
      stage.classList.add('is-expanded');
      clearRect();
    }
    await Promise.all([loaded(tv), wait(instant ? 0 : 140)]);
    loading.hidden = true;
    tv.classList.remove('is-pending');
    views.home.hidden = true;
    views.home.classList.remove('is-leaving');
    tv.style.zIndex = '';
    cur = route.name;
    setTitle(route, tv);
    expanded = true;
    busy = false;
    flush();
  }

  /* ---------- Close: Home folds the container back to the right ---------- */
  async function collapse() {
    busy = true;
    var E = main.getBoundingClientRect();
    var T = slot.getBoundingClientRect();
    var fv = viewEl(cur);
    var home = views.home;
    home.hidden = false;
    home.style.zIndex = 1;
    home.querySelector('.tiles').scrollTop = homeTop;
    home.classList.add('is-pending');
    stage.classList.remove('is-expanded');
    stage.classList.add('is-moving');
    setRect(E);
    updateNav('');
    window.requestAnimationFrame(function () { home.classList.remove('is-pending'); if (fv) fv.classList.add('is-pending'); });
    if (!reduce) {
      var a = stage.animate([px(E), px(T)], { duration: 660, easing: 'cubic-bezier(.3,0,.2,1)', fill: 'forwards' });
      await a.finished;
      a.cancel();
    }
    stage.classList.remove('is-moving');
    clearRect();
    if (fv) {
      fv.hidden = true;
      fv.classList.remove('is-pending');
      fv.style.zIndex = '';
      if (cur === 'case') { if (fv.parentNode) fv.parentNode.removeChild(fv); caseView = null; }
    }
    home.style.zIndex = '';
    cur = 'home';
    setTitle({ name: 'home' });
    expanded = false;
    busy = false;
    flush();
  }

  /* ---------- While open: Work / About / a case study wipe over each other ---------- */
  async function swap(route) {
    var from = cur;
    var fv = viewEl(from);
    busy = true;
    var tv = ensureView(route);
    if (route.name === 'case') { if (from !== 'case') returnTo = from; caseView = tv; }
    tv.hidden = false;
    tv.style.zIndex = 3;
    fv.style.zIndex = 2;
    updateNav(route.name === 'case' ? '' : route.name);
    if (!reduce) {
      var down = ORDER[route.name] > ORDER[from];
      var a = tv.animate([
        { clipPath: down ? 'inset(100% 0 0 0 round 30px)' : 'inset(0 0 100% 0 round 30px)', transform: down ? 'translateY(44px)' : 'translateY(-44px)' },
        { clipPath: 'inset(0 0 0 0 round 0px)', transform: 'none' }
      ], { duration: 640, easing: 'cubic-bezier(.7,0,.2,1)' });
      var b = fv.animate([
        { transform: 'none', opacity: 1, filter: 'none' },
        { transform: 'scale(.94)', opacity: .3, filter: 'blur(3px)' }
      ], { duration: 640, easing: 'cubic-bezier(.7,0,.2,1)', fill: 'forwards' });
      await a.finished;
      b.cancel();
    }
    fv.hidden = true;
    fv.style.zIndex = '';
    tv.style.zIndex = '';
    if (from === 'case' && fv.parentNode) fv.parentNode.removeChild(fv);
    cur = route.name;
    setTitle(route, tv);
    busy = false;
    flush();
  }

  /* ---------- Router ---------- */
  function flush() { if (pending) { var p = pending; pending = null; go(p.route, p.opts); } }
  function push(route) { depth++; try { history.pushState({ i: depth }, '', pathFor(route)); } catch (e) {} }
  async function go(route, opts) {
    opts = opts || {};
    if (busy) { pending = { route: route, opts: opts }; return; }
    if (route.name === 'home') {
      if (!expanded) return;
      if (opts.push) push(route);
      return collapse();
    }
    if (expanded && route.name === cur && route.name !== 'case') return;
    if (opts.push) push(route);
    if (!expanded) return expand(route, opts.instant);
    return swap(route);
  }
  function back() {
    if (cur !== 'case') return;
    if (depth > 0) history.back();
    else go({ name: returnTo }, {});
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a');
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
    if (a.classList.contains('tile') || a.hasAttribute('data-open')) {
      e.preventDefault();
      go(routeFromHref(a.getAttribute('href')), { push: true });
    } else if (a.classList.contains('brand') || a.classList.contains('rail-home')) {
      e.preventDefault();
      go({ name: 'home' }, { push: true });
    } else if (a.closest('.shell-nav')) {
      e.preventDefault();
      go({ name: a.getAttribute('data-route') }, { push: true });
    }
  });
  window.addEventListener('popstate', function (e) {
    depth = (e.state && e.state.i) || 0;
    go(parseLocation(), {});
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') back(); });

  /* Messages from the pages inside the container */
  function frameOf(w) {
    var list = [];
    Object.keys(views).forEach(function (k) { var f = views[k].querySelector('iframe'); if (f) list.push(f); });
    if (caseView) list.push(caseView.querySelector('iframe'));
    for (var i = 0; i < list.length; i++) if (list[i].contentWindow === w) return list[i];
    return null;
  }
  window.addEventListener('message', function (e) {
    if (e.origin !== location.origin) return;
    var d = e.data || {};
    if (d.t === 'embed-ready') { var rf = frameOf(e.source); if (rf && rf._ready) rf._ready(); }
    else if (d.t === 'board-pointer') {
      var f = frameOf(e.source);
      if (f && window.BOARD && window.BOARD.pointer) { var r = f.getBoundingClientRect(); window.BOARD.pointer(r.left + d.x, r.top + d.y, d.h); }
    } else if (d.t === 'board-key' && d.k === '/') { if (window.BOARD && window.BOARD.openChat) window.BOARD.openChat(); }
    else if (d.t === 'key' && d.k === 'Escape') back();
    else if (d.t === 'board-back') { if (cur === 'case') back(); else go({ name: 'home' }, { push: true }); }
    else if (d.t === 'open') go(routeFromHref(d.href), { push: true });
  });

  /* ---------- Theme: the 3D switch ---------- */
  function setTheme(t) {
    if (t === 'light') root.setAttribute('data-theme', 'light'); else root.removeAttribute('data-theme');
    try { localStorage.setItem('ui-theme', t); } catch (e) {}
    sw.setAttribute('aria-checked', t === 'dark' ? 'true' : 'false');
    sw.setAttribute('aria-label', t === 'dark' ? 'Dark mode on. Switch to light' : 'Light mode on. Switch to dark');
    if (pull) pull.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    if (window.BOARD && window.BOARD.refreshTheme) window.BOARD.refreshTheme();
  }
  var flipT = 0;
  sw.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    if (reduce) return setTheme(next);
    sw.classList.remove('is-flipping', 'to-dark', 'to-light'); void sw.offsetWidth; sw.classList.add('is-flipping', 'to-' + next);
    window.clearTimeout(flipT);
    window.setTimeout(function () { setTheme(next); }, 170);
    flipT = window.setTimeout(function () { sw.classList.remove('is-flipping', 'to-dark', 'to-light'); }, 760);
  });
  setTheme(root.getAttribute('data-theme') === 'light' ? 'light' : 'dark');

  /* ---------- Theme: the pull cord hanging from the top of the screen ----------
     Drag it down and let go (or click, Enter, Space): it stretches, flips the theme and springs back. */
  if (pull) (function () {
    var MAX = 46, NEED = 16, startY = 0, dragging = false, moved = 0, dragged = false;
    function flip() { setTheme(root.getAttribute('data-theme') === 'light' ? 'dark' : 'light'); }
    function release(pulled) {
      pull.style.removeProperty('--pull');
      pull.classList.remove('is-dragging');
      if (!pulled) return;
      if (reduce) return flip();
      pull.classList.remove('is-snapping'); void pull.offsetWidth; pull.classList.add('is-snapping');
      window.setTimeout(flip, 90);
      window.setTimeout(function () { pull.classList.remove('is-snapping'); }, 900);
    }
    pull.addEventListener('pointerdown', function (e) {
      if (e.button !== 0) return;
      dragging = true; dragged = false; moved = 0; startY = e.clientY;
      try { pull.setPointerCapture(e.pointerId); } catch (x) {}
      pull.classList.add('is-dragging');
    });
    pull.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      moved = Math.max(0, Math.min(MAX, e.clientY - startY));
      if (moved > 3) dragged = true;
      pull.style.setProperty('--pull', moved + 'px');
    });
    function end() { if (!dragging) return; dragging = false; if (dragged) release(moved >= NEED); else pull.classList.remove('is-dragging'); }
    pull.addEventListener('pointerup', end);
    pull.addEventListener('pointercancel', function () { dragging = false; release(false); });
    pull.addEventListener('click', function (e) { if (dragged) { dragged = false; e.preventDefault(); return; } release(true); });
  })();

  /* ---------- Start ---------- */
  stage.addEventListener('animationend', function (e) { if (e.target === stage) stage.style.animation = 'none'; }, { once: true });
  var first = parseLocation();
  try { history.replaceState({ i: 0 }, '', location.protocol === 'file:' ? location.href : pathFor(first)); } catch (e) {}
  updateNav(first.name === 'work' || first.name === 'about' ? first.name : '');
  if (first.name !== 'home') go(first, { instant: true }); else track();
  var conn = navigator.connection || {};
  if (!conn.saveData && window.matchMedia('(min-width: 861px)').matches) {
    window.addEventListener('load', function () { window.setTimeout(function () { ensureView({ name: 'work' }); ensureView({ name: 'about' }); }, 1800); });
  }
})();

/* Cycling role word, from the original landing page.
   It always sits on one line: a long word ("Design Manager") is scaled down to the rail's width,
   so the title keeps the same height and nothing below it moves. */
(function () {
  var el = document.getElementById('roleCycle');
  if (!el) return;
  var h1 = el.closest('h1');
  function fit() {
    el.style.fontSize = '';
    var w = h1.clientWidth, n = el.offsetWidth;
    if (w > 0 && n > w) el.style.fontSize = (Math.floor(w / n * 97) / 100) + 'em';
  }
  fit();
  window.addEventListener('resize', fit);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var roles = ['Designer', 'Lead', 'Design Manager', 'Engineer'], tints = ['#ff5a1f', '#ff7a9c', '#b3a6ff', '#8fd3f4'], i = 0;
  setInterval(function () {
    if (document.hidden) return;
    el.classList.add('is-swapping');
    setTimeout(function () { i = (i + 1) % roles.length; el.textContent = roles[i]; el.style.setProperty('--role', tints[i]); fit(); el.classList.remove('is-swapping'); }, 250);
  }, 2400);
})();
