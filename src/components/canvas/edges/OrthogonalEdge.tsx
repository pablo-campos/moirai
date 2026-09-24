import React, { useState, useRef, useEffect } from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  type EdgeProps,
} from '@xyflow/react';
import { useDiagramStore } from '../../../store/diagramStore';

export const OrthogonalEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
  selected,
}) => {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 0,
  });

  const edgeData = (data || {}) as Record<string, unknown>;
  const labelText = (edgeData.label ?? '').toString();

  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(labelText);
  const inputRef = useRef<HTMLInputElement>(null);

  const updateEdgeLabel = useDiagramStore((s) => s.updateEdgeLabel);

  useEffect(() => {
    if (!isEditing) {
      setEditValue(labelText);
    }
  }, [labelText, isEditing]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleCommit = () => {
    const trimmed = editValue.trim();
    if (trimmed !== labelText) {
      updateEdgeLabel(id, trimmed);
    } else {
      setEditValue(labelText);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCommit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setEditValue(labelText);
      setIsEditing(false);
    }
  };

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: selected ? 'var(--selection)' : 'var(--edge)',
          strokeWidth: selected ? 2 : 1.5,
          ...style,
        }}
      />
      <EdgeLabelRenderer>
        <div
          className={`orthogonal-edge-label-container ${selected ? 'selected' : ''}`}
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
          }}
          onDoubleClick={handleDoubleClick}
        >
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              className="orthogonal-edge-label-input nodrag nopan"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleCommit}
              onKeyDown={handleKeyDown}
              placeholder="Label..."
            />
          ) : labelText ? (
            <div className="orthogonal-edge-label" title="Double click to edit">
              {labelText}
            </div>
          ) : selected ? (
            <div className="orthogonal-edge-label-placeholder" title="Double click to add label">
              + label
            </div>
          ) : null}
        </div>
      </EdgeLabelRenderer>
    </>
  );
};
