# Compose from inspirations

Read when the user wants to take elements from several references and rebuild them as one system in their own theme. Inspiration is adapted, not matched. If the user wants an element matched exactly, switch that element to [source fidelity](source-fidelity.md).

## 1. Collect

Ask for the references: screenshots, links, Figma frames, or product names. For each, ask which element the user likes and what about it (structure, behavior, proportion, density, feel). Take the user's words. Do not choose elements for them. If a reference is a screenshot only, its values are approximations; say so. A micro-interaction (a toast stack, a slide-to-confirm, a drag-to-reorder list) is a valid element to compose from. Describe it as states, timing and easing, and record timing and easing as motion variables, so a borrowed interaction does not ship with hard-coded numbers. Rebuild the idea in the user's theme; do not trace the reference's visuals.

Keep inspiration separate from product facts and accessibility evidence. Do not store images in the record when a link is enough.

## 2. Read the theme

Read `theme.md` beside `SKILL.md`. If the theme is missing or thin, say what is not defined (type, color behavior, radius, density, motion, icon style) and ask. Do not fill the gap from one of the references. If the user has earlier work, the learn intent can draft the theme for them to correct; see [learn existing product](learn-existing-product.md).

A named product's brand takes precedence over the user's theme. The user's theme governs when no external brand applies, or when the user says to apply it. It decides how the design looks; research decides how it works. Where the theme departs from a convention or a research finding, say so in the ledger before building, as set out in the choice layer in [SKILL.md](../SKILL.md#choice-layer-use-whenever-decisions-conflict).

## 3. Composition ledger

Write one row per element, and get it approved before building:

| Element | Source | What the user likes (their words) | Carry (structure, behavior, proportion) | Leave behind (color, type, radius, artwork) | Maps to (theme tokens) |
| --- | --- | --- | --- | --- | --- |

Rules:

- Carry the element's structure, behavior, hierarchy, and proportions. Replace its skin with the theme's tokens.
- Do not reproduce a reference's distinctive artwork, illustration, logo, or copy. Record what was not copied.
- Where two elements disagree (for example a 4px radius against a 16px radius), resolve it through the theme, show the choice, and record it.
- A color taken from a reference is a candidate primitive. It needs approval and the contrast checks in [color system](color-system.md) before use.
- When the approved ledger and the theme already determine the direction, treat them as decisive. Do not ask for a redundant visual direction choice.

## 4. Build as one system

Every borrowed element becomes a reusable component on semantic tokens, with its states, per [component library](component-library.md) and [component states](component-states.md). Note in the component description which reference it was adapted from. A borrowed element that is not tokenized is a defect.

## 5. Consistency pass

Before handoff, check that elements from different sources agree on:

- corner radius, border weight, and border color
- elevation and shadow
- spacing scale and density
- type roles and weights
- icon style and weight
- motion curve and duration
- focus and state behavior

Report each as consistent, adjusted, or an open question. Do not report consistency you did not check.

## 6. Record

Keep the ledger and the pass results in the run receipt or the project record, so a later edit can see where each element came from.
