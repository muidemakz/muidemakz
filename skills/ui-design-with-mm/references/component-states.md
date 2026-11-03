# Component state coverage

Read this reference before designing a screen or element. State coverage is part of the design deliverable, not a post-hoc polish pass.

## State inventory

For every interactive or status-bearing component, identify the states the product actually needs. Start with the component's resting state, then add only applicable states from this set:

- hover
- focus-visible and keyboard focus
- pressed or active
- selected
- disabled
- loading or pending
- success or completed
- error or invalid
- warning or needs attention
- empty or unavailable
- expanded and collapsed
- checked and unchecked
- current, visited, or unavailable navigation states

Do not create decorative variants that have no product meaning. If a state is not applicable, record that decision in the delivery note.

## Pattern-specific checks

- **Buttons and links:** preserve a visible focus treatment, distinguish disabled from enabled, show pending and success/error feedback when an action can take time or fail, and keep the label understandable in every width variant.
- **Cards:** define selected, dismissed, expanded, collapsed, unavailable, and error states when the card can be acted on, filtered, or disclosed. Do not rely on color alone.
- **Accordions and disclosure:** expose expanded/collapsed state to assistive technology, keep the control label stable, preserve reading order, and verify that content height grows rather than clipping.
- **Forms and fields:** cover empty, filled, focused, invalid, valid, disabled, and submission-pending behavior where relevant. Keep error text associated with the field and preserve the user's input when recovery allows.
- **Navigation, tabs, filters, and carousels:** show current and available items, provide a non-gesture control, and define what happens when an item is unavailable or the set is empty.
- **Selection and input controls (radio, checkbox, toggle, stepper, select):** how they are built, sized and aligned is set in [form controls](form-controls.md).
- **Form outcome messages:** a form shows its instruction or its confirmation, never both at once. A success state replaces the instruction, and any promised time (such as "within 24 hours") is sourced or marked open.
- **Async and transactional work:** design loading, retry, timeout, partial success, and failure recovery states. Never represent a simulated or unconnected action as a completed transaction.

## Responsive state behavior

States must remain understandable at narrow, intermediate, and wide widths. Define how labels wrap, icons and labels reflow, controls stack, disclosure content grows, and type or icon sizes change at approved breakpoints. Do not hide a state merely to preserve a fixed height or desktop composition.

## Verification

In Figma, use reusable variants, component properties, variables, and supported prototype interactions. Read back the actual variants and inspect the key transitions. In code, exercise the state transitions and keyboard/focus behavior in the rendered artifact. Check reduced motion, contrast, touch targets, and error recovery for the states that apply. Report unverified states rather than claiming complete coverage.

<!-- figma-short:start -->
**Component states (short form).** State coverage is part of the deliverable, not polish.

- For every interactive or status-bearing component, start from its resting state and add only the states the product needs: hover, focus-visible, pressed, selected, disabled, loading, success, error, warning, empty or unavailable, expanded and collapsed, checked and unchecked, and current or visited. Create no variant without a product meaning, and record any state judged not applicable.
- **Buttons and links:** visible focus, disabled distinct from enabled, pending and success or error feedback when an action can take time or fail. **Cards:** selected, expanded, unavailable, and error states when acted on, never by color alone. **Disclosure:** expanded and collapsed state exposed to assistive technology and content that grows without clipping. **Forms:** empty, filled, focused, invalid, valid, disabled, and pending; error text tied to its field; the user's input kept on recovery. **Navigation, tabs, filters, carousels:** current and available items, a control that is not a gesture, and the empty case.
- **Selection and input controls** (radio, checkbox, toggle, stepper, select) are built and sized as set out in form controls.
- **Form outcome messages:** a form shows its instruction or its confirmation, never both at once. A success state replaces the instruction, and a promised time such as "within 24 hours" is sourced or marked open.
- **Async and transactional work:** design loading, retry, timeout, partial success, and failure recovery. Never show a simulated action as a completed transaction.
- **Responsive:** states stay understandable at narrow, intermediate, and wide widths; labels wrap, icons and labels reflow, controls stack, and no state is hidden to keep a fixed height.
- **Verify** with reusable variants, component properties, variables, and supported prototype interactions; read back the variants, check contrast, touch targets, reduced motion, and error recovery for the states that apply, and report unverified states.
<!-- figma-short:end -->
