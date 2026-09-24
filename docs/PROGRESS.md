# Progress

## Current Status
- **Current Phase**: Phase 7: Editor essentials
- **Status**: Completed

## Phase Log

### Phase 0: Setup
- **What was done**:
  - Scaffolded Vite + React + TypeScript application.
  - Installed dependencies (`@xyflow/react`, `zustand`, `zundo`, `lucide-react`, `html-to-image`) and dev dependencies.
  - Configured `check:colors` npm script to enforce CSS variable usage for colors.
  - Created project folder structure and minimal placeholder files per `docs/PLAN.md`.
  - Configured `.gitignore` for `node_modules` and `dist`.
  - Initialized `docs/PROGRESS.md`.
  - Verified `npm run build` and `npm run check:colors` pass.
- **Known Issues**: None.

### Phase 1: Shell layout, theme, top bar
- **What was done**:
  - Implemented full-viewport layout in `src/App.tsx` (TopBar 48px, LeftSidebar 240px, RightSidebar 280px, Canvas area filling rest, no page scrollbars).
  - Defined CSS variable color tokens and shell styling in `src/theme/theme.css` per `docs/specs/theme.md`.
  - Created `ThemeProvider` in `src/theme/ThemeProvider.tsx` with `localStorage` persistence and OS `prefers-color-scheme` support.
  - Added inline anti-flash script and brand title/favicon in `index.html`.
  - Exported `APP_NAME = "Untitled Designer"` and `LOGO_SRC = "/logo.svg"` from `src/config/brand.ts` and created `public/logo.svg` and `public/favicon.svg`.
  - Implemented `TopBar` with brand logo/name, settings gear icon button, and appearance popover containing Light/Dark segmented toggle (dismissible via click-outside and Escape).
  - Implemented `LeftSidebar`, `RightSidebar`, and `Canvas` shell components.
  - Validated `npm run build` and `npm run check:colors` pass without violations.
  - Verified all Phase 1 acceptance criteria in the browser at http://localhost:5173.
- **Known Issues**: None.

### Phase 2: Canvas (pan/zoom)
- **What was done**:
  - Implemented `Canvas.tsx` using `@xyflow/react` inside `ReactFlowProvider`.
  - Configured interaction settings: `panOnDrag` for left mouse dragging on empty space, `zoomOnScroll={true}`, `panOnScroll={false}`, `selectionOnDrag={false}`, `selectionKeyCode="Shift"`, `minZoom={0.1}`, `maxZoom={4}`.
  - Added dotted `Background` using `var(--canvas-dot)` on `var(--bg-canvas)`.
  - Built bottom-left `ZoomControls` component (`−`, zoom %, `+`, fit view) that reacts to viewport zoom changes.
  - Added bottom-right `MiniMap` component styled using CSS variables.
  - Configured `diagramStore.ts` using `zustand` and `zundo` `temporal` middleware with two temporary test nodes and edge.
  - Overrode React Flow's CSS variables and node/selection styles in `src/theme/theme.css` using theme tokens.
  - Validated `npm run build` and `npm run check:colors` passed with zero errors.
  - Verified all Phase 2 acceptance criteria and interactions via browser automation at http://localhost:5173 in both Light and Dark themes.
- **Known Issues**: None.

### Phase 3: Component registry, palette, icon nodes
- **What was done**:
  - Created `src/components/registry.ts` with all 23 components across 6 categories (Basics, Clients, Network, Compute & Data, DevOps, Other) per `docs/specs/components.md`, along with `DynamicIcon` helper.
  - Implemented `LeftSidebar.tsx` with live search filtering, collapsible category accordion groups with item counts, draggable tiles, and click-to-add support.
  - Implemented custom `IconNode.tsx` with 40px Lucide icons (stroke `var(--node-icon)`), inline editable label (double-click to edit, Enter/blur to commit, Escape to cancel), 4 connection handles (top/right/bottom/left visible on hover/selection), and subtle `var(--selection)` outline.
  - Wired drag-and-drop and viewport center placement in `Canvas.tsx` using `screenToFlowPosition`.
  - Cleaned up temporary test nodes from Phase 2 in `src/store/diagramStore.ts`.
  - Styled palette and icon nodes in `src/theme/theme.css` strictly using CSS variables.
  - Validated `npm run build` and `npm run check:colors` passed with zero errors.
  - Verified in browser at http://localhost:5173 that all 20 icon components can be added via drag/click, labels are editable inline, search filters correctly, handles/selection work, and theming renders cleanly in both Light and Dark modes.
- **Known Issues**: None.

### Phase 4: Box node
- **What was done**:
  - Created `src/lib/boxGeometry.ts` implementing `boxPoints(w, h, c)` to calculate polygon coordinates for hexagons (single-line) and octagons (multi-line).
  - Implemented `src/components/canvas/nodes/BoxNode.tsx` with SVG polygon background (`fill="var(--node-fill)"`, `stroke="var(--node-stroke)"`), dynamic height measurement with `ResizeObserver`, inline textarea editing on double-click, horizontal resizing via `NodeResizer`, and 4 connection handles on hover/selection.
  - Registered `box` in `COMPONENT_REGISTRY`, `LeftSidebar.tsx`, and `Canvas.tsx`.
  - Removed Separator and Arrow from specs, registry, and palette per updated design requirements.
  - Styled Box node in `src/theme/theme.css` strictly with CSS variables.
  - Validated `npm run build` and `npm run check:colors` passed with zero errors.
  - Verified in browser at http://localhost:5173 that single-line boxes render as hexagons, multi-line boxes morph into octagons, and horizontal resizing works.
- **Known Issues**: None.

### Phase 5: Orthogonal arrows
- **What was done**:
  - Re-introduced the Arrow tool tile in Basics palette with `nodeKind: 'tool'` and `MoveRight` icon.
  - Added `isArrowMode`, `setArrowMode`, `toggleArrowMode`, and `updateEdgeLabel` to `src/store/diagramStore.ts`.
  - Implemented `OrthogonalEdge.tsx` using `@xyflow/react`'s `getSmoothStepPath` with `borderRadius: 0` for strictly orthogonal routes, sharp 90-degree corners, `var(--edge)` stroke, and closed arrowhead marker (`ArrowClosed`).
  - Added midpoint label rendering with double-click inline editing (Enter/blur to commit, Escape to cancel, stored in `edge.data.label`).
  - Implemented `OrthogonalConnectionLine.tsx` for orthogonal dashed preview during connection drag.
  - Configured `Canvas.tsx` with `connectionMode={ConnectionMode.Loose}`, registered custom `orthogonal` edge type, body-drop nearest handle snapping in `handleConnectEnd`, and Escape key to exit arrow mode.
  - Enhanced `IconNode.tsx` and `BoxNode.tsx` to display connection handles when in arrow mode and support starting connections anywhere on the node body via an overlay handle.
  - Styled edge paths, labels, connection lines, and active arrow tool tile in `src/theme/theme.css` using theme CSS variables.
  - Verified `npm run build` and `npm run check:colors` pass with 0 errors.
  - Verified in browser at http://localhost:5173 that orthogonal edges connect cleanly between node handles and node bodies, arrow tool mode toggles with visual feedback and Escape key handling, and midpoint labels edit inline.
- **Known Issues**: None.

### Phase 6: Right configuration panel
- **What was done**:
  - Implemented `RightSidebar.tsx` with context-aware sections based on active canvas selection.
  - **Canvas Settings** (nothing selected): Show grid toggle, Snap to grid toggle, Grid size segmented button (10px / 20px), and Show minimap toggle.
  - **Icon Node Properties**: Editable label input, label position (below/right), icon size (S/M/L: 28px/40px/56px), color swatch picker (6 `--swatch-*` tokens), X/Y coordinate inputs, position lock toggle, Duplicate, and Delete buttons.
  - **Box Node Properties**: Textarea editing, font size (S/M/L: 12px/14px/16px), text alignment (left/center/right), fill color swatch picker (+ transparent), stroke color picker, stroke style (solid/dashed), width slider, Duplicate, and Delete buttons.
  - **Arrow Properties**: Edge label input, line style (solid/dashed/dotted), stroke width (1px/1.5px/2px/3px), arrowhead markers (none/end/start/both), color swatch picker, Duplicate, and Delete buttons.
  - **Multi-Selection**: Alignment tools (left, center, right, top, middle, bottom), distribution tools (horizontal, vertical), shared color swatch batch updates, Duplicate All, and Delete All buttons.
  - Extended `src/store/diagramStore.ts` with `canvasSettings`, `updateCanvasSettings`, `updateNodePosition`, `duplicateSelected`, `deleteSelected`, `alignSelected`, `distributeSelected`, `batchUpdateSelectedNodes`, and `batchUpdateSelectedEdges` with full undo history tracking via `zundo`.
  - Added SVG defs dynamic arrowhead markers matching edge colors in `OrthogonalEdge.tsx`.
  - Styled all property rows, inputs, toggle switches, segmented controls, swatch pickers, and action buttons in `src/theme/theme.css` strictly using CSS variables.
  - Validated `npm run build` and `npm run check:colors` pass with zero errors.
  - Verified in browser at http://localhost:5173 that property updates visibly reflect on selected items live, duplicate/delete work, and colors remap cleanly across theme switches.
- **Known Issues**: None.

### Phase 7: Editor essentials
- **What was done**:
  - Implemented keyboard shortcuts manager in `src/hooks/useKeyboardShortcuts.ts`:
    - Delete / Backspace: deletes selected elements.
    - Ctrl+C / Cmd+C & Ctrl+V / Cmd+V: copy/paste with offset.
    - Ctrl+D / Cmd+D: duplicate selection.
    - Ctrl+Z / Cmd+Z & Ctrl+Shift+Z / Cmd+Shift+Z: undo and redo with `zundo`.
    - Ctrl+A / Cmd+A: select all elements.
    - Arrow keys: nudge selection 1px; Shift+Arrow: nudge by grid size (10px/20px).
    - Escape: deselect all and exit arrow mode.
    - Ctrl+0 / Cmd+0: fit view.
    - Guarded against shortcut trigger while editing input / textarea elements.
  - Implemented alignment helper lines in `src/lib/helperLines.ts` and `src/components/canvas/HelperLines.tsx` for real-time snapping during node drag.
  - Implemented right-click context menu in `src/components/canvas/ContextMenu.tsx` with Bring to Front, Send to Back, Duplicate, and Delete actions.
  - Implemented 500ms debounced autosave to `localStorage` and diagram state hydration on load in `src/lib/persistence.ts`.
  - Added "New diagram" feature in `src/components/layout/TopBar.tsx` with confirmation modal and state reset.
  - Styled helper lines, context menu, modal, and shortcuts in `src/theme/theme.css` using theme CSS variables.
  - Validated `npm run build` and `npm run check:colors` pass with zero errors.
  - Verified in browser at http://localhost:5173 that shortcuts, alignment lines, context menu, autosave/restore, and diagram resets work correctly.
- **Known Issues**: None.
