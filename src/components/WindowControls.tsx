import React from 'react';
import styles from './WindowControls.module.scss';

interface WindowControlsProps {
  onMinimize?: () => void;
  onMaximize?: () => void;
  onClose?: () => void;
  isMaximized?: boolean;
}

export const WindowControls: React.FC<WindowControlsProps> = ({
  onMinimize,
  onMaximize,
  onClose,
  isMaximized,
}) => {
  return (
    <div className={styles.controls}>
      {onMinimize && (
        <button
          className={`${styles.button} ${styles.minimize}`}
          onClick={onMinimize}
          title="Minimize"
          aria-label="Minimize window"
        >
          <span className={styles.icon}>−</span>
        </button>
      )}
      {onMaximize && (
        <button
          className={`${styles.button} ${styles.maximize}`}
          onClick={onMaximize}
          title={isMaximized ? 'Restore' : 'Maximize'}
          aria-label={isMaximized ? 'Restore window' : 'Maximize window'}
        >
          <span className={styles.icon}>{isMaximized ? '❐' : '□'}</span>
        </button>
      )}
      {onClose && (
        <button
          className={`${styles.button} ${styles.close}`}
          onClick={onClose}
          title="Close"
          aria-label="Close window"
        >
          <span className={styles.icon}>×</span>
        </button>
      )}
    </div>
  );
};

export default WindowControls;
