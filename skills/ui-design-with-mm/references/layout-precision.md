# Layout precision

Read when building any layout and again at readback. A design is not finished while anything is off by a pixel without a stated reason.

## Rules

- **Auto Layout does the aligning.** Use the frame's alignment, padding and gap settings, never manual nudging. Absolute-positioned children are limited to badges and overlays, and they are anchored with constraints.
- **Whole pixels.** Every x, y, width and height is a whole number unless the value is deliberately fractional and labelled. Text with automatic height is exempt.
- **One scale.** Padding, gaps and offsets come from the spacing variables. Equal siblings have equal gaps; a 15 next to a 16 is a defect.
- **Shared edges.** Items stacked in a column share one left edge (or one center axis). A heading, its body text and its button share the same left edge. Section content shares one left edge with every other section at each width.
- **Shared lines in a row.** Items in a row share a center line, or a text baseline when they are text of different sizes (a price and its unit). An icon beside multi-line text aligns to the first line.
- **Icons.** The glyph is centered in an icon box of fixed size, and the box is the same size everywhere that icon family is used.
- **Equal siblings.** Cards in a row have equal heights, and the action area sits at the same offset from the bottom of each.
- **Label and value groups.** A group such as Name, Email and Phone uses equal-width columns, or one column grid shared with the rows above and below it. Gaps between columns are equal, each column has one left edge for its label and value, and values share a baseline.
- **Media tiles.** Thumbnails and avatars in a row use one treatment: the same size, background, radius and padding. A tiled image next to an untiled one is a defect.
- **Card insets.** A card's contents use one inset on all four sides, and elements inside share the card's inset edge.
- **Margins and containers.** One max width and one gutter per breakpoint, used by every section. Nothing extends past the margin except a deliberate full-bleed element, which is labelled.
- **Optical exceptions.** A shape that needs optical alignment (a play triangle, a rounded icon) is allowed up to 1 px of offset, and the offset is stated in the file notes. No other exceptions.
- **Tolerance.** Zero pixels on shared edges and shared center lines at the same level of the same component or frame.

## Readback

Measure from the file, not by eye, and report counts:
1. Nodes with fractional x, y, width or height.
2. Column siblings whose left edges differ.
3. Row siblings whose center lines (or baselines) differ.
4. Equal siblings with unequal gaps or heights.
5. Children that extend beyond their parent's padding, other than labelled overlays.
6. Sections whose content left edge differs from the container's at any tested width.
7. Label and value groups whose column gaps are unequal or whose columns do not sit on a shared grid.
8. Media tiles in one row with differing size, background or radius.

Then zoom to the edges and joins of each section at 2x and check them visually. Fix every failure, or list it as a labelled optical exception.


## Alignment by role

Choose the alignment from the role of the content, never by habit or by the tool's default. A top-aligned row of uneven cells reads as unbalanced.

| Situation | Alignment |
| --- | --- |
| Table header cells and table body cells, single line | Center vertically. Every header cell in a row is the same height |
| A header or label that wraps | Fix it at the source: widen the column or shorten the label so it does not wrap, then align |
| Text columns, and number columns | Text left, numbers right, and the header matches its column |
| A control or icon beside one line of text | Center |
| A control or icon beside multi-line text | Top, aligned to the first line |
| A row of inputs with different helper or error text | Align the inputs to each other, not the containers that hold them |
| Actions in a card, dialog or form footer | Bottom, at the same offset in every card, and the primary action on one consistent side |
| Page columns of different height | Top |
| A single item alone in a wide space | Left, or centered only when the composition is deliberately symmetric |

Where none of these fits, state the alignment chosen and why.

## Container padding

A container that holds content has its own padding: one spacing step on all four sides, bound to a spacing variable. Zero padding is allowed only for deliberately edge-to-edge content and is stated. Nothing may touch a container's edge by accident. Apply this to cards, panels, tables, option lists, dialogs and form groups, and to every variant of a component.

Add to the readback: 9. Containers with zero padding that are not stated as edge-to-edge. 10. Rows or header cells of unequal height with top alignment.

<!-- figma-short:start -->
**Layout precision (short form).** A design is not finished while anything is off by a pixel without a stated reason.

- **Auto Layout does the aligning,** through the frame's alignment, padding, and gap settings, never manual nudging. Absolute children are limited to badges and overlays and are anchored with constraints.
- **Whole pixels:** every x, y, width, and height is a whole number unless labelled. **One scale:** padding, gaps, and offsets come from spacing variables, and equal siblings have equal gaps.
- **Shared edges and lines:** items in a column share a left edge or center axis, and a heading, its body, and its button share a left edge. Items in a row share a center line, or a baseline when they are text of different sizes. An icon beside multi-line text aligns to the first line. Section content shares one left edge across sections at each width.
- **Icons** are centered in a fixed-size box. **Equal siblings** such as cards have equal heights with their action areas at the same offset. **Containers:** one max width and gutter per breakpoint. A shape needing optical alignment may be offset by up to 1 px, stated in the file notes. Tolerance on shared edges and center lines is zero pixels.
- **Label and value groups** use equal-width columns or one shared grid, with equal column gaps. **Media tiles** in a row share size, background, and radius. **Card contents** use one inset on all four sides.
- **Alignment by role:** table header and body cells center vertically, with every header cell the same height; a header that wraps is fixed by widening the column or shortening the label. Text columns align left and number columns right, with the header matching. A control beside one line of text is centered; beside multi-line text it aligns to the first line. In a row of inputs with different helper text, align the inputs to each other. Actions in a card or footer align to the bottom at the same offset. Columns of different height align to the top.
- **Container padding:** a container that holds content has its own padding, one spacing step on all four sides, bound to a variable. Zero is allowed only for deliberate edge-to-edge content and is stated.
- **Readback, measured from the file:** fractional values; column siblings with different left edges; row siblings with different center lines; equal siblings with unequal gaps or heights; children beyond the parent's padding; section edges that differ by width; label groups off the grid; media tiles that differ; containers with zero padding; top-aligned rows of uneven cells. Fix each or list it as a labelled optical exception.
<!-- figma-short:end -->
