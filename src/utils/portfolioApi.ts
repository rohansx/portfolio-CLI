/**
 * Portfolio API Service
 *
 * Uses Upstash Redis REST API for visitor counts and blog views.
 * Falls back to localStorage if Upstash is unavailable.
 */

const UPSTASH_URL = process.env.REACT_APP_UPSTASH_REDIS_REST_URL || '';
const UPSTASH_TOKEN = process.env.REACT_APP_UPSTASH_REDIS_REST_TOKEN || '';

// Cache for reducing API calls
const cache: Record<string, { value: number; timestamp: number }> = {};
const CACHE_DURATION = 30000; // 30 seconds

// Known blog post slugs for MGET batch retrieval
const BLOG_SLUGS = [
  'building-cli-applications-nodejs',
  'advanced-typescript-patterns',
  'vibe-coding-to-vulnerability',
  'unlocking-brain-potential-lucy-cognitive-enhancement',
  'git-worktree-nightmare-made-me-build-workz',
  'enterprise-security-tools-developer-pain',
  'leadecho-v2-from-keywords-to-intent',
];

/**
 * Execute an Upstash Redis REST command
 */
async function redisCommand(command: string[]): Promise<{ result: unknown }> {
  const response = await fetch(`${UPSTASH_URL}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${UPSTASH_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
  });

  if (!response.ok) throw new Error(`Upstash error: ${response.status}`);
  return response.json();
}

/**
 * Execute a pipeline of Upstash Redis REST commands
 */
async function redisPipeline(commands: string[][]): Promise<{ result: unknown }[]> {
  const response = await fetch(`${UPSTASH_URL}/pipeline`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${UPSTASH_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(commands),
  });

  if (!response.ok) throw new Error(`Upstash error: ${response.status}`);
  return response.json();
}

/**
 * Get total visitor count
 */
export async function getVisitorCount(): Promise<number> {
  if (cache['visitors'] && Date.now() - cache['visitors'].timestamp < CACHE_DURATION) {
    return cache['visitors'].value;
  }

  try {
    const data = await redisCommand(['GET', 'portfolio:visitors']);
    const count = parseInt(data.result as string, 10) || 0;

    cache['visitors'] = { value: count, timestamp: Date.now() };
    localStorage.setItem('portfolio_visitors', count.toString());

    return count;
  } catch (error) {
    console.warn('Upstash unavailable, using localStorage');
    return parseInt(localStorage.getItem('portfolio_visitors') || '1337', 10);
  }
}

/**
 * Increment visitor count (call once per session)
 */
export async function incrementVisitorCount(): Promise<number> {
  if (sessionStorage.getItem('portfolio_visited')) {
    return getVisitorCount();
  }

  try {
    const data = await redisCommand(['INCR', 'portfolio:visitors']);
    const count = data.result as number;

    sessionStorage.setItem('portfolio_visited', 'true');
    cache['visitors'] = { value: count, timestamp: Date.now() };
    localStorage.setItem('portfolio_visitors', count.toString());

    return count;
  } catch (error) {
    console.warn('Upstash unavailable, using localStorage');

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

  if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < CACHE_DURATION) {
    return cache[cacheKey].value;
  }

  try {
    const data = await redisCommand(['GET', `blog:views:${postId}`]);
    const count = parseInt(data.result as string, 10) || 0;

    cache[cacheKey] = { value: count, timestamp: Date.now() };
    localStorage.setItem(`blog_views_${postId}`, count.toString());

    return count;
  } catch (error) {
    console.warn('Upstash unavailable, using localStorage');
    return parseInt(localStorage.getItem(`blog_views_${postId}`) || '0', 10);
  }
}

/**
 * Increment view count for a blog post
 */
export async function incrementBlogViewCount(postId: string): Promise<number> {
  try {
    const data = await redisCommand(['INCR', `blog:views:${postId}`]);
    const count = data.result as number;

    const cacheKey = `blog_${postId}`;
    cache[cacheKey] = { value: count, timestamp: Date.now() };
    localStorage.setItem(`blog_views_${postId}`, count.toString());

    return count;
  } catch (error) {
    console.warn('Upstash unavailable, using localStorage');

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
    const keys = BLOG_SLUGS.map(slug => `blog:views:${slug}`);
    const results = await redisPipeline(keys.map(key => ['GET', key]));

    const views: Record<string, number> = {};
    BLOG_SLUGS.forEach((slug, i) => {
      const count = parseInt(results[i].result as string, 10) || 0;
      views[slug] = count;

      const cacheKey = `blog_${slug}`;
      cache[cacheKey] = { value: count, timestamp: Date.now() };
      localStorage.setItem(`blog_views_${slug}`, count.toString());
    });

    return views;
  } catch (error) {
    console.warn('Upstash unavailable');
    return {};
  }
}
