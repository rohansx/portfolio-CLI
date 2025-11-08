import React, { useState, useEffect } from 'react';
import styles from './KeyboardShortcuts.module.scss';

interface Shortcut {
  key: string;
  description: string;
  category: string;
}

const shortcuts: Shortcut[] = [
  { key: '↑ / ↓', description: 'Navigate command history', category: 'Navigation' },
  { key: 'Tab', description: 'Autocomplete command', category: 'Navigation' },
  { key: 'Ctrl+L', description: 'Clear terminal', category: 'Actions' },
  { key: 'Ctrl+K', description: 'Open command palette', category: 'Actions' },
  { key: 'Esc', description: 'Skip typewriter / Close modals', category: 'Actions' },
  { key: '?', description: 'Show this help', category: 'Help' },
  { key: 'Ctrl+E', description: 'Export session', category: 'Actions' },
  { key: 'Ctrl+R', description: 'Reverse search history', category: 'Navigation' },
];

export const KeyboardShortcutsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const categories = Array.from(new Set(shortcuts.map(s => s.category)));

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>⌨️ Keyboard Shortcuts</h2>
          <button onClick={onClose} className={styles.closeBtn}>✕</button>
        </div>

        <div className={styles.content}>
          {categories.map(category => (
            <div key={category} className={styles.category}>
              <h3>{category}</h3>
              <div className={styles.shortcuts}>
                {shortcuts
                  .filter(s => s.category === category)
                  .map((shortcut, i) => (
                    <div key={i} className={styles.shortcut}>
                      <kbd className={styles.key}>{shortcut.key}</kbd>
                      <span className={styles.description}>{shortcut.description}</span>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          <p>Press <kbd>?</kbd> anytime to toggle this help</p>
        </div>
      </div>
    </div>
  );
};

export const CommandPalette: React.FC<{
  commands: Map<string, any>;
  onExecute: (command: string) => void;
  onClose: () => void;
}> = ({ commands, onExecute, onClose }) => {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filteredCommands = Array.from(commands.entries())
    .filter(([name, cmd]) =>
      name.toLowerCase().includes(search.toLowerCase()) ||
      cmd.description?.toLowerCase().includes(search.toLowerCase())
    )
    .slice(0, 10);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(i => Math.min(i + 1, filteredCommands.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(i => Math.max(i - 1, 0));
      } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
        e.preventDefault();
        onExecute(filteredCommands[selectedIndex][0]);
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredCommands, selectedIndex, onExecute, onClose]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.palette} onClick={(e) => e.stopPropagation()}>
        <input
          type="text"
          className={styles.paletteInput}
          placeholder="Type a command..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setSelectedIndex(0);
          }}
          autoFocus
        />

        <div className={styles.paletteResults}>
          {filteredCommands.length === 0 ? (
            <div className={styles.noResults}>No commands found</div>
          ) : (
            filteredCommands.map(([name, cmd], i) => (
              <div
                key={name}
                className={`${styles.paletteItem} ${i === selectedIndex ? styles.selected : ''}`}
                onClick={() => {
                  onExecute(name);
                  onClose();
                }}
              >
                <span className={styles.commandName}>{name}</span>
                {cmd.description && (
                  <span className={styles.commandDesc}>{cmd.description}</span>
                )}
              </div>
            ))
          )}
        </div>

        <div className={styles.paletteFooter}>
          <span>↑↓ Navigate</span>
          <span>↵ Execute</span>
          <span>Esc Close</span>
        </div>
      </div>
    </div>
  );
};
