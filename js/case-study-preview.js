(function () {
  var main = document.querySelector(".case-main");
  var hero = main && main.querySelector(":scope > .case-hero");
  var nav = main && main.querySelector(":scope > .case-quicknav");
  if (!main || !hero || !nav) return;

  var sectionsInOrder = [
    ["outcome", "Outcome"],
    ["objective", "Business objective"],
    ["ownership", "My role and ownership"],
    ["problem", "Challenge"],
    ["research", "Evidence and investigation", "Dates, counts, definitions to verify"],
    ["reframe", "Reframed problem"],
    ["solution", "Design decisions and trade offs", "Alternatives to add"],
    ["testing", "Implementation and iteration", "Release details to add"],
    ["voice-flow", "Second change: chat and call", "Separate shipped change"],
    ["now", "Current design"],
    ["next", "Next steps"],
    ["reflection", "Reflection"]
  ];
  var navigationItems = {
    outcome: ["Outcome", "Reported"],
    objective: ["Goals and role", "Add objective"],
    problem: ["Challenge and evidence", "Verify evidence"],
    reframe: ["Reframed problem"],
    solution: ["Design decisions", "Trade offs"],
    testing: ["Build and iteration", "Add release detail"],
    "voice-flow": ["Shipped experience"],
    now: ["Current design and next steps"],
    reflection: ["Reflection"]
  };
  var supportingHeadings = {};

  function addSubheading(section, selector, title) {
    var target = section.querySelector(selector);
    if (!target) return;
    var heading = document.createElement("h3");
    heading.className = "case-preview-subheading";
    heading.textContent = title;
    target.parentNode.insertBefore(heading, target);
  }

  var layout = document.createElement("div");
  layout.className = "case-preview-layout";
  var content = document.createElement("article");
  content.className = "case-preview-content";
  var navWrap = nav.querySelector(".wrap");
  nav.setAttribute("aria-label", "On this page");
  navWrap.replaceChildren();
  var navLabel = document.createElement("p");
  navLabel.className = "case-preview-nav-label";
  navLabel.textContent = "On this page";
  var navToggle = document.createElement("button");
  navToggle.type = "button";
  navToggle.className = "case-toc-toggle";
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-controls", "case-toc-list");
  var navToggleText = document.createElement("span");
  navToggleText.className = "case-toc-toggle-text";
  var navToggleLabel = document.createElement("span");
  navToggleLabel.className = "case-toc-toggle-label";
  navToggleLabel.textContent = "On this page";
  var navToggleCurrent = document.createElement("span");
  navToggleCurrent.className = "case-toc-toggle-current";
  navToggleCurrent.textContent = "Outcome";
  navToggleText.append(navToggleLabel, navToggleCurrent);
  var navToggleChevron = document.createElement("span");
  navToggleChevron.className = "case-toc-toggle-chevron";
  navToggleChevron.setAttribute("aria-hidden", "true");
  navToggle.append(navToggleText, navToggleChevron);
  var tocList = document.createElement("div");
  tocList.className = "case-preview-toc-list";
  tocList.id = "case-toc-list";
  navWrap.append(navLabel, navToggle, tocList);

  var objectiveSection = document.getElementById("objective");
  var objectiveWrap = objectiveSection && objectiveSection.querySelector(":scope > .wrap");
  if (objectiveWrap) {
    var objectiveCopy = Array.from(objectiveWrap.querySelectorAll(":scope > .case-copy"));
    var ownership = document.createElement("section");
    ownership.className = "case-section";
    ownership.id = "ownership";
    var ownershipWrap = document.createElement("div");
    ownershipWrap.className = "wrap";
    ownership.appendChild(ownershipWrap);
    if (objectiveCopy[1]) {
      objectiveCopy[1].textContent = "I owned the retailer experience design while embedded with PMs and engineers. I refined the ordering and support paths through retailer feedback. The related issue of making chat and call discoverable is covered separately below.";
      ownershipWrap.appendChild(objectiveCopy[1]);
    }
    if (objectiveCopy[3]) {
      objectiveCopy[3].textContent = "This work was done in April 2026. The main story shows that early version, while the final section shows the current design. Omnibiz platform scale figures describe the broader product and are not outcomes caused by this redesign.";
      ownershipWrap.appendChild(objectiveCopy[3]);
    }
    if (objectiveCopy[2]) objectiveCopy[2].remove();
    var objectiveFlag = objectiveWrap.querySelector(".case-flag-box");
    if (objectiveFlag) {
      var flagLabel = objectiveFlag.querySelector(".case-flag-label");
      var flagCopy = objectiveFlag.querySelector(".case-flag-copy");
      if (flagLabel) flagLabel.textContent = "Still needed";
      if (flagCopy) flagCopy.textContent = "Add the feature's business objective from the original brief or PM discussion. The retailer ecosystem and annual NMV figures below describe overall platform scale, not the objective for this feature.";
    }
  }

  sectionsInOrder.forEach(function (item) {
    var section = item[0] === "ownership" ? ownership : document.getElementById(item[0]);
    if (!section) return;
    var sectionTitle = section.querySelector(":scope > .wrap > .case-label");
    var sectionWrap = section.querySelector(":scope > .wrap");
    var heading = document.createElement("h2");
    heading.className = "case-preview-section-title";
    heading.id = item[0] + "-title";
    heading.textContent = item[1];
    if (sectionTitle) {
      sectionTitle.replaceWith(heading);
    } else if (sectionWrap) sectionWrap.insertBefore(heading, sectionWrap.firstChild);
    (supportingHeadings[item[0]] || []).forEach(function (subheading) {
      addSubheading(section, subheading[0], subheading[1]);
    });
    var flagLabels = {
      outcome: "Source and comparison window",
      problem: "Working assumption to confirm",
      research: "Required to verify the reported split",
      solution: "Trade off"
    };
    var flagLabel = section.querySelector(".case-flag-label");
    if (flagLabel && flagLabels[item[0]]) flagLabel.textContent = flagLabels[item[0]];
    if (flagLabel && ["outcome", "objective", "problem", "research"].indexOf(item[0]) !== -1) {
      flagLabel.classList.add("case-preview-pending-label");
    }
    if (item[0] === "now") {
      var currentFigureTitle = section.querySelector(".case-figure-head-title");
      if (currentFigureTitle) currentFigureTitle.textContent = "Current retailer interface";
    }
    if (item[0] === "voice-flow") {
      var modeFigureTitle = section.querySelector(".case-figure-head-title");
      if (modeFigureTitle) modeFigureTitle.textContent = "Choosing chat or call";
    }
    section.setAttribute("aria-labelledby", item[0] + "-title");
    if (item[0] === "next") {
      section.querySelectorAll(".case-stack-title").forEach(function (oldTitle) {
        var heading = document.createElement("h3");
        heading.className = "case-preview-subheading case-stack-title";
        heading.textContent = oldTitle.textContent;
        oldTitle.replaceWith(heading);
      });
    }
    var navItem = navigationItems[item[0]];
    if (navItem) {
      var link = document.createElement("a");
      link.href = "#" + item[0];
      var linkTitle = document.createElement("span");
      linkTitle.className = "case-toc-title";
      linkTitle.textContent = navItem[0];
      link.appendChild(linkTitle);
      if (navItem[1]) {
        var linkStatus = document.createElement("span");
        linkStatus.className = "case-toc-status";
        linkStatus.textContent = navItem[1];
        linkStatus.classList.add(/verify|add|reported|trade/i.test(navItem[1]) ? "case-toc-status--pending" : "case-toc-status--note");
        link.appendChild(linkStatus);
      }
      tocList.appendChild(link);
    }
    content.appendChild(item[0] === "ownership" ? ownership : section);
  });

  var nextSection = document.getElementById("next");
  if (nextSection) {
    var nextRow = nextSection.querySelector(".case-stack-row");
    if (nextRow) nextRow.classList.add("case-next-layout");
    var nextSteps = nextSection.querySelector(".case-stack");
    if (nextSteps) nextSteps.classList.add("case-next-cards");
  }

  var other = main.querySelector(":scope > .case-other");
  if (other) {
    var otherLabel = other.querySelector(".case-label");
    if (otherLabel) {
      var otherHeading = document.createElement("h2");
      otherHeading.className = "case-preview-section-title";
      otherHeading.textContent = "More selected work";
      otherLabel.replaceWith(otherHeading);
    }
    content.appendChild(other);
  }

  var walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT);
  var textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);
  textNodes.forEach(function (textNode) {
    var value = textNode.nodeValue;
    var pattern = /\[[^\]]+\]/g;
    var matches = Array.from(value.matchAll(pattern));
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
    textNode.parentNode.replaceChild(fragment, textNode);
  });

  layout.append(nav, content);
  hero.insertAdjacentElement("afterend", layout);

  var links = Array.from(tocList.querySelectorAll('a[href^="#"]'));
  var sections = links.map(function (link) { return document.querySelector(link.getAttribute("href")); });
  function setNavOpen(open) {
    nav.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
  }
  navToggle.addEventListener("click", function () {
    setNavOpen(navToggle.getAttribute("aria-expanded") !== "true");
  });
  links.forEach(function (link) {
    link.addEventListener("click", function () {
      if (window.matchMedia("(max-width: 900px)").matches) {
        setNavOpen(false);
        window.setTimeout(function () { navToggle.focus({ preventScroll: true }); }, 0);
      }
    });
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && nav.classList.contains("is-open")) {
      setNavOpen(false);
      navToggle.focus({ preventScroll: true });
    }
  });
  document.addEventListener("pointerdown", function (event) {
    if (nav.classList.contains("is-open") && !nav.contains(event.target)) setNavOpen(false);
  });
  var activeIndex = -1;
  function updateActive() {
    var trigger = window.innerHeight * 0.32;
    var next = 0;
    sections.forEach(function (section, index) {
      if (section && section.getBoundingClientRect().top <= trigger) next = index;
    });
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) next = links.length - 1;
    if (next === activeIndex) return;
    activeIndex = next;
    var currentTitle = links[next] && links[next].querySelector(".case-toc-title");
    if (currentTitle) navToggleCurrent.textContent = currentTitle.textContent;
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
