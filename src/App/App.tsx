// src/App.tsx

import React, { Component, createRef, RefObject } from "react";
import styles from "./App.module.scss";
import commands from "../commands/commands";
import { projects, github_username } from "../config";
import { AppState, BlogPost } from "../typings";
import InputManager from "../InputManager/InputManager";
import { trackPageView } from "../analytics"; // Import the tracking function
import SEO from "../components/SEO";
import blogPostsModule from "../blogs";
import BlogPage from "../components/BlogPage";
import GuiPortfolio from "../components/GuiPortfolio";
import ResumePage from "../components/ResumePage";

interface AppComponentState extends AppState {
  showBlogPage: boolean;
  showResumePage: boolean;
  blogPosts: BlogPost[];
  blogPostsLoaded: boolean;
  windowWidth: number;
  windowHeight: number;
  windowX: number;
  windowY: number;
  isDragging: boolean;
  isResizing: string | null; // 'n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'
  dragStart: { x: number; y: number; winX: number; winY: number; winW: number; winH: number };
  viewMode: 'terminal' | 'gui';
}

class App extends Component<{}, AppComponentState> {
  mainRef: RefObject<any>;
  handleExecute: (arg: string) => void;

  constructor(props: any) {
    super(props);
    this.state = {
      record: [],
      commands: commands,
      projectDataLoaded: false,
      userDataLoaded: false,
      showBlogPage: false,
      showResumePage: false,
      blogPosts: [],
      blogPostsLoaded: false,
      windowWidth: 850,
      windowHeight: 700,
      windowX: (window.innerWidth - 850) / 2,
      windowY: (window.innerHeight - 700) / 2,
      isDragging: false,
      isResizing: null,
      dragStart: { x: 0, y: 0, winX: 0, winY: 0, winW: 0, winH: 0 },
      viewMode: 'gui', // Default to GUI for general visitors
    };

    this.mainRef = createRef();

    this.handleExecute = (arg) => {
      const { commands } = this.state;
      const commandName = arg.trim();
      let output;
      if (!commandName) output = <></>;
      else if (!commands.has(commandName))
        output = <>rohan@sh: command not found: {commandName}</>;
      else output = commands.get(commandName)?.execute(this);
      if (output)
        this.setState({
          ...this.state,
          record: [
            ...this.state.record,
            {
              command: commandName,
              output: output,
            },
          ],
        });
    };
  }

  async componentDidMount() {
    // Load blog posts first
    try {
      const blogPosts = await blogPostsModule.getBlogPosts();
      this.setState({
        blogPosts,
        blogPostsLoaded: true,
      });

      // Check if we're on a blog route or blog post route
      this.handleBlogRoutes();
    } catch (error) {
      console.error("Error loading blog posts:", error);
      this.setState({ blogPostsLoaded: true });
    }

    // Fetch project data from github
    const promises = projects.map((project) =>
      fetch(`https://api.github.com/repos/${project}`).then((res) => res.json())
    );
    const projectData = [];
    for (const promise of promises) projectData.push(await promise);
    const userData = await fetch(
      `https://api.github.com/users/${github_username}`
    ).then((res) => res.json());
    this.setState({
      ...this.state,
      projectDataLoaded: true,
      projectData: projectData,
      userDataLoaded: true,
      userData: userData,
    });

    // Track initial page view
    trackPageView(window.location.pathname + window.location.search);
  }

  handleBlogRoutes = () => {
    const { blogPosts } = this.state;
    
    // Check for /resume route
    if (window.location.pathname === "/resume") {
      this.setState({ showResumePage: true });
      return;
    }
    
    // Check if we're on a blog route
    const isBlogRoute = window.location.pathname.startsWith("/blogs");
    if (isBlogRoute) {
      this.setState({ showBlogPage: true });
    } else {
      // Check if we're on a blog post route
      const match = window.location.pathname.match(
        /\/blogs\/(\d+)\/([a-z0-9-]+)/
      );
      if (match) {
        const [, postId, slug] = match;
        const post = blogPosts.find(
          (post) => post.id === postId && post.slug === slug
        );
        if (post) {
          this.handleExecute("blog");
        }
      }
    }
  };

  handleResumeNavigate = () => {
    this.setState({ showResumePage: true });
    window.history.pushState({}, "", "/resume");
    trackPageView("/resume");
  };

  handleCloseResume = () => {
    this.setState({ showResumePage: false });
    window.history.pushState({}, "", "/");
    trackPageView("/");
  };

  componentDidUpdate(_: any, prevState: AppComponentState) {
    // auto scroll
    if (
      prevState.record.length !== this.state.record.length &&
      this.mainRef?.current
    )
      this.mainRef.current.scrollTo({
        top: this.mainRef.current.scrollHeight,
        left: 0,
        behavior: "smooth",
      });

    // Track page view on update
    trackPageView(window.location.pathname + window.location.search);
  }

  handleBlogNavigate = () => {
    this.setState({ showBlogPage: true });
    window.history.pushState({}, "", "/blogs");
    trackPageView("/blogs");
  };

  handleCloseBlog = () => {
    this.setState({ showBlogPage: false });
    window.history.pushState({}, "", "/");
    trackPageView("/");
  };

  // Smooth drag handler using requestAnimationFrame
  rafId: number = 0;
  pendingUpdate: { x?: number; y?: number; w?: number; h?: number } | null = null;

  applyUpdate = () => {
    if (this.pendingUpdate) {
      const { x, y, w, h } = this.pendingUpdate;
      this.setState(prev => ({
        ...(x !== undefined && { windowX: x }),
        ...(y !== undefined && { windowY: y }),
        ...(w !== undefined && { windowWidth: w }),
        ...(h !== undefined && { windowHeight: h }),
      } as any));
      this.pendingUpdate = null;
    }
  };

  handleDragStart = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(`.${styles.dotHolder}`)) return;
    e.preventDefault();
    
    const { windowX, windowY, windowWidth, windowHeight } = this.state;
    this.setState({
      isDragging: true,
      dragStart: { x: e.clientX, y: e.clientY, winX: windowX, winY: windowY, winW: windowWidth, winH: windowHeight },
    });
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
  };

  handleResizeStart = (edge: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const { windowX, windowY, windowWidth, windowHeight } = this.state;
    this.setState({
      isResizing: edge,
      dragStart: { x: e.clientX, y: e.clientY, winX: windowX, winY: windowY, winW: windowWidth, winH: windowHeight },
    });
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
  };

  handleMouseMove = (e: MouseEvent) => {
    const { isDragging, isResizing, dragStart } = this.state;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    const minW = 500, minH = 400;

    if (isDragging) {
      const newX = Math.max(0, Math.min(dragStart.winX + dx, window.innerWidth - dragStart.winW));
      const newY = Math.max(0, Math.min(dragStart.winY + dy, window.innerHeight - dragStart.winH));
      this.pendingUpdate = { x: newX, y: newY };
    } else if (isResizing) {
      let { winX, winY, winW, winH } = dragStart;
      
      if (isResizing.includes('e')) winW = Math.max(minW, winW + dx);
      if (isResizing.includes('w')) { winW = Math.max(minW, winW - dx); winX = dragStart.winX + dragStart.winW - winW; }
      if (isResizing.includes('s')) winH = Math.max(minH, winH + dy);
      if (isResizing.includes('n')) { winH = Math.max(minH, winH - dy); winY = dragStart.winY + dragStart.winH - winH; }
      
      this.pendingUpdate = { x: winX, y: winY, w: winW, h: winH };
    }

    if (!this.rafId) {
      this.rafId = requestAnimationFrame(() => {
        this.applyUpdate();
        this.rafId = 0;
      });
    }
  };

  handleMouseUp = () => {
    this.setState({ isDragging: false, isResizing: null });
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = 0;
    }
  };

  handleDoubleClickTitle = () => {
    this.setState({
      windowX: (window.innerWidth - this.state.windowWidth) / 2,
      windowY: (window.innerHeight - this.state.windowHeight) / 2,
    });
  };

  handleSwitchToGui = () => {
    this.setState({ viewMode: 'gui' });
  };

  handleSwitchToTerminal = () => {
    this.setState({ viewMode: 'terminal' });
  };

  render() {
    const { record, showBlogPage, blogPosts, windowWidth, windowHeight, windowX, windowY, isResizing, isDragging, viewMode, userData, projectData } = this.state;
    
    const windowStyle: React.CSSProperties = {
      width: windowWidth,
      height: windowHeight,
      transform: `translate3d(${windowX}px, ${windowY}px, 0)`,
      position: 'absolute',
      left: 0,
      top: 0,
      margin: 0,
      maxHeight: 'none',
      userSelect: isResizing || isDragging ? 'none' : 'auto',
      willChange: isDragging || isResizing ? 'transform, width, height' : 'auto',
    };
    const title = "Rohan Sharma - Full Stack Developer";
    const description =
      "Rohan Sharma's portfolio. A full stack developer specializing in JavaScript and Node.js.";

    // Check if we're on a blog post route to set appropriate meta
    const match = window.location.pathname.match(
      /\/blogs\/(\d+)\/([a-z0-9-]+)/
    );
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
      return <BlogPage onClose={this.handleCloseBlog} />;
    }

    if (this.state.showResumePage) {
      return <ResumePage onClose={this.handleCloseResume} />;
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
            onSwitchToTerminal={this.handleSwitchToTerminal}
            onNavigateResume={this.handleResumeNavigate}
            userData={userData}
            projectData={projectData}
          />
        </>
      );
    }

    // Terminal Mode
    return (
      <div className={styles.wrapper}>
        <SEO
          title={blogTitle}
          description={blogDescription}
          image="https://avatars.githubusercontent.com/u/33249782?s=400&u=525a383fc9930aa547c76dfc0579ed44be306c86&v=4"
          url={window.location.href}
        />

        {/* GUI toggle button */}
        <button className={styles.guiToggle} onClick={this.handleSwitchToGui} title="Switch to GUI">
          <i className="fas fa-th-large"></i>
        </button>

        <div className={styles.blogNav}>
          <a
            href="/blogs"
            className={styles.blogCta}
            onClick={(e) => {
              e.preventDefault();
              this.handleBlogNavigate();
            }}
          >
            Blog
          </a>
        </div>

        <div className={styles.gridCanvas} />
        
        <div 
          className={styles.window}
          style={windowStyle}
        >
          {/* Resize edges */}
          <div className={`${styles.resizeEdge} ${styles.resizeN}`} onMouseDown={this.handleResizeStart('n')} />
          <div className={`${styles.resizeEdge} ${styles.resizeS}`} onMouseDown={this.handleResizeStart('s')} />
          <div className={`${styles.resizeEdge} ${styles.resizeE}`} onMouseDown={this.handleResizeStart('e')} />
          <div className={`${styles.resizeEdge} ${styles.resizeW}`} onMouseDown={this.handleResizeStart('w')} />
          <div className={`${styles.resizeEdge} ${styles.resizeNE}`} onMouseDown={this.handleResizeStart('ne')} />
          <div className={`${styles.resizeEdge} ${styles.resizeNW}`} onMouseDown={this.handleResizeStart('nw')} />
          <div className={`${styles.resizeEdge} ${styles.resizeSE}`} onMouseDown={this.handleResizeStart('se')} />
          <div className={`${styles.resizeEdge} ${styles.resizeSW}`} onMouseDown={this.handleResizeStart('sw')} />
          
          <div 
            className={styles.titleBar}
            onMouseDown={this.handleDragStart}
            onDoubleClick={this.handleDoubleClickTitle}
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          >
            <div className={styles.dotHolder}>
              <div className={styles.dot}></div>
              <div className={styles.dot}></div>
              <div className={styles.dot}></div>
            </div>
            <div className={styles.titleHeader}>
              <i className="fa-fw fas fa-code"></i> rohan@sh:~
            </div>
          </div>
          <div ref={this.mainRef} className={styles.mainContent}>
            {record.map(({ command, output }, index) => (
              <div key={index}>
                <span className={styles.promptPrefix}>
                  <span>{github_username}</span>@<span>sh:</span>
                  ~${" "}
                  <span
                    className={
                      commands.has(command)
                        ? styles.validCommand
                        : styles.invalidCommand
                    }
                  >
                    {command}
                  </span>
                </span>
                <div>{output}</div>
              </div>
            ))}
            <InputManager handleExecute={this.handleExecute} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
