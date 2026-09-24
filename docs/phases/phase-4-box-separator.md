# Phase 4: Box and separator nodes

References: docs/specs/box-geometry.md

## Tasks
1. src/lib/boxGeometry.ts from the spec.
2. BoxNode:
   - Absolutely positioned SVG polygon behind the text:
     fill var(--node-fill), stroke var(--node-stroke), 1.5px
   - Auto-growing, centered, multi-line text on top
   - Height measured with ResizeObserver; polygon updates smoothly
   - Horizontal resize via React Flow NodeResizer (width only)
   - Double-click to edit text; Escape/click outside commits
   - Same 4 handles as IconNode
   - Optional label below the box, no border
3. SeparatorNode:
   - Horizontal dashed line in var(--separator)
   - Optional small uppercase label at its left end
   - Resizable width; default 600px
   - Rendered behind other nodes (lower zIndex)
   - Marks a new section of the diagram below it
4. Wire Box and Separator palette tiles.

## Done when
- One line of text shows a hexagon
- Adding lines morphs it into a tall octagon
- Separator stretches horizontally and sits behind other nodes