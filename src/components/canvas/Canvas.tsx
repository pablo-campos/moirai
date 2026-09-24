import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  MiniMap,
  Panel,
  ConnectionMode,
  MarkerType,
  useReactFlow,
  useViewport,
  type Node,
  type OnConnectStartParams,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Minus, Plus, Maximize2 } from 'lucide-react';
import { useDiagramStore } from '../../store/diagramStore';
import { getComponentByType } from '../registry';
import { IconNode } from './nodes/IconNode';
import { BoxNode } from './nodes/BoxNode';
import { OrthogonalEdge } from './edges/OrthogonalEdge';
import { OrthogonalConnectionLine } from './edges/OrthogonalConnectionLine';

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
    setArrowMode,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
  } = useDiagramStore();

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

  // Exit arrow mode on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setArrowMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setArrowMode]);

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
        panOnDrag={!isArrowMode}
        zoomOnScroll={true}
        panOnScroll={false}
        selectionOnDrag={false}
        selectionKeyCode="Shift"
        minZoom={0.1}
        maxZoom={4}
        nodesDraggable={!isArrowMode}
        fitView={false}
        proOptions={{ hideAttribution: true }}
        className="diagram-react-flow"
      >
        <Background
          variant={BackgroundVariant.Dots}
          color="var(--canvas-dot)"
          bgColor="var(--bg-canvas)"
          gap={20}
          size={1.5}
        />
        <ZoomControls />
        <MiniMap
          position="bottom-right"
          className="canvas-minimap"
          zoomable
          pannable
        />
      </ReactFlow>
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
