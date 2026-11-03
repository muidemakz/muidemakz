# Slop checklist

Apply the 15 patterns below while designing and again at delivery. Use for the same-brief comparison described in the README. This is not an audit intent, automated detector, or self-scoring system.

The 15 patterns are **off by default**. Keep one only with a one-line reason tied to brand evidence, a user need, an approved choice, or the user's explicit request. At delivery, list every kept pattern and its reason. The list is not complete: every visual choice needs a stated source in the brief, research, brand evidence, or an approved assumption. Do not add your findings to personal preferences.

## Fifteen patterns to avoid by default

1. Purple or indigo-to-blue gradients used as a default palette.
2. Inter, Geist, or Roboto used everywhere without product or brand grounding.
3. Gradient text.
4. Pill badges above headlines.
5. Glowing halos or soft spotlights behind sections.
6. Glassmorphism: blur, glass cards, or glow borders used as decoration.
7. Icons in rounded squares above every heading.
8. Grids of identical cards.
9. Cards inside cards.
10. Thick colored side stripes on cards.
11. Contextless hero statistics.
12. Numbered labels where there is no real sequence.
13. Gratuitous motion, such as pulsing dots, bouncy easing, hover zooms, or auto-scrolling logo strips.
14. Generic promotional copy and em dashes.
15. Cream or beige with an oversized italic-serif headline by default.

These are pattern descriptions, not blanket bans on a brand's established typography, colors, components, or a useful visual treatment. The stated exception must be concrete, and accessibility requirements still apply.

Sources: [Deonna's 15-tell prompt](https://gist.github.com/deonna/c94209289f9ba6df0fde35e21cfd21ec), adapted from [Impeccable's slop catalog](https://impeccable.style/slop/). Their installation, detector, and audit commands are not part of this skill.

## Additional checks

- Does the layout support this product's real user task, content, and priorities, rather than a generic interchangeable page?
- Do surfaces, grouping, and emphasis express useful relationships? Remove default rounded-card-with-shadow filler and decoration without a purpose.
- Are related items grouped close together, with clear spacing between sections? Is body text at least 16px?
- Can palette, typography, imagery, and tokens be traced to this project? Do components consume semantic roles consistently?
- Are there inconsistent icon styles or mixed illustration styles? Are icons reusable library components and illustrations library assets, rather than loose artwork?
- Are there one-off components or detached instances? Does each new component or variant have an approved library gap and semantic tokens?
- Are assets authentic and proportions intact? Are charts, metrics, and other apparent evidence truthful or clearly labeled placeholders?
- Does functional copy describe the action or state accurately? Is missing content visibly marked, and are unsupported claims absent?
- Are hierarchy, spacing, alignment, and interactions legible at the intended sizes? Does motion explain an action, state, or relationship?
- Have all checks relevant to the changed scope actually been performed, including accessibility and known audience sensitivities?
- Do the options differ in layout and structure, not only in color, borders and type? Three skins of one layout are one option.
- Swap test: would the direction still fit a different product? If so, it is generic.
- Further red flags beyond the 15, kept only with a stated brand or user reason: tracked-out monospace labels used as decoration, a dark page with a centered headline and one button, generic dashboard screenshots as placeholders, and a floating glass pill as the only navigation idea.

For the owner's before/after comparison, note concrete issues, justified choices, and unresolved gaps in each output. Have the human reviewer judge whether the skill helped; do not manufacture an improvement score or infer taste from your own assessment.
