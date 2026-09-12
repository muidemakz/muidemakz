(function () {
  const params = new URLSearchParams(window.location.search);
  const requestedYear = parseInt(params.get("year"), 10);

  const years = EXPERIENCE_YEARS; // newest first
  let index = years.findIndex((y) => y.year === requestedYear);
  if (index === -1) index = 0;

  const yearStrip = document.getElementById("yearStrip");
  const wrapYear = document.getElementById("wrapYear");
  const wrapRole = document.getElementById("wrapRole");
  const wrapCompany = document.getElementById("wrapCompany");
  const wrapProject = document.getElementById("wrapProject");
  const wrapChips = document.getElementById("wrapChips");
  const wrapStat = document.getElementById("wrapStat");
  const wrapStatLabel = document.getElementById("wrapStatLabel");
  const wrapLesson = document.getElementById("wrapLesson");
  const shelfSection = document.getElementById("projectShelf");
  const shelfGrid = document.getElementById("shelfGrid");
  const prevBtn = document.getElementById("wrapPrev");
  const nextBtn = document.getElementById("wrapNext");

  const flowClose = document.getElementById("flowClose");
  const flowProgress = document.getElementById("flowProgress");
  const flowPlayerBody = document.getElementById("flowPlayerBody");
  const screenOriginal = document.getElementById("screenOriginal");
  const flowFact = document.getElementById("flowFact");

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const SCREEN_MS = 10000;
  const TOTAL_SCREENS = 6; // screen 0 = the original layout, 1-4 = fact screens, 5 = thank you
  const THEME_CYCLE = ["dark", "accent", "paper"];

  const shelfVariants = ["a", "b", "c", "d"];
  const shelfAngles = [-2, 1.5, 2, -1.5, 1, -1];

  document.body.style.overflow = "hidden"; // this page is the fullscreen flow, nothing to scroll behind it

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function categoriesForYear(year) {
    const set = new Set();
    PROJECTS.filter((p) => p.year === year).forEach((p) => {
      p.categories.forEach((c) => set.add(c));
    });
    return Array.from(set);
  }

  // entry.project is free text like "Fundall — Loans & Salary Advance"; match it
  // back to the real PROJECTS entry (by name prefix) so the Defining Project
  // screen can link straight to that project's case study.
  function resolveProjectLink(entry) {
    const match = PROJECTS.find(
      (p) => p.year === entry.year && entry.project &&
        entry.project.toLowerCase().indexOf(p.name.toLowerCase()) === 0
    );
    if (!match) return `my-work.html?year=${entry.year}`;
    return match.link || `my-work.html?year=${match.year}&category=${encodeURIComponent(match.categories[0])}`;
  }

  function renderYearStrip() {
    yearStrip.innerHTML = "";
    years.forEach((entry, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "year-strip-seg" + (i === index ? " is-current" : i < index ? " is-past" : "");
      btn.setAttribute("aria-label", "Jump to " + entry.year);
      btn.addEventListener("click", () => goToYear(i));
      yearStrip.appendChild(btn);
    });
  }

  function renderShelf(entry) {
    const projects = PROJECTS.filter((p) => p.year === entry.year);
    shelfGrid.innerHTML = "";

    if (projects.length === 0) {
      shelfSection.hidden = true;
      return;
    }

    shelfSection.hidden = false;

    projects.forEach((project, i) => {
      const card = document.createElement(project.link ? "a" : "button");
      card.className = "shelf-card shelf-card--" + shelfVariants[i % shelfVariants.length];
      card.style.setProperty("--rot", shelfAngles[i % shelfAngles.length] + "deg");

      if (project.link) {
        card.href = project.link;
      } else {
        card.type = "button";
        const dest = `my-work.html?year=${project.year}&category=${encodeURIComponent(project.categories[0])}`;
        card.addEventListener("click", () => { window.location.href = dest; });
      }

      card.appendChild(el("p", "shelf-kind", project.categories[0] || "Project"));
      card.appendChild(el("p", "shelf-name", project.name));
      card.appendChild(el("p", "shelf-note", project.link ? "View case study →" : "View in Work →"));
      shelfGrid.appendChild(card);
    });
  }

  function renderYearContent() {
    const entry = years[index];

    wrapYear.textContent = entry.year;
    wrapRole.textContent = entry.role;
    wrapCompany.textContent = entry.company;
    wrapProject.textContent = entry.project || "—";
    wrapStat.textContent = entry.stat || "—";
    wrapStatLabel.textContent = entry.statLabel || "";
    wrapLesson.textContent = `“${entry.lesson || ""}”`;

    wrapChips.innerHTML = "";
    categoriesForYear(entry.year).forEach((cat) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.className = "wrap-chip";
      a.href = `my-work.html?year=${entry.year}&category=${encodeURIComponent(cat)}`;
      a.textContent = cat;
      li.appendChild(a);
      wrapChips.appendChild(li);
    });

    renderShelf(entry);
    renderYearStrip();

    prevBtn.disabled = index === years.length - 1;
    nextBtn.disabled = index === 0;

    document.title = `${entry.year} — Year in Review — Muidemakz`;
    window.history.replaceState(null, "", `wrapped.html?year=${entry.year}`);
  }

  function goToYear(i) {
    if (i < 0 || i >= years.length) return;
    index = i;
    renderYearContent();
    screenIndex = 0;
    renderScreen();
  }

  prevBtn.addEventListener("click", () => goToYear(index + 1)); // earlier = older = later in array
  nextBtn.addEventListener("click", () => goToYear(index - 1)); // later = newer = earlier in array
  flowClose.addEventListener("click", () => { window.location.href = "index.html"; });

  renderYearContent();

  // ---------- the 6-screen auto-advancing, color-cycling flow ----------
  // screen 0 is the original layout above (year number, facts, lesson, shelf) —
  // it keeps its own paper/dark theming and clickable shelf/chips, so it's left
  // out of the color cycle and the generic click-to-skip zone below.

  let screenIndex = 0;
  let screenTimer = null;
  let isPaused = false;
  let remaining = SCREEN_MS; // ms left on the current screen — survives pause/resume
  let segmentStart = 0;

  // ---------- auto-scrolling "Projects this year" shelf ----------
  // when the shelf overflows horizontally, it scrolls itself across the
  // screen's full display window instead of requiring a manual drag — pauses
  // in lockstep with the screen timer (shared `isPaused` flag) so hovering to
  // read a card also holds the scroll where it is.

  let shelfScrollRAF = null;
  let shelfScrollElapsed = 0;
  let shelfScrollLastTs = null;

  // a real swipe/wheel on the shelf always wins over the auto-scroll — stop
  // driving scrollLeft ourselves the instant the user touches it, rather than
  // fighting their gesture every frame. Once they've taken over, it stays
  // manual for the rest of this screen's viewing time.
  function handleShelfManualScroll() {
    stopShelfAutoScroll();
  }

  function stopShelfAutoScroll() {
    if (shelfScrollRAF) cancelAnimationFrame(shelfScrollRAF);
    shelfScrollRAF = null;
    shelfScrollLastTs = null;
    shelfGrid.removeEventListener("touchstart", handleShelfManualScroll);
    shelfGrid.removeEventListener("wheel", handleShelfManualScroll);
  }

  function startShelfAutoScroll(durationMs) {
    stopShelfAutoScroll();
    if (shelfSection.hidden) return;
    shelfGrid.scrollLeft = 0;
    const maxScroll = shelfGrid.scrollWidth - shelfGrid.clientWidth;
    if (maxScroll <= 1 || prefersReducedMotion) return;

    shelfGrid.addEventListener("touchstart", handleShelfManualScroll, { passive: true });
    shelfGrid.addEventListener("wheel", handleShelfManualScroll, { passive: true });

    shelfScrollElapsed = 0;
    shelfScrollLastTs = null;

    function step(ts) {
      if (isPaused) {
        shelfScrollLastTs = null; // don't count paused time toward the scroll
        shelfScrollRAF = requestAnimationFrame(step);
        return;
      }
      if (shelfScrollLastTs === null) shelfScrollLastTs = ts;
      shelfScrollElapsed += ts - shelfScrollLastTs;
      shelfScrollLastTs = ts;
      const progress = Math.min(1, shelfScrollElapsed / durationMs);
      shelfGrid.scrollLeft = progress * maxScroll;
      shelfScrollRAF = progress < 1 ? requestAnimationFrame(step) : null;
    }
    shelfScrollRAF = requestAnimationFrame(step);
  }

  flowProgress.innerHTML = "";
  for (let i = 0; i < TOTAL_SCREENS; i++) {
    const seg = document.createElement("button");
    seg.type = "button";
    seg.className = "flow-progress-seg";
    seg.setAttribute("aria-label", "Jump to screen " + (i + 1));
    seg.addEventListener("click", () => { screenIndex = i; renderScreen(); });
    flowProgress.appendChild(seg);
  }

  function buildFactScreens(entry) {
    const cats = categoriesForYear(entry.year);
    return [
      { kicker: "The Role", title: entry.role, meta: entry.company },
      { kicker: "Defining Project", title: entry.project || "—", meta: cats.join(" · "), href: resolveProjectLink(entry) },
      { kicker: "The Number", big: entry.stat || "—", sub: entry.statLabel || "" },
      { kicker: "The Lesson", quote: entry.lesson || "" },
      { kicker: String(entry.year), thankYou: true, workHref: `my-work.html?year=${entry.year}` }
    ];
  }

  function renderFactScreen(slide) {
    flowFact.innerHTML = "";
    flowFact.dataset.theme = THEME_CYCLE[(screenIndex - 1) % THEME_CYCLE.length];
    flowFact.appendChild(el("p", "flow-fact-kicker", slide.kicker));

    if (slide.thankYou) {
      flowFact.appendChild(el("p", "flow-fact-title", "Thank you for watching"));
      const actions = el("div", "flow-fact-actions");

      const primary = document.createElement("a");
      primary.className = "flow-fact-btn flow-fact-btn--primary";
      primary.href = slide.workHref;
      primary.textContent = "See this year's work →";
      actions.appendChild(primary);

      const home = document.createElement("a");
      home.className = "flow-fact-btn";
      home.href = "index.html";
      home.textContent = "← Back to Home";
      actions.appendChild(home);

      const replay = document.createElement("button");
      replay.type = "button";
      replay.className = "flow-fact-btn";
      replay.textContent = "Replay ↻";
      replay.addEventListener("click", () => { screenIndex = 0; renderScreen(); });
      actions.appendChild(replay);

      flowFact.appendChild(actions);
      return;
    }

    const inner = slide.href ? document.createElement("a") : document.createElement("div");
    inner.className = slide.href ? "flow-fact-body flow-fact-link" : "flow-fact-body";
    if (slide.href) inner.href = slide.href;

    if (slide.big) inner.appendChild(el("p", "flow-fact-value", slide.big));
    if (slide.title) inner.appendChild(el("p", "flow-fact-title", slide.title));
    if (slide.sub && !slide.title) inner.appendChild(el("p", "flow-fact-title", slide.sub));
    if (slide.meta) inner.appendChild(el("p", "flow-fact-meta", slide.meta));
    if (slide.quote) inner.appendChild(el("p", "flow-fact-quote", `“${slide.quote}”`));

    flowFact.appendChild(inner);
  }

  function renderScreen() {
    const entry = years[index];

    Array.from(flowProgress.children).forEach((seg, i) => {
      seg.classList.toggle("is-done", i < screenIndex);
      seg.classList.toggle("is-active", i === screenIndex);
      seg.classList.remove("is-paused");
    });

    if (screenIndex === 0) {
      screenOriginal.hidden = false;
      flowFact.hidden = true;
      startShelfAutoScroll(SCREEN_MS);
    } else {
      screenOriginal.hidden = true;
      flowFact.hidden = false;
      renderFactScreen(buildFactScreens(entry)[screenIndex - 1]);
      stopShelfAutoScroll();
    }

    startScreenTimer();
  }

  // starts (or restarts) the current screen's full-duration countdown —
  // called whenever the screen itself changes (advance/retreat/jump).
  function startScreenTimer() {
    clearTimeout(screenTimer);
    remaining = SCREEN_MS;
    segmentStart = Date.now();
    const activeSeg = flowProgress.children[screenIndex];
    if (activeSeg) activeSeg.classList.toggle("is-paused", isPaused);
    if (!prefersReducedMotion && !isPaused && screenIndex < TOTAL_SCREENS - 1) {
      screenTimer = setTimeout(advanceScreen, remaining);
    }
  }

  // hover, or press-and-hold on touch, pauses the countdown exactly where it
  // is — resuming continues the remaining time rather than restarting the
  // full 10s, so lingering to read never sends you back to the top.
  function pauseTimer() {
    if (isPaused) return;
    isPaused = true;
    clearTimeout(screenTimer);
    remaining = Math.max(0, remaining - (Date.now() - segmentStart));
    const activeSeg = flowProgress.children[screenIndex];
    if (activeSeg) activeSeg.classList.add("is-paused");
  }

  function resumeTimer() {
    if (!isPaused) return;
    isPaused = false;
    segmentStart = Date.now();
    const activeSeg = flowProgress.children[screenIndex];
    if (activeSeg) activeSeg.classList.remove("is-paused");
    if (!prefersReducedMotion && screenIndex < TOTAL_SCREENS - 1) {
      screenTimer = setTimeout(advanceScreen, remaining);
    }
  }

  function advanceScreen() {
    if (screenIndex >= TOTAL_SCREENS - 1) return;
    screenIndex += 1;
    renderScreen();
  }

  function retreatScreen() {
    if (screenIndex === 0) return;
    screenIndex -= 1;
    renderScreen();
  }

  // tap/click the left or right half of any screen (0 included) to step
  // back/forward — skips past real controls (chip links, shelf cards, nav
  // buttons) so those keep working exactly as before.
  flowPlayerBody.addEventListener("click", (e) => {
    if (e.target.closest("a, button")) return;
    const rect = flowPlayerBody.getBoundingClientRect();
    const isRightHalf = e.clientX - rect.left > rect.width / 2;
    if (isRightHalf) advanceScreen(); else retreatScreen();
  });

  // desktop: hovering pauses; leaving resumes. Scoped to the content area,
  // not the whole fullscreen player, since the player now covers the entire
  // viewport (the top/bottom chrome bars stay "live" and clickable).
  flowPlayerBody.addEventListener("mouseenter", pauseTimer);
  flowPlayerBody.addEventListener("mouseleave", resumeTimer);

  // touch: press-and-hold pauses (Stories-style); lifting resumes. A quick
  // tap still falls through to the flowFact click handler below to skip.
  flowPlayerBody.addEventListener("touchstart", pauseTimer, { passive: true });
  flowPlayerBody.addEventListener("touchend", resumeTimer);
  flowPlayerBody.addEventListener("touchcancel", resumeTimer);

  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") advanceScreen();
    if (e.key === "ArrowLeft") retreatScreen();
    if (e.key === "Escape") flowClose.click();
  });

  renderScreen();
})();
