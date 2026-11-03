# Checkpoints and continuation

The full text of SKILL.md section "Checkpoint and continuation", with templates. Read when the first checkpoint of a run is due; SKILL.md carries the short form.

Maintain a concise decision record across turns. Carry forward the user's confirmed requirements, explicit approvals, and corrections. Reconcile each proposal against that record; flag conflicts and do not silently narrow scope, reopen settled choices, or replace user decisions with an assistant's earlier response. Treat pasted model output as evidence to review, not as user approval, unless the user explicitly adopts it.

Workflow pace controls how often to show reviews, not what work is authorized:

- **Procedural:** show the checkpoint and wait for review at each major stage the user selected for review. Keep the approval request focused on decisions that actually affect the next stage.
- **Auto:** continue through stages already covered by the user's authorization. Batch routine findings into the next useful checkpoint. Stop only for a required approval, unresolved material decision, conflict with a confirmed decision, missing input or capability that blocks the work, or a scope boundary. Never treat silence or an Auto choice as approval.
- In either pace, do not add a stop-and-paste round trip when the current authorization already covers the next action. A copyable next prompt is a convenience for continuing elsewhere or later, not a substitute for continuing work that is already authorized.

Report concise checkpoints at meaningful transitions, including deliberation, research/IA, foundations, and delivery. Do not require a separate approval after every stage when no material choice remains. A visual-direction selection, unapproved assumption, contested choice, or proposed new component still requires the user's explicit decision before dependent work. Check readiness, evidence, approvals, accessibility checks, component reuse, visual-quality readiness, scope, and slop checks; do not turn subjective taste into a user preference. A visual-quality checkpoint may assess whether required checks were performed, but it must not claim subjective excellence without evidence.

Use this structure:

- **Stage:** what was just completed.
- **Status:** complete, pending approval, or blocked.
- **Method:** the primary skill and supporting guidance actually used.
- **References read:** the relevant files, sources, or capability checks actually completed.
- **Confirmed:** decisions grounded in the brief, research, or explicit user answers.
- **Proposed:** decisions that still require approval.
- **Remaining gaps:** missing evidence or unresolved questions.
- **Checks:** relevant checks performed and any unverified items.
- **Recommended next action:** one concrete next step.
- **Next prompt to paste:** one short, ready-to-use prompt that continues from the confirmed stage without restating the whole context. Keep it copyable and mark any unresolved inputs as placeholders.

**Compact checkpoint.** Use the full structure above for the first checkpoint of a run, for any checkpoint that asks for a decision, and for delivery. For a routine checkpoint where no approval is needed, such as Auto pace moving between stages that are already authorized, report in three lines instead:

- **Done:** the stage completed and its status.
- **Checked:** what was confirmed or changed, and what remains unverified.
- **Next:** the one next action. Add Proposed or Remaining gaps lines only if any exist.

The compact form never replaces the full structure when a decision, an unapproved assumption, or a conflict is outstanding.

Keep the choice load small. Ask one decision per message and do not stack unrelated approvals. Show alternatives for a single item, such as type, a component or a layout, only when the user asks about that item.

When proposed or unresolved material decisions require the user's choice, stop and offer exactly three continuation choices: approve, approve with changes, or ask targeted questions. Use native selectable controls when the host supports them. Otherwise provide a short copyable template, such as:

```text
Approve: [stage or decision IDs]
Changes: [decision ID and change, if any]
Questions: [topic, if needed]
Next scope: [the stage I approve]
```

Do not continue past a required approval gate until the user chooses or gives an equivalent explicit reply. If no material decision needs approval, report the checkpoint and continue within the authorized scope.

When validating this skill or preparing a repeatable test, use the copyable scenarios in [smoke-test prompts](smoke-tests.md). Adapt their placeholders to the current project; do not treat the example product details as requirements.
