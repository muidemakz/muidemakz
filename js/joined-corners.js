/* Cards that sit edge to edge (stacked or in a grid) read as one block: only the outer corners of the block are
   round, the corners where cards meet stay flat. Works from the real layout, so it follows every breakpoint.
   Cards with a clear gap between them keep all four corners. */
(function () {
  var KIDS = '.case-edge, .case-stack-panel, .case-stack, .mv-score, .ns-cap-card, .ns-touch, .mv-decision, .vx-opt, .case-leadership, .case-user-card';
  var GAP = 8; /* closer than this counts as touching */
  var timer = 0;

  function box(el) { return { l: el.offsetLeft, t: el.offsetTop, r: el.offsetLeft + el.offsetWidth, b: el.offsetTop + el.offsetHeight }; }
  function overlapX(a, b) { return Math.min(a.r, b.r) - Math.max(a.l, b.l) > 8; }
  function overlapY(a, b) { return Math.min(a.b, b.b) - Math.max(a.t, b.t) > 8; }

  function apply() {
    var groups = [];
    Array.prototype.forEach.call(document.querySelectorAll(KIDS), function (k) {
      var p = k.parentElement;
      if (p && groups.indexOf(p) < 0) groups.push(p);
    });
    groups.forEach(function (p) {
      var kids = Array.prototype.filter.call(p.children, function (c) { return c.matches(KIDS) && c.offsetWidth > 40 && c.offsetHeight > 24; });
      kids.forEach(function (c) { c.style.removeProperty('border-radius'); });
      if (kids.length < 2) return;
      var boxes = kids.map(box);
      kids.forEach(function (c, i) {
        var a = boxes[i], up = false, down = false, left = false, right = false;
        boxes.forEach(function (d, j) {
          if (i === j) return;
          if (overlapX(a, d) && Math.abs(a.t - d.b) <= GAP) up = true;
          if (overlapX(a, d) && Math.abs(d.t - a.b) <= GAP) down = true;
          if (overlapY(a, d) && Math.abs(a.l - d.r) <= GAP) left = true;
          if (overlapY(a, d) && Math.abs(d.l - a.r) <= GAP) right = true;
        });
        if (!(up || down || left || right)) return;
        var cs = getComputedStyle(c);
        var R = Math.max(parseFloat(cs.borderTopLeftRadius) || 0, parseFloat(cs.borderTopRightRadius) || 0, parseFloat(cs.borderBottomLeftRadius) || 0, parseFloat(cs.borderBottomRightRadius) || 0) || 16;
        var tl = !(up || left) ? R : 0, tr = !(up || right) ? R : 0, br = !(down || right) ? R : 0, bl = !(down || left) ? R : 0;
        c.style.setProperty('border-radius', tl + 'px ' + tr + 'px ' + br + 'px ' + bl + 'px', 'important');
      });
    });
  }
  function soon() { clearTimeout(timer); timer = setTimeout(apply, 80); }
  window.addEventListener('resize', soon);
  window.addEventListener('load', function () { apply(); setTimeout(apply, 600); setTimeout(apply, 1800); });
  if (window.ResizeObserver) { var ro = new ResizeObserver(soon); ro.observe(document.body); }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(soon);
  if (document.readyState !== 'loading') soon(); else document.addEventListener('DOMContentLoaded', soon);
})();
