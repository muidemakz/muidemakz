# Muidemakz Portfolio

Excellent Makanju's portfolio — plain HTML, CSS and JavaScript, with no build step.

Career and social-content working files live in the separate `Excellent Makanju Work` folder. See [working folders](WORKSPACES.md) for their locations and archive records.

## Local preview

Serve this directory over HTTP and open the local URL. For example:

```sh
python -m http.server 5500 --bind 127.0.0.1
```

## Pages and content

- `index.html`: homepage, rotating Product role headline and five-card project reel.
- `about.html`: positioning, expertise and experience ledger.
- `my-work.html`: complete project catalogue with the existing search, category filters, grid/list toggle and pagination.
- `wrapped.html`: year-in-review stories and project links.
- Published case-study links: Omnione, Fundall, Teesas, Omnibiz empty/preorder states, Coreloops, Cardtonic, Raven Pay, VENX and Valideity.
- Coming-soon previews: the 18 unfinished entries use `project-preview.html?project=<slug>`, with visible Work-card tags and `noindex, follow` on the preview template.
- Draft source files: `omnibiz-speech-to-order.html` and `cancel-flow.html` remain intact, unlinked from Work and excluded from search indexing. Their Work entries lead to coming-soon previews instead of exposing unreviewed draft content.

`js/data.js` holds `PROJECTS`, `PROJECT_CATEGORIES` and `EXPERIENCE_YEARS`.
The first eight `PROJECTS` entries must match the static cards in `my-work.html`;
JavaScript preserves that markup on first load, then rebuilds it when a filter or
page changes. All archive entries remain available. Year and category links from
Wrapped continue to work through `?year=` and `?category=`.

The homepage reel is separate markup in `index.html`. Update its progress labels,
card links, captions and image references together. Keep the role rotation intact.

## Existing design

Shared chrome and tokens live in `css/style.css`; page styles live in `work.css`,
`wrapped.css`, `about.css` and `case-study.css`. About intentionally retains its
existing visual language. Existing styles and interaction scripts stay intact;
`css/case-media.css` and `js/case-media.js` add the reviewed media previews.
`js/header.js` writes the shared header synchronously.

Do not pair `.wrap` with a class that sets a padding shorthand; use top/bottom
padding independently so its side padding remains intact.

## Case-study workflow

Use an existing case study's markup and the current `css/case-study.css` components.
Keep `.case-quicknav` outside the hero with a `.wrap` inside it, matching
`js/case-quicknav.js`. Link complete case studies through `PROJECTS`, add their sitemap
entry, and cross-link them through existing related-work cards. Unfinished entries
use the shared noindex preview, not the draft page. See [coming-soon workflow](docs/coming-soon-pages.md)
for preview content, confirmed fields, and publication checks.

Verify ownership, scope, shipping status and outcomes against source material.
An ecosystem's scale is context, not a feature's adoption metric. Simulated AI
results are Predicted; real-participant results are Measured. Planned capabilities
must not be described as implemented.

## Remaining evidence gaps

- Speech-to-Order still needs its real screenshot assets and the analytics capture
  documenting the period, cohort and definition behind the reported 35% speed
  improvement. The CV describes assistant reframing and the voice module as separate
  efforts; the result belongs to the voice module. Keep the draft unlinked and noindex.
- Valideity's pricing-flow case uses original 27 September 2026 captures. Its
  recorded Predicted sequence is 53% → 52% → 94%, with one persona and five
  sessions per run. Some historical screenshots are compact 480px captures;
  full-resolution exports of all three score/findings reports and a matching
  Measured test would strengthen the evidence. The supplied new logo is used
  in the banner/cover; the historical app screenshots retain their original branding.
- Entries with `confirmed: false` still need their dates/scope verified. Wrapped
  editorial highlights also need verification before strengthening claims.
- The ignored `muidemakz-site/` export and any portable single-file bundle are
  separate snapshots; regenerate them only when requested.
