// Sun King case study: before/after toggles and the prompt log.
// Everything is visible without this script; it only adds the toggling
// and the step-by-step reveal.
(function () {
  // ---- before / after toggles ----
  document.querySelectorAll("[data-sk-pair]").forEach(function (pair) {
    var group = pair.querySelector("[data-sk-toggle]");
    if (!group) return;
    var buttons = Array.prototype.slice.call(group.querySelectorAll("button"));
    var panes = Array.prototype.slice.call(pair.querySelectorAll("[data-sk-pane]"));
    var screen = pair.querySelector(".sk-laptop-screen");

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var show = btn.getAttribute("data-sk-show");
        buttons.forEach(function (b) {
          b.setAttribute("aria-pressed", b === btn ? "true" : "false");
        });
        panes.forEach(function (p) {
          p.hidden = p.getAttribute("data-sk-pane") !== show;
        });
        if (screen) screen.scrollTop = 0;
      });
    });
  });

  // ---- rebuild screen: scale the fixed 480px layout to the laptop screen ----
  var termScreen = document.querySelector(".sk-term-screen");
  if (termScreen) {
    var termInner = termScreen.querySelector(".sk-term-inner");
    var fit = function () {
      var s = termScreen.clientWidth / 480;
      termInner.style.setProperty("--sk-s", s);
    };
    fit();
    if ("ResizeObserver" in window) new ResizeObserver(fit).observe(termScreen);
    else window.addEventListener("resize", fit);
  }

  // ---- prompt log screen: scale the fixed 760px layout to the laptop screen ----
  var logScreen = document.querySelector(".sk-log-screen");
  if (logScreen) {
    var logInner = logScreen.querySelector(".sk-log-inner");
    var logFit = function () { logInner.style.setProperty("--sk-s", logScreen.clientWidth / 760); };
    logFit();
    if ("ResizeObserver" in window) new ResizeObserver(logFit).observe(logScreen);
    else window.addEventListener("resize", logFit);
  }

  // ---- rebuild prompt, typed on a loop ----
  var term = document.querySelector("[data-sk-term]");
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (term && !reduceMotion) {
    var promptEl = term.querySelector("[data-sk-prompt]");
    var skillEl = promptEl.querySelector(".sk-term-skill");
    var skillText = skillEl.textContent;
    var restText = promptEl.textContent.slice(skillText.length);
    var steps = Array.prototype.slice.call(term.querySelectorAll(".sk-term-step"));
    var termTimer = null;
    var running = false;

    var caret = document.createElement("span");
    caret.className = "sk-term-caret";
    caret.setAttribute("aria-hidden", "true");
    promptEl.setAttribute("aria-label", skillText + restText);

    function paint(n) {
      var skill = document.createElement("span");
      skill.className = "sk-term-skill";
      skill.textContent = skillText.slice(0, n);
      var rest = n > skillText.length ? restText.slice(0, n - skillText.length) : "";
      promptEl.textContent = "";
      promptEl.appendChild(skill);
      promptEl.appendChild(document.createTextNode(rest));
      promptEl.appendChild(caret);
    }

    function cycle() {
      var total = skillText.length + restText.length;
      var n = 0;
      steps.forEach(function (s) { s.classList.remove("is-done"); });
      paint(0);
      clearInterval(termTimer);
      termTimer = setInterval(function () {
        n += 2;
        paint(Math.min(n, total));
        if (n >= total) {
          clearInterval(termTimer);
          var i = 0;
          termTimer = setInterval(function () {
            if (i < steps.length) {
              steps[i].classList.add("is-done");
              i += 1;
            } else {
              clearInterval(termTimer);
              setTimeout(cycle, 3000);
            }
          }, 650);
        }
      }, 28);
    }

    if ("IntersectionObserver" in window) {
      var tio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting && !running) { running = true; cycle(); }
        });
      }, { threshold: 0.3 });
      tio.observe(term);
    }
  }

  // ---- get phone playthrough (loops; replay in the header) ----
  var playBox = document.querySelector("[data-sk-play]");
  if (playBox) {
    var pframes = Array.prototype.slice.call(playBox.querySelectorAll(".sk-play-frame"));
    var pbtns = Array.prototype.slice.call(playBox.querySelectorAll("[data-sk-step]"));
    var pcount = playBox.querySelector("[data-sk-playcount]");
    var plabel = playBox.querySelector("[data-sk-playlabel]");
    var pbar = playBox.querySelector(".sk-play-bar span");
    var preplay = playBox.querySelector("[data-sk-playreplay]");
    var pidx = 0;
    var ptimer = null;
    var pvisible = false;
    var preduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function pshow(i) {
      pidx = i;
      pframes.forEach(function (f, k) {
        f.classList.toggle("is-current", k === i);
        f.setAttribute("aria-hidden", k === i ? "false" : "true");
      });
      if (plabel) plabel.textContent = pframes[i].getAttribute("data-label");
    }

    function pstart() {
      clearInterval(ptimer);
      if (preduce) return;
      ptimer = setInterval(function () {
        if (!pvisible) return;
        pshow((pidx + 1) % pframes.length);
      }, 2600);
    }

        pshow(0);

    if ("IntersectionObserver" in window) {
      var pio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting && !pvisible) { pvisible = true; pshow(0); pstart(); }
          else if (!e.isIntersecting) { pvisible = false; }
        });
      }, { threshold: 0.3 });
      pio.observe(playBox);
    } else {
      pvisible = true;
      pstart();
    }
  }

  // ---- prompt log ----
  var log = document.querySelector("[data-sk-log]");
  if (!log) return;

  var items = Array.prototype.slice.call(log.querySelectorAll(".sk-log-item"));
  var bar = log.querySelector(".sk-log-bar span");
  var count = log.querySelector("[data-sk-count]");
  var replay = log.querySelector("[data-sk-replay]");
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var timer = null;

  function show(n) {
    items.forEach(function (it, i) {
      it.classList.toggle("is-shown", i < n);
    });
    if (bar) bar.style.width = (n / items.length) * 100 + "%";
    var screen = log.querySelector(".sk-log-inner");
    if (screen) {
      if (n === 0) screen.scrollTop = 0;
      else if (items[n - 1]) screen.scrollTo({ top: Math.max(0, items[n - 1].offsetTop - 60), behavior: reduce ? "auto" : "smooth" });
    }
    if (count) count.textContent = n + " of " + items.length + " prompts";
  }

  function play() {
    clearInterval(timer);
    var n = 0;
    show(0);
    timer = setInterval(function () {
      n += 1;
      show(n);
      if (n >= items.length) clearInterval(timer);
    }, 900);
  }

  if (replay) replay.addEventListener("click", function () {
    if (reduce) { show(items.length); return; }
    play();
  });

  if (reduce || !("IntersectionObserver" in window)) {
    show(items.length);
    return;
  }

  log.classList.add("is-scripted");
  show(0);
  var seen = false;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting && !seen) {
        seen = true;
        play();
        io.disconnect();
      }
    });
  }, { threshold: 0.25 });
  io.observe(log);
})();
