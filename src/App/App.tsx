import React, { useRef, useEffect, useState, useCallback } from 'react';
import styles from './AppClean.module.scss';
import InputManagerNew from '../InputManager/InputManagerNew';
import { useApp } from '../context/AppContext';
import { parseCommandChain, grepFilter } from '../utils/commandParser';
import { github_username } from '../config';
import { trackPageView } from '../analytics';
import SEO from '../components/SEO';
import BlogPage from '../components/BlogPage';
import ResumePage from '../components/ResumePage';
import ParticleBackground from '../components/ParticleBackground';
import GuiPortfolio from '../components/GuiPortfolio';
import { KeyboardShortcutsModal, CommandPalette } from '../components/KeyboardShortcuts';
import { resolveAlias } from '../utils/commandAliases';
import { useDraggable } from '../hooks/useDraggable';
import { useResizable } from '../hooks/useResizable';
import StatusBar from '../components/StatusBar';

const App: React.FC = () => {
  const windowRef = useRef<HTMLDivElement>(null);
  const titleBarRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  const [showBlogPage, setShowBlogPage] = useState(false);
  const [showResumePage, setShowResumePage] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showPalette, setShowPalette] = useState(false);
  const [invalidCommandShake, setInvalidCommandShake] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [viewMode, setViewMode] = useState<'terminal' | 'gui'>('gui');

  const {
    record,
    addToRecord,
    clearRecord,
    commands,
    blogPosts,
    trackCommand,
    settings,
    updateSettings,
    userData,
    projectData,
  } = useApp();

  // Draggable and resizable
  const { position, resetPosition } = useDraggable(windowRef, titleBarRef);
  const { size } = useResizable(windowRef);

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

  // Check for routes on mount
  useEffect(() => {
    const pathname = window.location.pathname;
    if (pathname === '/resume') {
      setShowResumePage(true);
    } else if (pathname.startsWith('/blogs')) {
      setShowBlogPage(true);
    }
  }, []);

  // Listen for 'gui' command event
  useEffect(() => {
    const handleSwitchToGui = () => setViewMode('gui');
    window.addEventListener('switch-to-gui', handleSwitchToGui);
    return () => window.removeEventListener('switch-to-gui', handleSwitchToGui);
  }, []);

  // Apply theme to body
  useEffect(() => {
    document.body.className = `theme-${settings.theme}`;
  }, [settings.theme]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Escape - Close modals
      if (e.key === 'Escape') {
        if (showHelp) setShowHelp(false);
        if (showPalette) setShowPalette(false);
        if (isMinimized) setIsMinimized(false);
      }

      // F11 - Fullscreen
      if (e.key === 'F11') {
        e.preventDefault();
        handleMaximize();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [showHelp, showPalette, isMinimized]);

  const executeCommand = useCallback(
    (commandName: string): React.ReactNode => {
      const trimmedCommand = commandName.trim();

      if (!trimmedCommand) {
        return <></>;
      }

      // Resolve alias
      const resolved = resolveAlias(trimmedCommand);

      // Handle theme command
      if (resolved.startsWith('theme ')) {
        const themeName = resolved.split(' ')[1];
        updateSettings({ theme: themeName as any });
        return <div style={{ color: 'var(--green)' }}>✓ Theme changed to: {themeName}</div>;
      }

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

      // Create a fake app object for compatibility
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
    [commands, record, blogPosts, trackCommand, clearRecord, updateSettings]
  );

  const handleExecute = useCallback(
    (input: string) => {
      const parsedCommands = parseCommandChain(input);

      parsedCommands.forEach(({ command, args, operator }) => {
        const fullCommand = [command, ...args].join(' ');
        let output = executeCommand(fullCommand);

        // Handle grep pipe
        if (operator === '|' && args[0] === 'grep' && args[1]) {
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

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  const handleMaximize = () => {
    setIsMaximized(prev => {
      const newMax = !prev;
      if (newMax) {
        resetPosition();
      }
      return newMax;
    });
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

  const handleCloseResume = () => {
    setShowResumePage(false);
    window.history.pushState({}, '', '/');
    trackPageView('/');
  };

  const handleResumeNavigate = () => {
    setShowResumePage(true);
    window.history.pushState({}, '', '/resume');
    trackPageView('/resume');
  };

  const handleModeToggle = () => {
    setViewMode(prev => prev === 'terminal' ? 'gui' : 'terminal');
  };

  // SEO metadata
  const title = 'Rohan Sharma - Full Stack Developer';
  const description =
    "Rohan Sharma's portfolio. A full stack developer specializing in JavaScript and Node.js.";

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

  if (showResumePage) {
    return <ResumePage onClose={handleCloseResume} />;
  }

  if (showBlogPage) {
    return <BlogPage onClose={handleCloseBlog} />;
  }

  // GUI Mode
  if (viewMode === 'gui') {
    return (
      <>
        <SEO
          title={blogTitle}
          description={blogDescription}
          image="https://avatars.githubusercontent.com/u/33249782?s=400&u=525a383fc9930aa547c76dfc0579ed44be306c86&v=4"
          url={window.location.href}
        />
        <GuiPortfolio
          onSwitchToTerminal={() => setViewMode('terminal')}
          onNavigateResume={handleResumeNavigate}
          onNavigateBlog={handleBlogNavigate}
          userData={userData}
          projectData={projectData}
        />
      </>
    );
  }

  if (isMinimized) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.minimizedBar} onClick={() => setIsMinimized(false)}>
          <i className="fa-fw fas fa-terminal"></i>
          <span>Terminal</span>
        </div>
      </div>
    );
  }

  const windowStyle: React.CSSProperties = isMaximized
    ? {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        maxHeight: '100vh',
        margin: 0,
        borderRadius: 0,
      }
    : {
        transform: `translate(${position.x}px, ${position.y}px)`,
        width: `${size.width}px`,
        height: `${size.height}px`,
      };

  return (
    <div className={styles.wrapper}>
      <ParticleBackground variant="connections" />
      <SEO
        title={blogTitle}
        description={blogDescription}
        image="https://avatars.githubusercontent.com/u/33249782?s=400&u=525a383fc9930aa547c76dfc0579ed44be306c86&v=4"
        url={window.location.href}
      />

      {/* TUI Nav Bar */}
      <nav className={styles.tuiNav}>
        <button className={styles.tuiNavItem} onClick={handleModeToggle}>
          [<span className={styles.tuiKey}>1</span> gui]
        </button>
        <a
          href="/blogs"
          className={styles.tuiNavItem}
          onClick={(e) => { e.preventDefault(); handleBlogNavigate(); }}
        >
          [<span className={styles.tuiKey}>2</span> blog]
        </a>
        <a
          href="/resume"
          className={styles.tuiNavItem}
          onClick={(e) => { e.preventDefault(); handleResumeNavigate(); }}
        >
          [<span className={styles.tuiKey}>3</span> resume]
        </a>
      </nav>

      {/* Terminal Window */}
      <div
        ref={windowRef}
        className={`${styles.window} ${invalidCommandShake ? styles.shake : ''} ${
          settings.theme === 'retro' || settings.theme === 'matrix' ? 'crt-effect' : ''
        }`}
        style={windowStyle}
      >
        {/* Scanline effect */}
        {(settings.theme === 'retro' || settings.theme === 'matrix') && (
          <div className="scanline"></div>
        )}

        {/* Title Bar - Clean */}
        <div ref={titleBarRef} className={styles.titleBar}>
          {/* Traffic Lights - macOS style */}
          <div className={styles.trafficLights}>
            <button
              className={`${styles.light} ${styles.red}`}
              onClick={handleMinimize}
              aria-label="Minimize"
            />
            <button
              className={`${styles.light} ${styles.yellow}`}
              onClick={handleMaximize}
              aria-label={isMaximized ? 'Restore' : 'Maximize'}
            />
            <button className={`${styles.light} ${styles.green}`} aria-label="Close" />
          </div>

          {/* Title - Centered */}
          <div className={styles.titleText}>
            rohan@sh:~
          </div>
        </div>

        <div ref={mainRef} className={styles.mainContent}>
          {/* Welcome message - shown when terminal is empty */}
          {record.length === 0 && (
            <div className={styles.welcome}>
              <div className={styles.welcomeText}>
                Welcome to <span className={styles.welcomeHighlight}>rohan@sh</span>
              </div>
              <div className={styles.welcomeHint}>
                Type <span className={styles.welcomeCmd}>ls</span> to see commands
                {' '}<span className={styles.welcomeDot}>·</span>{' '}
                Type <span className={styles.welcomeCmd}>gui</span> for GUI mode
                {' '}<span className={styles.welcomeDot}>·</span>{' '}
                Type <span className={styles.welcomeCmd}>experience</span> to see work history
              </div>
            </div>
          )}

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

        {/* Status Bar */}
        <StatusBar mode="cli" onModeToggle={handleModeToggle} />

        {/* Resize handle - invisible but functional */}
        {!isMaximized && (
          <div className={`${styles.resizeHandle} resize-handle`} />
        )}
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

export default App;
