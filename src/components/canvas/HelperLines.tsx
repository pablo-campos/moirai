import React from 'react';
import type { HelperLines as HelperLinesType } from '../../lib/helperLines';

interface HelperLinesProps {
  lines: HelperLinesType;
}

export const HelperLinesRenderer: React.FC<HelperLinesProps> = ({ lines }) => {
  if (lines.horizontal === undefined && lines.vertical === undefined) {
    return null;
  }

  return (
    <svg className="helper-lines-layer" style={{ pointerEvents: 'none' }}>
      {lines.horizontal !== undefined && (
        <line
          x1="-10000"
          y1={lines.horizontal}
          x2="10000"
          y2={lines.horizontal}
          className="helper-line helper-line-horizontal"
        />
      )}
      {lines.vertical !== undefined && (
        <line
          x1={lines.vertical}
          y1="-10000"
          x2={lines.vertical}
          y2="10000"
          className="helper-line helper-line-vertical"
        />
      )}
    </svg>
  );
};
