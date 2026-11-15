/* Cursor designs for the design-board layer. Pick one on cursor-options-preview.html
   (saved in localStorage as "board-cursor") or set BOARD_CONFIG.cursor in js/board-config.js. */
(function () {
  var MINT = '#ff5a1f', INK = '#0e0e0e', WHITE = '#ffffff';
  var SHARP = 'M5 3 L5 24 L10.8 18.8 L14.8 27.4 L18.6 25.7 L14.7 17.2 L22.6 17.2 Z';
  var PIXEL = 'M5 3h3v3h3v3h3v3h3v3h3v3h-6v3h3v6h-3v-3h-3v-3h-3v3h-3z';
  var STAR = 'M16 3 Q17.4 14.6 29 16 Q17.4 17.4 16 29 Q14.6 17.4 3 16 Q14.6 14.6 16 3Z';
  /* Teardrop: a round body with one pointed corner at the top left */
  var DROP = 'M7 7 L17.87 7.04 A10 10 0 1 1 7.04 17.87 Z';

  /* Draws a polygon with softly rounded corners (quadratic curves at each vertex) */
  function roundPath(pts, r) {
    var n = pts.length, d = '';
    for (var i = 0; i < n; i++) {
      var p0 = pts[(i + n - 1) % n], p1 = pts[i], p2 = pts[(i + 1) % n];
      var v1 = [p0[0] - p1[0], p0[1] - p1[1]], v2 = [p2[0] - p1[0], p2[1] - p1[1]];
      var l1 = Math.sqrt(v1[0] * v1[0] + v1[1] * v1[1]), l2 = Math.sqrt(v2[0] * v2[0] + v2[1] * v2[1]);
      var rr = Math.min(r, l1 / 2, l2 / 2);
      var a = [p1[0] + v1[0] / l1 * rr, p1[1] + v1[1] / l1 * rr];
      var b = [p1[0] + v2[0] / l2 * rr, p1[1] + v2[1] / l2 * rr];
      d += (i ? 'L' : 'M') + a[0].toFixed(2) + ' ' + a[1].toFixed(2) + ' Q' + p1[0] + ' ' + p1[1] + ' ' + b[0].toFixed(2) + ' ' + b[1].toFixed(2);
    }
    return d + 'Z';
  }
  /* A slightly plumper arrow than the sharp one, every corner rounded */
  var SOFT = roundPath([[5.5, 3.5], [5.5, 25.5], [11.2, 20.2], [15.2, 28.2], [19.6, 26.1], [15.6, 18], [23.8, 18]], 3.4);

  /* Outline arrow: a navigation-style arrow, white with a bold black outline, rounded everywhere */
  var OUT = roundPath([[4.5, 4.5], [28, 13], [17.6, 17.6], [13, 28]], 5.6);
  /* Pointing finger shown over links: index finger up, three rounded knuckles, thumb tucked in */
  var HAND = 'M12.2 14.2 L12.2 5 Q12.2 2.6 14.6 2.6 Q17 2.6 17 5 L17 12.4 Q17 11.2 18.6 11.2 Q20.2 11.2 20.2 12.8 L20.2 13 Q20.2 12 21.7 12 Q23.2 12 23.2 13.4 L23.2 14 Q23.2 13.2 24.6 13.2 Q26 13.2 26 14.8 L26 21.5 Q26 27 20.6 27 L16.4 27 Q13.6 27 12 24.8 L7.8 19.2 Q7 18 8.1 17.2 Q9.2 16.4 10.3 17.4 L12.2 19.2 Z';

  var LIST = [
    { id: 'outline-arrow', name: 'Outline arrow', note: 'White arrow with a bold black outline, rounded all over. Turns into a pointing finger over links.', hot: [6, 6], fill: WHITE, stroke: INK,
      draw: function (f, s) { return '<path d="' + OUT + '" fill="' + f + '" stroke="' + s + '" stroke-width="3.2" stroke-linejoin="round"/>'; },
      link: { hot: [14, 3], draw: function (f, s) { return '<path d="' + HAND + '" fill="' + f + '" stroke="' + s + '" stroke-width="2.6" stroke-linejoin="round"/>'; } } },
    { id: 'soft-arrow', name: 'Soft arrow', note: 'A plump arrow with every corner rounded. Friendly, not flat.', hot: [6, 5], fill: MINT, stroke: WHITE,
      draw: function (f, s) { return '<path d="' + SOFT + '" fill="' + f + '" stroke="' + s + '" stroke-width="2.4" stroke-linejoin="round"/>'; } },
    { id: 'teardrop', name: 'Teardrop', note: 'A round body with one pointed corner, like a comment bubble.', hot: [7, 7], fill: MINT, stroke: WHITE,
      draw: function (f, s) { return '<path d="' + DROP + '" fill="' + f + '" stroke="' + s + '" stroke-width="2.4" stroke-linejoin="round"/>'; } },
    { id: 'mint-arrow', name: 'Sharp arrow', note: 'The classic canvas arrow, straight edges.', hot: [5, 3], fill: MINT, stroke: WHITE,
      draw: function (f, s) { return '<path d="' + SHARP + '" fill="' + f + '" stroke="' + s + '" stroke-width="1.8" stroke-linejoin="round"/>'; } },
    { id: 'chunky', name: 'Chunky arrow', note: 'Heavier outline with rounded joins. Easy to spot.', hot: [5, 3], fill: MINT, stroke: INK,
      draw: function (f, s) { return '<path d="' + SHARP + '" fill="' + f + '" stroke="' + s + '" stroke-width="3.4" stroke-linejoin="round"/>'; } },
    { id: 'monogram', name: 'M dot', note: 'A round mint dot with your initial. Reads as a signature.', hot: [16, 16], fill: MINT, stroke: WHITE,
      draw: function (f, s) { return '<circle cx="16" cy="16" r="11" fill="' + f + '" stroke="' + s + '" stroke-width="2"/><text x="16" y="20.6" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="700" fill="' + (f === WHITE ? INK : '#1a0900') + '">M</text>'; } },
    { id: 'ring', name: 'Target ring', note: 'A thin ring with a centre dot. Precise, like a design tool.', hot: [16, 16], fill: MINT, stroke: WHITE,
      draw: function (f, s) { return '<circle cx="16" cy="16" r="10" fill="none" stroke="' + s + '" stroke-width="3.6"/><circle cx="16" cy="16" r="10" fill="none" stroke="' + f + '" stroke-width="1.8"/><circle cx="16" cy="16" r="2.6" fill="' + f + '" stroke="' + s + '" stroke-width="1"/>'; } },
    { id: 'pen', name: 'Pen nib', note: 'A pen-tool nib. Says designer without saying it.', hot: [5, 27], fill: MINT, stroke: WHITE,
      draw: function (f, s) { return '<path d="M5 27 L8.2 16.8 L19 6 L26 13 L15.2 23.8 Z" fill="' + f + '" stroke="' + s + '" stroke-width="1.8" stroke-linejoin="round"/><path d="M8.2 16.8 L15.2 23.8" stroke="' + s + '" stroke-width="1.4"/><circle cx="16.4" cy="15.4" r="1.7" fill="' + s + '"/>'; } },
    { id: 'sparkle', name: 'Sparkle', note: 'A four-point star. More playful, good for a creative practice.', hot: [16, 16], fill: MINT, stroke: WHITE,
      draw: function (f, s) { return '<path d="' + STAR + '" fill="' + f + '" stroke="' + s + '" stroke-width="1.6" stroke-linejoin="round"/>'; } },
    { id: 'pixel', name: 'Pixel arrow', note: 'A stepped, pixel-art arrow. Nostalgic and distinctive.', hot: [5, 3], fill: MINT, stroke: INK,
      draw: function (f, s) { return '<path shape-rendering="crispEdges" d="' + PIXEL + '" fill="' + f + '" stroke="' + s + '" stroke-width="1.6"/>'; } }
  ];

  function find(id) {
    for (var i = 0; i < LIST.length; i++) if (LIST[i].id === id) return LIST[i];
    return LIST[0];
  }
  /* link = the hover variant: fill and edge swapped so it clearly changes over links */
  function svg(id, link) {
    var c = find(id);
    var inner;
    if (link && c.link) inner = c.link.draw(c.fill, c.stroke);
    else {
      var f = link ? c.stroke : c.fill;
      var s = link ? c.fill : c.stroke;
      if (link && (c.id === 'chunky' || c.id === 'pixel')) { f = WHITE; s = INK; }
      inner = c.draw(f, s);
    }
    return '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">' + inner + '</svg>';
  }
  function css(id, link) {
    var c = find(id);
    var hot = link && c.link ? c.link.hot : c.hot;
    return 'url("data:image/svg+xml;utf8,' + encodeURIComponent(svg(id, link)) + '") ' + hot[0] + ' ' + hot[1] + ', ' + (link ? 'pointer' : 'auto');
  }
  /* Other visitors: the same outline arrow filled with their own colour, a little smaller than yours,
     switching to the pointing finger only while they are hovering something clickable. */
  function peer(color) {
    return '<svg class="pc-arrow" width="22" height="22" viewBox="0 0 32 32" aria-hidden="true">' +
      '<path d="' + OUT + '" fill="' + color + '" stroke="#0e0e0e" stroke-width="3" stroke-linejoin="round"/></svg>';
  }
  function peerHand(color) {
    return '<svg class="pc-arrow pc-arrow--hand" width="22" height="22" viewBox="0 0 32 32" aria-hidden="true">' +
      '<path d="' + HAND + '" fill="' + color + '" stroke="#0e0e0e" stroke-width="2.6" stroke-linejoin="round"/></svg>';
  }

  window.BOARD_CURSORS = { list: LIST, find: find, svg: svg, css: css, peer: peer, peerHand: peerHand, defaultId: 'outline-arrow' };
})();
