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
import { loadDiagram, saveDiagram, clearSavedDiagram } from '../lib/persistence';

export type SwatchColor =
  | 'swatch-neutral'
  | 'swatch-blue'
  | 'swatch-green'
  | 'swatch-amber'
  | 'swatch-red'
  | 'swatch-violet';

export const SWATCH_COLORS: SwatchColor[] = [
  'swatch-neutral',
  'swatch-blue',
  'swatch-green',
  'swatch-amber',
  'swatch-red',
  'swatch-violet',
];

export interface CanvasSettings {
  showGrid: boolean;
  snapToGrid: boolean;
  gridSize: number; // 10 or 20
  showMinimap: boolean;
}

export interface NodeData {
  componentType?: string;
  label?: string;
  labelPosition?: 'below' | 'right';
  iconSize?: 'S' | 'M' | 'L';
  iconColor?: string; // swatch token name
  locked?: boolean;
  text?: string;
  fontSize?: 'S' | 'M' | 'L';
  textAlign?: 'left' | 'center' | 'right';
  fill?: string; // swatch token name or 'transparent'
  strokeColor?: string; // swatch token name
  strokeStyle?: 'solid' | 'dashed';
  width?: number;
  [key: string]: unknown;
}

export type IconNodeData = NodeData;

export interface EdgeData {
  label?: string;
  lineStyle?: 'solid' | 'dashed' | 'dotted';
  strokeWidth?: number; // 1, 1.5, 2, 3
  arrowheads?: 'none' | 'end' | 'start' | 'both';
  color?: string; // swatch token name
  [key: string]: unknown;
}

export interface DiagramState {
  nodes: Node[];
  edges: Edge[];
  isArrowMode: boolean;
  canvasSettings: CanvasSettings;
  clipboard: { nodes: Node[]; edges: Edge[] } | null;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: (connection: Connection) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNode: (node: Node) => void;
  updateCanvasSettings: (settings: Partial<CanvasSettings>) => void;
  updateNodeLabel: (id: string, label: string) => void;
  updateNodeData: (id: string, data: Partial<NodeData>) => void;
  updateNodePosition: (id: string, position: { x: number; y: number }) => void;
  updateEdgeLabel: (id: string, label: string) => void;
  updateEdgeData: (id: string, data: Partial<EdgeData>) => void;
  setArrowMode: (active: boolean) => void;
  toggleArrowMode: () => void;
  duplicateSelected: () => void;
  deleteSelected: () => void;
  alignSelected: (type: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void;
  distributeSelected: (direction: 'horizontal' | 'vertical') => void;
  batchUpdateSelectedNodes: (data: Partial<NodeData>) => void;
  batchUpdateSelectedEdges: (data: Partial<EdgeData>) => void;
  bringToFront: (id?: string) => void;
  sendToBack: (id?: string) => void;
  copySelected: () => void;
  pasteClipboard: () => void;
  selectAll: () => void;
  deselectAll: () => void;
  nudgeSelected: (dx: number, dy: number) => void;
  clearDiagram: () => void;
  importDiagram: (data: {
    nodes: Node[];
    edges: Edge[];
    canvasSettings?: CanvasSettings;
  }) => void;
}

const initialSavedData = loadDiagram();

const defaultCanvasSettings: CanvasSettings = {
  showGrid: true,
  snapToGrid: false,
  gridSize: 20,
  showMinimap: true,
};

export const useDiagramStore = create<DiagramState>()(
  temporal(
    (set, get) => ({
      nodes: initialSavedData?.nodes ?? [],
      edges: initialSavedData?.edges ?? [],
      isArrowMode: false,
      canvasSettings: initialSavedData?.canvasSettings ?? defaultCanvasSettings,
      clipboard: null,
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
            lineStyle: 'solid',
            strokeWidth: 1.5,
            arrowheads: 'end',
            color: 'edge',
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
      updateCanvasSettings: (settings) => {
        set({
          canvasSettings: {
            ...get().canvasSettings,
            ...settings,
          },
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
              const updatedData = {
                ...node.data,
                ...data,
              };
              return {
                ...node,
                draggable: updatedData.locked ? false : true,
                data: updatedData,
              };
            }
            return node;
          }),
        });
      },
      updateNodePosition: (id, position) => {
        set({
          nodes: get().nodes.map((node) => {
            if (node.id === id) {
              return {
                ...node,
                position: { ...position },
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
      updateEdgeData: (id, data) => {
        set({
          edges: get().edges.map((edge) => {
            if (edge.id === id) {
              const updatedData = {
                ...edge.data,
                ...data,
              };
              return {
                ...edge,
                data: updatedData,
              };
            }
            return edge;
          }),
        });
      },
      setArrowMode: (active) => set({ isArrowMode: active }),
      toggleArrowMode: () => set({ isArrowMode: !get().isArrowMode }),
      duplicateSelected: () => {
        const { nodes, edges } = get();
        const selectedNodes = nodes.filter((n) => n.selected);
        const selectedEdges = edges.filter((e) => e.selected);

        if (selectedNodes.length === 0 && selectedEdges.length === 0) return;

        const idMap = new Map<string, string>();
        const duplicatedNodes: Node[] = selectedNodes.map((n) => {
          const newId = `node-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
          idMap.set(n.id, newId);
          return {
            ...n,
            id: newId,
            selected: true,
            position: {
              x: n.position.x + 30,
              y: n.position.y + 30,
            },
            data: { ...n.data },
          };
        });

        // Duplicate edges that connect within duplicated nodes or standalone selected edges
        const duplicatedEdges: Edge[] = [];
        edges.forEach((edge) => {
          const isBetweenDuplicatedNodes = idMap.has(edge.source) && idMap.has(edge.target);
          if (isBetweenDuplicatedNodes) {
            const newEdgeId = `edge-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
            duplicatedEdges.push({
              ...edge,
              id: newEdgeId,
              source: idMap.get(edge.source)!,
              target: idMap.get(edge.target)!,
              selected: true,
              data: { ...edge.data },
            });
          }
        });

        // Deselect original nodes & edges
        const nextNodes: Node[] = [
          ...nodes.map((n) => ({ ...n, selected: false })),
          ...duplicatedNodes,
        ];
        const nextEdges: Edge[] = [
          ...edges.map((e) => ({ ...e, selected: false })),
          ...duplicatedEdges,
        ];

        set({
          nodes: nextNodes,
          edges: nextEdges,
        });
      },
      deleteSelected: () => {
        const { nodes, edges } = get();
        const selectedNodeIds = new Set(nodes.filter((n) => n.selected).map((n) => n.id));
        const selectedEdgeIds = new Set(edges.filter((e) => e.selected).map((e) => e.id));

        const nextNodes = nodes.filter((n) => !selectedNodeIds.has(n.id));
        const nextEdges = edges.filter(
          (e) =>
            !selectedEdgeIds.has(e.id) &&
            !selectedNodeIds.has(e.source) &&
            !selectedNodeIds.has(e.target)
        );

        set({
          nodes: nextNodes,
          edges: nextEdges,
        });
      },
      alignSelected: (type) => {
        const { nodes } = get();
        const selectedNodes = nodes.filter((n) => n.selected);
        if (selectedNodes.length < 2) return;

        const getNodeWidth = (node: Node) => {
          if (node.type === 'box') {
            return typeof node.data?.width === 'number' ? node.data.width : 160;
          }
          const size = node.data?.iconSize;
          if (size === 'S') return 36;
          if (size === 'L') return 64;
          return 48;
        };

        const getNodeHeight = (node: Node) => {
          if (node.type === 'box') {
            return (node.measured?.height as number) || 40;
          }
          const size = node.data?.iconSize;
          if (size === 'S') return 48;
          if (size === 'L') return 76;
          return 64;
        };

        let targetVal = 0;
        if (type === 'left') {
          targetVal = Math.min(...selectedNodes.map((n) => n.position.x));
        } else if (type === 'top') {
          targetVal = Math.min(...selectedNodes.map((n) => n.position.y));
        } else if (type === 'right') {
          targetVal = Math.max(...selectedNodes.map((n) => n.position.x + getNodeWidth(n)));
        } else if (type === 'bottom') {
          targetVal = Math.max(...selectedNodes.map((n) => n.position.y + getNodeHeight(n)));
        } else if (type === 'center') {
          const centers = selectedNodes.map((n) => n.position.x + getNodeWidth(n) / 2);
          targetVal = centers.reduce((a, b) => a + b, 0) / centers.length;
        } else if (type === 'middle') {
          const middles = selectedNodes.map((n) => n.position.y + getNodeHeight(n) / 2);
          targetVal = middles.reduce((a, b) => a + b, 0) / middles.length;
        }

        const nextNodes = nodes.map((node) => {
          if (!node.selected) return node;
          const w = getNodeWidth(node);
          const h = getNodeHeight(node);
          let newX = node.position.x;
          let newY = node.position.y;

          if (type === 'left') newX = targetVal;
          else if (type === 'right') newX = targetVal - w;
          else if (type === 'center') newX = targetVal - w / 2;
          else if (type === 'top') newY = targetVal;
          else if (type === 'bottom') newY = targetVal - h;
          else if (type === 'middle') newY = targetVal - h / 2;

          return {
            ...node,
            position: { x: Math.round(newX), y: Math.round(newY) },
          };
        });

        set({ nodes: nextNodes });
      },
      distributeSelected: (direction) => {
        const { nodes } = get();
        const selectedNodes = nodes.filter((n) => n.selected);
        if (selectedNodes.length < 3) return;

        if (direction === 'horizontal') {
          const sorted = [...selectedNodes].sort((a, b) => a.position.x - b.position.x);
          const minX = sorted[0].position.x;
          const maxX = sorted[sorted.length - 1].position.x;
          const step = (maxX - minX) / (sorted.length - 1);

          const posMap = new Map<string, number>();
          sorted.forEach((n, idx) => {
            posMap.set(n.id, Math.round(minX + idx * step));
          });

          set({
            nodes: nodes.map((node) =>
              posMap.has(node.id)
                ? { ...node, position: { ...node.position, x: posMap.get(node.id)! } }
                : node
            ),
          });
        } else {
          const sorted = [...selectedNodes].sort((a, b) => a.position.y - b.position.y);
          const minY = sorted[0].position.y;
          const maxY = sorted[sorted.length - 1].position.y;
          const step = (maxY - minY) / (sorted.length - 1);

          const posMap = new Map<string, number>();
          sorted.forEach((n, idx) => {
            posMap.set(n.id, Math.round(minY + idx * step));
          });

          set({
            nodes: nodes.map((node) =>
              posMap.has(node.id)
                ? { ...node, position: { ...node.position, y: posMap.get(node.id)! } }
                : node
            ),
          });
        }
      },
      batchUpdateSelectedNodes: (data) => {
        set({
          nodes: get().nodes.map((node) => {
            if (node.selected) {
              const updatedData = { ...node.data, ...data };
              return {
                ...node,
                draggable: updatedData.locked ? false : true,
                data: updatedData,
              };
            }
            return node;
          }),
        });
      },
      batchUpdateSelectedEdges: (data) => {
        set({
          edges: get().edges.map((edge) => {
            if (edge.selected) {
              return {
                ...edge,
                data: {
                  ...edge.data,
                  ...data,
                },
              };
            }
            return edge;
          }),
        });
      },
      bringToFront: (id) => {
        const { nodes } = get();
        const targetIds = new Set(
          id ? [id] : nodes.filter((n) => n.selected).map((n) => n.id)
        );
        if (targetIds.size === 0) return;

        const remaining = nodes.filter((n) => !targetIds.has(n.id));
        const elevated = nodes.filter((n) => targetIds.has(n.id));
        set({ nodes: [...remaining, ...elevated] });
      },
      sendToBack: (id) => {
        const { nodes } = get();
        const targetIds = new Set(
          id ? [id] : nodes.filter((n) => n.selected).map((n) => n.id)
        );
        if (targetIds.size === 0) return;

        const remaining = nodes.filter((n) => !targetIds.has(n.id));
        const lowered = nodes.filter((n) => targetIds.has(n.id));
        set({ nodes: [...lowered, ...remaining] });
      },
      copySelected: () => {
        const { nodes, edges } = get();
        const selectedNodes = nodes.filter((n) => n.selected);
        const selectedNodeIds = new Set(selectedNodes.map((n) => n.id));
        const internalEdges = edges.filter(
          (e) => selectedNodeIds.has(e.source) && selectedNodeIds.has(e.target)
        );

        if (selectedNodes.length > 0) {
          set({
            clipboard: {
              nodes: selectedNodes,
              edges: internalEdges,
            },
          });
        }
      },
      pasteClipboard: () => {
        const { nodes, edges, clipboard } = get();
        if (!clipboard || clipboard.nodes.length === 0) return;

        const idMap = new Map<string, string>();
        const pastedNodes: Node[] = clipboard.nodes.map((n) => {
          const newId = `node-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
          idMap.set(n.id, newId);
          return {
            ...n,
            id: newId,
            selected: true,
            position: {
              x: n.position.x + 30,
              y: n.position.y + 30,
            },
            data: { ...n.data },
          };
        });

        const pastedEdges: Edge[] = clipboard.edges.map((e) => {
          const newEdgeId = `edge-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
          return {
            ...e,
            id: newEdgeId,
            source: idMap.get(e.source) || e.source,
            target: idMap.get(e.target) || e.target,
            selected: true,
            data: { ...e.data },
          };
        });

        const nextNodes: Node[] = [
          ...nodes.map((n) => ({ ...n, selected: false })),
          ...pastedNodes,
        ];
        const nextEdges: Edge[] = [
          ...edges.map((e) => ({ ...e, selected: false })),
          ...pastedEdges,
        ];

        set({
          nodes: nextNodes,
          edges: nextEdges,
          // Update clipboard with shifted coordinates for subsequent pastes
          clipboard: {
            nodes: pastedNodes,
            edges: pastedEdges,
          },
        });
      },
      selectAll: () => {
        set({
          nodes: get().nodes.map((n) => ({ ...n, selected: true })),
          edges: get().edges.map((e) => ({ ...e, selected: true })),
        });
      },
      deselectAll: () => {
        set({
          nodes: get().nodes.map((n) => ({ ...n, selected: false })),
          edges: get().edges.map((e) => ({ ...e, selected: false })),
        });
      },
      nudgeSelected: (dx, dy) => {
        set({
          nodes: get().nodes.map((node) => {
            if (!node.selected) return node;
            return {
              ...node,
              position: {
                x: Math.round(node.position.x + dx),
                y: Math.round(node.position.y + dy),
              },
            };
          }),
        });
      },
      clearDiagram: () => {
        clearSavedDiagram();
        set({
          nodes: [],
          edges: [],
          isArrowMode: false,
        });
        useDiagramStore.temporal.getState().clear();
      },
      importDiagram: (data) => {
        const nextNodes = data.nodes.map((n) => ({ ...n, selected: false }));
        const nextEdges = data.edges.map((e) => ({ ...e, selected: false }));
        const nextSettings = data.canvasSettings
          ? { ...get().canvasSettings, ...data.canvasSettings }
          : get().canvasSettings;

        set({
          nodes: nextNodes,
          edges: nextEdges,
          canvasSettings: nextSettings,
          isArrowMode: false,
        });

        // Save immediately and reset history
        saveDiagram({
          nodes: nextNodes,
          edges: nextEdges,
          canvasSettings: nextSettings,
        });
        useDiagramStore.temporal.getState().clear();
      },
    }),
    {
      partialize: (state) => ({
        nodes: state.nodes,
        edges: state.edges,
        canvasSettings: state.canvasSettings,
      }),
    }
  )
);

// Autosave subscription with 500ms debounce
let autosaveTimeout: ReturnType<typeof setTimeout> | null = null;
useDiagramStore.subscribe((state) => {
  if (autosaveTimeout) {
    clearTimeout(autosaveTimeout);
  }
  autosaveTimeout = setTimeout(() => {
    saveDiagram({
      nodes: state.nodes,
      edges: state.edges,
      canvasSettings: state.canvasSettings,
    });
  }, 500);
});
