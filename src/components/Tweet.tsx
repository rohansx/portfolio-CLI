import { Suspense } from "react";
import { Tweet as TweetEmbed, TweetSkeleton } from "react-tweet";
import styles from "../App/App.module.scss";

interface TweetProps {
  id: string;
  caption?: string;
}

/**
 * Extracts tweet ID from a URL if needed
 */
function extractTweetId(idOrUrl: string): string {
  // Check if the id is actually a URL
  const twitterUrlMatch = idOrUrl.match(
    /https?:\/\/(x\.com|twitter\.com)\/[^\/]+\/status\/(\d+)/
  );

  if (twitterUrlMatch && twitterUrlMatch[2]) {
    return twitterUrlMatch[2];
  }

  return idOrUrl;
}

const Tweet: React.FC<TweetProps> = ({ id, caption }) => {
  // Extract ID from URL if needed
  const tweetId = extractTweetId(id);

  return (
    <div className={styles.tweetContainer}>
      <div className={styles.tweetEmbed}>
        <Suspense fallback={<TweetSkeleton />}>
          <TweetEmbed id={tweetId} />
        </Suspense>
      </div>
      {caption && <div className={styles.tweetCaption}>{caption}</div>}
    </div>
  );
};

export default Tweet;
