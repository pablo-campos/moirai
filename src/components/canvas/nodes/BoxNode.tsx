import React, { useState, useRef, useEffect, useLayoutEffect, useMemo } from 'react';
import { Handle, Position, NodeResizer, type NodeProps, type ResizeParams } from '@xyflow/react';
import { getBoxTechFrameGeometry } from '../../../lib/boxGeometry';
import { useDiagramStore, type NodeData } from '../../../store/diagramStore';

export const BoxNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const nodeData = data as unknown as NodeData;
  const initialText = (nodeData.text ?? nodeData.label ?? 'Text Box').toString();
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
      ? `var(--${fillColor}-alpha, var(--${fillColor}))`
      : 'var(--node-fill)';

  const strokeVal = selected
    ? 'var(--selection)'
    : strokeColor
    ? `var(--${strokeColor})`
    : 'var(--node-stroke)';
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

  const frame = useMemo(
    () => getBoxTechFrameGeometry(width, height, 18),
    [width, height]
  );

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
          {/* Main filled polygon body */}
          <polygon
            points={frame.points}
            className="box-node-polygon"
            style={{
              fill: fillStyle,
              stroke: strokeVal,
              strokeWidth: 1.5,
              strokeDasharray: strokeDash,
            }}
          />

          {/* Top & Bottom Floating Rails */}
          <line
            x1={frame.topMainRail.x1}
            y1={frame.topMainRail.y1}
            x2={frame.topMainRail.x2}
            y2={frame.topMainRail.y2}
            stroke={strokeVal}
            strokeWidth={1.2}
            opacity={0.85}
          />
          <line
            x1={frame.topLeftNotch.x1}
            y1={frame.topLeftNotch.y1}
            x2={frame.topLeftNotch.x2}
            y2={frame.topLeftNotch.y2}
            stroke={strokeVal}
            strokeWidth={1.2}
            opacity={0.7}
          />
          <line
            x1={frame.topRightNotch.x1}
            y1={frame.topRightNotch.y1}
            x2={frame.topRightNotch.x2}
            y2={frame.topRightNotch.y2}
            stroke={strokeVal}
            strokeWidth={1.2}
            opacity={0.7}
          />

          <line
            x1={frame.bottomMainRail.x1}
            y1={frame.bottomMainRail.y1}
            x2={frame.bottomMainRail.x2}
            y2={frame.bottomMainRail.y2}
            stroke={strokeVal}
            strokeWidth={1.2}
            opacity={0.85}
          />
          <line
            x1={frame.bottomLeftNotch.x1}
            y1={frame.bottomLeftNotch.y1}
            x2={frame.bottomLeftNotch.x2}
            y2={frame.bottomLeftNotch.y2}
            stroke={strokeVal}
            strokeWidth={1.2}
            opacity={0.7}
          />
          <line
            x1={frame.bottomRightNotch.x1}
            y1={frame.bottomRightNotch.y1}
            x2={frame.bottomRightNotch.x2}
            y2={frame.bottomRightNotch.y2}
            stroke={strokeVal}
            strokeWidth={1.2}
            opacity={0.7}
          />

          {/* Left & Right Layered Chevrons (Wings) */}
          <path
            d={frame.leftOuterChevron}
            fill="none"
            stroke={strokeVal}
            strokeWidth={1.4}
            opacity={0.9}
          />
          <path
            d={frame.leftInnerChevron}
            fill="none"
            stroke={strokeVal}
            strokeWidth={1.2}
            opacity={0.55}
          />
          <path
            d={frame.rightOuterChevron}
            fill="none"
            stroke={strokeVal}
            strokeWidth={1.4}
            opacity={0.9}
          />
          <path
            d={frame.rightInnerChevron}
            fill="none"
            stroke={strokeVal}
            strokeWidth={1.2}
            opacity={0.55}
          />

          {/* Shoulder Accent Ticks (Heavy corner joints) */}
          {frame.shoulderTicks.map((tick, i) => (
            <line
              key={i}
              x1={tick.x1}
              y1={tick.y1}
              x2={tick.x2}
              y2={tick.y2}
              stroke={strokeVal}
              strokeWidth={tick.strokeWidth}
              strokeLinecap="square"
              opacity={0.95}
            />
          ))}

          {/* Interior subtle circuit lines */}
          {frame.circuitLines.map((circuit, i) => (
            <g key={i} opacity={0.28}>
              <line
                x1={circuit.x1}
                y1={circuit.y1}
                x2={circuit.x2}
                y2={circuit.y2}
                stroke={strokeVal}
                strokeWidth={1}
              />
              <circle
                cx={circuit.dotX}
                cy={circuit.dotY}
                r={1.5}
                fill={strokeVal}
              />
            </g>
          ))}
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
