# Source fidelity

Read whenever a live page, URL, existing Figma file, or shipped product is the stated source of truth: an edit, a recreation, a new page that must match an existing site, or any request that says "like this page." The visual quality checks compare a design with itself. This reference compares it with the source, which those checks cannot do.

Applies at every scope. A small edit narrows the inventory to the affected area, but the diff for that area is still required.

## 1. Source inventory, before designing

Capture the source at each target width and keep the captures until the diff is finished. Record, from the source itself and not from memory or from an earlier design of it:

- **Structure:** the ordered list of sections for each page, with each heading exactly as written. Note sticky or persistent elements and which page each element belongs to. A component that belongs to a listing page is not a section of a detail page.
- **Controls:** for every control type present (text input, select, textarea, checkbox, radio, toggle, button, link), the measured height, padding, corner radius, and border width and color, at each target width. Measure the controls in each state the page shows. Do not extend one control's measurements to another: a select can differ from an input.
- **Typography:** families, weights, sizes, and line heights by role, at each target width.
- **Icons:** the icon source (see the icon procedure in [component library](component-library.md)) and a list of the icons the page uses.
- **Images and media:** every image, video, and CSS background on the page, by its real URL, with its rendered size, natural size, aspect ratio, object-fit, alt text, and section, marking which are visible and which are hidden (menu flags, off-canvas content). Many pages lazy-load their images, so a capture or a read of `src` can show only placeholders. Follow the lazy-load procedure below and confirm the count.
- **Copy:** the verbatim text of every heading, paragraph, label, button, list item, and spec in each section, taken from the DOM text and not retyped or paraphrased, including numbers and units. A paraphrase, or an invented spec such as a screen size or refresh rate the source does not state, is a defect.
- **Layout:** the grid and column behavior of each section, and the breakpoints at which it changes. Do not assume a single-column form or a grid from a similar page; read the column behavior of each section from the source at each width.
- **Repeated blocks:** every block that appears more than once, where it occurs, and its layout at each width. Each one is built once as a component (see [component library](component-library.md)).
- **Shared regions:** for the header, footer, and any navigation that repeats, every element's position, size, gap, and alignment at each width, and each state the region has (default, pinned or scrolled, menu open). A height alone does not describe a region. A region that appears on more than one page or frame is one component used at every occurrence.
- **Interactions:** disclosure, navigation, and form behavior that the page shows.

**Measurement conditions.** Measure geometry from the page's DOM (bounding boxes and computed styles), not by judging screenshots, which may be scaled. Confirm that the viewport you asked for was actually applied (inner width, device pixel ratio, scrollbar width), reload after each resize, and record the scroll position and the state of the element (menus closed, banners dismissed). A page can read differently under an emulated or scaled viewport, and a fixed or pinned element changes with scroll. If two readings disagree, say so and resolve it before building. Where the host can run JavaScript in a page, use [the DOM measuring script](../scripts/measure-dom.js): it reports these conditions and the geometry of the site header and footer, the headings with their section padding, the controls, and the icons. Where it cannot, measure by hand and say so.

An earlier audit, report, diagnostic, summary, or design of the source is not evidence about the source. Re-measure whatever you rely on. If you cite an earlier finding, say where it came from and mark it unverified until you have measured it.

If the source cannot be read, say what is missing and mark the dependent checks unverified. Do not fill the gap from a similar product.

**Lazy-loaded images.** A page that defers its images shows placeholders until they scroll into view, so check for this before trusting any image list, and handle it in this order:

1. **Detect.** Treat an image as deferred when its `src` is a `data:` URI or a tiny or blurred placeholder (natural size far below its rendered size), when its class or attributes show a lazy loader (`lazyload`, `data-src`, `data-srcset`, `data-lazy-src`, `data-original`, `data-bg`), when `loading="lazy"` is set and it has not loaded, or when a `<noscript>` holds the real `<img>`.
2. **Read the real URL from the attributes.** Use `data-src`, `data-srcset`, `data-lazy-src`, `data-original`, `data-bg` for CSS backgrounds, `<picture><source srcset>`, and the `<noscript>` fallback. This needs no scrolling and is the preferred method.
3. **Scroll only as a fallback.** Scroll the full page in steps, wait for the network to settle, then re-read. Scrolling does not always trigger the loader: in the emulated browser pane tested, 16 scroll steps left 10 of 12 visible images as placeholders. Always re-count afterwards.
4. **Pick the best candidate.** Use the largest entry in a `srcset` or `data-srcset`, or the original file when the URL carries a size suffix (`-300x200`, `-scaled`). Decide format by the response content type, not the file extension, because a server can return WebP at a `.png` URL.
5. **Verify.** Request each distinct URL and confirm it returns 200 and an `image/*` type. Report the distinct URLs, how many resolved, and any that did not. Remove duplicates from carousel clones, and list images in hidden menus or off-canvas content separately.
6. **Never accept a placeholder.** If a visible image still has no real URL, list it as unverified. Do not substitute a gray block or a similar image.
7. **Mind size.** Large originals (this page has files up to 9 MB) may exceed the target's import limits. Check them, downscale if needed, and say which images were downscaled.

Bring the source's own images into the design at their natural resolution as image fills, in the image slots of their components, with their alt text and aspect ratio. Do not leave a gray placeholder where the source has an image. If the connection cannot fetch an image by URL, download it and upload it through the host's asset path; if neither works, say so and list the images as unverified. Reuse images only when the user owns them or has the right to use them, as with the user's own or client's product. For a third-party reference site, use clearly marked placeholders.

## 2. Hold the source

Do not add, remove, rename, or reorder sections, controls, or labels without approval through the choice layer. A change the user asks for is approval for that change only. If the source looks inconsistent or wrong, record it as an observation and keep the source value unless the user decides otherwise.

When the user describes a mismatch ("the dropdown is too tall", "it should be a grid"), treat it as a lead, not a measurement. Measure the source first. Report what the source shows, including when it contradicts the description, and let the user decide what to match.

State the measurement, not the assumption. Every dimension in the build, such as a gutter, padding, height, or radius, comes from a measurement of the source or is labelled as an approved assumption. A value copied from an earlier design of the source, including an existing Figma file, is an assumption until it is measured against the live source at the same width. This is a gate, not guidance: do not build a value that has neither a measurement nor an approved assumption behind it.

## 3. Source diff, at delivery

Compare the result with the inventory and report each category:

| Category | Report |
| --- | --- |
| Sections | matched, missing, invented, renamed, reordered |
| Section composition | each section's layout, media position, background and color, spacing, imagery, and style against a side-by-side render of the source at the same width |
| Controls | source value against built value for each metric, with tolerance noted |
| Typography | families, weights, and sizes against source |
| Icons | source icon against built icon, and whether each is a library instance |
| Images and media | each source image against the design: present, missing, or placeholder, with size and aspect ratio against source, and the lazy-load check result |
| Copy | each section's text against the DOM text, string by string, including numbers and units |
| Layout | grid and breakpoint behavior against source |
| Repeated blocks | each block's occurrences against source, and the count that are component instances |
| Shared regions | each region's elements, positions, sizes, and gaps against source at each width, and whether every occurrence is an instance of one component |

**Visual comparison.** A section is not matched because its heading is present. For every section, render the built section at the same width as the source capture and compare the two side by side. Report differences in layout, media position, background and color, spacing, imagery, and style. Mark a section matched only when the two look the same at each target width, apart from approved deviations.

Any mismatch that was not approved is a failure. Fix it before handoff. List it as an open defect only when finishing it is blocked by a missing capability or needs a decision from the user, never because the work is large or unfinished. Measure the source at the same width as the built value: a control can differ between desktop and mobile, so a measurement taken at one width does not describe another. Never report a category as matched without the measurement that shows it. A category you could not measure is unverified, not passed.

## 4. Record the evidence

Keep the inventory, captures, and diff in the run receipt or the project's context record. A validation recorded as passed with no measurement behind it is invalid. See [product context](product-context.md).

## 5. Interaction precedent and one way per task

Before proposing how a user adds, edits, removes, confirms, validates or recovers in an existing product, find where the product already does the same job. If a table adds a row inline and edits fields in place, a new table does the same; if deletion asks for confirmation in a dialog, a new deletion does too. Cite the existing screen in the plan. Where the product has no precedent, send the new pattern through the choice layer; do not invent one silently.

Give each task one path. Do not add a second surface for a job an existing control already does, such as separate Add and Edit screens beside an inline-editable table, unless the user approves it. Read the plan back and remove any task that now has two ways to do it.

## 6. Recreating from a screenshot or image

When the source is a screenshot, a PNG, or an exported frame, there is no DOM to measure, so the image itself is measured. "Looks similar" is a failure; the build matches the image or lists every difference.

1. **Get the image at full resolution** and record its pixel size and scale (a 1170 px wide capture of a 390 pt screen is 3x). If it is a thumbnail or compressed, say the measurements are limited and ask for the original. A host screenshot tool may return a scaled preview and keep the full-size file on disk; measure the full-size file (the reported original width and height), never the preview. Measure with [the pixel script](../scripts/png-measure.js), which needs only Node: `sample` reads exact colors, `edges` finds faint borders and dividers, `contrast` computes ratios, and `diff` compares the build against the source.
2. **Inventory element by element** before drawing: every text line, control, icon, image, divider, and background, in order, with the text copied exactly, including numbers and units.
3. **Measure from the pixels, not by eye.** For each element record position, size, the gap to its neighbours, corner radius, border width, and icon size, converted to design units. Sample colors from the image with a script or the host's picker; never guess a hex. Crop regions at 100% or larger to read edges, and say which values are estimates when the image is blurred.
4. **Type:** identify the typeface and weight, size and line height from the cap height and line pitch. If the font is unknown or unavailable, name the nearest substitute through the choice layer, and do not pass it off as a match.
5. **Icons, logos, and photos:** take them from the product's own icon set or a published library, or trace them as vectors from the pixels, so they stay editable and scale; do not paste raster crops of icons, and do not redraw an icon from memory. An illustration or product image in a screenshot the user supplied is their material: crop it in as an image fill by default and say so, because a gray block is a visible mismatch. Ask first only when it shows an identifiable real person, and use a same-size placeholder named for the swap, excluded from the diff, when the host has no way to import an image. Source them as in [component library](component-library.md).
6. **Overlay check at delivery.** Place the image at 1:1 on the canvas behind or above the build (top layer at about 50 percent opacity), then check every element's edges, text baselines, and spacing. Where the host cannot import an image, render the build at the same size and run the numeric diff from the pixel script instead, excluding photo slots, and report the share of pixels that differ and the bands where they cluster. Text glyph rendering leaves a small residue that is not a defect when ink bounds match within 1 px; positions, sizes, borders, and colors must match. Report every difference over 1 px (over 2 px for text rendering) and fix it before presenting. The overlay also covers borders, dividers, shadows, and color: toggle it and compare each edge and each sampled color, and fix any border or contrast difference. Remove the overlay afterwards or keep it hidden and named for reference.
7. **Borders, dividers, and shadows are inventoried as their own line items, because they are the details most often missed.** For every card, input, button, row, image, and container, record whether it has a border and, if so, its width, color, opacity, and whether it sits inside or outside the edge; dividers between rows, with their inset; focus and selected outlines; and every shadow with offset, blur, spread, and color. A very light border on a white card is easy to miss by eye, so zoom each edge to 400 percent and sample the pixel just outside and just inside it; if the two colors differ, an edge exists and gets recorded. Never assume that a missing border means the source has none, and never add one the source lacks. Radius is measured per corner, and a pill or full radius is recorded as such.
8. **Contrast is copied, then measured.** Sample the exact foreground and background colors of every text line, icon, border, and control state, then compute each contrast ratio and record it in the inventory. Reproduce the source's own colors and opacities exactly, including text on images and gradients (sample at the darkest and lightest point behind the text), disabled states, and placeholder text. Do not lighten, darken, or "tidy" a color to look cleaner. Where the source fails 4.5:1 for body text, 3:1 for large text, or 3:1 for icons, borders, and control edges, recreate it as it is, report each failing pair with its ratio, and propose the fix through the choice layer; never fix it silently in a recreation or hide it.
9. **Read back** the inventory against the build: element count, text strings, colors, radii, and spacings, and mark anything not measurable as unverified. A model reading an image estimates distances, so the overlay is the evidence, not the estimate.

<!-- figma-short:start -->
**Source fidelity (short form).** Applies when a live page, URL, existing Figma file, or shipped product is the source of truth.

- **Inventory first, from the source itself:** ordered sections with headings exactly as written; controls (measured height, padding, radius, border, per control type and width, never extended from one control to another); typography by role; icons and their source; every image, video, and background by real URL with sizes and alt text; verbatim copy including numbers and units; layout and breakpoints; repeated blocks; shared regions at each width and in each state; interactions.
- **Measure from the DOM at each target width,** not from scaled screenshots. Confirm the viewport actually applied, record scroll and state, and say if two readings disagree. An earlier audit, report, or design of the source is not evidence; re-measure what you rely on. If the source cannot be read, mark dependent checks unverified and never fill the gap from a similar product.
- **Lazy-loaded images:** read the real URL from data attributes, srcset, picture sources, background data, or noscript before scrolling. Pick the largest candidate and verify each URL returns an image. Never accept a placeholder; list unresolved images as unverified. Bring the source's own images in at natural resolution only when the user owns the rights.
- **Hold the source.** Do not add, remove, rename, or reorder sections, controls, or labels without approval. Treat a described mismatch as a lead and measure first. Every dimension comes from a measurement or a labelled approved assumption.
- **Interaction precedent and one way per task.** Before proposing how a user adds, edits, removes, confirms, or validates in an existing product, find where the product already does the same job, cite that screen, and follow it. If there is no precedent, use the choice layer. Give each task one path; do not add a second surface for a job an existing control already does.
- **Source diff at delivery:** sections, section composition (compare each section side by side at the same width), controls, typography, icons, images and media, copy string by string, layout, repeated blocks, and shared regions. A section is not matched because its heading is present. An unapproved mismatch is a failure; list it open only when blocked by a missing capability or a user decision. Anything unmeasured is unverified, not passed.
- **A screenshot or image as the source:** measure the pixels, not by eye. Record the image size and scale, inventory every element with exact copy, and measure position, size, gaps, radius, border, and icon size in design units. Sample colors from the image and never guess a hex. Identify the font from cap height and line pitch and name a substitute through the choice layer if it is unavailable. Measure the full-size file with the pixel script where Node is available (not a scaled preview). Use the product's icons or a library, or trace icons as vectors, never raster crops or redraws from memory; crop in an illustration or product image the user supplied and say so (ask first only for an identifiable person, and use a named same-size placeholder when the host cannot import images). Inventory borders, dividers, and shadows as their own items (width, color, opacity, inside or outside, per-corner radius) by zooming every edge to 400 percent and sampling the pixels on each side, so a faint border is neither missed nor invented. Sample the exact foreground and background of every text line, icon, border, and control state, record each contrast ratio, copy the source's colors and opacities exactly, and report any pair that fails 4.5:1 text or 3:1 large text, icons, and control edges, without silently fixing or hiding it. At delivery, overlay the image at 1:1 at about 50 percent opacity (or, where images cannot be imported, run a numeric diff of the render against the source), report every difference over 1 px (2 px for text), and fix it before presenting. Mark what cannot be measured as unverified. "Looks similar" is a failure.
<!-- figma-short:end -->
