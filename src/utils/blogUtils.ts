import { BlogPost } from "../typings";
import React from "react";

// Import blog posts directly
import advancedTypeScriptPatterns from "../blogs/2023-06-20/advanced-typescript-patterns";
import buildingCliApplications from "../blogs/2023-07-10/building-cli-applications-nodejs";
import vibeCodingToVulnerability from "../blogs/2024-03-25/vibe-coding-to-vulnerability";

// Define MDX post type with component
interface MDXPostData extends Omit<BlogPost, "content"> {
  component: React.ComponentType;
}

// Map for frontmatter data with proper typing
const MDX_FRONTMATTER: Record<string, MDXPostData> = {};

// Fix the typo in the Building CLI Applications title
const fixedBuildingCliApplications = {
  ...buildingCliApplications,
  title: "Building CLI Applications with Node.js",
};

// Blog posts collection - dynamically imported
const BLOG_POSTS: BlogPost[] = [
  vibeCodingToVulnerability,
  advancedTypeScriptPatterns,
  fixedBuildingCliApplications,
];

/**
 * Loads all blog posts (client-side implementation)
 */
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  // Combine MDX posts with regular posts
  const mdxPosts = Object.values(MDX_FRONTMATTER).map((post) => ({
    ...post,
    content: "", // Content will be rendered via the MDX component
    isMDX: true,
  }));

  // Return all posts
  return [...mdxPosts, ...BLOG_POSTS];
}

/**
 * Loads a single blog post by slug (client-side implementation)
 */
export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPost | null> {
  // Check MDX posts first
  if (MDX_FRONTMATTER[slug]) {
    return {
      ...MDX_FRONTMATTER[slug],
      content: "", // Content will be rendered via the MDX component
      isMDX: true,
    };
  }

  // Fall back to regular posts
  return BLOG_POSTS.find((post) => post.slug === slug) || null;
}

/**
 * Increment view count for a blog post with persistent storage
 */
export function incrementViewCount(postId: string): number {
  if (typeof window !== "undefined") {
    // Define a persistent version key that doesn't change across deployments
    const persistentKey = `blog_views_persistent_${postId}`;

    // Get current views with fallback to zero
    const currentViews = parseInt(
      localStorage.getItem(persistentKey) || "0",
      10
    );
    const newViews = currentViews + 1;

    // Store back to localStorage
    localStorage.setItem(persistentKey, newViews.toString());

    // For backward compatibility, also store in the old format
    const legacyKey = `blog_views_${postId}`;
    localStorage.setItem(legacyKey, newViews.toString());

    return newViews;
  }
  return 0;
}

/**
 * Get view count for a blog post with persistent storage
 */
export function getViewCount(postId: string): number {
  if (typeof window !== "undefined") {
    // First try the persistent key
    const persistentKey = `blog_views_persistent_${postId}`;
    const persistentViews = localStorage.getItem(persistentKey);

    if (persistentViews) {
      return parseInt(persistentViews, 10);
    }

    // Fall back to the legacy key (for backward compatibility)
    const legacyKey = `blog_views_${postId}`;
    const legacyViews = localStorage.getItem(legacyKey);

    if (legacyViews) {
      // If we found a legacy view count, migrate it to the persistent format
      const viewCount = parseInt(legacyViews, 10);
      localStorage.setItem(persistentKey, viewCount.toString());
      return viewCount;
    }

    return 0;
  }
  return 0;
}
