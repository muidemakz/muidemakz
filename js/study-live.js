// Study scores panel for the Moniepoint case study.
//
// Renders from one JSON block in the page (<script type="application/json"
// id="mv-study-data">). Two states, never confused:
//
//   Snapshot  the numbers in that block, dated. This is the default and is
//             what ships today: Valideity's reports are private, so nothing
//             here is fetched from them.
//   Live      only if `endpoint` is set to a public, read-only URL returning
//             the same shape. The panel then polls it (while the tab is
//             visible) and shows the time of the last good response. If a
//             poll fails it falls back to the snapshot and says so.
//
// Predicted (synthetic sessions) and Measured (real participants) are kept
// as separate figures on purpose.
(function () {
  const mount = document.getElementById("mv-study");
  const dataEl = document.getElementById("mv-study-data");
  if (!mount || !dataEl) return;

  let snapshot;
  try { snapshot = JSON.parse(dataEl.textContent); } catch (e) { return; }

  // A page can wrap the panel in [data-study-section] (heading and all). It stays
  // hidden until real scores are present, so an empty study never shows a shell.
  const section = mount.closest("[data-study-section]");
  if (!snapshot || !Array.isArray(snapshot.conditions) || snapshot.conditions.length !== 2) return;
  if (section) section.hidden = false;
  document.querySelectorAll("[data-study-nav]").forEach((a) => { a.hidden = false; });

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const POLL_MS = 60000;
  let data = snapshot;
  let state = "snapshot"; // snapshot | live | offline
  let lastGood = null;
  let animated = false;

  const fmtDate = (iso) => {
    const d = new Date(iso + "T12:00:00");
    return isNaN(d) ? iso : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  };
  const fmtTime = (d) => d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  function badge() {
    if (state === "live") return '<span class="mv-badge mv-badge--live"><i aria-hidden="true"></i>Live · updated ' + fmtTime(lastGood) + "</span>";
    if (state === "offline") return '<span class="mv-badge">Snapshot · ' + fmtDate(snapshot.snapshot) + " · live feed unavailable</span>";
    return '<span class="mv-badge">Snapshot · ' + fmtDate(data.snapshot) + "</span>";
  }

  function pips(c) {
    let out = "";
    for (let i = 0; i < c.sessions; i++) {
      const done = i < c.completed;
      out += '<i class="mv-pip ' + (done ? "is-done" : "is-stopped") + '" style="--i:' + i + '"></i>';
    }
    return out;
  }

  const hasFinished = (c) => typeof c.completed === "number";

  function card(c) {
    return (
      '<article class="mv-score mv-score--' + esc(c.key) + '">' +
        '<p class="mv-score-label">' + esc(c.label) + ' · Predicted</p>' +
        '<p class="mv-score-value"><span data-count="' + c.score + '">' + c.score + '</span><small>/100</small></p>' +
        '<div class="mv-meter" role="img" aria-label="Score ' + c.score + ' out of 100"><span style="--v:' + c.score / 100 + '"></span></div>' +
        (hasFinished(c)
          ? '<div class="mv-pips' + (c.sessions > 10 ? " mv-pips--dense" : "") + '" role="img" aria-label="' + c.completed + ' of ' + c.sessions + ' synthetic sessions finished the task">' + pips(c) + "</div>"
          : "") +
        '<p class="mv-score-copy"><strong>' +
          (hasFinished(c) ? c.completed + " of " + c.sessions + " sessions finished." : c.sessions + " simulated sessions.") + "</strong> " +
          esc(c.note || "") + "</p>" +
      "</article>"
    );
  }

  function render() {
    const m = data.measured || { participants: 0 };
    mount.innerHTML =
      '<div class="mv-study-head"><p class="case-label">Valideity Scores</p>' + badge() + "</div>" +
      '<div class="mv-study-grid">' +
        data.conditions.map(card).join("") +
        '<article class="mv-score mv-score--measured">' +
          '<p class="mv-score-label">Real participants · Measured</p>' +
          '<p class="mv-score-value"><span data-count="' + m.participants + '">' + m.participants + "</span></p>" +
          '<div class="mv-meter mv-meter--empty" aria-hidden="true"><span style="--v:0"></span></div>' +
          '<p class="mv-score-copy"><strong>' + (m.participants === 1 ? "1 person has" : m.participants + " people have") + " tested either version.</strong> " +
            esc(m.note || "") + "</p>" +
        "</article>" +
      "</div>" +
      '<p class="mv-study-foot">' + (data.foot ? esc(data.foot) :
        data.sessionsTotal + " synthetic sessions, " + data.sessionsPerVersion + " per version, across " +
        data.personas + (data.personas === 1 ? " persona" : " personas") + ", standard variation, same task and questions in both. " +
        "These are Valideity's own Predicted scores; each run scores under the rules in place when it finished. " +
        "Predicted means scored from simulated sessions. Measured means real people took part.") + "</p>";

    if (animated || reduceMotion.matches) mount.classList.add("is-in");
  }

  // count the numbers up once, the first time the panel is on screen
  function animateIn() {
    if (animated) return;
    animated = true;
    mount.classList.add("is-in");
    if (reduceMotion.matches) return;
    mount.querySelectorAll("[data-count]").forEach((n) => {
      const target = Number(n.dataset.count);
      if (!target) return;
      const t0 = performance.now(), ms = 1100;
      (function frame(now) {
        const t = Math.min(1, (now - t0) / ms);
        const eased = 1 - Math.pow(1 - t, 3);
        n.textContent = String(Math.round(target * eased));
        if (t < 1) requestAnimationFrame(frame);
      })(t0);
    });
  }

  // ---------- live polling (only when an endpoint exists) ----------
  function valid(d) {
    return d && Array.isArray(d.conditions) && d.conditions.length === 2 &&
      d.conditions.every((c) => typeof c.score === "number" && typeof c.sessions === "number" && (c.completed === undefined || typeof c.completed === "number")) &&
      d.measured && typeof d.measured.participants === "number";
  }

  async function poll() {
    if (!snapshot.endpoint || document.hidden) return;
    try {
      const res = await fetch(snapshot.endpoint, { cache: "no-store", headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error(String(res.status));
      const next = await res.json();
      if (!valid(next)) throw new Error("shape");
      data = Object.assign({}, snapshot, next);
      lastGood = new Date();
      state = "live";
    } catch (e) {
      data = snapshot;
      state = "offline";
    }
    const wasIn = animated;
    animated = true; // update in place without replaying the count-up
    render();
    animated = wasIn;
  }

  // ---------- study links: shown only when a real URL exists ----------
  function revealStudyLinks() {
    const links = snapshot.studyLinks || {};
    document.querySelectorAll("[data-study-link]").forEach((a) => {
      const url = links[a.getAttribute("data-study-link")];
      if (url) { a.href = url; a.hidden = false; }
    });
    const row = document.querySelector("[data-study-links-row]");
    if (row && row.querySelector("[data-study-link]:not([hidden])")) row.hidden = false;
  }

  render();
  revealStudyLinks();

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { io.disconnect(); animateIn(); }
    }, { threshold: 0.35 });
    io.observe(mount);
  } else {
    animateIn();
  }

  if (snapshot.endpoint) {
    poll();
    setInterval(poll, POLL_MS);
    document.addEventListener("visibilitychange", () => { if (!document.hidden) poll(); });
  }
})();
