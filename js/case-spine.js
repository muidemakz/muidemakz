/* One shared spine for every case study.
   Each section keeps its own heading, and gets a small step label above it (Summary, Problem, Research,
   Process, Decisions, Design, Outcome, Reflection), shown only where the step changes, so all 14 case
   studies read in the same order at a glance. A heading written as "Discovery · market research" is split:
   the part before the dot becomes the step label. No body text is touched. Runs after the layout scripts. */
(function () {
  var heads = document.querySelectorAll('.case-preview-content .case-preview-section-title');
  if (!heads.length) return;
  var STEPS = [
    ['', /other projects|related work|shipped work|sources and/],
    ['Outcome', /outcome|result|impact|measure|score|test showed|weakens|conclusion|where it stands|still open|usability insight|what this shows/],
    ['Reflection', /reflection|lesson|next step|future|explore|more time|what i would do next/],
    ['Decisions', /decision|trade|fixes|touches|notable changes|calibrated|evidence changed/],
    ['Research', /research|evidence|insight|discovery|first test|investigat|competitor|mood board|old screens|market|customer feedback|three runs/],
    ['Problem', /problem|challenge|dead end|premise|constraint|target user|users|why this flow/],
    ['Summary', /^summary|introduction|brief|goal|objective|before and after|made for|responsibilities/],
    ['Process', /process|how i|persona|architecture|design system|leadership|merger|implementation|rebuild|prompts|testing|my flow|my design flow|building/],
    ['Design', /design|screens|solution|journey|dashboard|redesign|language|features|edge case|shipped|flow/]
  ];
  function stepOf(t) {
    t = t.toLowerCase();
    for (var i = 0; i < STEPS.length; i++) if (STEPS[i][1].test(t)) return STEPS[i][0];
    return null;
  }
  var ORDER = ['Summary', 'Problem', 'Research', 'Process', 'Decisions', 'Design', 'Outcome', 'Reflection'];
  var max = -1;
  Array.prototype.forEach.call(heads, function (h) {
    var text = h.textContent.replace(/\s+/g, ' ').trim();
    var step = null;
    var parts = text.split(' · ');
    if (parts.length > 1 && /^(introduction|discovery|key decision|solution|outcome)$/i.test(parts[0])) {
      step = stepOf(parts[0]) || parts[0];
      var rest = parts.slice(1).join(' · ');
      h.textContent = rest.charAt(0).toUpperCase() + rest.slice(1);
    }
    if (step === null) step = stepOf(text);
    if (!step) return;
    var idx = ORDER.indexOf(step);
    /* the heading already says it ("Summary", "The problem"): no label needed */
    if (h.textContent.toLowerCase().replace(/^the /, '').indexOf(step.toLowerCase()) === 0) {
      /* a page that opens with its outcome uses it as the summary */
      max = max < 0 && step === 'Outcome' ? 0 : Math.max(max, idx);
      return;
    }
    /* only move forward through the steps, so the spine never jumps back */
    if (idx <= max) return;
    max = idx;
    var k = document.createElement('p');
    k.className = 'case-step';
    k.textContent = step;
    h.parentNode.insertBefore(k, h);
  });

  /* Phones: the section row scrolls sideways; keep the current section's pill in view */
  var tocList = document.querySelector('.case-preview-toc-list');
  if (tocList && window.MutationObserver) {
    var mq = window.matchMedia('(max-width: 900px)');
    new MutationObserver(function () {
      if (!mq.matches) return;
      var a = tocList.querySelector('a[aria-current="location"]');
      if (!a) return;
      var lr = tocList.getBoundingClientRect(), ar = a.getBoundingClientRect();
      tocList.scrollLeft += (ar.left - lr.left) - (lr.width - ar.width) / 2;
    }).observe(tocList, { subtree: true, attributes: true, attributeFilter: ['aria-current'] });
  }

  /* Notes to self ("[Add the release date…]", "… TO VERIFY") are hidden from visitors.
     Add ?notes=1 to the address to see them while filling them in. */
  var showNotes = /[?&]notes=1/.test(location.search) || /[?&]notes=1/.test(location.hash);
  var main = document.querySelector('.case-main');
  if (main && !showNotes) {
    Array.prototype.forEach.call(main.querySelectorAll('mark.case-preview-placeholder'), function (m) { m.remove(); });
    var walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
    var texts = [];
    while (walker.nextNode()) texts.push(walker.currentNode);
    texts.forEach(function (t) { if (/\[[^\]]{8,}\]/.test(t.nodeValue)) t.nodeValue = t.nodeValue.replace(/\s*\[[^\]]{8,}\]/g, ''); });
    Array.prototype.forEach.call(main.querySelectorAll('.case-status'), function (s) {
      s.textContent = s.textContent.split(/\s*·\s*/).filter(function (x) { return !/to (verify|confirm)|not isolated/i.test(x); }).join(' · ');
    });
    Array.prototype.forEach.call(main.querySelectorAll('p, li'), function (p) {
      var txt = p.textContent.replace(/\s+/g, ' ').trim();
      if (!txt || /^[a-z ]+:$/i.test(txt)) p.hidden = true; /* emptied, or only "Success target:" left */
    });
    Array.prototype.forEach.call(main.querySelectorAll('.case-flag-box'), function (b) {
      var label = (b.firstElementChild ? b.firstElementChild.textContent : b.textContent).replace(/\s+/g, ' ').trim();
      if (/still needed|to confirm|to verify|to complete|^todo/i.test(label) || !b.querySelector('p:not([hidden]), li:not([hidden]), img, figure, table')) b.hidden = true;
    });
  }

  /* Long supporting detail (method, sources, per-direction scores) folds behind a button,
     so the longest case studies read in about the same time as the rest. Nothing is removed. */
  var FOLD = /^(how i designed it|sources and prototypes|what the scores mean for each direction|one flow i calibrated|found, and still open)/i;
  Array.prototype.forEach.call(heads, function (h, n) {
    if (!FOLD.test(h.textContent.trim())) return;
    var rest = [];
    for (var el = h.nextElementSibling; el; el = el.nextElementSibling) rest.push(el);
    if (!rest.length) return;
    var box = document.createElement('div');
    box.className = 'case-fold';
    box.id = 'case-fold-' + n;
    box.hidden = true;
    rest.forEach(function (el) { box.appendChild(el); });
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'case-fold-toggle';
    b.setAttribute('aria-expanded', 'false');
    b.setAttribute('aria-controls', box.id);
    b.textContent = 'Show the detail';
    b.addEventListener('click', function () {
      var open = box.hidden;
      box.hidden = !open;
      b.setAttribute('aria-expanded', String(open));
      b.textContent = open ? 'Hide the detail' : 'Show the detail';
    });
    h.insertAdjacentElement('afterend', b);
    b.insertAdjacentElement('afterend', box);
  });
})();
