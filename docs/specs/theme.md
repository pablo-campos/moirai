# Theme spec

src/theme/theme.css is the ONLY file allowed to contain color values.
Create it with exactly these tokens:

```css
:root,
:root[data-theme="light"] {
  --theme-transition-duration: 1s;
  --bg-app: #f4f4f5;
  --bg-panel: #ffffff;
  --bg-canvas: #ffffff;
  --bg-hover: #f0f0f2;
  --bg-active: #e4e4e7;
  --border: #d4d4d8;
  --canvas-dot: #d4d4d8;
  --text-primary: #000000;
  --text-secondary: #27272a;
  --text-muted: #71717a;
  --accent: #059669;
  --accent-soft: #eafaf1;
  --selection: #059669;
  --node-fill: #ffffff;
  --node-stroke: #18181b;
  --node-icon: #000000;
  --edge: #27272a;
  --separator: #71717a;
  --swatch-neutral: #18181b;
  --swatch-blue: #2563eb;
  --swatch-green: #0da651;
  --swatch-amber: #d97706;
  --swatch-red: #dc2626;
  --swatch-violet: #7c3aed;
  --swatch-neutral-alpha: rgb(24 24 27 / 0.3);
  --swatch-blue-alpha: rgb(37 99 235 / 0.3);
  --swatch-green-alpha: rgb(13 166 81 / 0.3);
  --swatch-amber-alpha: rgb(217 119 6 / 0.3);
  --swatch-red-alpha: rgb(220 38 38 / 0.3);
  --swatch-violet-alpha: rgb(124 58 237 / 0.3);
  --shadow: 0 1px 3px rgb(0 0 0 / 0.08), 0 4px 12px rgb(0 0 0 / 0.05);
}

:root[data-theme="dark"] {
  --theme-transition-duration: 1s;
  --bg-app: #000000;
  --bg-panel: #0a0a0c;
  --bg-canvas: #000000;
  --bg-hover: #17171c;
  --bg-active: #22222a;
  --border: #1e1e24;
  --canvas-dot: #2a2a32;
  --text-primary: #ffffff;
  --text-secondary: #a1a1aa;
  --text-muted: #71717a;
  --accent: #10e86a;
  --accent-soft: #03200e;
  --selection: #10e86a;
  --node-fill: #09090b;
  --node-stroke: #2e2e36;
  --node-icon: #ffffff;
  --edge: #71717a;
  --separator: #3f3f46;
  --swatch-neutral: #d4d4d8;
  --swatch-blue: #38bdf8;
  --swatch-green: #10e86a;
  --swatch-amber: #fbbf24;
  --swatch-red: #f87171;
  --swatch-violet: #a78bfa;
  --swatch-neutral-alpha: rgb(212 212 216 / 0.3);
  --swatch-blue-alpha: rgb(56 189 248 / 0.3);
  --swatch-green-alpha: rgb(16 232 106 / 0.3);
  --swatch-amber-alpha: rgb(251 191 36 / 0.3);
  --swatch-red-alpha: rgb(248 113 113 / 0.3);
  --swatch-violet-alpha: rgb(167 139 250 / 0.3);
  --shadow: 0 1px 3px rgb(0 0 0 / 0.7), 0 4px 16px rgb(0 0 0 / 0.6);
}
```

## Rules
- New tokens may be added only to this file, with both light and dark values.
- User-selectable colors use the --swatch-* tokens and are stored by name.