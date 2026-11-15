# Portfolio update handover

Prepared 11 November 2026 for whoever edits this repo (a person or a coding agent). Standalone: it does not rely on any other chat. It contains no private application details and is safe to share with this folder.

Owner: Excellent Makanju. Site: https://muidemakz.com. Repo: plain HTML, CSS and JavaScript, no build step.

## 1. Why this update
A senior product design review of the live site found the case studies read as activity and polish rather than owned results. Hiring reviewers for senior roles are asking for:
1. Results first: baseline, target, what happened, and what to try next when a number is still high.
2. Evidence the problem was real before designing: who it is for, how that was known, ideally with the people designed for.
3. At least one shipped project with a result the owner can defend under follow-up questions.
4. Visible proof of designing in code with AI agents, and of enterprise workflow work (roles, permissions, approvals), and of design systems with a clearly stated personal contribution.

The goal is not more polish. It is honest, sourced, outcome-led case pages.

## 2. Read first, then reconcile
Read `README.md`, `CODEX_PROJECT_KNOWLEDGE.md` and `ROADMAP.md`. The README is directionally right but not fully current.

**Live and local have drifted.** The live site was reviewed on 9 November 2026. It showed five home cards (Omnione, Fundall, Valideity, Teesas LMS, Coreloops) and no Speech-to-Order card. This repo's `index.html` and `my-work.html` already link `omnibiz-speech-to-order.html`, and commits through 3 November show Speech-to-Order, Cancel Flow and Nsimbi work. Current branch is `codex/portfolio-case-study-transformation` with uncommitted changes (Nsimbi images, `index.html` and others). Other branches: `dev`, `master` (live), `codex/*`, `design/portfolio-directions`.

Step 0, before editing anything:
1. Run `git status`, `git diff --stat` and `git log master..HEAD`. Write down what is local-only.
2. Open the live site and the local preview side by side (serve with `npx http-server -p 5500 .`) and list every difference.
3. Treat the findings below as a checklist against the version that will actually be deployed. Some may already be fixed locally.
4. Never merge, push or deploy unless the owner asks. Work on a branch the owner names. Do not commit uncommitted work you did not write.
5. Known conflict to resolve with the owner: README says Speech-to-Order is live and linked; ROADMAP says draft, noindex and unlinked; the project knowledge file says `omnibiz-speech-to-order.html` is `noindex`. Decide whether it is public and indexed.

## 3. Rules that must not be broken
- Never invent metrics, research, quotes, dates, team sizes or client details. If a number has no source, remove it or reframe it as a hypothesis ("if tested, these are the measures I would use").
- Check attribution. Never credit Excellent with someone else's achievement, even if he supplied the text.
- Ownership wording must match the CV: he contributes to the shared Omni design system and leads Retail Design at OmniRetail. Do not claim sole ownership of a system or outcome unless the owner confirms it. State role, team, duration and who built what.
- Simulated AI results are labelled Predicted. Only real-participant results are Measured. Never present simulated work as customer evidence.
- Do not add "Client Project" or "Design Exploration" labels to real client or employer work without asking (a deliberate liability decision).
- Do not publish internal employer material, screenshots or data that are not cleared.
- Scale of a company or ecosystem is context, not a feature's adoption metric.
- Planned capabilities must not be described as built.
- Writing style: no em dashes, en dashes or hyphens used as sentence separators. Use commas, colons, parentheses or short sentences. Natural, direct, specific, no inflated enthusiasm.
- Keep existing styles and interaction scripts intact. Follow the README's case-study workflow, `.wrap` padding rule, shared `js/header.js` (synchronous script at the render position) and `REVERT POINT` comment convention. The first eight `PROJECTS` in `js/data.js` must match the static cards in `my-work.html`. Add sitemap entries and related-work cross links for any new page.

## 4. Case page template (apply to every case)
1. One line outcome plus a status tag: Shipped, Prototype or Simulated.
2. Role, team, duration, and who built what.
3. The problem, who it is for, and how it was known to be real (source, number of people, dates).
4. Baseline.
5. Target. If none was set, say so and say what one would have been.
6. What was done and why: two or three decisions, including one that was wrong or changed.
7. Result, with source, period and method, plus what it does not show.
8. What is still unresolved and the next test.

## 5. Work items, in priority order
Apply to the version being deployed. File names are repo root.

### P1: consistency and credibility (cheap, high risk if left)
1. **Years of experience.** `about.html` (lines near 81, 124, 140) and `resume.html` (near 230) say 6+. The owner's current CVs say 7+ (product design including independent practice since January 2019). Needs an owner decision, then one number everywhere: `about.html`, `resume.html`, the two resume PDFs (`Excellent_Makanju_Resume_2026.pdf`, also in `muidemakz-site/`), JSON-LD and meta descriptions, and LinkedIn. Do not change until decided.
2. **Omnione ownership wording** (`omnione.html`, and check `omnione-v2.html`). "I owned the system end-to-end" conflicts with "contribute to" elsewhere and with later "worked with" and "partnered with" wording. Rewrite to the owner's confirmed scope. Also: the minus 40% handoff time needs baseline, period and method or must go; "Teams Unified: 4" needs per-team adoption; "rebuild cycle ended" is unmeasured and absolute; define "2,300+ variants"; the audit scope disagrees between sections (three surfaces versus four teams).
3. **Speech-to-Order** (`omnibiz-speech-to-order.html`). This is the owner's lead interview story, so it must hold up. Restructure to the template. Facts supplied by the owner on 2 November 2026: roughly 90% to 65% complaint sessions and 10% to 35% ordering sessions over two weeks after the update, assessed through conversation logs, usage reports and retailer feedback. These are owner reported and unaudited. Still needed, see README "Remaining evidence gaps": real screenshots, two analytics captures, the window, session count, the definition of a complaint session, a note of what changed in the UI, how the problem was known to be real, and any target (none established). Do not re-add the earlier 35% completion speed claim.
4. **Design in code page and Nsimbi framing.** The home page only says "increasingly building what I design". Add a page showing how the owner designs in code with AI agents: the reusable skill (repo https://github.com/muidemakz/ui-design-with-mm), the Nsimbi working prototype (in progress, simulated accounts and payments), and how agent output is verified against intended design, with one worked before and after. Nsimbi needs a short wrapper: problem, decisions, status, next test. Files: `nsimbi/`, `nsimbi-three-purchases.html`, new page plus `js/data.js` and sitemap.
5. **Valideity status label.** Live home shows a "Pause" tag beside "Currently building" with no explanation. Find it (grep `Pause` and `paused` in `index.html` and `js/`) and either explain or relabel to match reality. Confirm Valideity's real status with the owner.

### P2: make each case defensible
6. **Fundall** (`fundall.html`, shipped, best candidate for "shipped with a result"). Source or remove each figure: 28% more salary advance requests, 6 to 2 minutes, 45% fewer form errors, 74% more confident. Add who measured it, period and comparison. State the research (number of interviews, dates), the basis for the persona, and that the work was iOS first. Do not credit company level achievements to the owner.
7. **Teesas LMS** (`teesaslms.html`). The three rebuild story is the strongest "owned a failure and iterated" material. Add what V2 users struggled with and how that was learned. Add baselines or remove unbaselined percentages (+35% logins, minus 40% setup time, 70%+ parent portal use, 82% satisfaction, "20+ schools"), and say these came from the client's internal reporting if so. Fix title inconsistency (page says Lead Product Designer, byline Senior). Remove or source the "led to a Design Manager role" line. Show usability findings if testing is claimed. Add a short section on roles, permissions and approvals, only what was actually designed; say plainly where multi level approvals or audit trails were not part of the work.
8. **Sun King** (`sun-king.html`, simulated). Lead with concrete findings, not the 76 to 86 score (the score is confounded because the "before" is a rebuild with unwired controls, and scoring is described as still being tuned). Put the unresolved issue (confirmation missing plan details in 9 of 10 sessions) high on the page. Mark SIMULATED at the top.
9. **Valideity pricing case** (`valideity.html`). Keep, label Predicted. Optional strengthening: one real participant round (even five) to report a Measured result.
10. **Coreloops** (`coreloops.html`, not shipped, no results). Reframe as a proposed redesign with a validation plan (time to first result, More Filters open rate), or demote. Remove unsupported claims ("zero disorientation", "zero clicks"), source or remove "most users only needed 1 to 2 filters", and drop the accessibility claim for CSV export.

### P3: navigation and clarity
11. Add one outcome line and a status tag to every home card and Work card (`index.html`, `my-work.html`, `js/data.js`).
12. Review `about.html`: surface AI and design in code, keep tool list accurate, make roles and dates match the CV exactly.
13. Review the cases still marked `confirmed: false` in `js/data.js` and Wrapped highlights before strengthening claims.

## 6. Inputs only the owner can supply (do not guess)
- Speech-to-Order: how the problem was known to be real, any target, who verified the splits, window, session counts, complaint definition, completion data if any, real screenshots.
- Fundall: interview count and dates, who measured each result and over what period, the persona's basis, platform scope.
- Omnione: team size, duration, per team adoption, who built what, basis for minus 40%.
- Teesas: baselines, who produced the internal report, what was tested, which permission and approval flows were designed.
- Valideity: current real status and what "Pause" should say.
- Years: 6+ or 7+.
- Whether Speech-to-Order and Cancel Flow are public and indexed.

If an input is missing, publish the page with the unsupported claim removed or reframed as a hypothesis, and list the gap in the page's "What this does not show" section. Do not fill it with plausible numbers.

## 7. Acceptance checks
- Every number on a case page has a source, period and method, or is gone.
- Every case has a status tag and the template sections, with an honest "what this does not show".
- Years, titles, employers and dates are identical across `index.html`, `about.html`, `resume.html`, the PDFs, JSON-LD and LinkedIn.
- Ownership wording matches the CV on Omnione and anywhere else.
- No unsupported absolutes ("zero", "ended", "all teams").
- Simulated work is labelled Predicted everywhere it appears.
- New pages: header script in place, sitemap entry, related-work links, `noindex` decision recorded, local preview loads without console errors, links and images work.
- `PROJECTS` first eight entries still match `my-work.html`.
- No commit, merge or push without the owner's request. Leave a short change log of files touched and what remains.
