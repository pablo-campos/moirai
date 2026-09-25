import React, { useState, useRef, useEffect } from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  type EdgeProps,
} from '@xyflow/react';
import { useDiagramStore, type EdgeData } from '../../../store/diagramStore';

export const OrthogonalEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
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

  const edgeData = (data || {}) as EdgeData;
  const labelText = (edgeData.label ?? '').toString();
  const lineStyle = edgeData.lineStyle || 'solid';
  const customStrokeWidth = typeof edgeData.strokeWidth === 'number' ? edgeData.strokeWidth : 1.5;
  const colorToken = edgeData.color;
  const arrowheads = edgeData.arrowheads ?? 'end';

  const strokeColor = selected
    ? 'var(--selection)'
    : colorToken
    ? `var(--${colorToken})`
    : 'var(--edge)';

  const strokeDash =
    lineStyle === 'dashed' ? '6 6' : lineStyle === 'dotted' ? '2 4' : undefined;

  const strokeWidth = selected ? Math.max(2, customStrokeWidth) : customStrokeWidth;

  const showMarkerStart = arrowheads === 'start' || arrowheads === 'both';
  const showMarkerEnd = arrowheads === 'end' || arrowheads === 'both';

  const markerStartId = `marker-start-${id}`;
  const markerEndId = `marker-end-${id}`;

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
      <defs>
        {showMarkerStart && (
          <marker
            id={markerStartId}
            viewBox="0 0 10 10"
            refX="7"
            refY="5"
            markerWidth={6 + strokeWidth}
            markerHeight={6 + strokeWidth}
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill={strokeColor} />
          </marker>
        )}
        {showMarkerEnd && (
          <marker
            id={markerEndId}
            viewBox="0 0 10 10"
            refX="7"
            refY="5"
            markerWidth={6 + strokeWidth}
            markerHeight={6 + strokeWidth}
            orient="auto"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill={strokeColor} />
          </marker>
        )}
      </defs>
      <BaseEdge
        id={id}
        path={edgePath}
        markerStart={showMarkerStart ? `url(#${markerStartId})` : undefined}
        markerEnd={showMarkerEnd ? `url(#${markerEndId})` : undefined}
        style={{
          stroke: strokeColor,
          strokeWidth,
          strokeDasharray: strokeDash,
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
