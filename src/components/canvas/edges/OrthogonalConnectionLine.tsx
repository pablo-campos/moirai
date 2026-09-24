import React from 'react';
import { getSmoothStepPath, type ConnectionLineComponentProps } from '@xyflow/react';

export const OrthogonalConnectionLine: React.FC<ConnectionLineComponentProps> = ({
  fromX,
  fromY,
  toX,
  toY,
  fromPosition,
  toPosition,
}) => {
  const [edgePath] = getSmoothStepPath({
    sourceX: fromX,
    sourceY: fromY,
    sourcePosition: fromPosition,
    targetX: toX,
    targetY: toY,
    targetPosition: toPosition,
    borderRadius: 0,
  });

  return (
    <g>
      <path
        d={edgePath}
        fill="none"
        stroke="var(--accent)"
        strokeWidth={1.5}
        strokeDasharray="4 4"
        className="orthogonal-connection-line"
      />
    </g>
  );
};
