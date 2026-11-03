# Learn an existing product

Read when the intent is learn existing product, or when an edit has no usable record and the user asks for a full read-through. This intent changes nothing in the product. Its only output is the context record described in [product context](product-context.md).

It is not an audit. Do not grade quality, rank problems, score anything, or propose fixes. Record what exists and how it is built.

## Before reading

1. Ask once, as a concise selectable choice with a copyable fallback:
   - Sources: Figma file URLs, repository path, running app URL, documentation.
   - Scope: whole product, or named areas. For a large product, default to named areas.
   - Record location. Default to `design-system-state/<product>/` near the work.
2. Confirm which capabilities you actually have: Figma read access, repository access, and the ability to run or render the app. State what you cannot read. Do not claim coverage you do not have.

## What to read

- **Figma:** pages and sections; variable collections, modes, and aliases; styles; components, variants, and properties; icon and illustration sources; screens and prototype connections; annotations and comments; linked libraries.
- **Code:** package manifest and framework; token and theme files; component directory and how components compose; routes and screen inventory; state handling; Storybook or docs; tests that encode behavior; existing README or design documents.
- **Rendered app:** representative screens at narrow, intermediate, and wide widths, when it can be run or captured.

Read for how the product is built, not only what exists. Compare several instances before calling something a pattern.

## What to record

Write a short `summary` first (about one page, read first on every later run), then per-area files that are read only when relevant.

**Inventory**, as in [product context](product-context.md): identifiers, locations, tokens, components, variants, states, screens, flows, breakpoints, naming, and status labels.

**Source inventory**, as defined in [source fidelity](source-fidelity.md): for each page, the ordered list of sections with exact headings and which page each belongs to; measured control metrics for every control type at each width; typography by role; and the icon source with a list of icons used. Later edit runs diff against this, so measure it and do not estimate it.

**How it is built:**

- **Layout and composition:** grid or container model, spacing rhythm, max-widths, alignment habits, density.
- **Component construction:** how components compose, which properties and variants exist and how they are split, token bindings, detached or one-off instances.
- **Interaction and state conventions:** hover, focus, loading, error, empty, recovery, and motion; what the product does consistently.
- **Flow narratives:** for each flow, entry, steps, decision points, and exit, with links to nodes or routes. One short paragraph each.
- **Content conventions:** observed terminology, label style, tone, and error wording.
- **Responsive rules:** breakpoints and what changes at each.
- **Recorded rationale:** only decisions the source documents, with where they are documented. Otherwise write "rationale not recorded." Never invent why.
- **Observed rules of thumb:** "In this product, X is done with Y," each with evidence.
- **Known inconsistencies:** what differs and where, with evidence. No severity and no recommendation.

Label every entry:

- **observed:** seen directly, with its location.
- **inferred:** your reading of several observations.
- **unverified:** not confirmed against the source.

Never present an inference as a fact.

Also record a **coverage map** (what was read, what was not, and why) and **freshness** (date, verifier, Figma file version or last-modified, git commit SHA).

## Rules

- Read-only on Figma and code. Do not create, rename, or fix anything.
- Do not store credentials or private user data. Do not store screenshots where a link or node location is enough.
- Keep the record out of `preferences.md`, the shared skill, and any public ZIP.
- The record may be committed with the project. If it might be, tell the user and let them choose.
- Store facts, labels, and evidence, not opinions about quality.

## Making the record findable

A fresh session finds the record only if told where it is. Offer to add one line to the project's `CLAUDE.md` or `AGENTS.md`, for example: "Design context for this product lives in `design-system-state/<product>/`. Read the summary before any UI work." Make that edit only after the user explicitly approves it.

## Finish

Read the record back and confirm it is saved where you say. Run the [checkpoint and continuation](../SKILL.md#checkpoint-and-continuation) protocol. Report the sources read, coverage gaps, entries labelled inferred or unverified, the record location, and the pointer line if it was approved.

## Learn the user's own theme

When the user asks to learn their own style from earlier work, read their Figma files or code the same way, but write the result to `theme.md` beside `SKILL.md`, following [the theme template](theme-template.md), and not to a product record. Label each entry observed, inferred, or unverified, and ask the user to correct it. Record only what recurs across several pieces of their work. Do not generalize one screen into a theme. Keep it private; it is not part of the shared skill.
