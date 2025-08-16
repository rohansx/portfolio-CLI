/**
 * View Count Service
 * 
 * This service manages blog post view counts using a JSON file approach.
 * Note: For true persistence across all users, you'll need a backend API.
 * This implementation simulates server-side storage for demonstration.
 */

// Simulated server-side storage
// In production, this would be replaced with API calls to your backend
class ViewCountService {
  private viewCounts: Record<string, number> = {};
  private initialized = false;
  private updateQueue: Set<string> = new Set();
  
  /**
   * Initialize the service by loading view counts
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      // Try to load from the JSON file
      const response = await fetch('/blog-views.json?' + Date.now()); // Cache bust
      if (response.ok) {
        const data = await response.json();
        this.viewCounts = data;
      }
    } catch (error) {
      console.error('Error loading view counts:', error);
      // Initialize with empty counts
      this.viewCounts = {};
    }
    
    // Also check localStorage for any local updates
    this.mergeLocalStorage();
    this.initialized = true;
    
    // Start periodic sync
    this.startPeriodicSync();
  }
  
  /**
   * Merge counts from localStorage (for offline/local updates)
   */
  private mergeLocalStorage(): void {
    if (typeof window === 'undefined') return;
    
    // Get all localStorage keys that match our pattern
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('blog_views_persistent_')) {
        const postId = key.replace('blog_views_persistent_', '');
        const localCount = parseInt(localStorage.getItem(key) || '0', 10);
        const currentCount = this.viewCounts[postId] || 0;
        
        // Use the higher count (in case of multiple users)
        this.viewCounts[postId] = Math.max(currentCount, localCount);
      }
    }
  }
  
  /**
   * Get view count for a specific post
   */
  async getViewCount(postId: string): Promise<number> {
    await this.initialize();
    return this.viewCounts[postId] || 0;
  }
  
  /**
   * Get view count synchronously (uses cached value)
   */
  getViewCountSync(postId: string): number {
    // If not initialized, try to get from localStorage
    if (!this.initialized) {
      const localKey = `blog_views_persistent_${postId}`;
      const localCount = localStorage.getItem(localKey);
      if (localCount) {
        return parseInt(localCount, 10);
      }
      
      // Trigger initialization for next time
      this.initialize().catch(console.error);
      return 0;
    }
    
    return this.viewCounts[postId] || 0;
  }
  
  /**
   * Increment view count for a specific post
   */
  async incrementViewCount(postId: string): Promise<number> {
    await this.initialize();
    
    // Increment the count
    const currentCount = this.viewCounts[postId] || 0;
    const newCount = currentCount + 1;
    this.viewCounts[postId] = newCount;
    
    // Store in localStorage for immediate access
    const localKey = `blog_views_persistent_${postId}`;
    localStorage.setItem(localKey, newCount.toString());
    
    // Add to update queue
    this.updateQueue.add(postId);
    
    // In a real app, you would send this to your backend
    // For now, we'll just log it
    console.log(`View count for post ${postId}: ${newCount}`);
    
    return newCount;
  }
  
  /**
   * Increment view count synchronously
   */
  incrementViewCountSync(postId: string): number {
    // Get current count
    const currentCount = this.getViewCountSync(postId);
    const newCount = currentCount + 1;
    
    // Update local storage immediately
    const localKey = `blog_views_persistent_${postId}`;
    localStorage.setItem(localKey, newCount.toString());
    
    // Update in-memory cache if initialized
    if (this.initialized) {
      this.viewCounts[postId] = newCount;
      this.updateQueue.add(postId);
    }
    
    // Trigger async increment
    this.incrementViewCount(postId).catch(console.error);
    
    return newCount;
  }
  
  /**
   * Start periodic sync to simulate server updates
   */
  private startPeriodicSync(): void {
    // Every 30 seconds, simulate syncing with server
    setInterval(() => {
      if (this.updateQueue.size > 0) {
        console.log('Would sync view counts to server:', {
          updates: Array.from(this.updateQueue).map(id => ({
            postId: id,
            count: this.viewCounts[id]
          }))
        });
        
        // Clear the update queue
        this.updateQueue.clear();
      }
    }, 30000);
  }
  
  /**
   * Get all view counts
   */
  getAllViewCounts(): Record<string, number> {
    return { ...this.viewCounts };
  }
}

// Create singleton instance
const viewCountService = new ViewCountService();

// Export functions that use the service
export async function getViewCount(postId: string): Promise<number> {
  return viewCountService.getViewCount(postId);
}

export function getViewCountSync(postId: string): number {
  return viewCountService.getViewCountSync(postId);
}

export async function incrementViewCount(postId: string): Promise<number> {
  return viewCountService.incrementViewCount(postId);
}

export function incrementViewCountSync(postId: string): number {
  return viewCountService.incrementViewCountSync(postId);
}

export function getAllViewCounts(): Record<string, number> {
  return viewCountService.getAllViewCounts();
}

// Initialize on load
if (typeof window !== 'undefined') {
  viewCountService.initialize().catch(console.error);
}