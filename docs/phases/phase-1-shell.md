# Phase 1: Shell layout, theme, top bar

References: docs/specs/theme.md

## Tasks
1. Full-viewport layout: TopBar 48px tall; LeftSidebar 240px; RightSidebar 280px;
   canvas area fills the rest (placeholder for now). No page scrollbars.
2. Create src/theme/theme.css from the spec and import it globally.
3. ThemeProvider: sets data-theme on <html>, persists choice to localStorage,
   defaults to OS preference (prefers-color-scheme).
4. Inline script in index.html applies the saved theme before React loads (no flash).
5. src/config/brand.ts exports:
   APP_NAME = "Untitled Designer"
   LOGO_SRC = "/logo.svg"
   Add a simple placeholder public/logo.svg and public/favicon.svg.
6. TopBar: logo + APP_NAME top-left. Gear button top-right opens a small popover
   with a Light/Dark segmented toggle. Popover closes on outside click and Escape.

## Done when
- Toggling theme recolors everything instantly
- Refresh keeps the chosen theme with no white flash
- Name and logo come from brand.ts
- npm run check:colors passes