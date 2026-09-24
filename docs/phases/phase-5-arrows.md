# Phase 5: Orthogonal arrows

## Tasks
1. OrthogonalEdge: custom edge using getSmoothStepPath with borderRadius: 0.
   Only horizontal and vertical segments with sharp corners, never curves.
   Stroke var(--edge), 1.5px, closed arrowhead marker at target.
2. Midpoint label, double-click to edit.
3. Make it the default edge type. connectionMode="loose" so any handle connects
   to any handle.
4. The connection-line preview while dragging must also be orthogonal.
5. Arrow palette tile works as a tool:
   - Clicking it activates arrow mode (tile highlighted)
   - In arrow mode, handles show on all nodes and dragging from anywhere on a
     node starts a connection
   - Escape or clicking the tile again exits arrow mode
6. Dropping a connection on a node's body (not just a handle) connects to the
   nearest handle.

## Done when
- Every arrow is made only of straight horizontal/vertical lines
- Moving nodes re-routes arrows correctly
- Arrow mode toggles on and off
- Arrows look correct in both themes