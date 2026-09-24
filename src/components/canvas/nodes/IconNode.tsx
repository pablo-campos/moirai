import React, { useState, useRef, useEffect } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { getComponentByType, DynamicIcon } from '../../registry';
import { useDiagramStore, type IconNodeData } from '../../../store/diagramStore';

export const IconNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const nodeData = data as unknown as IconNodeData;
  const def = getComponentByType(nodeData.componentType);
  const iconName = def ? def.icon : 'Hexagon';
  const displayLabel = (nodeData.label ?? def?.label ?? 'Node').toString();

  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(displayLabel);
  const inputRef = useRef<HTMLInputElement>(null);
  const updateNodeLabel = useDiagramStore((s) => s.updateNodeLabel);

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
    <div className={`icon-node-wrapper ${selected ? 'selected' : ''}`}>
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

      <div className="icon-node-icon-box">
        <DynamicIcon name={iconName} size={40} strokeWidth={1.5} className="icon-node-icon" />
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
