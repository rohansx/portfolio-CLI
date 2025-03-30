import React from "react";
import { BlogPost } from "../typings";
import styles from "../commands/commands.module.scss";
import MarkdownRenderer from "./MarkdownRenderer";

interface BlogListProps {
  posts: BlogPost[];
}

export const BlogList: React.FC<BlogListProps> = ({ posts }) => {
  return (
    <div className={styles.blogListWrapper}>
      <h2>Blog Posts</h2>
      <ul className={styles.blogList}>
        {posts.map((post) => (
          <li key={post.id} className={styles.blogListItem}>
            <h3>{post.title}</h3>
            <div className={styles.blogMeta}>
              <span>{post.date}</span> • <span>{post.author}</span>
            </div>
            <p>{post.summary}</p>
            <div className={styles.blogLink}>
              <a
                href={`#blog/${post.id}/${post.slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  window.history.pushState(
                    { id: post.id },
                    "",
                    `/blogs/${post.id}/${post.slug}`
                  );
                }}
              >
                Read more &rarr;
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

interface BlogPostProps {
  post: BlogPost;
}

export const BlogPostView: React.FC<BlogPostProps> = ({ post }) => {
  return (
    <div className={styles.blogPostWrapper}>
      <div className={styles.blogHeader}>
        <h1>{post.title}</h1>
        <div className={styles.blogMeta}>
          <span>{post.date}</span> • <span>{post.author}</span>
        </div>
      </div>
      <div className={styles.blogContent}>
        <MarkdownRenderer content={post.content} />
      </div>
      <div className={styles.blogBackLink}>
        <a
          href="#blogs"
          onClick={(e) => {
            e.preventDefault();
            window.history.pushState({}, "", "/");
          }}
        >
          &larr; Back to all posts
        </a>
      </div>
    </div>
  );
};

export default { BlogList, BlogPostView };
