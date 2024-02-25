import React from "react";
import styles from "./commands.module.scss";
import { links, info } from "../config";
import { Commands, Command } from "../typings";
import ListElement from "../ListElement/ListElement";
import axios from "axios";

import { useState, useEffect } from "react";

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

  if (loading) return <div>Loading...</div>;
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

  if (loading) return <div>Loading...</div>;
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
    description: "List down all available commands",
    execute(app) {
      const { commands } = app.state;
      return (
        <>
          Available commands:
          {[...commands.values()].map(({ icon, name, description }, key) => (
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
          link="https://bit.ly/rohansh"
          description="Click to see my resume!"
        />
      );
    },
  },

  {
    name: "meme",
    icon: "fas fa-fw fa-laugh", // Use an appropriate icon
    description: "Don't click or you might get offended!",
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
    name: "clear",
    icon: "fas fa-fw fa-eraser",
    description: "Clear terminal screen",
    execute(app) {
      app.setState({
        ...app.state,
        record: [],
      });
    },
  },
];
const commands: Commands = new Map(rawCommands.map((cmd) => [cmd.name, cmd]));

export default commands;
