#!/usr/bin/env node
// png-measure.js: measure pixels when a screenshot or exported frame is the source. Needs only Node.
//
//   node png-measure.js diff   a.png b.png [x0,y0,x1,y1]   mean difference and the share of pixels that differ,
//                                                          by 60 px band; the optional box is excluded (a photo slot)
//   node png-measure.js sample img.png x,y [x,y ...]       hex color at each point
//   node png-measure.js contrast #rrggbb #rrggbb           WCAG contrast ratio of two colors
//   node png-measure.js edges  img.png x0,y0,x1,y1         where color changes along the middle row and column of a box
//                                                          (finds faint borders and dividers that the eye misses)
//
// It reads 8-bit PNGs (RGB or RGBA, the usual screenshot format). It changes nothing.
const fs = require('fs'), zlib = require('zlib');

function decode(file) {
  const b = fs.readFileSync(file); let p = 8, w, h, bd, ct; const idat = [];
  while (p < b.length) {
    const len = b.readUInt32BE(p), type = b.toString('ascii', p + 4, p + 8), d = b.slice(p + 8, p + 8 + len); p += 12 + len;
    if (type === 'IHDR') { w = d.readUInt32BE(0); h = d.readUInt32BE(4); bd = d[8]; ct = d[9]; } else if (type === 'IDAT') idat.push(d);
  }
  if (bd !== 8 || ![2, 6].includes(ct)) throw new Error('only 8-bit RGB or RGBA PNGs are supported');
  const ch = ct === 6 ? 4 : 3, raw = zlib.inflateSync(Buffer.concat(idat)), stride = w * ch, px = Buffer.alloc(h * stride);
  for (let y = 0; y < h; y++) {
    const ft = raw[y * (stride + 1)];
    for (let x = 0; x < stride; x++) {
      const v = raw[y * (stride + 1) + 1 + x], a = x >= ch ? px[y * stride + x - ch] : 0, u = y ? px[(y - 1) * stride + x] : 0, c = (x >= ch && y) ? px[(y - 1) * stride + x - ch] : 0;
      let r;
      if (ft === 0) r = v; else if (ft === 1) r = v + a; else if (ft === 2) r = v + u; else if (ft === 3) r = v + ((a + u) >> 1);
      else { const pp = a + u - c, pa = Math.abs(pp - a), pb = Math.abs(pp - u), pc = Math.abs(pp - c); r = v + (pa <= pb && pa <= pc ? a : pb <= pc ? u : c); }
      px[y * stride + x] = r & 255;
    }
  }
  return { w, h, ch, px, at: (x, y) => { const o = (y * w + x) * ch; return [px[o], px[o + 1], px[o + 2]]; } };
}
const hex = c => '#' + c.map(v => v.toString(16).padStart(2, '0')).join('');
const lum = c => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
const rgb = s => { s = s.replace('#', ''); return [0, 2, 4].map(i => parseInt(s.slice(i, i + 2), 16)); };
const box = s => s.split(',').map(Number);
const [cmd, ...a] = process.argv.slice(2);

if (cmd === 'diff') {
  const A = decode(a[0]), B = decode(a[1]), ig = a[2] ? box(a[2]) : null;
  console.log('sizes', A.w + 'x' + A.h, B.w + 'x' + B.h);
  const W = Math.min(A.w, B.w), H = Math.min(A.h, B.h); let tot = 0, big = 0, sum = 0; const band = new Array(Math.ceil(H / 60)).fill(0);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (ig && x >= ig[0] && x <= ig[2] && y >= ig[1] && y <= ig[3]) continue;
    const p = A.at(x, y), q = B.at(x, y), d = (Math.abs(p[0] - q[0]) + Math.abs(p[1] - q[1]) + Math.abs(p[2] - q[2])) / 3;
    sum += d; tot++; if (d > 24) { big++; band[Math.floor(y / 60)]++; }
  }
  console.log('mean difference', (sum / tot).toFixed(2), '| pixels over 24:', big, '(' + (100 * big / tot).toFixed(2) + '%)');
  console.log('per 60 px band (y:count):', band.map((n, i) => i * 60 + ':' + n).join(' '));
} else if (cmd === 'sample') {
  const I = decode(a[0]);
  for (const pt of a.slice(1)) { const [x, y] = box(pt); console.log(pt, hex(I.at(x, y))); }
} else if (cmd === 'contrast') {
  const l1 = lum(rgb(a[0])), l2 = lum(rgb(a[1])), r = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  console.log(r.toFixed(2) + ':1', r >= 7 ? '(AAA text)' : r >= 4.5 ? '(AA text)' : r >= 3 ? '(large text, icons, borders only)' : '(fails)');
} else if (cmd === 'edges') {
  const I = decode(a[0]), [x0, y0, x1, y1] = box(a[1]), my = Math.round((y0 + y1) / 2), mx = Math.round((x0 + x1) / 2);
  const run = (n, get, label) => { let prev = get(0), out = []; for (let i = 1; i < n; i++) { const c = get(i); if (Math.abs(c[0] - prev[0]) + Math.abs(c[1] - prev[1]) + Math.abs(c[2] - prev[2]) > 6) out.push(label + (i) + ' ' + hex(prev) + '>' + hex(c)); prev = c; } return out; };
  console.log('along the middle row (x changes):', run(x1 - x0 + 1, i => I.at(x0 + i, my), 'x+').slice(0, 40).join('  '));
  console.log('along the middle column (y changes):', run(y1 - y0 + 1, i => I.at(mx, y0 + i), 'y+').slice(0, 40).join('  '));
} else {
  console.log('usage: node png-measure.js diff|sample|contrast|edges ...  (see the header of this file)');
}
