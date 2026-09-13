// Highlights whichever .case-quicknav link matches the case-study section
// currently in view, with a white pill that slides between links as you
// scroll — kept deliberately separate from :hover (instant orange fill)
// so "here's where you are" never gets confused with "you're pointing at
// this". Generic: reads whatever #anchors the page's own quicknav links
// to, so this one file covers every case study without per-page tweaks.
(function () {
  const nav = document.querySelector(".case-quicknav");
  if (!nav) return;

  const wrap = nav.querySelector(".wrap");
  const links = Array.from(wrap.querySelectorAll('a[href^="#"]'));
  if (!links.length) return;

  const sections = links.map((a) => document.querySelector(a.getAttribute("href")));

  const highlight = document.createElement("span");
  highlight.className = "case-quicknav-highlight";
  highlight.setAttribute("aria-hidden", "true");
  wrap.insertBefore(highlight, wrap.firstChild);

  let activeIndex = -1;

  function moveHighlight(link) {
    highlight.style.opacity = "1";
    highlight.style.width = link.offsetWidth + "px";
    highlight.style.transform = "translateX(" + link.offsetLeft + "px)";
  }

  function setActive(i) {
    if (i === activeIndex || !links[i]) return;
    activeIndex = i;
    links.forEach((a, idx) => a.classList.toggle("is-active", idx === i));
    moveHighlight(links[i]);
    // keep the active pill in view when the bar itself scrolls horizontally
    links[i].scrollIntoView({ block: "nearest", inline: "nearest" });
  }

  function currentSectionIndex() {
    // classic scrollspy: the last section whose top has crossed a line
    // roughly a third of the way down the viewport
    const triggerY = window.innerHeight * 0.35;
    let idx = 0;
    for (let i = 0; i < sections.length; i++) {
      if (!sections[i]) continue;
      if (sections[i].getBoundingClientRect().top <= triggerY) idx = i;
    }
    return idx;
  }

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      setActive(currentSectionIndex());
      ticking = false;
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => {
    if (activeIndex !== -1) moveHighlight(links[activeIndex]);
  });

  setActive(currentSectionIndex());
})();
