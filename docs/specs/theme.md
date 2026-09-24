# Theme spec

src/theme/theme.css is the ONLY file allowed to contain color values.
Create it with exactly these tokens:

```css
:root,
:root[data-theme="light"] {
  --bg-app: #f6f6f7;
  --bg-panel: #ffffff;
  --bg-canvas: #fafafa;
  --bg-hover: #f0f0f2;
  --bg-active: #e8e8ec;
  --border: #e4e4e7;
  --canvas-dot: #d4d4d8;
  --text-primary: #18181b;
  --text-secondary: #71717a;
  --text-muted: #a1a1aa;
  --accent: #4f46e5;
  --accent-soft: #eef2ff;
  --selection: #4f46e5;
  --node-fill: #ffffff;
  --node-stroke: #3f3f46;
  --node-icon: #27272a;
  --edge: #52525b;
  --separator: #a1a1aa;
  --swatch-neutral: #3f3f46;
  --swatch-blue: #2563eb;
  --swatch-green: #16a34a;
  --swatch-amber: #d97706;
  --swatch-red: #dc2626;
  --swatch-violet: #7c3aed;
  --shadow: 0 1px 3px rgb(0 0 0 / 0.06), 0 4px 12px rgb(0 0 0 / 0.04);
}

:root[data-theme="dark"] {
  --bg-app: #0e0e10;
  --bg-panel: #16161a;
  --bg-canvas: #121215;
  --bg-hover: #1f1f24;
  --bg-active: #27272d;
  --border: #2a2a30;
  --canvas-dot: #2e2e35;
  --text-primary: #f4f4f5;
  --text-secondary: #a1a1aa;
  --text-muted: #71717a;
  --accent: #818cf8;
  --accent-soft: #1e1b3a;
  --selection: #818cf8;
  --node-fill: #1b1b20;
  --node-stroke: #d4d4d8;
  --node-icon: #e4e4e7;
  --edge: #a1a1aa;
  --separator: #52525b;
  --swatch-neutral: #d4d4d8;
  --swatch-blue: #60a5fa;
  --swatch-green: #4ade80;
  --swatch-amber: #fbbf24;
  --swatch-red: #f87171;
  --swatch-violet: #a78bfa;
  --shadow: 0 1px 3px rgb(0 0 0 / 0.4), 0 4px 12px rgb(0 0 0 / 0.3);
}
```

## Rules
- New tokens may be added only to this file, with both light and dark values.
- User-selectable colors use the --swatch-* tokens and are stored by name.