import React, { useState, useEffect } from "react";
import { BlogPost } from "../typings";
import styles from "../commands/commands.module.scss";
import MarkdownRenderer from "./MarkdownRenderer";
import { getViewCountSync, incrementViewCountSync } from "../utils/supabaseViewCount";

interface BlogListProps {
  posts: BlogPost[];
}

// Individual blog card with view count
const BlogCard: React.FC<{ post: BlogPost }> = ({ post }) => {
  const [viewCount, setViewCount] = useState<number>(0);

  useEffect(() => {
    // Get view count for this post
    const count = getViewCountSync(post.id);
    setViewCount(count);
  }, [post.id]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Increment view count when clicking to read
    const newCount = incrementViewCountSync(post.id);
    setViewCount(newCount);
    window.history.pushState(
      { id: post.id },
      "",
      `/blogs/${post.id}/${post.slug}`
    );
    // Dispatch event for route change
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <li className={styles.blogListItem}>
      <div className={styles.blogCardHeader}>
        <h3>{post.title}</h3>
        <span className={styles.viewCount}>
          👁️ {viewCount.toLocaleString()}
        </span>
      </div>
      <div className={styles.blogMeta}>
        <span>{post.date}</span> • <span>{post.author}</span>
      </div>
      <p>{post.summary}</p>
      <div className={styles.blogLink}>
        <a href={`/blogs/${post.id}/${post.slug}`} onClick={handleClick}>
          Read more →
        </a>
      </div>
    </li>
  );
};

export const BlogList: React.FC<BlogListProps> = ({ posts }) => {
  return (
    <div className={styles.blogListWrapper}>
      <h2>📝 Blog Posts</h2>
      <p className={styles.blogSubtitle}>
        Thoughts, tutorials, and random musings
      </p>
      <ul className={styles.blogList}>
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </ul>
    </div>
  );
};

interface BlogPostProps {
  post: BlogPost;
}

export const BlogPostView: React.FC<BlogPostProps> = ({ post }) => {
  const [viewCount, setViewCount] = useState<number>(0);

  useEffect(() => {
    // Increment view count when post is viewed
    const count = incrementViewCountSync(post.id);
    setViewCount(count);
  }, [post.id]);

  return (
    <div className={styles.blogPostWrapper}>
      <div className={styles.blogHeader}>
        <h1>{post.title}</h1>
        <div className={styles.blogMeta}>
          <span>{post.date}</span> • <span>{post.author}</span> • <span>👁️ {viewCount.toLocaleString()} views</span>
        </div>
      </div>
      <div className={styles.blogContent}>
        <MarkdownRenderer content={post.content} />
      </div>
      <div className={styles.blogBackLink}>
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            window.history.pushState({}, "", "/");
            window.dispatchEvent(new PopStateEvent('popstate'));
          }}
        >
          ← Back to all posts
        </a>
      </div>
    </div>
  );
};

export default { BlogList, BlogPostView };
