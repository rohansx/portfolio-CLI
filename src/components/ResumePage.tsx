import React from 'react';
import styles from './ResumePage.module.scss';
import { resumeMarkdown } from '../data/resume';

interface ResumePageProps {
  onClose: () => void;
}

// Simple markdown renderer for resume
const renderResumeMarkdown = (markdown: string): React.ReactNode => {
  const lines = markdown.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: string[] = [];
  let key = 0;

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={key++}>
          {currentList.map((item, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: parseInline(item) }} />
          ))}
        </ul>
      );
      currentList = [];
    }
  };

  // Parse inline markdown (bold, italic, links)
  const parseInline = (text: string): string => {
    return text
      // Links [text](url)
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      // Bold **text**
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      // Italic *text*
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      // Inline code `text`
      .replace(/`([^`]+)`/g, '<code>$1</code>');
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip empty lines
    if (!trimmed) {
      flushList();
      continue;
    }

    // Horizontal rule
    if (trimmed === '---') {
      flushList();
      elements.push(<hr key={key++} />);
      continue;
    }

    // Headers
    if (trimmed.startsWith('# ')) {
      flushList();
      elements.push(
        <h1 key={key++} dangerouslySetInnerHTML={{ __html: parseInline(trimmed.slice(2)) }} />
      );
      continue;
    }

    if (trimmed.startsWith('## ')) {
      flushList();
      elements.push(
        <h2 key={key++} dangerouslySetInnerHTML={{ __html: parseInline(trimmed.slice(3)) }} />
      );
      continue;
    }

    if (trimmed.startsWith('### ')) {
      flushList();
      elements.push(
        <h3 key={key++} dangerouslySetInnerHTML={{ __html: parseInline(trimmed.slice(4)) }} />
      );
      continue;
    }

    // List items
    if (trimmed.startsWith('- ')) {
      currentList.push(trimmed.slice(2));
      continue;
    }

    // Regular paragraph
    flushList();
    elements.push(
      <p key={key++} dangerouslySetInnerHTML={{ __html: parseInline(trimmed) }} />
    );
  }

  flushList();
  return elements;
};

const ResumePage: React.FC<ResumePageProps> = ({ onClose }) => {
  const handleDownload = () => {
    window.print();
  };

  return (
    <div className={styles.container}>
      {/* Brutal floating buttons */}
      <div className={styles.brutalActions}>
        <button onClick={onClose} className={styles.brutalBtn}>
          <span className={styles.btnArrow}>&larr;</span>
          <span className={styles.btnText}>BACK</span>
        </button>
        <button onClick={handleDownload} className={`${styles.brutalBtn} ${styles.primary}`}>
          <span className={styles.btnText}>GET PDF</span>
          <span className={styles.btnArrow}>&darr;</span>
        </button>
      </div>

      <div className={styles.resumeWrapper}>
        <div className={styles.resume}>
          {renderResumeMarkdown(resumeMarkdown)}
        </div>
      </div>

      {/* Corner decoration */}
      <div className={styles.cornerDecor}></div>
    </div>
  );
};

export default ResumePage;
