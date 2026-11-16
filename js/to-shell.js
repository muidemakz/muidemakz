/* Opening /fundall.html (or /about.html, /my-work.html) on its own moves you to the clean address,
   where the site opens the same page inside its container. Inside the container nothing happens.
   There is no standalone view: even ?embed=1 or ?standalone=1 opened on their own forward to the site. */
(function () {
  if (window.top !== window.self || location.protocol === 'file:') return;
  if (!/\.html$/.test(location.pathname)) return; /* already a clean address: never loop */
  var f = location.pathname.split('/').pop().replace(/\.html$/, '');
  var q = location.search.replace(/([?&])(embed|standalone)=1&?/g, '$1').replace(/[?&]$/, '');
  location.replace((f === 'my-work' ? '/work' : '/' + f) + q + location.hash);
})();
