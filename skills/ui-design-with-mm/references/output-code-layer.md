# Output: Figma Design plus Code Layer

Read when the selected target is a Figma Code Layer. Shared rules for all targets are in [output targets](output-targets.md).

Read [Figma Code Layers](figma-code-layers.md) when this target is selected. Confirm that the current Figma connection can create, run, inspect, and, where required, extract a Code Layer. If it cannot, disclose the limitation and keep the editable Figma Design as the deliverable; do not claim a runnable layer.

1. Inspect the existing Figma file, libraries, variables, components, variants, icons, illustrations, screens, prototype connections, and the project context record before creating the layer. Reuse approved components and semantic tokens. Preserve the original editable design frames and state which artifact is the source of truth.
2. Define whether the layer is an interaction prototype, responsive exploration, design-to-code comparison, or production-connected implementation. Label that status in the delivery note. Do not silently treat a prototype as production code.
3. Implement the approved interactions and applicable states, including focus, hover or pointer, pressed, selected, disabled, loading, success, error, empty, disclosure, reduced motion, and recovery. Keep keyboard and non-gesture alternatives. Use the same component and token names where the layer maps to Figma or an existing codebase.
4. Test narrow, just before and after each breakpoint, intermediate, wide, and very wide widths. Confirm wrapping of labels, icon-label pairs, controls, navigation, cards, and content; intrinsic height; max-width regions; touch targets; and no horizontal overflow. Compare the layer with the approved Figma frames and record intentional differences.
5. Read back the actual Code Layer node, source, dependencies, props, state coverage, and extraction path. If extraction to editable Figma layers is supported, inspect the extracted result. Report what was verified, what remains unverified, and any asset or license limitations.

