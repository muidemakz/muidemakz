# Color system

Read for palette creation or any color edit. Use only this project's validated brand inputs, research, and approved assumptions.

## Required structure

| Group | Roles | Rule |
| --- | --- | --- |
| Core brand | Primary, secondary, tertiary | Derive from the actual brand. If a role is unspecified, resolve it through approved assumptions rather than inventing a brand fact. |
| Semantic status | Success, warning, error, info | Map purposes to validated primitives; keep meaning consistent across components. |
| Extended / exploration | Additional brand-adjacent options | Establish an explicit slot upfront. Populate it with approved candidates for identified needs; an empty, labeled slot is better than an invented palette. |

Provide neutral primitives and semantic surface, text, and border roles where the UI requires them. Distinguish raw color families from semantic purpose: a brand hue and a status role may reference the same primitive when that mapping is appropriate.

Default to nine stops per color family: `100, 200, 300, 400, 500, 600, 700, 800, 900`, from light to dark. Most UI work uses only four or five; the remaining stops provide defined options for later needs. These are this skill's agreed labels, not a claim about another framework's exact scale.

Keep the authentic brand anchor intact and locate it deliberately within the scale; do not alter it merely to fit a numbering scheme. Validate derived tints/shades before mapping them to backgrounds, text, borders, hover, or disabled roles. A scoped edit changes only the affected families, roles, and consumers; do not rebuild unrelated palettes.

## Accessibility gate

Check actual rendered foreground/background pairings, including states, transparency, and gradients. Color names and token numbers do not establish contrast.

- Apply at least **4.5:1** to normal text and **3:1** to large text. Large text is at least 18 pt regular or 14 pt bold (24 CSS px or approximately 18.67 CSS px). Do not round a failing result up to the threshold. Account for documented exceptions accurately. See [WCAG 2.2 text contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).
- Apply **3:1** against adjacent colors to visual information needed to identify controls/states and meaningful graphics, subject to the criterion's exceptions. Do not demand contrast from every decorative border. See [non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html).
- Do not communicate status or instructions through color alone. Pair color with useful text, shape, or other perceivable cues.
- For motion or flashing, check known audience sensitivities and the applicable WCAG requirements; avoid unnecessary flashing and provide reduced-motion behavior where relevant. A contrast pass is not a photosensitivity check.

Use the applicable [WCAG 2.2 A and AA criteria](https://www.w3.org/TR/WCAG22/) for the actual interface, including keyboard access, focus, labels, errors, and reflow when relevant. Record the tested pair, state, ratio, threshold, and result in a compact check note. Flag missing measurements as unverified, not passed.

If a brand color fails in a proposed role, offer compliant role/background/foreground alternatives through the choice layer. Preserve the brand primitive where possible while correcting its use. Neither preferences nor approval can waive the accessibility gate. Do not claim full WCAG conformance from a Figma screenshot or contrast checks alone.
