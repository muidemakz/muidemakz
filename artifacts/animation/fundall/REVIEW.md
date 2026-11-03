# Fundall motion candidates — 8 October 2026

Both candidates are silent H.264 MP4s, 1800 × 542, 30 fps, with fast-start metadata. Excellent selected B for the homepage, Work hover/focus and the case-study hero, replacing its mismatched static cover; A is an additional walkthrough inside the case study. They are integrated locally and have not been published.

## B — Excellent's two-phone loop

0–0.75 s: hold the same rendered two-phone pair that opens and closes the loop. 0.75–2.35 s: bring both phones into one centred login device. 2.35–3.2 s: select biometrics. 3.2–5.45 s: Face ID scan and verification. 5.45–6.4 s: branded loading. 6.4–7.45 s: welcome. 7.45–7.95 s: transition into Home. 7.95–9.35 s: hold Home. 9.35–11.35 s: split back into the opening pair. 11.35–12.5 s: hold the matching rendered pair.

The original banner artwork switched abruptly to a separately drawn phone shell once motion began. In v2, both opening phones and the centred animated phone use the same rendered device shell throughout, with the original login and home screens. The original cover remains untouched as a source. Login uses `images/fundall/sign-in.png`. Home is recovered from the higher-resolution `images/fundall/cover.png` because `home-after.png` is a different version from the banner's right screen. The recovery inherits the original cover's image resolution and occlusion near the lower left navigation. This is a 2D motion study, not an original 3D-device render.

The Face ID prompt, loading and welcome are illustrative states requested for this animation. They are not evidence that Fundall shipped these exact visual states. The source login and home exports use different example names; the welcome deliberately uses no name.

## A — borrowing journey

A stable device follows Home → Salary Advance introduction → eligibility → employer details → request confirmation → Home. Each source screen is held before the next transition. This is a walkthrough of existing design exports, not a recorded completed transaction; placeholder inputs remain as supplied. The source confirmation says the request goes to the employer for review, not that funds are already approved or disbursed.

Sources: the same recovered Home screen, `salary-advance-intro.png`, `loan-form-eligibility.png`, `loan-form-employer.png` and `loan-success.png`.

## Checks

Representative frames were inspected for masks, typography, content, source fidelity and return positioning; the Home recovery was adjusted to avoid clipping its main controls. Each rendered file decoded successfully end to end. Before encoding, the final frame equals the opening frame exactly. Original images, prior animation versions and portfolio page files were not overwritten by this render task.

## Local website integration

- B v2 uses the identical `videos/fundall/sign-in-loop.mp4` file on the active homepage card, the Work card on mouse hover or keyboard focus, and as the Fundall case-study hero animation. All phones in the loop use the same rendered shell. It replaces the mismatched static two-phone cover; the earlier B v1 file is preserved.
- A uses `videos/fundall/borrowing-loop.mp4` at `fundall.html#borrowing-walkthrough`, immediately after the static Salary Advance application screens.
- Both videos loop. Excellent subsequently requested removing the case-study labels, control bars, black captions and closing motion heading; the case-study players now show only the animation. Work retains Pause/Play and the homepage retains its shared motion pause control. Offscreen and hidden-tab players pause. Reduced-motion preferences suppress automatic playback; the case study displays posters for that preference.
- Original screens, existing slideshow and previous animation versions are preserved. Media copies are served only when needed, with posters as fallbacks.

After reviewing that the separate static phone cover did not match the animated phones, Excellent asked to replace it with the animation at the beginning of the case study. The static hero image is no longer displayed there. Original screens, the separate application gallery, existing slideshow and previous animation versions are preserved.

Desktop browser verification covered both case loops, pause/replay, homepage playback and width containment, keyboard activation of Work previews, rebuilt search results and list-mode pausing. Six controller tests cover visibility, reduced motion, focus/touch behavior, active homepage cards, pending playback and hidden-tab/removal handling.

The pause/replay checks above describe the initial integration before the user requested their removal from case-study figures. The video files, controller and other placements are unchanged by that visual cleanup. Source-fidelity notes remain in this review rather than the visible caption bars.

Mobile CSS is included, but mobile visual verification remains pending: the browser viewport control did not change the actual viewport from 1280 × 720. Do not treat the desktop screenshot as mobile proof. No production deployment was performed.
