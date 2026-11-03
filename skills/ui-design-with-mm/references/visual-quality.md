# Visual quality checks

Read this before the first polished visual output. Use it while designing and again before delivery, re-reading it only if it is no longer in context. Alignment and spacing precision is set in [layout precision](layout-precision.md). These checks do not replace product research, brand evidence, the component library, or WCAG review.

## Task hierarchy and progressive disclosure

- At each stage, make the user's current task, the primary action, and the information needed to make that decision immediately apparent.
- Keep one primary outcome per stage and one primary decision at a time. Group related items; make secondary actions visibly subordinate so the user can focus without losing access to them.
- Put secondary explanations, history, advanced options, and supporting evidence behind clear, accessible disclosure controls when they are not needed for the current choice. Preserve a visible path to them.
- Do not hide decision-critical source evidence, unsupported-claim warnings, privacy information, error recovery, keyboard alternatives, or required confirmations. Put them where they are needed, with concise labels.
- Remove repeated instructions, duplicated status, and explanatory copy that does not answer a likely user question. Prefer one direct instruction; reveal detail on request. Keep functional labels explicit and meaningful.
- Check the first view and each state transition: can a user tell where they are, what changed, and what to do next without rereading surrounding prose?
- Use truthful progress: show a sequence count only when its total is known; otherwise show the current stage without fabricated counts, timers, or certainty.
- For loading, save, and error states, tell the user what is happening, what is waiting on them, whether their work is preserved when known, and the next useful action. Never imply a service guarantee the implementation has not verified.

## Mobile and responsive behavior

- Start with the brief's primary device and input method. For mobile-first or touch-first work, compose the narrow flow first; then adapt the information hierarchy and workspace for larger screens.
- Design for the task on each viewport. Do not treat stacking desktop columns, shrinking type, hiding a sidebar, or retaining every desktop control as proof of mobile quality.
- Check a representative narrow viewport and the smallest supported width. Confirm readable text, sensible line lengths, reachable primary controls, safe-area clearance, no horizontal overflow, and visible recovery paths.
- Test the layout at a narrow width, just before and just after each meaningful breakpoint, intermediate widths, and a wide width. Resize continuously where the environment permits; confirm every content-bearing element wraps or recomposes its title, body, metadata, evidence, labels, icon-label pairs, controls, and actions without clipping, overlap, accidental truncation, unreadable type, or horizontal overflow. Confirm typography and icons use approved breakpoint sizes, content regions grow with intrinsic height, controls remain readable and reachable, and max-width regions preserve readable line lengths and composition at wide widths without overflowing at narrow widths. In Figma, Auto Layout is the default for content-driven groups and components; use Hug/Fill sizing, constraints, and minimum and maximum widths. For breakpoint-specific changes, use component sets with a breakpoint property, and confirm that changing that property on one instance switches the layout. Separate fixed frames per breakpoint are acceptable only as labelled snapshots of those instances; fixed-size artboards alone do not demonstrate responsive behavior.
- Keep touch controls usable and spaced. Gestures may enhance an interaction but must not be the only way to act; retain clearly labeled pointer and keyboard alternatives as appropriate to the product.
- Let content determine height. Avoid oversized fixed-height regions that force unnecessary scrolling or push the primary action away. Place persistent actions only when they remain unobstructed and do not cover content or assistive focus.
- When context is hidden or reorganized on mobile, keep it available through an obvious, keyboard- and screen-reader-accessible control. Do not remove information needed to trust or complete the task.

## Typography, contrast, and content

- Derive type choices from brand evidence first, then product-specific research and approved direction. Choose a typeface for the product's character and reading conditions, not novelty. Verify font availability, licensing or delivery constraints, required language glyphs, and actual samples for headings, body, data, and controls.
- Inspect the chosen type at the real viewport and content length. Check hierarchy, line length, line height, weight, wrapping, and legibility; do not approve a font from a token name or specimen alone. If evidence is insufficient, mark the type direction provisional and use the choice layer.
- Check every important foreground/background pairing and relevant component state, not only palette swatches. Meet the selected WCAG 2.2 AA contrast criteria and record the measured pairings; do not call contrast passed based on visual impression.
- Read the screen as a user would: remove repeated or low-value explanation, keep error and action language direct, and ensure a clear next step. Preserve necessary context, accessible names, and evidence even when reducing visible copy.

## Required review record

Before handoff, report:

- The target viewports and states actually inspected.
- Whether mobile behavior was composed for the primary task or adapted from another platform, and what materially changes by viewport.
- The typography source, chosen roles, and any provisional font or asset.
- The contrast pairs and states checked, plus any failures or unverified items.
- Any information deliberately disclosed on demand and how the user reaches it.
- When a source of truth exists, the source diff result from [source fidelity](source-fidelity.md): sections, control metrics, typography, icons, and layout, each marked matched, mismatched, or unverified.
- Any remaining copy, overflow, interaction, or accessibility issue.

Do not self-grade the design as senior-level, polished, or excellent. Report observable evidence and unresolved gaps instead.
