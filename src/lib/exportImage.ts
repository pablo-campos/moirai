import { toPng, toSvg } from 'html-to-image';
import { getNodesBounds, getViewportForBounds, type Node, type Edge } from '@xyflow/react';
import type { CanvasSettings } from '../store/diagramStore';

function downloadUrl(dataUrl: string, fileName: string): void {
  const link = document.createElement('a');
  link.download = fileName;
  link.href = dataUrl;
  link.click();
}

export async function exportDiagramAsPng(
  nodes: Node[],
  fileName = 'diagram.png'
): Promise<void> {
  if (nodes.length === 0) return;

  const viewportElement = document.querySelector<HTMLElement>('.react-flow__viewport');
  if (!viewportElement) return;

  const bgColor =
    getComputedStyle(document.documentElement).getPropertyValue('--bg-canvas').trim() ||
    'transparent';

  const nodesBounds = getNodesBounds(nodes);
  const padding = 60;
  const imageWidth = Math.max(200, Math.round(nodesBounds.width + padding * 2));
  const imageHeight = Math.max(200, Math.round(nodesBounds.height + padding * 2));

  const viewport = getViewportForBounds(
    nodesBounds,
    imageWidth,
    imageHeight,
    0.1,
    4,
    padding
  );

  const dataUrl = await toPng(viewportElement, {
    backgroundColor: bgColor,
    width: imageWidth,
    height: imageHeight,
    pixelRatio: 2, // 2x high resolution
    style: {
      width: `${imageWidth}px`,
      height: `${imageHeight}px`,
      transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
    },
  });

  downloadUrl(dataUrl, fileName);
}

export async function exportDiagramAsSvg(
  nodes: Node[],
  fileName = 'diagram.svg'
): Promise<void> {
  if (nodes.length === 0) return;

  const viewportElement = document.querySelector<HTMLElement>('.react-flow__viewport');
  if (!viewportElement) return;

  const bgColor =
    getComputedStyle(document.documentElement).getPropertyValue('--bg-canvas').trim() ||
    'transparent';

  const nodesBounds = getNodesBounds(nodes);
  const padding = 60;
  const imageWidth = Math.max(200, Math.round(nodesBounds.width + padding * 2));
  const imageHeight = Math.max(200, Math.round(nodesBounds.height + padding * 2));

  const viewport = getViewportForBounds(
    nodesBounds,
    imageWidth,
    imageHeight,
    0.1,
    4,
    padding
  );

  const dataUrl = await toSvg(viewportElement, {
    backgroundColor: bgColor,
    width: imageWidth,
    height: imageHeight,
    style: {
      width: `${imageWidth}px`,
      height: `${imageHeight}px`,
      transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
    },
  });

  downloadUrl(dataUrl, fileName);
}

export function exportDiagramAsJson(
  data: { nodes: Node[]; edges: Edge[]; canvasSettings?: CanvasSettings },
  fileName = 'diagram.json'
): void {
  const jsonContent = JSON.stringify(
    {
      app: 'moirai',
      version: 1,
      timestamp: new Date().toISOString(),
      canvasSettings: data.canvasSettings,
      nodes: data.nodes,
      edges: data.edges,
    },
    null,
    2
  );

  const blob = new Blob([jsonContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  downloadUrl(url, fileName);
  URL.revokeObjectURL(url);
}

export interface ValidationResult {
  success: boolean;
  data?: {
    nodes: Node[];
    edges: Edge[];
    canvasSettings?: CanvasSettings;
  };
  error?: string;
}

export function validateAndParseDiagramJson(jsonString: string): ValidationResult {
  try {
    const parsed = JSON.parse(jsonString);

    if (!parsed || typeof parsed !== 'object') {
      return { success: false, error: 'Invalid JSON file: root must be an object.' };
    }

    if (!Array.isArray(parsed.nodes)) {
      return {
        success: false,
        error: 'Invalid diagram schema: missing or invalid "nodes" array.',
      };
    }

    if (!Array.isArray(parsed.edges)) {
      return {
        success: false,
        error: 'Invalid diagram schema: missing or invalid "edges" array.',
      };
    }

    // Basic node validation
    for (const node of parsed.nodes) {
      if (!node || typeof node !== 'object' || typeof node.id !== 'string') {
        return {
          success: false,
          error: 'Invalid diagram schema: each node must have a valid string "id".',
        };
      }
      if (!node.position || typeof node.position.x !== 'number' || typeof node.position.y !== 'number') {
        return {
          success: false,
          error: `Node "${node.id}" has invalid position coordinates.`,
        };
      }
    }

    // Basic edge validation
    for (const edge of parsed.edges) {
      if (!edge || typeof edge !== 'object' || typeof edge.id !== 'string') {
        return {
          success: false,
          error: 'Invalid diagram schema: each edge must have a valid string "id".',
        };
      }
      if (typeof edge.source !== 'string' || typeof edge.target !== 'string') {
        return {
          success: false,
          error: `Edge "${edge.id}" is missing source or target references.`,
        };
      }
    }

    return {
      success: true,
      data: {
        nodes: parsed.nodes,
        edges: parsed.edges,
        canvasSettings: parsed.canvasSettings,
      },
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Malformed JSON syntax';
    return { success: false, error: `Failed to parse JSON file: ${msg}` };
  }
}
