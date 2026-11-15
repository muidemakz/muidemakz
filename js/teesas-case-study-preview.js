(function () {
  var main = document.querySelector(".case-main");
  var hero = main && main.querySelector(":scope > .case-hero");
  var nav = main && main.querySelector(":scope > .case-quicknav");
  if (!main || !hero || !nav) return;

  function makeSubheading(text) {
    var heading = document.createElement("h3");
    heading.className = "case-preview-subheading";
    heading.textContent = text;
    return heading;
  }

  function mergeSection(sourceId, targetId, subheading) {
    var source = document.getElementById(sourceId);
    var target = document.getElementById(targetId);
    if (!source || !target) return;
    var sourceWrap = source.querySelector(":scope > .wrap");
    var targetWrap = target.querySelector(":scope > .wrap");
    if (!sourceWrap || !targetWrap) return;
    var sourceLabel = sourceWrap.querySelector(":scope > .case-label");
    if (sourceLabel) sourceLabel.replaceWith(makeSubheading(subheading));
    Array.from(sourceWrap.children).forEach(function (child) { targetWrap.appendChild(child); });
    source.remove();
  }

  var goals = document.getElementById("goals");
  var summary = document.getElementById("summary");
  var users = document.getElementById("users");
  var discovery = document.getElementById("discovery");
  var process = document.getElementById("process");
  var ownership = document.getElementById("ownership");

  if (goals) {
    var duplicateImpact = goals.querySelector(":scope > .wrap > .case-impact");
    if (duplicateImpact) duplicateImpact.remove();
  }
  var impactWrap = document.querySelector("#impact > .wrap");
  if (impactWrap) {
    var impactCopy = impactWrap.querySelector(":scope > .case-copy");
    if (impactCopy) impactCopy.textContent = "Teesas internal reporting lists these V4 product measures. The figures do not isolate design's contribution, and the exact reporting period and populations still need confirmation.";
    var impactFigures = impactWrap.querySelector(":scope > .case-figures");
    var evidenceKey = document.createElement("div");
    evidenceKey.className = "case-evidence-key";
    evidenceKey.innerHTML = '<span><strong>Measured · V4</strong> Teesas internal product reporting, exact period and population to confirm</span><span class="predicted"><strong>Predicted</strong> No AI simulated results used in this case study</span>';
    if (impactFigures) impactFigures.insertAdjacentElement("beforebegin", evidenceKey);
  }
  if (summary && users) {
    var summaryFlag = summary.querySelector(":scope > .wrap > .case-flag-box");
    if (summaryFlag) users.querySelector(":scope > .wrap").appendChild(summaryFlag);
  }
  mergeSection("summary", "goals", "My role and ownership");
  if (users) {
    var usersWrap = users.querySelector(":scope > .wrap");
    var usersLabel = usersWrap && usersWrap.querySelector(":scope > .case-label");
    if (usersLabel) usersLabel.replaceWith(makeSubheading("The four user groups"));
  }
  mergeSection("discovery", "users", "Research and investigation");
  mergeSection("ownership", "process", "Leadership and cross functional delivery");

  var versionCopy = document.querySelector("#versions > .wrap > .case-copy");
  if (versionCopy) {
    versionCopy.textContent = "V1, V2, and V3 show how the product evolved. V4 is told below through the shipped product areas represented in the screenshots.";
  }
  var versionFlag = document.querySelector("#versions .case-flag-box");
  if (versionFlag) {
    var versionFlagLabel = versionFlag.querySelector(".case-flag-label");
    var versionFlagCopy = versionFlag.querySelector(".case-flag-copy");
    if (versionFlagLabel) versionFlagLabel.textContent = "V4 evidence to complete";
    if (versionFlagCopy) versionFlagCopy.textContent = "[For each V4 product area, add the user problem, supporting evidence, design choice and trade off, validation, and the engineering detail that shaped what shipped.]";
  }

  var currentGalleryLabel = document.querySelector("#screens .case-loop-label");
  if (currentGalleryLabel) currentGalleryLabel.textContent = "V4 · Teacher portal";

  var decisionBlock = document.getElementById("decision");
  var decisionSection = null;
  if (decisionBlock) {
    decisionSection = document.createElement("section");
    decisionSection.className = "case-section";
    decisionSection.id = "decision";
    var decisionWrap = document.createElement("div");
    decisionWrap.className = "wrap";
    decisionSection.appendChild(decisionWrap);
    decisionWrap.appendChild(decisionBlock);
    decisionBlock.removeAttribute("id");
    var parent = document.getElementById("versions");
    if (parent) parent.insertAdjacentElement("afterend", decisionSection);
  }

  var screens = document.getElementById("screens");
  if (screens) {
    var screenLabel = screens.querySelector(":scope > .wrap > .case-label");
    if (screenLabel) screenLabel.textContent = "V4 shipped experience, by product area";
    var carouselCaption = screens.querySelector(".case-walkthrough figcaption");
    if (carouselCaption) carouselCaption.textContent = "V4 · Teacher, student and parent portals";

    var evidencePanel = document.createElement("section");
    evidencePanel.className = "case-evidence-panel";
    evidencePanel.innerHTML = '<h3 class="case-preview-subheading">Senior design evidence to add</h3><p class="case-copy">The V4 images are grouped by product area. These prompts make the reasoning, validation, ownership, and delivery visible without filling in facts we do not have.</p><div class="case-evidence-grid"><article><h4>Problem and evidence</h4><p>[Add the user task, research method, participant sample, date, and finding for each area.]</p></article><article><h4>Decision and trade off</h4><p>[Add the key choice, the alternative considered, and why the chosen approach best served the user and school.]</p></article><article><h4>Build and iteration</h4><p>[Add what you personally designed, what engineering shaped, what changed during implementation, and what shipped.]</p></article><article><h4>Success and attribution</h4><p>[Connect each relevant result to its version, baseline, target, measurement period, source, and contribution.]</p></article></div>';
    var firstFigureGroup = screens.querySelector(":scope > .wrap > .case-figures");
    if (firstFigureGroup) firstFigureGroup.insertAdjacentElement("beforebegin", evidencePanel);

    var areaPrompts = {
      "Onboarding": "[Add the first setup task, the onboarding choice, the usability check, and what changed after it.]",
      "Dashboard": "[Add how the primary task was ranked for each role, the evidence behind that order, and one trade off.]",
      "Sessions & Timetables": "[Add the scheduling task, the constraint that shaped the flow, and how teacher feedback changed it.]",
      "Classes & Subjects": "[Add the school setup need, an edge case across institutions, and how the final workflow handled it.]",
      "Roles & Permissions": "[Add the access rules, the role combinations tested, and the implementation detail that shipped.]",
      "Teacher Portal": "[Add one high frequency teacher task, its baseline or success measure, and the validation result.]",
      "Student Portal": "[Add one student learning task, the evidence behind its design, and the usability or accessibility check.]",
      "Parent Portal": "[Add the parent information need, pilot denominator and period, and the source for the reported usage.]",
      "Other & Responsive Screens": "[Add the supported device widths, responsive decision, accessibility check, and engineering constraint.]"
    };
    screens.querySelectorAll(".case-figures--spaced .case-figure").forEach(function (figure) {
      var title = figure.querySelector(".case-figure-head-title");
      if (!title || !areaPrompts[title.textContent.trim()]) return;
      var details = document.createElement("details");
      details.className = "case-evidence-details";
      var summary = document.createElement("summary");
      summary.textContent = "Design evidence for this area";
      var copy = document.createElement("p");
      copy.textContent = areaPrompts[title.textContent.trim()];
      details.append(summary, copy);
      figure.appendChild(details);
    });
  }

  var future = main.querySelector(":scope > .case-section:not([id]):not(.case-other)");
  if (future) {
    future.id = "future";
    var nextRow = future.querySelector(".case-stack-row");
    var unrelatedArt = nextRow && nextRow.querySelector(".case-stack-panel");
    if (unrelatedArt) unrelatedArt.remove();
    if (nextRow) {
      nextRow.classList.add("case-next-layout");
      var illustration = document.createElement("figure");
      illustration.className = "case-stack-panel case-stack-panel--grey";
      var illustrationImage = document.createElement("img");
      illustrationImage.src = "images/teesas/future-directions-illustration.svg";
      illustrationImage.alt = "";
      var illustrationCaption = document.createElement("figcaption");
      illustrationCaption.textContent = "Explorations, not a committed roadmap";
      illustration.append(illustrationImage, illustrationCaption);
      nextRow.insertBefore(illustration, nextRow.firstChild);
    }
    var futureLabel = future.querySelector(":scope > .wrap > .case-label");
    if (futureLabel) futureLabel.textContent = "Next steps";
    var futureStack = future.querySelector(".case-stack");
    if (futureStack) futureStack.classList.add("case-next-cards");
  }

  var sectionConfig = [
    ["impact", "Outcome"],
    ["goals", "Goals and my role"],
    ["users", "Challenge and evidence"],
    ["versions", "Four versions"],
    ["decision", "Design decision"],
    ["process", "Build and delivery"],
    ["screens", "V4 product areas"],
    ["future", "Next steps"],
    ["reflection", "Reflection"]
  ];
  var navWrap = nav.querySelector(".wrap");
  var layout = document.createElement("div");
  layout.className = "case-preview-layout";
  var content = document.createElement("article");
  content.className = "case-preview-content teesas-preview-content";
  nav.setAttribute("aria-label", "On this page");
  navWrap.replaceChildren();
  var navLabel = document.createElement("p");
  navLabel.className = "case-preview-nav-label";
  navLabel.textContent = "On this page";
  var navToggle = document.createElement("button");
  navToggle.type = "button";
  navToggle.className = "case-toc-toggle";
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-controls", "teesas-toc-list");
  navToggle.setAttribute("aria-label", "Show page sections");
  var toggleText = document.createElement("span");
  toggleText.className = "case-toc-toggle-text";
  var toggleLabel = document.createElement("span");
  toggleLabel.className = "case-toc-toggle-label";
  toggleLabel.textContent = "On this page";
  var toggleCurrent = document.createElement("span");
  toggleCurrent.className = "case-toc-toggle-current";
  toggleCurrent.textContent = "Outcome";
  toggleText.append(toggleLabel, toggleCurrent);
  var chevron = document.createElement("span");
  chevron.className = "case-toc-toggle-chevron";
  chevron.setAttribute("aria-hidden", "true");
  navToggle.append(toggleText, chevron);
  var list = document.createElement("div");
  list.id = "teesas-toc-list";
  list.className = "case-preview-toc-list";
  navWrap.append(navLabel, navToggle, list);

  var other = main.querySelector(":scope > .case-other");
  sectionConfig.forEach(function (item) {
    var section = document.getElementById(item[0]);
    if (!section) return;
    var wrap = section.querySelector(":scope > .wrap");
    if (!wrap) return;
    var label = wrap.querySelector(":scope > .case-label");
    var heading = document.createElement("h2");
    heading.className = "case-preview-section-title";
    heading.id = item[0] + "-title";
    heading.textContent = item[1];
    if (label) label.replaceWith(heading);
    else wrap.insertBefore(heading, wrap.firstChild);
    section.setAttribute("aria-labelledby", heading.id);
    var link = document.createElement("a");
    link.href = "#" + item[0];
    var linkTitle = document.createElement("span");
    linkTitle.className = "case-toc-title";
    linkTitle.textContent = item[1];
    link.appendChild(linkTitle);
    list.appendChild(link);
    content.appendChild(section);
  });
  if (other) content.appendChild(other);

  var walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT);
  var nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(function (node) {
    var value = node.nodeValue;
    var matches = Array.from(value.matchAll(/\[[^\]]+\]/g));
    if (!matches.length) return;
    var fragment = document.createDocumentFragment();
    var cursor = 0;
    matches.forEach(function (match) {
      if (match.index > cursor) fragment.appendChild(document.createTextNode(value.slice(cursor, match.index)));
      var mark = document.createElement("mark");
      mark.className = "case-preview-placeholder";
      mark.textContent = match[0];
      fragment.appendChild(mark);
      cursor = match.index + match[0].length;
    });
    if (cursor < value.length) fragment.appendChild(document.createTextNode(value.slice(cursor)));
    node.parentNode.replaceChild(fragment, node);
  });

  layout.append(nav, content);
  hero.insertAdjacentElement("afterend", layout);
  var links = Array.from(list.querySelectorAll("a[href^='#']"));
  var targets = links.map(function (link) { return document.querySelector(link.getAttribute("href")); });
  function setOpen(open) {
    nav.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
  }
  navToggle.addEventListener("click", function () {
    setOpen(navToggle.getAttribute("aria-expanded") !== "true");
  });
  links.forEach(function (link) {
    link.addEventListener("click", function () {
      if (window.matchMedia("(max-width: 900px)").matches) {
        setOpen(false);
        window.setTimeout(function () { navToggle.focus({ preventScroll: true }); }, 0);
      }
    });
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && nav.classList.contains("is-open")) {
      setOpen(false);
      navToggle.focus({ preventScroll: true });
    }
  });
  document.addEventListener("pointerdown", function (event) {
    if (nav.classList.contains("is-open") && !nav.contains(event.target)) setOpen(false);
  });

  var active = -1;
  function updateActive() {
    var trigger = window.innerHeight * .32;
    var next = 0;
    targets.forEach(function (target, index) {
      if (target && target.getBoundingClientRect().top <= trigger) next = index;
    });
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) next = links.length - 1;
    if (next === active) return;
    active = next;
    toggleCurrent.textContent = links[next].querySelector(".case-toc-title").textContent;
    links.forEach(function (link, index) {
      if (index === next) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }
  var ticking = false;
  window.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () { updateActive(); ticking = false; });
  }, { passive: true });
  window.addEventListener("resize", updateActive);
  updateActive();
})();

