import React from 'react';
import styles from './LoadingSkeleton.module.scss';

interface LoadingSkeletonProps {
  type?: 'pulse' | 'spinner' | 'progress';
  message?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  type = 'pulse',
  message = 'Loading...'
}) => {
  if (type === 'spinner') {
    return (
      <div className={styles.spinner}>
        <div className={styles.spinnerCircle}></div>
        <span className={styles.message}>{message}</span>
      </div>
    );
  }

  if (type === 'progress') {
    return (
      <div className={styles.progress}>
        <div className={styles.progressBar}>
          <div className={styles.progressIndeterminate}></div>
        </div>
        <span className={styles.message}>{message}</span>
      </div>
    );
  }

  return (
    <div className={styles.pulse}>
      <span className={styles.message}>{message}</span>
      <span className={styles.dots}>
        <span>.</span>
        <span>.</span>
        <span>.</span>
      </span>
    </div>
  );
};

export default LoadingSkeleton;
