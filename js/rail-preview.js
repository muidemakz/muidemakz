/* Sidebar for the rail previews (home, All work, About).
   Renders the app-style sidebar into <aside id="rail" data-active="home|work|about">, and handles:
   - collapse to an icon strip (button, saved)
   - focus mode: hide every panel so the canvas is the whole page (button or Ctrl/Cmd + \)
   - light / dark theme (button, saved)
   A tiny inline script in each page's <head> applies the saved state before first paint. */
(function () {
  var rail = document.getElementById('rail');
  if (!rail) return;
  var root = document.documentElement;
  if (root.classList.contains('embed')) { rail.parentNode.removeChild(rail); return; } /* inside the shell: no sidebar */
  var active = rail.getAttribute('data-active') || '';

  var I = {
    panel: '<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M9 4v16"/>',
    focus: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4"/>',
    moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
    home: '<path d="M4 11l8-7 8 7"/><path d="M6 10v10h12V10"/>',
    grid: '<rect x="4" y="4" width="7" height="7" rx="1.6"/><rect x="13" y="4" width="7" height="7" rx="1.6"/><rect x="4" y="13" width="7" height="7" rx="1.6"/><rect x="13" y="13" width="7" height="7" rx="1.6"/>',
    user: '<circle cx="12" cy="8.5" r="3.6"/><path d="M5 20c.8-4 3.6-6 7-6s6.2 2 7 6"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M4 7l8 6 8-6"/>',
    doc: '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4M10 12h5M10 16h5"/>'
  };
  function icon(name) { return '<svg viewBox="0 0 24 24" aria-hidden="true">' + I[name] + '</svg>'; }

  var NAV = [
    ['work', 'my-work.html', 'All work', 'grid'],
    ['about', 'about.html', 'About', 'user']
  ];
  var nav = NAV.map(function (n) {
    return '<a href="' + n[1] + '" title="' + n[2] + '"' + (n[0] === active ? ' aria-current="page"' : '') + '>' + icon(n[3]) + '<span>' + n[2] + '</span></a>';
  }).join('');

  rail.setAttribute('aria-label', 'Excellent Makanju');
  rail.innerHTML =
    '<div class="rail-top">' +
      '<p class="rail-status">Senior Product Designer &middot; Building Valideity</p>' +
      '<div class="rail-tools">' +
        '<button class="rail-btn rail-btn--layout" type="button" data-act="toggle" aria-label="Collapse sidebar" aria-expanded="true" title="Collapse sidebar">' + icon('panel') + '</button>' +
        '<button class="rail-btn rail-btn--layout" type="button" data-act="focus" aria-label="Focus mode: show only the canvas" title="Focus mode (Ctrl + \\)">' + icon('focus') + '</button>' +
        '<button class="rail-btn" type="button" data-act="theme" aria-label="Switch to light mode" title="Light / dark">' + icon('sun') + '</button>' +
      '</div>' +
    '</div>' +
    '<div class="rail-full rail-intro">' +
      '<h1 class="rail-name"><a href="index.html">Excellent Makanju<span>.</span></a></h1>' +
      '<p class="rail-bio">I turn <strong>complex financial products</strong> and B2B workflows into clear, usable experiences.</p>' +
    '</div>' +
    '<nav class="rail-nav" aria-label="Main">' + nav + '</nav>' +
    '<div class="rail-full rail-cta">' +
      '<a class="btn btn--light" href="mailto:muidemakz@gmail.com">Say hi &#9993;</a>' +
      '<a class="btn btn--dark" href="resume.html">Resume</a>' +
    '</div>' +
    '<ul class="rail-full rail-links">' +
      '<li><a href="https://www.linkedin.com/in/makanju-excellent-211b0a44/" target="_blank" rel="noopener">LinkedIn <span>&#8599;</span></a></li>' +
      '<li><a href="https://dribbble.com/muidemakz" target="_blank" rel="noopener">Dribbble <span>&#8599;</span></a></li>' +
      '<li><a href="https://www.behance.net/oemakanju" target="_blank" rel="noopener">Behance <span>&#8599;</span></a></li>' +
      '<li><a href="https://www.instagram.com/oluwaexcellent" target="_blank" rel="noopener">Instagram <span>&#8599;</span></a></li>' +
    '</ul>' +
    '<div class="rail-mini">' +
      '<a class="rail-btn" href="mailto:muidemakz@gmail.com" aria-label="Say hi by email" title="Say hi">' + icon('mail') + '</a>' +
      '<a class="rail-btn" href="resume.html" aria-label="Resume" title="Resume">' + icon('doc') + '</a>' +
    '</div>';

  /* Button to bring the panels back while in focus mode */
  var peek = document.createElement('button');
  peek.type = 'button';
  peek.className = 'rail-peek rail-btn';
  peek.setAttribute('aria-label', 'Show panels');
  peek.title = 'Show panels (Ctrl + \\)';
  peek.innerHTML = icon('panel');
  document.body.appendChild(peek);

  /* ---------- State ---------- */
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  var mode = store.get('ui-rail') || 'open';
  var before = store.get('ui-rail-prev') || 'open';
  if (mode === 'focus' && before === 'focus') before = 'open';

  var toggleBtn = rail.querySelector('[data-act="toggle"]');
  var themeBtn = rail.querySelector('[data-act="theme"]');

  function setMode(m) {
    if (m === 'focus' && mode !== 'focus') { before = mode; store.set('ui-rail-prev', before); }
    mode = m;
    store.set('ui-rail', mode);
    root.classList.toggle('rail-collapsed', mode === 'collapsed');
    root.classList.toggle('focus-mode', mode === 'focus');
    var collapsed = mode === 'collapsed';
    toggleBtn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
    toggleBtn.setAttribute('aria-label', collapsed ? 'Expand sidebar' : 'Collapse sidebar');
    toggleBtn.title = collapsed ? 'Expand sidebar' : 'Collapse sidebar';
    peek.style.display = mode === 'focus' ? '' : 'none';
    rail.toggleAttribute('inert', mode === 'focus');
    /* the board reflows when the canvas width changes */
    window.setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 340);
  }
  function setTheme(t) {
    if (t === 'light') root.setAttribute('data-theme', 'light'); else root.removeAttribute('data-theme');
    store.set('ui-theme', t);
    themeBtn.innerHTML = icon(t === 'light' ? 'moon' : 'sun');
    themeBtn.setAttribute('aria-label', t === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
    if (window.BOARD && window.BOARD.refreshTheme) window.BOARD.refreshTheme();
  }

  rail.addEventListener('click', function (e) {
    var b = e.target.closest('[data-act]');
    if (!b) return;
    var act = b.getAttribute('data-act');
    if (act === 'toggle') setMode(mode === 'collapsed' ? 'open' : 'collapsed');
    else if (act === 'focus') setMode('focus');
    else if (act === 'theme') setTheme(root.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
  });
  peek.addEventListener('click', function () { setMode(before === 'focus' ? 'open' : before); });
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && (e.key === '\\' || e.code === 'Backslash')) {
      e.preventDefault();
      setMode(mode === 'focus' ? (before === 'focus' ? 'open' : before) : 'focus');
    }
  });

  setMode(mode);
  setTheme(store.get('ui-theme') === 'light' ? 'light' : 'dark');
})();
