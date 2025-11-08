import React from 'react';
import { useTypewriter } from '../hooks/useTypewriter';

interface TypewriterTextProps {
  text: string;
  onComplete?: () => void;
  children?: (props: { displayedText: string; isTyping: boolean }) => React.ReactNode;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  onComplete,
  children
}) => {
  const { displayedText, isTyping, skip } = useTypewriter(text, onComplete);

  // Allow skipping with ESC key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isTyping) {
        skip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTyping, skip]);

  if (children) {
    return <>{children({ displayedText, isTyping })}</>;
  }

  return <>{displayedText}</>;
};

export default TypewriterText;
