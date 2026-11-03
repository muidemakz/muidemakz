# Form controls

Read when a design contains a checkbox, radio, toggle, checklist, stepper, segmented control, select, chip, slider or similar. When recreating a source, measure the source's controls instead (see [source fidelity](source-fidelity.md)) and use this file only for what the source does not show.

## Shared rules

- **Hit area.** The tappable area is at least 48 by 48 px by default, even when the visible control is smaller. The label is part of the target: the whole row selects. The user's `theme.md` may set a different value. A value below 44 px is stated before use, and nothing goes below 24 by 24 px, the WCAG 2.2 minimum. Accessibility checks apply whatever the theme says.
- **Sizes.** Pick the visible size once and use it for every control of that family: checkbox and radio the same size (20 or 24 px), toggle track 44 by 24 with a 20 px thumb inset 2 px. Sizes come from spacing variables, radii from radius variables, colors from color variables.
- **Alignment.** The control and the first line of its label share a center line. For labels that wrap, align the control to the first line, not the middle of the block. The gap between control and label is one spacing step, the same everywhere. Measure centering errors and fix them; do not leave them as "close".
- **State must not rely on color alone.** Checked has a mark, selected has a fill and a ring, on and off differ in thumb position as well as color.
- **Contrast.** The control's boundary against its background is at least 3:1, and label text meets the normal text ratio.
- **Focus.** A 2 px focus ring, offset 2 px, from the focus token, visible on keyboard focus.
- **Icons are instances.** A check mark or dash is an icon instance, never a typed character.
- **One system.** Corner radius, stroke width, check weight and motion timing follow one rule across the file. A rounded checkbox next to a sharp radio is a defect.

## Per control

- **Checkbox.** Square, radius about a quarter of its size, 1.5 to 2 px border at rest. Checked: filled, with a check. Indeterminate: filled, with a dash. Use a checkbox, not a toggle, for choices that apply only after a submit.
- **Radio.** Circle. Selected: the ring stays and an inner dot about half the diameter sits centered. A group has a visible label, vertical rows with equal gaps, and exactly one selected unless none is a valid answer. Do not use a radio for a single yes or no.
- **Toggle.** Only for settings that take effect immediately. The label states the setting, not the action. The thumb travels with a short timed ease from a motion variable. Off must be visibly different from disabled.
- **Checklist.** Each row is control, label and optional description. Rows have the same height (at least the hit area), the same padding and a consistent divider or gap. "Select all" uses the indeterminate state when only some are selected.
- **Stepper (quantity).** Both buttons meet the hit area, the value is centered, minus is disabled at the minimum or turns into a remove control where the product defines it. The value change is animated by a motion variable.
- **Segmented control and chips.** Equal segment widths unless content requires otherwise, a clear selected fill, labels that do not truncate.
- **Select.** Matches text-input height, padding and radius, with a chevron icon instance. Do not assume it matches an input in a source; measure it.
- **Slider.** The thumb meets the hit area, with a visible value and a step or value readout.

## Construction

- **One component, real parts.** A control is a single component whose parts are real, named layers inside an Auto Layout frame: for a radio, a ring (an ellipse with a stroke), a dot (an ellipse), and the label. A control assembled from loose, ungrouped shapes placed by hand on the canvas is a defect, as is any part that is a free-drawn vector.
- **Use native shapes for geometry.** Circles, squares and rounded rectangles are ellipse and rectangle nodes with fills, strokes and corner radius bound to variables. Do not trace a circle or a check with the pen tool or flatten it to an outline.
- **Name every layer** by its role (Ring, Dot, Label, Track, Thumb). Default names such as Ellipse 12 or Rectangle 4 inside a component are a defect.
- **State changes by variant,** not by hiding and showing loose layers: the Dot's visibility or fill is driven by the Checked variant property.
- **Hit area.** The component's frame, not its visible shape, carries the hit area.

## Build and readback

Build each control as one component, with Auto Layout and variants for state and checked value, and the label as a text property. Use the same component wherever it appears, including inside rows and forms. Variants sit in a component set with at least 24 px between them.

Read back and report, for each control component: visible size, hit area, center-line offset between control and label (zero), gap, layer names, and the state set. A control that fails any of these is a defect, not a note.

<!-- figma-short:start -->
**Form controls (short form).** For a checkbox, radio, toggle, checklist, stepper, segmented control, select, chip, or slider. When recreating a source, measure the source's controls instead.

- **Hit area:** at least 48 by 48 px by default, with the label part of the target. The user's theme may set another value; below 44 is stated before use, and nothing goes below 24 by 24.
- **Size and alignment:** one visible size per control family (checkbox and radio the same, 20 or 24 px; toggle track 44 by 24 with a 20 px thumb inset 2 px), from variables. The control and the first line of its label share a center line; the gap is one spacing step. Measure centering and fix errors.
- **State is never color alone:** checked has a mark, selected has a fill and a ring, on and off differ in thumb position. The control's edge meets 3:1 contrast; focus is a 2 px ring offset 2 px from the focus token. Check marks are icon instances.
- **One system:** corner radius, stroke, check weight, and motion timing follow one rule across the file.
- **Per control:** checkbox is square with a checked fill and an indeterminate dash, and is used for choices that apply after a submit. Radio is a circle with a centered dot about half its diameter; a group has a visible label, equal gaps, and one selected unless none is valid. Toggle is only for settings that take effect immediately, labelled with the setting, and off differs from disabled. Checklist rows share height, padding, and dividers, and "select all" uses the indeterminate state. A quantity stepper has two buttons that meet the hit area, a centered value, minus disabled at the minimum or becoming remove, and an animated value change. Select matches input height and radius with a chevron icon instance; measure it, never assume it matches an input.
- **Construction:** one component of real, named parts in an Auto Layout frame (a radio is Ring, Dot, and Label). A control assembled from loose ungrouped shapes or free-drawn vectors is a defect, as are default layer names. Geometry uses native ellipse and rectangle nodes with bound fills, strokes, and radii. State changes by variant, not by showing and hiding layers, and the component frame carries the hit area.
- **Readback** for each control: visible size, hit area, center-line offset (zero), gap, layer names, and the state set. Any failure is a defect.
<!-- figma-short:end -->
