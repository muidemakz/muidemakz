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
  var page = (location.pathname.split("/").pop() || "index.html").toLowerCase();

  // About and Work are the only two links; every page other than
  // index.html/404.html falls into one of "on the About page" or
  // "somewhere under Work" (every case study, my-work.html itself, and
  // the couple of standalone flow pages all count as Work).
  var activeAbout = page === "about.html";
  var activeWork = !activeAbout && page !== "index.html" && page !== "" && page !== "404.html";

  document.write(
    '<header class="site-header">' +
      '<div class="wrap">' +
        '<a href="index.html" class="logo">muidemakz</a>' +
        '<nav class="site-nav">' +
          '<a href="about.html" id="navAbout"' + (activeAbout ? ' class="is-active"' : "") + ">About</a>" +
          '<a href="my-work.html" id="navWork"' + (activeWork ? ' class="is-active"' : "") + ">Work</a>" +
        "</nav>" +
        '<a href="mailto:muidemakz@gmail.com" class="btn-outline">Contact</a>' +
      "</div>" +
    "</header>"
  );
})();
