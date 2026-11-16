/* Runs inside pages that are opened in the shell's container (?embed=1).
   - marks the page as embedded so its own header and footer are hidden
   - keeps the theme in sync when the header toggle is used
   - hands clicks on internal links to the shell, so everything opens inside the container
   - forwards the pointer and the "/" key so the shell can draw visitors and cursor chat on top */
(function () {
  if (!/[?&]embed=1/.test(location.search) || window.top === window.self) return;
  var root = document.documentElement;
  root.classList.add('embed');
  /* initial theme */
  try { if (localStorage.getItem('ui-theme') === 'light') root.setAttribute('data-theme', 'light'); } catch (x) {}

  function post(m) { try { window.parent.postMessage(m, location.origin); } catch (e) {} }

  window.addEventListener('storage', function (e) {
    if (e.key !== 'ui-theme') return;
    if (e.newValue === 'light') root.setAttribute('data-theme', 'light'); else root.removeAttribute('data-theme');
    if (window.BOARD && window.BOARD.refreshTheme) window.BOARD.refreshTheme();
  });

  /* Do not make the visitor wait for every image: the page can be shown once its HTML is in */
  function ready() { post({ t: 'embed-ready' }); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready); else ready();

  var raf = 0, last = null;
  document.addEventListener('mousemove', function (e) {
    last = e;
    if (raf) return;
    raf = window.requestAnimationFrame(function () {
      raf = 0;
      var t = last.target;
      post({ t: 'board-pointer', x: last.clientX, y: last.clientY, h: !!(t && t.closest && t.closest('a[href], button, [role="button"], summary, label')) });
    });
  }, { passive: true });

  document.addEventListener('keydown', function (e) {
    var tag = (e.target && e.target.tagName) || '';
    if (e.key === '/' && !e.metaKey && !e.ctrlKey && !e.altKey && !/^(input|textarea|select)$/i.test(tag)) {
      e.preventDefault();
      post({ t: 'board-key', k: '/' });
    } else if (e.key === 'Escape') post({ t: 'key', k: 'Escape' });
  });

  document.addEventListener('click', function (e) {
    if (e.target && e.target.closest && e.target.closest('.card-rx')) return; /* reactions count on a Work card */
    var a = e.target && e.target.closest && e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
    var raw = a.getAttribute('href') || '';
    if (/^(mailto:|tel:|#|javascript:)/i.test(raw) || a.hasAttribute('download') || a.target === '_blank') return;
    if (/\.(pdf|zip|png|jpe?g|mp4)(\?|$)/i.test(raw)) return;
    try { if (new URL(a.href, location.href).origin !== location.origin) return; } catch (err) { return; }
    e.preventDefault();
    e.stopPropagation();
    if (a.classList.contains('case-back')) post({ t: 'board-back' });
    else post({ t: 'open', href: raw });
  }, true);
})();
