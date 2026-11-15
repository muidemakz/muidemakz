# Sun King motion video: plan

Status: **4:5 final rendered** (`videos/sun-king/sun-king-final-4x5.mp4`, 1080×1350, 30 fps, 75s, source in `artifacts/animation/sun-king/`; render with `--dsf 1 --fps 30 --src 30 --q 95`, footage in `frames30/`). The owner confirmed the After score is 86 (the post draft's 83 was wrong). Final changes after v6: the opening line reads "The rebuild starts with one prompt." to match the post, which starts with AI First Read, and the end card adds "Independent concept. Not affiliated with Sun King." Not made yet: 16:9 and 9:16 cuts. v6 changes: the score caption is now white, and the music is the Afrobeats-leaning groove (option B, 106 BPM) with the driving electronic parts of option C during the shopper study (about 41–52s) and the bar before the stamp (about 61–64s). Both styles run at one tempo over the same chords (`OPTIONS.mix` in `music-options.mjs`). v5 changes: the redesign prompt is typed into the Claude window, the score caption was a mint block, and the end card reads "Research shapes the design. / Testing shows what to fix. / Then the loop starts again." with an arrow looping back to "Research". v3 and v4 changes: all orange replaced with Valideity's colours (indigo `#171046`, purple `#4520e9`, mint `#8fe0b0`; the meter goes from light to deeper green; Claude's own clay accent stays on its screen) and all whoosh sounds removed. Since v1: opener muted, synthesised sound effects and music added (`audio.mjs`), captions rewritten and moved to about 20% up from the bottom, the "prompt shortened" note removed, and the pace slowed 20% (`PACE` in `index.html`). Section 2's times and captions and section 5's note on the prompt are superseded by this. The draft runs longer than the 50 seconds in section 2. The Valideity progress card is rebuilt in Valideity's look with the real persona order and a count of 10, because the footage still shows 10/15. Written 2026-11-04.

**Your answers (2026-11-04):**
- The Valideity recording is the right one.
- You cancelled the top-up, so the Before stays at 10 sessions and 76.
- There's no separate prototype recording, so the playthrough comes from what you already played.
- The opener is now the original `IMG_0414.mov` (1080×1920, HDR), which replaces the WhatsApp copy. Timings in section 3 are close but shift slightly: arm at about 1.0s, head and shoulders 1.75–3.0s, chair 3.0–3.75s, seated by about 4.5s.
- The 86 is represented as planned, in the score scene. Video length can run longer than 50 seconds if needed.
- Read-only check of both runs: **not completed.** Chrome hung on the Valideity pages and the built-in browser isn't signed in. 76 and 86 currently rest on your word and the case-study data.

**The idea in one line:** you wheel into your desk, type one prompt, and about 50 seconds later a Figma file exists, has been tested, redesigned and re-tested: 76 to 86.

---

## 1. Format: landscape or mobile?

**Recommendation: make 4:5 (1080×1350) the main version, and render a 16:9 (1920×1080) cut from the same timeline.** A 9:16 version can come from the 4:5 with extra background above and below.

| Version | Used for | Why |
|---|---|---|
| **4:5, main** | LinkedIn feed, Instagram | Takes up far more of a phone screen than landscape, so the UI stays readable. Most people will see the post on a phone. |
| **16:9** | Presentation, YouTube, your site | Landscape is the only one that fills a projector. Screens sit full width. |
| **9:16, optional** | Reels, TikTok, Shorts, Status | Little extra work. Key content stays inside the 4:5 area, clear of the app buttons. |

This isn't really either/or. Each scene is laid out as code, so one timeline can render to each size with its own framing. Landscape alone would make Figma and Valideity tiny in a phone feed. Vertical alone would look poor in a presentation.

Your opener is portrait, which suits this: full frame in 4:5 and 9:16, and a tilted portrait card beside the caption in 16:9.

---

## 2. Storyboard (about 50 seconds)

The motion style follows your AwoNest clip: the app window sits on a backdrop, the camera zooms in on where the cursor is going, holds, then pulls back out. Moves use a soft spring, and everything behind the focus area blurs.

| Time | Scene | On screen | Camera and motion | Source |
|---|---|---|---|---|
| 0:00–0:05 | **Opener** | Empty desk. You wheel in and the caption is revealed as you pass. | Your body and chair act as the wipe (section 3). Then push into the laptop screen, which becomes the next scene. | WhatsApp clip, 1.0s to about 6s |
| 0:05–0:10 | **The prompt** | Claude interface from your screenshot. `/ui-design-with-mm` types in, then the rest of the prompt. | Starts wide on "Afternoon, Excellent", then zooms to the text box. Cursor clicks send. | Rebuilt from your screenshot |
| 0:10–0:14 | **Doing it** | The skill's real stages tick off: Deliberate, Research, Foundations, Components, Verify. | Slow push in. The last tick triggers the transition. | Rebuilt, wording from `sun-king.html` |
| 0:14–0:21 | **The Figma file** | Pages panel: Reference, Foundations, Components, Screens, BEFORE. | Zoom out to the whole window, then the cursor hits each page for about 1.3s, with a zoom into the work on each. BEFORE lands last and holds. | Figma recording, plus sharper Figma exports for small areas |
| 0:21–0:28 | **Share and play** | Share dialog, Copy link, "Link copied" toast. Then a fast run through the ordering flow. | Zoom to Copy link. The link pill flies out of frame, and the prototype plays in a phone or laptop mockup. | Figma recording about 28–31s, plus a new playthrough (needed) |
| 0:28–0:36 | **Valideity** | The link pill lands in Valideity. Task and questions scroll by, Start Testing is clicked, shoppers tick through, and the report lands on **76%**. | Zoom to the button, pull back to the running list, then snap to the score. | Valideity recording (section 4) |
| 0:36–0:41 | **The redesign** (added) | Your real first prompt, then the Before and After pages wipe across each other. | Quick zoom to the prompt, then a side-to-side wipe. | Prompt log on the page, your laptop clip, AFTER exports |
| 0:41–0:46 | **The score** | A line or bar climbs while the number counts 76 to 86. Valideity logo stamps in with a small bounce. | Full frame, no UI, big type. The stamp lands exactly on 86. | Built, `images/valideity/logo.png` |
| 0:46–0:50 | **End card** | "Research → Design → Evaluate", then **muidemakz.com** with "Full case study". | Words arrive one at a time and hold long enough to read. | Built |

### Why I added the redesign scene
Your outline goes from the Before screen straight to Valideity and then 76 to 86. Without a redesign moment, viewers can't see what changed to earn the extra 10 points, so it looks like the score just rose. Five seconds fixes that. This is the one change to your order.

### Captions
LinkedIn usually starts videos muted, so every scene needs to work with sound off.

- **Opener (pick one):**
  - "Can one design skill move the score?" (my pick: short enough to read during the wheel-in)
  - "What happens when AI research meets a reusable design skill?" (from your screenshot, but long for a 2-second reveal)
- **Prompt:** "One prompt."
- **Figma:** "Foundations. Components. Screens."
- **Valideity:** "Then test it with simulated shoppers."
- **Score:** "76 → 86. One improvement. Still more to solve."

---

## 3. The opener

Timings from the 9-second clip:

| Time | What happens | Use |
|---|---|---|
| 0–1.0s | Empty desk, nobody in shot | Trim to a beat |
| 1.0–2.0s | Your arm enters from the lower left | Start of the moment |
| 2.0–3.5s | Head and shoulders pass very close to the lens | **The wipe** |
| 3.5–4.5s | Chair back fills the frame | **Wipe finishes** |
| 4.5–6s | You settle in and start typing | Hold, then push into the laptop |
| 6–9s | You keep typing | Spare |

**How the reveal works:** the caption sits "behind" you. As your shoulder and chair cross the frame, a mask follows their edge and the words appear in their wake. You're moving fast and slightly blurred, so a soft edge should hide any roughness. I'd draw the mask by hand, frame by frame, over about 1.5s.

**Quality problem:** this copy is WhatsApp-compressed, at 464×832. It has to scale up more than 2× for the 1080-wide versions and will look soft. **Please send the original file from the phone** if you still have it.

---

## 4. What to use and cut from your recordings

### Valideity (`20261104-1142-16`, 54s)
This wasn't among your three attachments, which were the Figma walkthrough, the opener and the AwoNest clip. I found it in the same Recordings folder, so **please confirm it's the one you meant.**

| Time | What's there | Decision |
|---|---|---|
| 0–2s | Chat with Kamso, updating the study | **Keep, brief** |
| 3–5s | Your typo "you didnt add teh questions" and Kamso's apology | **Cut** |
| 6–11s | Builder: welcome screen, task, questions | **Keep, sped up.** Start Testing is at the top right, which is where the click goes |
| 12–24s | Study link #1: 0 respondents, "No score yet" | **Cut** (the run that didn't run) |
| 27–31s | Simulate #2: **76%**, 10 participants, "Everyone got through" | **Keep: the key shot** |
| 33–39s | Simulate #1: **61%** with a red warning about a different setup | **Cut** |
| 42s | Add to this run, 10 → 15, Starting | **Cut** (see the first blocker in section 5) |
| 45–54s | Simulation queued and running, shoppers listed | **Keep, cropped to the list.** The header says 10/15, which contradicts "10 participants" |

- **The 61 is fine to cut:** that run isn't comparable, and the case study already keeps it out of the main comparison.
- **There's no "create study" moment in this footage.** Zooming to Start Testing in the builder and then cutting to the running list tells the same story.
- **Your email shows in the sidebar.** I'd crop or blur it.

### Figma (`20261104-1135-12`, 34s)
Timings are approximate.

| Time | What's there | Decision |
|---|---|---|
| 0–4s | Figma home tile "ROS - Omnibiz" and the loader | **Cut.** That's another project's file |
| 4–8s | Reference page | **Keep** |
| 9–13s | Foundations | **Keep**, but it's tiny on screen, so use a sharper export |
| 13–19s | Components | **Keep**, sharper export for zooms |
| 19–23s | Screens | **Keep** |
| 24–28s | BEFORE: listing and two detail pages | **Keep** |
| 28–31s | Share dialog with Copy link | **Keep** |
| 32–34s | After closing the dialog | **Cut** |

The share dialog also shows your account name and "Anyone can view", and I'd crop the name. The clip never opens the AFTER page, so that comes from exports.

### Others
- **AwoNest (`20261104-1205-02`):** motion reference only. No footage from it goes in the video.
- **Before/after laptop (`20261104-1101-58`, 28s):** I found this in the same folder too. Useful for the redesign scene, but I'd rather use sharper exports where the text must be read.
- **Audio:** the three screen recordings are loud, so I'd drop their sound. Only the chair-roll from the opener is worth keeping.

---

## 5. What I need from you

### Blockers
1. **Is the Before score still 76?** At 42s in the Valideity recording, Add to this run goes from 10 to 15 on Simulate #2, and your team sessions drop from 165 to 160. The clip ends with the run still in progress at 10/15. If it finished, **the score may no longer be 76 and the sample is 15, while the After is still 10.** That also affects the live case study, which says 10 sessions each. I can check the run read-only if you tell me to, or you can look.
2. **The After result.** The recording only covers the Before study. For the 86 I need a few seconds of the After report (Simulate #2). You can record it, or I can read the page read-only.
3. **A prototype playthrough.** Please record 8–10 seconds of the Figma prototype in present mode, ordering a phone from listing to enquiry, for Before and ideally After. If you'd rather not, I can fall back on the case-study playthrough, which uses a simulated cursor over stills and looks less real.

### Decisions
4. **Format:** 4:5 main plus 16:9 cut, as recommended?
5. **The first prompt:** the case study labels its rebuild prompt "illustrative". If you still have the real one, send it. Otherwise I'd adapt it to mention the end-to-end flow:
   > `/ui-design-with-mm` Rebuild the Sun King smartphones page and the end-to-end flow of ordering a phone in Figma. Same 7 sections, same order. Copy verbatim from the live page. Every repeated part a component.
   
   Since it isn't word for word, the video should carry a small "prompt shortened" note. The redesign scene can use your real words from the prompt log.
6. **Interface:** I'd rebuild the Claude screen from your screenshot so it stays razor sharp when zoomed. It would be a faithful copy rather than a live capture. If you want a true capture, record yourself typing the prompt in the app without sending it. Your screenshot shows Sonnet 5.5 as the model, so tell me if the label should change.
7. **Music:** do you have a track? If not, I'd leave it silent with subtle UI sounds (typing, click, stamp), and you can add a licensed track from LinkedIn or CapCut. I won't add music I can't confirm is licensed.

---

## 6. Keeping the claims honest

Viewers will take the numbers at face value, so these stay accurate on screen:

- **"Simulated shoppers" appears next to the score.** No real customer took part, and Valideity's own report says so. A bare "76 → 86" would imply real user results.
- **It's your own product stamping your own work.** Valideity is founder-led, so the logo could read as outside certification. I'd write "Tested with Valideity" beside the stamp and avoid wording like "Validated" or "Certified".
- **Comparing Before with Before.** The 76 is your Figma rebuild, not Sun King's live page, so the video should say "rebuilt original".
- **Not implying Sun King commissioned this.** I found no line on the case-study page that says whether it was commissioned. If it wasn't, add "Independent concept" to the end card. Please confirm.
- **Details left to the case study:** task completion went from 10 of 10 to 9 of 10, and the After screens had small copy changes after testing (including "Pay small small"). Neither fits in 50 seconds. The page already covers the post-test changes, and the "Full case study" link points there.
- **"One prompt" is a framing device.** The redesign took 10 core prompts over about 2.5 hours, plus 16 for polish, so I wouldn't say "one prompt" over the results. It only appears over the first scene.

---

## 7. How it gets built

1. **Scenes in HTML and CSS,** one timeline with the camera moves defined once, plus framing for each size. This is the same family of approach as the earlier portfolio animations.
2. **Rendered frame by frame,** then encoded with ffmpeg, so the motion doesn't stutter.
3. **A low-resolution timing draft first,** for your feedback on pace and order before any polish.
4. **Final files** in `videos/sun-king/`, with a poster frame for each. Nothing is committed or posted unless you say so.

**Round order:** you answer section 5 → timing draft → your notes → opener wipe and polish → final renders in each size.
