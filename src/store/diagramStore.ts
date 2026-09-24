import { create } from 'zustand';
import { temporal } from 'zundo';
import {
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type Connection,
  MarkerType,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from '@xyflow/react';

export interface NodeData {
  componentType?: string;
  label?: string;
  text?: string;
  width?: number;
  [key: string]: unknown;
}

export type IconNodeData = NodeData;

export interface DiagramState {
  nodes: Node[];
  edges: Edge[];
  isArrowMode: boolean;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: (connection: Connection) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNode: (node: Node) => void;
  updateNodeLabel: (id: string, label: string) => void;
  updateNodeData: (id: string, data: Partial<NodeData>) => void;
  updateEdgeLabel: (id: string, label: string) => void;
  setArrowMode: (active: boolean) => void;
  toggleArrowMode: () => void;
}

export const useDiagramStore = create<DiagramState>()(
  temporal(
    (set, get) => ({
      nodes: [],
      edges: [],
      isArrowMode: false,
      onNodesChange: (changes) => {
        set({
          nodes: applyNodeChanges(changes, get().nodes),
        });
      },
      onEdgesChange: (changes) => {
        set({
          edges: applyEdgeChanges(changes, get().edges),
        });
      },
      onConnect: (connection) => {
        const edgeParams: Edge = {
          ...connection,
          id: `edge-${connection.source}-${connection.sourceHandle || ''}-${connection.target}-${connection.targetHandle || ''}-${Date.now()}`,
          type: 'orthogonal',
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: 'var(--edge)',
            width: 14,
            height: 14,
          },
          data: {
            label: '',
          },
        };
        set({
          edges: addEdge(edgeParams, get().edges),
        });
      },
      setNodes: (nodes) => set({ nodes }),
      setEdges: (edges) => set({ edges }),
      addNode: (node) => {
        set({
          nodes: [...get().nodes, node],
        });
      },
      updateNodeLabel: (id, label) => {
        set({
          nodes: get().nodes.map((node) => {
            if (node.id === id) {
              return {
                ...node,
                data: {
                  ...node.data,
                  label,
                },
              };
            }
            return node;
          }),
        });
      },
      updateNodeData: (id, data) => {
        set({
          nodes: get().nodes.map((node) => {
            if (node.id === id) {
              return {
                ...node,
                data: {
                  ...node.data,
                  ...data,
                },
              };
            }
            return node;
          }),
        });
      },
      updateEdgeLabel: (id, label) => {
        set({
          edges: get().edges.map((edge) => {
            if (edge.id === id) {
              return {
                ...edge,
                data: {
                  ...edge.data,
                  label,
                },
              };
            }
            return edge;
          }),
        });
      },
      setArrowMode: (active) => set({ isArrowMode: active }),
      toggleArrowMode: () => set({ isArrowMode: !get().isArrowMode }),
    }),
    {
      partialize: (state) => ({
        nodes: state.nodes,
        edges: state.edges,
      }),
    }
  )
);
