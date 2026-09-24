import React, { useEffect, useRef, useState } from 'react';
import {
  Settings,
  Sun,
  Moon,
  FilePlus,
  AlertTriangle,
  Download,
  Image,
  FileCode,
  FileJson,
  Upload,
  AlertCircle,
  X,
} from 'lucide-react';
import { APP_NAME, LOGO_SRC } from '../../config/brand';
import { useTheme } from '../../theme/ThemeProvider';
import { useDiagramStore } from '../../store/diagramStore';
import {
  exportDiagramAsPng,
  exportDiagramAsSvg,
  exportDiagramAsJson,
  validateAndParseDiagramJson,
} from '../../lib/exportImage';

export const TopBar: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { nodes, edges, canvasSettings, clearDiagram, importDiagram } =
    useDiagramStore();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [showConfirmNew, setShowConfirmNew] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  const settingsPopoverRef = useRef<HTMLDivElement>(null);
  const settingsButtonRef = useRef<HTMLButtonElement>(null);
  const exportPopoverRef = useRef<HTMLDivElement>(null);
  const exportButtonRef = useRef<HTMLButtonElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      // Settings popover
      if (
        isSettingsOpen &&
        settingsPopoverRef.current &&
        !settingsPopoverRef.current.contains(e.target as Node) &&
        settingsButtonRef.current &&
        !settingsButtonRef.current.contains(e.target as Node)
      ) {
        setIsSettingsOpen(false);
        setShowConfirmNew(false);
      }

      // Export popover
      if (
        isExportOpen &&
        exportPopoverRef.current &&
        !exportPopoverRef.current.contains(e.target as Node) &&
        exportButtonRef.current &&
        !exportButtonRef.current.contains(e.target as Node)
      ) {
        setIsExportOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isSettingsOpen) {
          setIsSettingsOpen(false);
          setShowConfirmNew(false);
        }
        if (isExportOpen) {
          setIsExportOpen(false);
        }
        if (importError) {
          setImportError(null);
        }
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSettingsOpen, isExportOpen, importError]);

  const handleConfirmNew = () => {
    clearDiagram();
    setShowConfirmNew(false);
    setIsSettingsOpen(false);
  };

  const handleExportPng = async () => {
    setIsExportOpen(false);
    await exportDiagramAsPng(nodes, `${APP_NAME.toLowerCase().replace(/\s+/g, '-')}.png`);
  };

  const handleExportSvg = async () => {
    setIsExportOpen(false);
    await exportDiagramAsSvg(nodes, `${APP_NAME.toLowerCase().replace(/\s+/g, '-')}.svg`);
  };

  const handleExportJson = () => {
    setIsExportOpen(false);
    exportDiagramAsJson(
      { nodes, edges, canvasSettings },
      `${APP_NAME.toLowerCase().replace(/\s+/g, '-')}.json`
    );
  };

  const handleImportClick = () => {
    setIsExportOpen(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        const result = validateAndParseDiagramJson(content);
        if (result.success && result.data) {
          importDiagram(result.data);
          setImportError(null);
        } else {
          setImportError(result.error || 'Failed to import diagram.');
        }
      }
    };
    reader.onerror = () => {
      setImportError('Failed to read the selected file.');
    };
    reader.readAsText(file);
  };

  return (
    <header className="top-bar">
      <div className="top-bar-brand">
        <div className="top-bar-logo">
          <img src={LOGO_SRC} alt={`${APP_NAME} logo`} />
        </div>
        <span className="top-bar-title">{APP_NAME}</span>
      </div>

      <div className="top-bar-actions">
        {/* Hidden file input for importing JSON */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        {/* Export / Import Button */}
        <button
          ref={exportButtonRef}
          type="button"
          className={`icon-button ${isExportOpen ? 'active' : ''}`}
          aria-label="Export or import diagram"
          title="Export / Import"
          aria-expanded={isExportOpen}
          onClick={() => {
            setIsExportOpen((prev) => !prev);
            setIsSettingsOpen(false);
          }}
        >
          <Download size={18} />
        </button>

        {isExportOpen && (
          <div
            ref={exportPopoverRef}
            className="settings-popover export-popover"
            role="menu"
            aria-label="Export options"
          >
            <span className="popover-label">Export Diagram</span>
            <button
              type="button"
              className="popover-menu-btn"
              onClick={handleExportPng}
              disabled={nodes.length === 0}
              title={nodes.length === 0 ? 'Add nodes to export' : 'Export as 2x PNG'}
            >
              <Image size={14} />
              <span>Export as PNG (2x)</span>
            </button>
            <button
              type="button"
              className="popover-menu-btn"
              onClick={handleExportSvg}
              disabled={nodes.length === 0}
              title={nodes.length === 0 ? 'Add nodes to export' : 'Export as SVG'}
            >
              <FileCode size={14} />
              <span>Export as SVG</span>
            </button>
            <button
              type="button"
              className="popover-menu-btn"
              onClick={handleExportJson}
            >
              <FileJson size={14} />
              <span>Export as JSON</span>
            </button>

            <div className="popover-divider" />

            <span className="popover-label">Import Diagram</span>
            <button
              type="button"
              className="popover-menu-btn"
              onClick={handleImportClick}
            >
              <Upload size={14} />
              <span>Import JSON File</span>
            </button>
          </div>
        )}

        {/* Settings Button */}
        <button
          ref={settingsButtonRef}
          type="button"
          className={`icon-button ${isSettingsOpen ? 'active' : ''}`}
          aria-label="Open settings"
          title="Settings"
          aria-expanded={isSettingsOpen}
          onClick={() => {
            setIsSettingsOpen((prev) => !prev);
            setIsExportOpen(false);
            setShowConfirmNew(false);
          }}
        >
          <Settings size={18} />
        </button>

        {isSettingsOpen && (
          <div
            ref={settingsPopoverRef}
            className="settings-popover"
            role="dialog"
            aria-label="Settings"
          >
            <span className="popover-label">Appearance</span>
            <div className="segmented-control" role="group" aria-label="Theme selector">
              <button
                type="button"
                className={`segmented-button ${theme === 'light' ? 'active' : ''}`}
                onClick={() => setTheme('light')}
                aria-pressed={theme === 'light'}
              >
                <Sun size={14} />
                <span>Light</span>
              </button>
              <button
                type="button"
                className={`segmented-button ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => setTheme('dark')}
                aria-pressed={theme === 'dark'}
              >
                <Moon size={14} />
                <span>Dark</span>
              </button>
            </div>

            <div className="popover-divider" />

            <span className="popover-label">Diagram</span>
            {!showConfirmNew ? (
              <button
                type="button"
                className="popover-menu-btn"
                onClick={() => setShowConfirmNew(true)}
              >
                <FilePlus size={14} />
                <span>New diagram</span>
              </button>
            ) : (
              <div className="popover-confirm-box">
                <div className="popover-confirm-msg">
                  <AlertTriangle size={14} className="confirm-icon" />
                  <span>Clear canvas & start new diagram?</span>
                </div>
                <div className="popover-confirm-actions">
                  <button
                    type="button"
                    className="popover-confirm-btn confirm-cancel"
                    onClick={() => setShowConfirmNew(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="popover-confirm-btn confirm-action"
                    onClick={handleConfirmNew}
                  >
                    Clear All
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Import Error Modal */}
      {importError && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-card">
            <div className="modal-header">
              <div className="modal-title-group">
                <AlertCircle size={18} className="modal-error-icon" />
                <span className="modal-title">Import Error</span>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setImportError(null)}
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>
            <div className="modal-body">
              <p className="modal-error-msg">{importError}</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="modal-primary-btn"
                onClick={() => setImportError(null)}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
