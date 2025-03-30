import React, { useEffect, useRef } from "react";
import styles from "../App/App.module.scss";

interface TwitterEmbedProps {
  tweetId: string;
  theme?: "dark" | "light";
}

const TwitterEmbed: React.FC<TwitterEmbedProps> = ({
  tweetId,
  theme = "dark",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only load if we have the container and the tweet ID
    if (containerRef.current && tweetId && typeof window !== "undefined") {
      // Clean up any previous tweet
      if (containerRef.current.firstChild) {
        containerRef.current.innerHTML = "";
      }

      // Create the tweet HTML
      const tweetElement = document.createElement("div");
      tweetElement.innerHTML = `
        <blockquote class="twitter-tweet" data-theme="${theme}" data-dnt="true">
          <a href="https://twitter.com/x/status/${tweetId}"></a>
        </blockquote>
      `;
      containerRef.current.appendChild(tweetElement);

      // Load Twitter widget
      if (window.twttr) {
        window.twttr.widgets.load(containerRef.current);
      } else {
        const script = document.createElement("script");
        script.src = "https://platform.twitter.com/widgets.js";
        script.async = true;
        script.onload = () => {
          if (window.twttr) {
            window.twttr.widgets.load(containerRef.current);
          }
        };
        document.body.appendChild(script);
      }
    }
  }, [tweetId, theme]);

  return (
    <div className={styles.twitterEmbed} ref={containerRef}>
      {/* Tweet will be loaded here */}
      <div className={styles.twitterPlaceholder}>Loading tweet...</div>
    </div>
  );
};

export default TwitterEmbed;
