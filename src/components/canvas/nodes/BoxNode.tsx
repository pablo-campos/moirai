import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { Handle, Position, NodeResizer, type NodeProps, type ResizeParams } from '@xyflow/react';
import { boxPoints } from '../../../lib/boxGeometry';
import { useDiagramStore, type NodeData } from '../../../store/diagramStore';

export const BoxNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const nodeData = data as unknown as NodeData;
  const initialText = (nodeData.text ?? nodeData.label ?? 'Service Box').toString();
  const width = typeof nodeData.width === 'number' ? Math.max(100, nodeData.width) : 160;
  const fontSize = nodeData.fontSize || 'M';
  const textAlign = nodeData.textAlign || 'center';
  const fillColor = nodeData.fill;
  const strokeColor = nodeData.strokeColor;
  const strokeStyle = nodeData.strokeStyle || 'solid';
  const isLocked = Boolean(nodeData.locked);

  const fillStyle =
    fillColor === 'transparent'
      ? 'transparent'
      : fillColor
      ? `var(--${fillColor})`
      : 'var(--node-fill)';

  const strokeVal = strokeColor ? `var(--${strokeColor})` : 'var(--node-stroke)';
  const strokeDash = strokeStyle === 'dashed' ? '5 5' : undefined;

  const fontPx = fontSize === 'S' ? 12 : fontSize === 'L' ? 16 : 14;

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(initialText);
  const [textHeight, setTextHeight] = useState(20);

  const textMeasureRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const updateNodeData = useDiagramStore((s) => s.updateNodeData);
  const isArrowMode = useDiagramStore((s) => s.isArrowMode);

  useEffect(() => {
    if (!isEditing) {
      setEditText(initialText);
    }
  }, [initialText, isEditing]);

  // Measure text height using ResizeObserver
  useLayoutEffect(() => {
    if (!textMeasureRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setTextHeight(entry.contentRect.height);
      }
    });
    observer.observe(textMeasureRef.current);
    return () => observer.disconnect();
  }, [editText, width, fontPx]);

  // Height formula: min 36px (single-line), or measured height + vertical padding
  const height = Math.max(36, Math.ceil(textHeight + 14));

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleCommit = () => {
    const trimmed = editText.trim();
    if (trimmed && trimmed !== initialText) {
      updateNodeData(id, { text: trimmed });
    } else {
      setEditText(initialText);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setEditText(initialText);
      setIsEditing(false);
    }
  };

  const handleResize = (_event: unknown, params: ResizeParams) => {
    updateNodeData(id, { width: Math.max(100, Math.round(params.width)) });
  };

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  const points = boxPoints(width, height, 18);

  return (
    <div
      className={`box-node-container ${selected ? 'selected' : ''} ${isArrowMode ? 'in-arrow-mode' : ''} ${isLocked ? 'locked' : ''}`}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <NodeResizer
        isVisible={Boolean(selected) && !isLocked}
        minWidth={100}
        minHeight={height}
        maxHeight={height}
        handleClassName="box-resizer-handle"
        lineClassName="box-resizer-line"
        onResize={handleResize}
      />

      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className="box-node-handle"
        style={{ left: '50%', top: 0 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="box-node-handle"
        style={{ top: `${height / 2}px`, right: 0 }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="box-node-handle"
        style={{ left: '50%', top: `${height}px` }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="box-node-handle"
        style={{ top: `${height / 2}px`, left: 0 }}
      />

      {isArrowMode && !isEditing && (
        <Handle
          type="source"
          position={Position.Top}
          id="arrow-mode-trigger"
          className="arrow-mode-overlay-handle"
        />
      )}

      <div className="box-node-shape" style={{ width: `${width}px`, height: `${height}px` }}>
        <svg
          width={width}
          height={height}
          className="box-node-svg"
          viewBox={`0 0 ${width} ${height}`}
        >
          <polygon
            points={points}
            className="box-node-polygon"
            style={{
              fill: fillStyle,
              stroke: strokeVal,
              strokeDasharray: strokeDash,
            }}
          />
        </svg>

        <div
          ref={textMeasureRef}
          className="box-node-text-content"
          style={{
            width: `${width}px`,
            fontSize: `${fontPx}px`,
            textAlign,
          }}
          onDoubleClick={handleDoubleClick}
        >
          {isEditing ? (
            <textarea
              ref={textareaRef}
              className="box-node-textarea nodrag nopan"
              style={{
                fontSize: `${fontPx}px`,
                textAlign,
              }}
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onBlur={handleCommit}
              onKeyDown={handleKeyDown}
              rows={1}
            />
          ) : (
            <span className="box-node-text" title="Double click to edit">
              {editText}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
