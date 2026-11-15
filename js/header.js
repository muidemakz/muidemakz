// Universal site header, injected on every page instead of each page
// carrying its own copy of the <header class="site-header"> markup.
// [REVERT POINT] TEST CHANGE, round 21 (branch: test/homepage-backdrop-prose)
// — replaces 17 separate hand-maintained copies of this markup (the exact
// bug that let index.html's About/Work order and other pages' order drift
// apart). To use on a page: remove that page's own <header class=
// "site-header">...</header> block and put `<div id="site-header-root">
// </div><script src="js/header.js"></script>` in its place, in the same
// spot in <body>. Runs via document.write, so it must stay a plain,
// synchronous (non-async, non-defer) <script src> at the exact point in
// the body where the header should render — same constraint any classic
// server-side include would have.
(function () {
  // Opened inside the home shell's container (?embed=1): hide our own header and let the shell drive navigation.
  var embedded = /[?&]embed=1/.test(location.search) && window.top !== window.self;
  if (embedded) document.documentElement.classList.add("embed");
  var page = (location.pathname.split("/").pop() || "index.html").toLowerCase();

  // About and Work are the only two links; every page other than
  // index.html/404.html falls into one of "on the About page" or
  // "somewhere under Work" (every case study, my-work.html itself, and
  // the couple of standalone flow pages all count as Work).
  var activeAbout = page === "about.html";
  var activeWork = !activeAbout && page !== "index.html" && page !== "" && page !== "404.html";
  var isLanding = page === "index.html" || page === "";
  var landingContact = isLanding
    ? '<div class="landing-header-actions">' +
        '<a href="mailto:muidemakz@gmail.com" class="btn-outline">Say Hi</a>' +
        '<nav class="landing-socials" aria-label="Social profiles">' +
          '<a href="https://www.linkedin.com/in/makanju-excellent-211b0a44/" target="_blank" rel="noopener" aria-label="LinkedIn">in</a>' +
          '<a href="https://dribbble.com/muidemakz" target="_blank" rel="noopener" aria-label="Dribbble">Dr</a>' +
          '<a href="https://www.instagram.com/oluwaexcellent" target="_blank" rel="noopener" aria-label="Instagram">Ig</a>' +
          '<a href="https://www.behance.net/oemakanju" target="_blank" rel="noopener" aria-label="Behance">Be</a>' +
        '</nav>' +
      '</div>'
    : '<a href="mailto:muidemakz@gmail.com" class="btn-outline">Contact</a>';

  document.write(
    '<header class="site-header">' +
      '<div class="wrap">' +
        '<a href="index.html" class="logo">muidemakz</a>' +
        '<nav class="site-nav">' +
          '<a href="about.html" id="navAbout"' + (activeAbout ? ' class="is-active"' : "") + ">About</a>" +
          '<a href="my-work.html" id="navWork"' + (activeWork ? ' class="is-active"' : "") + ">Work</a>" +
        "</nav>" +
        landingContact +
      "</div>" +
    "</header>"
  );

  // Site-wide UI motion layer. Every page already loads this file at the top
  // of <body>, so it is the one place to include the layer. The stylesheet is
  // written here (render-blocking, so nothing flashes unstyled) and, being in
  // the body, it comes after every head stylesheet in the cascade. The script
  // waits for DOMContentLoaded itself. Both are no-ops for visitors who prefer
  // reduced motion. Remove these two lines to switch the layer off everywhere.
  document.write('<link rel="stylesheet" href="css/motion.css">');
  document.write('<script src="js/motion.js"><\/script>');
  if (embedded) document.write('<script src="js/embed-preview.js"><\/script>');

  // [REVERT POINT] Design-board layer, on every page: dot-grid canvas, your
  // own cursor, other visitors' cursors (real if js/board-config.js has a
  // transport, otherwise simulated demo visitors) and "/" cursor chat.
  // To turn it off everywhere, delete these four lines. For one browser,
  // add ?board=off to any URL. Touch devices only get the dot grid.
  document.write('<link rel="stylesheet" href="css/board.css">');
  document.write('<script src="js/board-cursors.js"><\/script>');
  document.write('<script src="js/board-config.js"><\/script>');
  document.write('<script src="js/board.js"><\/script>');

  // Case-study "Back" link: returns to the exact Work page (page, filters,
  // scroll) the visitor came from. js/work.js stores that state in
  // sessionStorage; history.back() is used when Work was the previous page.
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest(".case-back");
    if (embedded) return; // the shell handles Back when a page is open inside its container
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
    // Also returns to the rail previews (index-preview / about-preview) when that is where the visitor came from.
    var fromWork = false;
    try {
      var ref = new URL(document.referrer);
      var refPage = ref.pathname.split("/").pop();
      fromWork = ref.origin === location.origin && (refPage === "my-work.html" || refPage === "index-preview.html" || refPage === "about-preview.html");
    } catch (err) {}
    if (fromWork && history.length > 1) { e.preventDefault(); history.back(); return; }
    try { if (sessionStorage.getItem("workState")) sessionStorage.setItem("workReturn", "1"); } catch (err) {}
  });
})();
