# Progress

## Current Status
- **Current Phase**: Phase 1: Shell layout, theme, top bar
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
