# Project rules

## Stack
Vite + React + TypeScript, @xyflow/react, zustand, zundo, lucide-react, html-to-image.
Do not add other UI frameworks or CSS libraries without asking.

## Working method
- Only implement the phase you are asked to implement. Do not build features from later phases.
- Specs in docs/specs/ are the source of truth. If a spec is ambiguous, ask.
- After each task: `npm run build` and `npm run check:colors` must pass, then verify in the browser at http://localhost:5173.
- Keep docs/PROGRESS.md updated (phase, what was done, known issues).

## Hard rules
- ALL colors live in src/theme/theme.css as CSS variables. No hex/rgb/hsl values anywhere else; use var(--token).
- Diagram data stores color token names (e.g. "swatch-blue"), never raw colors.
- Every palette component is defined once in src/components/registry.ts. Sidebar and canvas both read from it.
- Brand name and logo come only from src/config/brand.ts.
- Edges are orthogonal only: horizontal/vertical segments, sharp corners, no curves.
- State lives in src/store/diagramStore.ts.

## Design
Modern and minimal. 1px borders with var(--border), 8px radius on panels, 8px spacing scale,
13–14px UI text, subtle hover states, 150ms transitions, no heavy shadows.