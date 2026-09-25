/**
 * Generates the SVG polygon points and sci-fi / anime tech frame geometry for a box node.
 */

export interface TechFrameGeometry {
  points: string;
  topMainRail: { x1: number; y1: number; x2: number; y2: number };
  topLeftNotch: { x1: number; y1: number; x2: number; y2: number };
  topRightNotch: { x1: number; y1: number; x2: number; y2: number };
  bottomMainRail: { x1: number; y1: number; x2: number; y2: number };
  bottomLeftNotch: { x1: number; y1: number; x2: number; y2: number };
  bottomRightNotch: { x1: number; y1: number; x2: number; y2: number };
  leftOuterChevron: string;
  leftInnerChevron: string;
  rightOuterChevron: string;
  rightInnerChevron: string;
  shoulderTicks: Array<{ x1: number; y1: number; x2: number; y2: number; strokeWidth: number }>;
  circuitLines: Array<{ x1: number; y1: number; x2: number; y2: number; dotX: number; dotY: number }>;
}

/**
 * Generates the SVG polygon points for a box node.
 * A box is a hexagon when it holds one line of text (h = 2c).
 * As text grows (h > 2c), it becomes an octagon elongated downward.
 */
export function boxPoints(w: number, h: number, c = 18): string {
  const k = Math.min(c, h / 2);
  const isSingleLine = h <= 2 * k + 2;

  if (isSingleLine) {
    return [
      [k, 0],
      [w - k, 0],
      [w, h / 2],
      [w - k, h],
      [k, h],
      [0, h / 2],
    ]
      .map(([x, y]) => `${x},${y}`)
      .join(' ');
  }

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

/**
 * Generates full tech frame geometry with multi-rail borders,
 * layered corner chevrons, shoulder accent ticks, and circuit lines.
 */
export function getBoxTechFrameGeometry(w: number, h: number, c = 18): TechFrameGeometry {
  const k = Math.min(c, h / 2);
  const isSingleLine = h <= 2 * k + 2;
  const points = boxPoints(w, h, c);

  const railOffset = 4;
  const topY = -railOffset;
  const bottomY = h + railOffset;

  // Outer and inner chevrons (wings)
  const leftOuterChevron = isSingleLine
    ? `M ${k - 2} ${topY} L -5 ${h / 2} L ${k - 2} ${bottomY}`
    : `M ${k - 2} ${topY} L -5 ${k} L -5 ${h - k} L ${k - 2} ${bottomY}`;

  const leftInnerChevron = isSingleLine
    ? `M ${k - 7} ${topY + 3} L -9 ${h / 2} L ${k - 7} ${bottomY - 3}`
    : `M ${k - 7} ${topY + 3} L -9 ${k + 2} L -9 ${h - k - 2} L ${k - 7} ${bottomY - 3}`;

  const rightOuterChevron = isSingleLine
    ? `M ${w - k + 2} ${topY} L ${w + 5} ${h / 2} L ${w - k + 2} ${bottomY}`
    : `M ${w - k + 2} ${topY} L ${w + 5} ${k} L ${w + 5} ${h - k} L ${w - k + 2} ${bottomY}`;

  const rightInnerChevron = isSingleLine
    ? `M ${w - k + 7} ${topY + 3} L ${w + 9} ${h / 2} L ${w - k + 7} ${bottomY - 3}`
    : `M ${w - k + 7} ${topY + 3} L ${w + 9} ${k + 2} L ${w + 9} ${h - k - 2} L ${w - k + 7} ${bottomY - 3}`;

  // Shoulder accent ticks (thickened joints at corners)
  const shoulderTicks = [
    // Top-Left corner shoulder
    { x1: k - 2, y1: topY, x2: k + 10, y2: topY, strokeWidth: 2.8 },
    { x1: k, y1: 0, x2: k * 0.4, y2: isSingleLine ? h * 0.25 : k * 0.5, strokeWidth: 2.4 },
    // Top-Right corner shoulder
    { x1: w - k - 10, y1: topY, x2: w - k + 2, y2: topY, strokeWidth: 2.8 },
    { x1: w - k, y1: 0, x2: w - k * 0.4, y2: isSingleLine ? h * 0.25 : k * 0.5, strokeWidth: 2.4 },
    // Bottom-Left corner shoulder
    { x1: k - 2, y1: bottomY, x2: k + 10, y2: bottomY, strokeWidth: 2.8 },
    { x1: k, y1: h, x2: k * 0.4, y2: isSingleLine ? h * 0.75 : h - k * 0.5, strokeWidth: 2.4 },
    // Bottom-Right corner shoulder
    { x1: w - k - 10, y1: bottomY, x2: w - k + 2, y2: bottomY, strokeWidth: 2.8 },
    { x1: w - k, y1: h, x2: w - k * 0.4, y2: isSingleLine ? h * 0.75 : h - k * 0.5, strokeWidth: 2.4 },
  ];

  // Subtle interior circuit detail lines
  const circuitLines =
    w >= 140
      ? [
          { x1: 22, y1: h / 2 - 4, x2: 36, y2: h / 2 - 4, dotX: 22, dotY: h / 2 - 4 },
          { x1: 22, y1: h / 2 + 4, x2: 36, y2: h / 2 + 4, dotX: 22, dotY: h / 2 + 4 },
          { x1: w - 36, y1: h / 2 - 4, x2: w - 22, y2: h / 2 - 4, dotX: w - 22, dotY: h / 2 - 4 },
          { x1: w - 36, y1: h / 2 + 4, x2: w - 22, y2: h / 2 + 4, dotX: w - 22, dotY: h / 2 + 4 },
        ]
      : [];

  return {
    points,
    topMainRail: { x1: k + 14, y1: topY, x2: w - k - 14, y2: topY },
    topLeftNotch: { x1: k - 4, y1: topY, x2: k + 2, y2: topY },
    topRightNotch: { x1: w - k - 2, y1: topY, x2: w - k + 4, y2: topY },
    bottomMainRail: { x1: k + 14, y1: bottomY, x2: w - k - 14, y2: bottomY },
    bottomLeftNotch: { x1: k - 4, y1: bottomY, x2: k + 2, y2: bottomY },
    bottomRightNotch: { x1: w - k - 2, y1: bottomY, x2: w - k + 4, y2: bottomY },
    leftOuterChevron,
    leftInnerChevron,
    rightOuterChevron,
    rightInnerChevron,
    shoulderTicks,
    circuitLines,
  };
}
