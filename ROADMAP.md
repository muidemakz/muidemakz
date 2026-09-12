# Case Study Roadmap

Living list of case studies to build across the Muidemakz portfolio. Update this file as items
get built or the plan changes.

## Template — section order (new default)

New case studies follow this order, modeled on the storytelling shape of
[architabose.site/barion-brand](https://architabose.site/barion-brand) (structure only — our own
brutalist visual system stays: thick borders, hard offset shadows, mono labels, orange accent):

1. **Hero** — title, one-line description, meta chips (Role, Duration, Company, Category/Platform), quicknav (`.case-quicknav`) linking to the sections below.
2. **Summary** — 2–3 sentence context, "I was responsible for:" scope list (`.case-list`), stat row (`.case-outcome-grid`) if there are real numbers to show.
3. **Problem** — card grid, one short title + one-sentence description each (`.case-problem-grid` / `.case-problem`).
4. **Solution** — list of moves, each a bold lead sentence + a short impact/why line (`.case-list` with `<strong>` leads).
5. **Process** — condensed list of how you got there (`.case-list` or `.case-steps`).
6. **Outcome** — headline stat + narrative bullets tying back to the Problem section.

Extra sections (Persona, Leadership signal, Falsifiability, Next Steps, Screens gallery, version
history) still get added where relevant — this order is the spine, not a hard limit on section
count. `.case-problem-grid`/`.case-leadership-grid` share CSS (`css/case-study.css`), so either
name works; use whichever reads clearer for the section.

**Retrofit call:** apply this order to new case studies going forward. Don't rewrite the seven
already-built ones to match — they're already using the deeper "briefs" structure (Challenge →
Process → Research → Insights → Decision → Screens → Testing → Outcome → Next Steps) which is
richer than this leaner order and not broken. If it's ever worth revisiting one, the cheap version
is adding a Summary block with the scope list + stat row near the top rather than reordering
everything underneath it.

## Already built

| Case study | File | Status |
|---|---|---|
| Omnibiz — item not-available / preorder states | `empty-state.html` | Live |
| Fundall — loan / salary advance | `fundall.html` | Live |
| Teesas LMS | `teesaslms.html` | Live — flagged for a possible polish pass |
| Raven Pay redesign | `raven-pay.html` | Live, password-gated (modal) |
| VENX | `venx.html` | Live |
| Coreloops documents filter | `coreloops.html` | Live |
| Cancel Flow (weekend brief) | `cancel-flow.html` | Live |

## Categories

Named categories the planned case studies fall into — use these when writing each one up so the
site's own taxonomy (`PROJECT_CATEGORIES` in `js/data.js`) and the case-study "menu" stay in sync.

| Category | Case studies in it |
|---|---|
| Empty states | Omnibiz item-unavailable/preorder (built) |
| Loan / salary advance | Fundall (built) |
| LMS / EdTech | Teesas LMS (built) |
| Document / data filtering | Coreloops (built) |
| Design system | **Omnione Design System** — confirmed this is Omnibiz's design system work |
| SSO / account migration | Omnipay SSO (Omnibiz) |
| Savings & loan | **Traction Apps — Savings & Loan** |
| Marketing website | **Traction Apps — Ramp Website**, **Fortnoto — Marketing Studio**, **Fundall — V2 Landing Page Relaunch** (the V2 relaunch case study is specifically the landing page redesign, not a full product overhaul) |
| HR platform | **Fundall — HR Platform (HRMS/HRPP)** |
| Branding / creative campaign | Fundall Brand Campaign, Nomba Brand Campaigns, Fortnoto Branding & Design System, Valideity Branding |
| Game design | Crazy Ludo (revamp + reasoning), Safari City (assets + improvements) |
| Cancel flow / retention | Cancel Flow Brief (built) |
| AI CRM concept | VENX (built) |

## Planned — mapped to existing `PROJECTS` entries, need a case study page + `link`

| Roadmap item | `PROJECTS` entry | Category |
|---|---|---|
| Omnibiz — SSO flow | `Omnipay SSO` (2025) | SSO / account migration |
| Omnibiz — Design system | `Omnione Design System` (2024) — confirmed same thing | Design system |
| Nomba — Creative design campaign | `Nomba Brand Campaigns` (2021) | Branding / creative campaign |
| Crazy Ludo — revamp + reasoning | `Crazy Ludo` (2021) | Game design |
| Safari City — assets + improvements | `Safari City` (2020) | Game design |

## Planned — new `PROJECTS` entries (unlinked cards, visible in Work grid)

| Entry | Year | Category | Confirmed? |
|---|---|---|---|
| Traction Apps — Savings & Loan | 2023 | Savings & loan | Yes — real product |
| Traction Apps — Ramp Website | 2023 | Marketing website | Yes — real product |
| Fundall — HR Platform (HRMS/HRPP) | 2022 | HR platform | Yes — real product |
| Fundall — V2 Landing Page Relaunch | 2022 | Marketing website | Year not yet confirmed — the V2 relaunch may postdate the initial 2022 engagement |
| Fundall Brand Campaign | 2022 | Branding / creative campaign | No |
| Fortnoto — Marketing Studio | 2026 | Marketing website | No |
| Fortnoto Branding & Design System | 2026 | Branding / creative campaign | No |
| Valideity Branding | 2026 | Branding / creative campaign | No — year unconfirmed (personal project) |

## Doesn't fit a case-study shape — needs a different home

- **Teesas — training program taught via webinars.** No screens, no flow, no decision to defend — a teaching/mentorship credential, not a product case study. Better suited to the About page or a short leadership-narrative writeup.

## Resolved questions

1. ~~Is Omnione Design System the same as "Omnibiz design system"?~~ **Yes** — confirmed, keeping the name "Omnione Design System."
2. ~~Is Fundall V2 a full product redesign or something narrower?~~ **It's the landing page redesign for the V2 relaunch** — filed under Marketing website, not a standalone flagship case study.
3. ~~Should Fortnoto's branding be its own case study or a section of the main product one?~~ Split into two: **Fortnoto — Marketing Studio** (the marketing website itself) and **Fortnoto Branding & Design System** (brand identity + system) are separate entries.

## Still open

1. What year is the Valideity personal project?
2. What year did the Fundall V2 relaunch actually happen (for the landing page entry)?
3. Should the Fortnoto AI feature explainer be its own case study, or a section inside the main Fortnoto product case study?

## How to move an item from "planned" to "built"

1. Get the real detail from Excellent (problem, constraint, decision, what was measured) — same rigor as Empty State/Coreloops, no invented specifics for real employer work.
2. Copy `fundall.html` + `css/case-study.css`'s markup pattern for the new `<project>.html`.
3. Add `link: "<project>.html"` to that project's entry in `PROJECTS` (`js/data.js`).
4. Cross-link it into the "Other Projects" footer of 2-3 existing case studies.
5. Move the row from "Planned" to "Already built" in this file.
