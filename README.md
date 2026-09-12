# Muidemakz Portfolio

Excellent Makanju's portfolio site — plain HTML/CSS/JS, no build step, no framework.

## Running it locally

There's no build process — but opening the HTML files directly (`file://`) will break
relative asset loading in some browsers, so serve the folder instead:

```bash
npx http-server -p 5500 .
```

Then open `http://localhost:5500`.

(A `.claude/launch.json` is already set up for this if you're using Claude Code's preview tools.)

## Pages

| File | What it is |
|---|---|
| `index.html` | Homepage — brutalist name-slab hero with the year-by-year "Experience" hover interaction |
| `wrapped.html` | Year-in-review page — one card per year (giant year number, role, defining project, stat, lesson), a "Play Year in Review" Stories-style slide breakdown, and a Playground-styled shelf of that year's projects (each links to its case study or the filtered Work page) — with prev/next between years |
| `my-work.html` | Work grid — search, category/year filter chips (multi-select, live), grid/list toggle |
| `about.html` | About page — bio, expertise, tools, full experience history, education (still on the original softer style — see Design system below) |
| `fundall.html` | Case study page for the Fundall project (the only one with a full write-up so far), content matched section-for-section against the live Figma Site |

Every page shares `css/style.css` (tokens, header, footer, homepage hero) plus its own
stylesheet (`work.css`, `wrapped.css`, `about.css`, `case-study.css`).

### Design system

The site is mid-transition between two visual languages:

- **Brutalist** (current) — thick black borders, hard offset drop-shadows, JetBrains Mono
  for labels/nav/meta, bold uppercase Helvetica for headlines, orange accent. Lives in the
  `--ink-hard`, `--paper-hard`, `--font-mono`, `--font-hard` tokens in `css/style.css`, and
  drives the header, footer, homepage, Work page, Fundall, and Wrapped.
- **Original** (about.html only) — Baloo 2 / Instrument Serif / Inter, the older `--ink`/
  `--paper`/`--font-display`/`--font-body` tokens. About's header and footer were switched to
  the brutalist chrome for consistency, but its own body sections are untouched — restyling
  About is its own future pass.

A shared `.wrap` class (`max-width` + side padding, defined in `css/style.css`) keeps content
from stretching edge-to-edge on wide screens. **Gotcha:** never combine `.wrap` with a class
that sets the `padding` shorthand — it'll zero out the left/right padding `.wrap` just set. Use
`padding-top`/`padding-bottom` on the paired class instead.

## Content — where to edit things

**Almost everything content-related lives in [`js/data.js`](js/data.js).** Update this file
(or ask Claude to) instead of touching the HTML/JS logic:

- `EXPERIENCE_YEARS` — drives the homepage's year-hover hero *and* wrapped.html (2020–2026).
  Each entry has `company`, `role`, `tags` (skills shown in the hover overlay), `thumbs`
  (filmstrip/showcase entries — `image: null` renders as a plain placeholder until a real
  screenshot is added), and `project`/`stat`/`statLabel`/`lesson` (the wrapped.html card
  content — these are editorial highlights, not resume facts, so they haven't been fact-checked
  the way the rest of this file has; verify before treating them as final).
- `PROJECT_CATEGORIES` — the six discipline tags used by the Work page's Category filter
  (UI Design, UX Design, Creative Design, Animation, Presentation, Illustration). Also what
  wrapped.html's category chips are built from (cross-referenced against `PROJECTS` per year).
- `PROJECTS` — one entry per card in the Work grid. `year` and `categories` drive filtering
  (the Work page reads both `?year=` and `?category=` from the URL on load). `link` (currently
  only set on Fundall) points a card at its own case study page instead of the generic
  placeholder. Entries marked `confirmed: false` are best-guesses pulled from the live site,
  not verified against the resume — correct these whenever you have the real details.

Both arrays are sourced from `Excellent_Makanju_SeniorPD_Resume.pdf` (most recent resume) —
re-check them if the resume changes.

## Adding a new case study

1. Copy `fundall.html` and `css/case-study.css`'s markup pattern for a new `<project>.html`.
2. Add `link: "<project>.html"` to that project's entry in `PROJECTS` (`js/data.js`) — its
   Work-grid card will then link there instead of opening the generic project page.

## The downloadable single-file bundle

Because Work/About/etc. are separate HTML files with relative `css/`/`js/` links, they can't
be shared as one portable file as-is. When a self-contained shareable copy is needed (e.g. to
paste into another tool or send someone without hosting it), Claude can bundle everything —
fonts embedded as base64, all pages combined into one file with client-side view-switching —
on request. That bundle is a snapshot, not a live copy: re-generate it after making changes
you want reflected — it currently predates the brutalist redesign, so it'll need a fresh
build before it's shared again.

## Known gaps

- Only Fundall has a real case study; other Work-grid cards open a lightweight generic page
  (name/year/category) until they're written up.
- Several `PROJECTS` entries (Raven Pay, VENX, Crazy Ludo, Safari City, UX Toolkit, Omnione)
  have placeholder years/categories — not resume-verified.
- No real project screenshots yet — all thumbnails/mockups/case-study screens are plain
  bordered placeholders (`image: null` in the data, or a static diagonal-stripe box in
  fundall.html/wrapped.html).
- About page still uses the original (pre-brutalist) visual style — see "Design system" above.
- Fundall's live Figma Site content has three sections all labeled "Information Architecture"
  (one is really about wireframes, the third leads straight into the Screens gallery) and a
  boilerplate line ("I adopted a 4-step human-centered design process...") reused verbatim
  under headers it doesn't apply to — both read as unedited placeholders on the live site.
  fundall.html reproduces the real section content but renames the third "Information
  Architecture" header to "Screens" and drops the misapplied boilerplate line; worth fixing at
  the source (the Figma Site) if you want the two to match exactly.
- Fundall's "Other Projects" links point to real `PROJECTS` entries (Raven Pay, Traction Apps
  Wallet, VENX) rather than the live site's own linked projects there, two of which (Madame FC,
  Vèloce) aren't real Muidemakz work — likely unreplaced template filler on the live site.
