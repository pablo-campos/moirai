# Phase 7: Editor essentials (the Draw.io feel)

## Keyboard shortcuts (Ctrl on Windows/Linux, Cmd on Mac)
- Delete / Backspace: delete selection (ignored while editing text)
- Ctrl+C / Ctrl+V: copy / paste with offset
- Ctrl+D: duplicate
- Ctrl+Z / Ctrl+Shift+Z: undo / redo (zundo)
- Ctrl+A: select all
- Arrow keys: nudge 1px; Shift+Arrow nudges by grid size
- Escape: deselect / exit arrow mode
- Ctrl+0: fit view

## Other tasks
1. Snap to grid when enabled in canvas settings.
2. Alignment helper lines while dragging nodes (like React Flow's helper-lines example).
3. Right-click context menu on nodes/edges: bring to front, send to back,
   duplicate, delete.
4. Autosave to localStorage (debounced 500ms) in src/lib/persistence.ts;
   restore on load.
5. "New diagram" in the settings popover, with a confirm step.

## Done when
- Undo/redo works across moves, edits, adds, and deletes
- Refreshing the page restores the diagram
- Typing in a label never triggers shortcuts