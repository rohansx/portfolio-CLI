import { useState, useCallback, useEffect, RefObject } from 'react';

interface Size {
  width: number;
  height: number;
}

export const useResizable = (
  elementRef: RefObject<HTMLElement>,
  initialSize: Size = { width: 700, height: 600 }
) => {
  const [size, setSize] = useState<Size>(initialSize);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.classList.contains('resize-handle')) return;

    e.preventDefault();
    setIsResizing(true);
    setResizeStart({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;

    const deltaX = e.clientX - resizeStart.x;
    const deltaY = e.clientY - resizeStart.y;

    setSize(prev => ({
      width: Math.max(400, Math.min(window.innerWidth - 100, prev.width + deltaX)),
      height: Math.max(300, Math.min(window.innerHeight - 100, prev.height + deltaY)),
    }));

    setResizeStart({ x: e.clientX, y: e.clientY });
  }, [isResizing, resizeStart]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    const element = elementRef.current;
    if (element) {
      element.addEventListener('mousedown', handleMouseDown);
      return () => {
        element.removeEventListener('mousedown', handleMouseDown);
      };
    }
  }, [elementRef, handleMouseDown]);

  const resetSize = () => {
    setSize(initialSize);
  };

  return { size, isResizing, resetSize };
};
