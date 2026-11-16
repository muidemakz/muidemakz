/* All Work as a board (my-work.html).
   Builds frames, cards, sticky notes and the sticker tray from PROJECTS in js/data.js,
   so the preview always matches the real project list. Cards and stickers can be dragged
   with a mouse; on touch the board is a calm single column. Nothing here is saved or sent.
   On desktop the Board view is an ARTBOARD: the finished work sits on one wide canvas you can drag
   around and zoom (Ctrl + scroll, pinch, or the buttons). "Still to come" stays a normal grid below it,
   and Grid view and phones show everything as a plain list. */
(function () {
  if (typeof PROJECTS === 'undefined') return;
  var pane = document.getElementById('work');
  var framesEl = document.getElementById('wbFrames');
  var layer = document.getElementById('wbLayer');
  var board = document.getElementById('wbBoard');
  if (!pane || !framesEl) return;

  var fine = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  var STATUS = {
    'shipped': { label: 'Shipped', c: 'var(--c-shipped)' },
    'building': { label: 'Building', c: 'var(--c-building)' },
    'concept': { label: 'Concept', c: 'var(--c-concept)' },
    'coming-soon': { label: 'Soon', c: 'var(--c-soon)' }
  };
  var NOTE_COLORS = ['#f2c94c', '#f48fb1', '#8fd3f4', '#a8e6a1', '#ffb74d'];
  var PIN_TAPE = ['pin', 'tape', 'pin', 'pin', 'tape'];

  /* Frames: each project goes in the frame that matches its own status */
  var FRAMES = [
    { id: 'made', title: 'Shipped and in progress', note: 'the grown-up stuff', test: function (p) { return p.status === 'shipped' || p.status === 'building'; } },
    { id: 'play', title: 'Concepts and explorations', note: 'my playground', test: function (p) { return p.status === 'concept'; } },
    { id: 'soon', title: 'Still to come', note: 'case studies loading…', test: function (p) { return p.status === 'coming-soon' || !p.link; } }
  ];

  function cardHtml(p, i) {
    var st = STATUS[p.status] || STATUS.concept;
    var r = (((i * 37) % 9) - 4) * 0.55;
    var tr = (((i * 53) % 7) - 3) * 2;
    var cats = (p.categories || []).join(' · ');
    var text = (p.name + ' ' + (p.caption || '') + ' ' + cats + ' ' + p.year + ' ' + (p.brand || '')).toLowerCase();
    var attrs = ' href="' + esc(p.link) + '" draggable="false" data-cats="' + esc((p.categories || []).join('|')) + '" data-text="' + esc(text) + '"';

    if (!p.image) {
      var nc = NOTE_COLORS[i % NOTE_COLORS.length];
      var nattrs = ' data-cats="' + esc((p.categories || []).join('|')) + '" data-text="' + esc(text) + '" data-name="' + esc(p.name) + '" data-meta="' + esc(p.year + (cats ? ' \u00b7 ' + cats : '')) + '"';
      return '<div class="note" tabindex="0" role="button" aria-label="' + esc(p.name) + ', case study coming soon. Press Enter for details."' + nattrs + ' style="--r:' + r.toFixed(2) + 'deg;--nc:' + nc + '">' +
        '<i class="tape" style="--tr:' + tr + 'deg" aria-hidden="true"></i>' +
        '<span class="note-brand">' + esc(p.brand || p.name) + '</span>' +
        '<span class="note-name">' + esc(p.name) + '</span>' +
        '<span class="note-foot"><span>' + esc(p.year) + '</span><span class="note-soon">case study soon</span></span></div>';
    }
    var deco = PIN_TAPE[i % PIN_TAPE.length] === 'pin'
      ? '<i class="pin" aria-hidden="true"></i>'
      : '<i class="tape" style="--tr:' + tr + 'deg" aria-hidden="true"></i>';
    var video = p.motion
      ? '<video muted loop playsinline preload="none" data-src="' + esc(p.motion) + '" poster="' + esc(p.motionPoster || p.image) + '" aria-hidden="true"></video>'
      : '';
    return '<a class="card"' + attrs + ' style="--r:' + r.toFixed(2) + 'deg;--pc:' + st.c + '">' + deco +
      '<span class="card-media"><img src="' + esc(p.image) + '" alt="" loading="lazy" draggable="false">' + video +
      '<span class="stamp">' + esc(st.label) + '</span></span>' +
      '<span class="card-body"><b class="card-name">' + esc(p.name) + '</b>' +
      '<span class="card-cap">' + esc(p.caption || '') + '</span>' +
      '<span class="card-meta">' + esc(p.year) + (cats ? ' · ' + esc(cats) : '') + '</span></span></a>';
  }

  /* ---------- Stickers (die-cut look: white edge behind the colour) ---------- */
  function die(d, fill, extra) {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + d + '" fill="#fff" stroke="#fff" stroke-width="3.2" stroke-linejoin="round"/>' +
      '<path d="' + d + '" fill="' + fill + '"/>' + (extra || '') + '</svg>';
  }
  var STAR = 'M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3 6.1 20.6l1.3-6.6L2.5 9.4l6.6-.8z';
  var HEART = 'M12 20.5S3.6 15.6 3.6 9.6C3.6 6.9 5.6 5 8 5c1.8 0 3.2 1 4 2.4C12.8 6 14.2 5 16 5c2.4 0 4.4 1.9 4.4 4.6 0 6-8.4 10.9-8.4 10.9z';
  var BOLT = 'M13.5 2L4.5 13.5H10l-1 8.5 9-11.5h-5.5z';
  var BURST = 'M12 1.5l2.2 3.6 3.9-1.4.7 4.1 4.1.7-1.4 3.9 3.6 2.2-3.6 2.2 1.4 3.9-4.1.7-.7 4.1-3.9-1.4L12 22.5l-2.2-3.6-3.9 1.4-.7-4.1-4.1-.7 1.4-3.9L-.1 12l3.6-2.2-1.4-3.9 4.1-.7.7-4.1 3.9 1.4z';
  var ARROW = 'M5.5 3.5v15.5l4.4-4 3 6.3 2.6-1.2-3-6.2h5.9z';
  var STICKERS = {
    star: die(STAR, '#ffd54a'),
    heart: die(HEART, '#ff6b8b'),
    bolt: die(BOLT, '#a99bff'),
    wow: die(BURST, '#ff8a65', '<text x="12" y="14.6" text-anchor="middle" font-family="Caveat, cursive" font-weight="700" font-size="7.4" fill="#2b1206">wow!</text>'),
    smile: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9.6" fill="#fff" stroke="#fff" stroke-width="3"/><circle cx="12" cy="12" r="9.6" fill="#ffd54a"/><circle cx="8.8" cy="10" r="1.3" fill="#2b2208"/><circle cx="15.2" cy="10" r="1.3" fill="#2b2208"/><path d="M7.6 14c1.2 2.3 7.6 2.3 8.8 0" fill="none" stroke="#2b2208" stroke-width="1.5" stroke-linecap="round"/></svg>',
    eyes: '<svg viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="8" cy="12" rx="5.2" ry="6.4" fill="#fff" stroke="#fff" stroke-width="3"/><ellipse cx="16.4" cy="12" rx="5.2" ry="6.4" fill="#fff" stroke="#fff" stroke-width="3"/><ellipse cx="8" cy="12" rx="5.2" ry="6.4" fill="#fff"/><ellipse cx="16.4" cy="12" rx="5.2" ry="6.4" fill="#fff"/><circle cx="9.4" cy="13" r="2.4" fill="#222"/><circle cx="17.8" cy="13" r="2.4" fill="#222"/></svg>',
    flower: '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="#fff" stroke="#fff" stroke-width="3"><circle cx="12" cy="5.4" r="3.6"/><circle cx="18.4" cy="10" r="3.6"/><circle cx="16" cy="17.6" r="3.6"/><circle cx="8" cy="17.6" r="3.6"/><circle cx="5.6" cy="10" r="3.6"/></g><g fill="#f48fb1"><circle cx="12" cy="5.4" r="3.6"/><circle cx="18.4" cy="10" r="3.6"/><circle cx="16" cy="17.6" r="3.6"/><circle cx="8" cy="17.6" r="3.6"/><circle cx="5.6" cy="10" r="3.6"/></g><circle cx="12" cy="12" r="3.2" fill="#ffd54a"/></svg>',
    pointer: die(ARROW, '#ff5a1f')
  };
  var TRAY = ['star', 'heart', 'smile', 'bolt', 'wow', 'eyes', 'flower', 'pointer'];

  /* Stickers already stuck onto each frame (they can be dragged off too) */
  var DECOR = {
    made: [{ t: 'star', top: -26, left: 300, r: 14, size: 58 }, { t: 'heart', bottom: -20, right: 22, r: -12, size: 52 }],
    play: [{ t: 'bolt', top: -22, left: 150, r: 16, size: 54 }, { t: 'flower', bottom: -24, right: 46, r: 10, size: 60 }, { t: 'smile', bottom: -18, left: 28, r: -8, size: 50 }],
    soon: [{ t: 'eyes', top: -20, left: 60, r: -6, size: 58 }, { t: 'wow', bottom: -24, right: 30, r: 10, size: 72 }]
  };

  /* ---------- Build the board ---------- */
  var used = [];
  var html = '';
  FRAMES.forEach(function (f) {
    var items = [];
    PROJECTS.forEach(function (p, i) { if (f.test(p) && used.indexOf(i) < 0) { used.push(i); items.push([p, i]); } });
    if (!items.length) return;
    html += '<section class="frame" data-frame="' + f.id + '" aria-label="' + esc(f.title) + '">' +
      '<div class="frame-head">' + esc(f.title) + ' <em data-count>' + items.length + '</em></div>' +
      '<div class="frame-note" aria-hidden="true">' + esc(f.note) +
      '<svg viewBox="0 0 38 34" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4c12 0 22 6 26 20"/><path d="M21 21l8 5 3-9"/></svg></div>' +
      '<div class="grid">' + items.map(function (it) { return cardHtml(it[0], it[1]); }).join('') + '</div></section>';
  });
  framesEl.innerHTML = html;

  /* ---------- Artboard: the finished work on one canvas that pans and zooms ---------- */
  var art = document.createElement('div');
  art.className = 'ab-viewport';
  art.id = 'wbArt';
  art.tabIndex = 0;
  art.setAttribute('role', 'group');
  art.setAttribute('aria-label', 'Work artboard. Drag to move around, hold Control and scroll to zoom. Arrow keys move it, plus and minus zoom, zero fits everything.');
  var world = document.createElement('div');
  world.className = 'ab-world';
  art.appendChild(world);
  Array.prototype.forEach.call(framesEl.querySelectorAll('.frame'), function (fr) {
    var n = fr.querySelectorAll('.card, .note').length;
    fr.style.setProperty('--cols', fr.dataset.frame === 'soon' ? Math.min(6, Math.max(3, Math.ceil(n / 3))) : Math.max(2, Math.ceil(n / 2)));
    world.appendChild(fr);
  });
  var hasArt = world.children.length > 0;
  if (hasArt) framesEl.insertBefore(art, framesEl.firstChild);
  var ctrl = document.createElement('div');
  ctrl.className = 'ab-ctrl';
  ctrl.setAttribute('role', 'group');
  ctrl.setAttribute('aria-label', 'Zoom');
  ctrl.innerHTML = '<button type="button" data-z="out" aria-label="Zoom out">&minus;</button><output>100%</output>' +
    '<button type="button" data-z="in" aria-label="Zoom in">+</button><button type="button" data-z="fit" class="ab-fit">Fit all</button>';
  art.appendChild(ctrl);
  var pct = ctrl.querySelector('output');
  var hint = document.createElement('p');
  hint.className = 'ab-hint';
  hint.textContent = 'Drag or scroll to move \u00b7 Ctrl + scroll to zoom';
  art.appendChild(hint);
  function hideHint() { hint.classList.add('is-gone'); }

  var Z = 1, TX = 0, TY = 0, artOn = false, touched = false, panEndAt = 0, opening = false;
  var wideMq = window.matchMedia('(min-width: 861px)');
  var barEl = document.querySelector('.wb-bar'), paneInner = pane.querySelector('.pane-inner'), trayEl = document.getElementById('wbTray');
  function limits() {
    var fit = Math.min(art.clientWidth / world.offsetWidth, art.clientHeight / world.offsetHeight);
    return { min: Math.max(0.15, Math.min(fit, 0.6) * 0.8), max: 1.8 };
  }
  /* Writes the current position to the page. The world can never be dragged out of sight. */
  function apply(anim) {
    hideTag();
    hidePeek();
    var vw = art.clientWidth, vh = art.clientHeight, w = world.offsetWidth * Z, h = world.offsetHeight * Z, m = Math.round(Math.min(vw, vh) * 0.3);
    TX = w <= vw ? (vw - w) / 2 : clamp(TX, vw - w - m, m);
    TY = h <= vh ? (vh - h) / 2 : clamp(TY, vh - h - m, m);
    art.classList.toggle('is-anim', !!anim && !reduce);
    world.style.transform = 'translate(' + TX.toFixed(1) + 'px,' + TY.toFixed(1) + 'px) scale(' + Z.toFixed(4) + ')';
    art.style.setProperty('--gx', TX.toFixed(1) + 'px');
    art.style.setProperty('--gy', TY.toFixed(1) + 'px');
    art.style.setProperty('--gs', (26 * Z).toFixed(2) + 'px');
    pct.textContent = Math.round(Z * 100) + '%';
  }
  function zoomAt(nz, cx, cy, anim) {
    var l = limits();
    nz = clamp(nz, l.min, l.max);
    TX = cx - (cx - TX) * nz / Z;
    TY = cy - (cy - TY) * nz / Z;
    Z = nz;
    apply(anim);
  }
  /* Opening view: as tall as the window allows so cards are readable, first cluster on the left,
     the next one peeking in from the right */
  function home(anim) {
    Z = clamp(art.clientHeight / (worldRect(world.firstElementChild).b + 120), 0.5, 1);
    TX = 0; TY = 0;
    apply(anim);
  }
  function fitRect(r, anim, maxZ, pad) {
    var vw = art.clientWidth, vh = art.clientHeight, l = limits();
    pad = pad == null ? 56 : pad;
    Z = clamp(Math.min((vw - pad * 2) / (r.r - r.l), (vh - pad * 2) / (r.b - r.t), maxZ || 1), l.min, l.max);
    TX = vw / 2 - (r.l + r.r) / 2 * Z;
    TY = vh / 2 - (r.t + r.b) / 2 * Z;
    apply(anim);
  }
  function fitAll(anim) { fitRect({ l: 0, t: 0, r: world.offsetWidth, b: world.offsetHeight }, anim, 1, 28); }
  /* Position of a card inside the world, before any zoom */
  function worldRect(el) {
    var x = 0, y = 0, n = el;
    while (n && n !== world) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; }
    return { l: x, t: y, r: x + el.offsetWidth, b: y + el.offsetHeight };
  }
  function union(list) {
    var u = null;
    Array.prototype.forEach.call(list, function (el) {
      var r = worldRect(el);
      u = u ? { l: Math.min(u.l, r.l), t: Math.min(u.t, r.t), r: Math.max(u.r, r.r), b: Math.max(u.b, r.b) } : r;
    });
    return u;
  }
  function sizeArt() {
    if (!artOn) return;
    var ph = pane.clientHeight;
    if (ph < 80) return; /* not on screen yet */
    art.style.height = Math.max(420, ph - barEl.offsetHeight - 30) + 'px';
    if (!touched) home(false); else apply(false);
  }
  function artMode() {
    var on = hasArt && fine && wideMq.matches && !pane.classList.contains('is-grid');
    if (on === artOn) { sizeArt(); return; }
    artOn = on;
    pane.classList.toggle('is-art', on);
    if (on) { art.appendChild(trayEl); touched = false; sizeArt(); }
    else { paneInner.appendChild(trayEl); world.style.transform = ''; art.style.height = ''; }
    applyFilter();
  }

  if (hasArt) {
    /* Drag anywhere on the artboard (cards included) to move it */
    art.addEventListener('dragstart', function (e) { e.preventDefault(); });
    art.addEventListener('pointerdown', function (e) {
      if (!artOn || e.button !== 0 || (e.target.closest && e.target.closest('.sticker, .wb-tray, .ab-ctrl, .st-ask'))) return;
      var sx = e.clientX, sy = e.clientY, ox = TX, oy = TY, pan = false;
      function move(ev) {
        if (ev.buttons === 0) { up(); return; } /* the button was released somewhere we could not see */
        var dx = ev.clientX - sx, dy = ev.clientY - sy;
        if (!pan && Math.abs(dx) + Math.abs(dy) < 5) return;
        if (!pan) { pan = true; touched = true; hideHint(); art.classList.add('is-panning'); }
        TX = ox + dx; TY = oy + dy;
        apply(false);
      }
      function up() {
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
        window.removeEventListener('pointercancel', up);
        window.removeEventListener('blur', up);
        if (pan) { art.classList.remove('is-panning'); panEndAt = performance.now(); pan = false; }
      }
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up);
      window.addEventListener('pointercancel', up);
      window.addEventListener('blur', up);
    });
    /* Ctrl + scroll (and trackpad pinch) zooms at the pointer; a sideways swipe moves left and right.
       A plain up/down scroll is left alone so the page still scrolls. */
    art.addEventListener('wheel', function (e) {
      if (!artOn) return;
      var r = art.getBoundingClientRect();
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        touched = true; hideHint();
        zoomAt(Z * Math.exp(-e.deltaY * (e.deltaMode ? 0.05 : 0.0022) * (Math.abs(e.deltaY) < 40 ? 4 : 1)), e.clientX - r.left, e.clientY - r.top, false);
      } else {
        e.preventDefault();
        touched = true; hideHint();
        var k = e.deltaMode ? 30 : 1;
        if (e.shiftKey) TX -= (e.deltaY || e.deltaX) * k;
        else { TX -= e.deltaX * k; TY -= e.deltaY * k; }
        apply(false);
      }
    }, { passive: false });
    ctrl.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-z]');
      if (!b) return;
      touched = true; hideHint();
      var cx = art.clientWidth / 2, cy = art.clientHeight / 2;
      if (b.dataset.z === 'in') zoomAt(Z * 1.25, cx, cy, true);
      else if (b.dataset.z === 'out') zoomAt(Z / 1.25, cx, cy, true);
      else fitAll(true);
    });
    art.addEventListener('keydown', function (e) {
      if (!artOn || (e.target.closest && e.target.closest('.wb-tray, .ab-ctrl, .st-ask'))) return;
      var k = e.key, cx = art.clientWidth / 2, cy = art.clientHeight / 2, step = 110;
      if (k === 'ArrowLeft') TX += step; else if (k === 'ArrowRight') TX -= step;
      else if (k === 'ArrowUp') TY += step; else if (k === 'ArrowDown') TY -= step;
      else if (k === '+' || k === '=') { e.preventDefault(); touched = true; return zoomAt(Z * 1.25, cx, cy, true); }
      else if (k === '-' || k === '_') { e.preventDefault(); touched = true; return zoomAt(Z / 1.25, cx, cy, true); }
      else if (k === '0') { e.preventDefault(); touched = true; return fitAll(true); }
      else return;
      e.preventDefault();
      touched = true; hideHint();
      apply(true);
    });
    /* Tabbing to a card that is out of view brings it to the middle */
    art.addEventListener('scroll', function () { art.scrollLeft = 0; art.scrollTop = 0; });
    world.addEventListener('focusin', function (e) {
      if (!artOn) return;
      var c = e.target.closest && e.target.closest('.card, .note');
      if (!c) return;
      art.scrollLeft = 0; art.scrollTop = 0;
      var r = worldRect(c), vw = art.clientWidth, vh = art.clientHeight;
      var l = r.l * Z + TX, t = r.t * Z + TY, rr = r.r * Z + TX, b = r.b * Z + TY;
      if (l < 16 || t < 16 || rr > vw - 16 || b > vh - 16) {
        TX = vw / 2 - (r.l + r.r) / 2 * Z;
        TY = vh / 2 - (r.t + r.b) / 2 * Z;
        touched = true;
        apply(true);
      }
    });
    /* Clicking a card zooms into it, then opens the case study. A drag is never a click. */
    window.addEventListener('click', function (e) {
      if (!artOn || !e.target.closest || !e.target.closest('.ab-viewport')) return;
      if (performance.now() - panEndAt < 140) { e.preventDefault(); e.stopPropagation(); return; }
      var c = e.target.closest('.ab-world .card, .ab-world .note');
      if (!c || e.metaKey || e.ctrlKey || e.shiftKey || e.button || reduce) return;
      var href = c.getAttribute('href');
      if (!href) return;
      e.preventDefault(); e.stopPropagation();
      if (opening) return;
      opening = true;
      var prev = { Z: Z, TX: TX, TY: TY };
      fitRect(worldRect(c), true, 1.5, 44);
      window.setTimeout(function () {
        if (window.top !== window.self && /[?&]embed=1/.test(location.search)) window.parent.postMessage({ t: 'open', href: href }, location.origin);
        else location.href = href;
        /* put the board back where it was, ready for when the visitor returns */
        window.setTimeout(function () { Z = prev.Z; TX = prev.TX; TY = prev.TY; apply(false); opening = false; }, 1200);
      }, 380);
    }, true);
    window.setTimeout(hideHint, 9000);
  }

  function stickerEl(type, o) {
    var s = document.createElement('span');
    s.className = 'sticker' + (o.isNew ? ' is-new' : '');
    s.dataset.type = type;
    s.style.setProperty('--r', (o.r || 0) + 'deg');
    s.style.setProperty('--s', (o.size || 64) + 'px');
    if (o.top != null) s.style.top = o.top + 'px';
    if (o.bottom != null) s.style.bottom = o.bottom + 'px';
    if (o.left != null) s.style.left = o.left + 'px';
    if (o.right != null) s.style.right = o.right + 'px';
    s.innerHTML = STICKERS[type];
    return s;
  }

  Array.prototype.forEach.call(framesEl.querySelectorAll('.frame'), function (fr) {
    (DECOR[fr.dataset.frame] || []).forEach(function (d) {
      var own = stickerEl(d.t, { r: d.r, size: d.size, top: d.top, bottom: d.bottom, left: d.left, right: d.right });
      own.dataset.owner = '1';
      own.dataset.decor = fr.dataset.frame + '-' + (fr.querySelectorAll('[data-decor]').length);
      fr.appendChild(own);
    });
  });

  /* ---------- Coming soon: a hover card instead of an empty page ---------- */
  var peekEl = null, peekFor = null, peekTimer = 0;
  function hidePeek() { window.clearTimeout(peekTimer); if (peekEl) { peekEl.remove(); peekEl = null; peekFor = null; } }
  function placePeek() {
    if (!peekEl || !peekFor) return;
    var r = peekFor.getBoundingClientRect(), w = peekEl.offsetWidth, h = peekEl.offsetHeight, vw = window.innerWidth, vh = window.innerHeight;
    var x = r.right + 14, y = r.top + r.height / 2 - h / 2;
    if (x + w > vw - 12) x = r.left - 14 - w;           /* no room on the right: open on the left */
    if (x < 12) { x = clamp(r.left + r.width / 2 - w / 2, 12, vw - w - 12); y = r.bottom + 12; } /* or underneath */
    peekEl.style.left = Math.round(x) + 'px';
    peekEl.style.top = Math.round(clamp(y, 12, vh - h - 12)) + 'px';
  }
  function showPeek(n) {
    if (peekFor === n) { window.clearTimeout(peekTimer); return; }
    hidePeek();
    peekFor = n;
    peekEl = document.createElement('div');
    peekEl.className = 'peek';
    peekEl.setAttribute('role', 'dialog');
    peekEl.setAttribute('aria-label', n.dataset.name + ', coming soon');
    peekEl.style.setProperty('--nc', n.style.getPropertyValue('--nc'));
    peekEl.innerHTML =
      '<div class="peek-badge"><i aria-hidden="true"></i>Coming soon</div>' +
      '<b class="peek-name"></b><span class="peek-meta"></span>' +
      '<div class="peek-bar" aria-hidden="true"><span></span></div>' +
      '<p class="peek-text">This case study is still being written up, so there is no page for it yet. If it sounds relevant, I am happy to walk you through it.</p>' +
      '<a class="peek-cta" href="">Ask me about it &rarr;</a>';
    peekEl.querySelector('.peek-name').textContent = n.dataset.name;
    peekEl.querySelector('.peek-meta').textContent = n.dataset.meta;
    peekEl.querySelector('.peek-cta').href = 'mailto:muidemakz@gmail.com?subject=' + encodeURIComponent('About ' + n.dataset.name);
    peekEl.addEventListener('mouseenter', function () { window.clearTimeout(peekTimer); });
    peekEl.addEventListener('mouseleave', function () { peekTimer = window.setTimeout(hidePeek, 160); });
    peekEl.addEventListener('keydown', function (e) { if (e.key === 'Escape') { var f = peekFor; hidePeek(); if (f) f.focus(); } });
    document.body.appendChild(peekEl);
    placePeek();
  }
  Array.prototype.forEach.call(framesEl.querySelectorAll('.note'), function (n) {
    n.addEventListener('mouseenter', function () { if (!n.classList.contains('is-dim')) showPeek(n); });
    n.addEventListener('mouseleave', function () { peekTimer = window.setTimeout(hidePeek, 160); });
    n.addEventListener('focus', function () { showPeek(n); });
    n.addEventListener('blur', function (e) { if (!(peekEl && e.relatedTarget && peekEl.contains(e.relatedTarget))) peekTimer = window.setTimeout(hidePeek, 120); });
    n.addEventListener('click', function (e) { e.preventDefault(); showPeek(n); }); /* touch: a tap shows it */
    n.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showPeek(n); var c = peekEl && peekEl.querySelector('.peek-cta'); if (c) c.focus(); }
      else if (e.key === 'Escape') hidePeek();
    });
  });
  document.addEventListener('pointerdown', function (e) { if (peekEl && !(e.target.closest && e.target.closest('.peek, .note'))) hidePeek(); });
  pane.addEventListener('scroll', hidePeek, { passive: true });
  window.addEventListener('resize', hidePeek);

  /* ---------- Filters and search ---------- */
  var cats = {};
  PROJECTS.forEach(function (p) { (p.categories || []).forEach(function (c) { cats[c] = (cats[c] || 0) + 1; }); });
  var names = Object.keys(cats).sort(function (a, b) { return cats[b] - cats[a]; });
  var filtersEl = document.getElementById('wbFilters');
  var state = { cat: 'All', q: '' };
  function chip(label, n) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip' + (label === 'All' ? ' is-on' : '');
    b.setAttribute('aria-pressed', label === 'All' ? 'true' : 'false');
    b.dataset.cat = label;
    b.innerHTML = esc(label) + '<i>' + n + '</i>';
    return b;
  }
  filtersEl.appendChild(chip('All', PROJECTS.length));
  names.forEach(function (n) { filtersEl.appendChild(chip(n, cats[n])); });

  var statusEl = document.getElementById('wbStatus');
  var statusText = document.getElementById('wbStatusText');
  var emptyEl = document.getElementById('wbEmpty');
  var searchEl = document.getElementById('wbSearch');
  var clearEl = document.getElementById('wbSearchClear');
  function applyFilter() {
    var q = state.q.trim().toLowerCase();
    var total = 0, shownAll = 0;
    Array.prototype.forEach.call(framesEl.querySelectorAll('.frame'), function (fr) {
      var shown = 0, all = 0;
      Array.prototype.forEach.call(fr.querySelectorAll('.card, .note'), function (c) {
        var inCat = state.cat === 'All' || (c.dataset.cats || '').split('|').indexOf(state.cat) > -1;
        var inQ = !q || (c.dataset.text || '').indexOf(q) > -1;
        var on = inCat && inQ;
        var inArt = artOn && world.contains(c);
        c.classList.toggle('is-off', !on && !inArt);
        c.classList.toggle('is-dim', !on && inArt);
        if (!on && inArt) { c.setAttribute('tabindex', '-1'); c.setAttribute('aria-disabled', 'true'); }
        else { c.removeAttribute('tabindex'); c.removeAttribute('aria-disabled'); }
        all++;
        if (on) shown++;
      });
      fr.classList.toggle('is-off', shown === 0 && !(artOn && world.contains(fr)));
      var em = fr.querySelector('[data-count]');
      if (em) em.textContent = shown === all ? all : shown + ' of ' + all;
      total += all; shownAll += shown;
    });
    var active = q || state.cat !== 'All';
    clearEl.hidden = !state.q;
    statusEl.hidden = !active;
    if (active) statusText.textContent = shownAll + (shownAll === 1 ? ' project' : ' projects') + (state.cat !== 'All' ? ' in ' + state.cat : '') + (q ? ' matching \u201c' + state.q.trim() + '\u201d' : '');
    var wasHidden = emptyEl.hidden;
    emptyEl.hidden = shownAll !== 0;
    if (!emptyEl.hidden) fillEmpty(q, wasHidden);
    if (hasArt) {
      var hits = world.querySelectorAll('.card:not(.is-dim), .note:not(.is-dim)');
      art.classList.toggle('is-off', artOn && !!active && hits.length === 0);
      if (artOn && !opening && art.clientHeight > 80) {
        if (active && hits.length) { touched = true; fitRect(union(hits), true, hits.length === 1 ? 1.25 : 1); }
        else if (!active && wasActive) { touched = false; home(true); }
      }
      wasActive = !!active;
    }
  }
  var wasActive = false;
  /* No results: say what was searched, and offer words that do find something */
  var TRY = ['fintech', 'payments', 'design system', 'mobile', 'dashboard', 'ai', 'banking', 'onboarding', 'redesign', 'concept'];
  function fillEmpty(q, fresh) {
    var title = document.getElementById('wbEmptyTitle'), tryEl = document.getElementById('wbEmptyTry');
    title.textContent = q ? 'Nothing on the board matches “' + state.q.trim() + '”.' : 'Nothing in ' + state.cat + ' yet.';
    var texts = Array.prototype.map.call(framesEl.querySelectorAll('.card, .note'), function (c) { return c.dataset.text || ''; });
    var picks = TRY.filter(function (w) { return w !== q && texts.some(function (t) { return t.indexOf(w) > -1; }); }).slice(0, 3);
    tryEl.innerHTML = '';
    picks.forEach(function (w) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'chip'; b.textContent = w;
      b.addEventListener('click', function () {
        state.cat = 'All';
        Array.prototype.forEach.call(filtersEl.children, function (c) { var on = c.dataset.cat === 'All'; c.classList.toggle('is-on', on); c.setAttribute('aria-pressed', on ? 'true' : 'false'); });
        state.q = w; searchEl.value = w; applyFilter();
      });
      tryEl.appendChild(b);
    });
    tryEl.previousElementSibling.hidden = !picks.length;
    if (fresh) { emptyEl.classList.remove('is-play'); void emptyEl.offsetWidth; emptyEl.classList.add('is-play'); } /* replay the scene */
  }
  function reset() {
    state.q = ''; state.cat = 'All'; searchEl.value = '';
    Array.prototype.forEach.call(filtersEl.children, function (c) {
      var on = c.dataset.cat === 'All';
      c.classList.toggle('is-on', on);
      c.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    applyFilter();
  }
  filtersEl.addEventListener('click', function (e) {
    var b = e.target.closest('.chip');
    if (!b) return;
    state.cat = b.dataset.cat;
    Array.prototype.forEach.call(filtersEl.children, function (c) {
      var on = c === b;
      c.classList.toggle('is-on', on);
      c.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    applyFilter();
  });
  searchEl.addEventListener('input', function (e) { state.q = e.target.value; applyFilter(); });
  searchEl.addEventListener('keydown', function (e) { if (e.key === 'Escape' && state.q) { e.stopPropagation(); reset(); } });
  clearEl.addEventListener('click', function () { state.q = ''; searchEl.value = ''; applyFilter(); searchEl.focus(); });
  document.getElementById('wbReset').addEventListener('click', reset);
  document.getElementById('wbEmptyReset').addEventListener('click', reset);

  /* ---------- Board / Grid ---------- */
  function movables() { return framesEl.querySelectorAll('.card, .note'); }
  var viewEl = document.querySelector('.wb-view');
  viewEl.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-view]');
    if (!b) return;
    var grid = b.dataset.view === 'grid';
    pane.classList.toggle('is-grid', grid);
    artMode();
    Array.prototype.forEach.call(viewEl.children, function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
    try { localStorage.setItem('wb-view', b.dataset.view); } catch (x) {}
  });
  try { if (localStorage.getItem('wb-view') === 'grid') viewEl.querySelector('[data-view="grid"]').click(); } catch (x) {}
  artMode();
  if (wideMq.addEventListener) wideMq.addEventListener('change', artMode);
  if (window.ResizeObserver) (function () { var ro = new ResizeObserver(function () { sizeArt(); }); ro.observe(pane); ro.observe(barEl); })(); else window.addEventListener('resize', sizeArt);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(sizeArt);

  /* ---------- Video previews on hover (Fundall) ---------- */
  Array.prototype.forEach.call(framesEl.querySelectorAll('.card'), function (c) {
    var v = c.querySelector('video');
    if (!v) return;
    c.addEventListener('mouseenter', function () {
      if (reduce) return;
      if (!v.getAttribute('src')) v.setAttribute('src', v.getAttribute('data-src'));
      var p = v.play(); if (p && p.catch) p.catch(function () {});
      v.classList.add('is-on');
    });
    c.addEventListener('mouseleave', function () { v.pause(); v.classList.remove('is-on'); });
  });

  /* ---------- Dragging (mouse only): cards, notes and stickers ---------- */
  var zTop = 60;
  function num(el, name) { return parseFloat(el.style.getPropertyValue(name)) || 0; }
  function makeDraggable(host, el) {
    host.addEventListener('dragstart', function (e) { e.preventDefault(); });
    host.addEventListener('pointerdown', function (e) {
      if (!fine || e.button !== 0) return;
      var onArt = artOn && world.contains(el);
      if (onArt && !el.classList.contains('sticker')) return;
      if (el.classList.contains('sticker') && !el.dataset.mine && !OWNER) return;
      var kz = onArt ? Z : 1;
      var sx = e.clientX, sy = e.clientY, ox = num(el, '--dx'), oy = num(el, '--dy'), moved = false;
      function move(ev) {
        var dx = (ev.clientX - sx) / kz, dy = (ev.clientY - sy) / kz;
        if (!moved && Math.abs(dx) + Math.abs(dy) < 6) return;
        if (!moved) { moved = true; el.classList.add('is-dragging'); el.style.zIndex = ++zTop; try { host.setPointerCapture(e.pointerId); } catch (x) {} }
        el.style.setProperty('--dx', (ox + dx) + 'px');
        el.style.setProperty('--dy', (oy + dy) + 'px');
      }
      function up() {
        host.removeEventListener('pointermove', move);
        host.removeEventListener('pointerup', up);
        host.removeEventListener('pointercancel', up);
        if (moved) {
          el.classList.remove('is-dragging');
          if (el.classList.contains('sticker')) { if (el.dataset.decor) saveDecor(); else if (el.dataset.mine || OWNER) settle(el); }
          el.style.zIndex = ++zTop;
          var stop = function (ev) { ev.preventDefault(); ev.stopPropagation(); };
          host.addEventListener('click', stop, { capture: true, once: true }); /* a drag is not a click */
          window.setTimeout(function () { host.removeEventListener('click', stop, true); }, 0);
        }
      }
      host.addEventListener('pointermove', move);
      host.addEventListener('pointerup', up);
      host.addEventListener('pointercancel', up);
    });
  }
  Array.prototype.forEach.call(movables(), function (c) { makeDraggable(c, c); });
  Array.prototype.forEach.call(framesEl.querySelectorAll('.sticker'), function (s) {
    s.addEventListener('click', function (e) { e.stopPropagation(); if (window.__showTag) window.__showTag(s); });
    makeDraggable(s, s); /* only does anything for the owner */
    s.addEventListener('dblclick', function () { if (!OWNER) return; if (window.__hideTag) window.__hideTag(); s.dataset.hidden = '1'; s.hidden = true; saveDecor(); });
  });

  /* ---------- Sticker tray ---------- */
  var trayItems = document.getElementById('wbTrayItems');
  var clearBtn = document.getElementById('wbClear');
  var mine = 0;
  function countMine() { mine = board.querySelectorAll('.sticker[data-mine]').length; clearBtn.hidden = !mine; }
  var MAX_MINE = 8, KEY = 'wb-stickers-v1';
  function ls(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (x) { return null; } }
  /* Shared board: stickers are saved on the server (netlify/functions/stickers.mjs) so every visitor sees them.
     Where the server is not there (opened from a file or a plain local server) they stay in this browser only. */
  var SHARED_URL = (window.BOARD_CONFIG && window.BOARD_CONFIG.stickers && window.BOARD_CONFIG.stickers.endpoint) || '';
  var shared = false;
  var VID = ls('wb-vid');
  if (!VID) { VID = Math.random().toString(36).slice(2) + Date.now().toString(36); ls('wb-vid', VID); }
  try { var ok = new URLSearchParams(location.search).get('owner'); if (ok) ls('wb-owner-key', ok); } catch (x) {}
  var OWNER = ls('wb-owner-key') || '';
  function api(method, body) {
    var h = { 'content-type': 'application/json', 'x-visitor': VID };
    if (OWNER) h['x-owner-key'] = OWNER;
    return fetch(SHARED_URL, { method: method, headers: h, body: body ? JSON.stringify(body) : undefined, cache: 'no-store' })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return r.ok ? j : Promise.reject(j); }); });
  }
  /* Your own stickers stay on your board when you come back (this browser only, nothing is sent) */
  function saveMine() {
    if (shared) return;
    var out = [];
    Array.prototype.forEach.call(world.querySelectorAll('.sticker[data-mine]'), function (x) {
      out.push({ t: x.dataset.type, x: parseFloat(x.style.left) || 0, y: parseFloat(x.style.top) || 0, r: parseFloat(x.style.getPropertyValue('--r')) || 0, by: x.dataset.by || '', at: +x.dataset.at || Date.now() });
    });
    ls(KEY, JSON.stringify(out));
  }
  /* A sticker may not sit on a project: it is nudged to the nearest free spot beside it */
  var toldMove = false;
  function settle(st) {
    if (st.parentNode !== world) return;
    var x = (parseFloat(st.style.left) || 0) + num(st, '--dx'), y = (parseFloat(st.style.top) || 0) + num(st, '--dy');
    var size = st.offsetWidth || 70, gap = 10, moved = false;
    var cards = Array.prototype.map.call(world.querySelectorAll('.card, .note'), worldRect);
    for (var it = 0; it < 8; it++) {
      var hit = null, best = 0;
      cards.forEach(function (c) {
        var ox = Math.min(x + size, c.r + gap) - Math.max(x, c.l - gap), oy = Math.min(y + size, c.b + gap) - Math.max(y, c.t - gap);
        if (ox > 0 && oy > 0 && ox * oy > best) { best = ox * oy; hit = c; }
      });
      if (!hit) break;
      var opts = [[hit.l - gap - size - x, 0], [hit.r + gap - x, 0], [0, hit.t - gap - size - y], [0, hit.b + gap - y]];
      opts.sort(function (a, b) { return Math.abs(a[0]) + Math.abs(a[1]) - Math.abs(b[0]) - Math.abs(b[1]); });
      x += opts[0][0]; y += opts[0][1]; moved = true;
    }
    st.style.setProperty('--dx', '0px'); st.style.setProperty('--dy', '0px');
    st.style.left = x.toFixed(1) + 'px'; st.style.top = y.toFixed(1) + 'px';
    if (moved && !toldMove) { toldMove = true; toast('Stickers can\u2019t cover the work, so it moved next to the card.'); }
    if (st.dataset.mine || OWNER) { if (shared && st.dataset.id) api('POST', { action: 'move', id: st.dataset.id, x: x, y: y }).catch(function () {}); else saveMine(); }
  }
  function toast(text) {
    var t = document.createElement('p');
    t.className = 'ab-toast';
    t.setAttribute('role', 'status');
    t.textContent = text;
    art.appendChild(t);
    window.setTimeout(function () { t.classList.add('is-gone'); }, 3200);
    window.setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 3700);
  }
  /* "Dropped by" tag: click any sticker to see who put it there */
  var tagEl = null;
  window.__showTag = function (s) { if (artOn) showTag(s); };
  window.__hideTag = function () { hideTag(); };
  function hideTag() { if (tagEl) { tagEl.remove(); tagEl = null; } }
  function when(ms) {
    var m = Math.round((Date.now() - ms) / 60000);
    return m < 1 ? 'just now' : m < 60 ? m + ' min ago' : m < 1440 ? Math.round(m / 60) + ' h ago' : Math.round(m / 1440) + ' d ago';
  }
  function anchor(el, node) {
    var ar = art.getBoundingClientRect(), r = el.getBoundingClientRect(), x, top, bottom;
    if (el.parentNode === world) { /* use where it is going, not where its slide animation is right now */
      var sz = el.offsetWidth * Z;
      x = TX + (parseFloat(el.style.left) || 0) * Z + sz / 2; top = TY + (parseFloat(el.style.top) || 0) * Z; bottom = top + sz;
    } else { x = r.left - ar.left + r.width / 2; top = r.top - ar.top; bottom = r.bottom - ar.top; }
    node.style.left = clamp(x, 130, ar.width - 130) + 'px';
    var below = top < 150; /* not enough room above: open underneath */
    node.classList.toggle('is-below', below);
    node.style.top = (below ? bottom + 10 : top - 10) + 'px';
  }
  function showTag(st) {
    hideTag();
    tagEl = document.createElement('div');
    tagEl.className = 'st-tag';
    var who = st.dataset.owner ? 'Excellent' : (st.dataset.by || 'a visitor');
    var ownerHint = OWNER ? ' \u00b7 drag to move, double-click to remove' : '';
    tagEl.innerHTML = '<b></b><span></span>';
    tagEl.firstChild.textContent = 'Dropped by ' + who;
    tagEl.lastChild.textContent = (st.dataset.owner ? 'the designer himself' : st.dataset.mine ? 'that\u2019s you \u00b7 ' + when(+st.dataset.at) + ' \u00b7 double-click to remove' : when(+st.dataset.at)) + (st.dataset.mine ? '' : ownerHint);
    art.appendChild(tagEl);
    anchor(st, tagEl);
  }
  document.addEventListener('pointerdown', function (e) { if (tagEl && !(e.target.closest && e.target.closest('.sticker, .st-tag'))) hideTag(); });
  /* The first time you drop a sticker you are asked to sign it (or stay anonymous) */
  function askName(st) {
    if (OWNER || ls('wb-name') !== null) { st.dataset.by = OWNER ? 'Excellent' : ls('wb-name'); saveMine(); return; }
    var f = document.createElement('form');
    f.className = 'st-ask';
    f.innerHTML = '<label><span>Sign your sticker</span><input type="text" maxlength="24" placeholder="Your first name" autocomplete="given-name"></label>' +
      '<div><button type="submit">Sign it</button><button type="button" data-skip>Stay anonymous</button></div>';
    art.appendChild(f);
    anchor(st, f);
    var input = f.querySelector('input');
    window.setTimeout(function () { input.focus(); }, 30);
    function done(name) {
      name = String(name || '').replace(/[<>\u0000-\u001f]/g, '').trim().slice(0, 24);
      ls('wb-name', name);
      if (shared) api('POST', { action: 'name', by: name }).catch(function () {});
      Array.prototype.forEach.call(world.querySelectorAll('.sticker[data-mine]'), function (x) { x.dataset.by = name; });
      saveMine();
      f.remove();
      showTag(st);
    }
    f.addEventListener('submit', function (e) { e.preventDefault(); done(input.value); });
    f.querySelector('[data-skip]').addEventListener('click', function () { done(''); });
    f.addEventListener('keydown', function (e) { if (e.key === 'Escape') { e.stopPropagation(); done(''); } });
  }
  function wire(st) {
    makeDraggable(st, st);
    st.addEventListener('click', function (e) { e.stopPropagation(); showTag(st); });
    st.addEventListener('dblclick', function () {
      if (!st.dataset.mine && !(OWNER && st.dataset.id)) return;
      hideTag(); st.remove(); countMine(); saveMine();
      if (shared && st.dataset.id) api('POST', { action: 'remove', id: st.dataset.id }).catch(function () {});
    });
  }
  /* cx, cy are screen positions of the sticker's top-left corner */
  function stickAt(t, cx, cy) {
    var parent = layer, left, top, ar = art.getBoundingClientRect();
    if (artOn && cx + 35 >= ar.left && cx + 35 <= ar.right && cy + 35 >= ar.top && cy + 35 <= ar.bottom) {
      var wr = world.getBoundingClientRect();
      parent = world; left = (cx - wr.left) / Z; top = (cy - wr.top) / Z;
    } else { var br = board.getBoundingClientRect(); left = cx - br.left; top = cy - br.top; }
    if (parent === world && world.querySelectorAll('.sticker[data-mine]').length >= MAX_MINE) { toast('That\u2019s all ' + MAX_MINE + ' of your stickers. Double-click one to take it off.'); return; }
    var s = stickerEl(t, { left: left, top: top, r: rnd(-16, 16), size: 70, isNew: !reduce });
    s.dataset.mine = '1';
    s.dataset.at = String(Date.now());
    parent.appendChild(s);
    wire(s);
    countMine();
    if (parent === world) {
      settle(s);
      if (shared) {
        api('POST', { action: 'add', t: t, x: parseFloat(s.style.left) || 0, y: parseFloat(s.style.top) || 0, r: parseFloat(s.style.getPropertyValue('--r')) || 0, by: OWNER ? '' : (ls('wb-name') || '') })
          .then(function (j) { if (j && j.sticker) { s.dataset.id = j.sticker.id; if (j.sticker.owner) s.dataset.owner = '1'; } })
          .catch(function (j) { s.remove(); countMine(); hideTag(); toast(j && j.error === 'limit' ? 'That\u2019s all ' + MAX_MINE + ' of your stickers. Double-click one to take it off.' : 'That sticker didn\u2019t stick. Try again in a moment.'); });
      }
      askName(s);
    }
  }
  TRAY.forEach(function (t) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'tray-btn';
    b.setAttribute('aria-label', 'Add a ' + t + ' sticker to the board (or drag it onto the board)');
    b.title = 'Click to add, or drag onto the board';
    b.innerHTML = STICKERS[t];
    var justDragged = false;
    b.addEventListener('dragstart', function (e) { e.preventDefault(); });
    b.addEventListener('mousedown', function (e) { e.preventDefault(); }); /* no native drag or text selection from the tray */
    /* Click: drops it somewhere in view */
    b.addEventListener('click', function () {
      if (justDragged || !fine || !layer) return;
      var pr = (artOn ? art : pane).getBoundingClientRect();
      stickAt(t, pr.left + rnd(60, Math.max(140, pr.width - 140)), pr.top + pr.height * rnd(0.25, 0.6));
    });
    /* Drag: pick it up from the tray and put it exactly where you let go */
    b.addEventListener('pointerdown', function (e) {
      if (!fine || e.button !== 0 || b.__active) return;
      b.__active = true;
      var sx = e.clientX, sy = e.clientY, ghost = null, moved = false, lx = sx, ly = sy;
      function startGhost() {
        moved = true;
        ghost = document.createElement('span');
        ghost.className = 'sticker';
        ghost.style.cssText = 'position:fixed;left:0;top:0;z-index:2147482600;pointer-events:none;--s:78px;scale:1.08;';
        ghost.innerHTML = STICKERS[t];
        document.body.appendChild(ghost);
      }
      function move(ev) {
        lx = ev.clientX; ly = ev.clientY;
        if (moved && ev.buttons === 0) { finish(ev); return; } /* button already released: finish the drop */
        if (!moved && Math.abs(lx - sx) + Math.abs(ly - sy) < 6) return;
        if (!moved) startGhost();
        ghost.style.transform = 'translate(' + (lx - 39) + 'px,' + (ly - 39) + 'px) rotate(-10deg)';
      }
      function finish(ev) {
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', finish);
        window.removeEventListener('pointercancel', finish);
        b.__active = false;
        if (ev && ev.type !== 'pointercancel') { lx = ev.clientX; ly = ev.clientY; }
        if (!moved && ev && ev.type === 'pointerup' && Math.abs(lx - sx) + Math.abs(ly - sy) >= 6) moved = true; /* released far away without move events */
        if (ghost && ghost.parentNode) ghost.parentNode.removeChild(ghost);
        if (!moved) return;
        justDragged = true;
        window.setTimeout(function () { justDragged = false; }, 60);
        var pr = pane.getBoundingClientRect();
        if (lx >= pr.left && lx <= pr.right && ly >= pr.top && ly <= pr.bottom) {
          stickAt(t, lx - 35, ly - 35);
        }
      }
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', finish);
      window.addEventListener('pointercancel', finish);
    });
    trayItems.appendChild(b);
  });
  clearBtn.addEventListener('click', function () {
    hideTag();
    Array.prototype.forEach.call(board.querySelectorAll('.sticker[data-mine]'), function (x) {
      if (shared && x.dataset.id) api('POST', { action: 'remove', id: x.dataset.id }).catch(function () {});
      x.parentNode.removeChild(x);
    });
    countMine(); saveMine();
  });
  /* Bring back your own stickers from last time */
  function placeSaved(o, mine) {
    if (!STICKERS[o.t]) return null;
    var s = stickerEl(o.t, { left: o.x, top: o.y, r: o.r, size: 70 });
    if (mine) s.dataset.mine = '1';
    if (o.owner) s.dataset.owner = '1';
    if (o.id) s.dataset.id = o.id;
    s.dataset.by = o.by || ''; s.dataset.at = String(o.at || Date.now());
    world.appendChild(s);
    wire(s);
    return s;
  }
  function loadLocal() {
    try { (JSON.parse(ls(KEY) || '[]') || []).slice(0, MAX_MINE).forEach(function (o) { placeSaved(o, true); }); } catch (x) {}
    countMine();
  }
  function saveDecor() {
    if (!OWNER || !shared) return;
    var out = {};
    Array.prototype.forEach.call(framesEl.querySelectorAll('.sticker[data-decor]'), function (x) {
      var dx = num(x, '--dx'), dy = num(x, '--dy');
      if (x.dataset.hidden || dx || dy) out[x.dataset.decor] = { dx: Math.round(dx), dy: Math.round(dy), hidden: !!x.dataset.hidden };
    });
    api('POST', { action: 'decor', decor: out }).catch(function () { toast('Could not save that change. Try again.'); });
  }
  function applyDecor(d) {
    if (!d) return;
    Array.prototype.forEach.call(framesEl.querySelectorAll('.sticker[data-decor]'), function (x) {
      var o = d[x.dataset.decor];
      if (!o) return;
      if (o.hidden) { x.dataset.hidden = '1'; x.hidden = true; return; }
      x.style.setProperty('--dx', (o.dx || 0) + 'px');
      x.style.setProperty('--dy', (o.dy || 0) + 'px');
    });
  }
  function loadShared() {
    return api('GET').then(function (j) {
      if (!j || !Array.isArray(j.stickers)) throw new Error('no list');
      shared = true;
      applyDecor(j.decor);
      Array.prototype.forEach.call(world.querySelectorAll(':scope > .sticker'), function (x) { x.remove(); });
      j.stickers.forEach(function (o) {
        var st = placeSaved(o, o.mine);
        if (st && !o.mine) settle(st); /* if the board has changed since, keep it off the work (on screen only) */
      });
      countMine();
    });
  }
  if (hasArt) {
    if (SHARED_URL && location.protocol !== 'file:') loadShared().catch(loadLocal);
    else loadLocal();
    /* Owner only: clear every visitor sticker off the board */
    if (OWNER && SHARED_URL) {
      var cleanBtn = document.createElement('button');
      cleanBtn.type = 'button';
      cleanBtn.className = 'wb-tray-clear';
      cleanBtn.textContent = 'Clean up board';
      cleanBtn.addEventListener('click', function () {
        if (!window.confirm('Remove every visitor sticker from the board? Yours stay.')) return;
        api('POST', { action: 'clean' }).then(function (j) { toast('Removed ' + (j.removed || 0) + ' stickers.'); return loadShared(); }).catch(function () { toast('Clean up did not work. Try again.'); });
      });
      trayEl.appendChild(cleanBtn);
    }
  }
  if (!fine) document.getElementById('wbTray').style.display = 'none';

  /* The page itself does not scroll on desktop, so a wheel over the rail scrolls the board */
  var rail = document.querySelector('.rail');
  var wide = window.matchMedia && window.matchMedia('(min-width: 861px)');
  if (rail) rail.addEventListener('wheel', function (e) { if (!wide || !wide.matches) return; pane.scrollTop += e.deltaY; e.preventDefault(); }, { passive: false });
})();
