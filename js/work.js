(function () {
  const grid = document.getElementById("workGrid");
  const empty = document.getElementById("workEmpty");
  const searchInput = document.getElementById("workSearch");
  const resultLine = document.getElementById("workResultLine");

  const categoryChipsEl = document.getElementById("categoryChips");
  const clearAllBtn = document.getElementById("clearAllBtn");

  const viewGridBtn = document.getElementById("viewGridBtn");
  const viewListBtn = document.getElementById("viewListBtn");
  const paginationEl = document.getElementById("workPagination");

  const PAGE_SIZE = 8; // multiple of 4 — see the masonry comment in css/work.css

  const state = {
    search: "",
    categories: new Set(), // empty = no filter (show all)
    view: "grid",
    page: 1
  };

  function scrollGridIntoView() {
    document.querySelector(".work-toolbar").scrollIntoView({ block: "start" });
  }

  // [REVERT POINT] year used to be its own filter dimension (a Year chip
  // row) — that UI is gone, but wrapped.html's per-year "See All" button
  // still links here with ?year=YYYY, so a year search still needs to work.
  // It's folded into the search box instead: a bare year drops straight
  // into the search field and the word-matching below treats a 4-digit
  // token as a year match (see renderGrid), not just a name substring.
  // arriving from a wrapped.html category chip lands directly on that
  // filter, pre-applied.
  const params = new URLSearchParams(window.location.search);
  const categoryParam = params.get("category");
  if (categoryParam && PROJECT_CATEGORIES.includes(categoryParam)) {
    state.categories.add(categoryParam);
  }
  const yearParam = params.get("year");
  if (yearParam && /^\d{4}$/.test(yearParam)) {
    state.search = yearParam;
  }

  function buildChips(container, options, selectedSet) {
    container.innerHTML = "";
    options.forEach((option) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "filter-chip";
      btn.textContent = String(option);
      btn.classList.toggle("is-active", selectedSet.has(option));
      btn.addEventListener("click", () => {
        if (selectedSet.has(option)) {
          selectedSet.delete(option);
        } else {
          selectedSet.add(option);
        }
        btn.classList.toggle("is-active", selectedSet.has(option));
        state.page = 1;
        renderGrid();
      });
      container.appendChild(btn);
    });
  }

  function clearAllFilters() {
    state.categories.clear();
    state.search = "";
    state.page = 1;
    searchInput.value = "";
    buildChips(categoryChipsEl, PROJECT_CATEGORIES, state.categories);
    renderGrid();
  }

  clearAllBtn.addEventListener("click", clearAllFilters);

  // the empty-state's own "Clear Search & Filters" button reuses the same
  // reset, so a dead-end search has one obvious way back to a full grid
  const workEmptyClearBtn = document.getElementById("workEmptyClearBtn");
  if (workEmptyClearBtn) workEmptyClearBtn.addEventListener("click", clearAllFilters);

  function renderGrid() {
    // [FIX] was a single exact-phrase includes() check, so "empty states"
    // never matched "Omnibiz Empty & Preorder States" — the words aren't
    // contiguous in the title. Matching per-word (order-independent) finds
    // it instead, same as most real search boxes behave. A bare 4-digit
    // word is also matched against the project's year, not just its name
    // — this is what lets typing "2026" work as a year filter now that the
    // dedicated Year chip row is gone (see the ?year= handling above).
    const queryWords = state.search.trim().toLowerCase().split(/\s+/).filter(Boolean);

    const filtered = PROJECTS.filter((project) => {
      const name = project.name.toLowerCase();
      const matchesSearch = queryWords.length === 0 || queryWords.every((w) => {
        if (/^\d{4}$/.test(w)) return name.includes(w) || String(project.year) === w;
        return name.includes(w);
      });
      const matchesCategory =
        state.categories.size === 0 ||
        project.categories.some((c) => state.categories.has(c));
      return matchesSearch && matchesCategory;
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    if (state.page > totalPages) state.page = totalPages;
    const startIdx = (state.page - 1) * PAGE_SIZE;
    const pageItems = filtered.slice(startIdx, startIdx + PAGE_SIZE);

    grid.innerHTML = "";
    pageItems.forEach((project) => {
      const li = document.createElement("li");
      li.className = "work-card";
      if (project.image) {
        li.classList.add("has-image");
        // quoted, since an unquoted CSS url() token can't contain the
        // space in filenames like "00 · Cover.png" — Cardtonic's card
        // was silently failing to render its cover for exactly this
        // reason before this was quoted.
        li.style.backgroundImage = `url("${project.image}")`;
        li.style.backgroundSize = "cover";
      } else if (project.brand) {
        li.classList.add("has-logo");
      }
      if (project.link) {
        li.classList.add("is-linked");
        li.tabIndex = 0;
        li.addEventListener("click", () => { window.location.href = project.link; });
        li.addEventListener("keydown", (e) => {
          if (e.key === "Enter") window.location.href = project.link;
        });
      } else {
        li.classList.add("is-soon");
        const banner = document.createElement("span");
        banner.className = "work-card-soon";
        banner.textContent = "Coming Soon";
        li.appendChild(banner);
      }

      if (project.brand && !project.image) {
        const logoDiv = document.createElement("div");
        logoDiv.className = "work-card-logo";
        logoDiv.textContent = project.brand;
        li.appendChild(logoDiv);
      }

      const name = document.createElement("span");
      name.className = "work-card-name";
      name.textContent = project.name;
      li.appendChild(name);

      if (project.caption) {
        li.classList.add("has-caption");
        const caption = document.createElement("span");
        caption.className = "work-card-caption";
        caption.textContent = project.caption;
        li.appendChild(caption);
      }

      const meta = document.createElement("span");
      meta.className = "work-card-meta";
      meta.innerHTML = `<span>${project.categories[0]}</span>`;
      li.appendChild(meta);

      grid.appendChild(li);
    });

    empty.hidden = filtered.length > 0;
    if (filtered.length === 0) {
      resultLine.textContent = `0 of ${PROJECTS.length} projects`;
    } else {
      const rangeEnd = Math.min(startIdx + PAGE_SIZE, filtered.length);
      resultLine.textContent = `Showing ${startIdx + 1}–${rangeEnd} of ${filtered.length} projects`;
    }

    renderPagination(totalPages);
  }

  function renderPagination(totalPages) {
    paginationEl.innerHTML = "";
    if (totalPages <= 1) return;

    const prevBtn = document.createElement("button");
    prevBtn.type = "button";
    prevBtn.className = "page-btn page-btn-nav";
    prevBtn.textContent = "← Prev";
    prevBtn.disabled = state.page === 1;
    prevBtn.addEventListener("click", () => {
      state.page -= 1;
      renderGrid();
      scrollGridIntoView();
    });
    paginationEl.appendChild(prevBtn);

    for (let p = 1; p <= totalPages; p++) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "page-btn";
      btn.textContent = String(p);
      btn.classList.toggle("is-active", p === state.page);
      btn.addEventListener("click", () => {
        state.page = p;
        renderGrid();
        scrollGridIntoView();
      });
      paginationEl.appendChild(btn);
    }

    const nextBtn = document.createElement("button");
    nextBtn.type = "button";
    nextBtn.className = "page-btn page-btn-nav";
    nextBtn.textContent = "Next →";
    nextBtn.disabled = state.page === totalPages;
    nextBtn.addEventListener("click", () => {
      state.page += 1;
      renderGrid();
      scrollGridIntoView();
    });
    paginationEl.appendChild(nextBtn);
  }

  searchInput.addEventListener("input", (e) => {
    state.search = e.target.value;
    state.page = 1;
    renderGrid();
  });

  // reflects a ?year= deep-link (or ?category=) in the search box itself,
  // since state.search may already be pre-filled above
  searchInput.value = state.search;

  buildChips(categoryChipsEl, PROJECT_CATEGORIES, state.categories);

  function setView(view) {
    state.view = view;
    grid.classList.toggle("is-list", view === "list");
    viewGridBtn.classList.toggle("is-active", view === "grid");
    viewListBtn.classList.toggle("is-active", view === "list");
    viewGridBtn.setAttribute("aria-pressed", String(view === "grid"));
    viewListBtn.setAttribute("aria-pressed", String(view === "list"));
  }

  viewGridBtn.addEventListener("click", () => setView("grid"));
  viewListBtn.addEventListener("click", () => setView("list"));

  renderGrid();

  if (state.categories.size > 0 || state.search) {
    // scroll the grid into view so a filtered arrival actually lands on the
    // filtered results, not the page top.
    document.querySelector(".work-toolbar").scrollIntoView({ block: "start" });
  }
})();
