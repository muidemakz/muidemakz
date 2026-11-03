# Nsimbi: from one request to three reviewed purchases

**Independent product design concept · Uganda · UGX · Mobile**

> Nsimbi is Felix Kitaka's product. This is an independent design exploration inspired by his publicly shared demo. It was not commissioned, implemented or endorsed by Felix. The prototype uses simulated accounts and payments.

**Superseded 3 Nov 2026:** the page is built as `nsimbi-three-purchases.html`. This file is the planning draft and its open questions were settled in the page.

Draft v2, 3 Nov 2026. Changes from v1: adds a "How I worked" section (bearings, code, Figma), replaces "no Valideity study has been run" with the seven runs from 1 Nov, and maps every image to a file that exists. Lines marked **[verify]** need a check before publishing. Lines marked **[you]** need your answer.

## At a glance

| | |
|---|---|
| Product | Nsimbi, a conversational mobile money concept |
| Focus | Asking for airtime, voice and data in one message, then reviewing and approving each purchase on its own |
| Role | Independent product design: research, interactive prototype in code, Figma design system, simulated testing |
| Process | Bearings from a reference, built in code, then documented in Figma |
| Platform | Mobile-first browser prototype, light and dark |
| Evidence | Seven Valideity runs of five simulated sessions each, one persona. Predicted, not measured. |
| Status | Concept exploration. No production integration and no real customer study. |

## The opportunity

Nsimbi lets you describe the outcome in a conversation and works out the steps. Felix's demo shows one message asking for airtime, a voice bundle and a data bundle, then three separate reviews and approvals.

That raises a design question: how can the conversation take care of the busywork while people still understand what Nsimbi interpreted and what they are approving?

It matters because money is involved. A request can be mistyped or misheard, a recipient or amount can be wrong, and bundles have restrictions. This is a design hypothesis, not a demonstrated customer problem. The source was a product recording and public posts, not interviews or analytics.

## How I worked: three passes

The order matters, because each pass answered a different question.

### 1. Bearings (30 Oct): what is the product doing, and what should I keep?

- Watched Felix's 153 second recording and sampled frames every ten seconds, with closer frames at the key moments. Wrote down what is visible and what is not, before designing anything.
- Wrote eight comprehension questions first (what was understood, what needs approval, what leaves the wallet, when the voice bundle works, what has finished, where the receipt is, skipped vs paid, uncertain state). These later became the study questions.
- Chose one journey: three purchases from one message. It is the clearest version of what makes Nsimbi different.
- Took the messaging pattern from a reference I read in Figma (a fintech app's chat-and-payment structure), plus four reference screens I chose for hierarchy and restraint. I kept their structure and left their branding, artwork and content out. **[you]** If you also sketched or explored in your own Figma before coding, tell me and I will describe it here. The records I have show Figma only as a reference at this stage.

### 2. Code (30 Oct to 2 Nov): make the interactions real

I built the prototype in code rather than Figma because the idea depends on things a static frame cannot show: typing a request, a queue that advances, a sheet that opens per purchase, PIN entry, receipts, skipping, an uncertain state, switching between chat and wallet.

- A small system from the start: icons, buttons and inputs, then purchase rows, review details and receipts, then the header, balance, composer and sheets. State, content and theme are parameters, so the same Review and Receipt serve every product.
- Colour, type, spacing and radius live as tokens, with light as the default and a dark switch.
- Checks: state-machine and interaction tests (76 passing on 1 Nov **[verify count]**), layout at 13 widths from 320 to 2560 in both themes, and 16 measured contrast pairs. These show the demo behaves as built. They say nothing about whether people understand it.
- Iterated daily from 31 Oct: statements, receipts and sharing, profile and verification tiers, wallet and Send money, daily reward, a Recent banks shortcut, validation shown beside the action it blocks.

### 3. Back to Figma (2 Nov): document it and test the system

With the design settled in code, I rebuilt it in Figma as the reference file: Foundations (colour in light and dark, effects, type), Components (atoms, molecules, organisms, templates) and Screens (nine flows, each in light and dark: sign in, dashboard, daily reward, conversation, purchase, statement and the rest).

What the round trip showed, because writing a system down is how you find where it drifted **[verify before publishing, see note]**:

- The type page lists about 73 named styles (for example Display in 15 near-identical size and line height pairs). A healthy scale would be closer to ten. The code grew a new size every time a screen needed one.
- Variants are named from their padding values instead of their purpose, so the component list is long and hard to scan.

Both are fixable and are the first thing I would clean up before handing this to a team. **Note:** this section is true today. If you consolidate the type scale and variant names in the file first, I will rewrite it as "what I fixed" instead.

## Decisions

1. **Start with the request.** The conversation stays the main way in, with typing and voice.
2. **Make interpretation inspectable.** One message becomes three separate purchase items, not one opaque confirmation.
3. **Keep each decision specific.** Recipient, provider, amount, fees and restrictions for the item being reviewed. One approval never covers all three.
4. **Make correction local.** Edit a recognised amount or recipient on that purchase, or clarify in the chat, without restating the whole request.
5. **Keep status attached to the item.** Awaiting review, processing, paid, skipped or uncertain, with the receipt kept on that event. An uncertain payment offers a status check, not a second payment.
6. **Conversation is not authorisation.** A statement request or an ordinary "yes" can never approve a purchase.
7. **Label what is simulated.** PIN, biometrics and payments are marked as demo behaviour.
8. **Use Nsimbi as a reference, not a skin.** Rebuilt in Plus Jakarta Sans, light first, restrained.

## The journey

One fictional user, one request, the same amounts and providers throughout. Facts come from the recording (airtime UGX 100, voice 30 minutes for UGX 300, night only and MTN to MTN, data 30 MB for UGX 250), not from current tariffs.

| State | Figma frame | What it shows |
|---|---|---|
| 1. Request | Chat, Multiple requests | One message asks for three things |
| 2. Interpretation | Chat, Three purchases | Three items, each with its own status |
| 3. Review | Final review | Recipient, amount, fee, total debit, restriction |
| 4. Progress | Chat, Voice bundle | First paid, second ready, remaining queue |
| 5. Completion | Transaction successful, Transaction receipt | Result and where to find the receipt |

Supporting states: Payment uncertain, Payment failed, Validation errors, Statement. Treat these as extensions I added, not behaviour seen in Felix's recording.

## Testing it with Valideity

Valideity is my own product, so read this section with that in mind. It runs simulated participants through a live page and reports a score plus findings. On 1 Nov I ran one study, "Nsimbi Chat-First Purchases", against the public prototype: a custom persona (a Kampala mobile money user, 25 to 40, mid-range Android, low familiarity with chat payments), five simulated sessions per run, seven runs. **[verify all numbers against the dashboard before publishing]**

| Run | What I changed | Score | What happened |
|---|---|---|---|
| 1. First pass | Sign in, ask for three purchases, approve each | 75% | All five stopped at the purchase PIN, which simulated participants will not enter. Completion 50, Ease 96. |
| 2. PIN skipped | Demo flag auto-approves the PIN | 99% | All five finished. No findings. |
| 3. Wallet mode | Airtime or Send money | 97% | Three of five tapped My contacts and saw nothing. Four of five stopped at the bank-details form, so the number is not clean. |
| 4. Wallet, airtime only | Removed Send money from the task | 97% | All five used contacts. Three of five read the grey placeholder "100" as a filled amount and were told to enter one. |
| 5. Planted fee | A UGX 1,500 fee on a UGX 100 purchase | 97% | Three findings, all the fee. The score barely moved. |
| 6. Blocked task | Ask to add an account the app does not allow | 0% | All five counted as "gave up", though the screen said the feature was not available. |
| 7. Verification tiers | Verify up to Tier 3 with sample details | 100% | All five finished, no findings. |

What I take from it:

- **The findings were useful, the score was not.** The planted fee scored 97% against 99% without it, yet all three findings named the fee. I would trust the list of findings over the number. The Sun King study taught me the same thing.
- **Run 2's 99% proves little.** I wrote a guided task and removed the PIN, so near perfect completion was close to guaranteed. It says nothing about whether people would trust the payment step.
- **Real problems came out of it:** the empty My contacts tab, the placeholder that looks like a value, and the greyed button that gives only a faint reason. **[you]** Tell me which of these you fixed in the prototype so I can say so, and show the before and after.
- **It also exposed problems in the tool.** A task the app blocks scored 0% even though the screen explained why, and a hidden fee barely moved the score. Both are Valideity issues I am working on separately.

### What this does not show

There was no comparison with Felix's original, because there is no interactive copy of it to test fairly, so I cannot claim an improvement. It was one persona, five sessions per run, all simulated. No real customer used it. Every score here is a prediction from simulated sessions.

## Felix's feedback

**[you]** v1 says Felix replied with product direction and said he is not building a team or recruiting. I have no record of that reply, and I would cut the recruiting line from a public page: it adds nothing to the case and could read as awkward for him. Keep only the design takeaway if you want one: lead with the outcome, not familiar wallet navigation. State it as feedback on direction, not a review or endorsement.

## What I learned

The tension is not conversation against control. It is giving people enough visibility and correction at the moment of a money decision without making them manage every step. The Valideity runs reinforced that: the trust problems (a fee, a value that looked filled) are the ones a score hides and a finding catches.

## Next steps

1. Run the matched comparison: a rebuilt version of Felix's flow and this concept, same request, same facts, same questions.
2. Test the payment step without a demo flag, with real people.
3. Prototype ambiguous input, voice correction and recipient correction beside the happy path.
4. Consolidate the Figma type scale and name variants by purpose.

## Image and media plan (files that exist today)

| Slot | Source |
|---|---|
| Hero | Figma frame "Chat, Three purchases" (30:32632), light, in a phone frame. Caption: Independent concept, simulated payments. |
| Original context | One small crop from Felix's recording, `video-frames/frame-0045.jpg` (airtime review). Credit and link his post. Nothing personal visible. |
| Journey | Five frames from the table above, exported from Figma at one size. |
| Process strip | Three images: the reference, the running prototype, the Figma Foundations/Components page. |
| Both themes | Final review light and dark side by side. |
| Walkthrough video | `video-review-20261102/Nsimbi-dashboard-cut.mp4` is 22 MB: compress for the page. It has garbled apostrophes at about 75 to 80 seconds (fixed in code since), so trim that passage or re-record. |
| Valideity | The run table above as a Moniepoint-style panel. The panel stays hidden until real study data is entered. |

## Before this goes live

- [ ] Remove the `?flaw=fee` and `?demo=1` switches from the public prototype, or state clearly that they exist for testing. Right now anyone can add a UGX 1,500 fee to a purchase.
- [ ] Re-check the seven run scores and session counts in Valideity.
- [ ] Decide on public Valideity study links. None exist for Nsimbi. Creating them means recruiting real people, which I will not do without your go.
- [ ] Confirm your permission or comfort with the Felix frame crop and his name.
- [ ] Mark which screens are in Felix's recording and which I added.
- [ ] Show the Valideity ownership line on the page.

## Summary for the portfolio card

Nsimbi is an independent mobile concept exploring how conversational finance can turn one request into several clear, individually approved purchases. I took my bearings from Felix's demo, built the interactions in code, then documented the system in Figma, where the round trip showed me where the code had drifted. Seven simulated Valideity runs found real problems, and showed me which numbers not to trust.

## References

- Public prototype: https://muidemakz.com/nsimbi/
- Original post: https://lnkd.in/p/dgXb4dXQ
- Figma file: https://www.figma.com/design/GTzmkIBMWo9B50diLdLCFT
- Source notes (private): recording-review.md, design-decisions.md, design-delivery.md, baseline-and-comparison.md, design-run.md
