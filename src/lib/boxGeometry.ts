/**
 * Generates the SVG polygon points for a box node.
 * A box is a hexagon when it holds one line of text (h = 2c).
 * As text grows (h > 2c), it becomes an octagon elongated downward.
 *
 * @param w Width of the box in pixels
 * @param h Height of the box in pixels
 * @param c Half of the single-line box height (default 18 for a 36px line box)
 * @returns SVG polygon points string
 */
export function boxPoints(w: number, h: number, c = 18): string {
  const k = Math.min(c, h / 2);
  return [
    [k, 0],
    [w - k, 0],
    [w, k],
    [w, h - k],
    [w - k, h],
    [k, h],
    [0, h - k],
    [0, k],
  ]
    .map(([x, y]) => `${x},${y}`)
    .join(' ');
}
