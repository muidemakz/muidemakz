/* New case-study layout for every page except Speech-to-Order (which has its own script):
   the section shortcuts become a "On this page" list on the LEFT, the sections sit in a content
   column on the right. It only moves existing sections and re-tags their own labels as headings.
   No text is rewritten and no evidence labels are added. Reuses the styles in css/case-study-preview.css. */
(function () {
  var main = document.querySelector(".case-main");
  var hero = main && main.querySelector(":scope > .case-hero");
  var nav = main && main.querySelector(":scope > .case-quicknav");
  if (!main || !hero || !nav) return;

  var navWrap = nav.querySelector(".wrap");
  var items = Array.from(navWrap.querySelectorAll('a[href^="#"]')).map(function (a) {
    return { id: a.getAttribute("href").slice(1), title: a.textContent.trim() };
  }).filter(function (it) { return document.getElementById(it.id); });
  if (!items.length) return;

  var layout = document.createElement("div");
  layout.className = "case-preview-layout";
  var content = document.createElement("article");
  content.className = "case-preview-content";

  nav.setAttribute("aria-label", "On this page");
  navWrap.replaceChildren();
  var label = document.createElement("p");
  label.className = "case-preview-nav-label";
  label.textContent = "On this page";

  var toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "case-toc-toggle";
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-controls", "case-toc-list");
  var toggleText = document.createElement("span");
  toggleText.className = "case-toc-toggle-text";
  var toggleLabel = document.createElement("span");
  toggleLabel.className = "case-toc-toggle-label";
  toggleLabel.textContent = "On this page";
  var toggleCurrent = document.createElement("span");
  toggleCurrent.className = "case-toc-toggle-current";
  toggleCurrent.textContent = items[0].title;
  toggleText.append(toggleLabel, toggleCurrent);
  var chevron = document.createElement("span");
  chevron.className = "case-toc-toggle-chevron";
  chevron.setAttribute("aria-hidden", "true");
  toggle.append(toggleText, chevron);

  var list = document.createElement("div");
  list.className = "case-preview-toc-list";
  list.id = "case-toc-list";
  items.forEach(function (it) {
    var a = document.createElement("a");
    a.href = "#" + it.id;
    var t = document.createElement("span");
    t.className = "case-toc-title";
    t.textContent = it.title;
    a.appendChild(t);
    list.appendChild(a);
  });
  navWrap.append(label, toggle, list);

  /* Everything after the shortcuts, in its original order, goes in the content column */
  var after = [];
  for (var n = nav.nextElementSibling; n; n = n.nextElementSibling) after.push(n);
  after.forEach(function (el) {
    if (el.matches("section, div, footer, aside, article")) content.appendChild(el);
  });

  /* Each section's own small label becomes its real heading (same words, proper tag) */
  Array.prototype.forEach.call(content.querySelectorAll(":scope > section > .wrap > .case-label"), function (lab) {
    var h = document.createElement("h2");
    h.className = "case-preview-section-title";
    h.textContent = lab.textContent;
    lab.replaceWith(h);
  });

  layout.append(nav, content);
  hero.insertAdjacentElement("afterend", layout);

  /* Mobile: the list collapses into a single control */
  function setOpen(open) {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  }
  toggle.addEventListener("click", function () { setOpen(toggle.getAttribute("aria-expanded") !== "true"); });
  document.addEventListener("pointerdown", function (e) { if (nav.classList.contains("is-open") && !nav.contains(e.target)) setOpen(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && nav.classList.contains("is-open")) setOpen(false); });

  var links = Array.from(list.querySelectorAll("a"));
  var sections = items.map(function (it) { return document.getElementById(it.id); });
  links.forEach(function (a) {
    a.addEventListener("click", function () { if (window.matchMedia("(max-width: 900px)").matches) setOpen(false); });
  });
  var active = -1;
  function update() {
    var trigger = window.innerHeight * 0.32, next = 0;
    sections.forEach(function (s, i) { if (s && s.getBoundingClientRect().top <= trigger) next = i; });
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) next = links.length - 1;
    if (next === active) return;
    active = next;
    toggleCurrent.textContent = items[next].title;
    links.forEach(function (a, i) { if (i === next) a.setAttribute("aria-current", "location"); else a.removeAttribute("aria-current"); });
  }
  var ticking = false;
  window.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () { update(); ticking = false; });
  }, { passive: true });
  window.addEventListener("resize", update);
  update();
})();
