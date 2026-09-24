# Phase 3: Component registry, palette, icon nodes

References: docs/specs/components.md

## Tasks
1. Create registry.ts from the spec.
2. LeftSidebar:
   - Search input at top (filters by label)
   - Collapsible category groups, each a grid of tiles (icon + small label)
   - Tiles draggable via HTML5 drag-and-drop; on drop use screenToFlowPosition
     to place the node under the cursor
   - Clicking a tile adds the item at the viewport center
   - Arrow, Box, Separator tiles appear but are wired up in Phases 4–5
3. IconNode (one component for all nodeKind "icon" entries):
   - Lucide icon, 40px, stroke var(--node-icon), no container border
   - Text label below, no border, defaults to the component label
   - Double-click label to edit inline; Enter/blur commits; Escape cancels
   - 4 connection handles (top/right/bottom/left), visible only on hover or selection
   - Selected: subtle outline in var(--selection)
4. Remove the temporary test nodes from Phase 2.

## Done when
- All 20 icon components can be dragged or clicked onto the canvas
- Labels are editable
- Search filters the palette