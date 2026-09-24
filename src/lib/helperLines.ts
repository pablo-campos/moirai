import type { Node } from '@xyflow/react';

export interface HelperLines {
  horizontal?: number;
  vertical?: number;
}

const SNAP_THRESHOLD = 5;

function getNodeDimensions(node: Node): { width: number; height: number } {
  if (node.type === 'box') {
    const width = typeof node.data?.width === 'number' ? node.data.width : 160;
    const height = (node.measured?.height as number) || 40;
    return { width, height };
  }
  const size = node.data?.iconSize;
  const width = size === 'S' ? 36 : size === 'L' ? 64 : 48;
  const height = size === 'S' ? 48 : size === 'L' ? 76 : 64;
  return { width, height };
}

export function getHelperLines(
  draggedNode: Node,
  nodes: Node[]
): {
  snappedPosition: { x: number; y: number };
  lines: HelperLines;
} {
  const resultLines: HelperLines = {};
  const snappedPosition = { ...draggedNode.position };

  const draggedDim = getNodeDimensions(draggedNode);
  const draggedLeft = draggedNode.position.x;
  const draggedRight = draggedNode.position.x + draggedDim.width;
  const draggedCenterX = draggedLeft + draggedDim.width / 2;

  const draggedTop = draggedNode.position.y;
  const draggedBottom = draggedNode.position.y + draggedDim.height;
  const draggedCenterY = draggedTop + draggedDim.height / 2;

  const otherNodes = nodes.filter((n) => n.id !== draggedNode.id);

  let minDiffX = SNAP_THRESHOLD;
  let minDiffY = SNAP_THRESHOLD;

  for (const other of otherNodes) {
    const otherDim = getNodeDimensions(other);
    const otherLeft = other.position.x;
    const otherRight = other.position.x + otherDim.width;
    const otherCenterX = otherLeft + otherDim.width / 2;

    const otherTop = other.position.y;
    const otherBottom = other.position.y + otherDim.height;
    const otherCenterY = otherTop + otherDim.height / 2;

    // Horizontal snap checks (aligning X coordinates)
    const xAlignments = [
      { diff: Math.abs(draggedLeft - otherLeft), snapX: otherLeft, lineX: otherLeft },
      { diff: Math.abs(draggedLeft - otherRight), snapX: otherRight, lineX: otherRight },
      { diff: Math.abs(draggedLeft - otherCenterX), snapX: otherCenterX, lineX: otherCenterX },
      { diff: Math.abs(draggedCenterX - otherCenterX), snapX: otherCenterX - draggedDim.width / 2, lineX: otherCenterX },
      { diff: Math.abs(draggedRight - otherLeft), snapX: otherLeft - draggedDim.width, lineX: otherLeft },
      { diff: Math.abs(draggedRight - otherRight), snapX: otherRight - draggedDim.width, lineX: otherRight },
      { diff: Math.abs(draggedRight - otherCenterX), snapX: otherCenterX - draggedDim.width, lineX: otherCenterX },
    ];

    for (const align of xAlignments) {
      if (align.diff < minDiffX) {
        minDiffX = align.diff;
        snappedPosition.x = align.snapX;
        resultLines.vertical = align.lineX;
      }
    }

    // Vertical snap checks (aligning Y coordinates)
    const yAlignments = [
      { diff: Math.abs(draggedTop - otherTop), snapY: otherTop, lineY: otherTop },
      { diff: Math.abs(draggedTop - otherBottom), snapY: otherBottom, lineY: otherBottom },
      { diff: Math.abs(draggedTop - otherCenterY), snapY: otherCenterY, lineY: otherCenterY },
      { diff: Math.abs(draggedCenterY - otherCenterY), snapY: otherCenterY - draggedDim.height / 2, lineY: otherCenterY },
      { diff: Math.abs(draggedBottom - otherTop), snapY: otherTop - draggedDim.height, lineY: otherTop },
      { diff: Math.abs(draggedBottom - otherBottom), snapY: otherBottom - draggedDim.height, lineY: otherBottom },
      { diff: Math.abs(draggedBottom - otherCenterY), snapY: otherCenterY - draggedDim.height, lineY: otherCenterY },
    ];

    for (const align of yAlignments) {
      if (align.diff < minDiffY) {
        minDiffY = align.diff;
        snappedPosition.y = align.snapY;
        resultLines.horizontal = align.lineY;
      }
    }
  }

  return {
    snappedPosition,
    lines: resultLines,
  };
}
