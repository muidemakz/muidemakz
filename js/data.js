/**
 * Experience-by-year data that drives the homepage hero.
 * Sourced from Excellent_Makanju_SeniorPD_Resume.pdf (most recent resume).
 * Edit this file (or ask Claude to) whenever a role, project, or tag changes —
 * nothing else in the site needs to change for a content update.
 *
 * Several years have more than one concurrent role (e.g. Traction Apps ran
 * alongside Teesas Education through 2023–2024). Where that happens, the
 * most senior/primary role for that year leads the `company`/`role` string
 * and the rest show up as separate `thumbs` entries and tags.
 *
 * `thumbs[].image` is null until real screenshots are dropped in — they
 * render as plain colour blocks until then.
 */
/**
 * `project`, `stat`/`statLabel` and `lesson` power the wrapped.html year-in-
 * review page. They're editorial highlights (not resume line items), so
 * they haven't gone through the same fact-check as the rest of this file —
 * verify the numbers before treating them as final.
 */
const EXPERIENCE_YEARS = [
  {
    year: 2026,
    company: "OmniRetail (Omnibiz)",
    role: "Senior Product Designer",
    tags: ["Payments UX", "Design Systems", "AI Workflows"],
    project: "Fortnoto",
    stat: "3",
    statLabel: "products under one wallet layer",
    lesson: "The best payment UX is the one nobody has to think about.",
    thumbs: [
      { image: null, label: "OmniRetail / Omnibiz" },
      { image: null, label: "Fortnoto" }
    ]
  },
  {
    year: 2025,
    company: "OmniRetail (Omnibiz)",
    role: "Senior Product Designer",
    tags: ["Wallet & Credit UX", "Multi-Product SSO", "Design Systems"],
    project: "Omnipay SSO",
    stat: "150K+",
    statLabel: "retailers on the ecosystem I design for",
    lesson: "One sign-in decision rippled through every product we owned.",
    thumbs: [
      { image: null, label: "OmniRetail / Omnibiz" },
      { image: null, label: "Omnipay SSO" }
    ]
  },
  {
    year: 2024,
    company: "OmniRetail / Synarktech / Teesas Education",
    role: "Senior Product Designer & Design Manager",
    tags: ["Design Leadership", "AI Product Design", "EdTech"],
    project: "OmniBiz Retailer App",
    stat: "3",
    statLabel: "teams designed for in one year",
    lesson: "Managing designers taught me to defend decisions, not pixels.",
    thumbs: [
      { image: null, label: "OmniBiz Retailer App" },
      { image: null, label: "AlphaBuzz" },
      { image: null, label: "Teesas LMS v2.0" }
    ]
  },
  {
    year: 2023,
    company: "Traction Apps / Teesas Education",
    role: "Senior Product Designer & Lead Product Designer",
    tags: ["Fintech UX", "EMS Platform", "Design Systems"],
    project: "Traction Apps Wallet",
    stat: "$124M+",
    statLabel: "annual NMV on platforms I designed",
    lesson: "Trust is built in the error states, not the happy path.",
    thumbs: [
      { image: null, label: "Traction Apps Wallet" },
      { image: null, label: "Teesas LMS" }
    ]
  },
  {
    year: 2022,
    company: "Fundall / Traction Apps",
    role: "Product Designer & Senior Product Designer",
    tags: ["Fintech", "HRIS Dashboard", "POS & Wallet"],
    project: "Fundall — Loans & Salary Advance",
    stat: "4",
    statLabel: "step human-centered process, set here",
    lesson: "Lending UX is 10% flow and 90% making eligibility legible.",
    thumbs: [
      { image: null, label: "Fundall" },
      { image: null, label: "Traction Apps" }
    ]
  },
  {
    year: 2021,
    company: "Nomba (Formerly Kudi)",
    role: "Creative Designer",
    tags: ["Brand Design", "Agent Banking"],
    project: "Nomba Brand Campaigns",
    stat: "1",
    statLabel: "brand system across agent banking",
    lesson: "Brand work taught me speed; product work taught me consequence.",
    thumbs: [
      { image: null, label: "Nomba Brand Campaigns" }
    ]
  },
  {
    year: 2020,
    company: "Nomba (Formerly Kudi)",
    role: "Creative Designer",
    tags: ["Brand Design", "Go-to-Market"],
    project: "Safari City",
    stat: "2",
    statLabel: "years in creative before going product",
    lesson: "Craft first. Strategy is craft you can explain.",
    thumbs: [
      { image: null, label: "Nomba Brand Campaigns" }
    ]
  }
];

/**
 * Individual projects for the /my-work grid. Powers both the discipline
 * filter pills (categories, matching the Figma Gallery's own taxonomy) and
 * the year filter pills (derived from EXPERIENCE_YEARS).
 *
 * `confirmed: false` = year/category is a best guess from the live site,
 * not verified against the resume — correct these whenever you have the
 * real details, this is a one-file edit.
 */
const PROJECT_CATEGORIES = [
  "UI Design",
  "UX Design",
  "Creative Design",
  "Animation",
  "Presentation",
  "Illustration"
];

const PROJECTS = [
  { name: "Coreloops Documents Filter", year: 2026, categories: ["UI Design", "UX Design"], image: "images/coreloops/proposed-filter-modal.png", confirmed: true, link: "coreloops.html" },
  { name: "Cardtonic P2P Money Transfer", year: 2026, categories: ["UI Design", "UX Design"], image: "images/Cardtonic/00 · Cover.png", confirmed: true, link: "cardtonic.html" },
  { name: "Omnibiz Empty & Preorder States", year: 2024, categories: ["UX Design"], image: null, confirmed: true, link: "empty-state.html" },
  { name: "Cancel Flow Brief", year: 2026, categories: ["UX Design"], image: null, confirmed: true, link: "cancel-flow.html" },
  { name: "Fortnoto", year: 2026, categories: ["UI Design", "UX Design"], image: null, confirmed: true },
  { name: "OmniBiz Retailer App", year: 2025, categories: ["UI Design", "UX Design"], image: null, confirmed: true },
  { name: "Omnipay SSO", year: 2025, categories: ["UX Design"], image: null, confirmed: true },
  { name: "AlphaBuzz", year: 2024, categories: ["UI Design", "UX Design"], image: null, confirmed: true },
  { name: "Teesas LMS v2.0", year: 2024, categories: ["UI Design", "UX Design"], image: null, confirmed: true, link: "teesaslms.html" },
  { name: "Playhour", year: 2024, categories: ["UI Design", "Animation"], image: null, confirmed: true },
  { name: "Omnione Design System", year: 2024, categories: ["UI Design", "Presentation"], image: null, confirmed: true, link: "omnione.html" },
  { name: "Traction Apps Wallet", year: 2023, categories: ["UI Design", "UX Design"], image: null, confirmed: true },
  { name: "Traction Apps — Savings & Loan", year: 2023, categories: ["UI Design", "UX Design"], image: null, confirmed: true },
  { name: "Traction Apps — Ramp Website", year: 2023, categories: ["UI Design", "Presentation"], image: null, confirmed: true },
  { name: "Fundall — HR Platform (HRMS/HRPP)", year: 2022, categories: ["UI Design", "UX Design", "Presentation"], image: null, confirmed: true },
  { name: "Fundall — V2 Landing Page Relaunch", year: 2022, categories: ["UI Design", "Presentation"], image: null, confirmed: false },
  { name: "Fundall Brand Campaign", year: 2022, categories: ["Creative Design"], image: null, confirmed: false },
  { name: "Fortnoto — Marketing Studio", year: 2026, categories: ["UI Design", "Presentation"], image: null, confirmed: false },
  { name: "Fortnoto Branding & Design System", year: 2026, categories: ["Creative Design", "Presentation"], image: null, confirmed: false },
  { name: "Valideity Branding", year: 2026, categories: ["Creative Design"], image: null, confirmed: false },
  { name: "Raven Pay", year: 2024, categories: ["UI Design", "UX Design"], image: null, confirmed: true, link: "raven-pay.html" },
  { name: "Fundall", year: 2022, categories: ["UI Design", "UX Design", "Presentation"], image: "images/fundall/sign-in.png", confirmed: true, link: "fundall.html" },
  { name: "VENX", year: 2025, categories: ["UI Design", "UX Design"], image: null, confirmed: true, link: "venx.html" },
  { name: "Nomba Brand Campaigns", year: 2021, categories: ["Creative Design", "Illustration"], image: null, confirmed: true },
  { name: "Crazy Ludo", year: 2021, categories: ["Creative Design", "Animation"], image: null, confirmed: false },
  { name: "Safari City", year: 2020, categories: ["Illustration", "Animation"], image: null, confirmed: false },
  { name: "UX Toolkit", year: 2020, categories: ["Presentation"], image: null, confirmed: false }
];
