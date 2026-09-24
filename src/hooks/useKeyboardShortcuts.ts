import { useEffect } from 'react';
import { useReactFlow } from '@xyflow/react';
import { useDiagramStore } from '../store/diagramStore';

export function useKeyboardShortcuts() {
  const { fitView } = useReactFlow();
  const {
    canvasSettings,
    deleteSelected,
    duplicateSelected,
    copySelected,
    pasteClipboard,
    selectAll,
    deselectAll,
    nudgeSelected,
    setArrowMode,
  } = useDiagramStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isEditingText =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable);

      // Never trigger canvas shortcuts while typing in inputs/textareas
      if (isEditingText) {
        if (e.key === 'Escape') {
          // Let the input handler handle blur/cancel
        }
        return;
      }

      const isMac = /Mac|iPod|iPhone|iPad/.test(window.navigator.userAgent);
      const isMod = isMac ? e.metaKey : e.ctrlKey;

      // Escape: deselect / exit arrow mode
      if (e.key === 'Escape') {
        e.preventDefault();
        deselectAll();
        setArrowMode(false);
        return;
      }

      // Delete / Backspace: delete selection
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        deleteSelected();
        return;
      }

      // Ctrl+0: fit view
      if (isMod && e.key === '0') {
        e.preventDefault();
        fitView({ duration: 200, padding: 0.2 });
        return;
      }

      // Ctrl+A: select all
      if (isMod && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        selectAll();
        return;
      }

      // Ctrl+C: copy
      if (isMod && !e.shiftKey && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault();
        copySelected();
        return;
      }

      // Ctrl+V: paste
      if (isMod && !e.shiftKey && (e.key === 'v' || e.key === 'V')) {
        e.preventDefault();
        pasteClipboard();
        return;
      }

      // Ctrl+D: duplicate
      if (isMod && (e.key === 'd' || e.key === 'D')) {
        e.preventDefault();
        duplicateSelected();
        return;
      }

      // Undo: Ctrl+Z
      if (isMod && !e.shiftKey && (e.key === 'z' || e.key === 'Z')) {
        e.preventDefault();
        useDiagramStore.temporal.getState().undo();
        return;
      }

      // Redo: Ctrl+Shift+Z or Ctrl+Y
      if (
        (isMod && e.shiftKey && (e.key === 'z' || e.key === 'Z')) ||
        (isMod && (e.key === 'y' || e.key === 'Y'))
      ) {
        e.preventDefault();
        useDiagramStore.temporal.getState().redo();
        return;
      }

      // Arrow keys: nudge 1px; Shift+Arrow nudges by grid size
      if (
        e.key === 'ArrowUp' ||
        e.key === 'ArrowDown' ||
        e.key === 'ArrowLeft' ||
        e.key === 'ArrowRight'
      ) {
        e.preventDefault();
        const step = e.shiftKey ? canvasSettings.gridSize : 1;
        let dx = 0;
        let dy = 0;
        if (e.key === 'ArrowUp') dy = -step;
        if (e.key === 'ArrowDown') dy = step;
        if (e.key === 'ArrowLeft') dx = -step;
        if (e.key === 'ArrowRight') dx = step;
        nudgeSelected(dx, dy);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    fitView,
    canvasSettings.gridSize,
    deleteSelected,
    duplicateSelected,
    copySelected,
    pasteClipboard,
    selectAll,
    deselectAll,
    nudgeSelected,
    setArrowMode,
  ]);
}
