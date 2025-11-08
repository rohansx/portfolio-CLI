import { useState, useCallback } from 'react';
import { useApp } from '../context/AppContext';

export const useCommandHistory = () => {
  const { commandHistory } = useApp();
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const navigateHistory = useCallback(
    (direction: 'up' | 'down'): string | null => {
      if (commandHistory.length === 0) return null;

      let newIndex = historyIndex;

      if (direction === 'up') {
        newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      } else {
        newIndex = historyIndex === -1 ? -1 : Math.min(commandHistory.length - 1, historyIndex + 1);
      }

      setHistoryIndex(newIndex);
      return newIndex === -1 ? '' : commandHistory[newIndex];
    },
    [commandHistory, historyIndex]
  );

  const resetHistory = useCallback(() => {
    setHistoryIndex(-1);
  }, []);

  return {
    navigateHistory,
    resetHistory,
    currentIndex: historyIndex,
  };
};
