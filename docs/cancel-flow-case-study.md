# Cancel Flow Brief: case study notes

Source page: `cancel-flow.html` (draft, `noindex`, unlinked from Work).
Nature of the project: a **self-initiated weekend design brief**, not built for or commissioned by any company. It must never be presented as shipped work or carry results. The page's own status line already says this.

## Update, 3 Nov 2026: now designed for Valideity

- The four screens are built in code on the page, in Valideity's look (plan names and ₦15,000 Pro price from its public pricing page).
- Valideity plans are prepaid with no automatic renewal, so the flow is "leaving Pro early and stepping down to Free", not stopping a recurring charge.
- Order fixed: 01 Entry, 02 Exit reason, 03 One offer, 04 Confirmation.
- The offer shown ("pay for 10 months, get 12") reuses the Annual "2 months free" Valideity already advertises. Other reason-to-offer pairings are concepts.
- Sample content: dates, the 42 of 60 usage figure, "we won't ask again".
- To confirm before publishing: what happens to a user's studies and reports on Free, and whether any refund policy applies. The confirmation screen avoids stating either.

## One-line summary

A subscription cancel flow that takes two taps to find, makes one fair retention offer matched to the user's stated reason, and confirms clearly. It argues for the user with a retention and reactivation business case, not a moral one.

## What the page already says (keep)

| Section | Content |
| --- | --- |
| Problem | Friction-based retention plugs every cancel attempt as a leak. It lifts short-term retention while raising churn complaints, refund disputes and ex-customers warning others off. |
| Job | A flow that is easy to complete but still gives the business one fair, well-timed chance to retain, then measure whether that trade pays off. |
| Constraints | 1) Findable in two taps from account settings, no support-ticket-only cancel. 2) Exactly one retention offer. 3) A skippable exit reason that is useful to the product team. 4) Clear confirmation: when access ends, what happens to data, how to return. |
| Flow | 01 Entry point, 02 The one retention offer, 03 Skippable exit reason, 04 Clear confirmation. |
| The one decision | Cap the flow at exactly one offer, matched to the stated reason, instead of escalating counter-offers. |
| What I'd measure | Completion rate, offer acceptance (per offer type against reason), reactivation rate within 90 days, "how do I cancel" support contacts. |
| What would prove it wrong | If 90-day reactivation stays flat while cancel-through-completion rises, the old friction was converting recoverable users, so the fix is a better-timed offer, not a shorter flow. |
| Reflection | The hard part was arguing for the user in the team's own metric language. |

## Known gaps

1. **The four screens are empty slots.** The page says they are labelled placeholders. A case study with no screens is the biggest gap.
2. **One ordering issue to decide.** The page puts the offer (02) before the exit reason (03), but the offer is "chosen based on this answer where possible". The reason has to be known before the offer. Either reorder (reason, then offer) or explain that the reason is captured on the same screen as the offer.
3. **No named product.** It is modelled on "common subscription-cancellation patterns". Decide whether to keep it generic or pick a fictional product so the screens feel real.
4. **No sources.** The opening claims ("works in the short term and costs trust permanently", "users who leave easily come back later") are opinion. Either label them as the brief's hypothesis or back them with a cited source. Do not add figures unless sourced.
5. **Hero media** is a text label only.

## Suggested screen specs (to design or capture)

These are the contents the page copy already commits to. Design them as a clean mobile or web flow.

1. **Account Settings.** "Manage Subscription" at the top level, not nested under Billing, Advanced, Plan Details. "Cancel Plan" is a visible text link, not a button disguised as something else.
2. **Retention offer.** One screen, one offer. Examples already in the copy: a 30-day pause for "not using it enough", a discount for "too expensive". One accept button and one "No thanks, continue cancelling" link at equal visual weight.
3. **Exit reason.** Single question, options: price, missing feature, switching elsewhere, no longer needed, other. "Skip" at equal weight to "Submit". Price objections get a discount, feature gaps get a roadmap note, not a discount.
4. **Confirmation.** Exact end date, saved data kept 90 days then deleted (stated plainly), one-line reactivation reminder, no further steps.

## Questions for you

- Which ordering do you want for steps 02 and 03?
- Real product, fictional product, or generic brand-neutral screens?
- Is this weekend brief one you want live, or does it stay a draft? Several other case studies lead the Work grid.
- Do you have the date or time spent on it (the page only says "Design Brief, 2026")?
- Any source you want cited for the claims in the opening paragraph?

## Rules for this page

- Say it is a self-initiated brief wherever it appears.
- No results, adoption or retention numbers. The "What I'd Measure" section is a plan, not an outcome.
- Keep it `noindex` and off the Work grid until the screens exist.
- Do not combine it with real client work such as Speech-to-Order in the Work grid copy.
