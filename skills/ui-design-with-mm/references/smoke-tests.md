# Smoke-test prompts

Use these prompts in fresh sessions with disposable project files. Replace bracketed text with real inputs. The expected result is a behavior check, not a claim that the skill has produced a good design.

## 1. New UI from an uploaded PRD

```text
Use $ui-design-with-mm with the attached PRD. Treat this as a new build. Do not design screens yet. Summarize what the PRD establishes, identify gaps, and ask whether I want targeted questions or reasonable assumptions. End with a short copyable next prompt.
```

Check that the assistant reads the PRD as evidence, avoids inventing requirements, detects new-build mode, and waits at the approval gate.

## 2. Edit a named product

```text
Use $ui-design-with-mm to change the primary color in [named product]. Inspect the existing Figma file or codebase first, including tokens, components, icons, illustrations, and affected states. Preserve unrelated conventions and report the exact contrast checks before changing anything.
```

Check that discovery is scoped to the edit and that existing components and tokens are reused.

## 3. Ambiguous mode

```text
Use $ui-design-with-mm for this request: [brief request that could be either a new build or an edit]. Ask exactly one question to determine whether this is a new build or an edit, then wait.
```

Check that the assistant asks one mode question instead of starting discovery or design.

## 4. Assumptions path

```text
Use $ui-design-with-mm for [brief]. Proceed on reasonable assumptions. List every material assumption, state the specific effect of each, and wait for my explicit approval before research, foundations, or design. Provide native selectable choices when available and a copyable fallback.
```

Check that choosing the assumptions path does not itself approve the assumptions.

## 5. Accessibility conflict

```text
Use $ui-design-with-mm for [brief]. I want to keep this low-contrast brand text exactly as supplied. Check it against WCAG 2.2 AA and show compliant alternatives through the choice layer. Do not treat my preference as permission to ship an inaccessible result.
```

Check that accessibility remains mandatory and that the choice layer presents compliant alternatives.

## 6. Human feedback and preferences

```text
Use $ui-design-with-mm for [named product]. My explicit feedback is: “[feedback].” Apply it only to [scope], explain the preference entry you would save, and tell me the private file location. Do not change shared skill files or infer a broader preference.
```

Check that only explicit human feedback is recorded, with scope and conditions preserved.

## 7. Figma delivery

```text
Use $ui-design-with-mm to deliver [approved scope] to the connected Figma file. Inspect the file and libraries before designing. Reuse fitting components, icons, and illustrations; propose gaps through the choice layer; bind semantic tokens; read back variables, aliases, bindings, components, and nodes; and report exact locations plus any visibility checks you could not perform.
```

Check that a read-only or incomplete MCP connection is disclosed and that a token table is not treated as proof of Figma variables.

## 8. Working code or artifact

```text
Use $ui-design-with-mm to build [approved scope] in the existing codebase. Inspect the component library, variants, icon components, illustration assets, tokens, and conventions first. Reuse what fits, propose missing reusable components through the choice layer, render at [target sizes], exercise the affected flow, and report accessibility checks and exact file locations.
```

Check that the code branch follows the same methodology and does not introduce a framework or one-off component without justification and approval.

## 9. First polished visual output

```text
Use $ui-design-with-mm for [approved brief]. Before the first polished visual output, present 2–3 evidence-based visual directions with tradeoffs and one recommendation. Wait for my selection or approval. After I choose, produce production-quality output with deliberate typography, hierarchy, composition, responsive behavior, reusable components, and meaningful states. Do not produce lo-fi or generic placeholder styling unless I explicitly request it.
```

Check that the direction gate occurs before visual output and that the result is not labeled as a finished design until the visual-quality checks are complete.

## 10. Pasted assistant output is not approval

```text
Here is a previous assistant response: [paste response]. Use it as evidence to review, not as approval. Separate confirmed user decisions from proposed decisions, identify any provenance errors, and provide the next copyable prompt. Do not continue past an approval gate.
```

Check that quoted model output cannot silently approve assumptions or directions.

## 11. Read-only or unavailable capability

```text
Use $ui-design-with-mm for [approved scope], but the current [Figma connection / preferences file / browser preview] may be read-only or unavailable. Attempt the relevant check, report the exact limitation, and do not claim that the deliverable or preference save succeeded if it did not.
```

Check that capability limits are reported instead of being hidden behind a simulated success.

## 12. Justified existing pattern

```text
Use $ui-design-with-mm to update [named product] while keeping its existing [font/card/pattern]. Inspect the evidence and user task, state why the pattern is justified or what conflicts with accessibility or the brief, and preserve it when it remains valid. Do not remove it merely because it appears on the slop checklist.
```

Check that the checklist is an avoid-by-default heuristic, not a blanket ban.

## 13. Required reference unavailable

Make one reference unreadable first, for example by renaming `references/token-structure.md`.

```text
Use $ui-design-with-mm for [approved scope]. If a reference this stage requires is unavailable, stop and name the exact file. Do not substitute another design skill, improvise the missing content, or begin research, foundations, components, or screen design without it.
```

Check that the missing file is named and that the run blocks rather than falling back to another design workflow, improvising the reference's content, or claiming the method was applied.

## 14. Genuine visual research

```text
Use $ui-design-with-mm for [approved brief]. Before visual direction or foundations, complete a small research set covering relevant product/interaction evidence, accessibility or design-system evidence, and publicly accessible visual references where useful. Use direct links and separate each source's observation, inference, proposed application, and what will not be copied. Do not browse every showcase platform by default or treat showcase work as proof of UX effectiveness.
```

Check that research is shown before design, includes useful public references when relevant, and distinguishes inspiration from product facts.

## 15. Repeat-use workflow and trust requirements

```text
Use $ui-design-with-mm for this repeat-use product: [brief]. Before screen design, map first-use and returning-user journeys, identify the persistent work object and source of truth, and show how users can resume, switch to an earlier item, or provide a new one. Research direct competitors and adjacent tools relevant to actual workflow steps; explain why each source fits. Extract stated nonfunctional requirements, identify material gaps without inventing policy, and account for truthful input, loading, progress, error, recovery, editing, and completion states. Keep one primary task or decision in focus at a time. Separate observations, inferences, confirmed decisions, and assumptions.
```

Check that adjacent references are selected by task rather than competitor status, returning-user behavior is researched, nonfunctional requirements are traced to consequences and checks, progress is truthful, and no retention or service guarantee is invented.

## 16. Exact-page recreation and responsive resizing

```text
Use $ui-design-with-mm to recreate this existing page in Figma: [URL]. Treat the live page as the visual source. Capture it at the relevant viewport widths, inspect existing components and assets, and build editable Auto Layout components and screen sections. Match the source's typography and control dimensions from observable evidence; mark anything that cannot be verified. Make the layout reflow appropriately when the frame width changes, including breakpoint-specific variants where needed. Before handoff, compare the source and Figma at narrow, breakpoint, and wide widths, and report measured button heights, font families, overflow/wrapping checks, and any remaining differences. Do not call responsive QA passed just because separate desktop and mobile frames exist.
```

Check that the assistant preserves the source capture through comparison, uses Auto Layout and responsive sizing, verifies typography against source evidence, tests intermediate widths, and does not overstate pixel or responsive fidelity.

## 17. Actual visual direction gate

```text
Use $ui-design-with-mm for [approved brief]. Before creating any polished screen, present 2–3 actual visual systems—not merely layout variations—with typography, color behavior, type scale, spacing, composition, surface and component treatment, icon and illustration approach, motion, excluded patterns, the one idea that makes each recognizable, evidence, and tradeoffs. Recommend one and wait for my explicit choice.
```

Check that the assistant stops before polished output and that the directions describe a coherent visual language.

## 18. Workflow pace and approval continuity

```text
Use $ui-design-with-mm for [project]. I have already approved [confirmed decisions] and authorized [scope]. Use Auto pace. Carry those decisions forward, flag any conflict with them, and continue through work already covered by my authorization. Do not ask me to paste a continuation prompt or approve a stage when no unresolved material decision remains. Stop only at an actual approval gate or blocker, and give me a short copyable choice if you need my decision.
```

Check that Auto reduces routine approval round trips without treating it as permission to expand scope or approve unresolved assumptions. Also confirm that selecting Procedural produces stage-by-stage reviews and that neither pace reopens settled decisions.

## 19. Existing product context continuity

```text
Use $ui-design-with-mm to update [named product] using the existing Figma file or codebase and this project context record: [path]. Read the record first, inspect the live source, and reconcile any drift before editing. Report the existing screens, components, tokens, states, responsive rules, and source locations that affect [feature]. After the change, update the context record with exact locations and mark anything unverified.
```

Check that the assistant reconstructs the existing product before editing, treats the live source as authoritative, preserves unrelated conventions, and updates a project-scoped record without turning the run into an audit or storing the data in personal preferences.

## 20. Figma Code Layer output

```text
Use $ui-design-with-mm to deliver [approved scope] as an editable Figma Design plus a Figma Code Layer, if the current connection supports creating and inspecting Code Layers. Read the Code Layer reference, inspect the existing file and context record, preserve the editable frames, reuse components and semantic tokens, implement the applicable states, and test narrow, breakpoint, intermediate, wide, and very wide widths. Report whether the layer is a prototype or production-connected code, the source of truth, actual readback, extraction support, and limitations. If the capability is unavailable, stop and disclose it rather than claiming a runnable layer.
```

Check that Code Layers add an output branch without bypassing research, visual direction, component reuse, accessibility, responsive, or slop checks.

## 21. Missing brand icon or illustration system

```text
Use $ui-design-with-mm for [brief] where no brand icon set or illustration system is supplied. Inspect the product evidence first. Propose Phosphor as the default icon-library assumption and propose one illustration source or style from the approved asset options. State the weight, size grid, corner treatment, illustration style, token mapping, licensing, and tradeoffs. Wait for approval before creating or mixing assets.
```

Check that Phosphor is proposed only when no brand set exists, that one illustration style is selected, that licensing and attribution are checked, and that loose vectors or mixed illustration styles are not used as filler.


## 22. Learn an existing product

```text
Use $ui-design-with-mm to learn [named product]. Sources: [Figma URL / repo path]. Scope: [whole product / named areas]. Read only. Do not change the file or code. Write the context record under [path], with a short summary first. Label each entry observed, inferred, or unverified, list what you did not read, and do not grade the design or recommend fixes.
```

Check that it asks for sources, scope, and record location once, changes nothing in the product, labels inferences, reports coverage gaps, avoids evaluation language, and offers the CLAUDE.md/AGENTS.md pointer without editing it unasked.

## 23. Edit or extend using a learned record

```text
Use $ui-design-with-mm to [add a new flow / change X] in [named product]. The context record is at [path]. Read the summary first, verify it against the live source, follow the product's observed patterns, and send any deviation through the choice layer. Update the record afterwards.
```

Check that the new work matches the observed layout, component, and state conventions, that stale or unverified entries are confirmed against the live source, and that the record is updated with exact locations.


## 24. Match a live page (source fidelity)

```text
Use $ui-design-with-mm to build the Figma screens for this existing page: [URL]. Before designing, capture the page at [widths] and give me the source inventory: the ordered section list with exact headings, the measured height, padding, radius, and border of every control type (inputs, selects, buttons) at each width, the typography by role, the grid or column layout of each section, every block that appears more than once, the icon source, and every image and background by its real URL (lazy-loaded pages keep a placeholder in src, so do not read src), plus the verbatim text of every section. Do not add, remove, rename, or reorder anything without asking. After building, give me the source diff: sections matched, missing, invented, renamed, or reordered, and source against built values for each control.
```

Check that the inventory exists before any screen, that repeated blocks are listed and built once as a component with instances, that controls are measured separately (a select is not assumed to match an input), that icons come from the page's own SVGs or a library and never from text characters, that the diff reports mismatches instead of saying "matches", and that anything it could not measure is marked unverified. Check also that any claim from an earlier report or audit is re-measured and not carried forward. Check also that the header and footer are inventoried element by element (not by height alone), that each is one component used at every occurrence, and that the measurement conditions (inner width, device pixel ratio, scroll, state) are recorded. Check also that every source image is listed by its real URL (not a lazy-load placeholder), imported at natural resolution where the user has the rights, and that no gray placeholder stands in for a source image. Check also that each section was compared with a side-by-side render of the source at the same width and none was marked matched on its heading alone, and that work was not left as an open defect merely because it was large. Check also that lazy-loaded images are handled in order (read the data attributes, scroll only as a fallback and re-count, verify every URL), that no visible image is left as a placeholder, and that the built copy matches the source text verbatim, including numbers and units.

## 25. Breakpoints and composition in Figma

```text
Use $ui-design-with-mm to build [page] in Figma where the layout changes between desktop, tablet, and mobile. Build the sections as component sets with a breakpoint property, nest any component that belongs inside another (for example a details disclosure inside a product card), and define interactions on the component. Then show me by readback that changing the breakpoint property on one instance switches the layout, that the card's details slot is filled, and how many interactions are wired per instance.
```

Check that separate per-breakpoint frames are not presented as responsive behavior, that no component slot is left empty with its child placed beside it, that the same interaction is not duplicated across many instances, and that icons inside components are icon instances and not text glyphs.


## 26. Figma component construction

```text
Use $ui-design-with-mm to create [components] in Figma, including variants for [states or sizes]. Every component must use Auto Layout, and every component set must be laid out with Auto Layout and at least 24px between variants. Then read back each component and component set and report whether Auto Layout is on and the measured gap between variants.
```

Check that no component is built from manually positioned layers, that each component set has a measured gap of at least 24px in both directions with padding at the set edge, and that any exception is reported as a defect and not skipped.


## 27. Compact checkpoint and conditional reads

```text
Use $ui-design-with-mm for [project]. I have approved [stages] and authorized [scope]. Use Auto pace. Report routine checkpoints in the compact form, and use the full structure only for the first checkpoint, a decision, and delivery. State which reference files you read for each stage, and say whether you re-read any file that was already in context.
```

Check that routine checkpoints are three lines, that decision and delivery checkpoints use the full structure, that only the output file for the selected target was read, and that no file already in context was read a second time.


## 28. Binding coverage

```text
Use $ui-design-with-mm to build [components and screens] in Figma. Before handoff, run a binding-coverage audit across everything you created or changed and report counts of unbound values: text nodes without a text style or font variables, and fills, strokes, radii, spacing values, and effects without a variable or style. List each exception and its reason.
```

Check that the audit covers every node and not a sample, that the counts are measured, that a value merely selected on a node is counted as unbound, and that a nonzero result is reported as a defect and not as passed.


## 29. Compose from inspirations

```text
Use $ui-design-with-mm to design [screen]. I like these elements: [nav from reference A], [card from reference B], [accordion from reference C]. Apply my theme from theme.md. Before building, give me the composition ledger: for each element, the source, what I like, what you carry, what you leave behind, and how it maps to my tokens. Wait for my approval.
```

Check that the ledger comes before any build, that elements are adapted into the theme and not copied, that nothing from a reference's artwork or copy is reproduced, that a color taken from a reference is treated as a candidate and contrast-checked, and that a consistency pass across sources is reported at delivery.

## 30. Learn my theme

```text
Use $ui-design-with-mm to learn my theme from [my earlier Figma file / repo]. Draft theme.md. Label each entry observed, inferred, or unverified, and ask me to correct it. Do not change the source.
```

Check that it is read-only on the source, that entries recur across several pieces of work, that they are labelled, and that the result is saved to the private theme file and not written into the shared skill.


## 31. Delivery gate and theme override

```text
Use $ui-design-with-mm to design [screen] in my theme from theme.md. My theme uses [yellow] for primary actions, while research shows competitors use [blue]. Before building, tell me what is happening: what the research shows, what my theme specifies, and which governs. Then build it, run the DOM measuring script on [reference page] if a browser is available, and finish with the delivery gate: each of the 16 items ticked with evidence or listed as an open defect.
```

Check that the theme-over-convention override is stated in one line before it is applied, that the yellow is contrast-checked and not assumed, that usability findings from research still govern behavior, that the gate covers all 16 items including states, copy provenance, and the slop checklist, and that anything not measured is marked unverified.


## 32. Five-level build with per-level binding

```text
Use $ui-design-with-mm to build [flow] in Figma. Build in five levels, in order: atoms, molecules, organisms, templates, pages. After each level, run the binding audit and show me the counts; do not start the next level until the current one reports zero unbound text, fills, strokes, radii, spacing, and effects. Before trusting a zero, create a deliberately unbound test node and show me that the audit flags it. At the end, read back what each level contains and report any loose frame, detached instance, or hand-built section.
```

Check that each level contains only instances of the levels below it, that a page contains template instances and not loose frames, that the audit counts are shown per level, that the self-test node is flagged, and that a nonzero count blocks the next level instead of being reported at the end.


## 33. Direction previews for an existing product

```text
Use $ui-design-with-mm. I have an existing [site or app] at [URL or path] and I want a better visual direction for it. Do not change my files. Show me the current design, audit it, then give me options I can choose from.
```

Check that the assistant captures the current design and shows it first as Current, audits what works and what does not, locks what must not change, and offers at most three options with one recommended and pre-selected. Check that each option is shown as a real preview of the key screen using the product's own content (no invented numbers, no copy borrowed from another deliverable), that the options differ in layout and not only in styling, that it asks one decision in one message, and that it creates no full screens and changes none of the owner's files until a direction is chosen. Check that type, style and component alternatives are not shown unless asked.
