# Homepage style exploration — run receipt

Status: ON HOLD at the owner's explicit request, 19 October 2026. Keep the original site.
Exploration preserved locally on `codex/homepage-style-lab` at `0622881`; no merge or publication.
Started: 19 October 2026.
Output target: working code/artifact preview for the existing static portfolio.
Workflow pace: Auto after the explicit instruction to build all four switchable modes.

## Method and references

- Primary skill: `ui-design-with-mm`.
- Supporting guidance read: `excellent-design-motion` (portfolio motion and visual preferences).
- Skill references read: supporting guidance, product context, source fidelity,
  inspiration composition, research sources, and the preferences template.
- Personal preferences read: responsive reflow is expected at narrow,
  intermediate, and wide widths.
- Personal theme: an empty private `theme.md` was initialized; no general personal theme is inferred.
- Project references read: `EXPLORATION_PLAN.md`, `README.md`, `ROADMAP.md`,
  `CODEX_PROJECT_KNOWLEDGE.md`, and the portfolio animation plan.

## Confirmed by Excellent

- Home is the lit state; About is the dark state.
- Pulling the cord should produce a click sound, followed by a deliberate blank/pause,
  then navigate to the other page.
- Feed content is image or video work presented like portfolio/Dribbble shots.
- Coming-soon treatment applies to projects without content or case studies, but is
  deferred until the homepage direction is chosen.
- Exploration starts after the current work is committed and pushed to production.
- A winning direction can eventually extend across the whole site.
- The first deliverable is a homepage comparison with an in-page style switch.

## Approved implementation scope

- The user explicitly instructed: build all four switchable modes. This approves the comparison set and shared components already proposed.
- Bulb interaction: synthesized short click, cut to black at 150ms, real page navigation at 820ms. Reduced motion: immediate cut and navigation at 140ms.
- Design rationale omitted from handoff at the user's request.

## Current capability checks

- Code and local assets are readable and writable.
- Node syntax checks pass for the current motion and Work scripts.
- Eleven automated tests pass: seven existing project-motion tests and four transition/recovery tests.
- Host-side local preview is reachable in the in-app browser at http://127.0.0.1:5511/index.html?style=neo.
- Figma is not the output target for this run.

## Source inventory status

### Current portfolio source

- Verified at 1280 × 720, 390 × 844, and 320 × 700.
- Existing palette: paper `#f2f0eb`, ink `#0d0d0d`, orange `#ff3b00`.
- Existing families: Outfit/Inter for interface and body copy; JetBrains Mono for
  labels and chrome.
- Desktop homepage: 44.8px shared header, 39% biography column, project reel in the
  remaining column, fixed social/contact strip at the bottom.
- Narrow homepage: stacked biography and 300px reel; shared header remains one row.
- Existing project motion keeps static posters as the fallback and pauses inactive,
  offscreen, background-tab, and reduced-motion playback.
- The narrow header and reel topline were corrected so the document no longer scrolls
  horizontally at 390px or 320px.
- The duplicate Valideity loop was removed from the hero; its single case-study loop
  remains after the content, matching the portfolio motion plan.

### Current-work publication

- Commit: `139eee0` — Add portfolio motion previews and case study updates.
- Pushed to `origin/dev` and fast-forwarded/pushed to `origin/master`.
- GitHub reports `master` at the same commit.
- The public custom domain was subsequently verified to contain the new motion control, project-motion script, and updated Fundall caption.

## Research ledger

| Source | Observation | Proposed application | Leave behind / limitation |
| --- | --- | --- | --- |
| `bbm.media` | Current page uses condensed display type, compact mono labels, a cream ground, strong black shapes, marker emphasis, obvious stage navigation, and dense editorial hierarchy. | Use an assertive editorial scale, exposed structure, one orange marker moment, and hard section boundaries in the Brutalist mode. | Do not copy Anton/Inter Tight, yellow, mascots, copy, or product artwork. |
| `pen.dev` | Current page uses pale blue-grey space, centered restrained copy, a soft rounded canvas surface, and small quiet chrome around one large product composition. | Use calm spacing, fewer borders, quieter metadata, and image-first surfaces in Minimal mode. | Do not copy its logo, canvas recreation, cursor labels, grey-blue palette, Inter treatment, or copy. |
| `lottabydesign.xyz` | The current live page remained blank while loading; its tile treatment could not be verified. | Use only the owner-approved profile + Feed / Work / Projects structure already recorded in the plan. | No claim is made about its current grid, typography, spacing, or motion. |
| Neo-brutalism references | The consistent vocabulary is thick dark borders, flat high-contrast fills, hard offset shadows, square/heavy geometry, and tactile pressed states. Accessibility sources warn against replacing familiar structure with visual noise or using low-contrast novelty colors. | Use portfolio orange/cream/black, strong focus rings, tactile press states, and framed work cards in Neo-brutalist mode. | Do not add a random saturated palette, reduce body readability, or make navigation unconventional. |

## Approved composition ledger

| Element | Source | Carry | Leave behind | Portfolio mapping |
| --- | --- | --- | --- | --- |
| Profile + three content tabs | Owner-approved plan; Lottaby structure only | Compact identity, Feed / Work / Projects switch, one content region | Unverified Lottaby tile visuals | Existing real bio, social links, `PROJECTS` data, and work assets |
| Editorial hierarchy | BBM | Oversized headline, small mono eyebrow, one marked phrase, direct section boundaries | Yellow, mascots, condensed fonts | Outfit 700, JetBrains Mono, orange marker, cream/black surfaces |
| Quiet image stage | Pen | Generous whitespace, one dominant visual field, restrained controls | Pen brand, canvas UI, grey-blue identity | Existing cream ground, Outfit copy, real screenshots and clips |
| Neo-brutalist tactility | Neo-brutalism research | Thick outlines, hard offset shadows, visible pressed states | Decorative noise and inaccessible novelty colors | Ink borders, orange/cream fills, keyboard-visible focus |
| Light bulb transition | Owner decision | Home lit, About dark, click, blank beat, then real-page navigation | Decorative continuous animation | One semantic button; sound and pause exposed as variables; instant reduced-motion path |
| Style lab switch | Owner request | Change skin without changing content or structure | Hidden gesture or unlabeled icon-only control | Keyboard radio group: Baseline / Minimal / Brutalist / Neo-brutalist |

## Approved visual systems

1. **Minimal:** quiet profile, generous cream space, thin rules, restrained image frames,
   two-column-to-one-column Feed, thin bulb cord with a focused warm light.
2. **Editorial Brutalist:** large Outfit headline, raw grid, black/cream fields, orange
   marker emphasis, flat borders, exposed metadata, no decorative shadows.
3. **Neo-brutalist:** the same content with thicker outlines, hard offset shadows,
   tactile tab/card presses, stronger modular blocks, and the orange accent as the only
   saturated color.
4. **Baseline:** current production homepage remains selectable for comparison, but is
   not treated as a fourth redesign.

## Implementation and delivery checkpoint

- Implemented in `C:/Users/Excellentm/.codex/worktrees/homepage-style-lab/Muidemakz Portfolio`
  on `codex/homepage-style-lab`, starting at production commit `139eee0`.
- New shared components: StyleSwitcher, BulbSwitch, ProfileBlock, TabSet, ShotCard,
  WorkCard, ProjectCard. Tokens and responsive variants are in
  `css/exploration-home.css`; behavior is in `js/exploration-home.js`.
- The additional Sok Yipon reference was inspected at its supplied resume URL and
  linked homepage. Observed elements: taped photographs, selection outlines,
  keyboard/tool imagery, rounded forms, and grid patterns. The Neo mode translates
  the design-tool vocabulary into the portfolio's existing palette and imagery.
- Final fit checks: 39 mode/viewport combinations spanning 320–1920px with no
  document or switcher overflow. Inspected mobile, tablet, and desktop screenshots.
- Checked keyboard radio/tab behavior, real Work/Projects content, loaded media,
  style persistence, and click/keyboard Home–About round trip.
- Eleven automated tests pass, covering existing motion and the new transition,
  reduced motion, duplicate activation, storage recovery, and cancelled pulls.
- Measured body contrast >=8.36:1, muted text >=4.94:1, white headline on orange
  3.57:1. All measured targets exceed 24px in both dimensions.
- Slop review retained repeated collection cards, requested rounded hard-shadow
  treatment, the lit bulb glow, and a reduced-motion-safe 2.5% media hover/focus cue.
  Each has a content or interaction purpose. No contextless stats were added.
- Source diff: Baseline retains the production markup and behavior with the style
  switch overlay. The three approved explorations replace the reel with the profile
  and three-tab collection. About's content remains intact with a dark preview skin.
- Project context and full delivery notes: `docs/homepage-style-lab.md` in the
  exploration worktree. No Figma output or publication is claimed.
- Remaining verification limits: physical touch hardware and audible sound quality
  were not tested. Sound and pull logic were exercised through browser/automated checks.

## Refinement v2 — 19 October 2026

- Explicit scope: centered simple intro, inline colored highlights, no top building
  card, realistic bulb/material accents, bounded widths, distinct Feed/Work/Projects,
  image-led Work, image-only Feed with expanded modal, and a footer. Neo is the
  leading direction, not a final site-wide selection or publication approval.
- Methods continued: ui-design-with-mm, excellent-design-motion, and built-in imagegen.
  Relevant workflow/state guidance was read for the viewer. The existing preference
  choice to omit a rationale from handoff was carried forward.
- Lottaby is now verified: its 384px centered profile, 29px display name, short
  paragraphs, underlined contextual links, three tabs, and image-only Feed were
  inspected at 1280px. The adaptation keeps portfolio fonts, readable 16–17px copy,
  requested colored term frames, and a 610px intro maximum.
- Photographic bulb: built-in image generation, alpha checked, copied into the
  worktree at images/exploration/hanging-bulb-v2.png. Asset prompt and provenance
  are in docs/homepage-bulb-asset.md. No third-party portrait or biography reused.
- Reused: existing project data and all Feed/Work/Projects media. New: native
  ShotViewer with selected media, loading, Close/Escape, Previous/Next, case link,
  media failure/retry, scroll locking, video cleanup, and focus restoration.
- Content components: Feed 6 image-only shot links; Work 8 image-led single-column
  case-study links; Projects 1 clipboard with real Valideity imagery; footer 1.
  The old top clipboard is removed. Repeated items share component functions/styles.
- Bounded sizes: content 1120px, intro 610px, Work 840px, Projects 330px, Feed items
  370px desktop/440px narrow, modal 1100px with viewport margins.
- 117 browser fit combinations passed: three styles × three tabs × 13 widths
  spanning 320–1920px. No document or style-switcher horizontal overflow remained.
- The profile center measured 557px against the page's 557px center after viewport
  reset. All Feed images and the 1024px-source bulb loaded.
- Viewer test: video opened, Next switched to an image, Escape closed it, original
  shot focus returned, media cleared, and page scroll unlocked. At 390px the modal
  measured 370px wide, no internal horizontal overflow, Close 44px high.
- Dark ink #22201c contrast on new highlights: peach 11.50:1, blue 12.83:1,
  amber 12.32:1, sage 12.67:1. Body and muted pairs carry forward verified tokens.
- Eleven existing automated checks passed after the rendering changes. A new
  network-failure state was not forced in the live browser; physical touch and
  audible audio quality remain unverified.
- Later Work note saved: top five plus View all leading to the full searchable
  Work page. That destination is untouched; selection/button implementation waits
  for the later Work pass, as requested.
- Kept patterns and reasons: collection grids for browsing; bounded selected tabs
  for navigation; colored inline labels to identify the requested domains; hard
  shadows/rounded frames for the chosen Neo direction; photographic glass and
  physical clip/paper materials for the explicit realism request. No fabricated
  stats, placeholder project facts, or extra service guarantees were introduced.
