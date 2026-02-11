import React, { useState, useRef, useEffect, useCallback } from 'react';
import styles from './InputManager.module.scss';
import { useApp } from '../context/AppContext';
import { useCommandHistory } from '../hooks/useCommandHistory';
import { resolveAlias } from '../utils/commandAliases';

interface InputManagerProps {
  handleExecute: (command: string) => void;
  onShowHelp?: () => void;
  onShowPalette?: () => void;
}

const InputManagerNew: React.FC<InputManagerProps> = ({
  handleExecute,
  onShowHelp,
  onShowPalette,
}) => {
  const [value, setValue] = useState('');
  const [suggestedValue, setSuggestedValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { commands, addToHistory } = useApp();
  const { navigateHistory, resetHistory } = useCommandHistory();

  // Auto-focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Keep input focused
  useEffect(() => {
    const handleFocus = () => {
      inputRef.current?.focus();
    };

    document.addEventListener('click', handleFocus);
    return () => document.removeEventListener('click', handleFocus);
  }, []);

  const updateSuggestion = useCallback((input: string) => {
    if (!input) {
      setSuggestedValue('');
      return;
    }

    // Check commands for match
    for (const cmd of commands.values()) {
      if (cmd.name.startsWith(input.toLowerCase())) {
        const suggestion = ' '.repeat(input.length) + cmd.name.substring(input.length);
        setSuggestedValue(suggestion);
        return;
      }
    }

    setSuggestedValue('');
  }, [commands]);

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const newValue = target.value.trimStart();
    setValue(newValue);
    updateSuggestion(newValue);
    resetHistory();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Tab or Right Arrow - Accept suggestion
    if ((e.key === 'Tab' || e.key === 'ArrowRight') && suggestedValue) {
      e.preventDefault();
      const newValue = value + suggestedValue.trim();
      setValue(newValue);
      setSuggestedValue('');
      if (inputRef.current) {
        inputRef.current.value = newValue;
      }
      return;
    }

    // Up Arrow - Previous command
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevCommand = navigateHistory('up');
      if (prevCommand !== null) {
        setValue(prevCommand);
        setSuggestedValue('');
        if (inputRef.current) {
          inputRef.current.value = prevCommand;
        }
      }
      return;
    }

    // Down Arrow - Next command
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextCommand = navigateHistory('down');
      if (nextCommand !== null) {
        setValue(nextCommand);
        setSuggestedValue('');
        if (inputRef.current) {
          inputRef.current.value = nextCommand;
        }
      }
      return;
    }

    // Ctrl+L - Clear terminal
    if (e.ctrlKey && e.key === 'l') {
      e.preventDefault();
      handleExecute('clear');
      return;
    }

    // Ctrl+K - Command palette
    if (e.ctrlKey && e.key === 'k') {
      e.preventDefault();
      onShowPalette?.();
      return;
    }

    // Ctrl+E - Export session
    if (e.ctrlKey && e.key === 'e') {
      e.preventDefault();
      handleExecute('export');
      return;
    }

    // ? - Show help
    if (e.key === '?' && value === '') {
      e.preventDefault();
      onShowHelp?.();
      return;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!value.trim()) {
      return;
    }

    // Resolve aliases
    const resolvedCommand = resolveAlias(value.trim());

    // Add to history
    addToHistory(value.trim());

    // Execute command
    handleExecute(resolvedCommand);

    // Reset input
    setValue('');
    setSuggestedValue('');
    resetHistory();
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const isValidCommand = commands.has(value.trim()) || commands.has(resolveAlias(value.trim()));

  return (
    <div className={styles.inputWrapper}>
      <span className={styles.promptPrefix}>
        <span>rohan</span>@<span>sh:</span>
        ~$&nbsp;
      </span>
      <form action="#" onSubmit={handleSubmit} className={styles.inputForm}>
        <span className={styles.suggested}>{suggestedValue}</span>
        <input
          className={`${styles.input} ${isValidCommand ? styles.validCommand : ''}`}
          spellCheck={false}
          placeholder="type 'ls' and hit enter to get started!"
          ref={inputRef}
          autoFocus
          onKeyDown={handleKeyDown}
          onInput={handleInput}
        />
      </form>
    </div>
  );
};

export default InputManagerNew;
