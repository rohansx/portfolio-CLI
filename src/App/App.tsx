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

interface AppComponentState extends AppState {
  showBlogPage: boolean;
  blogPosts: BlogPost[];
  blogPostsLoaded: boolean;
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
      blogPosts: [],
      blogPostsLoaded: false,
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

  render() {
    const { record, showBlogPage, blogPosts } = this.state;
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

    return (
      <div className={styles.wrapper}>
        <SEO
          title={blogTitle}
          description={blogDescription}
          image="https://avatars.githubusercontent.com/u/33249782?s=400&u=525a383fc9930aa547c76dfc0579ed44be306c86&v=4"
          url={window.location.href}
        />

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

        <div className={styles.window}>
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
