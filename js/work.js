(function () {
  const grid = document.getElementById("workGrid");
  const empty = document.getElementById("workEmpty");
  const searchInput = document.getElementById("workSearch");
  const resultLine = document.getElementById("workResultLine");

  const categoryChipsEl = document.getElementById("categoryChips");
  const yearChipsEl = document.getElementById("yearChips");
  const clearAllBtn = document.getElementById("clearAllBtn");

  const viewGridBtn = document.getElementById("viewGridBtn");
  const viewListBtn = document.getElementById("viewListBtn");
  const paginationEl = document.getElementById("workPagination");

  const PAGE_SIZE = 8; // multiple of 4 — see the masonry comment in css/work.css

  const years = EXPERIENCE_YEARS.map((e) => e.year); // already newest-first

  const state = {
    search: "",
    categories: new Set(), // empty = no filter (show all)
    years: new Set(),
    view: "grid",
    page: 1
  };

  function scrollGridIntoView() {
    document.querySelector(".work-toolbar").scrollIntoView({ block: "start" });
  }

  // arriving from the homepage year-hover, or a wrapped.html category chip,
  // lands directly on that filter, pre-applied.
  const params = new URLSearchParams(window.location.search);
  const yearParam = params.get("year");
  if (yearParam && years.includes(Number(yearParam))) {
    state.years.add(Number(yearParam));
  }
  const categoryParam = params.get("category");
  if (categoryParam && PROJECT_CATEGORIES.includes(categoryParam)) {
    state.categories.add(categoryParam);
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

  clearAllBtn.addEventListener("click", () => {
    state.categories.clear();
    state.years.clear();
    state.search = "";
    state.page = 1;
    searchInput.value = "";
    buildChips(categoryChipsEl, PROJECT_CATEGORIES, state.categories);
    buildChips(yearChipsEl, years, state.years);
    renderGrid();
  });

  function renderGrid() {
    const query = state.search.trim().toLowerCase();

    const filtered = PROJECTS.filter((project) => {
      const matchesSearch = !query || project.name.toLowerCase().includes(query);
      const matchesCategory =
        state.categories.size === 0 ||
        project.categories.some((c) => state.categories.has(c));
      const matchesYear = state.years.size === 0 || state.years.has(project.year);
      return matchesSearch && matchesCategory && matchesYear;
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
        li.style.backgroundImage = `url(${project.image})`;
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

  buildChips(categoryChipsEl, PROJECT_CATEGORIES, state.categories);
  buildChips(yearChipsEl, years, state.years);

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

  if (state.years.size > 0 || state.categories.size > 0) {
    // scroll the grid into view so a filtered arrival actually lands on the
    // filtered results, not the page top.
    document.querySelector(".work-toolbar").scrollIntoView({ block: "start" });
  }
})();
