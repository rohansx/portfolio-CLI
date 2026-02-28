import { BlogPost } from "../typings";
import React from "react";

// Import blog posts directly
import vibeCodingToVulnerability from "../blogs/2024-03-25/vibe-coding-to-vulnerability";
import unlockingBrainPotentialLucyCognitiveEnhancement from "../blogs/2025-08-16/unlocking-brain-potential-lucy-cognitive-enhancement";
import gitWorktreeNightmare from "../blogs/2026-02-28/git-worktree-nightmare-made-me-build-workz";

// Define MDX post type with component
interface MDXPostData extends Omit<BlogPost, "content"> {
  component: React.ComponentType;
}

// Map for frontmatter data with proper typing
const MDX_FRONTMATTER: Record<string, MDXPostData> = {};

// Blog posts collection - dynamically imported
const BLOG_POSTS: BlogPost[] = [
  gitWorktreeNightmare,
  unlockingBrainPotentialLucyCognitiveEnhancement,
  vibeCodingToVulnerability,
];

// Re-export from viewCountService for backward compatibility
export { getViewCountSync, incrementViewCountSync } from "../utils/viewCountService";

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

