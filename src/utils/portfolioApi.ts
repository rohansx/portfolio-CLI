/**
 * Portfolio API Service
 * 
 * Connects to the backend API for visitor counts and blog views.
 * Falls back to localStorage if API is unavailable.
 */

const API_BASE = process.env.REACT_APP_API_URL || 'https://vibeguard.io/api/portfolio';

// Cache for reducing API calls
const cache: Record<string, { value: number; timestamp: number }> = {};
const CACHE_DURATION = 30000; // 30 seconds

/**
 * Get total visitor count
 */
export async function getVisitorCount(): Promise<number> {
  // Check cache
  if (cache['visitors'] && Date.now() - cache['visitors'].timestamp < CACHE_DURATION) {
    return cache['visitors'].value;
  }

  try {
    const response = await fetch(`${API_BASE}/visitors`);
    if (!response.ok) throw new Error('API error');
    
    const data = await response.json();
    const count = data.count || 0;
    
    // Update cache
    cache['visitors'] = { value: count, timestamp: Date.now() };
    
    // Also save to localStorage for offline
    localStorage.setItem('portfolio_visitors', count.toString());
    
    return count;
  } catch (error) {
    console.warn('API unavailable, using localStorage');
    return parseInt(localStorage.getItem('portfolio_visitors') || '1337', 10);
  }
}

/**
 * Increment visitor count (call once per session)
 */
export async function incrementVisitorCount(): Promise<number> {
  // Check if already incremented this session
  if (sessionStorage.getItem('portfolio_visited')) {
    return getVisitorCount();
  }

  try {
    const response = await fetch(`${API_BASE}/visitors`, {
      method: 'POST',
    });
    
    if (!response.ok) throw new Error('API error');
    
    const data = await response.json();
    const count = data.count || 0;
    
    // Mark as visited
    sessionStorage.setItem('portfolio_visited', 'true');
    
    // Update cache
    cache['visitors'] = { value: count, timestamp: Date.now() };
    localStorage.setItem('portfolio_visitors', count.toString());
    
    return count;
  } catch (error) {
    console.warn('API unavailable, using localStorage');
    
    // Fallback increment
    let count = parseInt(localStorage.getItem('portfolio_visitors') || '1337', 10);
    if (!sessionStorage.getItem('portfolio_visited')) {
      count += 1;
      localStorage.setItem('portfolio_visitors', count.toString());
      sessionStorage.setItem('portfolio_visited', 'true');
    }
    
    return count;
  }
}

/**
 * Get view count for a blog post
 */
export async function getBlogViewCount(postId: string): Promise<number> {
  const cacheKey = `blog_${postId}`;
  
  // Check cache
  if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < CACHE_DURATION) {
    return cache[cacheKey].value;
  }

  try {
    const response = await fetch(`${API_BASE}/blog/${postId}/views`);
    if (!response.ok) throw new Error('API error');
    
    const data = await response.json();
    const count = data.count || 0;
    
    // Update cache
    cache[cacheKey] = { value: count, timestamp: Date.now() };
    localStorage.setItem(`blog_views_${postId}`, count.toString());
    
    return count;
  } catch (error) {
    console.warn('API unavailable, using localStorage');
    return parseInt(localStorage.getItem(`blog_views_${postId}`) || '0', 10);
  }
}

/**
 * Increment view count for a blog post
 */
export async function incrementBlogViewCount(postId: string): Promise<number> {
  try {
    const response = await fetch(`${API_BASE}/blog/${postId}/views`, {
      method: 'POST',
    });
    
    if (!response.ok) throw new Error('API error');
    
    const data = await response.json();
    const count = data.count || 0;
    
    // Update cache
    const cacheKey = `blog_${postId}`;
    cache[cacheKey] = { value: count, timestamp: Date.now() };
    localStorage.setItem(`blog_views_${postId}`, count.toString());
    
    return count;
  } catch (error) {
    console.warn('API unavailable, using localStorage');
    
    // Fallback increment
    let count = parseInt(localStorage.getItem(`blog_views_${postId}`) || '0', 10);
    count += 1;
    localStorage.setItem(`blog_views_${postId}`, count.toString());
    
    return count;
  }
}

/**
 * Get all blog view counts at once
 */
export async function getAllBlogViewCounts(): Promise<Record<string, number>> {
  try {
    const response = await fetch(`${API_BASE}/blog/views`);
    if (!response.ok) throw new Error('API error');
    
    const data = await response.json();
    const views = data.views || {};
    
    // Update cache and localStorage
    Object.entries(views).forEach(([postId, count]) => {
      const cacheKey = `blog_${postId}`;
      cache[cacheKey] = { value: count as number, timestamp: Date.now() };
      localStorage.setItem(`blog_views_${postId}`, (count as number).toString());
    });
    
    return views;
  } catch (error) {
    console.warn('API unavailable');
    return {};
  }
}
