# Product and design-system context

Use this reference for an existing named product, an inherited Figma file, or an existing codebase. It creates continuity between runs without turning the skill into an audit or a cross-tool source-of-truth system. For a full read-through of an existing product, use [learn existing product](learn-existing-product.md).

## Context record

Keep one project-scoped record near the product work, for example:

```text
design-system-state/<product-or-repo>.json
```

The record may be JSON, YAML, or Markdown if that is the project's established convention. Do not put product context in the shared skill, personal preferences, or a public package.

Record only information needed to navigate and update the product:

- product and repository identifiers
- Figma file, page, section, and node locations
- codebase paths, routes, packages, and component-library locations
- primitive and semantic token collections, styles, typography, icon, and illustration sources
- component names, variants, properties, and applicable states
- screen and flow inventory, prototype connections, and responsive frames
- naming, layout, and breakpoint conventions
- items labelled existing, proposed, new, deprecated, or unresolved
- known inconsistencies and their evidence
- last verified date, verifier, and pending checks

A record made by the learn intent also holds a **How it is built** section and a short summary read first; see [learn existing product](learn-existing-product.md) for its contents and labels.

Do not store credentials, private user data, or screenshots when a link or node location is sufficient.

## Reconstruct before editing

At the start of an edit or repeat-use run:

1. Read the context record if one exists: its summary first, then the area files for the affected area. Treat entries labelled inferred or unverified as leads to confirm in the live source, not as facts.
2. Inspect the live Figma file and libraries, or the current codebase, to verify the record. Compare the stored Figma version or commit SHA with the current one and mark entries stale where the source has moved on.
3. Inspect the affected screens and adjacent flows so the product's structure, source of truth, states, and conventions are understood before changing a consumer.
4. Mark stale, missing, or conflicting entries. The live file or codebase wins over the record.
5. Preserve unrelated conventions and route new decisions through the choice layer when they conflict with confirmed product evidence.

If no record exists, create a concise one as part of the run receipt or project work before making a broad change. A narrow edit may record only the affected area. Do not expand this into a retrospective audit of the whole product, unless the user runs the learn intent, which records facts and does not grade.

## Maintain after delivery

Update the record when a run changes components, variables, screens, flows, tokens, states, responsive rules, or source locations. Include exact locations and what was verified. Mark unverified items instead of inferring them from a screenshot or an attempted tool call.

On a later run, read the record again and reconcile it with the live source. It is a navigation aid and continuity record, not proof that tools are connected, variables are visible, or a screen still matches its previous state.
