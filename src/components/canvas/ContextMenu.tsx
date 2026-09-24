import React, { useEffect, useRef } from 'react';
import {
  ArrowUpToLine,
  ArrowDownToLine,
  Copy,
  Trash2,
} from 'lucide-react';
import { useDiagramStore } from '../../store/diagramStore';

export interface ContextMenuState {
  x: number;
  y: number;
  nodeId?: string;
  edgeId?: string;
}

interface ContextMenuProps {
  menu: ContextMenuState;
  onClose: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ menu, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const { bringToFront, sendToBack, duplicateSelected, deleteSelected } =
    useDiagramStore();

  const isMac =
    typeof window !== 'undefined' &&
    /Mac|iPod|iPhone|iPad/.test(window.navigator.userAgent);
  const modKey = isMac ? '⌘' : 'Ctrl';

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleBringToFront = () => {
    bringToFront(menu.nodeId);
    onClose();
  };

  const handleSendToBack = () => {
    sendToBack(menu.nodeId);
    onClose();
  };

  const handleDuplicate = () => {
    duplicateSelected();
    onClose();
  };

  const handleDelete = () => {
    deleteSelected();
    onClose();
  };

  // Keep menu within viewport
  const menuWidth = 180;
  const menuHeight = 160;
  const left = Math.min(menu.x, window.innerWidth - menuWidth - 10);
  const top = Math.min(menu.y, window.innerHeight - menuHeight - 10);

  return (
    <div
      ref={menuRef}
      className="context-menu"
      style={{ left: `${left}px`, top: `${top}px` }}
      role="menu"
    >
      {menu.nodeId && (
        <>
          <button
            type="button"
            className="context-menu-item"
            onClick={handleBringToFront}
            role="menuitem"
          >
            <ArrowUpToLine size={14} />
            <span>Bring to Front</span>
          </button>
          <button
            type="button"
            className="context-menu-item"
            onClick={handleSendToBack}
            role="menuitem"
          >
            <ArrowDownToLine size={14} />
            <span>Send to Back</span>
          </button>
          <div className="context-menu-divider" />
        </>
      )}

      <button
        type="button"
        className="context-menu-item"
        onClick={handleDuplicate}
        role="menuitem"
      >
        <Copy size={14} />
        <span>Duplicate</span>
        <kbd className="context-menu-shortcut">{modKey}+D</kbd>
      </button>

      <button
        type="button"
        className="context-menu-item context-menu-item-danger"
        onClick={handleDelete}
        role="menuitem"
      >
        <Trash2 size={14} />
        <span>Delete</span>
        <kbd className="context-menu-shortcut">Del</kbd>
      </button>
    </div>
  );
};
