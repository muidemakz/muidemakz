# Build rules

The full text of SKILL.md section 4 and the Figma variable visibility requirement. Read before creating or changing foundations; SKILL.md carries the short form.

## Figma variable visibility

**Figma variable visibility is a delivery requirement.** Verify creation, semantic aliases, component bindings, binding coverage (no value left only selected on a node), and discoverability in the intended file. Give exact collection names and artifact locations. Never treat an attempted tool call or a token table as proof that variables exist. See the final-output reference for verification and capability limits.

## Foundations and tokens

Read [token structure](token-structure.md) before creating or modifying foundations. For palette work, also read [color system](color-system.md). Read [component library](component-library.md) and [component states](component-states.md) before designing any screen or element, including a scoped edit. Read [asset library defaults](asset-libraries.md) only when the brand supplies no icon set or no illustration system. Inspect the Figma file and libraries or the codebase's component library; use every fitting existing component. Do not invent a component, variant, or one-off style when one fits. Never detach or restyle an existing component to fake a variant. If nothing fits, show the gap, propose a reusable semantic-token component or proper variant through the choice layer, and build it only after approval.

Extract primitives from this project's validated assets and research, then map semantic roles to them. Make components consume semantic tokens. Build in five levels, in this order: atoms, molecules, organisms, templates, and pages, as set out in [token structure](token-structure.md). Each level is composed only of instances of the levels below it plus tokens, no level contains a raw value, and the binding audit must report zero unbound values for a level before the next level is started. Build only what the flow needs, but build each piece at its proper level. For an edit, preserve established conventions and change only affected foundations and consumers.

For every proposed visual foundation, record its source: brand evidence, research, accessibility requirement, approved assumption, or preference used only as a tie-breaker. Label inventory items as existing, proposed, or new. Verify exact foreground/background pairings and relevant states for contrast; a palette alone is not proof of conformance.

Before final visual output, resolve or explicitly approve a typography direction and icon direction. Do not use system-font fallback, Unicode glyphs, loose text arrows, or placeholder icons as the finished visual language. If no icon set exists, propose Phosphor as the default established library through the choice layer, subject to current availability and approval, and fix one consistent style. Do not use generic pills, badges, card stacks, gradients, or other slop patterns without a stated source and reason. Unsupported claims in sample content must be clearly marked for verification or replaced with supported placeholder copy.

## Responsive behavior

- Design the primary task for the actual target device. For a mobile or touch-first product, compose the narrow-screen flow first and adapt it for desktop; do not count a collapsed desktop grid, reduced type, or hidden sidebar as a mobile design. If the brief establishes a different primary platform, start there.
- Make applicable layouts responsive so changing the available width causes appropriate reflow while keeping content readable; do not deliver fixed-width screens as proof of responsiveness.
- Every content-bearing element—not only cards—must adapt at intermediate widths. Titles, body copy, metadata, evidence, labels, icon-label pairs, buttons, controls, and navigation may wrap, stack, resize, or switch to an approved compact variant. They must not clip, overlap, truncate without an approved treatment, or become unreadably small.
- Define breakpoint behavior for type scale, icon size, control padding, label wrapping, and composition; preserve minimum readable sizes and touch targets rather than shrinking indiscriminately.
- In Figma, every component you create uses Auto Layout and every component set spaces its variants at least 24px apart (see [component library](component-library.md)). Use Auto Layout, Hug/Fill sizing, and constraints for content and reusable components, and set minimum and maximum widths on containers that must stop shrinking or growing. Where the layout changes between breakpoints, build the page sections and shared regions as component sets with a breakpoint property (such as Desktop, Tablet, Mobile) so one instance switches layout. Separate per-breakpoint frames are acceptable only as snapshots of those instances and must be labelled as such. In code, use fluid sizing and responsive layout rules, such as container or media queries. Read [visual quality checks](visual-quality.md) and the selected output branch for the required resize checks.

## Frame size

Decide each frame's size by this order and record the reason in the delivery note and the frame's label (for example "Mobile 390, iPhone default"): (1) the device or width the user names; (2) the existing file's own frame sizes, which new frames match; (3) a measured source, where a live page gives its real viewport width and a screenshot gives its pixel width divided by the capture scale (1170 px at 3x is 390); (4) the platform default, which is 390 by 844 for a phone (360 by 800 for Android), 768 or 834 for a tablet, and 1440 for a desktop. A width that is not a real device or breakpoint, such as the 499 of an odd screenshot capture, is flagged to the user before building. Offer two options through the choice layer: keep the source size, for pixel matching, or normalize to the nearest standard frame with every measurement rescaled by the same factor. Recommend normalizing, because a non-device frame misbehaves in prototypes, previews, and handoff. Never pick a frame width by habit or leave it unstated.

## Composition and max-width

- Use max-width constraints where readability or composition requires them: long-form content, headers, form columns, card grids, document previews, dialogs, and hero copy should remain within a measured container and center within a wider frame. Keep the container fluid below its maximum.
- Allow full-bleed backgrounds, media, tables, and workspace canvases to exceed the cap only when the content or source evidence requires it, and document the exception.
- Use progressive disclosure to keep the current task and its next action clear while making secondary detail easy to reveal. Keep decision-critical evidence, accessibility controls, privacy notices, and confirmation requirements available when needed. Remove repeated instructions and explanations that do not help the current decision.

## Typography

- Select typography from brand evidence or product-specific research. Do not settle for a generic fallback merely because it renders.
- Verify that the chosen typefaces are available and legible in real content at target sizes, and explain any provisional choice.


## Provenance and quality gates

Any example brand in the source spec demonstrates structure only. **Never reuse its colors or fonts on another project.** Do not copy another product's identity, a personal preference, or a reference site's visual treatment into the shared defaults.

Use real assets, legible hierarchy, and purposeful interactions. Design the applicable component states as part of the screen and flow, not as optional polish. Apply relevant WCAG 2.2 AA checks or stricter brief requirements, including actual color pairings, plus known audience sensitivities. A palette alone cannot establish full accessibility conformance.

**Visual quality gate:** before calling an output a design, inspect it at target sizes and verify the task hierarchy, progressive disclosure, cognitive load, trust and recovery states, typography, icon consistency, spacing, composition, responsive behavior, component states, copy provenance, actual contrast pairings, accessibility, and the slop checklist. Record which viewports and interactions were inspected; distinguish unverified checks from passed checks. When a source of truth exists, also complete the source diff in [source fidelity](source-fidelity.md): these checks compare the design with itself, so a design that passes them can still be the wrong page, and an unapproved mismatch with the source is a failure. Fix failures within scope before handoff. If required brand or asset evidence is missing, present a focused choice layer and keep the visual direction provisional until resolved; do not fill the gap with generic defaults. Follow [visual quality checks](visual-quality.md) and the relevant requirements in [journey and trust research](journey-trust-and-requirements.md).

**Slop checklist boundary:** use the 15 patterns in [the slop checklist](slop-checklist.md) as a red-flag review while designing and again at delivery, not as a style generator or a ban on component types. The patterns are off by default; include one only with a one-line reason tied to brand evidence, a user need, an approved choice, or the user's explicit request. An existing reusable component or established brand pattern is not a failure merely because it resembles a listed pattern; review its purpose, reuse, evidence, and composition. The list is not complete: every visual choice needs a stated source in the brief, research, brand evidence, or an approved assumption.

<!-- figma-short:start -->
**Build rules (short form).**

- Variables are a delivery requirement: verify creation, semantic aliases, component bindings, binding coverage, and discoverability in the file, with exact collection names. A token table or an attempted tool call is not proof.
- Inspect the Figma file and libraries first. Use every fitting component. Never detach or restyle a component to fake a variant. Propose a missing component or variant through the choice layer and build it after approval.
- Build in five levels, each from instances of the levels below plus tokens, with zero unbound values before the next level starts.
- Bind every value to a variable or style. Record a source for each foundation: brand evidence, research, an accessibility requirement, or an approved assumption. Check real foreground and background pairs and their states.
- Typography and icons come from brand evidence or research. No system-font fallback, glyph icons, or placeholder icons. If no icon set exists, propose Phosphor through the choice layer.
- **Frame size:** decide each frame's size in this order and record the reason in the frame label and the delivery note: the width or device the user names; the existing file's own frame sizes; a measured source (a live page's real viewport, or a screenshot's pixel width divided by its capture scale); then the platform default (phone 390 by 844, Android 360 by 800, tablet 768 or 834, desktop 1440). Flag any width that is not a real device or breakpoint, such as 499, before building, and offer through the choice layer to keep the source size for pixel matching or to normalize to the nearest standard frame with measurements rescaled, recommending normalizing. Never pick a width by habit or leave it unstated.
- Responsive: design for the primary device first. Layouts reflow with width, and every content element adapts at intermediate widths without clipping, overlapping, or becoming unreadable. Sections that change layout are breakpoint component sets; separate frames are labelled snapshots only.
- Composition: put a max-width on long-form content, headers, forms, dialogs, and hero copy, centered and fluid below the cap. Full-bleed only when the source needs it, and document it.
- Never reuse an example brand's colors or fonts. Apply WCAG 2.2 AA with real pairings, the slop checklist as a red-flag review, and the source diff when a source exists. Disclose unverified checks.
<!-- figma-short:end -->
