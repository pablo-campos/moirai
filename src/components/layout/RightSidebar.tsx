import React from 'react';
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignHorizontalJustifyStart,
  AlignHorizontalJustifyCenter,
  AlignHorizontalJustifyEnd,
  AlignVerticalJustifyStart,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyEnd,
  AlignHorizontalSpaceAround,
  AlignVerticalSpaceAround,
  Copy,
  Trash2,
  Lock,
  Unlock,
  Check,
  Ban,
} from 'lucide-react';
import {
  useDiagramStore,
  SWATCH_COLORS,
  BOX_FILL_COLORS,
  type SwatchColor,
} from '../../store/diagramStore';

// Color Swatch Picker Component
interface ColorSwatchPickerProps {
  value?: string;
  onChange: (colorToken: string) => void;
  allowTransparent?: boolean;
  colors?: SwatchColor[];
  alpha?: boolean;
}

const ColorSwatchPicker: React.FC<ColorSwatchPickerProps> = ({
  value,
  onChange,
  allowTransparent = false,
  colors = SWATCH_COLORS,
  alpha = false,
}) => {
  return (
    <div className="swatch-picker" role="radiogroup">
      {allowTransparent && (
        <button
          type="button"
          className={`swatch-btn transparent-swatch ${value === 'transparent' ? 'active' : ''}`}
          onClick={() => onChange('transparent')}
          title="Transparent / None"
          aria-label="Transparent"
        >
          <Ban size={12} />
        </button>
      )}
      {colors.map((token) => (
        <button
          key={token}
          type="button"
          className={`swatch-btn ${alpha ? 'alpha-swatch' : ''} ${value === token ? 'active' : ''}`}
          style={{
            backgroundColor: alpha ? `var(--${token}-alpha)` : `var(--${token})`,
          }}
          onClick={() => onChange(token)}
          title={token.replace('swatch-', '')}
          aria-label={token}
        >
          {value === token && <Check size={12} className="swatch-check" />}
        </button>
      ))}
    </div>
  );
};

// Segmented Control Component
interface SegmentedControlProps<T extends string | number> {
  options: { value: T; label: React.ReactNode; title?: string }[];
  value: T;
  onChange: (val: T) => void;
}

function SegmentedControl<T extends string | number>({
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <div className="segmented-control" role="group">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={`segmented-btn ${value === opt.value ? 'active' : ''}`}
          onClick={() => onChange(opt.value)}
          title={opt.title}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// Form Row Helper
const FormRow: React.FC<{
  label: string;
  children: React.ReactNode;
  inline?: boolean;
}> = ({ label, children, inline = false }) => (
  <div className={`prop-row ${inline ? 'prop-row-inline' : ''}`}>
    <span className="prop-label">{label}</span>
    <div className="prop-control">{children}</div>
  </div>
);

export const RightSidebar: React.FC = () => {
  const {
    nodes,
    edges,
    canvasSettings,
    updateCanvasSettings,
    updateNodeData,
    updateNodePosition,
    updateEdgeData,
    duplicateSelected,
    deleteSelected,
    alignSelected,
    distributeSelected,
    batchUpdateSelectedNodes,
    batchUpdateSelectedEdges,
  } = useDiagramStore();

  const selectedNodes = nodes.filter((n) => n.selected);
  const selectedEdges = edges.filter((e) => e.selected);
  const totalSelected = selectedNodes.length + selectedEdges.length;

  // Render Nothing Selected -> Canvas Settings
  if (totalSelected === 0) {
    return (
      <aside className="right-sidebar" aria-label="Properties panel">
        <div className="sidebar-header">Canvas Settings</div>
        <div className="sidebar-content">
          <div className="prop-section">
            <FormRow label="Show grid" inline>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={canvasSettings.showGrid}
                  onChange={(e) => updateCanvasSettings({ showGrid: e.target.checked })}
                />
                <span className="toggle-slider" />
              </label>
            </FormRow>

            <FormRow label="Snap to grid" inline>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={canvasSettings.snapToGrid}
                  onChange={(e) => updateCanvasSettings({ snapToGrid: e.target.checked })}
                />
                <span className="toggle-slider" />
              </label>
            </FormRow>

            <FormRow label="Grid size">
              <SegmentedControl
                options={[
                  { value: 10, label: '10 px' },
                  { value: 20, label: '20 px' },
                ]}
                value={canvasSettings.gridSize}
                onChange={(val) => updateCanvasSettings({ gridSize: val })}
              />
            </FormRow>

            <FormRow label="Show minimap" inline>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={canvasSettings.showMinimap}
                  onChange={(e) => updateCanvasSettings({ showMinimap: e.target.checked })}
                />
                <span className="toggle-slider" />
              </label>
            </FormRow>
          </div>
        </div>
      </aside>
    );
  }

  // Render Single Icon Node Selected
  if (totalSelected === 1 && selectedNodes.length === 1 && selectedNodes[0].type === 'icon') {
    const node = selectedNodes[0];
    const data = node.data || {};
    const label = (data.label ?? '').toString();
    const labelPosition = (data.labelPosition || 'below') as 'below' | 'right';
    const iconSize = (data.iconSize || 'M') as 'S' | 'M' | 'L';
    const iconColor = (data.iconColor || 'swatch-neutral') as string;
    const isLocked = Boolean(data.locked);

    return (
      <aside className="right-sidebar" aria-label="Properties panel">
        <div className="sidebar-header">Icon Properties</div>
        <div className="sidebar-content">
          <div className="prop-section">
            <FormRow label="Label">
              <input
                type="text"
                className="prop-input"
                value={label}
                onChange={(e) => updateNodeData(node.id, { label: e.target.value })}
                placeholder="Node label"
              />
            </FormRow>

            <FormRow label="Label position">
              <SegmentedControl
                options={[
                  { value: 'below', label: 'Below' },
                  { value: 'right', label: 'Right' },
                ]}
                value={labelPosition}
                onChange={(val) => updateNodeData(node.id, { labelPosition: val })}
              />
            </FormRow>

            <FormRow label="Icon size">
              <SegmentedControl
                options={[
                  { value: 'S', label: 'S (28px)' },
                  { value: 'M', label: 'M (40px)' },
                  { value: 'L', label: 'L (56px)' },
                ]}
                value={iconSize}
                onChange={(val) => updateNodeData(node.id, { iconSize: val })}
              />
            </FormRow>

            <FormRow label="Icon color">
              <ColorSwatchPicker
                value={iconColor}
                onChange={(val) => updateNodeData(node.id, { iconColor: val })}
              />
            </FormRow>

            <div className="prop-row-dual">
              <FormRow label="X Position">
                <input
                  type="number"
                  className="prop-input"
                  value={Math.round(node.position.x)}
                  onChange={(e) =>
                    updateNodePosition(node.id, {
                      x: Number(e.target.value),
                      y: node.position.y,
                    })
                  }
                />
              </FormRow>
              <FormRow label="Y Position">
                <input
                  type="number"
                  className="prop-input"
                  value={Math.round(node.position.y)}
                  onChange={(e) =>
                    updateNodePosition(node.id, {
                      x: node.position.x,
                      y: Number(e.target.value),
                    })
                  }
                />
              </FormRow>
            </div>

            <FormRow label="Lock position" inline>
              <button
                type="button"
                className={`lock-toggle-btn ${isLocked ? 'locked' : ''}`}
                onClick={() => updateNodeData(node.id, { locked: !isLocked })}
                title={isLocked ? 'Unlock position' : 'Lock position'}
              >
                {isLocked ? <Lock size={14} /> : <Unlock size={14} />}
                <span>{isLocked ? 'Locked' : 'Unlocked'}</span>
              </button>
            </FormRow>
          </div>

          <div className="prop-actions">
            <button
              type="button"
              className="action-btn duplicate-btn"
              onClick={duplicateSelected}
              title="Duplicate (Ctrl/Cmd+D)"
            >
              <Copy size={14} />
              <span>Duplicate</span>
            </button>
            <button
              type="button"
              className="action-btn delete-btn"
              onClick={deleteSelected}
              title="Delete (Backspace/Delete)"
            >
              <Trash2 size={14} />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </aside>
    );
  }

  // Render Single Box Node Selected
  if (totalSelected === 1 && selectedNodes.length === 1 && selectedNodes[0].type === 'box') {
    const node = selectedNodes[0];
    const data = node.data || {};
    const text = (data.text ?? data.label ?? '').toString();
    const fontSize = (data.fontSize || 'M') as 'S' | 'M' | 'L';
    const textAlign = (data.textAlign || 'center') as 'left' | 'center' | 'right';
    const strokeColor = (data.strokeColor || 'swatch-neutral') as string;
    const width = typeof data.width === 'number' ? data.width : 160;
    const isLocked = Boolean(data.locked);

    return (
      <aside className="right-sidebar" aria-label="Properties panel">
        <div className="sidebar-header">Text Box Properties</div>
        <div className="sidebar-content">
          <div className="prop-section">
            <FormRow label="Text">
              <textarea
                className="prop-textarea"
                rows={2}
                value={text}
                onChange={(e) => updateNodeData(node.id, { text: e.target.value })}
                placeholder="Text Box text"
              />
            </FormRow>

            <FormRow label="Font size">
              <SegmentedControl
                options={[
                  { value: 'S', label: '12px' },
                  { value: 'M', label: '14px' },
                  { value: 'L', label: '16px' },
                ]}
                value={fontSize}
                onChange={(val) => updateNodeData(node.id, { fontSize: val })}
              />
            </FormRow>

            <FormRow label="Text align">
              <SegmentedControl
                options={[
                  { value: 'left', label: <AlignLeft size={14} />, title: 'Align left' },
                  { value: 'center', label: <AlignCenter size={14} />, title: 'Align center' },
                  { value: 'right', label: <AlignRight size={14} />, title: 'Align right' },
                ]}
                value={textAlign}
                onChange={(val) => updateNodeData(node.id, { textAlign: val })}
              />
            </FormRow>

            <FormRow label="Stroke color">
              <ColorSwatchPicker
                value={strokeColor}
                onChange={(val) => updateNodeData(node.id, { strokeColor: val })}
              />
            </FormRow>

            <FormRow label="Width">
              <div className="prop-slider-row">
                <input
                  type="range"
                  min="100"
                  max="400"
                  step="10"
                  className="prop-slider"
                  value={width}
                  onChange={(e) => updateNodeData(node.id, { width: Number(e.target.value) })}
                />
                <span className="prop-slider-val">{width}px</span>
              </div>
            </FormRow>

            <div className="prop-row-dual">
              <FormRow label="X Position">
                <input
                  type="number"
                  className="prop-input"
                  value={Math.round(node.position.x)}
                  onChange={(e) =>
                    updateNodePosition(node.id, {
                      x: Number(e.target.value),
                      y: node.position.y,
                    })
                  }
                />
              </FormRow>
              <FormRow label="Y Position">
                <input
                  type="number"
                  className="prop-input"
                  value={Math.round(node.position.y)}
                  onChange={(e) =>
                    updateNodePosition(node.id, {
                      x: node.position.x,
                      y: Number(e.target.value),
                    })
                  }
                />
              </FormRow>
            </div>

            <FormRow label="Lock position" inline>
              <button
                type="button"
                className={`lock-toggle-btn ${isLocked ? 'locked' : ''}`}
                onClick={() => updateNodeData(node.id, { locked: !isLocked })}
                title={isLocked ? 'Unlock position' : 'Lock position'}
              >
                {isLocked ? <Lock size={14} /> : <Unlock size={14} />}
                <span>{isLocked ? 'Locked' : 'Unlocked'}</span>
              </button>
            </FormRow>
          </div>

          <div className="prop-actions">
            <button
              type="button"
              className="action-btn duplicate-btn"
              onClick={duplicateSelected}
              title="Duplicate (Ctrl/Cmd+D)"
            >
              <Copy size={14} />
              <span>Duplicate</span>
            </button>
            <button
              type="button"
              className="action-btn delete-btn"
              onClick={deleteSelected}
              title="Delete (Backspace/Delete)"
            >
              <Trash2 size={14} />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </aside>
    );
  }

  // Render Single Rectangle Node Selected
  if (totalSelected === 1 && selectedNodes.length === 1 && selectedNodes[0].type === 'rectangle') {
    const node = selectedNodes[0];
    const data = node.data || {};
    const text = (data.text ?? data.label ?? '').toString();
    const fontSize = (data.fontSize || 'M') as 'S' | 'M' | 'L';
    const textAlign = (data.textAlign || 'center') as 'left' | 'center' | 'right';
    const fill = (data.fill || 'transparent') as string;
    const strokeColor = (data.strokeColor || 'swatch-neutral') as string;
    const strokeStyle = (data.strokeStyle || 'solid') as 'solid' | 'dashed' | 'dotted';
    const width = typeof data.width === 'number' ? data.width : 180;
    const height = typeof data.height === 'number' ? data.height : 100;
    const isLocked = Boolean(data.locked);

    return (
      <aside className="right-sidebar" aria-label="Properties panel">
        <div className="sidebar-header">Rectangle Properties</div>
        <div className="sidebar-content">
          <div className="prop-section">
            <FormRow label="Text">
              <textarea
                className="prop-textarea"
                rows={2}
                value={text}
                onChange={(e) => updateNodeData(node.id, { text: e.target.value })}
                placeholder="Rectangle text"
              />
            </FormRow>

            <FormRow label="Font size">
              <SegmentedControl
                options={[
                  { value: 'S', label: '12px' },
                  { value: 'M', label: '14px' },
                  { value: 'L', label: '16px' },
                ]}
                value={fontSize}
                onChange={(val) => updateNodeData(node.id, { fontSize: val })}
              />
            </FormRow>

            <FormRow label="Text align">
              <SegmentedControl
                options={[
                  { value: 'left', label: <AlignLeft size={14} />, title: 'Align left' },
                  { value: 'center', label: <AlignCenter size={14} />, title: 'Align center' },
                  { value: 'right', label: <AlignRight size={14} />, title: 'Align right' },
                ]}
                value={textAlign}
                onChange={(val) => updateNodeData(node.id, { textAlign: val })}
              />
            </FormRow>

            <FormRow label="Fill color">
              <ColorSwatchPicker
                value={fill}
                onChange={(val) => updateNodeData(node.id, { fill: val })}
                allowTransparent
                colors={BOX_FILL_COLORS}
                alpha
              />
            </FormRow>

            <FormRow label="Stroke color">
              <ColorSwatchPicker
                value={strokeColor}
                onChange={(val) => updateNodeData(node.id, { strokeColor: val })}
              />
            </FormRow>

            <FormRow label="Stroke style">
              <SegmentedControl
                options={[
                  { value: 'solid', label: 'Solid' },
                  { value: 'dashed', label: 'Dashed' },
                  { value: 'dotted', label: 'Dotted' },
                ]}
                value={strokeStyle}
                onChange={(val) => updateNodeData(node.id, { strokeStyle: val })}
              />
            </FormRow>

            <FormRow label="Width">
              <div className="prop-slider-row">
                <input
                  type="range"
                  min="40"
                  max="600"
                  step="10"
                  className="prop-slider"
                  value={width}
                  onChange={(e) => updateNodeData(node.id, { width: Number(e.target.value) })}
                />
                <span className="prop-slider-val">{width}px</span>
              </div>
            </FormRow>

            <FormRow label="Height">
              <div className="prop-slider-row">
                <input
                  type="range"
                  min="30"
                  max="500"
                  step="10"
                  className="prop-slider"
                  value={height}
                  onChange={(e) => updateNodeData(node.id, { height: Number(e.target.value) })}
                />
                <span className="prop-slider-val">{height}px</span>
              </div>
            </FormRow>

            <div className="prop-row-dual">
              <FormRow label="X Position">
                <input
                  type="number"
                  className="prop-input"
                  value={Math.round(node.position.x)}
                  onChange={(e) =>
                    updateNodePosition(node.id, {
                      x: Number(e.target.value),
                      y: node.position.y,
                    })
                  }
                />
              </FormRow>
              <FormRow label="Y Position">
                <input
                  type="number"
                  className="prop-input"
                  value={Math.round(node.position.y)}
                  onChange={(e) =>
                    updateNodePosition(node.id, {
                      x: node.position.x,
                      y: Number(e.target.value),
                    })
                  }
                />
              </FormRow>
            </div>

            <FormRow label="Lock position" inline>
              <button
                type="button"
                className={`lock-toggle-btn ${isLocked ? 'locked' : ''}`}
                onClick={() => updateNodeData(node.id, { locked: !isLocked })}
                title={isLocked ? 'Unlock position' : 'Lock position'}
              >
                {isLocked ? <Lock size={14} /> : <Unlock size={14} />}
                <span>{isLocked ? 'Locked' : 'Unlocked'}</span>
              </button>
            </FormRow>
          </div>

          <div className="prop-actions">
            <button
              type="button"
              className="action-btn duplicate-btn"
              onClick={duplicateSelected}
              title="Duplicate (Ctrl/Cmd+D)"
            >
              <Copy size={14} />
              <span>Duplicate</span>
            </button>
            <button
              type="button"
              className="action-btn delete-btn"
              onClick={deleteSelected}
              title="Delete (Backspace/Delete)"
            >
              <Trash2 size={14} />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </aside>
    );
  }

  // Render Single Edge Selected
  if (totalSelected === 1 && selectedEdges.length === 1) {
    const edge = selectedEdges[0];
    const data = (edge.data || {}) as Record<string, unknown>;
    const label = (data.label ?? '').toString();
    const lineStyle = (data.lineStyle || 'solid') as 'solid' | 'dashed' | 'dotted';
    const strokeWidth = typeof data.strokeWidth === 'number' ? data.strokeWidth : 1.5;
    const arrowheads = (data.arrowheads || 'end') as 'none' | 'end' | 'start' | 'both';
    const color = (data.color || 'swatch-neutral') as string;

    return (
      <aside className="right-sidebar" aria-label="Properties panel">
        <div className="sidebar-header">Arrow Properties</div>
        <div className="sidebar-content">
          <div className="prop-section">
            <FormRow label="Label">
              <input
                type="text"
                className="prop-input"
                value={label}
                onChange={(e) => updateEdgeData(edge.id, { label: e.target.value })}
                placeholder="Edge label..."
              />
            </FormRow>

            <FormRow label="Line style">
              <SegmentedControl
                options={[
                  { value: 'solid', label: 'Solid' },
                  { value: 'dashed', label: 'Dashed' },
                  { value: 'dotted', label: 'Dotted' },
                ]}
                value={lineStyle}
                onChange={(val) => updateEdgeData(edge.id, { lineStyle: val })}
              />
            </FormRow>

            <FormRow label="Stroke width">
              <SegmentedControl
                options={[
                  { value: 1, label: '1px' },
                  { value: 1.5, label: '1.5px' },
                  { value: 2, label: '2px' },
                  { value: 3, label: '3px' },
                ]}
                value={strokeWidth}
                onChange={(val) => updateEdgeData(edge.id, { strokeWidth: val })}
              />
            </FormRow>

            <FormRow label="Arrowheads">
              <SegmentedControl
                options={[
                  { value: 'none', label: 'None' },
                  { value: 'end', label: 'End' },
                  { value: 'start', label: 'Start' },
                  { value: 'both', label: 'Both' },
                ]}
                value={arrowheads}
                onChange={(val) => updateEdgeData(edge.id, { arrowheads: val })}
              />
            </FormRow>

            <FormRow label="Color">
              <ColorSwatchPicker
                value={color}
                onChange={(val) => updateEdgeData(edge.id, { color: val })}
              />
            </FormRow>
          </div>

          <div className="prop-actions">
            <button
              type="button"
              className="action-btn duplicate-btn"
              onClick={duplicateSelected}
              title="Duplicate"
            >
              <Copy size={14} />
              <span>Duplicate</span>
            </button>
            <button
              type="button"
              className="action-btn delete-btn"
              onClick={deleteSelected}
              title="Delete (Backspace/Delete)"
            >
              <Trash2 size={14} />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </aside>
    );
  }

  // Render Multiple Selected Items
  return (
    <aside className="right-sidebar" aria-label="Properties panel">
      <div className="sidebar-header">{totalSelected} Items Selected</div>
      <div className="sidebar-content">
        <div className="prop-section">
          {selectedNodes.length >= 2 && (
            <>
              <FormRow label="Align">
                <div className="align-buttons-grid">
                  <button
                    type="button"
                    className="icon-action-btn"
                    onClick={() => alignSelected('left')}
                    title="Align Left"
                  >
                    <AlignHorizontalJustifyStart size={15} />
                  </button>
                  <button
                    type="button"
                    className="icon-action-btn"
                    onClick={() => alignSelected('center')}
                    title="Align Center Horizontally"
                  >
                    <AlignHorizontalJustifyCenter size={15} />
                  </button>
                  <button
                    type="button"
                    className="icon-action-btn"
                    onClick={() => alignSelected('right')}
                    title="Align Right"
                  >
                    <AlignHorizontalJustifyEnd size={15} />
                  </button>
                  <button
                    type="button"
                    className="icon-action-btn"
                    onClick={() => alignSelected('top')}
                    title="Align Top"
                  >
                    <AlignVerticalJustifyStart size={15} />
                  </button>
                  <button
                    type="button"
                    className="icon-action-btn"
                    onClick={() => alignSelected('middle')}
                    title="Align Middle Vertically"
                  >
                    <AlignVerticalJustifyCenter size={15} />
                  </button>
                  <button
                    type="button"
                    className="icon-action-btn"
                    onClick={() => alignSelected('bottom')}
                    title="Align Bottom"
                  >
                    <AlignVerticalJustifyEnd size={15} />
                  </button>
                </div>
              </FormRow>

              {selectedNodes.length >= 3 && (
                <FormRow label="Distribute">
                  <div className="align-buttons-grid">
                    <button
                      type="button"
                      className="icon-action-btn"
                      onClick={() => distributeSelected('horizontal')}
                      title="Distribute Horizontally"
                    >
                      <AlignHorizontalSpaceAround size={15} />
                    </button>
                    <button
                      type="button"
                      className="icon-action-btn"
                      onClick={() => distributeSelected('vertical')}
                      title="Distribute Vertically"
                    >
                      <AlignVerticalSpaceAround size={15} />
                    </button>
                  </div>
                </FormRow>
              )}
            </>
          )}

          <FormRow label="Shared color">
            <ColorSwatchPicker
              onChange={(val) => {
                batchUpdateSelectedNodes({
                  iconColor: val,
                  strokeColor: val,
                });
                batchUpdateSelectedEdges({
                  color: val,
                });
              }}
            />
          </FormRow>
        </div>

        <div className="prop-actions">
          <button
            type="button"
            className="action-btn duplicate-btn"
            onClick={duplicateSelected}
            title="Duplicate selected"
          >
            <Copy size={14} />
            <span>Duplicate All</span>
          </button>
          <button
            type="button"
            className="action-btn delete-btn"
            onClick={deleteSelected}
            title="Delete selected"
          >
            <Trash2 size={14} />
            <span>Delete All</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
