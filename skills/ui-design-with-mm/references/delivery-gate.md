# Delivery gate: scripts and measuring

Read when the delivery gate needs measurement. The 16 gate items stay in SKILL.md.

For live-page measurements, run [the DOM measuring script](../scripts/measure-dom.js) where the host can execute JavaScript in a page and report its numbers. For Figma bindings, run [the Figma audit script](../scripts/figma-audit.js) through the plugin-API tool, one page per call. It passed a self-test on a scratch file, but still confirm on a new connection that it flags a deliberately unbound node, and fall back to a manual per-node check if it errors. Its loose-shape list is for review, not a verdict, and a zero means "none found by these checks". For a screenshot or image as the source, run [the pixel script](../scripts/png-measure.js) with Node: it samples exact colors, finds faint borders, computes contrast ratios, and diffs a render against the source. Where a script cannot run, measure by hand and say so.
