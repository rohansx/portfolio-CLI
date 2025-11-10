import React, { useEffect, useState } from 'react';
import styles from './TabCompletion.module.scss';

interface TabCompletionProps {
  suggestions: string[];
  selectedIndex: number;
  onSelect: (suggestion: string) => void;
  position: { top: number; left: number };
}

export const TabCompletion: React.FC<TabCompletionProps> = ({
  suggestions,
  selectedIndex,
  onSelect,
  position,
}) => {
  if (suggestions.length === 0) return null;

  return (
    <div
      className={styles.dropdown}
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      {suggestions.map((suggestion, index) => (
        <div
          key={suggestion}
          className={`${styles.item} ${index === selectedIndex ? styles.selected : ''}`}
          onClick={() => onSelect(suggestion)}
        >
          <span className={styles.icon}>▸</span>
          <span className={styles.text}>{suggestion}</span>
        </div>
      ))}
    </div>
  );
};

export default TabCompletion;
