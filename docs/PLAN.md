# System Design Canvas: Plan

A Draw.io-style web app for creating system design diagrams.

## Layout
- Top bar: logo + app name (top-left), settings with Light/Dark toggle (top-right)
- Left sidebar: component palette
- Right sidebar: configuration for the selected item
- Center: canvas. Scroll to zoom, drag empty space to pan; dragging a component moves it.

## Folder structure
src/
  config/brand.ts
  theme/theme.css, ThemeProvider.tsx
  components/registry.ts
  components/layout/TopBar.tsx, LeftSidebar.tsx, RightSidebar.tsx
  components/canvas/Canvas.tsx
  components/canvas/nodes/IconNode.tsx, BoxNode.tsx, SeparatorNode.tsx
  components/canvas/edges/OrthogonalEdge.tsx
  store/diagramStore.ts
  lib/boxGeometry.ts, exportImage.ts, persistence.ts

## Phases
0. Setup
1. Shell layout, theme, top bar
2. Canvas (pan/zoom)
3. Component registry, palette, icon nodes
4. Box and separator nodes
5. Orthogonal arrows
6. Right configuration panel
7. Editor essentials (shortcuts, undo, snap, autosave)
8. Import/export and polish

Runs locally for now (`npm run dev`). Deployment comes later.