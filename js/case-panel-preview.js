/* Collapsible contents menu for the updated case study previews.
   Shares its state with the rail previews (localStorage "ui-rail": open | collapsed | focus):
   collapsed shrinks the menu to a slim button, focus hides it so the case study fills the page.
   Ctrl/Cmd + \ toggles focus, the same shortcut as on the rail pages. Desktop only. */
(function () {
  var layout = document.querySelector('.case-preview-layout');
  var nav = document.querySelector('.case-quicknav');
  if (!layout || !nav) return;
  var root = document.documentElement;
  var wrap = nav.querySelector('.wrap') || nav;

  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  function svg(inner) { return '<svg viewBox="0 0 24 24" aria-hidden="true">' + inner + '</svg>'; }
  var PANEL = svg('<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M9 4v16"/>');
  var FOCUS = svg('<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>');

  var tools = document.createElement('div');
  tools.className = 'case-panel-tools';
  tools.innerHTML =
    '<button type="button" class="case-panel-btn" data-act="toggle" aria-label="Collapse contents" aria-expanded="true" title="Collapse contents">' + PANEL + '</button>' +
    '<button type="button" class="case-panel-btn" data-act="focus" aria-label="Focus mode: show only the case study" title="Focus mode (Ctrl + \\)">' + FOCUS + '</button>';
  wrap.insertBefore(tools, wrap.firstChild);

  var peek = document.createElement('button');
  peek.type = 'button';
  peek.className = 'case-panel-btn case-panel-peek';
  peek.setAttribute('aria-label', 'Show contents');
  peek.title = 'Show contents (Ctrl + \\)';
  peek.innerHTML = PANEL;
  document.body.appendChild(peek);

  var mode = store.get('ui-rail') || 'open';
  var before = store.get('ui-rail-prev') || 'open';
  if (before === 'focus') before = 'open';
  var toggleBtn = tools.querySelector('[data-act="toggle"]');

  function placePeek() {
    var hd = document.querySelector('.site-header');
    peek.style.top = Math.round((hd ? hd.getBoundingClientRect().bottom : 42) + 12) + 'px';
  }
  function setMode(m) {
    if (m === 'focus' && mode !== 'focus') { before = mode; store.set('ui-rail-prev', before); }
    mode = m;
    store.set('ui-rail', mode);
    root.classList.toggle('rail-collapsed', mode === 'collapsed');
    root.classList.toggle('focus-mode', mode === 'focus');
    var c = mode === 'collapsed';
    toggleBtn.setAttribute('aria-expanded', c ? 'false' : 'true');
    toggleBtn.setAttribute('aria-label', c ? 'Expand contents' : 'Collapse contents');
    toggleBtn.title = c ? 'Expand contents' : 'Collapse contents';
    peek.style.display = mode === 'focus' ? '' : 'none';
    placePeek();
  }
  tools.addEventListener('click', function (e) {
    var b = e.target.closest('[data-act]');
    if (!b) return;
    if (b.getAttribute('data-act') === 'toggle') setMode(mode === 'collapsed' ? 'open' : 'collapsed');
    else setMode('focus');
  });
  peek.addEventListener('click', function () { setMode(before === 'focus' ? 'open' : before); });
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && (e.key === '\\' || e.code === 'Backslash')) {
      e.preventDefault();
      setMode(mode === 'focus' ? (before === 'focus' ? 'open' : before) : 'focus');
    }
  });
  window.addEventListener('scroll', placePeek, { passive: true });
  window.addEventListener('resize', placePeek);
  setMode(mode);
})();
