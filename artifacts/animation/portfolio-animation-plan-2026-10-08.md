# Portfolio animation queue

Prepared 8 October 2026. Fundall is integrated locally: B is the shared loop on the homepage, Work hover/focus and the case-study hero, replacing the mismatched static cover. A is an additional in-case walkthrough requested by Excellent. Other projects remain queued. Nothing has been published.

## Placement

Each completed project gets one identical looping animation, reused in all three placements. Excellent confirmed this on 8 October 2026; do not make separate short and long edits.

- Homepage: a short, silent loop on that project's active reel card. Keep the current five projects, order, captions and navigation. Pause inactive cards and provide a way to pause motion.
- Work: retain the existing image at rest; play a short preview on mouse hover and keyboard focus. Touch visitors keep an immediately usable case-study link, with the animation available inside the case.
- Case study: the same loop as the final project-content section, after the written story and before Other Projects and the site footer. Visitors can play, pause and replay it.

Preserve all current covers and earlier animation versions. Use poster images for reduced motion and failed playback. Load only the needed preview; do not download every project's video on first page load. Keep animations working after Work search, filtering, pagination and grid/list changes.

## Recommended order

| Order | Project | Homepage now? | Proposed story |
|---|---|---|---|
| 1 | Fundall — Salary Advance | Yes | Locally integrated: B's two-phone sign-in loop in the homepage, Work and case-study hero; A's borrowing walkthrough after the application screens inside the case study. Mobile visual verification is pending. |
| 2 | Omnione Design System | Yes | Move from type, colour and components into the product screens they support. Show consistency across the four product teams with one focal composition at a time. The case-study hero replaces the full Figma window while preserving the surrounding banner; Work and homepage placements remain for review. |
| 3 | Teesas LMS / EMS | Yes | Show progression from V1 to V2 to V3, then focus on one documented teacher task. Keep labels legible and match the actual screens. |
| 4 | Coreloops Documents Filter | Yes | Show the proposed filter interaction: selecting a filter, an active filter chip, multiple filters and clearing. Make the concept/proposed status clear. |
| 5 | Valideity | Yes | Follow the documented pricing-flow study through setup, findings and the revised interface. Keep simulated results labelled Predicted. Outfit remains the brand typeface. Adapt the existing logo motion only where it supports this product story. |
| 6 | Omnibiz Empty & Preorder States | No — Work and case only | Explain the unavailable-item state and the preorder response using the existing case screens. |
| 7 | Cardtonic P2P Money Transfer | No — Work and case only | Follow recipient selection and the documented transfer flow, ending on its confirmation state. Retain concept positioning. |
| 8 | VENX | No — Work and case only | Connect the lead board, communication and dashboard using existing concept screens. |
| 9 | Raven Pay | No — Work and gated case only | Show the existing banking redesign through its documented screens. Preserve the case's access gate and review what is appropriate to expose in a public hover preview first. |

Unfinished and unlinked archive entries are outside this first queue. Add them when their case studies and source screens are ready.

## Design direction

Animate the product's idea and interaction, using original interfaces and brand assets. Use deliberate framing, a clear focal point, readable pauses and purposeful transitions. Avoid generic floating screens, arbitrary zooming and invented interfaces. Match each product's visual identity while keeping the portfolio's existing typography and surrounding layout.

Choose a duration that tells the story clearly and loops cleanly. Adapt playback behavior to each placement, not the content of the video. Tune the homepage reel dwell time if necessary once the loop is reviewed.

## One project at a time

1. Fundall candidates A and B are created and preserved.
2. Excellent selected B for the three shared placements and A additionally within the case study. After seeing the case page, he asked to replace the mismatched static hero phones with B and remove the duplicate closing animation.
3. Local integration and desktop playback, keyboard and filtering checks are complete. Controller tests cover reduced motion and touch behavior. Mobile visual verification remains pending because the browser did not apply the requested viewport.
4. Review each local integration before continuing to the next project. Omnione's case hero replaces the full Figma window by user request; keep Work and homepage placements pending review.

## Cardtonic update — 9 October 2026

The first Cardtonic cinematic ad direction was rejected by Excellent. A new Type A study follows Fundall's stable, centered-device walkthrough treatment with the original Cardtonic screens: Home → Search → Verify → Amount → Review → PIN → Success → Home. The 14-second H.264 loop is saved at `videos/cardtonic/transfer-type-a.mp4`; its render source, poster, storyboard and preview are in `artifacts/animation/cardtonic/`. Website integration remains pending review.

The first review is a standalone motion preview. Do not roll an unreviewed style out across all projects or replace the current covers.
