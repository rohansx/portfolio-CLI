import React from 'react';
import { useApp } from '../context/AppContext';
import styles from './ThemeSwitcher.module.scss';

const themes = [
  { id: 'default', name: 'Default', icon: '💻' },
  { id: 'matrix', name: 'Matrix', icon: '🟢' },
  { id: 'retro', name: 'Retro', icon: '📟' },
  { id: 'cyberpunk', name: 'Cyberpunk', icon: '🌆' },
  { id: 'hacker', name: 'Hacker', icon: '🎯' },
];

export const ThemeSwitcher: React.FC = () => {
  const { settings, updateSettings } = useApp();

  const handleThemeChange = (themeId: string) => {
    updateSettings({ theme: themeId as any });

    // Apply theme to document
    document.body.className = `theme-${themeId}`;
  };

  return (
    <div className={styles.themeSwitcher}>
      <span className={styles.label}>Theme:</span>
      <div className={styles.themes}>
        {themes.map(theme => (
          <button
            key={theme.id}
            className={`${styles.themeButton} ${settings.theme === theme.id ? styles.active : ''}`}
            onClick={() => handleThemeChange(theme.id)}
            title={theme.name}
          >
            {theme.icon}
          </button>
        ))}
      </div>
    </div>
  );
};

// Theme command component
export const ThemeCommand: React.FC = () => {
  const { settings, updateSettings } = useApp();

  return (
    <div>
      <p>Current theme: <strong>{settings.theme}</strong></p>
      <p>Available themes:</p>
      <ul>
        {themes.map(theme => (
          <li key={theme.id}>
            {theme.icon} <strong>{theme.name}</strong> - <code>theme {theme.id}</code>
          </li>
        ))}
      </ul>
      <p style={{ color: 'var(--muted)', fontSize: '0.9em', marginTop: '10px' }}>
        Usage: <code>theme [name]</code> or use the theme switcher in the title bar
      </p>
    </div>
  );
};

export default ThemeSwitcher;
