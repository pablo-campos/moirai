# Progress

## Current Status
- **Current Phase**: Phase 3: Component registry, palette, icon nodes
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
