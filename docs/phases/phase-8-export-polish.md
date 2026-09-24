# Phase 8: Import/export and polish

## Tasks
1. Export menu in the TopBar (right side, next to settings):
   - PNG (2x, current theme background)
   - SVG
   - JSON
   Use html-to-image on .react-flow__viewport with getNodesBounds and
   getViewportForBounds so the whole diagram is included (src/lib/exportImage.ts).
2. Import JSON with schema validation and a clear error message on bad files.
3. Polish:
   - Consistent 8px spacing scale
   - Focus rings using var(--accent)
   - Tooltips on palette tiles
   - 150ms transitions on hover/selection
   - Empty-canvas hint: "Drag components from the left to start"
4. Test the production build locally: npm run build && npm run preview.

## Done when
- Exported PNG/SVG look right in both themes
- JSON export → import reproduces the diagram exactly
- npm run preview works with no console errors