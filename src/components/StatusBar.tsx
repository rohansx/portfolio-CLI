import React, { useState, useEffect } from 'react';
import styles from './StatusBar.module.scss';
import { useApp } from '../context/AppContext';

interface StatusBarProps {
  mode?: 'cli' | 'gui';
  onModeToggle?: () => void;
}

const StatusBar: React.FC<StatusBarProps> = ({ mode = 'cli', onModeToggle }) => {
  const [time, setTime] = useState(new Date());
  const [visitorCount, setVisitorCount] = useState<number>(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { settings } = useApp();

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Track online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Get/increment visitor count
  useEffect(() => {
    const VISITOR_KEY = 'portfolio_total_visitors';
    const VISITED_KEY = 'portfolio_has_visited';
    
    // Get current count
    let count = parseInt(localStorage.getItem(VISITOR_KEY) || '1337', 10);
    
    // Increment if first visit in this session
    if (!sessionStorage.getItem(VISITED_KEY)) {
      count += 1;
      localStorage.setItem(VISITOR_KEY, count.toString());
      sessionStorage.setItem(VISITED_KEY, 'true');
    }
    
    setVisitorCount(count);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  return (
    <div className={styles.statusBar}>
      <div className={styles.left}>
        <span className={`${styles.status} ${isOnline ? styles.online : styles.offline}`}>
          <span className={styles.dot}></span>
          {isOnline ? 'Online' : 'Offline'}
        </span>
        <span className={styles.divider}>│</span>
        <button 
          className={styles.modeToggle} 
          onClick={onModeToggle}
          title="Toggle CLI/GUI mode (Ctrl+G)"
        >
          {mode === 'cli' ? '⌨️ CLI' : '🖼️ GUI'} Mode
        </button>
      </div>
      
      <div className={styles.center}>
        <span className={styles.theme}>
          Theme: {settings?.theme || 'dark'}
        </span>
      </div>
      
      <div className={styles.right}>
        <span className={styles.visitors}>
          👀 {formatNumber(visitorCount)} visitors
        </span>
        <span className={styles.divider}>│</span>
        <span className={styles.time}>
          {formatTime(time)}
        </span>
      </div>
    </div>
  );
};

export default StatusBar;
