# Phase 6: Right configuration panel

References: docs/specs/theme.md (swatch tokens)

## Behavior
All inputs update the store live and are undoable. Colors are chosen from
--swatch-* tokens, stored as token names, rendered via var(--token).

## Sections by selection
- Nothing selected: canvas settings: show grid, snap to grid (grid size 10/20),
  show minimap
- Icon node: label, label position (below/right), icon size (S/M/L),
  icon color, X/Y position, lock position
- Box: text, font size, text align, fill (swatches + transparent),
  stroke color, stroke style (solid/dashed), width
- Separator: label, line style (solid/dashed), color, width
- Edge: label, line style (solid/dashed/dotted), stroke width,
  arrowheads (none/end/start/both), color
- Multiple selected: shared properties + align (left/center/right/top/middle/bottom)
  and distribute horizontally/vertically

Every section has Duplicate and Delete buttons at the bottom.

## Done when
- Every property visibly changes the selected item
- Switching theme keeps chosen colors meaningful (tokens remap)