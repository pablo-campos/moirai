import type { Node, Edge } from '@xyflow/react';
import type { CanvasSettings } from '../store/diagramStore';

const STORAGE_KEY = 'moirai_diagram_data';

export interface SavedDiagramData {
  nodes: Node[];
  edges: Edge[];
  canvasSettings?: CanvasSettings;
  version: number;
}

export function saveDiagram(data: {
  nodes: Node[];
  edges: Edge[];
  canvasSettings?: CanvasSettings;
}): void {
  try {
    const payload: SavedDiagramData = {
      nodes: data.nodes,
      edges: data.edges,
      canvasSettings: data.canvasSettings,
      version: 1,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.error('Failed to save diagram to localStorage', err);
  }
}

export function loadDiagram(): SavedDiagramData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SavedDiagramData;
    if (parsed && Array.isArray(parsed.nodes) && Array.isArray(parsed.edges)) {
      return parsed;
    }
  } catch (err) {
    console.error('Failed to load diagram from localStorage', err);
  }
  return null;
}

export function clearSavedDiagram(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear diagram from localStorage', err);
  }
}
