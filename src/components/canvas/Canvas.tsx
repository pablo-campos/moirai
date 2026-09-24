import React from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  MiniMap,
  Panel,
  useReactFlow,
  useViewport,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Minus, Plus, Maximize2 } from 'lucide-react';
import { useDiagramStore } from '../../store/diagramStore';

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
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useDiagramStore();

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      panOnDrag={true}
      zoomOnScroll={true}
      panOnScroll={false}
      selectionOnDrag={false}
      selectionKeyCode="Shift"
      minZoom={0.1}
      maxZoom={4}
      nodesDraggable={true}
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
