# UI Design with MM

A portable UI design skill by Muidemakz: deliberation, research, foundations/tokens, then Figma, code, or artifact output. Ground decisions in the brief, research, or approved assumptions.

## Install and use

Copy the whole folder, including `references/`. No package installation or Impeccable dependency is required.

| Host | Personal installation | Invocation |
| --- | --- | --- |
| Claude Code | `~/.claude/skills/ui-design-with-mm/` | `/ui-design-with-mm` followed by the brief |
| Codex | `~/.agents/skills/ui-design-with-mm/` | Select the skill or mention `$ui-design-with-mm` |
| Claude chat | ZIP the top-level skill folder; upload through Customize > Skills and enable it | Ask Claude to use UI Design with MM |
| ChatGPT desktop | Add the skill through the Skills surface or use a project/repository skill | Select it or mention `@ui-design-with-mm` when supported |
| ChatGPT web/Work and other assistants | Use the host's skill or plugin import path | Tool access and selectable controls depend on the host |
| Other compatible assistants | Follow that host's Agent Skills installation instructions | Select the skill by name; tool support varies |

On Windows, `~` means your user profile directory. Project installs use `.claude/skills/` for Claude Code or `.agents/skills/` for Codex. Refresh discovery or restart if needed.

For Figma output, the assistant needs an MCP connection capable of creating and inspecting the required variables, components, screens, and interactions. Code/artifacts need editing and preview capabilities. Research needs web access or accessible current sources.

A plain skill folder supplies instructions and references only. It does not supply Figma MCP access, browser access, or native selectable controls. ChatGPT web/Work distribution may require a plugin or host-specific import; the shareable ZIP is not a universal installer.

`ui-design-with-mm` is the primary method when it is selected. Personal preference skills such as `excellent-design-motion` must not silently replace it. Supporting motion, Figma, accessibility, component-system, Impeccable, or anti-slop guidance may be used when relevant and available; the run receipt and delivery note should name what was actually used. If a reference required by the current stage is unavailable, the assistant must name that file and stop rather than improvise it or substitute another design workflow.

Installation references: [Claude Code](https://code.claude.com/docs/en/skills), [Claude custom skills](https://support.claude.com/en/articles/12512198-how-to-create-custom-skills), [Codex](https://learn.chatgpt.com/docs/build-skills), checked 2026-10-14. Other assistants can receive the instructions/references manually; portability does not supply missing tools.

## Personal preferences, theme, and sharing

**Simplest option:** keep `preferences.md` beside `SKILL.md` in a personal local install. Start empty; each adopter records their own feedback. The creator's private history is not included.

The skill reads it each run, appends human feedback, and initializes a missing file from `references/preferences-template.md`. You can view, edit, or clear it. Preserve it during updates.

`preferences.md` and `theme.md` are Git-ignored. Ignore rules do not protect already tracked files or filter ZIPs: omit personal files when sharing; each install initializes its own. The supplied ZIP omits preferences.

**Your own theme:** if you design by taking elements from several inspirations and rebuilding them in your own style, record that style in a private `theme.md` beside `SKILL.md` (the skill offers to create it from `references/theme-template.md`, or to draft it from your earlier work, for you to correct). It applies to your own work; a named product's brand takes precedence, and accessibility always applies. Like `preferences.md`, it is private, Git-ignored, and left out of the ZIP.

You can explicitly name another private file, particularly for a project install. Separate installs have separate histories; there is no sync. Cloud/artifact sessions cannot be assumed to persist device-local files. When saving is unavailable, the assistant offers an entry for you to save locally.

No preference collection or sending mechanism is included. The chosen assistant still processes what it reads; local storage does not mean offline inference. Preferences never waive accessibility; brand/research conflicts require a choice.

## Existing product context

For an existing product or codebase, keep a project-scoped context record near the work, such as `design-system-state/<product>.json`. It can map Figma pages and nodes, codebase paths, tokens, components, states, screens, flows, breakpoints, and known inconsistencies. The skill reads and verifies this record at the start of later edits and updates it after meaningful changes. The live Figma file or codebase remains authoritative; the record is a navigation aid, not an audit or a cross-tool source of truth. Do not put product context in `preferences.md`, the shared skill, or a public ZIP.

To have the skill read a whole product first, ask it to **learn** your Figma file or codebase. It is read-only: it changes nothing in the product and only writes the record, with a short summary and per-area files. Each entry is labelled observed, inferred, or unverified, and the record lists what was not read. It is not an audit and does not grade the design. A new session finds the record only if it is told where it is, so the skill offers to add a one-line pointer to your project's `CLAUDE.md` or `AGENTS.md`, and does so only with your approval. See [references/learn-existing-product.md](references/learn-existing-product.md).

## Test it

Use fresh sessions and a disposable project/Figma file. Copyable prompts for every scenario are in [references/smoke-tests.md](references/smoke-tests.md). Verify these behaviors:

| Scenario | Expected behavior |
| --- | --- |
| New UI from an uploaded PRD | Uses what the PRD answers; resolves only gaps; researches before tokens; produces the selected output. |
| "Change the primary color on my named product" | Scopes discovery/research to the edit; checks affected contrast and states; preserves unrelated work. |
| Ambiguous new build versus edit | Asks one mode question before proceeding. |
| Choose the assumptions path | Lists specific assumptions and waits for approval before acting on them. |
| Ask to keep low-contrast brand text | Flags failure and offers compliant alternatives; does not treat approval as a waiver. |
| Give product-specific design feedback | Appends only that human feedback with its scope; reads it next run; shared files remain unchanged. |
| Deliver to Figma | Reads variables/aliases/bindings back and provides exact locations; does not confuse a Foundations table with real variables. |
| Recreate a page responsively in Figma | Uses Auto Layout and Hug/Fill/constraints, checks narrow/breakpoint/wide widths, compares source typography and control bounds, and distinguishes fixed artboards from actual responsive behavior. |
| Request a working code/artifact prototype | Uses the same approved foundations; verifies the relevant interactions or clearly reports what could not be tested. |
| Use a read-only Figma connection or unwritable preferences file | Reports the specific limitation without pretending output or persistence succeeded. |
| Keep a justified existing font or card pattern | Assesses evidence and function instead of enforcing a stylistic ban. |
| A required reference is unavailable | Stops before design and names the exact missing file; does not improvise its content or fall back to another design skill. |
| Genuine visual research and direction | Uses a small relevant research set, including public visual references when useful, then presents actual visual systems before polished output. |
| Repeat-use workflow, trust, and NFR research | Maps first-use and returning-user paths, source-of-truth switching, task-adjacent references, truthful service states, and relevant explicit nonfunctional requirements before visual design. |
| Learn an existing Figma file or codebase | Asks sources, scope, and record location once; reads without changing anything; writes a summary plus area files with observed, inferred, and unverified labels; reports coverage gaps; does not grade or recommend fixes. |
| Edit or extend using a learned record | Reads the summary, verifies it against the live source, follows observed patterns, routes deviations through the choice layer, and updates the record. |
| Match a live page or URL | Records a source inventory (ordered sections, measured control metrics per control type, typography, icon source) before designing; does not add, remove, rename, or reorder without approval; ends with a source diff that reports mismatches and marks unmeasured items unverified. |
| Compact checkpoints and conditional reads | Routine Auto-pace checkpoints are three lines; decisions and delivery use the full structure; only the selected target's output file is read; files already in context are not re-read. |
| Binding coverage | Every text node, fill, stroke, radius, spacing, and effect is bound to a variable or style; the readback counts unbound values across everything created or changed and reports a nonzero count as a defect. |
| Figma component construction | Every component uses Auto Layout; every component set uses Auto Layout with at least 24px between variants; the readback reports measured values and lists any failures. |
| Breakpoints and composition in Figma | Builds sections as component sets with a breakpoint property that switch on one instance; nests child components into parent slots; defines interactions on the component; uses icon instances, never text glyphs. |
| Compose from inspirations in your own theme | Collects the elements you like from each reference, asks for a composition ledger approval before building, adapts structure and behavior into your theme tokens instead of copying, and reports a consistency pass across sources. |
| Five-level build with per-level binding | Builds atoms, molecules, organisms, templates, then pages; each level contains only instances of the levels below and no raw values; the binding audit must reach zero (and be shown to flag a test node) before the next level starts. |
| Delivery gate and theme override | Says what is happening before the theme overrides a convention; keeps accessibility and usability findings in force; ends with all 16 gate items ticked with evidence or listed as open defects. |
| Existing product context continuity | Reads and verifies a project-scoped context record, preserves the live Figma/codebase as authoritative, and updates the record after meaningful changes. |
| Figma Code Layer output | Capability-checks Code Layers, preserves editable Figma frames, tests states and widths, and reports source-of-truth and extraction limits. |
| Missing brand icon or illustration system | Proposes Phosphor and one illustration source through approval, then checks style consistency and licensing. |
| Procedural or Auto pace with prior approvals | Follows the selected review cadence, carries approved decisions forward, and avoids unnecessary stop-and-paste rounds without treating Auto as expanded authorization. |

Compare the same brief, assets, model/settings, target, and answers with and without the skill. Start with empty preferences. Review both using `references/slop-checklist.md`; have a human judge concrete differences.

Structural checks cannot establish design quality. Live Claude/Codex/Figma output tests and the paired comparison remain necessary before claiming those results. A short next prompt is useful when the user needs to continue in another chat or later; it should not become a required copy-and-paste step when the current authorization already covers the next action.

## Deferred and sources

Deferred: auditor/audit intent, cross-tool drift/source-of-truth platform work, team-scale auditing, expanded intents, preference sharing, and curated-list compilation. A project context record is supported as a continuity aid, and the learn intent can populate it; neither is the deferred audit or source-of-truth platform, because they record how a product is built and do not evaluate it. **The owner must supply the curated list** in `references/research-sources.md`.

Based on the handover spec and owner clarifications. Context checks draw on [Deonna's gist](https://gist.github.com/deonna/c94209289f9ba6df0fde35e21cfd21ec); its commands are excluded. Accessibility sources are in `references/color-system.md`.
