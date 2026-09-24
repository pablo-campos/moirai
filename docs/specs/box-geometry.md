# Box geometry spec

A box is a hexagon when it holds one line of text. As text grows, it becomes
an octagon elongated downward. One formula handles both:

```ts
/** c = half of the single-line box height (18 for a 36px line box) */
export function boxPoints(w: number, h: number, c = 18): string {
  const k = Math.min(c, h / 2);
  return [
    [k, 0], [w - k, 0],       // top edge
    [w, k], [w, h - k],       // right side (collapses to a point when h = 2k)
    [w - k, h], [k, h],       // bottom edge
    [0, h - k], [0, k],       // left side
  ].map(([x, y]) => `${x},${y}`).join(" ");
}
```

## Sizing
- Single-line height: 36px (c = 18)
- Height = max(2c, measured text height + vertical padding)
- Horizontal padding ≥ 22px so text never touches the pointed sides
- Default width 160px, min 100px, user-resizable horizontally
- Height is always automatic (driven by text)