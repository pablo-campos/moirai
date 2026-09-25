import React, { useRef, useEffect, useMemo, useCallback, useState } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  MiniMap,
  Panel,
  ConnectionMode,
  SelectionMode,
  MarkerType,
  useReactFlow,
  useViewport,
  type Node,
  type Edge,
  type OnConnectStartParams,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Minus, Plus, Maximize2 } from 'lucide-react';
import { APP_NAME, LOGO_SRC } from '../../config/brand';
import { useDiagramStore } from '../../store/diagramStore';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { getComponentByType } from '../registry';
import { IconNode } from './nodes/IconNode';
import { BoxNode } from './nodes/BoxNode';
import { OrthogonalEdge } from './edges/OrthogonalEdge';
import { OrthogonalConnectionLine } from './edges/OrthogonalConnectionLine';
import { HelperLinesRenderer } from './HelperLines';
import { ContextMenu, type ContextMenuState } from './ContextMenu';
import { getHelperLines, type HelperLines } from '../../lib/helperLines';

const ZoomControls: React.FC = () => {
  const { zoomIn, zoomOut, fitView, zoomTo } = useReactFlow();
  const { zoom } = useViewport();

  const handleResetZoom = () => {
    zoomTo(1, { duration: 150 });
  };

  return (
    <Panel position="bottom-left" className="zoom-controls-panel">
      <div className="zoom-controls">
        <button
          type="button"
          className="zoom-btn"
          onClick={() => zoomOut({ duration: 150 })}
          title="Zoom out"
          aria-label="Zoom out"
        >
          <Minus size={14} />
        </button>
        <button
          type="button"
          className="zoom-level-btn"
          onClick={handleResetZoom}
          title="Reset zoom to 100%"
          aria-label="Reset zoom to 100%"
        >
          {Math.round(zoom * 100)}%
        </button>
        <button
          type="button"
          className="zoom-btn"
          onClick={() => zoomIn({ duration: 150 })}
          title="Zoom in"
          aria-label="Zoom in"
        >
          <Plus size={14} />
        </button>
        <div className="zoom-divider" />
        <button
          type="button"
          className="zoom-btn"
          onClick={() => fitView({ duration: 200, padding: 0.2 })}
          title="Fit view"
          aria-label="Fit view"
        >
          <Maximize2 size={14} />
        </button>
      </div>
    </Panel>
  );
};

const CanvasInner: React.FC = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();
  const {
    nodes,
    edges,
    isArrowMode,
    canvasSettings,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    setNodes,
    setEdges,
  } = useDiagramStore();

  useKeyboardShortcuts();

  const [helperLines, setHelperLines] = useState<HelperLines>({});
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);

  const connectingNodeId = useRef<string | null>(null);
  const connectingHandleId = useRef<string | null>(null);

  const nodeTypes = useMemo(
    () => ({
      icon: IconNode,
      box: BoxNode,
    }),
    []
  );

  const edgeTypes = useMemo(
    () => ({
      orthogonal: OrthogonalEdge,
    }),
    []
  );

  const defaultEdgeOptions = useMemo(
    () => ({
      type: 'orthogonal',
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: 'var(--edge)',
        width: 14,
        height: 14,
      },
    }),
    []
  );

  const handleConnectStart = useCallback(
    (_: MouseEvent | TouchEvent, params: OnConnectStartParams) => {
      connectingNodeId.current = params.nodeId;
      connectingHandleId.current = params.handleId;
    },
    []
  );

  const handleConnectEnd = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (!connectingNodeId.current) return;

      const targetIsHandle = (event.target as Element)?.classList?.contains('react-flow__handle');
      if (targetIsHandle) {
        connectingNodeId.current = null;
        connectingHandleId.current = null;
        return;
      }

      const clientX = 'clientX' in event ? event.clientX : event.touches?.[0]?.clientX;
      const clientY = 'clientY' in event ? event.clientY : event.touches?.[0]?.clientY;

      if (clientX !== undefined && clientY !== undefined) {
        const element = document.elementFromPoint(clientX, clientY);
        const nodeElement = element?.closest('.react-flow__node');

        if (nodeElement) {
          const targetNodeId = nodeElement.getAttribute('data-id');

          if (targetNodeId && targetNodeId !== connectingNodeId.current) {
            // Find the closest standard connection handle on target node
            const handles = Array.from(
              nodeElement.querySelectorAll('.react-flow__handle:not(.arrow-mode-overlay-handle)')
            );

            let nearestHandle: Element | null = null;
            let minDistance = Infinity;

            for (const handle of handles) {
              const rect = handle.getBoundingClientRect();
              const handleCenterX = rect.left + rect.width / 2;
              const handleCenterY = rect.top + rect.height / 2;
              const dist = Math.hypot(clientX - handleCenterX, clientY - handleCenterY);
              if (dist < minDistance) {
                minDistance = dist;
                nearestHandle = handle;
              }
            }

            if (nearestHandle) {
              const targetHandleId = nearestHandle.getAttribute('data-handleid') || null;
              onConnect({
                source: connectingNodeId.current,
                sourceHandle:
                  connectingHandleId.current === 'arrow-mode-trigger'
                    ? null
                    : connectingHandleId.current,
                target: targetNodeId,
                targetHandle: targetHandleId,
              });
            }
          }
        }
      }

      connectingNodeId.current = null;
      connectingHandleId.current = null;
    },
    [onConnect]
  );

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow/type');
      if (!type) return;

      const def = getComponentByType(type);
      if (!def) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      let newNode: Node;
      if (def.nodeKind === 'box') {
        newNode = {
          id: `node-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          type: 'box',
          position: {
            x: position.x - 80,
            y: position.y - 18,
          },
          data: {
            componentType: def.type,
            text: 'Service Box',
            width: 160,
          },
        };
      } else {
        newNode = {
          id: `node-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          type: 'icon',
          position: {
            x: position.x - 24,
            y: position.y - 24,
          },
          data: {
            componentType: def.type,
            label: def.label,
          },
        };
      }

      addNode(newNode);
    },
    [screenToFlowPosition, addNode]
  );

  useEffect(() => {
    const handleAddAtCenter = (event: Event) => {
      const customEvent = event as CustomEvent<{ type: string }>;
      const type = customEvent.detail?.type;
      if (!type) return;

      const def = getComponentByType(type);
      if (!def) return;

      const bounds = reactFlowWrapper.current?.getBoundingClientRect();
      const centerScreen = bounds
        ? {
            x: bounds.left + bounds.width / 2,
            y: bounds.top + bounds.height / 2,
          }
        : {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
          };

      const position = screenToFlowPosition(centerScreen);

      let newNode: Node;
      if (def.nodeKind === 'box') {
        newNode = {
          id: `node-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          type: 'box',
          position: {
            x: position.x - 80,
            y: position.y - 18,
          },
          data: {
            componentType: def.type,
            text: 'Service Box',
            width: 160,
          },
        };
      } else {
        newNode = {
          id: `node-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          type: 'icon',
          position: {
            x: position.x - 24,
            y: position.y - 24,
          },
          data: {
            componentType: def.type,
            label: def.label,
          },
        };
      }

      addNode(newNode);
    };

    window.addEventListener('add-node-at-center', handleAddAtCenter);
    return () => {
      window.removeEventListener('add-node-at-center', handleAddAtCenter);
    };
  }, [screenToFlowPosition, addNode]);

  // Helper lines during node drag
  const handleNodeDrag = useCallback(
    (_event: MouseEvent | TouchEvent, node: Node) => {
      const { lines } = getHelperLines(node, nodes);
      setHelperLines(lines);
    },
    [nodes]
  );

  const handleNodeDragStop = useCallback(() => {
    setHelperLines({});
  }, []);

  // Context Menu handlers
  const handleNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.preventDefault();
      // Select the right-clicked node if not already selected
      if (!node.selected) {
        setNodes(
          nodes.map((n) => ({
            ...n,
            selected: n.id === node.id,
          }))
        );
        setEdges(edges.map((e) => ({ ...e, selected: false })));
      }
      setContextMenu({
        x: event.clientX,
        y: event.clientY,
        nodeId: node.id,
      });
    },
    [nodes, edges, setNodes, setEdges]
  );

  const handleEdgeContextMenu = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      event.preventDefault();
      if (!edge.selected) {
        setEdges(
          edges.map((e) => ({
            ...e,
            selected: e.id === edge.id,
          }))
        );
        setNodes(nodes.map((n) => ({ ...n, selected: false })));
      }
      setContextMenu({
        x: event.clientX,
        y: event.clientY,
        edgeId: edge.id,
      });
    },
    [nodes, edges, setNodes, setEdges]
  );

  const handlePaneClick = useCallback(() => {
    setContextMenu(null);
  }, []);

  return (
    <div
      ref={reactFlowWrapper}
      className={`canvas-wrapper ${isArrowMode ? 'arrow-mode-active' : ''}`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        connectionMode={ConnectionMode.Loose}
        connectionLineComponent={OrthogonalConnectionLine}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectStart={handleConnectStart}
        onConnectEnd={handleConnectEnd}
        onNodeDrag={handleNodeDrag}
        onNodeDragStop={handleNodeDragStop}
        onNodeContextMenu={handleNodeContextMenu}
        onEdgeContextMenu={handleEdgeContextMenu}
        onPaneClick={handlePaneClick}
        snapToGrid={canvasSettings.snapToGrid}
        snapGrid={[canvasSettings.gridSize, canvasSettings.gridSize]}
        panOnDrag={!isArrowMode}
        zoomOnScroll={true}
        panOnScroll={false}
        selectionOnDrag={false}
        selectionKeyCode="Shift"
        multiSelectionKeyCode={['Shift', 'Meta', 'Control']}
        selectionMode={SelectionMode.Partial}
        minZoom={0.1}
        maxZoom={4}
        nodesDraggable={!isArrowMode}
        fitView={false}
        proOptions={{ hideAttribution: true }}
        className="diagram-react-flow"
      >
        {canvasSettings.showGrid && (
          <Background
            variant={BackgroundVariant.Dots}
            color="var(--canvas-dot)"
            bgColor="var(--bg-canvas)"
            gap={canvasSettings.gridSize}
            size={1.5}
          />
        )}
        <HelperLinesRenderer lines={helperLines} />
        <ZoomControls />
        {canvasSettings.showMinimap && (
          <MiniMap
            position="bottom-right"
            className="canvas-minimap"
            zoomable
            pannable
          />
        )}
      </ReactFlow>

      {nodes.length === 0 && (
        <div className="empty-canvas-hint">
          <div className="empty-hint-card">
            <div className="empty-hint-logo">
              <img src={LOGO_SRC} alt={`${APP_NAME} logo`} />
            </div>
            <span className="empty-hint-brand">{APP_NAME}</span>
            <span className="empty-hint-title">Empty Canvas</span>
            <span className="empty-hint-subtitle">
              Drag components from the left palette to start
            </span>
          </div>
        </div>
      )}

      {contextMenu && (
        <ContextMenu
          menu={contextMenu}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
};

export const Canvas: React.FC = () => {
  return (
    <main className="canvas-container" aria-label="Diagram canvas">
      <ReactFlowProvider>
        <CanvasInner />
      </ReactFlowProvider>
    </main>
  );
};
