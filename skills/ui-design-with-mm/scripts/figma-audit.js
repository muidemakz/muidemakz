// figma-audit.js: read-only audit of a Figma page or node.
//
// STATUS: self-test passed on a scratch file (see below). It still audits only what it can read,
// so treat a result of zero as "none found by these checks", not as "the file is clean".
//
// SELF-TEST (run it before trusting a zero on a new connection or after any edit):
//   1. On a scratch page, create a text node with a hand-set font, a rectangle with a typed hex
//      fill and typed corner radius, a frame named "Frame 12", a component named "Radio" under
//      48px, and a node at a fractional x. Add one fully bound rectangle as a control.
//   2. Run this script on that frame's id. Every planted defect must appear and the bound
//      control must not. If any is missed, the script under-counts; audit by hand.
//   3. Delete the scratch frame.
//
// HOST NOTES (found in testing):
//   - figma.loadAllPagesAsync() is NOT supported on the Figma MCP connection, so this script
//     does not call it. It audits the current page, or the node ROOT points at.
//   - To audit another page, switch to it once per call with await figma.setCurrentPageAsync(page)
//     before running this, and run one call per page.
//   - Run it through the connection's plugin-API tool. It changes nothing.
//
// It reports: components or component sets without Auto Layout; component sets whose variant gap
// is under 24px; unbound text, fills, strokes, radii, spacing and effects (skipping the insides
// of instances, which belong to their main component); text that looks like a glyph icon;
// instances with their own reactions; empty slots inside components; instance counts per main
// component; default-named or version-named layers; loose shapes sitting directly in a frame
// without Auto Layout outside any component (a REVIEW list: a legitimate divider or background
// also appears, but a control assembled from loose ellipses does too); fixed sizes and absolute
// positions that are not whole pixels; selection controls (checkbox, radio, toggle, and
// similar) under the hit area; and flow structure on the canvas: Sections with no title text
// above their frames, screen-sized top-level frames that sit outside any Section (a REVIEW
// list), frames or Sections named with a duplicate suffix ("Transactions 2", "Copy of ..."), and
// groups of three or more standalone components at one level with the same structure, which are
// probably variants of one set and not siblings (a REVIEW list), and screen-sized frames whose width
// is not a standard device or breakpoint width (a REVIEW list; the frame-size rule says to flag these).
//
// For a large file where you only want the flow structure, set FLOW_ONLY = true. It reads the
// page's top level and each Section's direct children, and does not walk inside frames. It does
// not switch pages, so it cannot disturb what someone is editing.
const ROOT = null;       // a node id, or null for the current page
const FLOW_ONLY = false; // true: check flow structure only, no deep walk
const SCREEN_MIN = 320;  // a top-level frame at least this wide counts as a screen
const HIT = 48;          // minimum hit area for selection controls, in px (the user's theme may set another)
const GLYPH = /[⌄⌃☰×✓✕✔▾▴▲▼◌↻→←+−]/;
const DEFAULT_NAME = /^(Frame|Group|Rectangle|Ellipse|Vector|Line|Polygon|Star|Section|Component|Slice)(\s\d+)?$/;
const VERSION_WORD = /\b(final|new|copy|temp|old|v\d+)\b/i;
const CONTROL_NAME = /\b(checkbox|radio|toggle|switch|stepper|segmented|slider)\b/i;
const SHAPE = new Set(['RECTANGLE', 'ELLIPSE', 'VECTOR', 'STAR', 'POLYGON', 'LINE']);
const root = ROOT ? await figma.getNodeByIdAsync(ROOT) : figma.currentPage;
const has = v => v !== undefined && v !== null && v !== '' && v !== figma.mixed;
const bv = (n, k) => n.boundVariables && n.boundVariables[k];
const whole = v => Math.abs(v - Math.round(v)) < 0.01;
const out = {
  scope: root.name, components: 0, componentSets: 0, noAutoLayout: [], variantGapUnder24: [],
  unbound: { text: [], fill: [], stroke: [], radius: [], spacing: [], effect: [] },
  glyphText: [], instanceReactions: [], emptySlots: [], instancesByMain: {},
  defaultNames: [], versionNames: [], looseShapes: [], fractional: [], controlsUnderHitArea: [],
  sectionsWithoutTitle: [], framesOutsideSection: [], duplicateSuffix: [], standaloneSiblings: [], nonStandardWidth: []
};
const STD_WIDTHS = new Set([320, 360, 375, 390, 393, 402, 412, 414, 430, 744, 768, 810, 820, 834, 1024, 1180, 1280, 1366, 1440, 1512, 1536, 1728, 1920]);
const sibGroups = {};
const tag = n => n.id + ' ' + n.name;
const DUP_SUFFIX = /(\s\d{1,2}$)|(^copy of\s)|(\scopy(\s\d+)?$)/i;

async function visit(n, insideInstance, insideComponent, parent) {
  if (n.type === 'COMPONENT' && !insideInstance && n.parent && n.parent.type !== 'COMPONENT_SET') {
    const lvl = n.name.split('/')[0].trim();
    const key = lvl + '|' + n.layoutMode + '|' + (n.children || []).map(c => c.type).join(',');
    (sibGroups[key] = sibGroups[key] || []).push(tag(n));
  }
  if (n.type === 'COMPONENT') { out.components++; if (n.layoutMode === 'NONE') out.noAutoLayout.push(tag(n)); }
  if (n.type === 'COMPONENT_SET') {
    out.componentSets++;
    if (n.layoutMode === 'NONE') out.noAutoLayout.push(tag(n) + ' (set)');
    else if (n.itemSpacing < 24 || (n.layoutWrap === 'WRAP' && n.counterAxisSpacing < 24)) out.variantGapUnder24.push(tag(n) + ' gap=' + n.itemSpacing + '/' + n.counterAxisSpacing);
  }
  if (n.type === 'INSTANCE') {
    const main = await n.getMainComponentAsync();
    const key = main ? main.name : '(detached or missing)';
    out.instancesByMain[key] = (out.instancesByMain[key] || 0) + 1;
    if (n.reactions && n.reactions.length) out.instanceReactions.push(tag(n) + ' x' + n.reactions.length);
  }
  if (n.type === 'TEXT') {
    if (GLYPH.test(n.characters) && n.characters.trim().length <= 2) out.glyphText.push(tag(n) + ' "' + n.characters + '"');
    if (!insideInstance) {
      const styled = has(n.textStyleId);
      const vars = bv(n, 'fontSize') || bv(n, 'fontFamily') || bv(n, 'lineHeight');
      if (!styled && !vars) out.unbound.text.push(tag(n));
    }
  }
  // a component set's own container (Figma's dashed outline, default padding) and a Section's fill are canvas furniture, not design values
  const furniture = n.type === 'COMPONENT_SET' || n.type === 'SECTION';
  if (!insideInstance) {
    if (!furniture && n.fills && n.fills !== figma.mixed && n.fills.some(f => f.type === 'SOLID' && f.visible !== false)) {
      const ok = has(n.fillStyleId) || n.fills.every(f => f.type !== 'SOLID' || (f.boundVariables && f.boundVariables.color));
      if (!ok) out.unbound.fill.push(tag(n));
    }
    if (!furniture && n.strokes && n.strokes.length && n.strokes.some(f => f.type === 'SOLID')) {
      const ok = has(n.strokeStyleId) || n.strokes.every(f => f.type !== 'SOLID' || (f.boundVariables && f.boundVariables.color));
      if (!ok) out.unbound.stroke.push(tag(n));
    }
    if (!furniture && ((typeof n.cornerRadius === 'number' && n.cornerRadius > 0) || n.cornerRadius === figma.mixed)) {
      if (!(bv(n, 'topLeftRadius') || bv(n, 'topRightRadius') || bv(n, 'bottomLeftRadius') || bv(n, 'bottomRightRadius'))) out.unbound.radius.push(tag(n));
    }
    if (!furniture && n.layoutMode && n.layoutMode !== 'NONE') {
      const miss = (n.itemSpacing > 0 && !bv(n, 'itemSpacing')) || (n.paddingLeft > 0 && !bv(n, 'paddingLeft')) || (n.paddingRight > 0 && !bv(n, 'paddingRight')) || (n.paddingTop > 0 && !bv(n, 'paddingTop')) || (n.paddingBottom > 0 && !bv(n, 'paddingBottom'));
      if (miss) out.unbound.spacing.push(tag(n));
    }
    if (n.effects && n.effects.length && !has(n.effectStyleId) && !n.effects.every(e => e.boundVariables && Object.keys(e.boundVariables).length)) out.unbound.effect.push(tag(n));

    // naming
    if (n !== root && n.type !== 'TEXT' && n.type !== 'INSTANCE') {
      if (DEFAULT_NAME.test(n.name)) out.defaultNames.push(tag(n));
      else if (VERSION_WORD.test(n.name)) out.versionNames.push(tag(n));
    }
    // loose shapes: a shape sitting directly in a frame without Auto Layout, outside any component
    if (SHAPE.has(n.type) && !insideComponent && parent && parent.type !== 'PAGE' && parent.layoutMode === 'NONE') out.looseShapes.push(tag(n) + ' in ' + parent.name);
    // whole pixels: absolute positions and fixed sizes
    if (n !== root && n.type !== 'TEXT' && 'x' in n) {
      const abs = !parent || parent.type === 'PAGE' || !parent.layoutMode || parent.layoutMode === 'NONE' || n.layoutPositioning === 'ABSOLUTE';
      const bad = [];
      if (abs && (!whole(n.x) || !whole(n.y))) bad.push('x/y=' + n.x + '/' + n.y);
      if ((!whole(n.width) && n.layoutSizingHorizontal === 'FIXED') || (!whole(n.height) && n.layoutSizingVertical === 'FIXED')) bad.push('w/h=' + n.width + '/' + n.height);
      if (bad.length) out.fractional.push(tag(n) + ' ' + bad.join(' '));
    }
    // selection controls under the hit area
    if ((n.type === 'COMPONENT' || n.type === 'COMPONENT_SET') && (CONTROL_NAME.test(n.name) || (n.parent && n.parent.type === 'COMPONENT_SET' && CONTROL_NAME.test(n.parent.name)))) {
      if (n.type === 'COMPONENT' && Math.min(n.width, n.height) < HIT) out.controlsUnderHitArea.push(tag(n) + ' ' + n.width + 'x' + n.height);
    }
  }
  if (insideComponent && n.type === 'FRAME' && /detail|slot|content/i.test(n.name) && n.children.length === 0) out.emptySlots.push(tag(n));
  if ('children' in n) for (const c of n.children) await visit(c, insideInstance || n.type === 'INSTANCE', insideComponent || n.type === 'COMPONENT', n);
}
// flow structure: Sections need a title above their frames; screens belong in a Section; names carry no duplicate suffix
const dupCheck = n => { if (!/=/.test(n.name) && DUP_SUFFIX.test(n.name)) out.duplicateSuffix.push(tag(n)); };
const flowList = root.type === 'SECTION' ? [root] : (root.children || []);
for (const k of flowList) {
  if (k.type === 'SECTION') {
    dupCheck(k);
    const kids = k.children || [];
    const frames = kids.filter(c => (c.type === 'FRAME' || c.type === 'COMPONENT' || c.type === 'COMPONENT_SET') && c.width >= SCREEN_MIN && c.height >= SCREEN_MIN);
    frames.forEach(dupCheck);
    frames.forEach(f => { if (f.type === 'FRAME' && !STD_WIDTHS.has(Math.round(f.width))) out.nonStandardWidth.push(tag(f) + ' ' + Math.round(f.width) + 'x' + Math.round(f.height)); });
    if (frames.length) {
      const top = Math.min(...frames.map(f => f.y));
      const titled = kids.some(c => c.type === 'TEXT' && c.y + c.height <= top + 1);
      if (!titled) out.sectionsWithoutTitle.push(tag(k));
    }
  } else if (k.type === 'FRAME' && k.width >= SCREEN_MIN && (root.type === 'PAGE')) {
    out.framesOutsideSection.push(tag(k));
    if (!STD_WIDTHS.has(Math.round(k.width))) out.nonStandardWidth.push(tag(k) + ' ' + Math.round(k.width) + 'x' + Math.round(k.height));
    dupCheck(k);
  }
}
if (!FLOW_ONLY) await visit(root, false, false, root.parent || null);
for (const [k, v] of Object.entries(sibGroups)) if (v.length >= 3) out.standaloneSiblings.push(k + ' x' + v.length + ': ' + v.join('; '));
const counts = Object.fromEntries(Object.entries(out.unbound).map(([k, v]) => [k, v.length]));
const list = k => ({ count: out[k].length, first: out[k].slice(0, 20) });
return {
  ...out,
  unbound: Object.fromEntries(Object.entries(out.unbound).map(([k, v]) => [k, v.slice(0, 20)])),
  unboundCounts: counts,
  defaultNames: list('defaultNames'), versionNames: list('versionNames'), looseShapes: list('looseShapes'),
  fractional: list('fractional'), controlsUnderHitArea: list('controlsUnderHitArea'),
  sectionsWithoutTitle: list('sectionsWithoutTitle'), framesOutsideSection: list('framesOutsideSection'), duplicateSuffix: list('duplicateSuffix'), standaloneSiblings: list('standaloneSiblings'), nonStandardWidth: list('nonStandardWidth')
};
