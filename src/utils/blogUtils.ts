import { BlogPost } from "../typings";
import React from "react";

// Import blog posts directly
import advancedTypeScriptPatterns from "../blogs/2023-06-20/advanced-typescript-patterns";
import buildingCliApplications from "../blogs/2023-07-10/building-cli-applications-nodejs";

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
 * Increment view count for a blog post
 */
export function incrementViewCount(postId: string): number {
  if (typeof window !== "undefined") {
    const storageKey = `blog_views_${postId}`;
    const currentViews = parseInt(localStorage.getItem(storageKey) || "0", 10);
    const newViews = currentViews + 1;
    localStorage.setItem(storageKey, newViews.toString());
    return newViews;
  }
  return 0;
}

/**
 * Get view count for a blog post
 */
export function getViewCount(postId: string): number {
  if (typeof window !== "undefined") {
    const storageKey = `blog_views_${postId}`;
    return parseInt(localStorage.getItem(storageKey) || "0", 10);
  }
  return 0;
}
