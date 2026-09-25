import React, { useState, useRef, useEffect } from 'react';
import { Handle, Position, NodeResizer, type NodeProps, type ResizeParams } from '@xyflow/react';
import { useDiagramStore, type NodeData } from '../../../store/diagramStore';

export const RectangleNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const nodeData = data as unknown as NodeData;
  const initialText = (nodeData.text ?? nodeData.label ?? '').toString();
  const width = typeof nodeData.width === 'number' ? Math.max(40, nodeData.width) : 180;
  const height = typeof nodeData.height === 'number' ? Math.max(30, nodeData.height) : 100;
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
      ? `var(--${fillColor}-alpha, var(--${fillColor}))`
      : 'var(--node-fill)';

  const strokeVal = selected
    ? 'var(--selection)'
    : strokeColor
    ? `var(--${strokeColor})`
    : 'var(--node-stroke)';

  const strokeDash =
    strokeStyle === 'dashed' ? '6 4' : strokeStyle === 'dotted' ? '2 3' : undefined;

  const fontPx = fontSize === 'S' ? 12 : fontSize === 'L' ? 16 : 14;

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(initialText);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const updateNodeData = useDiagramStore((s) => s.updateNodeData);
  const isArrowMode = useDiagramStore((s) => s.isArrowMode);

  useEffect(() => {
    if (!isEditing) {
      setEditText(initialText);
    }
  }, [initialText, isEditing]);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleCommit = () => {
    const trimmed = editText.trim();
    if (trimmed !== initialText) {
      updateNodeData(id, { text: trimmed });
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
    updateNodeData(id, {
      width: Math.max(40, Math.round(params.width)),
      height: Math.max(30, Math.round(params.height)),
    });
  };

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  return (
    <div
      className={`rectangle-node-container ${selected ? 'selected' : ''} ${isArrowMode ? 'in-arrow-mode' : ''} ${isLocked ? 'locked' : ''}`}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <NodeResizer
        isVisible={Boolean(selected) && !isLocked}
        minWidth={40}
        minHeight={30}
        handleClassName="box-resizer-handle"
        lineClassName="box-resizer-line"
        onResize={handleResize}
      />

      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className="rectangle-node-handle"
        style={{ left: '50%', top: 0 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="rectangle-node-handle"
        style={{ top: `${height / 2}px`, right: 0 }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="rectangle-node-handle"
        style={{ left: '50%', top: `${height}px` }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="rectangle-node-handle"
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

      <div className="rectangle-node-shape" style={{ width: `${width}px`, height: `${height}px` }}>
        <svg
          width={width}
          height={height}
          className="rectangle-node-svg"
          viewBox={`0 0 ${width} ${height}`}
        >
          <rect
            x={1}
            y={1}
            width={Math.max(0, width - 2)}
            height={Math.max(0, height - 2)}
            rx={0}
            ry={0}
            className="rectangle-node-rect"
            style={{
              fill: fillStyle,
              stroke: strokeVal,
              strokeWidth: 1.5,
              strokeDasharray: strokeDash,
            }}
          />
        </svg>

        <div
          className="rectangle-node-text-content"
          style={{
            width: `${width}px`,
            height: `${height}px`,
            fontSize: `${fontPx}px`,
            textAlign,
          }}
          onDoubleClick={handleDoubleClick}
        >
          {isEditing ? (
            <textarea
              ref={textareaRef}
              className="rectangle-node-textarea nodrag nopan"
              style={{
                fontSize: `${fontPx}px`,
                textAlign,
              }}
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onBlur={handleCommit}
              onKeyDown={handleKeyDown}
              placeholder="Type text..."
              rows={2}
            />
          ) : (
            <span
              className="rectangle-node-text"
              title={editText ? editText : 'Double click to add text'}
            >
              {editText}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
