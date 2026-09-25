# Progress

## Current Status
- **Current Phase**: Phase 8: Import/export and polish
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

### Phase 8: Import/export and polish
- **What was done**:
  - Implemented export utilities in `src/lib/exportImage.ts`:
    - `exportDiagramAsPng`: High-resolution 2x PNG rendering with current theme background and bounding box viewport bounds via `html-to-image` and `@xyflow/react`.
    - `exportDiagramAsSvg`: Vector SVG export with diagram bounding box.
    - `exportDiagramAsJson`: Full diagram serialization (nodes, edges, canvas settings, version).
    - `validateAndParseDiagramJson`: Schema validation with descriptive error feedback on malformed files.
  - Added TopBar Export/Import dropdown menu in `src/components/layout/TopBar.tsx` with PNG (2x), SVG, JSON export, and JSON file import.
  - Added Import Error modal with descriptive error messages.
  - Implemented Empty Canvas onboarding hint ("Drag components from the left palette to start") in `src/components/canvas/Canvas.tsx`.
  - Polished consistent 8px spacing, focus rings with `var(--accent)`, 150ms transitions, and palette tooltips.
  - Styled export menus, modals, and empty state cards in `src/theme/theme.css` strictly using CSS variables.
  - Validated `npm run build` and `npm run check:colors` pass with zero errors.
  - Verified local production preview (`npm run preview`) runs with zero errors.
  - Verified in browser at http://localhost:5173 that empty canvas hints, PNG/SVG/JSON export, JSON import, and dark/light themes work cleanly.
- **Known Issues**: None.

### Theme, Branding & Arrow Polish Updates
- **What was done**:
  - Renamed application to "Moirai" across `src/config/brand.ts` and `index.html`.
  - Removed "Arrow" component from the left sidebar Basics category in `src/components/registry.ts` and updated `docs/specs/components.md`.
  - Updated SVG arrowhead marker definitions in `src/components/canvas/edges/OrthogonalEdge.tsx` so start and end arrowheads always point outward away from the connection line toward the attached components (`orient="auto-start-reverse"` on start marker).
  - Updated dark theme to use pure pitch black (`#000000`) for the canvas and app background with `#0a0a0c` sidebars in `src/theme/theme.css`.
  - Updated light theme to use crisp black (`#000000`) text, node borders, and icons for contrast.
  - Updated theme color accents (`--accent`, `--selection`, `--swatch-green`) to vibrant neon green (`#10e86a` / `#0da651`).
  - Synchronized `docs/specs/theme.md` with new color tokens.
  - Passed `npm run build` and `npm run check:colors` with 0 errors.
  - Verified changes in browser at http://localhost:5173.
- **Known Issues**: None.

### Properties Panel Layout & Box Fill Swatch Updates
- **What was done**:
  - Updated `.prop-row-inline` in [theme.css](file:///Users/pablocampos/Development/Repositories/moirai/src/theme/theme.css) so toggle switches (Show grid, Snap to grid, Show minimap) have labels aligned on the far left end and switches on the far right end.
  - Updated "Lock position" row in [RightSidebar.tsx](file:///Users/pablocampos/Development/Repositories/moirai/src/components/layout/RightSidebar.tsx) and [theme.css](file:///Users/pablocampos/Development/Repositories/moirai/src/theme/theme.css) so the label is aligned on the far left end and the lock button is on the far right end.
  - Defined 30% alpha color tokens (`--swatch-*-alpha`) in [theme.css](file:///Users/pablocampos/Development/Repositories/moirai/src/theme/theme.css) for both light and dark themes.
  - Exported `BOX_FILL_COLORS` in [diagramStore.ts](file:///Users/pablocampos/Development/Repositories/moirai/src/store/diagramStore.ts) excluding black/white neutral swatches.
  - Updated Box node "Fill color" menu in [RightSidebar.tsx](file:///Users/pablocampos/Development/Repositories/moirai/src/components/layout/RightSidebar.tsx) to display transparent + the 5 non-neutral color swatches with 30% alpha styling.
  - Updated [BoxNode.tsx](file:///Users/pablocampos/Development/Repositories/moirai/src/components/canvas/nodes/BoxNode.tsx) to render box polygon backgrounds with 30% alpha fills when color swatches are selected.
  - Verified `npm run build` and `npm run check:colors` pass with zero errors.
  - Verified all layout and alpha styling changes in the browser at http://localhost:5173.
### Eclipse Brand Logo & Favicon Update
- **What was done**:
  - Re-designed [public/logo.svg](file:///Users/pablocampos/Development/Repositories/moirai/public/logo.svg) and [public/favicon.svg](file:///Users/pablocampos/Development/Repositories/moirai/public/favicon.svg) to feature a modern solar eclipse motif with clean horizontal overlap.
  - Implemented an eclipse design composed of a luminous accent gradient crescent (`#10e86a` to `#059669`) extending vertically along the left rim, a full thin corona ring, transparent lunar cutout mask, and a diamond ring specular flare beacon at the crescent apex.
  - Verified crisp rendering, high contrast, and balanced legibility across both Dark and Light themes.
  - Passed `npm run build` and `npm run check:colors` with zero errors.
  - Verified changes via browser subagent automation at http://localhost:5173.
- **Known Issues**: None.

### Empty Canvas Dialog Brand Logo & App Name Update
- **What was done**:
  - Added brand logo (`LOGO_SRC` from [brand.ts](file:///Users/pablocampos/Development/Repositories/moirai/src/config/brand.ts)) sized at 56px at the top center of the Empty Canvas hint card in [Canvas.tsx](file:///Users/pablocampos/Development/Repositories/moirai/src/components/canvas/Canvas.tsx).
  - Added app name (`APP_NAME` from [brand.ts](file:///Users/pablocampos/Development/Repositories/moirai/src/config/brand.ts)) centered directly beneath the brand logo.
  - Styled centered layout, typography, and spacing in [theme.css](file:///Users/pablocampos/Development/Repositories/moirai/src/theme/theme.css) strictly using design system tokens.
  - Passed `npm run build` and `npm run check:colors` with zero errors.
  - Verified visual appearance in browser at http://localhost:5173 across dark and light themes.
- **Known Issues**: None.

### Logo & Favicon Flare Dot Removal
- **What was done**:
  - Removed the specular flare / white light dot and associated gradient from [logo.svg](file:///Users/pablocampos/Development/Repositories/moirai/public/logo.svg) and [favicon.svg](file:///Users/pablocampos/Development/Repositories/moirai/public/favicon.svg), leaving a clean eclipse corona and crescent motif.
  - Verified `npm run build` and `npm run check:colors` pass with zero errors.
  - Verified in browser at http://localhost:5173.
- **Known Issues**: None.

### Brand Typography: Martian Mono
- **What was done**:
  - Loaded `Martian Mono` variable font from Google Fonts in [index.html](file:///Users/pablocampos/Development/Repositories/moirai/index.html) and [theme.css](file:///Users/pablocampos/Development/Repositories/moirai/src/theme/theme.css).
  - Applied `font-family: 'Martian Mono', monospace` to `.top-bar-title` in the navbar and `.empty-hint-brand` in the empty canvas onboarding card.
  - Adjusted `.top-bar-brand`, `.top-bar-logo`, and `.top-bar-title` line box alignment (`line-height: 1`, `inline-flex`, `align-items: center`, `height: 100%`, `transform: translateY(2px)`) for visual centering relative to the logo and navbar.
  - Verified `npm run build` and `npm run check:colors` pass with zero errors.
  - Verified in browser at http://localhost:5173 that the app name renders in Martian Mono in both locations across light and dark modes.
- **Known Issues**: None.

### Sci-Fi / Anime Tech Frame Box Node Styling
- **What was done**:
  - Enhanced [boxGeometry.ts](file:///Users/pablocampos/Development/Repositories/moirai/src/lib/boxGeometry.ts) with `getBoxTechFrameGeometry` generating multi-rail top/bottom floating borders with notches, layered outer/inner chevron brackets (`<<` and `>>`), heavy corner shoulder ticks, and subtle interior circuit lines.
  - Updated [BoxNode.tsx](file:///Users/pablocampos/Development/Repositories/moirai/src/components/canvas/nodes/BoxNode.tsx) to render full layered SVG framing adapting smoothly to horizontal width resizing and dynamic multi-line height expansion.
  - Preserved color swatch customization, connection handles, and selection states in both Light and Dark themes.
  - Verified `npm run build` and `npm run check:colors` pass with zero errors.
  - Verified in browser at http://localhost:5173 that Box nodes render crisp tech frames in both unselected and selected states across themes.
- **Known Issues**: None.

### Rectangle Component & Text Box Refinements
- **What was done**:
  - Reordered Basics category in [registry.ts](file:///Users/pablocampos/Development/Repositories/moirai/src/components/registry.ts) and [components.md](file:///Users/pablocampos/Development/Repositories/moirai/docs/specs/components.md) so `Rectangle` is listed first and `Text Box` (renamed from `Box`) is listed second.
  - Implemented [RectangleNode.tsx](file:///Users/pablocampos/Development/Repositories/moirai/src/components/canvas/nodes/RectangleNode.tsx) with sharp 90-degree corners (`rx={0}`, `ry={0}`), transparent or swatch alpha fill, stroke colors, stroke styles (solid, dashed, dotted), 2D `NodeResizer`, 4 connection handles, and optional inline editable text (empty by default).
  - Registered `rectangle` in [Canvas.tsx](file:///Users/pablocampos/Development/Repositories/moirai/src/components/canvas/Canvas.tsx) and updated drag/drop & click-to-add handlers.
  - Updated [RightSidebar.tsx](file:///Users/pablocampos/Development/Repositories/moirai/src/components/layout/RightSidebar.tsx):
    - Renamed properties panel header to "Text Box Properties" and removed "Fill color" and "Stroke style" controls.
    - Added dedicated Rectangle properties panel with Text, Font size, Text align, Fill color, Stroke color, Stroke style (Solid, Dashed, Dotted), Width & Height sliders.
  - Updated Empty Canvas hint dialog: doubled brand logo size from 56px to 112px, increased brand title font size to 22px, and adjusted spacing and card padding.
  - Verified `npm run build` and `npm run check:colors` pass with zero errors.
  - Verified in browser at http://localhost:5173 that Rectangle is first in Basics, Text Box is second, and properties panels render with updated options.
- **Known Issues**: None.









