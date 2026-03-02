import React, { useState, useEffect } from 'react';
import styles from './StatusBar.module.scss';
import { useApp } from '../context/AppContext';
import { incrementVisitorCount, getVisitorCount } from '../utils/portfolioApi';

interface StatusBarProps {
  mode?: 'cli' | 'gui';
  onModeToggle?: () => void;
}

const StatusBar: React.FC<StatusBarProps> = ({ mode = 'cli', onModeToggle }) => {
  const [time, setTime] = useState(new Date());
  const [visitorCount, setVisitorCount] = useState<number>(
    parseInt(localStorage.getItem('portfolio_visitors') || '0', 10)
  );
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

  // Get visitor count from API
  useEffect(() => {
    const fetchCount = async () => {
      try {
        // Increment if first visit in session
        const count = await incrementVisitorCount();
        setVisitorCount(count);
      } catch (error) {
        // Fallback
        const cached = localStorage.getItem('portfolio_visitors');
        setVisitorCount(cached ? parseInt(cached, 10) : 1337);
      }
    };
    
    fetchCount();
    
    // Refresh count every 60 seconds
    const interval = setInterval(async () => {
      const count = await getVisitorCount();
      setVisitorCount(count);
    }, 60000);
    
    return () => clearInterval(interval);
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
