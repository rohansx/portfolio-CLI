import React, { useRef, useEffect, useState, useCallback } from 'react';
import styles from './App.module.scss';
import InputManagerNew from '../InputManager/InputManagerNew';
import { useApp } from '../context/AppContext';
import { parseCommandChain, grepFilter } from '../utils/commandParser';
import { github_username } from '../config';
import { trackPageView } from '../analytics';
import SEO from '../components/SEO';
import BlogPage from '../components/BlogPage';
import { KeyboardShortcutsModal, CommandPalette } from '../components/KeyboardShortcuts';
import { resolveAlias } from '../utils/commandAliases';

const AppNew: React.FC = () => {
  const mainRef = useRef<HTMLDivElement>(null);
  const [showBlogPage, setShowBlogPage] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showPalette, setShowPalette] = useState(false);
  const [invalidCommandShake, setInvalidCommandShake] = useState(false);

  const {
    record,
    addToRecord,
    clearRecord,
    commands,
    blogPosts,
    trackCommand,
  } = useApp();

  // Auto-scroll to bottom when new commands are added
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo({
        top: mainRef.current.scrollHeight,
        left: 0,
        behavior: 'smooth',
      });
    }
  }, [record]);

  // Track page views
  useEffect(() => {
    trackPageView(window.location.pathname + window.location.search);
  }, [showBlogPage]);

  // Check for blog routes on mount
  useEffect(() => {
    const isBlogRoute = window.location.pathname.startsWith('/blogs');
    if (isBlogRoute) {
      setShowBlogPage(true);
    }
  }, []);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Escape - Close modals
      if (e.key === 'Escape') {
        if (showHelp) {
          setShowHelp(false);
        }
        if (showPalette) {
          setShowPalette(false);
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [showHelp, showPalette]);

  const executeCommand = useCallback(
    (commandName: string): React.ReactNode => {
      const trimmedCommand = commandName.trim();

      if (!trimmedCommand) {
        return <></>;
      }

      // Resolve alias
      const resolved = resolveAlias(trimmedCommand);

      if (!commands.has(resolved)) {
        // Trigger shake animation for invalid command
        setInvalidCommandShake(true);
        setTimeout(() => setInvalidCommandShake(false), 500);

        return (
          <>
            rohan@sh: command not found: {trimmedCommand}
            {trimmedCommand !== resolved && (
              <span style={{ color: 'var(--muted)' }}>
                {' '}(tried alias: {resolved})
              </span>
            )}
          </>
        );
      }

      // Track command usage
      trackCommand(resolved);

      // Execute command
      const command = commands.get(resolved);
      if (!command) return null;

      // Create a fake app object for compatibility with old commands
      const fakeApp = {
        state: {
          commands,
          record,
          blogPosts,
          projectDataLoaded: true,
          userDataLoaded: true,
        },
        setState: (newState: any) => {
          if (newState.record !== undefined && newState.record.length === 0) {
            clearRecord();
          }
        },
      };

      return command.execute(fakeApp as any);
    },
    [commands, record, blogPosts, trackCommand, clearRecord]
  );

  const handleExecute = useCallback(
    (input: string) => {
      const parsedCommands = parseCommandChain(input);

      // For now, execute commands sequentially without operator logic
      // In the future, we can add proper &&, ||, | support
      parsedCommands.forEach(({ command, args, operator }) => {
        const fullCommand = [command, ...args].join(' ');
        let output = executeCommand(fullCommand);

        // Handle grep pipe
        if (operator === '|' && args[0] === 'grep' && args[1]) {
          // This is simplified - in real implementation would need better parsing
          const pattern = args[1];
          if (output) {
            const textContent = extractTextFromJSX(output);
            const filtered = grepFilter(textContent, pattern);
            output = <pre>{filtered}</pre>;
          }
        }

        if (output !== null) {
          addToRecord(fullCommand, output);
        }
      });
    },
    [executeCommand, addToRecord]
  );

  // Helper to extract text from JSX
  const extractTextFromJSX = (element: any): string => {
    if (typeof element === 'string') return element;
    if (element?.props?.children) {
      if (Array.isArray(element.props.children)) {
        return element.props.children.map(extractTextFromJSX).join('');
      }
      return extractTextFromJSX(element.props.children);
    }
    return '';
  };

  const handleBlogNavigate = () => {
    setShowBlogPage(true);
    window.history.pushState({}, '', '/blogs');
    trackPageView('/blogs');
  };

  const handleCloseBlog = () => {
    setShowBlogPage(false);
    window.history.pushState({}, '', '/');
    trackPageView('/');
  };

  // SEO metadata
  const title = 'Rohan Sharma - Full Stack Developer';
  const description =
    "Rohan Sharma's portfolio. A full stack developer specializing in JavaScript and Node.js.";

  // Check if we're on a blog post route for SEO
  const match = window.location.pathname.match(/\/blogs\/(\d+)\/([a-z0-9-]+)/);
  let blogTitle = title;
  let blogDescription = description;

  if (match) {
    const [, postId] = match;
    const post = blogPosts.find((post) => post.id === postId);
    if (post) {
      blogTitle = `${post.title} | ${title}`;
      blogDescription = post.summary;
    }
  }

  if (showBlogPage) {
    return <BlogPage onClose={handleCloseBlog} />;
  }

  return (
    <div className={styles.wrapper}>
      <SEO
        title={blogTitle}
        description={blogDescription}
        image="https://avatars.githubusercontent.com/u/33249782?s=400&u=525a383fc9930aa547c76dfc0579ed44be306c86&v=4"
        url={window.location.href}
      />

      {/* Blog Navigation */}
      <div className={styles.blogNav}>
        <a
          href="/blogs"
          className={styles.blogCta}
          onClick={(e) => {
            e.preventDefault();
            handleBlogNavigate();
          }}
        >
          Blog
        </a>
      </div>

      {/* Terminal Window */}
      <div className={`${styles.window} ${invalidCommandShake ? styles.shake : ''}`}>
        <div className={styles.titleBar}>
          <div className={styles.dotHolder}>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
          </div>
          <div className={styles.titleHeader}>
            <i className="fa-fw fas fa-code"></i> rohan@sh:~
          </div>
        </div>

        <div ref={mainRef} className={styles.mainContent}>
          {record.map(({ command, output }, index) => (
            <div key={index} className={styles.commandOutput}>
              <span className={styles.promptPrefix}>
                <span>{github_username}</span>@<span>sh:</span>
                ~${' '}
                <span
                  className={
                    commands.has(command) || commands.has(resolveAlias(command))
                      ? styles.validCommand
                      : styles.invalidCommand
                  }
                >
                  {command}
                </span>
              </span>
              <div className={styles.output}>{output}</div>
            </div>
          ))}

          <InputManagerNew
            handleExecute={handleExecute}
            onShowHelp={() => setShowHelp(true)}
            onShowPalette={() => setShowPalette(true)}
          />
        </div>
      </div>

      {/* Modals */}
      {showHelp && <KeyboardShortcutsModal onClose={() => setShowHelp(false)} />}
      {showPalette && (
        <CommandPalette
          commands={commands}
          onExecute={(cmd) => handleExecute(cmd)}
          onClose={() => setShowPalette(false)}
        />
      )}
    </div>
  );
};

export default AppNew;
