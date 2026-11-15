/* Design-board layer: dot-grid canvas, your cursor, other visitors, presence chip, "/" cursor chat.
   Loaded on every page. Settings live in js/board-config.js; cursor designs in js/board-cursors.js.

   Who you see:
   - Real visitors on the same page, if a transport is configured (supabase) or in local test mode.
   - Otherwise (or when fewer than two real people are here) a few simulated demo visitors that
     arrive, read down the page, comment, and leave. They are re-picked per page and never mint.
   Other visitors live in PAGE space, not screen space: they scroll and wander like real readers, so
   they are often off screen. When one is above or below you, a small tag on the edge of the screen
   shows its name and direction; click it (or just scroll) to go and meet them.
   Your own cursor is the large mint one with a halo ring. Others are smaller, in other colours,
   with name tags, so there is no mistaking which is yours.
   Nothing is sent anywhere unless transport is "supabase". Touch devices get the dot grid only. */
(function () {
  'use strict';
  var root = document.documentElement;
  var qs = new URLSearchParams(location.search);
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
    del: function (k) { try { localStorage.removeItem(k); } catch (e) {} }
  };
  if (qs.get('board') === 'off') store.set('board-off', '1');
  if (qs.get('board') === 'on') store.del('board-off');
  if (store.get('board-off') === '1') return;

  var CFG = (function () {
    var d = { transport: 'none', realtime: {}, chat: true, chatMax: 80, simulated: true, cursor: 'outline-arrow', bot: { endpoint: '', name: 'AI guide' } };
    var c = window.BOARD_CONFIG || {};
    for (var k in c) if (Object.prototype.hasOwnProperty.call(c, k)) d[k] = c[k];
    d.chatMax = Math.max(20, Math.min(80, d.chatMax | 0 || 80));
    return d;
  })();

  function mq(q) { return !!(window.matchMedia && window.matchMedia(q).matches); }
  var fine = mq('(hover: hover) and (pointer: fine)');
  var reduce = mq('(prefers-reduced-motion: reduce)');
  var wide = mq('(min-width: 861px)');

  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function rand(a, b) { return a + Math.random() * (b - a); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function mod(v, h) { return ((v % h) + h) % h; }
  function wrapDelta(d, h) { d = mod(d, h); return d > h / 2 ? d - h : d; }
  function place(el, x, y) { el.style.transform = 'translate3d(' + Math.round(x) + 'px,' + Math.round(y) + 'px,0)'; }
  function hash(s) { var h = 0; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); }
  function lum(c) {
    var m = String(c).match(/[\d.]+/g);
    if (!m || m.length < 3) return null;
    if (m.length > 3 && +m[3] < 0.1) return null;
    return (0.2126 * m[0] + 0.7152 * m[1] + 0.0722 * m[2]) / 255;
  }

  /* ---------- Colours and names (mint is reserved for YOU) ---------- */
  var PALETTE = ['#ff8a65', '#a99bff', '#5ec8f2', '#f2c94c', '#f48fb1', '#ffb74d'];
  /* Other people are simply numbered visitors */

  /* ---------- Realistic simulated chatter ---------- */
  var CTX = [
    [/speech-to-order/, ['the voice one is really clean', 'ok the speech to order flow makes sense', 'wait the 90 to 65 thing, is that real?']],
    [/omnione/, ['design system one is solid', 'four teams on one system, that is hard']],
    [/teesas/, ['four versions is a lot of work', 'love seeing v1 next to the current one']],
    [/fundall/, ['the fundall flow looks smooth', 'face id screen is a nice touch']],
    [/sun-king/, ['the before/after scroll is satisfying', 'that rebuild is way better']],
    [/valideity/, ['valideity looks interesting', 'simulated users, smart way to test']],
    [/moniepoint/, ['that slider is so satisfying', 'level 3 vs level 2 is confusing, good catch']],
    [/empty-state|empty_state/, ['preorder instead of empty, nice idea']],
    [/about/, ['good story', 'ok that bio is solid']]
  ];
  var GENERIC = [
    'this scrolls forever lol', 'ok i like this', 'how are the cursors done?', 'anyone else here?', 'hi 👋',
    'saving this one', 'nice portfolio', 'the type is so clean', 'wait it loops', 'this feels like figma lol',
    'love the grid', 'where is the resume?', 'ok that animation is nice', 'hm, nice colours',
    'you can scroll to find me lol', 'reading this part', 'ok this section is good'
  ];
  var REPLIES = ['ha, hey!', 'hey 👋', 'same lol', 'right?', 'haha yes', '👀', 'agreed', 'wait you can type here?', 'nice, it works'];
  var BAD = /(fuck|shit|bitch|cunt|nigg|fag|rape|whore|slut|dick|pussy)/ig;
  function clean(t) {
    return String(t == null ? '' : t).replace(/[\u0000-\u001f\u007f<>]/g, '').replace(BAD, '•••').trim().slice(0, CFG.chatMax);
  }

  function start() {
    /* ---------- Canvas theme ---------- */
    var bg = getComputedStyle(document.body).backgroundColor;
    var l = lum(bg);
    if (l === null) { bg = getComputedStyle(root).backgroundColor; l = lum(bg); }
    if (l === null) { bg = '#ffffff'; l = 1; }
    if (lum(getComputedStyle(root).backgroundColor) === null) root.style.backgroundColor = bg; /* pages that define their own html colour keep it */
    root.classList.add('board', l < 0.45 ? 'board-dark' : 'board-light');
    function refreshTheme() {
      var rl = lum(getComputedStyle(root).backgroundColor);
      if (rl === null) return;
      root.classList.toggle('board-dark', rl < 0.45);
      root.classList.toggle('board-light', rl >= 0.45);
    }

    /* Pane/feed pages pan the dots with the scrolling pane; normal pages scroll the document */
    var feed = document.querySelector('.tiles') || document.querySelector('.pane');
    var useFeed = !!(feed && wide);
    var loopSets = useFeed ? feed.querySelectorAll('.tiles-set') : [];
    /* The dot grid is fixed to the screen (see board.css): content scrolls over the board */

    /* ---------- Your cursor ---------- */
    var CUR = window.BOARD_CURSORS;
    function applyCursor() {
      if (!fine || !CUR) return;
      var id = store.get('board-cursor') || CFG.cursor || CUR.defaultId;
      root.style.setProperty('--board-cursor', CUR.css(id, false));
      root.style.setProperty('--board-cursor-link', CUR.css(id, true));
      root.classList.add('board-cursor');
    }
    applyCursor();
    window.BOARD = { applyCursor: applyCursor, refreshTheme: refreshTheme };
    if (root.classList.contains('embed')) return; /* inside the shell: the parent page draws visitors and chat */

    /* ---------- Guide panel: click the AI guide to ask it anything about the work ---------- */
    var guide = null;
    var LINKS = (CFG.bot && CFG.bot.links) || {};
    var CHIPS = [
      ['I am hiring. Is Excellent a fit?', 'hiring'],
      ['Which case study should I read first?', 'first'],
      ['What has he built in fintech?', 'fintech'],
      ['How do I reach him?', 'contact']
    ];
    var KB = {
      hiring: { text: 'I am a Senior Product Designer for fintech and B2B products, and I have led design as a Design Manager. If you are hiring, the two best reads are Speech-to-Order (reported: complaint sessions fell from roughly 90% to 65%) and Omnione (one design system for four product teams).', links: ['speech-to-order', 'omnione', 'resume', 'email'] },
      first: { text: 'Start with Speech-to-Order: I separated ordering from support, and complaint sessions fell from roughly 90% to 65% (reported). If you care about systems and leading a team, read Omnione next.', links: ['speech-to-order', 'omnione', 'fundall'] },
      fintech: { text: 'Fintech and B2B is my core: Fundall (I led Salary Advance on the mobile app), Omnibiz ordering and empty states, and my own explorations of Moniepoint verification and Nsimbi chat payments. Those last two use simulated users, so the results are predicted.', links: ['fundall', 'moniepoint', 'nsimbi'] },
      contact: { text: 'Email is the fastest way to reach me. My resume has the full work history.', links: ['email', 'resume'] },
      building: { text: 'I am building Valideity right now. Two of my case studies tested its pricing and cancel flows with AI-simulated users.', links: ['valideity'] },
      life: { text: 'Away from work I am usually watching movies, at the gym, cooking, with friends, thinking through a strategy game, or on a long walk. The About page has more.', links: ['about'] },
      fallback: { text: 'I can tell you whether I fit a role, which case study to read first, or how to reach me. If you are not sure, my resume or an email will settle it.', links: ['resume', 'email'] }
    };
    function demoAnswer(t) {
      if (/outside work|hobb|game|free time|for fun|weekend/i.test(t)) return KB.life;
      if (/valideity|building|currently/i.test(t)) return KB.building;
      if (/hir|fit|role|recruit|job|position|senior|lead|manager/i.test(t)) return KB.hiring;
      if (/first|best|start|recommend|which|read/i.test(t)) return KB.first;
      if (/fintech|bank|payment|money|b2b|built|work/i.test(t)) return KB.fintech;
      if (/reach|contact|email|hire him|talk|call|message|hi\b/i.test(t)) return KB.contact;
      if (/valideity|building|now|currently/i.test(t)) return KB.building;
      return KB.fallback;
    }
    function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
    function linkEl(id) {
      var L = LINKS[id];
      if (!L) return null;
      var a = el('a', 'guide-cta', L.label);
      a.href = L.href;
      if (L.open) a.setAttribute('data-open', '');
      if (L.download) a.setAttribute('download', '');
      if (/^https?:/i.test(L.href)) { a.target = '_blank'; a.rel = 'noopener'; }
      return a;
    }
    var root0 = document.documentElement;
    function openGuide(q) {
      if (typeof q !== 'string') q = '';
      if (!(CFG.bot && CFG.bot.endpoint)) return;
      root0.classList.add('guide-open');
      if (guide) { guide.root.hidden = false; guide.input.focus(); if (q) guide.ask(q); return; }
      var root = el('section', 'guide');
      root.setAttribute('role', 'dialog');
      root.setAttribute('aria-label', 'Ask muidemakz, the AI on this portfolio');
      var head = el('header', 'guide-head');
      var title = el('div', 'guide-title');
      title.appendChild(el('span', 'guide-badge', 'AI'));
      title.appendChild(el('b', null, 'Ask MM'));
      var close = el('button', 'guide-close', '\u00d7');
      close.type = 'button'; close.setAttribute('aria-label', 'Close the AI guide');
      head.append(title, close);
      var log = el('div', 'guide-log');
      log.setAttribute('aria-live', 'polite');
      var chips = el('div', 'guide-chips');
      var form = el('form', 'guide-form');
      var input = el('input'); input.type = 'text'; input.maxLength = 200; input.placeholder = 'Ask a question\u2026'; input.setAttribute('aria-label', 'Ask the AI guide');
      var send = el('button', 'guide-send', 'Ask'); send.type = 'submit';
      form.append(input, send);
      root.append(head, log, chips, form);
      document.body.appendChild(root);
      guide = { root: root, log: log, input: input, chips: chips };
      function bubble(cls, text) { var b = el('div', 'guide-msg ' + cls, text); log.appendChild(b); log.scrollTop = log.scrollHeight; return b; }
      function render(ans, node) {
        node.textContent = ans.text;
        var row = el('div', 'guide-ctas');
        (ans.links || []).forEach(function (id) { var a = linkEl(id); if (a) row.appendChild(a); });
        if (row.childNodes.length) node.appendChild(row);
        log.scrollTop = log.scrollHeight;
      }
      var busy = false;
      function ask(text) {
        text = String(text || '').replace(/[\u0000-\u001f\u007f<>]/g, '').trim().slice(0, 200);
        if (!text || busy) return;
        busy = true;
        bubble('guide-msg--me', text);
        var node = bubble('guide-msg--bot guide-msg--typing', '\u2026');
        var finish = function (ans) { busy = false; node.classList.remove('guide-msg--typing'); render(ans, node); };
        if (CFG.bot.endpoint === 'demo') { window.setTimeout(function () { finish(demoAnswer(text)); }, rand(600, 1100)); return; }
        var ctrl = window.AbortController ? new AbortController() : null;
        var timer = window.setTimeout(function () { if (ctrl) ctrl.abort(); }, 12000);
        fetch(CFG.bot.endpoint, {
          method: 'POST', headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ mode: 'panel', message: text, page: (document.title || '') + ' ' + (location.hash || location.pathname) }),
          signal: ctrl ? ctrl.signal : undefined
        }).then(function (r) { return r.ok ? r.json() : Promise.reject(); })
          .then(function (j) { window.clearTimeout(timer); finish({ text: String((j && j.reply) || KB.fallback.text), links: (j && j.links) || [] }); })
          .catch(function () { window.clearTimeout(timer); finish({ text: 'I lost signal for a moment. You can still read a case study or email him.', links: ['email', 'resume'] }); });
      }
      CHIPS.forEach(function (c) {
        var b = el('button', 'guide-chip', c[0]); b.type = 'button';
        b.addEventListener('click', function () { ask(c[0]); });
        chips.appendChild(b);
      });
      form.addEventListener('submit', function (e) { e.preventDefault(); var v = input.value; input.value = ''; ask(v); });
      close.addEventListener('click', function () { root.hidden = true; root0.classList.remove('guide-open'); });
      root.addEventListener('keydown', function (e) { if (e.key === 'Escape') { e.stopPropagation(); root.hidden = true; root0.classList.remove('guide-open'); } });
      bubble('guide-msg--bot', 'Hey, I am muidemakz, the AI behind this portfolio. Ask me about my work, or whether I would fit what you are hiring for. For the real me, the email button works.');
      guide.ask = ask;
      input.focus();
      if (q) ask(q);
    }
    window.BOARD.openGuide = openGuide;
    /* Phones and touch screens have no visitors chip, so they get a floating Ask MM button (shell only) */
    if (CFG.bot && CFG.bot.endpoint && document.getElementById('stage')) {
      var fab = el('button', 'ask-fab', 'Ask MM');
      fab.type = 'button';
      fab.setAttribute('aria-label', 'Ask MM, the AI on this portfolio');
      fab.addEventListener('click', openGuide);
      document.body.appendChild(fab);
    }
    if (!fine) return;

    /* ---------- Page space ----------
       World y is a position on the page (or in the looping feed). The screen shows a window
       onto it, so a visitor reading further down is simply not on your screen. */
    var M = { st: 0, top: 0, vh: window.innerHeight, h: 1, loop: false };
    /* Inside the shell, a case study / Work / About page lives in an iframe that does the scrolling,
       so visitors follow THAT page: their world is the iframe's page, and you can scroll to meet them. */
    function activeFrame() {
      var f = document.querySelector('#stage.is-expanded .view:not([hidden]):not(.is-pending):not(.is-leaving) iframe.is-ready');
      if (!f) return null;
      try { return f.contentDocument && f.contentDocument.scrollingElement ? f : null; } catch (e) { return null; }
    }
    var frameNow = null;
    /* The element that actually scrolls inside an opened page: the document, or a pane (Work, About) */
    function frameScroller(f) {
      var d = f.contentDocument, se = d.scrollingElement;
      if (se && se.scrollHeight > se.clientHeight + 4) return se;
      var p = d.querySelector('.pane');
      return p && p.scrollHeight > p.clientHeight + 4 ? p : se;
    }
    function measure() {
      frameNow = activeFrame();
      if (frameNow) {
        var fr = frameNow.getBoundingClientRect(), se = frameScroller(frameNow);
        M.st = se.scrollTop; M.top = fr.top; M.vh = frameNow.clientHeight; M.loop = false;
        M.h = Math.max(se.scrollHeight, M.vh);
        return;
      }
      if (useFeed) {
        var r = feed.getBoundingClientRect();
        var H = loopSets.length > 1 ? loopSets[1].offsetTop - loopSets[0].offsetTop : 0;
        M.st = feed.scrollTop; M.top = r.top; M.vh = feed.clientHeight; M.loop = H > 0; M.h = H > 0 ? H : Math.max(feed.scrollHeight, M.vh);
      } else {
        M.st = window.pageYOffset || 0; M.top = 0; M.vh = window.innerHeight; M.loop = false;
        M.h = Math.max(document.documentElement.scrollHeight, M.vh);
      }
    }
    function toWorld(sy) { var w = M.st + (sy - M.top); return M.loop ? mod(w, M.h) : w; }
    function screenOf(wy) {
      var rel = M.loop ? mod(wy - M.st, M.h) : wy - M.st;
      if (M.loop) {
        if (rel > M.vh) return { off: (rel - M.vh) < (M.h - rel) ? 'down' : 'up' };
        return { y: M.top + rel };
      }
      if (rel < -16) return { off: 'up' };
      if (rel > M.vh + 16) return { off: 'down' };
      return { y: M.top + rel };
    }
    function distFromView(wy) {
      var c = M.st + M.vh / 2;
      return Math.abs(M.loop ? wrapDelta(wy - c, M.h) : wy - c);
    }
    function scroller() { if (frameNow) return frameScroller(frameNow); return useFeed ? feed : window; }
    function scrollTo(peer) {
      measure();
      var want = M.vh * 0.4, top;
      if (M.loop) top = M.st + wrapDelta(peer.wy - want - M.st, M.h);
      else top = Math.max(0, peer.wy - want);
      scroller().scrollTo({ top: top, behavior: reduce ? 'auto' : 'smooth' });
    }

    /* ---------- Overlay ---------- */
    var overlay = document.createElement('div');
    overlay.className = 'presence';
    overlay.setAttribute('aria-hidden', 'true');
    document.body.appendChild(overlay);

    var mx = window.innerWidth * 0.6, my = window.innerHeight * 0.5, mouseSeen = false;
    var halo = document.createElement('div');
    halo.className = 'pc-halo';
    overlay.appendChild(halo);

    /* Leave gracefully when the visitor navigates: others fade out as the page changes */
    function leaving() { overlay.classList.add('is-leaving'); }
    document.addEventListener('click', function (e) {
      var a = e.target && e.target.closest && e.target.closest('a[href]');
      if (!a || a.target === '_blank' || e.defaultPrevented || e.metaKey || e.ctrlKey) return;
      var href = a.getAttribute('href') || '';
      if (/^(mailto:|tel:|#|javascript:)/i.test(href) || a.hasAttribute('download')) return;
      leaving();
    }, true);
    window.addEventListener('pagehide', function () { leaving(); if (transport) transport.close(); });
    window.addEventListener('pageshow', function (e) { if (e.persisted) overlay.classList.remove('is-leaving'); });

    /* ---------- Peers ---------- */
    function Peer(o) {
      var self = this;
      this.name = o.name; this.color = o.color; this.real = !!o.real; this.seed = rand(0, 6);
      this.el = document.createElement('div');
      this.el.className = 'pc is-off';
      this.el.style.setProperty('--c', this.color);
      this.el.innerHTML = CUR.peer(this.color) + '<span class="pc-pill"></span>';
      this.pill = this.el.querySelector('.pc-pill');
      this.pill.textContent = this.name;
      overlay.appendChild(this.el);
      this.edge = document.createElement('button');
      this.edge.type = 'button';
      this.edge.tabIndex = -1;
      this.edge.className = 'pc-edge';
      this.edge.style.setProperty('--c', this.color);
      this.edge.innerHTML = '<span class="pc-edge-arrow"></span><span class="pc-edge-name"></span>';
      this.edge.querySelector('.pc-edge-name').textContent = this.name;
      this.edge.addEventListener('click', function () { scrollTo(self); });
      overlay.appendChild(this.edge);
      this.x = this.tx = window.innerWidth * 0.5; this.wy = this.twy = 0; this.read = 0;
      this.here = false; this.leaving = false; this.onScreen = false; this.timers = [];
      this.nextMove = 0; this.nextChat = 0; this.targetEl = null; this.lastSeen = 0; this.lastChatAt = 0;
    }
    Peer.prototype.setHand = function (on) {
      on = !!on;
      if (this.hand === on) return;
      this.hand = on;
      var old = this.el.querySelector('.pc-arrow');
      if (old) old.outerHTML = on ? CUR.peerHand(this.color) : CUR.peer(this.color);
    };
    Peer.prototype.show = function (x, wy) {
      if (x != null) { this.x = this.tx = x; this.wy = this.twy = wy; this.read = wy; }
      this.here = true; this.leaving = false;
      this.el.classList.remove('is-off');
      var el = this.el;
      window.requestAnimationFrame(function () { el.classList.add('is-here'); });
    };
    Peer.prototype.hide = function () {
      this.here = false; this.onScreen = false;
      this.el.classList.remove('is-here'); this.edge.classList.remove('is-on');
      this.stopSay();
    };
    Peer.prototype.destroy = function () {
      this.stopSay();
      [this.el, this.edge].forEach(function (n) { if (n.parentNode) n.parentNode.removeChild(n); });
    };
    Peer.prototype.stopSay = function () {
      this.timers.forEach(function (t) { window.clearTimeout(t); });
      this.timers = [];
      this.el.classList.remove('is-chat');
      this.pill.textContent = this.label || this.name;
    };
    /* Types the message out like someone actually typing, then holds it, then clears it */
    Peer.prototype.say = function (text, o) {
      o = o || {};
      var self = this;
      this.stopSay();
      this.el.classList.add('is-chat');
      var done = function () { self.stopSay(); if (o.done) o.done(); };
      if (!o.type) {
        this.pill.textContent = text;
        this.timers.push(window.setTimeout(done, 4200));
        return;
      }
      var i = 0;
      this.pill.textContent = '…';
      function step() {
        i++;
        self.pill.textContent = text.slice(0, i);
        if (i < text.length) {
          var ch = text.charAt(i - 1);
          self.timers.push(window.setTimeout(step, rand(45, 105) + (/[,.?!]/.test(ch) ? rand(120, 260) : 0)));
        } else self.timers.push(window.setTimeout(done, 3200));
      }
      this.timers.push(window.setTimeout(step, rand(500, 1100)));
    };
    /* Draws the peer either on screen or as an edge tag pointing toward them */
    Peer.prototype.render = function () {
      if (!this.here) return;
      var s = screenOf(this.wy);
      if (s.y != null) {
        this.onScreen = true;
        this.el.classList.remove('is-off');
        this.edge.classList.remove('is-on');
        place(this.el, this.x + Math.sin(performance.now() / 900 + this.seed) * 3, s.y + Math.cos(performance.now() / 1100 + this.seed) * 3);
      } else {
        this.onScreen = false;
        this.el.classList.add('is-off');
        if (this.leaving) { this.edge.classList.remove('is-on'); return; }
        var up = s.off === 'up';
        this.edge.classList.toggle('is-up', up);
        this.edge.classList.toggle('is-down', !up);
        this.edge.classList.add('is-on');
        var ex = clamp(this.x, 90, window.innerWidth - 110);
        place(this.edge, ex, up ? M.top + 56 : M.top + M.vh - 96);
      }
    };

    /* ---------- What simulated visitors "look at" ---------- */
    var CLICKABLE = 'a[href], button, [role="button"], summary, label, .tile, .work-card, .btn';
    function clickable(el) { return !!(el && el.closest && el.closest(CLICKABLE)); }
    var TARGET_SEL = '.tile, .card, .note, .work-card, .ab-card, .ab-row, .ab-stats > div, h1, h2, img, video, .btn, .case-figure, .case-title, .case-section';
    function visibleTargets() {
      var vh = window.innerHeight, vw = window.innerWidth;
      return Array.prototype.filter.call(document.querySelectorAll(TARGET_SEL), function (t) {
        if (overlay.contains(t) || (stageEl && !stageEl.contains(t))) return false;
        var r = t.getBoundingClientRect();
        return r.width > 40 && r.height > 24 && r.bottom > 80 && r.top < vh - 60 && r.right > 60 && r.left < vw - 60;
      });
    }
    /* Where a visitor may stand: the open page, else the container on Home. Never the identity rail. */
    var stageEl = document.getElementById('stage');
    function zone() {
      var r = frameNow ? frameNow.getBoundingClientRect() : stageEl ? stageEl.getBoundingClientRect() : null;
      return r ? { l: r.left + 24, r: Math.max(r.left + 60, r.right - 96) } : { l: window.innerWidth * 0.08, r: window.innerWidth * 0.92 };
    }
    /* Pictures, cards and figures currently visible in the open page (positions are inside the iframe) */
    function frameMedia() {
      try {
        var out = [];
        Array.prototype.forEach.call(frameNow.contentDocument.querySelectorAll('img, video, figure, .case-figure, .card, .note, .ab-card'), function (t) {
          var r = t.getBoundingClientRect();
          if (r.width > 120 && r.height > 80 && r.top < M.vh - 90 && r.bottom > 90) out.push(r);
        });
        return out;
      } catch (e) { return []; }
    }
    /* Inside an opened page a visitor points at a picture, or reads on somewhere else down the page.
       They never park on a paragraph: with no picture in view they move on, or wait in the right gutter. */
    function pickInFrame(g) {
      var fr = frameNow.getBoundingClientRect(), z = zone();
      g.targetEl = null;
      var media = frameMedia();
      if (media.length && Math.random() < (g.isBot ? 0.9 : 0.5)) {
        var m = pick(media);
        g.tx = clamp(fr.left + m.left + m.width * rand(0.2, 0.8), z.l, z.r);
        g.twy = clamp(M.st + clamp(m.top + m.height * rand(0.2, 0.8), 70, M.vh - 70), 20, M.h - 20);
        g.read = g.twy;
        return;
      }
      advanceRead(g);
      g.tx = clamp(fr.right - rand(112, 150), z.l, z.r);
      var wy = g.read + rand(-M.vh * 0.3, M.vh * 0.5);
      if (!g.isBot && Math.abs(wy - (M.st + M.vh / 2)) < M.vh / 2) wy = M.st + M.vh * (Math.random() < 0.7 ? rand(1.2, 2.4) : -rand(0.4, 1.2));
      g.twy = clamp(wy, 20, M.h - 20);
      g.read = g.twy;
    }
    /* A simulated reader drifts down the page, sometimes back up, with their cursor near what they read */
    function advanceRead(g) {
      var step = rand(180, 760) * (Math.random() < 0.18 ? -0.6 : 1);
      g.read += step;
      if (M.loop) g.read = mod(g.read, M.h);
      else {
        if (g.read > M.h - M.vh * 0.4) g.read = rand(0, M.vh);
        if (g.read < 0) g.read = 0;
      }
    }
    function pickTarget(g) {
      measure();
      if (frameNow) { return pickInFrame(g); }
      if (distFromView(g.wy) < M.vh * 0.6 && Math.random() < 0.4) {
        var ts = visibleTargets();
        if (ts.length) {
          var t = pick(ts), r = t.getBoundingClientRect();
          g.targetEl = t;
          var zt = zone();
          g.tx = clamp(r.left + r.width * rand(0.2, 0.8), zt.l, zt.r);
          g.twy = toWorld(clamp(r.top + r.height * rand(0.15, 0.7), M.top + 40, M.top + M.vh - 50));
          g.read = g.twy;
          return;
        }
      }
      advanceRead(g);
      g.targetEl = null;
      var zz = zone();
      g.tx = rand(zz.l, zz.r);
      var wy = g.read + rand(-M.vh * 0.3, M.vh * 0.5);
      g.twy = M.loop ? mod(wy, M.h) : clamp(wy, 20, M.h - 20);
    }
    function lineFor(g) {
      var a = g.targetEl && g.targetEl.closest && g.targetEl.closest('a[href]');
      var href = (a && a.getAttribute('href')) || location.pathname;
      if (Math.random() < 0.65) {
        for (var i = 0; i < CTX.length; i++) if (CTX[i][0].test(href)) return pick(CTX[i][1]);
      }
      return pick(GENERIC);
    }

    /* ---------- Chip ---------- */
    /* One chip, top right, in the same place on every page (rail pages and case studies alike) */
    var chip = document.createElement('div');
    var slot = document.getElementById('presenceSlot');
    chip.className = 'presence-chip' + (slot ? ' is-inline' : ' is-floating');
    (slot || document.body).appendChild(chip);
    function placeChip() {
      if (slot) return;
      var hd = document.querySelector('.site-header');
      var b = hd ? hd.getBoundingClientRect().bottom : 42;
      chip.style.top = Math.max(52, Math.round(b + 10)) + 'px'; /* always just under the header, top right */
    }
    placeChip();
    chip.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('.presence-ask')) { e.preventDefault(); if (window.BOARD.openGuide) window.BOARD.openGuide(); } });
    var frameN = 0;

    var sims = [], reals = {}, transport = null;
    function others() {
      var arr = sims.filter(function (s) { return s.here && !s.leaving && !s.isBot; });
      Object.keys(reals).forEach(function (k) { if (reals[k].here) arr.push(reals[k]); });
      return arr;
    }
    function renderChip() {
      var o = others();
      var html = '<span class="presence-av" style="--c:#ff5a1f" title="You">Y</span>';
      o.slice(0, 2).forEach(function (g) { html += '<span class="presence-av" style="--c:' + g.color + '">' + (g.name.replace(/\D+/g, '') || g.name.charAt(0)) + '</span>'; });
      if (o.length > 2) html += '<span class="presence-av presence-av--more" style="--c:#3a373d;color:#f4f2f4">+' + (o.length - 2) + '</span>';
      chip.innerHTML = '<span class="presence-avs">' + html + '</span><span class="presence-count">' + (o.length + 1) + ((o.length + 1) === 1 ? ' visitor' : ' visitors') + '</span>' +
        (botPeer ? '<button type="button" class="presence-ask" title="Ask muidemakz, the AI on this portfolio">Ask MM</button>' : '') +
        (CFG.chat ? '<kbd class="presence-key" title="Press / to chat">/</kbd>' : '');
      var realN = Object.keys(reals).length;
      chip.title = 'You (large mint cursor with a ring)' + (o.length ? ' and ' + o.length + ' other' + (o.length === 1 ? '' : 's') : '') +
        '. Others may be above or below you on the page, so scroll to find them.' +
        '';
    }

    /* ---------- Simulated visitors ---------- */
    /* The same visitors and the same count follow you from page to page (kept for the browser session) */
    var ss = { get: function (k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }, set: function (k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} } };
    var rosterSeed = parseInt(ss.get('board-seed'), 10);
    if (!(rosterSeed > 0)) { rosterSeed = 1 + Math.floor(Math.random() * 99999); ss.set('board-seed', String(rosterSeed)); }
    if (CFG.simulated) {
            sims = [1, 2, 3, 4].map(function (n) { return new Peer({ name: 'Visitor ' + n, color: PALETTE[(n - 1 + rosterSeed) % PALETTE.length] }); });
    }
    /* ---------- The AI guide: one clearly labelled bot visitor that answers when you chat ---------- */
    var botPeer = null, botBusy = false;
    if (CFG.bot && CFG.bot.endpoint && CFG.chat) {
      botPeer = new Peer({ name: String(CFG.bot.name || 'AI guide').slice(0, 14), color: '#8fd3f4' });
      botPeer.isBot = true;
      botPeer.el.classList.add('pc--bot');
      botPeer.el.title = 'Click to ask muidemakz, the AI on this portfolio';
      botPeer.el.addEventListener('mouseenter', function () { botPeer.hold = true; });
      botPeer.el.addEventListener('mouseleave', function () { botPeer.hold = false; });
      botPeer.el.addEventListener('click', function (e) { e.preventDefault(); openGuide(botPeer.q); });
      /* What the MM cursor says while it waits. Each line fits the page you are on, and clicking it
         opens the chat with that question already asked. Every line is backed by an answer in KB. */
      var PROMPTS = [
        [/about/, 'I like strategy games. Ask me', 'What do you do outside work?'],
        [/fundall|moniepoint|nsimbi/, 'This one speaks to fintech. Ask me', 'What has he built in fintech?'],
        [/valideity|cancel-flow/, 'I am building this one now. Ask me', 'What are you building now?'],
        [/work/, 'Which one first? Ask me', 'Which case study should I read first?'],
        [/./, 'Click to chat with MM', ''],
        [/./, 'Hiring? Ask if I fit', 'I am hiring. Is Excellent a fit?'],
        [/./, 'Not sure where to start? Ask me', 'Which case study should I read first?']
      ];
      var promptN = 0;
      var nextPrompt = function () {
        var where = location.hash || location.pathname;
        var fits = PROMPTS.filter(function (p) { return p[0].test(where); });
        var p = fits[promptN++ % fits.length];
        botPeer.label = p[1]; botPeer.q = p[2];
        if (!botPeer.el.classList.contains('is-chat')) botPeer.pill.textContent = botPeer.label;
      };
      nextPrompt();
      window.setInterval(function () { if (!document.hidden && !botPeer.hold) nextPrompt(); }, 7000);
      window.addEventListener('hashchange', function () { promptN = 0; nextPrompt(); });
      sims.push(botPeer);
    }
    function joinBot() {
      if (!botPeer || botPeer.here) return;
      measure();
      var W = window.innerWidth, x = Math.random() < 0.5 ? -10 : W + 10;
      var wy = clamp(toWorld(M.top + M.vh * rand(0.3, 0.7)), 20, Math.max(40, M.h - 20));
      botPeer.show(x, wy);
      var zb = zone(); botPeer.tx = rand(zb.l + (zb.r - zb.l) * 0.2, zb.l + (zb.r - zb.l) * 0.8); botPeer.twy = wy;
      botPeer.nextMove = performance.now() + rand(4000, 8000);
      botPeer.lastSeen = performance.now();
    }
    var DEMO = [
      [/resume|cv|hire|hiring|available/i, 'resume button is on the left, or say hi by email'],
      [/speech|order|voice/i, 'speech-to-order: complaint sessions reported 90% to 65%'],
      [/omnione|design system/i, 'omnione: one design system for four product teams'],
      [/moniepoint|verif/i, 'moniepoint is an independent concept, tested with simulated users'],
      [/sun king/i, 'sun king: independent rebuild, scored 76 before and 86 after'],
      [/fundall|salary/i, 'fundall: salary advance in the mobile app'],
      [/valideity/i, 'valideity is what excellent is building right now'],
      [/who|about|you/i, 'i am an ai guide. excellent is a senior product designer']
    ];
    function askBot(text) {
      if (!botPeer || botBusy) return;
      botBusy = true;
      if (!botPeer.here) joinBot();
      botPeer.say('…', {});
      var done = function (reply, delay) {
        window.setTimeout(function () {
          botBusy = false;
          botPeer.say(clean(reply) || 'hmm, not sure about that', { type: true });
        }, delay || 0);
      };
      var endpoint = CFG.bot.endpoint;
      if (endpoint === 'demo') {
        var hit = DEMO.filter(function (d) { return d[0].test(text); })[0];
        return done(hit ? hit[1] : 'i am an ai guide. ask me about a case study', rand(900, 1600));
      }
      var ctrl = window.AbortController ? new AbortController() : null;
      var timer = window.setTimeout(function () { if (ctrl) ctrl.abort(); }, 9000);
      fetch(endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ message: text, page: (document.title || '') + ' ' + (location.hash || location.pathname) }),
        signal: ctrl ? ctrl.signal : undefined
      }).then(function (r) { return r.ok ? r.json() : Promise.reject(); })
        .then(function (j) { window.clearTimeout(timer); done(j && j.reply); })
        .catch(function () { window.clearTimeout(timer); done('lost signal for a sec, try again'); });
    }

    if (botPeer) window.setTimeout(joinBot, 6000);
    var chatLock = false, joined = 0;

    function joinSim(s) {
      measure();
      var W = window.innerWidth, edge = pick(['l', 'r']);
      var x = edge === 'l' ? -10 : W + 10;
      var wy;
      if (joined === 0) wy = toWorld(M.top + M.vh * rand(0.25, 0.7));                 /* first one arrives on your screen */
      else if (joined === 1) wy = M.st + M.vh * rand(1.7, 3.0);                        /* second is further down: scroll to meet them */
      else wy = Math.random() < 0.5 ? toWorld(M.top + M.vh * rand(0.2, 0.8)) : M.st - M.vh * rand(0.8, 1.8);
      var first = joined === 0;
      joined++;
      wy = M.loop ? mod(wy, M.h) : clamp(wy, 20, M.h - 20);
      s.show(x, wy);
      s.read = wy;
      if (first) { var zf = zone(); s.tx = rand(zf.l + (zf.r - zf.l) * 0.2, zf.l + (zf.r - zf.l) * 0.8); s.twy = wy; } /* the first visitor glides in and stays in view for a moment */
      else pickTarget(s);
      s.nextMove = performance.now() + (first ? rand(4500, 6500) : rand(1400, 3000));
      s.nextChat = performance.now() + rand(9000, 24000);
      s.lastSeen = performance.now();
      renderChip();
    }
    function clickAway(g) {
      var rip = document.createElement('span');
      rip.className = 'pc-ripple';
      g.el.appendChild(rip);
      window.setTimeout(function () { if (rip.parentNode) rip.parentNode.removeChild(rip); }, 700);
      g.leaving = true;
      g.el.classList.add('is-gone');
      g.edge.classList.remove('is-on');
      renderChip();
      window.setTimeout(function () {
        g.hide(); g.leaving = false; g.el.classList.remove('is-gone');
        g.cool = performance.now() + rand(25000, 50000); /* they are reading the page they opened */
        renderChip();
        if (g.isBot) window.setTimeout(joinBot, rand(25000, 50000));
      }, 520);
    }
    function leaveSim(s) {
      s.leaving = true;
      var W = window.innerWidth;
      s.tx = Math.random() < 0.5 ? -50 : W + 50;
      renderChip();
      window.setTimeout(function () { s.hide(); s.leaving = false; renderChip(); }, 2400);
    }
    function reconcile() {
      var realN = Object.keys(reals).length;
      var target = Math.max(0, simWant - realN);
      var live = sims.filter(function (s) { return s.here && !s.leaving && !s.isBot; });
      var idle = sims.filter(function (s) { return !s.here && !s.leaving && !s.isBot && !(s.cool > performance.now()); });
      while (live.length < target && idle.length) { var j = idle.shift(); live.push(j); joinSim(j); } /* roster order, so the same faces show on every page */
      while (live.length > target) { var k = live.splice(Math.floor(Math.random() * live.length), 1)[0]; leaveSim(k); }
    }
    var simWant = parseInt(ss.get('board-want'), 10) || 2;
    function cycle() {
      var r = Math.random();
      simWant = r < 0.2 ? 1 : r < 0.72 ? 2 : 3;
      ss.set('board-want', String(simWant));
      reconcile();
      window.setTimeout(cycle, rand(14000, 32000));
    }

    measure();
    if (reduce) {
      sims.slice(0, 2).forEach(function (s, i) { s.show(window.innerWidth * (0.35 + 0.25 * i), toWorld(M.top + M.vh * (0.3 + 0.25 * i))); });
      renderChip();
    } else if (sims.length) {
      window.setTimeout(function () { reconcile(); }, 600);
      window.setTimeout(function () { if (!sims.some(function (s) { return s.here; })) reconcile(); }, 3000);
      window.setTimeout(cycle, rand(12000, 20000));
    }
    renderChip();

    /* ---------- Frame loop ---------- */
    var prev = performance.now();
    var haloX = mx, haloY = my;
    (function tick(ts) {
      var dt = Math.min(48, ts - prev); prev = ts;
      var k = 1 - Math.exp(-dt / 280);
      measure();
      if ((frameN++ & 15) === 0) placeChip();
      var vxMax = 1500 * dt / 1000, vyMax = 1100 * dt / 1000;
      function move(g, gain) {
        g.x += clamp((g.tx - g.x) * k * gain, -vxMax, vxMax);
        var dy = M.loop ? wrapDelta(g.twy - g.wy, M.h) : g.twy - g.wy;
        g.wy += clamp(dy * k * gain, -vyMax, vyMax);
        if (M.loop) g.wy = mod(g.wy, M.h);
      }
      sims.forEach(function (g) {
        if (!g.here) return;
        if (!g.leaving && !reduce && ts > g.nextMove) { pickTarget(g); g.nextMove = ts + rand(1800, 5200); }
        if (!reduce && !g.hold) move(g, 1);
        g.render();
        /* A finger shows only while this visitor is actually hovering something clickable */
        var dy = M.loop ? wrapDelta(g.twy - g.wy, M.h) : g.twy - g.wy;
        g.setHand(g.onScreen && !g.leaving && g.targetEl && clickable(g.targetEl) && Math.abs(g.tx - g.x) < 36 && Math.abs(dy) < 36);
        /* Now and then a visitor actually clicks into the thing they were pointing at: they leave this page */
        if (!g.hand) g.clickAt = 0;
        else if (!g.leaving && !reduce) {
          if (!g.clickAt) g.clickAt = Math.random() < 0.3 ? ts + rand(900, 1800) : -1;
          else if (g.clickAt > 0 && ts > g.clickAt) { g.clickAt = -1; clickAway(g); }
        }
        if (g.isBot) { /* the AI guide only speaks when spoken to */ }
        else if (!reduce && !g.leaving && !chatLock && !document.hidden && g.onScreen && ts > g.nextChat) {
          chatLock = true;
          g.say(lineFor(g), { type: true, done: function () { chatLock = false; } });
          g.nextChat = ts + rand(15000, 36000);
        } else if (ts > g.nextChat) g.nextChat = ts + 2500;
      });
      Object.keys(reals).forEach(function (id) {
        var g = reals[id];
        if (!g.here) return;
        move(g, 1.6);
        g.render();
        if (ts - g.lastSeen > 9000) { g.hide(); renderChip(); }
      });
      /* your halo trails your pointer slightly */
      var hk = reduce ? 1 : 1 - Math.exp(-dt / 70);
      haloX += (mx - haloX) * hk; haloY += (my - haloY) * hk;
      place(halo, haloX, haloY);
      window.requestAnimationFrame(tick);
    })(prev);

    /* ---------- Real visitors (transport) ---------- */
    var myId = Math.random().toString(36).slice(2, 10);
    var myMeta = (function () {
      var nm = 'Visitor ' + (10 + Math.floor(Math.random() * 90));
      return { id: myId, name: nm.slice(0, 14), color: pick(PALETTE) };
    })();
    var lastChatAt = 0;

    function loadScript(src, cb) {
      var s = document.createElement('script');
      s.src = src; s.async = true; s.onload = cb; s.onerror = function () {};
      document.head.appendChild(s);
    }

    function handlers() {
      return {
        peers: function (list) {
          var seen = {};
          list.forEach(function (m) {
            if (!m || m.id === myId) return;
            seen[m.id] = 1;
            if (!reals[m.id]) {
              var color = /^#[0-9a-f]{6}$/i.test(m.color || '') && m.color.toLowerCase() !== '#ff5a1f' ? m.color : pick(PALETTE);
              reals[m.id] = new Peer({ name: clean(m.name).slice(0, 14) || 'Guest', color: color, real: true });
            }
          });
          Object.keys(reals).forEach(function (id) {
            if (!seen[id]) { reals[id].destroy(); delete reals[id]; }
          });
          reconcile(); renderChip();
        },
        /* nx: 0..1 across the screen; ny: 0..1 down the page (or the loop) */
        cursor: function (id, nx, ny, hov) {
          var g = reals[id];
          if (!g || typeof nx !== 'number' || typeof ny !== 'number') return;
          g.lastSeen = performance.now();
          if (nx < 0) { g.hide(); renderChip(); return; }
          g.setHand(hov === true);
          measure();
          g.tx = clamp(nx, 0, 1) * window.innerWidth;
          g.twy = clamp(ny, 0, 1) * M.h;
          if (!g.here) { g.show(g.tx, g.twy); renderChip(); }
        },
        chat: function (id, text) {
          var g = reals[id];
          var t = clean(text);
          if (!g || !t || !CFG.chat) return;
          var now = performance.now();
          if (g.lastChatAt && now - g.lastChatAt < 1500) return; /* flood guard */
          g.lastChatAt = now;
          if (!g.here) g.show(g.tx, g.twy);
          g.say(t, {});
        }
      };
    }

    function localTransport(h) {
      var ch = new BroadcastChannel('board:' + location.pathname);
      var known = {};
      function roster() { return Object.keys(known).map(function (k) { return known[k]; }); }
      function hello() { ch.postMessage({ t: 'hello', m: myMeta }); }
      ch.onmessage = function (e) {
        var d = e.data || {};
        if (d.t === 'hello' && d.m) { var fresh = !known[d.m.id]; known[d.m.id] = d.m; h.peers(roster()); if (fresh) hello(); }
        else if (d.t === 'bye') { delete known[d.id]; h.peers(roster()); }
        else if (d.t === 'cursor') h.cursor(d.id, d.nx, d.ny, d.h);
        else if (d.t === 'chat') h.chat(d.id, d.text);
      };
      hello();
      var hb = window.setInterval(hello, 4000);
      return {
        cursor: function (nx, ny, hv) { ch.postMessage({ t: 'cursor', id: myId, nx: nx, ny: ny, h: !!hv }); },
        chat: function (text) { ch.postMessage({ t: 'chat', id: myId, text: text }); },
        close: function () { window.clearInterval(hb); ch.postMessage({ t: 'bye', id: myId }); ch.close(); }
      };
    }

    function supabaseTransport(h) {
      var api = { cursor: function () {}, chat: function () {}, close: function () {} };
      function connect() {
        var sb = window.supabase.createClient(CFG.realtime.url, CFG.realtime.key, { realtime: { params: { eventsPerSecond: 12 } } });
        var ch = sb.channel('board:' + location.pathname, { config: { presence: { key: myId }, broadcast: { self: false } } });
        ch.on('presence', { event: 'sync' }, function () {
          var st = ch.presenceState(), list = [];
          Object.keys(st).forEach(function (k) { if (st[k] && st[k][0]) list.push({ id: k, name: st[k][0].name, color: st[k][0].color }); });
          h.peers(list);
        });
        ch.on('broadcast', { event: 'cursor' }, function (m) { var p = m.payload || {}; h.cursor(p.id, p.nx, p.ny, p.h); });
        ch.on('broadcast', { event: 'chat' }, function (m) { var p = m.payload || {}; h.chat(p.id, p.text); });
        ch.subscribe(function (status) { if (status === 'SUBSCRIBED') ch.track({ name: myMeta.name, color: myMeta.color }); });
        api.cursor = function (nx, ny, hv) { ch.send({ type: 'broadcast', event: 'cursor', payload: { id: myId, nx: nx, ny: ny, h: !!hv } }); };
        api.chat = function (text) { ch.send({ type: 'broadcast', event: 'chat', payload: { id: myId, text: text } }); };
        api.close = function () { try { ch.unsubscribe(); } catch (e) {} };
      }
      if (window.supabase && window.supabase.createClient) connect();
      else loadScript('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js', function () { if (window.supabase) connect(); });
      return api;
    }

    var wantLocal = CFG.transport === 'local' || qs.get('board') === 'local';
    if (wantLocal && window.BroadcastChannel) transport = localTransport(handlers());
    else if (CFG.transport === 'supabase' && CFG.realtime && CFG.realtime.url && CFG.realtime.key) transport = supabaseTransport(handlers());

    /* ---------- Pointer tracking ---------- */
    var lastSend = 0;
    function sendCursor(force) {
      if (!transport || !mouseSeen) return;
      var now = performance.now();
      if (!force && now - lastSend < 70) return;
      lastSend = now;
      measure();
      transport.cursor(mx / window.innerWidth, toWorld(my) / M.h, myHover);
    }
    var myHover = false;
    function pointerMove(x, y, hov) {
      mx = x; my = y;
      myHover = !!hov;
      if (!mouseSeen) { mouseSeen = true; haloX = mx; haloY = my; halo.classList.add('is-on'); }
      halo.classList.add('is-on');
      if (me) place(me.el, mx, my);
      sendCursor(false);
    }
    window.addEventListener('mousemove', function (e) { pointerMove(e.clientX, e.clientY, clickable(e.target)); }, { passive: true });
    window.BOARD.pointer = pointerMove;
    /* Scrolling moves where your cursor is on the page, so tell others too */
    (useFeed ? feed : window).addEventListener('scroll', function () { sendCursor(false); }, { passive: true });
    window.addEventListener('mousedown', function () { halo.classList.add('is-down'); });
    window.addEventListener('mouseup', function () { halo.classList.remove('is-down'); });
    document.addEventListener('mouseleave', function () { halo.classList.remove('is-on'); if (transport) transport.cursor(-1, -1); });
    document.addEventListener('mouseenter', function () { if (mouseSeen) halo.classList.add('is-on'); });

    /* ---------- Cursor chat ("/") ---------- */
    var me = null;
    function closeChat() {
      if (!me) return;
      var m = me; me = null;
      m.el.classList.add('is-fading');
      window.setTimeout(function () { if (m.el.parentNode) m.el.parentNode.removeChild(m.el); }, 650);
    }
    function openChat() {
      if (me || !CFG.chat) return;
      var el = document.createElement('div');
      el.className = 'pc pc--me is-here';
      el.innerHTML = '<span class="pc-pill"><input type="text" maxlength="' + CFG.chatMax + '" placeholder="Say something…" aria-label="Cursor chat message, up to ' + CFG.chatMax + ' characters"><span class="pc-count" hidden></span></span>';
      overlay.appendChild(el);
      var input = el.querySelector('input'), count = el.querySelector('.pc-count');
      me = { el: el, input: input };
      place(el, mx, my);
      input.focus();
      input.addEventListener('input', function () {
        var n = input.value.length;
        count.hidden = n < Math.min(50, CFG.chatMax - 10);
        count.textContent = n + '/' + CFG.chatMax;
      });
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { e.preventDefault(); closeChat(); return; }
        if (e.key !== 'Enter') return;
        e.preventDefault();
        var text = clean(input.value);
        if (!text) { closeChat(); return; }
        var now = performance.now();
        if (now - lastChatAt < 2500) { input.style.opacity = '.55'; window.setTimeout(function () { input.style.opacity = ''; }, 400); return; }
        lastChatAt = now;
        var pill = el.querySelector('.pc-pill');
        pill.innerHTML = '';
        pill.appendChild(document.createTextNode(text));
        el.classList.add('is-sent');
        input.blur();
        if (transport) transport.chat(text);
        if (botPeer) askBot(text);
        var m = me;
        window.setTimeout(function () { if (me === m) closeChat(); }, 4600);
        if (!reduce && !botPeer) {
          var near = sims.filter(function (g) { return g.here && !g.leaving && g.onScreen; });
          var who = pick(near.length ? near : sims.filter(function (g) { return g.here && !g.leaving; }));
          if (who && !chatLock && !Object.keys(reals).length) {
            chatLock = true;
            window.setTimeout(function () { who.say(pick(REPLIES), { type: true, done: function () { chatLock = false; } }); }, rand(1400, 2800));
          }
        }
      });
      input.addEventListener('blur', function () { if (me && !me.el.classList.contains('is-sent') && !input.value) closeChat(); });
    }
    window.BOARD.openChat = openChat;
    document.addEventListener('keydown', function (e) {
      if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return;
      var t = e.target;
      if (t && (/^(input|textarea|select)$/i.test(t.tagName) || t.isContentEditable)) return;
      e.preventDefault();
      openChat();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
