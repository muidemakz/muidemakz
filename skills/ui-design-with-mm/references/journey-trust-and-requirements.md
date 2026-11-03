# Journey, trust, and product requirements

Read this during research for new builds and when an edit affects a workflow, data lifecycle, or user-facing service guarantee. Use it to prevent screen-first reasoning. Do not treat it as permission to invent product policy or add scope.

## Research the work users actually do

- Map first use and return use separately. Identify the recurring job, what context the user supplies each time, and what should persist between sessions.
- Identify the product's working object and source of truth: for example, a saved document, project, case, or session. Find how users choose, replace, duplicate, or recover it, and what happens when they want to switch to an older item or start fresh.
- Trace the full journey from entry through preparation, primary decisions, review/editing, completion, and the next repeat session. Capture meaningful alternatives and failure/recovery paths, not every hypothetical edge case.
- Use direct competitors for category behavior and adjacent products for relevant task patterns. Choose references by the step being studied, not by category match alone. A document converter or PDF service such as iLovePDF can be relevant to file intake or conversion research without being a direct competitor. Treat its patterns as evidence to evaluate, not as a design to copy.
- For each reference, record the specific task it informs, direct source, observation, inference, possible application, and what should not transfer. Separate published claims from observed interface behavior and from your own inference.
- Use user-provided workflow descriptions as first-person evidence. If a consequential lifecycle rule remains unclear, ask one focused question or route a concrete assumption through approval before designing dependent behavior.

## Include trust and service states

For the agreed scope, account for the states that shape user confidence and recovery:

- What information or action is required, why it is needed, and what the user can do if they cannot provide it.
- What the system is doing during parsing, generation, saving, syncing, or export; show progress only when it is real, and say what remains available while waiting.
- Whether the user's work is saved, where it is kept, whether it can be changed, and what happens on exit, timeout, deletion, or return, when those policies are known.
- Empty, no-result, validation, partial-success, unavailable-service, and error states that affect the core task; explain the next useful action and provide recovery where possible.
- Consequential edits, generated claims, or exports that require review or confirmation.

Do not invent retention periods, encryption claims, accuracy guarantees, completion times, or backend capabilities. Distinguish a designed interface state from a verified service guarantee. If the brief is silent, record the gap and use the choice layer when it affects user trust or product behavior.

## Capture nonfunctional requirements

Extract stated requirements and identify only the missing constraints that materially affect the experience. Common areas include accessibility, performance, reliability and recovery, privacy and retention, security, supported devices/browsers, localization, offline behavior, and data volume. Do not add every category by default.

For each relevant requirement, record:

| Requirement and source | User-visible consequence | Design or content response | How it will be checked |
| --- | --- | --- | --- |
| A real brief, brand, policy, or approved assumption | What the user should understand or be able to do | The relevant state, control, copy, or interaction | A practical verification, or mark it unverified |

If the requirement is purely technical, preserve it as a constraint without inventing interface. If a required behavior depends on unavailable backend capability, label the prototype behavior and the service dependency clearly.

## Reduce cognitive load without hiding essentials

- Give each stage one primary outcome and each decision state one primary decision. Group related details and keep secondary actions visually subordinate.
- Show progress when the sequence is meaningful. Use a count only when the total is known; otherwise show the current stage without fabricated totals or false precision.
- Present enough context for the current choice, then let users reveal deeper rationale, source material, history, or advanced settings on demand.
- Keep the next step, undo or recovery route, and decision-critical evidence findable. Progressive disclosure must not conceal required confirmation, accessibility controls, privacy information, or safety-relevant context.

Before visual direction work, summarize the journey and relevant requirements in an evidence ledger. Distinguish user-confirmed facts, observed research, product inferences, approved assumptions, and unresolved questions. Use only what affects the authorized scope.
