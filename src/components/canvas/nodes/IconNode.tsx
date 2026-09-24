import React, { useState, useRef, useEffect } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { getComponentByType, DynamicIcon } from '../../registry';
import { useDiagramStore, type IconNodeData } from '../../../store/diagramStore';

export const IconNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const nodeData = data as unknown as IconNodeData;
  const def = getComponentByType(nodeData.componentType || '');
  const iconName = def ? def.icon : 'Hexagon';
  const displayLabel = (nodeData.label ?? def?.label ?? 'Node').toString();
  const labelPosition = nodeData.labelPosition || 'below';
  const iconSize = nodeData.iconSize || 'M';
  const iconColor = nodeData.iconColor;
  const isLocked = Boolean(nodeData.locked);

  const pixelSize = iconSize === 'S' ? 28 : iconSize === 'L' ? 56 : 40;
  const strokeColor = iconColor ? `var(--${iconColor})` : 'var(--node-icon)';

  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(displayLabel);
  const inputRef = useRef<HTMLInputElement>(null);
  const updateNodeLabel = useDiagramStore((s) => s.updateNodeLabel);
  const isArrowMode = useDiagramStore((s) => s.isArrowMode);

  useEffect(() => {
    if (!isEditing) {
      setEditValue(displayLabel);
    }
  }, [displayLabel, isEditing]);

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
    if (trimmed && trimmed !== displayLabel) {
      updateNodeLabel(id, trimmed);
    } else {
      setEditValue(displayLabel);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCommit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setEditValue(displayLabel);
      setIsEditing(false);
    }
  };

  return (
    <div
      className={`icon-node-wrapper pos-${labelPosition} size-${iconSize} ${selected ? 'selected' : ''} ${isArrowMode ? 'in-arrow-mode' : ''} ${isLocked ? 'locked' : ''}`}
    >
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className="icon-node-handle"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="icon-node-handle"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="icon-node-handle"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="icon-node-handle"
      />

      {isArrowMode && !isEditing && (
        <Handle
          type="source"
          position={Position.Top}
          id="arrow-mode-trigger"
          className="arrow-mode-overlay-handle"
        />
      )}

      <div
        className="icon-node-icon-box"
        style={{
          width: `${pixelSize + 8}px`,
          height: `${pixelSize + 8}px`,
          color: strokeColor,
        }}
      >
        <DynamicIcon name={iconName} size={pixelSize} strokeWidth={1.5} className="icon-node-icon" />
      </div>

      <div className="icon-node-label-container" onDoubleClick={handleDoubleClick}>
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            className="icon-node-label-input nodrag nopan"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleCommit}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <span className="icon-node-label" title="Double click to edit">
            {displayLabel}
          </span>
        )}
      </div>
    </div>
  );
};
