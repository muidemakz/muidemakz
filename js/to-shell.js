/* Opening /fundall.html (or /about.html, /my-work.html) on its own moves you to the clean address,
   where the site opens the same page inside its container. Inside the container (?embed=1) nothing happens.
   Add ?standalone=1 to see a page on its own. */
(function () {
  if (window.top !== window.self || location.protocol === 'file:') return;
  if (/[?&](embed|standalone)=1/.test(location.search)) return;
  if (!/\.html$/.test(location.pathname)) return; /* already a clean address: never loop */
  var f = location.pathname.split('/').pop().replace(/\.html$/, '');
  location.replace((f === 'my-work' ? '/work' : '/' + f) + location.search);
})();
