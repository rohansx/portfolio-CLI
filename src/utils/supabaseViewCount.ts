/**
 * Supabase View Count Service
 * 
 * This service manages blog post view counts using Supabase as the backend.
 * Provides a truly persistent solution that works across all users.
 */

import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Cache for view counts to reduce API calls
const viewCountCache: Record<string, { count: number; timestamp: number }> = {};
const CACHE_DURATION = 30000; // 30 seconds

/**
 * Initialize the blog_views table (call this once to set up the database)
 * You'll need to run this SQL in your Supabase dashboard:
 * 
 * CREATE TABLE blog_views (
 *   id SERIAL PRIMARY KEY,
 *   post_id VARCHAR(50) UNIQUE NOT NULL,
 *   view_count INTEGER DEFAULT 0,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 *   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 * );
 * 
 * -- Insert initial data
 * INSERT INTO blog_views (post_id, view_count) VALUES 
 * ('1', 42),
 * ('2', 37),
 * ('3', 15)
 * ON CONFLICT (post_id) DO NOTHING;
 * 
 * -- Enable RLS (Row Level Security) - optional for public read access
 * ALTER TABLE blog_views ENABLE ROW LEVEL SECURITY;
 * 
 * -- Allow public read access
 * CREATE POLICY "Allow public read access" ON blog_views
 * FOR SELECT USING (true);
 * 
 * -- Allow public increment (you might want to restrict this in production)
 * CREATE POLICY "Allow public increment" ON blog_views
 * FOR UPDATE USING (true);
 */

/**
 * Check if Supabase is properly configured
 */
function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseKey && supabaseUrl !== '' && supabaseKey !== '');
}

/**
 * Get view count for a blog post from cache or Supabase
 */
export async function getViewCount(postId: string): Promise<number> {
  // Check cache first
  const cached = viewCountCache[postId];
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.count;
  }

  // If Supabase is not configured, fall back to localStorage
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, falling back to localStorage');
    return getViewCountFromLocalStorage(postId);
  }

  try {
    const { data, error } = await supabase
      .from('blog_views')
      .select('view_count')
      .eq('post_id', postId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Row doesn't exist, create it
        const { data: newData, error: insertError } = await supabase
          .from('blog_views')
          .insert({ post_id: postId, view_count: 0 })
          .select('view_count')
          .single();

        if (insertError) {
          console.error('Error creating view count record:', insertError);
          return getViewCountFromLocalStorage(postId);
        }

        const count = newData?.view_count || 0;
        viewCountCache[postId] = { count, timestamp: Date.now() };
        return count;
      }
      
      console.error('Error fetching view count:', error);
      return getViewCountFromLocalStorage(postId);
    }

    const count = data?.view_count || 0;
    viewCountCache[postId] = { count, timestamp: Date.now() };
    
    // Also update localStorage for offline access
    localStorage.setItem(`blog_views_persistent_${postId}`, count.toString());
    
    return count;
  } catch (error) {
    console.error('Error fetching view count:', error);
    return getViewCountFromLocalStorage(postId);
  }
}

/**
 * Increment view count for a blog post in Supabase
 */
export async function incrementViewCount(postId: string): Promise<number> {
  // If Supabase is not configured, fall back to localStorage
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, falling back to localStorage');
    return incrementViewCountInLocalStorage(postId);
  }

  try {
    // First, try to increment the existing record
    const { data, error } = await supabase.rpc('increment_view_count', {
      post_id_param: postId
    });

    if (error) {
      // If the function doesn't exist, fall back to manual increment
      console.warn('increment_view_count function not found, using manual increment');
      
      // Get current count
      const currentCount = await getViewCount(postId);
      const newCount = currentCount + 1;
      
      // Update the record
      const { error: updateError } = await supabase
        .from('blog_views')
        .upsert({ post_id: postId, view_count: newCount, updated_at: new Date().toISOString() });

      if (updateError) {
        console.error('Error updating view count:', updateError);
        return incrementViewCountInLocalStorage(postId);
      }

      // Update cache
      viewCountCache[postId] = { count: newCount, timestamp: Date.now() };
      localStorage.setItem(`blog_views_persistent_${postId}`, newCount.toString());
      
      return newCount;
    }

    const newCount = data || 1;
    
    // Update cache
    viewCountCache[postId] = { count: newCount, timestamp: Date.now() };
    localStorage.setItem(`blog_views_persistent_${postId}`, newCount.toString());
    
    return newCount;
  } catch (error) {
    console.error('Error incrementing view count:', error);
    return incrementViewCountInLocalStorage(postId);
  }
}

/**
 * Synchronous version that returns cached value and triggers async update
 */
export function getViewCountSync(postId: string): number {
  // Return cached value if available
  const cached = viewCountCache[postId];
  if (cached) {
    return cached.count;
  }

  // Fall back to localStorage
  const localCount = getViewCountFromLocalStorage(postId);
  
  // Trigger async fetch to update cache
  getViewCount(postId).catch(console.error);
  
  return localCount;
}

/**
 * Synchronous version that updates localStorage immediately and triggers async update
 */
export function incrementViewCountSync(postId: string): number {
  // Increment localStorage immediately for instant UI update
  const newCount = incrementViewCountInLocalStorage(postId);
  
  // Update cache
  viewCountCache[postId] = { count: newCount, timestamp: Date.now() };
  
  // Trigger async increment to Supabase
  incrementViewCount(postId).catch(console.error);
  
  return newCount;
}

/**
 * Fallback functions for localStorage
 */
function getViewCountFromLocalStorage(postId: string): number {
  if (typeof window === 'undefined') return 0;
  
  const key = `blog_views_persistent_${postId}`;
  const stored = localStorage.getItem(key);
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
 * Get all view counts (useful for debugging)
 */
export async function getAllViewCounts(): Promise<Record<string, number>> {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured');
    return {};
  }

  try {
    const { data, error } = await supabase
      .from('blog_views')
      .select('post_id, view_count');

    if (error) {
      console.error('Error fetching all view counts:', error);
      return {};
    }

    const counts: Record<string, number> = {};
    data?.forEach(row => {
      counts[row.post_id] = row.view_count;
    });

    return counts;
  } catch (error) {
    console.error('Error fetching all view counts:', error);
    return {};
  }
}

/**
 * Clear the cache (useful for testing)
 */
export function clearCache(): void {
  Object.keys(viewCountCache).forEach(key => delete viewCountCache[key]);
}