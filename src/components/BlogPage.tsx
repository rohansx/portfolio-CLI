import React, { useEffect, useState } from "react";
import { BlogPost } from "../typings";
import blogPostsModule from "../blogs";
import styles from "../App/App.module.scss";
import MarkdownRenderer from "./MarkdownRenderer";
import SEO from "./SEO";
import {
  getViewCount as getViewCountOriginal,
  incrementViewCount as incrementViewCountOriginal,
} from "../utils/blogUtils";
import { MDXProvider } from "@mdx-js/react";
import Tweet from "./Tweet";
// Import the async versions for future use
import {
  getViewCount as getViewCountAsync,
  incrementViewCount as incrementViewCountAsync,
} from "../utils/firebaseViewCount";

// MDX components to enhance the MDX rendering
const mdxComponents = {
  wrapper: (props: any) => <div className={styles.mdxWrapper} {...props} />,
  Tweet: Tweet, // Pass our custom Tweet component to MDX
  // You can add more custom components here
};

interface BlogPageProps {
  onClose: () => void;
}

const BlogPage: React.FC<BlogPageProps> = ({ onClose }) => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [viewCounts, setViewCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load blog posts
    const loadPosts = async () => {
      try {
        const posts = await blogPostsModule.getBlogPosts();
        setBlogPosts(posts);

        // Load view counts
        const counts: Record<string, number> = {};
        posts.forEach((post) => {
          counts[post.id] = getViewCount(post.id);
        });
        setViewCounts(counts);

        // Check if there's a post ID in the URL
        const match = window.location.pathname.match(
          /\/blogs\/(\d+)\/([a-z0-9-]+)/
        );
        if (match && match[1] && match[2]) {
          const postId = match[1];
          const post = posts.find((p) => p.id === postId);
          if (post) {
            setSelectedPost(post);
            // Increment view count
            const newCount = incrementViewCount(post.id);
            setViewCounts((prev) => ({ ...prev, [post.id]: newCount }));
          }
        }
      } catch (error) {
        console.error("Error loading blog posts:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  const handlePostClick = (post: BlogPost) => {
    setSelectedPost(post);
    window.history.pushState(
      { id: post.id },
      "",
      `/blogs/${post.id}/${post.slug}`
    );

    // Increment view count
    const newCount = incrementViewCount(post.id);
    setViewCounts((prev) => ({ ...prev, [post.id]: newCount }));
  };

  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedPost(null);
    window.history.pushState({}, "", "/blogs");
  };

  // Sort posts by date (newest first)
  const sortedBlogPosts = [...blogPosts].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const renderSocialLinks = () => {
    return (
      <div className={styles.blogFooter}>
        <div className={styles.authorName}>
          {selectedPost?.author || "Rohan Sharma"} © {new Date().getFullYear()}
        </div>
        <div className={styles.socialLinks}>
          <a
            href="https://github.com/rohansx"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-github"></i>
          </a>
          <a
            href="https://twitter.com/rsxwtf"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-twitter"></i>
          </a>
          <a
            href="https://linkedin.com/in/rohansx"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-linkedin"></i>
          </a>
        </div>
      </div>
    );
  };

  // Synchronous wrappers for the async functions
  function getViewCount(postId: string): number {
    // Start async fetch but don't wait for it
    getViewCountAsync(postId)
      .then((count) => {
        // Cache the result from async function for future use
        localStorage.setItem(
          `blog_views_persistent_${postId}`,
          count.toString()
        );
      })
      .catch((err) => {
        console.error("Error fetching view count:", err);
      });

    // Meanwhile, return the synchronous version
    return getViewCountOriginal(postId);
  }

  function incrementViewCount(postId: string): number {
    // Start async increment but don't wait for it
    incrementViewCountAsync(postId)
      .then((count) => {
        // Cache the result from async function
        localStorage.setItem(
          `blog_views_persistent_${postId}`,
          count.toString()
        );
      })
      .catch((err) => {
        console.error("Error incrementing view count:", err);
      });

    // Meanwhile, return the synchronous version
    return incrementViewCountOriginal(postId);
  }

  if (loading) {
    return (
      <div className={styles.wrapperBlog}>
        <div className={styles.blogContainer}>
          <p>Loading blog posts...</p>
        </div>
      </div>
    );
  }

  if (selectedPost) {
    return (
      <div className={styles.wrapperBlog}>
        <SEO
          title={`${selectedPost.title} | Blog`}
          description={selectedPost.summary}
          image="https://avatars.githubusercontent.com/u/33249782?s=400&u=525a383fc9930aa547c76dfc0579ed44be306c86&v=4"
          url={window.location.href}
        />
        <div className={styles.blogContainer}>
          <div className={styles.blogHeader}>
            <a href="#" onClick={handleBackClick}>
              ← Index
            </a>
            <h1 className={styles.blogTitle}>{selectedPost.title}</h1>
            <p className={styles.blogDate}>
              {formatDate(selectedPost.date)} •{" "}
              {viewCounts[selectedPost.id] || 0} views
            </p>
          </div>

          {selectedPost.isMDX && selectedPost.component ? (
            <MDXProvider components={mdxComponents}>
              <div className={styles.markdownContent}>
                {React.createElement(selectedPost.component)}
              </div>
            </MDXProvider>
          ) : (
            <MarkdownRenderer content={selectedPost.content} />
          )}

          {renderSocialLinks()}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapperBlog}>
      <SEO
        title="Blog | Portfolio"
        description="Collection of articles and thoughts on programming and technology"
        image="https://avatars.githubusercontent.com/u/33249782?s=400&u=525a383fc9930aa547c76dfc0579ed44be306c86&v=4"
        url={window.location.href}
      />
      <div className={styles.blogContainer}>
        <div className={styles.blogHeader}>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onClose();
            }}
          >
            ← Index
          </a>
          <h1 className={styles.blogTitle}>Blog</h1>
        </div>

        <table className={styles.blogPostsTable}>
          <thead>
            <tr className={styles.headerRow}>
              <th>date</th>
              <th>title</th>
              <th style={{ textAlign: "right" }}>views</th>
            </tr>
          </thead>
          <tbody>
            {sortedBlogPosts.map((post) => (
              <tr key={post.id}>
                <td className={styles.dateColumn}>
                  {formatDate(post.date).split(",")[0]}
                </td>
                <td className={styles.titleColumn}>
                  <a
                    href={`/blogs/${post.id}/${post.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handlePostClick(post);
                    }}
                  >
                    {post.title}
                  </a>
                </td>
                <td className={styles.viewsColumn}>
                  {viewCounts[post.id] || 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {renderSocialLinks()}
      </div>
    </div>
  );
};

export default BlogPage;
