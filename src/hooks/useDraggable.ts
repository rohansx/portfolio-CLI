import { useState, useCallback, useEffect, RefObject } from 'react';

interface Position {
  x: number;
  y: number;
}

export const useDraggable = (elementRef: RefObject<HTMLElement>, handleRef: RefObject<HTMLElement>) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (!handleRef.current?.contains(e.target as Node)) return;

    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  }, [position, handleRef]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;

    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;

    // Constrain to viewport
    const maxX = window.innerWidth - (elementRef.current?.offsetWidth || 0);
    const maxY = window.innerHeight - (elementRef.current?.offsetHeight || 0);

    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY)),
    });
  }, [isDragging, dragStart, elementRef]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    const handle = handleRef.current;
    if (handle) {
      handle.addEventListener('mousedown', handleMouseDown);
      handle.style.cursor = 'move';
      return () => {
        handle.removeEventListener('mousedown', handleMouseDown);
      };
    }
  }, [handleRef, handleMouseDown]);

  const resetPosition = () => {
    setPosition({ x: 0, y: 0 });
  };

  return { position, isDragging, resetPosition };
};
