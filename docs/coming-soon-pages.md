# Coming-soon case studies

Last verified: 19 October 2026. Original site; no redesign dependency.
Branch: `codex/coming-soon-pages`. Working code preview, not published.
Method: `ui-design-with-mm`, scoped to the existing components and styling.

## Current implementation

The nine completed/available case-study links are unchanged. Eighteen unfinished
catalogue entries now have `status: "coming-soon"`, a stable `slug`, and a real link
to `project-preview.html?project=<slug>`. One reusable template handles every route.
The status describes case-study availability, not the underlying product's shipping status.

- `js/data.js`: catalogue and optional owner-confirmed preview content.
- `js/work.js`: Coming soon tag and keyboard-accessible preview links.
- `css/work.css`: active preview styling and readable pending rows in list view.
- `project-preview.html`: standard header, case hero/cover, ComingSoonBlock, footer.
- `js/project-preview.js`: safe lookup, text rendering, optional media, facts, recovery.
- `css/project-preview.css`: semantic aliases to the original ink/paper/accent tokens.
- `js/wrapped.js`: labels upcoming case-study destinations accurately.

Shared header code, homepage, About, completed case studies, original draft files,
existing media, filtering/search, pagination, and default first-eight static cards
are preserved. Grid/list buttons now retain accessible names when mobile labels hide.

## Content provenance

Keep the normal case-study opening and cover, then show the Coming soon block.
Missing artwork is explicitly labelled; brand-name text is a placeholder, not a
fabricated logo or screenshot. Do not borrow another project's cover as evidence.

Three short summaries/scopes come from owner-confirmed decisions already recorded
in ROADMAP.md: Fundall V2 is a landing-page redesign; Fortnoto Marketing Studio is
the marketing website; Fortnoto Branding & Design System covers brand identity and
the design system. No outcomes, metrics, role claims, deadlines, or draft research
have been inferred. Other entries await their real content.

`confirmed: false` dates/categories remain in the legacy catalogue but are omitted
from the preview's metadata. Individual `preview` fields may be added when their
contents are confirmed, even if an unrelated year is still unresolved.

Optional fields, added only with real source material:

```js
preview: {
  summary: "Owner-confirmed project summary",
  role: "Owner-confirmed role",
  scope: ["Owner-confirmed contribution"],
  image: "images/project/actual-cover.png",
  imageAlt: "Description of the actual cover",
  // video: "videos/project/actual-preview.mp4",
  mediaCaption: "Owner-confirmed caption"
}
```

Missing role/scope sections stay hidden. Cover errors return to the labelled
placeholder. Missing or invalid project IDs show a recovery page with Work/contact
links. JavaScript-disabled visitors retain the coming-soon message and useful links.

## Indexing and publishing

Every preview query has a static `noindex, follow` tag. The route stays outside
`sitemap.xml`. `robots.txt` continues to allow crawling, so crawlers can see that tag.
This follows [Google's noindex guidance](https://developers.google.com/search/docs/crawling-indexing/block-indexing).

To publish a finished case study: verify content and assets, change the catalogue
link to the real page, replace the availability status with the appropriate
confirmed status, remove noindex from the finished page, and add its sitemap entry.
Retain/forward previously shared preview links when making that later transition.
Draft source files are preserved for that writing work, not linked as finished cases.

## Verification record

Automated: `node --test tests/coming-soon.test.cjs tests/project-motion.test.cjs`.
Thirteen checks cover all eighteen preview routes, the nine unchanged case links,
missing/invalid IDs, tentative metadata, noindex/crawlability/sitemap behavior,
linked coming-soon card semantics, and existing project motion behavior.

Browser checks: 11 preview layouts at requested widths 320, 390, 419, 420, 421,
759, 760, 761, 1024, 1280, and 1920px; 20 Work checks covering grid/list at requested
widths 320, 390, 599, 600, 601, 899, 900, 901, 1280, and 1920px. No document overflow
or pending-card content clipping remained. The browser rounded several odd widths
up one pixel; actual innerWidth was checked. Earlier attempts to resize an inactive
tab did not change its width and were discarded, not counted as responsive checks.

Verified search results, no-result recovery, page-two pagination (eight links,
seven Coming soon tags), real metadata versus tentative-date omission, and invalid
preview recovery. Desktop/mobile screenshots were inspected in the active test tab.
Action heights measure 44px or more. New text contrast: muted copy 6.54:1 on paper;
ink/paper 17.07:1; cover notes 10.47:1 on ink; back-link hover 5.44:1.

Visual source comparison: original shared header/footer, fonts, palette, case hero,
and default first page retained. Approved differences are the availability label,
placeholder cover, post-cover status block, and pending-card interaction/list layout.
No new illustration or icon system; existing brand hatches/navigation are reused.

Kept patterns: the original repeated Work grid remains for browsing; the placeholder
cover reuses the existing diagonal hatch and clearly identifies missing artwork;
the status label is required availability information, not a decorative hero badge.
No new gradients, icons, arbitrary colors, animation, metrics, or outcome claims.

New repeated components: linked ComingSoonCard (18 data entries), ProjectPreview
template/ComingSoonBlock (one implementation reused by 18 routes), and recovery state.
Source styling is bounded by the existing `.wrap`; body copy is 16–18px, actions
are at least 44px high, and narrow layouts stack the status block and action links.

Media/content gaps are intentional and visible; physical hardware, screen-reader
output, and real media loading for these not-yet-supplied covers are unverified.
No publishing, push, or merge is included.
