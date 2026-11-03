// measure-dom.js: read-only geometry, style, image, and copy measurement for a live page.
//
// Run it in the page through a browser tool that can execute JavaScript (it is an async
// function, so the tool must await the returned promise), after the viewport has been set
// and the page reloaded. Measure from the DOM, not from screenshots, which may be scaled.
//
// It never changes the page, except an optional scroll (see below). It returns a compact
// JSON summary and keeps the full data in window.__mmLast for follow-up queries:
//   window.__mmLast.regions, .headings, .controls, .icons, .images, .backgrounds, .copy
//
// Lazy loading: many pages keep a 1x1 placeholder in src and the real URL in data-src or a
// similar attribute until an image scrolls into view. This script reads the real URL from
// those attributes, srcset and data-srcset, picture sources, data-bg, and noscript
// fallbacks, so it does not need to scroll. Scrolling is an optional fallback and may not
// trigger the loader in an emulated or hidden pane, so the summary reports how many
// images still have no real URL.
//
// Optional settings, set before running:
//   window.__MM = {
//     regions: ['header', 'footer'],   // site-level regions to walk
//     depth: 4,                        // how deep to walk each region
//     controls: 'input,select,textarea,button,.btn',
//     nested: false,                   // true to include section headers and footers
//     scroll: false,                   // true to scroll the page in steps first
//     verify: true                     // request each image URL and report status and type
//   };
//
// Record the returned conditions in the run receipt. innerWidth can differ from
// clientWidth (scrollbar) and devicePixelRatio can differ from 1 in an emulated pane.
(async () => {
  const cfg = Object.assign({ regions: ['header', 'footer'], depth: 4, controls: 'input,select,textarea,button,.btn', nested: false, scroll: false, verify: true }, window.__MM || {});
  const px = n => Math.round(n * 10) / 10;
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  if (cfg.scroll) {
    const vh = innerHeight || 800;
    const h = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    for (let y = 0; y < h; y += Math.max(300, Math.round(vh * 0.8))) { window.scrollTo(0, y); await sleep(350); }
    window.scrollTo(0, h); await sleep(800); window.scrollTo(0, 0); await sleep(300);
  }
  const rect = e => { const b = e.getBoundingClientRect(); return { x: px(b.x), y: px(b.y + scrollY), w: px(b.width), h: px(b.height) }; };
  const style = e => { const s = getComputedStyle(e); return { display: s.display, position: s.position, gap: s.columnGap === 'normal' ? undefined : s.columnGap, padding: s.padding, margin: s.margin, font: s.fontFamily.split(',')[0].replace(/"/g, '') + ' ' + s.fontWeight + ' ' + s.fontSize + '/' + s.lineHeight, color: s.color, bg: s.backgroundColor, border: s.borderTopWidth + ' ' + s.borderTopStyle + ' ' + s.borderTopColor, radius: s.borderTopLeftRadius }; };
  const label = e => e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + (typeof e.className === 'string' && e.className.trim() ? '.' + e.className.trim().split(/\s+/).slice(0, 2).join('.') : '');
  const visible = e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0; };
  const walk = (e, d) => d > cfg.depth ? undefined : [...e.children].filter(visible).map(c => ({ el: label(c), ...rect(c), ...(c.children.length ? {} : { text: (c.textContent || '').trim().slice(0, 40) }), style: style(c), kids: walk(c, d + 1) }));
  const conditions = { url: location.href, readyState: document.readyState, innerWidth, innerHeight, clientWidth: document.documentElement.clientWidth, devicePixelRatio, scrollY, visualViewportScale: window.visualViewport ? window.visualViewport.scale : 1, reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches, scrolled: cfg.scroll };
  const warnings = [];
  if (!innerWidth || !innerHeight) warnings.push('The viewport has zero size, so every measurement is invalid. Set a viewport, reload the page, and run this again.');
  else if (document.documentElement.clientWidth !== innerWidth) warnings.push('clientWidth (' + document.documentElement.clientWidth + ') differs from innerWidth (' + innerWidth + '), usually a scrollbar. Record both.');
  if (devicePixelRatio !== 1) warnings.push('devicePixelRatio is ' + devicePixelRatio + ', so the pane is scaled. Measure from the DOM, not from screenshots.');
  const siteLevel = e => cfg.nested || !(e.parentElement && e.parentElement.closest('main,section,article'));
  const regions = cfg.regions.flatMap(sel => [...document.querySelectorAll(sel)].filter(e => visible(e) && siteLevel(e)).map(e => ({ selector: sel, el: label(e), ...rect(e), style: style(e), tree: walk(e, 1) })));
  const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(visible).map(h => { const sec = h.closest('section,[class*="layout--"]'); const s = sec ? getComputedStyle(sec) : null; return { level: h.tagName, text: h.textContent.trim().slice(0, 80), section: sec ? label(sec) : null, padTop: s && s.paddingTop, padBottom: s && s.paddingBottom, y: px(h.getBoundingClientRect().y + scrollY) }; });
  const controls = [...document.querySelectorAll(cfg.controls)].filter(visible).slice(0, 60).map(e => ({ el: label(e), type: e.type || undefined, ...rect(e), style: style(e) }));
  const icons = [...document.querySelectorAll('svg')].filter(visible).slice(0, 80).map(s => ({ parent: label(s.parentElement), ...rect(s), viewBox: s.getAttribute('viewBox'), paths: [...s.querySelectorAll('path')].slice(0, 2).map(p => (p.getAttribute('d') || '').slice(0, 80)) }));

  // Images. Read the real URL from lazy-load attributes, not from src.
  const abs = u => { try { return new URL(u, location.href).href; } catch (e) { return u; } };
  const bestFromSet = s => { if (!s) return null; const c = s.split(',').map(x => x.trim().split(/\s+/)).map(([u, d]) => ({ u, w: parseFloat(d) || 0 })).filter(x => x.u && !x.u.startsWith('data:')); c.sort((a, b) => b.w - a.w); return c[0] ? c[0].u : null; };
  const realSrc = i => { const pic = i.closest('picture'); const picSet = pic ? [...pic.querySelectorAll('source')].map(s => s.dataset.srcset || s.srcset).filter(Boolean).join(',') : ''; const c = [i.dataset.src, i.dataset.lazySrc, i.dataset.original, bestFromSet(i.dataset.srcset), bestFromSet(i.srcset), bestFromSet(picSet), i.currentSrc, i.src].find(u => u && !u.startsWith('data:')); return c ? abs(c) : null; };
  const lazyHint = i => /lazy/i.test(i.className) || ['src', 'lazySrc', 'original', 'srcset'].some(k => i.dataset[k]) || i.loading === 'lazy';
  const images = [...document.images].map(i => { const sec = i.closest('section,[class*="layout--"]'); const b = rect(i); return { url: realSrc(i), state: (i.currentSrc || i.src || '').startsWith('data:') ? 'lazy-not-loaded' : 'loaded', lazy: lazyHint(i), hidden: b.w === 0 || b.h === 0, alt: (i.alt || '').slice(0, 60), ...b, natural: i.naturalWidth + 'x' + i.naturalHeight, fit: getComputedStyle(i).objectFit, section: sec ? label(sec) : null }; });
  const noscriptUrls = [...document.querySelectorAll('noscript')].flatMap(n => [...n.textContent.matchAll(/<img[^>]+src=["']([^"']+)/gi)].map(m => abs(m[1])));
  const bgOf = e => { const v = e.dataset.bg || e.dataset.backgroundImage || ''; const c = getComputedStyle(e).backgroundImage; const u = v ? v : (/url\(["']?data:/.test(c) ? '' : (c.match(/url\(["']?([^"')]+)/) || [])[1]); return u ? abs(u.replace(/^url\(["']?|["']?\)$/g, '')) : null; };
  const backgrounds = [...document.querySelectorAll('*')].map(e => ({ el: label(e), url: bgOf(e) })).filter(x => x.url);
  const videos = [...document.querySelectorAll('video')].map(v => ({ src: abs(v.currentSrc || v.src || ''), poster: v.poster ? abs(v.poster) : null }));
  const distinct = [...new Set([...images.map(i => i.url), ...backgrounds.map(b => b.url), ...noscriptUrls].filter(Boolean))];
  let verified;
  if (cfg.verify) {
    const res = await Promise.all(distinct.map(async u => { try { const r = await fetch(u, { method: 'HEAD' }); return { u, status: r.status, type: r.headers.get('content-type'), kb: Math.round((+r.headers.get('content-length') || 0) / 1024) }; } catch (e) { return { u, status: 'unverified', note: 'request blocked (likely cross-origin)' }; } }));
    const ok = res.filter(r => r.status === 200 && /^(image|video)\//.test(r.type || ''));
    verified = { checked: res.length, ok: ok.length, notOk: res.filter(r => !ok.includes(r)).slice(0, 10), types: [...new Set(ok.map(r => r.type))], largestKB: Math.max(0, ...ok.map(r => r.kb)) };
  }
  const imageSummary = { total: images.length, loaded: images.filter(i => i.state === 'loaded').length, lazyNotLoaded: images.filter(i => i.state === 'lazy-not-loaded').length, lazyDetected: images.filter(i => i.lazy).length, hidden: images.filter(i => i.hidden).length, visibleWithoutRealUrl: images.filter(i => !i.hidden && !i.url).length, distinctUrls: distinct.length, noscriptFallbacks: noscriptUrls.length, cssBackgrounds: backgrounds.length, videos: videos.length };

  // Copy: verbatim text per outermost section, for string-by-string comparison.
  const copy = [...document.querySelectorAll('section,[class*="layout--"]')].filter(sec => visible(sec) && !(sec.parentElement && sec.parentElement.closest('section,[class*="layout--"]'))).map(sec => ({ section: label(sec), texts: [...sec.querySelectorAll('h1,h2,h3,h4,h5,h6,p,li,a,button,label,th,td,figcaption,span')].filter(e => !e.children.length && e.getClientRects().length && (e.textContent || '').trim()).map(e => (e.textContent || '').trim().replace(/\s+/g, ' ')) }));

  const out = { conditions, regions, headings, controls, icons, images, backgrounds, videos, noscriptUrls, verified, copy };
  window.__mmLast = out;
  return JSON.stringify({ fullSize: JSON.stringify(out).length, conditions, warnings, imageSummary, verified, images: images.slice(0, 60).map(i => ({ url: i.url, state: i.state, hidden: i.hidden, w: i.w, h: i.h, natural: i.naturalWidth, section: i.section, alt: i.alt })), backgrounds: backgrounds.slice(0, 20), videos, counts: { regions: regions.length, headings: headings.length, controls: controls.length, icons: icons.length, sectionsWithCopy: copy.length }, copySummary: copy.map(c => ({ section: c.section, items: c.texts.length, first: c.texts.slice(0, 2) })), regions: regions.map(r => ({ el: r.el, x: r.x, y: r.y, w: r.w, h: r.h, position: r.style.position })), headings: headings.slice(0, 40), controls: controls.map(c => ({ el: c.el, w: c.w, h: c.h, font: c.style.font, padding: c.style.padding, radius: c.style.radius, border: c.style.border })) });
})()
