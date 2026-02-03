/**
 * View Count Service - Uses local PostgreSQL API
 */

// Cache for view counts to reduce API calls
const viewCountCache: Record<string, { count: number; timestamp: number }> = {};
const CACHE_DURATION = 30000; // 30 seconds

/**
 * Get view count for a blog post
 */
export async function getViewCount(postId: string): Promise<number> {
  // Check cache first
  const cached = viewCountCache[postId];
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.count;
  }

  try {
    const response = await fetch(`/api/portfolio/blog/${postId}/views`);
    if (!response.ok) {
      return getViewCountFromLocalStorage(postId);
    }
    const data = await response.json();
    const count = data.count || 0;
    
    viewCountCache[postId] = { count, timestamp: Date.now() };
    localStorage.setItem(`blog_views_persistent_${postId}`, count.toString());
    
    return count;
  } catch (error) {
    console.error('Error fetching view count:', error);
    return getViewCountFromLocalStorage(postId);
  }
}

/**
 * Increment view count for a blog post
 */
export async function incrementViewCount(postId: string): Promise<number> {
  try {
    const response = await fetch(`/api/portfolio/blog/${postId}/views`, {
      method: 'POST',
    });
    if (!response.ok) {
      return incrementViewCountInLocalStorage(postId);
    }
    const data = await response.json();
    const count = data.count || 1;
    
    viewCountCache[postId] = { count, timestamp: Date.now() };
    localStorage.setItem(`blog_views_persistent_${postId}`, count.toString());
    
    return count;
  } catch (error) {
    console.error('Error incrementing view count:', error);
    return incrementViewCountInLocalStorage(postId);
  }
}

/**
 * Synchronous version - returns cached/localStorage value, triggers async update
 */
export function getViewCountSync(postId: string): number {
  const cached = viewCountCache[postId];
  if (cached) {
    return cached.count;
  }

  const localCount = getViewCountFromLocalStorage(postId);
  getViewCount(postId).catch(console.error);
  
  return localCount;
}

/**
 * Synchronous version - updates localStorage immediately, triggers async update
 */
export function incrementViewCountSync(postId: string): number {
  const newCount = incrementViewCountInLocalStorage(postId);
  viewCountCache[postId] = { count: newCount, timestamp: Date.now() };
  incrementViewCount(postId).catch(console.error);
  
  return newCount;
}

/**
 * LocalStorage fallback functions
 */
function getViewCountFromLocalStorage(postId: string): number {
  if (typeof window === 'undefined') return 0;
  const stored = localStorage.getItem(`blog_views_persistent_${postId}`);
  return stored ? parseInt(stored, 10) : 0;
}

function incrementViewCountInLocalStorage(postId: string): number {
  if (typeof window === 'undefined') return 0;
  const currentCount = getViewCountFromLocalStorage(postId);
  const newCount = currentCount + 1;
  localStorage.setItem(`blog_views_persistent_${postId}`, newCount.toString());
  return newCount;
}

/**
 * Clear the cache
 */
export function clearCache(): void {
  Object.keys(viewCountCache).forEach(key => delete viewCountCache[key]);
}
