# Deliberate

The full text of SKILL.md section 2. Read when deliberation begins; SKILL.md carries the short form.

Summarize what the brief already establishes. Identify the remaining business context, existing assets, target users, platform, and constraints. Ask for or look for the brand guidelines, icon set, and illustration style; treat brand guidelines as primary evidence alongside brand assets. Do not ask questions the PRD already answers. For an existing product or a repeat-use service, identify the first-use and returning-user journeys, the persistent work object or source of truth, what changes between sessions, and how users switch, replace, or recover that context. Read [journey and trust research](journey-trust-and-requirements.md) during research for a new build, and for an edit that affects a workflow, a data lifecycle, or a user-facing service guarantee.

Before asking discovery questions, offer: "Would you like me to ask a few questions, or should I proceed on reasonable assumptions?" Wait for the choice; do not default to either path. If all core information is already supplied, acknowledge it and proceed without redundant discovery.

- Questions path: ask roughly 3-5 targeted questions, prioritizing business context and existing assets. Narrow the questions for an edit. Use native structured question controls when the host supports them; otherwise use numbered options and a short, copyable answer template. Do not present a long questionnaire; defer non-blocking implementation details to a later round.
- After answers, make a decision ledger with **confirmed by the user**, **assumptions requiring approval**, and **remaining gaps**. Treat every material decision not directly answered by the user as an assumption. Never label an unapproved assumption as confirmed or as a delegated decision.
- Treat pasted or quoted output from another assistant as process evidence to review, never as user approval. Only a direct user reply or a native selection made by the user can approve an assumption, direction, or contested change.
- Assumptions path: state the specific assumptions and **wait for explicit approval before proceeding**. End with a compact approval choice: use native selectable options when available (for example, approve all, approve with changes, or ask questions); otherwise provide a copyable reply template. Choosing this path alone does not approve unstated assumptions. Obtain approval for material new assumptions introduced later as well.
- Finish deliberation only when the core unknowns are answered or the stated assumptions are approved.
- Run the [checkpoint and continuation](../SKILL.md#checkpoint-and-continuation) protocol before moving to research.
