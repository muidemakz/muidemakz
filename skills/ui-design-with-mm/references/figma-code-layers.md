# Figma Code Layers

Read this reference only when the user selects a Figma Code Layer or the Figma host exposes that capability. Code Layers are an output surface for interactive, responsive exploration; they do not replace the shared research, direction, foundation, component, accessibility, or slop gates.

## Capability gate

Confirm that the current Figma connection can create, run, inspect, and, where required, extract a Code Layer. If the host can only read or import it, disclose the limitation and do not claim a runnable Code Layer. Keep the editable Figma Design frames as the canonical design output unless the user explicitly makes the codebase the source of truth.

## Before creating the layer

- Inspect the existing Figma file, libraries, variables, components, variants, icons, illustrations, and prototype connections.
- Read the project context record and reconcile it with the live file.
- Use the approved visual direction and semantic tokens. Reuse existing components and assets; propose gaps through the choice layer.
- Define the purpose: interaction proof, responsive exploration, design-to-code comparison, or a handoff experiment. Label the layer as prototype or production-connected code.

## Build and test

- Preserve the original editable frames; do not flatten or replace them with a Code Layer.
- Implement the approved interactions and applicable states: focus, hover or pointer, pressed, selected, disabled, loading, success, error, empty, disclosure, reduced motion, and recovery.
- Test arbitrary widths, including narrow, just before and after each breakpoint, intermediate, wide, and very wide. Verify wrapping of labels, icon-label pairs, controls, navigation, cards, and content; verify intrinsic height, max-width regions, touch targets, and no horizontal overflow.
- Keep keyboard and non-gesture alternatives available.
- Use the same semantic token and component names where the Code Layer is intended to map back to Figma or a codebase.

## Readback and delivery

Read back the Code Layer's actual node, source, dependencies, props, state coverage, and supported extraction path. Compare it with the approved Figma frames and record what is intentionally different. If the layer can be extracted back to editable Figma layers, inspect the extracted result; extraction is a verification step, not automatic proof of fidelity.

The delivery note must state:

- whether the layer is a prototype or production-connected code
- the Figma node and source location
- the source of truth for design and implementation
- dependencies, licenses, and assets used
- widths and states tested
- what was extracted or read back
- limitations or capabilities the host could not verify
