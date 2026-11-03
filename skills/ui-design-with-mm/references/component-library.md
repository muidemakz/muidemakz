# Components, brand guidelines, icons, and illustrations

Read during foundations before designing any screen or element. Re-check it at output to confirm actual reuse and delivery notes, re-reading it only if it is no longer in context. Apply the same rule to new builds and scoped edits.

## Check before creating

Inspect the intended Figma file and its libraries, or the codebase's component library. Include existing components, variants, icons, and illustration assets in that check. Use an existing component whenever it fits the agreed behavior and content. Do not invent a new component, variant, or one-off style when an existing one can do the job.

If nothing fits, name the gap and show the relevant existing option and why it does not fit. Propose the missing component or proper variant through the choice layer. Wait for approval, then build it for reuse with semantic tokens and mark it as new in the delivery note. Never detach or restyle an existing component to fake a variant. Do not use an ad hoc icon or illustration to conceal a library gap.

## Figma component construction

Every component you create in Figma uses Auto Layout, always, including atoms and icon components, and is built at its proper level (atoms, molecules, organisms, templates, pages; see [token structure](token-structure.md)). A component built from loose, manually positioned layers is a defect. If a component cannot use Auto Layout, report it as a defect with the reason; do not skip it silently.

Every component set (the variants of one component) is itself laid out with Auto Layout, wrapping where there are many variants, with at least 24px of space between variants in both directions and padding so no variant touches the edge of the set. Do not leave variants stacked, overlapping, or placed at default offsets.

For an edit, apply this to the components you create or change. Do not restructure existing library components that are out of scope; report any that break the rule.

Read back each component and component set you created. Confirm that Auto Layout is on and that the gap between variants is at least 24px, and list any that fail.

## Repeated blocks

Before building screens, scan the brief and the source inventory for any block that appears more than once with the same structure and different content, such as a quote form, a product card, or a call-to-action band. Build it once as a component with properties for the content that changes, and use instances everywhere it occurs. Put layout differences, such as a grid on desktop and a single column on mobile, in breakpoint variants of that one component. Propose the component through the choice layer together with the gap analysis. A repeated block drawn separately each time is a defect even when the copies look identical, because the next change must then be made in every copy. In the readback, count the instances of each repeated block and report any copy that is not an instance.

## One component, many variants

Components that share a structure and differ only in style, size, state, or content are one component, not siblings. This applies to every kind of component, not only buttons: icons (one Icon set with size and style variants and an instance-swap for the glyph, not a loose component per icon), images and avatars (one component with size, shape, and fallback variants and a fill for the picture), badges and tags, inputs, list rows, cards, and navigation items. Use variants wherever a property of a thing changes and its structure does not. Six buttons that differ in fill, radius, and label are one Button set with variant properties (style, size, state) and a Label text property. Screen templates that hold the same regions and differ in the organism they contain are one template with an instance-swap or variant property. This applies equally in code: one `Button` with `variant`, `size`, and `disabled` props, not a component per use. Before creating a component, look for a sibling it could join, and add a variant to that set instead of making a new top-level component. Give each set the properties its states need (default, hover, focus, pressed, disabled, loading where they apply), and put the content that changes in properties, not in separate components. Separate components are right only when the structure differs. At readback, list any group of same-structure components that are not variants of one set, and fix them or give the reason. When editing an existing file, report such groups and propose merging them through the choice layer; merge only what you created.

## Checklist boundary

The slop checklist is a review guardrail for screen composition and repeated usage, not a ban on reusable component types. Do not reject an existing or newly approved component only because it resembles a listed pattern. Check whether its purpose is supported by the brief, research, brand evidence, accessibility, or an approved direction; whether it is reusable and tokenized; and whether the surrounding composition avoids decorative repetition. Flag one-off components, detached instances, inconsistent icon or illustration styles, and unsupported visual filler.

## Brand evidence

Ask for or find brand guidelines, the icon set, and illustration style during deliberation. Treat guidelines as primary evidence alongside assets. Preserve their relevant conventions when editing a named product. If evidence is missing, state the gap and use the approved-assumptions path before choosing a replacement.

## Icons

Source icons in this order and stop at the first that works:

1. **The product's own icons.** Extract the SVGs the live page, codebase, or brand kit already uses and import them as components. This is the most faithful option and always comes first when a source exists.
2. **A published library available to the file.** In Figma, list the libraries available to the file before searching them, then search those libraries for icon components. Use their components as instances.
3. **A named open set.** If neither exists, propose Phosphor as the default established icon library through the choice layer, subject to user approval and current availability. Fix one Phosphor weight, size grid, optical alignment rule, and corner treatment, then apply that style consistently. Read [asset library defaults](asset-libraries.md) for approved fallback and illustration options.

Record which option was used and why the earlier ones did not apply. Keep icons as reusable components in the component library; every other component consumes them as instances. A Unicode glyph, text character, or arrow typed into a text node is not an icon, even inside a component. Do not draw loose vectors or mix icon sets to fill a gap. Check each component that shows an icon, such as selects, disclosures, navigation toggles, and status messages, for an icon instance and not a text character.

## Composition

Nest a component inside the component it belongs to. Do not place it beside the parent on the screen. If a parent has an empty slot or frame, such as a details area, fill it with the child instead of leaving the slot empty and placing the child next to it. Define an interaction once on the component, such as an expand or collapse variant, and not separately on each instance. If the same behavior is wired on many instances, move it into the component. Read back each composed component to confirm its slots are filled, and report any empty slot.

## Illustrations

Follow the brand's existing illustration style. If none exists, ask the user or propose one source and style as a specific assumption and wait for approval. Candidate sources are listed in [asset library defaults](asset-libraries.md). Document its color mapping through semantic tokens, line weight, and level of detail. Keep illustrations as library assets, use one consistent style, and mark placeholders. Do not draw an ad hoc illustration in a conflicting style to fill a gap.

## Sourcing any asset

Every logo, photo, avatar, map, video and similar asset is sourced in this order, taking the first that works, and recorded in the delivery note as **supplied**, **extracted**, **official kit**, or **placeholder**.

1. **Supplied by the user:** brand kit, files, or existing Figma assets.
2. **Extracted from the product's own source:** the product's own logo, imagery and favicon from its live site or codebase, for that product's own brand only. Take the real file (SVG where available), not a screenshot, and check it renders.
3. **Official kit:** for another company's mark (a payment provider, partner, store badge, social network), use that company's published brand kit. Never redraw a real brand's mark from memory or approximate it.
4. **Licensed source:** for photographs and people images, a source the user names or supplies, with its licence recorded. Do not name a stock service on the user's behalf.
5. **Labelled placeholder:** when none of the above is available, use a clearly marked placeholder at the correct size and aspect ratio: a "Logo placeholder" frame, a plain-text wordmark for another company's mark, or a neutral image block with an alt-text note. Mark it in the file and list it in the delivery note as an open item.

Never: invent a logo, make a lookalike of a real brand's mark, use an AI-generated or edited version of a real mark, use an unlicensed photo, or use a person's likeness without the right to.

If the missing asset is central to the brand (the product's own logo, the hero image), ask the user before choosing a placeholder and offer the options through the choice layer. For a minor asset, use a placeholder and report it.

Placeholders are components or slots, not baked into layouts: the real asset replaces the placeholder without changing the layout. Record the intended size, aspect ratio, alt text and licence requirement on the placeholder so the swap needs no redesign.

The delivery note carries an "Assets" line listing each asset that was extracted or a placeholder. Without any, the line is not needed.

**Other missing inputs.** A font that is not available: propose the nearest available family through the choice layer and record the original. Brand colors not supplied: ask, or extract from the product's own source and mark them as observed. Data for a chart that does not exist: label the data as sample, or leave an empty state. Never present sample data as real.

<!-- figma-short:start -->
**Components, icons, illustrations, and assets (short form).**

- **Check before creating.** Inspect the Figma file and its libraries for components, variants, icons, and illustrations, and use an existing one when it fits. If nothing fits, name the gap, show the closest option and why it fails, propose the missing component or variant through the choice layer, and build it after approval with semantic tokens, marked as new. Never detach or restyle a component to fake a variant, and never use an ad hoc icon to hide a gap.
- **Construction.** Every component you create uses Auto Layout, at its proper level. Every component set uses Auto Layout, wrapping where needed, with at least 24px between variants in both directions and padding so no variant touches the edge. Read back each component and set and list any that fail.
- **Repeated blocks.** A block that appears more than once with the same structure is built once as a component with properties for what changes, and placed as instances. Layout differences go in breakpoint variants. At readback, count instances and report any copy that is not an instance.
- **One component, many variants.** Components with the same structure that differ only in style, size, state, or content are one component or set with variant properties (style, size, state) and content properties, not sibling components, for every kind of component and not only buttons: one Button set, not six buttons; one Icon set with size and style variants and an instance-swap glyph; one Avatar or Image component with size, shape, and fallback variants; badges, inputs, list rows, cards, and navigation items the same way; one screen template with a swappable region, not a template per screen. The same holds in code (one `Button` with `variant`, `size`, `disabled`). Before creating a component, look for a sibling to join. Separate components are right only when the structure differs. At readback, list any same-structure group that is not one set; in an existing file, report it and propose the merge through the choice layer, and merge only what you created.
- **Icons, in order:** the product's own SVGs, then a published library available to the file, then a named open set (Phosphor, proposed through the choice layer, with one weight and grid). Icons are components used as instances. A typed glyph is not an icon, and icon sets are never mixed.
- **Composition.** Nest children in their parent's slots, leave no empty slot, and define an interaction once on the component, not per instance.
- **Illustrations** follow the brand's style; if none exists, propose one source and style as an assumption and wait for approval.
- **Sourcing any asset, in order:** supplied by the user; extracted from the product's own source (the real file, for that product's own brand); another company's official brand kit (never redrawn from memory); a licensed source the user names, with the licence recorded; a clearly labelled placeholder at the correct size and aspect ratio (a "Logo placeholder" frame or a plain-text wordmark). Never invent a logo, make a lookalike of a real mark, use an AI-generated version of one, or use an unlicensed photo. If a central asset is missing, ask first. Placeholders are swappable slots, and the delivery note lists extracted and placeholder assets. For a missing font, propose the nearest available through the choice layer; for missing brand colors, ask or extract and mark as observed; for chart data that does not exist, label it as sample. Never present sample data as real.
<!-- figma-short:end -->
