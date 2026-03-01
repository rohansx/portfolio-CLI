import React from "react";
import styles from "./commands.module.scss";
import { links, info } from "../config";
import { Commands, Command, BlogPost } from "../typings";
import ListElement from "../ListElement/ListElement";
import axios from "axios";
import { BlogList, BlogPostView } from "../components/Blog";
import blogPostsModule from "../blogs";
import { getBlogPostBySlug } from "../utils/blogUtils";
import { incrementBlogViewCount } from "../utils/portfolioApi";
import { useState, useEffect } from "react";
import LoadingSkeleton from "../components/LoadingSkeleton";
import ErrorBoundary from "../components/ErrorBoundary";
import { profileData } from "../data/resume";
import {
  MatrixCommand,
  ExportCommand,
  EvalCommand,
} from "../components/EasterEggs";
interface ApodData {
  title: string;
  url: string;
  explanation: string;
}
const HistoryCommand = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const today = new Date();
    const month = today.getMonth() + 1; // In JavaScript, months are 0-indexed
    const day = today.getDate();

    axios
      .get(`https://history.muffinlabs.com/date/${month}/${day}`)
      .then((response) => {
        setEvents(response.data.data.Events);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching historical events:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <LoadingSkeleton message="Loading historical events" />;
  return (
    <ul>
      {events.map((event: { year: string; text: string }, index: number) => (
        <li key={index}>
          <strong>{event.year}</strong>: {event.text}
        </li>
      ))}
    </ul>
  );
};

const SpaceCommand = () => {
  const [apodData, setApodData] = useState<ApodData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false); // Added error state

  useEffect(() => {
    const apiKey = process.env.REACT_APP_NASA_API_KEY;
    if (!apiKey) {
      console.error("NASA API key is not defined");
      setLoading(false);
      setError(true); // Set error state
      return;
    }

    axios
      .get(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}`)
      .then((response) => {
        setApodData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching APOD data:", error);
        setLoading(false);
        setError(true); // Set error state
      });
  }, []);

  if (loading) return <LoadingSkeleton message="Loading NASA APOD" type="spinner" />;
  if (error || !apodData) return <div style={{color: 'var(--red)'}}>Error loading APOD data. Check if NASA_API_KEY is configured.</div>;
  return (
    <div className="space">
      <h3>{apodData.title}</h3>
      <img src={apodData.url} alt={apodData.title} />
      <p>{apodData.explanation}</p>
    </div>
  );
};
const FutureCommand = () => {
  const [futureImageUrl, setFutureImageUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Replace with your image URL or API endpoint
    const imageUrl =
      "https://res.cloudinary.com/da6jt8q7s/image/upload/v1708936852/future_lkv1fd.jpg";
    setFutureImageUrl(imageUrl);
    setLoading(false);
  }, []);

  if (loading) return <div>Loading...</div>;
  return (
    <div className={styles.catImageContainer}>
      <img
        src={futureImageUrl}
        alt="Glimpse of the Future"
        className={styles.catImage}
      />
    </div>
  );
};

const CatCommand = () => {
  const [catImageUrl, setCatImageUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://api.thecatapi.com/v1/images/search")
      .then((response) => {
        setCatImageUrl(response.data[0].url);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching cat image:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <LoadingSkeleton message="Fetching a cute cat" type="spinner" />;
  return (
    <div className={styles.catImageContainer}>
      <img src={catImageUrl} alt="Random Cat" className={styles.catImage} />
      {/* You can also include the description here if you have one */}
    </div>
  );
};

const MemeCommand = () => {
  const [memeUrl, setMemeUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://www.reddit.com/r/dankmemes/top/.json?limit=50")
      .then((response) => {
        const posts = response.data.data.children;
        const filteredPosts = posts.filter(
          (post: any) => post.data.post_hint === "image"
        );
        const randomPost =
          filteredPosts[Math.floor(Math.random() * filteredPosts.length)];
        setMemeUrl(randomPost.data.url);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching meme:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <LoadingSkeleton message="Loading dank meme" type="spinner" />;
  return (
    <div className={styles.memeImageContainer}>
      <img src={memeUrl} alt="Random Meme" className={styles.memeImage} />
    </div>
  );
};

const rawCommands: Command[] = [
  {
    name: "ls",
    icon: "fas fa-fw fa-question-circle",
    description: "List down all available commands except 'ls' and 'info'",
    execute(app) {
      const { commands } = app.state;
      return (
        <>
          Available commands:
          {[...commands.values()]
            .filter((cmd) => cmd.name !== "ls" && cmd.name !== "info")
            .map(({ icon, name, description }, key) => (
              <ListElement
                key={key}
                icon={icon}
                name={name}
                description={description}
                help
              />
            ))}
        </>
      );
    },
  },

  {
    name: "info",
    icon: "fas fa-fw fa-info-circle",
    description: "Show information about me",
    execute(app) {
      const { userDataLoaded, userData } = app.state;
      if (!userDataLoaded) return <>sh: user data could not be fetched</>;
      const { avatar_url, login, name, bio } = userData;
      return (
        <div className={styles.infoWrapper}>
          <div className={styles.infoInner}>
            <img
              src={avatar_url}
              className={styles.avatar}
              alt="GitHub avatar"
            />
            <div className={styles.content}>
              <div className={styles.header}>
                <strong>{name}</strong> <span className="muted">@{login}</span>
              </div>
              <em className={styles.bio}>"...{bio}"</em>
              <div className={styles.info}>{info}</div>
            </div>
          </div>

          <div className={styles.icons}>
            <i className="fab fa-fw fa-react"></i>
            {/* <i className="fab fa-fw fa-tailwind"></i> */}
            <i className="fab fa-fw fa-js-square"></i>
            <i className="fab fa-fw fa-node-js"></i>
            <i className="fab fa-fw fa-python"></i>
            <i className="fab fa-fw fa-java"></i>
          </div>
        </div>
      );
    },
  },
  {
    name: "whoami",
    icon: "fas fa-fw fa-info-circle",
    description: "Show information about me",
    execute(app) {
      const { userDataLoaded, userData } = app.state;
      if (!userDataLoaded) return <>sh: user data could not be fetched</>;
      const { avatar_url, login, name, bio } = userData;
      return (
        <div className={styles.infoWrapper}>
          <div className={styles.infoInner}>
            <img
              src={avatar_url}
              className={styles.avatar}
              alt="GitHub avatar"
            />
            <div className={styles.content}>
              <div className={styles.header}>
                <strong>{name}</strong> <span className="muted">@{login}</span>
              </div>
              <em className={styles.bio}>"...{bio}"</em>
              <div className={styles.info}>{info}</div>
            </div>
          </div>

          <div className={styles.icons}>
            <i className="fab fa-fw fa-react"></i>
            {/* <i className="fab fa-fw fa-tailwind"></i> */}
            <i className="fab fa-fw fa-js-square"></i>
            <i className="fab fa-fw fa-node-js"></i>
            <i className="fab fa-fw fa-python"></i>
            <i className="fab fa-fw fa-java"></i>
          </div>
        </div>
      );
    },
  },
  {
    name: "projects",
    icon: "fas fa-fw fa-tools",
    description: "Display a list of my major projects",
    execute(app) {
      const { projectDataLoaded, projectData } = app.state;
      if (!projectDataLoaded)
        return <>rohan@sh: project data could not be fetched</>;
      return (
        <>
          {projectData.map(
            ({ name, html_url, description }: any, key: number) => (
              <ListElement
                key={key}
                icon={"fab fa-fw fa-github-alt"}
                name={name}
                link={html_url}
                description={description}
              />
            )
          )}
        </>
      );
    },
  },
  {
    name: "links",
    icon: "fas fa-fw fa-link",
    description: "Get all my important links and socials",
    execute() {
      return (
        <>
          {links.map(({ icon, name, link, description }, key) => (
            <ListElement
              key={key}
              icon={icon}
              name={name}
              link={link}
              description={description}
            />
          ))}
        </>
      );
    },
  },
  {
    name: "resume",
    icon: "fas fa-fw fa-file",
    description: "Get a link to my resume",
    execute() {
      return (
        <ListElement
          icon="fas fa-fw fa-file"
          name="Resume"
          link="https://dub.sh/rohan-cv"
          description="Click to see my resume!"
        />
      );
    },
  },

  {
    name: "space",
    icon: "fas fa-fw fa-space-shuttle",
    description:
      "Display an astronomy picture of the day and facts about space from NASA",
    execute(app) {
      return <SpaceCommand />;
    },
  },

  {
    name: "history",
    icon: "fas fa-fw fa-history",
    description:
      "It shows significant historical events that happened on this day!",
    execute(app) {
      return <HistoryCommand />;
    },
  },

  {
    name: "meme",
    icon: "fas fa-fw fa-laugh", // Use an appropriate icon
    description: "Don't type or you might get offended!",
    execute(app) {
      return <MemeCommand />;
    },
  },

  {
    name: "cat",
    icon: "fas fa-fw fa-cat",
    description: "Click to see something interesting!",
    execute(app) {
      return <CatCommand />;
    },
  },

  {
    name: "future",
    icon: "fas fa-fw fa-image", // Use an appropriate icon
    description: "See a glimpse of the future!",
    execute(app) {
      return <FutureCommand />;
    },
  },

  // Utility Commands
  {
    name: "export",
    icon: "fas fa-fw fa-download",
    description: "Export terminal session to a file",
    execute(app) {
      return <ErrorBoundary><ExportCommand record={app.state.record} /></ErrorBoundary>;
    },
  },

  {
    name: "eval",
    icon: "fas fa-fw fa-calculator",
    description: "Evaluate JavaScript expression (e.g., eval 2+2)",
    execute(app) {
      const args = app.state.record[app.state.record.length - 1]?.command.split(" ").slice(1).join(" ");
      if (!args) {
        return <div style={{color: 'var(--yellow)'}}>Usage: eval {'<expression>'}<br/>Example: eval 2+2</div>;
      }
      return <ErrorBoundary><EvalCommand code={args} /></ErrorBoundary>;
    },
  },

  {
    name: "matrix",
    icon: "fas fa-fw fa-code",
    description: "Enter the Matrix",
    execute(app) {
      return <ErrorBoundary><MatrixCommand /></ErrorBoundary>;
    },
  },

  // Theme Command
  {
    name: "theme",
    icon: "fas fa-fw fa-palette",
    description: "Change terminal theme (default, matrix, retro, cyberpunk, hacker)",
    execute(app) {
      const { ThemeCommand } = require('../components/ThemeSwitcher');
      return <ErrorBoundary><ThemeCommand /></ErrorBoundary>;
    },
  },

  {
    name: "experience",
    icon: "fas fa-fw fa-briefcase",
    description: "View my work experience",
    execute() {
      return (
        <div className={styles.experienceWrapper}>
          {profileData.experience.map((exp, i) => (
            <div key={i} className={styles.experienceItem}>
              <div>
                <a href={exp.url} target="_blank" rel="noopener noreferrer" className={styles.expCompany}>
                  {exp.company}
                </a>
                <span className={styles.expRole}> — {exp.role}</span>
              </div>
              <div className={styles.expMeta}>{exp.period} · {exp.location}</div>
              <ul className={styles.expHighlights}>
                {exp.highlights.map((h, j) => (
                  <li key={j}>{h}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );
    },
  },

  {
    name: "gui",
    icon: "fas fa-fw fa-th-large",
    description: "Switch to GUI mode",
    execute() {
      // This triggers the GUI switch via a custom event
      window.dispatchEvent(new CustomEvent('switch-to-gui'));
      return <div style={{ color: 'var(--green)' }}>Switching to GUI mode...</div>;
    },
  },

  {
    name: "clear",
    icon: "fas fa-fw fa-eraser",
    description: "Clear terminal screen",
    execute(app) {
      app.setState({
        ...app.state,
        record: [],
      });
      return null;
    },
  },

  {
    name: "blog",
    icon: "fas fa-fw fa-newspaper",
    description: "View blog posts",
    execute(app) {
      // Check if there's a slug in the URL
      const match = window.location.pathname.match(
        /\/blogs\/(\d+)\/([a-z0-9-]+)/
      );

      if (match && match[2]) {
        const slug = match[2];
        return <AsyncBlogPost slug={slug} />;
      }

      return <AsyncBlogList />;
    },
  },
];
const commands: Commands = new Map(rawCommands.map((cmd) => [cmd.name, cmd]));

// Create an async blog list component
const AsyncBlogList = () => {
  const [posts, setPosts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    const loadPosts = async () => {
      try {
        const blogPosts = await blogPostsModule.getBlogPosts();
        setPosts(blogPosts);
      } catch (err) {
        console.error("Error loading blog posts:", err);
        setError("Error loading blog posts.");
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  if (loading) {
    return <div>Loading blog posts...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return <BlogList posts={posts} />;
};

// Create an async blog post component
const AsyncBlogPost = ({ slug }: { slug: string }) => {
  const [post, setPost] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    const loadPost = async () => {
      try {
        const foundPost = await getBlogPostBySlug(slug);

        if (foundPost) {
          setPost(foundPost);
          // Increment view count
          incrementBlogViewCount(foundPost.id);
        } else {
          setError(`Blog post with slug "${slug}" not found.`);
        }
      } catch (err) {
        console.error("Error loading blog post:", err);
        setError("Error loading blog post.");
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [slug]);

  if (loading) {
    return <div>Loading blog post...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return post ? <BlogPostView post={post} /> : null;
};

export default commands;
