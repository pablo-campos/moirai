import { create } from 'zustand';

export interface DiagramState {
  nodes: unknown[];
  edges: unknown[];
}

export const useDiagramStore = create<DiagramState>(() => ({
  nodes: [],
  edges: [],
}));
