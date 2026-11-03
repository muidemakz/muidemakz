# Two-tier tokens and atomic structure

Read before creating or modifying foundations. Use this structure with fresh project values; no example value is a default palette or typeface.

## Two tiers

| Tier | Contains | Consumed by |
| --- | --- | --- |
| Primitive | Validated raw color, font family, size, weight, spacing, radius, or other required value; no usage role | Semantic tokens |
| Semantic | Purpose such as action background, body text, field border, or heading typography; references primitives | Components and their states |

Keep exactly these two token tiers. A component library is not a third token tier. Model compound typography as styles or objects referencing the primitive values through semantic definitions, according to the output tool's capabilities.

1. Inspect actual brand assets, existing libraries, and relevant code. Record where values came from; do not estimate an exact brand color from a screenshot when authoritative assets are available.
2. Preserve an inherited system's valid naming and values. Research validates it; validation does not authorize wholesale replacement.
3. Establish only the foundations required by the agreed scope. If a required brand value is absent, present research-backed candidates as assumptions and wait for approval.
4. Define raw primitives, then semantic aliases. Resolve every alias and check for missing targets or cycles.
5. Bind component properties to semantic roles. Add a missing role deliberately rather than hardcoding an exception inside a component.
6. Check affected states and consumers whenever a primitive or semantic mapping changes.

For a new system with no naming convention, use these structural names, replacing bracketed labels with project-specific names:

```text
primitive/color/[family]/[100-900]
primitive/type/family/[family-name]
primitive/type/size/[step]
primitive/space/[step]

semantic/color/action/primary/background
semantic/color/action/primary/foreground
semantic/color/text/default
semantic/color/status/error/text
semantic/type/body
semantic/space/control/inline
```

These names show relationships, not a required complete catalog. A semantic role references the validated primitive chosen for that purpose; do not assume a numbered color stop has a particular contrast or state meaning.

## Atoms -> molecules -> organisms -> templates -> pages

Five levels, built in this order. Each level is composed only of instances of the levels below it and of tokens.

- **Atoms:** small UI elements such as a button, text label, input, or icon. Styled only through semantic tokens, text styles, and icon instances.
- **Molecules:** a useful combination of atoms, such as a labeled field with help and error text. Contains atom instances only.
- **Organisms:** larger working sections composed of molecules and atoms, such as a form, a header, or a product card. Contains molecule and atom instances.
- **Templates:** the layout of a page type, composed of organisms, with its grid, regions, and breakpoint behavior, and placeholder content. Contains organism instances.
- **Pages:** a template filled with real content for a specific screen or flow. Contains template instances, not loose frames or hand-built sections.

Rules:

1. **Build bottom-up.** Do not start a level until the level below it exists and its binding audit shows zero unbound values.
2. **No raw values at any level.** Every color, font, size, radius, spacing, and effect is bound to a variable or style, so a change to a token reaches every level above it.
3. **Change flows up through instances.** If an element has to be edited in place to make it fit, the level below is missing a variant. Propose it through the choice layer instead of detaching or restyling.
4. **Read back each level.** List what each component contains and confirm every child is an instance of a lower level or a token-bound primitive. Report any loose frame, detached instance, or hand-built section.
5. **Build only what the flow needs.** Do not produce catalogs of unused components, but build each piece at its proper level.

Inspect and reuse the existing component library before designing any screen or element. Propose missing reusable combinations through the choice layer and build them only after approval. Keep reuse, state behavior, and token relationships inspectable in the selected output. See [component library](component-library.md) for the gap and variant rules.

## Binding coverage

Defining tokens is not the same as using them. Every value in a component or screen must be bound to a semantic variable or style: text to a text style or font variables, and fills, strokes, radii, spacing, padding, and effects to variables or styles. A value that is only set directly on the node, such as a selected font size or a typed hex value, is unbound and is a defect even when it looks correct. Count unbound values at delivery and report them; see the binding-coverage audit in [Figma via MCP](output-figma.md).

<!-- figma-short:start -->
**Tokens and atomic structure (short form).**

- **Two tiers only:** primitives (validated raw values with no usage role) and semantic tokens (purpose, referencing primitives). A component library is not a third tier. Components consume semantic tokens.
- Inspect real brand assets and existing libraries first and record where values came from. Preserve an inherited system's valid names and values. Define primitives, then semantic aliases; resolve every alias and check for missing targets or cycles. Add a missing role deliberately rather than hardcoding an exception. Recheck affected states when a mapping changes.
- **Five levels, built in order,** each only from instances of the levels below plus tokens: atoms; molecules (atom instances only); organisms; templates (layout with grid, regions, breakpoint behavior, placeholder content); pages (template instances filled with real content, never loose frames or hand-built sections).
- **Rules:** build bottom-up with zero unbound values before the next level; no raw value at any level; if an element must be edited in place to fit, the level below is missing a variant, so propose it instead of detaching; read back each level and report any loose frame, detached instance, or hand-built section; build only what the flow needs.
- **Binding coverage:** every text node uses a text style or font variables, and every fill, stroke, radius, spacing value, padding, and effect uses a variable or style. A typed hex value or a selected font size is unbound and is a defect even when it looks right. Count and report unbound values at delivery.
<!-- figma-short:end -->
