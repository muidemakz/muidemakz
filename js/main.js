(function () {
  const yearList = document.getElementById("yearList");
  const overlay = document.getElementById("yearOverlay");
  const overlayYear = document.getElementById("overlayYear");
  const overlayTags = document.getElementById("overlayTags");
  const overlayRole = document.getElementById("overlayRole");
  const overlayCompany = document.getElementById("overlayCompany");
  const overlayCta = document.getElementById("overlayCta");
  const overlayFilmstrip = document.getElementById("overlayFilmstrip");
  const overlayClose = document.getElementById("overlayClose");
  const overlayContent = document.querySelector(".overlay-content");

  const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
  let hoveredYear = null;

  // each year gets its own overlay mood, cycling the same palette Wrapped
  // uses — a quiet preview of that year's review before it's even opened.
  const YEAR_THEMES = ["paper", "dark", "accent"];

  // Build the year list, newest first (data.js is already ordered that way).
  EXPERIENCE_YEARS.forEach((entry) => {
    const li = document.createElement("li");
    li.className = "year-item";
    li.textContent = entry.year;
    li.dataset.year = entry.year;
    li.tabIndex = 0;

    if (isTouch) {
      li.addEventListener("click", () => goToYear(entry.year));
    } else {
      li.addEventListener("mouseenter", () => showOverlay(entry));
      li.addEventListener("click", () => goToYear(entry.year));
      li.addEventListener("focus", () => showOverlay(entry));
    }

    yearList.appendChild(li);
  });

  if (!isTouch) {
    // the overlay background is pointer-events:none so the year list
    // underneath stays hoverable (switching years while already open) —
    // that means the hero section itself, not the overlay, is what
    // reliably sees the mouse arrive/leave.
    const hero = document.querySelector(".hero");
    hero.addEventListener("mouseleave", hideOverlay);
    overlayClose.addEventListener("click", hideOverlay);

    // click-anywhere-in-the-panel affordance: the CTA link handles its own
    // navigation, everything else in the content block falls through to
    // whichever year is currently hovered.
    overlayContent.addEventListener("click", (e) => {
      if (e.target.closest(".overlay-cta") || !hoveredYear) return;
      goToYear(hoveredYear);
    });
  }

  function showOverlay(entry) {
    hoveredYear = entry.year;
    const themeIndex = EXPERIENCE_YEARS.indexOf(entry) % YEAR_THEMES.length;
    overlay.dataset.theme = YEAR_THEMES[themeIndex];
    overlayYear.textContent = entry.year;
    overlayRole.textContent = entry.role;
    overlayCompany.textContent = entry.company;

    overlayTags.innerHTML = "";
    entry.tags.forEach((tag) => {
      const li = document.createElement("li");
      li.textContent = tag;
      overlayTags.appendChild(li);
    });

    overlayFilmstrip.innerHTML = "";
    // duplicate the thumbs once so the loop-scroll animation has no visible seam
    const thumbs = entry.thumbs.concat(entry.thumbs);
    thumbs.forEach((thumb) => {
      const div = document.createElement("div");
      div.className = "filmstrip-thumb";
      if (thumb.image) {
        div.style.backgroundImage = `url(${thumb.image})`;
        div.style.backgroundSize = "cover";
      }
      div.setAttribute("aria-label", thumb.label || "");
      div.addEventListener("click", () => goToYear(entry.year));
      overlayFilmstrip.appendChild(div);
    });

    overlayCta.href = `wrapped.html?year=${entry.year}`;

    overlay.hidden = false;
    requestAnimationFrame(() => overlay.classList.add("is-visible"));

    // only auto-scroll if the strip actually overflows its container
    requestAnimationFrame(() => {
      const wrap = overlayFilmstrip.parentElement;
      overlayFilmstrip.classList.toggle(
        "is-scrolling",
        overlayFilmstrip.scrollWidth > wrap.clientWidth
      );
    });
  }

  function hideOverlay() {
    overlay.classList.remove("is-visible");
    setTimeout(() => { overlay.hidden = true; }, 250);
  }

  function goToYear(year) {
    window.location.href = `wrapped.html?year=${year}`;
  }
})();
