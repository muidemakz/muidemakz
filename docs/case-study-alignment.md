# Aligning the 14 case studies (and About)

Audit of the pages on the `go-live-new-shell` branch, 16 Nov 2026. Nothing here has been rewritten yet.
The rule for the rewrite: **move, merge, trim and relabel only. No new claims, numbers or results.**
Anything a page is missing is listed as a gap for you to fill, not written for you.

## What differs today

| Case study | Words | Headline style | Sections | Evidence labels on results |
|---|---|---|---|---|
| Speech-to-Order | 1,480 | Title Case | 12, full story | Yes: reported, measured, not measured |
| Omnione | 1,030 | Title Case | 5 | **None** (the −40% figure is unlabelled) |
| Teesas LMS | 1,990 | Title Case | 11 | Yes: reported, measured; one heading still says "Version To Confirm" |
| Fundall | 1,870 | Title Case | 16 | **None** |
| Valideity | 1,060 | Title Case | 6 | Yes: simulated, predicted |
| Empty and preorder states | 710 | Title Case | 5 | **None** (has "What I'd measure") |
| Moniepoint | 3,540 | sentence case | 10 | Yes: simulated, predicted |
| Sun King | 1,790 | Title Case | 6 | Yes: simulated, predicted |
| Nsimbi | 4,440 | sentence case | 14 | Yes: simulated, predicted |
| Cancel flow | 1,380 | Title Case | 6 | Concept, self-initiated |
| Cardtonic | 1,950 | Title Case | 15, with "Discovery" ×4 and "Solution" ×6 | **None** |
| Coreloops | 1,440 | Title Case | 9 | **None** |
| VenX | 960 | Title Case | 8 | Concept |
| Raven Pay | 900 | Title Case | 8 | Concept |

Also: the small line above each title is written six different ways ("Live Project Product Designer",
"Independent Exploration · Verification UX", "Self-Initiated 24-Hour Concept"…), and only Speech-to-Order
says plainly what your role was and what the evidence is before the reader scrolls.

## Proposed shared structure

Speech-to-Order already reads the way a hiring manager wants, so it is the model. Every case study gets the same
spine, with sections skipped (not padded) when there is nothing true to put in them:

1. **Header**: one line above the title in one format: `Company · Shipped / Independent / Concept · Year`.
   A facts row under the intro: My role · Team · Timeline · Platform.
2. **Summary**: the problem, what I did, the result with its label, in 3–4 sentences.
3. **Problem and evidence**: why it mattered and how we knew.
4. **My role and constraints**
5. **Key decisions**: 2–4 decisions, each with the trade-off.
6. **The design**: the screens, with captions.
7. **Outcome**: always labelled `Measured`, `Reported`, `Predicted (simulated users)` or `Not measured yet`,
   followed by "What I'd measure" where there is no result.
8. **Reflection and next steps**
9. Other projects

Length target: 1,200–2,000 words. Moniepoint (3,540) and Nsimbi (4,440) get trimmed; the cut detail can sit
in collapsible "More detail" blocks so nothing is lost.

## Page by page

| Case study | What changes | What only you can give |
|---|---|---|
| Speech-to-Order | Model page. Remove the one visible placeholder. | The text for "[Add any alternatives considered and what retailer feedback changed…]", or drop it |
| Omnione | Add Key decisions (from Process), Reflection; label the outcome | Source for **−40% handoff time** (measured, reported, or estimate?) |
| Teesas LMS | Rename "Shipped Screens · Version To Confirm" | Which version the shipped screens are |
| Fundall | Merge 16 sections into the spine (Persona, IA and Design System go under Process / Design) | Is "led" right? Any result you can state, labelled |
| Valideity | Add role facts row and Reflection | – |
| Empty and preorder | Add Summary and role; outcome becomes "Not measured yet" + What I'd measure | Shipped or not? |
| Moniepoint | Trim to ~2,000 words; detail into "More detail" | – |
| Sun King | Add Summary and role up front (it opens with scores) | – |
| Nsimbi | Trim to ~2,000 words; detail into "More detail" | – |
| Cancel flow | Fits; add facts row | – |
| Cardtonic | Collapse repeated Discovery/Solution blocks into Problem, Decisions, Design; label the outcome | Your role, team, and whether it shipped |
| Coreloops | Add Summary and role; label the outcome | Shipped or concept? |
| VenX | Add Summary; fits otherwise | – |
| Raven Pay | Add Summary; fits otherwise | Shipped or concept? |

## About page

- The numbers need the same labels as the case studies: 150K+ retailers, $124M+ NMV, −30% auth tickets,
  −40% handoff time, +25% engagement, +30% engagement, −30% admin time, +25% efficiency. Which are measured and
  which are from team reporting?
- "6+ years": your Experience list starts in 2019, which makes 7 years in 2026. Keep "6+" or change to "7+"?
- "I'm a Senior Product Designer" repeats the headline right below it; the story can open with what you do instead.
- Done already: the two "See work" buttons now open Work (they went to Home).
