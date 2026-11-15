/* Intro animation for the rail previews: the name, bio and About headline rise in word by
   word, then the buttons and links settle in. About 1.2 seconds in total, once per load.
   Skipped for reduced motion. If this script never runs, the text is simply there. */
(function () {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var root = document.documentElement;
  var n = 0;

  function splitWords(el, startAt) {
    var i = startAt;
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (c) {
        if (c.nodeType === 3) {
          var parts = c.nodeValue.split(/(\s+)/);
          var frag = document.createDocumentFragment();
          parts.forEach(function (p) {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(p)); return; }
            var s = document.createElement('span');
            s.className = 'iw';
            s.style.setProperty('--i', i++);
            s.textContent = p;
            frag.appendChild(s);
          });
          c.parentNode.replaceChild(frag, c);
        } else if (c.nodeType === 1 && !/^(script|style)$/i.test(c.tagName)) walk(c);
      });
    })(el);
    return i;
  }

  n = splitWords(document.querySelector('.rail-name') || document.createElement('i'), 0);
  var bioStart = n + 1;
  var bio = document.querySelector('.rail-bio');
  if (bio) n = splitWords(bio, bioStart);
  var ab = document.querySelector('.ab-title');
  if (ab) { var a = splitWords(ab, 1); var tag = document.querySelector('.ab-tagline'); if (tag) splitWords(tag, a + 1); }
  root.classList.add('intro-run');
})();
