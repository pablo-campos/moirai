import React, { useEffect, useRef, useState } from 'react';
import { Settings, Sun, Moon, FilePlus, AlertTriangle } from 'lucide-react';
import { APP_NAME, LOGO_SRC } from '../../config/brand';
import { useTheme } from '../../theme/ThemeProvider';
import { useDiagramStore } from '../../store/diagramStore';

export const TopBar: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const clearDiagram = useDiagramStore((s) => s.clearDiagram);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showConfirmNew, setShowConfirmNew] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        isSettingsOpen &&
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsSettingsOpen(false);
        setShowConfirmNew(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSettingsOpen) {
        setIsSettingsOpen(false);
        setShowConfirmNew(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSettingsOpen]);

  const handleConfirmNew = () => {
    clearDiagram();
    setShowConfirmNew(false);
    setIsSettingsOpen(false);
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
        <button
          ref={buttonRef}
          type="button"
          className={`icon-button ${isSettingsOpen ? 'active' : ''}`}
          aria-label="Open settings"
          aria-expanded={isSettingsOpen}
          onClick={() => {
            setIsSettingsOpen((prev) => !prev);
            setShowConfirmNew(false);
          }}
        >
          <Settings size={18} />
        </button>

        {isSettingsOpen && (
          <div ref={popoverRef} className="settings-popover" role="dialog" aria-label="Settings">
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
    </header>
  );
};
