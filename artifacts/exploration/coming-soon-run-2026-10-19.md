# Coming-soon pages — 19 October 2026

Status: implemented and verified locally; ready for review.
Mode: scoped edit to the original static portfolio. Redesign remains on hold.
Primary method: ui-design-with-mm. Pace: Auto, within the requested coming-soon work.
Output: working HTML/CSS/JS preview; no publishing authorized.

## Confirmed scope and source

- Apply to every project without available content or a case study.
- Work grid thumbnail gets a Coming soon tag and a real preview-page link.
- Preview uses normal case-study structure through the cover, followed by a clear
  Coming soon block. No invented project details, claims, or completion dates.
- Use noindex until meaningful case-study content is ready; exclude these pages
  from the sitemap and allow crawling so the noindex tag can be read.
- Existing fonts, palette, shared header/footer, search, filters, grid/list view,
  pagination, completed pages, homepage, and About are preserved.

Source inspected: EXPLORATION_PLAN.md, README.md, ROADMAP.md, project knowledge,
js/data.js, js/work.js, my-work.html, css/work.css, css/case-study.css, existing
cancel-flow/speech-to-order drafts, robots.txt, and sitemap.xml.

Current source inventory: first eight Work cards are static; filtering/pagination
uses buildCardEl in js/work.js. Unlinked entries are currently dim noninteractive
cards, inferred as coming soon from absence of a link. Draft pages already have
noindex but contain incomplete media/unreviewed text. Completed entries carry
shipped/building/concept status; preserve those meanings.

## Content gaps

Most unfinished entries lack supplied imagery and approved role/scope summaries.
Keep the existing brand-name tile as an explicitly labelled preview placeholder;
do not borrow another project's screenshot or repeat unverified draft claims.
Add optional verified preview-content fields for real summaries/media later.

## Reuse and new pieces

Reuse: Work card, case hero/metadata, wrap, shared header/footer, existing typography
and palette. New variants already requested in the plan: linked ComingSoonCard,
ProjectPreview template, ComingSoonBlock, and not-found/recovery state.
References were read in this conversation: component library/states, token structure,
color system, source fidelity, visual quality, output-code, and slop checklist.
No new visual-reference composition, icon set, raster generation, or Figma output.

## Verification and delivery

- All 18 pending entries have unique preview routes; the nine original links remain intact.
- Three existing owner-confirmed scope descriptions are reused from ROADMAP.md.
  Other summaries/roles are not invented; optional details stay hidden when absent.
- Shared preview template has a static noindex/follow tag and is outside the sitemap.
  Google Search Central's block-indexing documentation was checked; crawling remains
  allowed so the tag can be read. No Search Console action or publication occurred.
- Existing draft files, homepage, About, header code, and completed cases are untouched.
- 13 automated tests pass, including pending-link semantics, safe route lookup,
  tentative metadata omission, original links and project-motion regressions.
- 31 real browser size/view combinations passed (11 preview layouts, 20 grid/list
  layouts), spanning 320–1920px and breakpoint edges. Width was read back each time;
  inactive-tab resizing attempts were discarded. No page overflow or pending-card
  internal clipping remained.
- Search, empty-result recovery, and pagination were exercised. Page two had eight
  links and seven tagged pending entries. Long-name pending rows now reflow in list
  view instead of clipping or becoming square on mobile.
- Case previews with confirmed metadata, tentative metadata, known scope, no scope,
  and invalid IDs were inspected. Missing artwork remains explicitly labelled.
- Body contrast 6.54:1, ink/paper 17.07:1, cover note 10.47:1; back hover 5.44:1.
  New actions have 44px minimum heights. Shared fonts/layout were retained.
- Source diff: only requested availability/preview states and the affected Work
  variants changed. Static first-page cards retain their source content/order.
  Responsive view-toggle labels now remain accessible when mobile text is hidden.
- Kept patterns: existing collection grid, existing hatch for labelled placeholders,
  and availability labels. No new decorative illustration or invented evidence.
- Code/context record: docs/coming-soon-pages.md. Local preview port: 5512.
- Physical-device/screen-reader output and real pending-project media remain
  unverified because those assets have not been supplied. No Figma output claimed.
