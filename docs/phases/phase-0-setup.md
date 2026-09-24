# Phase 0: Setup

## Tasks
1. Scaffold a Vite + React + TypeScript app in the current folder (the folder already
   contains AGENTS.md and docs/; keep them).
2. Install: @xyflow/react zustand zundo lucide-react html-to-image
3. Remove all Vite boilerplate content and styles.
4. Create the folder structure from docs/PLAN.md with minimal placeholder files.
5. Add this npm script:
   "check:colors": "! grep -rnE '#[0-9a-fA-F]{3,8}\\b' src --include=*.ts --include=*.tsx --include=*.css | grep -v 'src/theme/theme.css'"
6. Ensure .gitignore covers node_modules and dist.
7. Initialize git if not already initialized.
8. Create docs/PROGRESS.md.

## Done when
- `npm run dev` serves a blank page at http://localhost:5173
- `npm run build` passes
- `npm run check:colors` passes