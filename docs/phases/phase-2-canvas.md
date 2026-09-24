# Phase 2: Canvas

## Tasks
1. Canvas.tsx uses React Flow inside ReactFlowProvider.
2. Interaction settings:
   - panOnDrag: left mouse on empty space pans
   - zoomOnScroll: true, panOnScroll: false
   - selectionOnDrag: false; selectionKeyCode "Shift" (Shift+drag box-selects)
   - minZoom 0.1, maxZoom 4
   - Dragging a node moves the node and must not pan the canvas
3. Dotted Background using var(--canvas-dot) on var(--bg-canvas).
4. Zoom controls bottom-left: −, zoom %, +, fit view.
5. Optional MiniMap bottom-right, themed via CSS variables.
6. Override React Flow's default CSS variables so selection, handles, controls,
   and minimap use theme tokens.
7. diagramStore.ts: zustand store holding nodes and edges, with the zundo
   temporal middleware set up for undo/redo (shortcuts come in Phase 7).
8. Add 2 temporary test nodes to verify interactions (remove in Phase 3).

## Done when
- Scroll zooms toward the cursor
- Dragging empty space pans; dragging a node moves only the node
- Shift+drag draws a selection box
- Canvas looks correct in both themes