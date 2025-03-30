import { BlogPost } from "../typings";
import { getAllBlogPosts } from "../utils/blogUtils";

let cachedPosts: BlogPost[] | null = null;

/**
 * Get all blog posts
 */
export async function getBlogPosts(): Promise<BlogPost[]> {
  if (cachedPosts) {
    return cachedPosts;
  }

  // Load posts from markdown files
  const posts = await getAllBlogPosts();
  cachedPosts = posts;
  return posts;
}

export default {
  getBlogPosts,
};
