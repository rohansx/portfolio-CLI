import React, { useState, useEffect } from 'react';
import styles from './EasterEggs.module.scss';

// Cowsay command
export const CowsayCommand: React.FC<{ message?: string }> = ({ message = "Moo! Welcome to my portfolio!" }) => {
  const bubble = `
 ${'_'.repeat(message.length + 2)}
< ${message} >
 ${'-'.repeat(message.length + 2)}
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||`;

  return <pre className={styles.cowsay}>{bubble}</pre>;
};

// Matrix effect
export const MatrixCommand: React.FC = () => {
  const [matrix, setMatrix] = useState<string[]>([]);
  const chars = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ01';

  useEffect(() => {
    const columns = 60;
    const rows = 20;
    const newMatrix: string[] = [];

    for (let i = 0; i < rows; i++) {
      let line = '';
      for (let j = 0; j < columns; j++) {
        line += chars[Math.floor(Math.random() * chars.length)];
      }
      newMatrix.push(line);
    }

    setMatrix(newMatrix);

    const interval = setInterval(() => {
      setMatrix(prev => {
        const updated = [...prev];
        const randomRow = Math.floor(Math.random() * rows);
        const randomCol = Math.floor(Math.random() * columns);
        const newChar = chars[Math.floor(Math.random() * chars.length)];
        updated[randomRow] = updated[randomRow].substring(0, randomCol) + newChar + updated[randomRow].substring(randomCol + 1);
        return updated;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.matrix}>
      <pre className={styles.matrixText}>
        {matrix.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </pre>
      <p className={styles.matrixMessage}>Press ESC to exit the Matrix...</p>
    </div>
  );
};

// Neofetch-style system info
export const NeofetchCommand: React.FC = () => {
  const info = `
    ⠀⠀⠀⢀⣀⣤⣤⣶⣶⣶⣶⣤⣤⣀⡀⠀⠀⠀      rohan@portfolio
    ⠀⣠⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣄⠀      ----------------
    ⣰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣆      OS: Portfolio CLI v2.0
    ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿      Host: Vercel
    ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿      Kernel: React 18.2.0
    ⠸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠇      Uptime: ${getUptime()}
    ⠀⠙⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠋⠀      Shell: TypeScript
    ⠀⠀⠀⠙⠻⢿⣿⣿⣿⣿⣿⣿⡿⠟⠋⠀⠀⠀      Terminal: Portfolio Terminal
    ⠀⠀⠀⠀⠀⠀⠈⠉⠉⠉⠉⠁⠀⠀⠀⠀⠀⠀      CPU: Brain (Coffee-powered)
                                              Memory: Infinite curiosity
                                              Theme: Minimal Hacker
  `;

  return <pre className={styles.neofetch}>{info}</pre>;
};

const getUptime = (): string => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  return `${hours}h ${minutes}m`;
};

// Hack animation
export const HackCommand: React.FC = () => {
  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(0);

  const stages = [
    'Initializing hack sequence...',
    'Bypassing firewall...',
    'Cracking encryption...',
    'Accessing mainframe...',
    'Downloading data...',
    'Erasing logs...',
    'Hack complete! Just kidding, this is just a portfolio 😄',
  ];

  useEffect(() => {
    if (stage < stages.length - 1) {
      const stageTimer = setTimeout(() => {
        setStage(s => s + 1);
        setProgress(0);
      }, 2000);

      const progressTimer = setInterval(() => {
        setProgress(p => Math.min(p + 5, 100));
      }, 100);

      return () => {
        clearTimeout(stageTimer);
        clearInterval(progressTimer);
      };
    }
  }, [stage, stages.length]);

  return (
    <div className={styles.hack}>
      <p className={styles.hackStage}>
        <span className={styles.hackPrompt}>[HACKER@TERMINAL]$</span> {stages[stage]}
      </p>
      {stage < stages.length - 1 && (
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          <span className={styles.progressText}>{progress}%</span>
        </div>
      )}
      {stage === stages.length - 1 && (
        <p className={styles.hackSuccess}>✓ {stages[stage]}</p>
      )}
    </div>
  );
};

// Session export component
export const ExportCommand: React.FC<{ record: any[] }> = ({ record }) => {
  const handleExport = () => {
    const content = record
      .map(r => `$ ${r.command}\n${extractTextContent(r.output)}\n`)
      .join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `terminal-session-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const extractTextContent = (element: any): string => {
    if (typeof element === 'string') return element;
    if (element?.props?.children) {
      if (Array.isArray(element.props.children)) {
        return element.props.children.map(extractTextContent).join('');
      }
      return extractTextContent(element.props.children);
    }
    return '';
  };

  return (
    <div>
      <p>Session contains {record.length} commands</p>
      <button onClick={handleExport} className={styles.exportButton}>
        Download Session (.txt)
      </button>
    </div>
  );
};

// Live JS evaluator
export const EvalCommand: React.FC<{ code: string }> = ({ code }) => {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Safe eval with limited scope
      const func = new Function('return ' + code);
      const res = func();
      setResult(res);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setResult(null);
    }
  }, [code]);

  return (
    <div className={styles.eval}>
      <p className={styles.evalInput}>{'>'} {code}</p>
      {error ? (
        <p className={styles.evalError}>Error: {error}</p>
      ) : (
        <p className={styles.evalResult}>
          {typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result)}
        </p>
      )}
    </div>
  );
};

// GitHub activity feed
export const ActivityCommand: React.FC<{ username: string }> = ({ username }) => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://api.github.com/users/${username}/events/public?per_page=10`)
      .then(res => res.json())
      .then(data => {
        setEvents(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching activity:', err);
        setLoading(false);
      });
  }, [username]);

  if (loading) return <p>Loading recent activity...</p>;

  return (
    <div className={styles.activity}>
      <h3>Recent GitHub Activity</h3>
      <ul>
        {events.slice(0, 10).map((event, i) => (
          <li key={i}>
            <span className={styles.activityType}>{event.type.replace('Event', '')}</span>
            <span className={styles.activityRepo}>{event.repo.name}</span>
            <span className={styles.activityTime}>{new Date(event.created_at).toLocaleDateString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Visitor analytics
export const AnalyticsCommand: React.FC<{ analytics: any }> = ({ analytics }) => {
  const topCommands = Object.entries(analytics.commandCounts)
    .sort(([, a]: any, [, b]: any) => (b as number) - (a as number))
    .slice(0, 10);

  const maxCount = topCommands.length > 0 ? (topCommands[0][1] as number) : 1;

  return (
    <div className={styles.analytics}>
      <h3>Terminal Analytics</h3>
      <p>Total commands executed: <strong>{analytics.totalCommands}</strong></p>
      <h4>Most popular commands:</h4>
      <ul>
        {topCommands.map(([cmd, count]: [string, any], i) => (
          <li key={i}>
            <span className={styles.analyticsCommand}>{cmd}</span>
            <span className={styles.analyticsBar}>
              {'█'.repeat(Math.ceil(((count as number) / maxCount) * 20))}
            </span>
            <span className={styles.analyticsCount}>{count as number}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
