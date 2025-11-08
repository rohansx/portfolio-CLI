import { useState, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';

export const useTypewriter = (text: string, onComplete?: () => void) => {
  const { settings } = useApp();
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [shouldSkip, setShouldSkip] = useState(false);

  const skip = useCallback(() => {
    setShouldSkip(true);
  }, []);

  useEffect(() => {
    if (!settings.typewriterEnabled || shouldSkip) {
      setDisplayedText(text);
      setIsTyping(false);
      onComplete?.();
      return;
    }

    setDisplayedText('');
    setIsTyping(true);

    let currentIndex = 0;
    const delay = 1000 / settings.typewriterSpeed; // Convert to ms per character

    const intervalId = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(intervalId);
        setIsTyping(false);
        onComplete?.();
      }
    }, delay);

    return () => clearInterval(intervalId);
  }, [text, settings.typewriterSpeed, settings.typewriterEnabled, shouldSkip, onComplete]);

  return {
    displayedText,
    isTyping,
    skip,
  };
};
