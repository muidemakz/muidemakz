# Figma naming

Read when creating anything in a Figma file and again at readback. Names say what a thing is and what it is for, not how it looks or how it was made.

## Rules for every name

- **Case.** By default: Title Case for pages, frames, components, component properties and layers; lowercase words for variant property values; lowercase with slashes for variables. The user's stored preferences or the file's existing convention override this default.
- **Match the file first.** When editing an existing file, read its naming conventions (case, separators, level prefixes) and follow them. Propose a rename only through the choice layer, and rename only what you created.
- **Role, not appearance.** "Primary button", not "Yellow button". "Surface / default", not "light gray".
- **No defaults, no versions.** Names such as Frame 12, Group 3, Rectangle 4, Vector, and words such as final, v2, new, copy or temp are defects.
- **One style.** Use one case and one separator for each kind of name, across the whole file. Do not mix Title Case and kebab-case for the same kind of thing.
- **Slash for hierarchy.** Use a slash to group in the layer panel, the assets panel and variables, and no more than three levels.
- **No numbers for ordering inside components.** A numbered layer (Item 1, Item 2) is acceptable only when the order is the meaning, such as steps.

## By kind

- **Pages.** Group by purpose: Cover, Foundations, Components, Patterns, then screens by flow. When a before/after comparison is kept, name them "Screens — BEFORE" and "Screens — AFTER".
- **Frames and screens.** The width is the standard device or breakpoint width, chosen by the frame-size order in build rules, not the width of a stray source capture. "Page name — Viewport width", for example "EZ 3 product — Desktop 1440" and "EZ 3 product — Mobile 390". Sections inside a screen are named for their purpose (Hero, Pricing, Enquiry form).
- **Components.** The level, then the name, singular: "Atoms / Button", "Molecules / Form field", "Organisms / Header", "Templates / Product page". The component set carries the name; variants carry only their properties.
- **Variant properties.** Property names are Title Case and short (Type, Size, State, Checked, Breakpoint) in one consistent order, and values are lowercase words (size=md, state=hover, breakpoint=desktop). Boolean properties read as questions or switches (Has icon, Show badge). Text properties are named for their content (Label, Price). Instance-swap properties are named for the slot (Icon, Image).
- **Layers inside components.** Structural names by role: Container, Content, Header, Actions, Label, Icon, Track, Thumb. A frame that holds a group is named for what it holds (Price block, Spec list). Helper or hidden layers get a leading underscore so they sort apart.
- **Variables.** Collections: Primitives, Semantic (and Component only when used). Primitive names carry the value scale (blue / 500). Semantic names carry the role, not the color: color / text / primary, color / surface / default, space / 4, radius / md, type / body / size, motion / duration / base. Modes are named for what they switch (Light, Dark, Desktop, Mobile). When a Code Layer exists, semantic names map one to one onto the code tokens (color / text / primary ↔ --color-text-primary).
- **Styles.** Text: Heading / H1, Body / Medium. Effects and grids follow the same slash pattern.
- **Prototype flows.** Named for the user's goal: Buy outright, Enquire, Pay later.
- **Annotations and notes.** One frame named Notes per page, listing assumptions and open questions.
- **Placeholders and assumptions.** Name them so they can be found and replaced: "Logo placeholder", "Price (assumption)".

## Readback

Report counts from the file: layers, frames and components with default or version names; case or separator mismatches within a kind; components outside the level-prefixed naming; variant properties out of the agreed order; variables named for appearance instead of role; and placeholders not named as such. Fix them, or list them with a reason.


## Variant names

Every variant of a component set has the same properties in the same order, for example State=default, State=focused, State=disabled. Never leave a default "Property 2" or "Property 3", or stray values copied from the component name, inside a variant name. Spell values consistently and check them for typos. A set whose variants carry different property sets is a defect.

## Flows on the canvas

Lay out every flow so it can be read at a glance, like a storyboard.

- **Flow title.** A text layer above the flow, left-aligned with its first frame and set in a heading text style. Name it for the flow's goal, such as "Transactions" or "Buy outright", the same name as the flow's section and prototype.
- **Frame names.** Name each top-level screen frame for what the screen is, such as "Transactions", in the order a user meets them. Do not rely on numbers or on duplicate suffixes such as "Transactions 2" or "Copy of Transactions"; rename a duplicate as soon as it is made.
- **State frames.** Name a state of a screen for its parent and the state, for example "Transactions — Filters open" and "Transactions — Export menu". Place them beside or below the parent in order, with equal gaps.
- **Section.** Put the flow's title and frames in one Section named like the title, so the flow moves and is found as one unit.
- **Order and spacing.** Frames run left to right in the order of the journey, share a top edge, and have equal gaps from a spacing variable.
- **Canvas labels are not part of the design.** Choose title color for contrast against the page's canvas color (light text on a dark canvas). Use the file's canvas-label variable if it has one; otherwise record the color used. Do not bind them to the product's design tokens.
- **Readback.** Every flow has a title and a Section, every top-level frame has a clear name with no duplicate suffix, and state frames are named for their parent and state. Fix any that are not, or list them with a reason.

<!-- figma-short:start -->
**Figma naming (short form).** Names say what a thing is and what it is for, not how it looks or how it was made.

- **Case by default:** Title Case for pages, frames, components, component properties, and layers; lowercase words for variant property values; lowercase with slashes for variables. The user's stored preferences or the file's own convention override this.
- **Match the file first.** In an existing file, follow its conventions, propose a rename only through the choice layer, and rename only what you created.
- **Role, not appearance** ("Primary button", not "Yellow button"). **No defaults and no versions:** Frame 12, Group 3, Rectangle 4, Vector, and words such as final, v2, new, copy, or temp are defects. Use one case and one separator per kind of name, a slash for hierarchy up to three levels, and no numbers for ordering inside components unless order is the meaning.
- **By kind:** pages by purpose (Cover, Foundations, Components, Patterns, then screens by flow; "Screens — BEFORE" and "Screens — AFTER" for a kept comparison). Screens as "Page name — Viewport width". Components with their level and a singular name ("Atoms / Button", "Molecules / Form field"). Layers by role (Container, Content, Header, Actions, Label, Icon), a frame holding a group named for what it holds, helper layers with a leading underscore. Variables with primitives carrying the value scale and semantic names carrying the role, not the color (color / text / primary), and modes named for what they switch. Text styles as Heading / H1, Body / Medium. Prototype flows named for the user's goal. One Notes frame per page for assumptions and open questions. Placeholders and assumptions named so they can be found.
- **Flows on the canvas:** each flow has a title text layer (heading style, left-aligned with its first frame) and its frames sit in a Section named like the title. Top-level screen frames are named for the screen ("Transactions") in journey order, never with a duplicate suffix such as "Transactions 2"; state frames are named for their parent and state ("Transactions — Filters open") and sit beside or below the parent with equal gaps. Titles are canvas labels, not design: choose their color for contrast with the page canvas, and do not bind them to product tokens.
- **Variant names:** every variant of a set has the same properties in the same order (State=default, State=focused, State=disabled). Never leave a default "Property 2", or stray values copied from the component name, in a variant. Spell values consistently and check for typos.
- **Readback:** count default or version names, flows without a title, frames with duplicate suffixes, case or separator mismatches within a kind, components missing a level prefix, variant properties out of order or inconsistent, variables named for appearance, and placeholders not named as such. Fix them or list them with a reason.
<!-- figma-short:end -->
