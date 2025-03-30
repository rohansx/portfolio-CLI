/**
 * Firebase View Count Service
 *
 * This file provides functions to track and retrieve blog post view counts using Firebase.
 * NOTE: This is a fallback mechanism that doesn't require actual Firebase setup yet.
 * To implement this fully, you would need to:
 * 1. Create a Firebase project
 * 2. Set up Firestore
 * 3. Add the Firebase config to your project
 *
 * For now, this file provides the necessary functions but falls back to localStorage.
 */

// Utility function to get the deployment version
// This helps with caching view counts across deployments
function getDeploymentVersion(): string {
  // You can set this manually each deployment or automate it
  return "0.1.0"; // Change this on each deployment to reset caches
}

// Local storage keys with deployment version to prevent cache issues
const VIEW_COUNT_PREFIX = `blog_views_v${getDeploymentVersion()}_`;
const PERSISTENT_VIEW_COUNT_PREFIX = `blog_views_persistent_`;

/**
 * Increment the view count for a blog post
 */
export async function incrementViewCount(postId: string): Promise<number> {
  // In a real implementation, this would call Firebase
  // For now, we'll use localStorage with a persistent key pattern
  const key = PERSISTENT_VIEW_COUNT_PREFIX + postId;
  const currentViews = parseInt(localStorage.getItem(key) || "0", 10);
  const newViews = currentViews + 1;

  // Save to localStorage as a fallback
  localStorage.setItem(key, newViews.toString());

  // Also save to the versioned key for the current session
  localStorage.setItem(VIEW_COUNT_PREFIX + postId, newViews.toString());

  return newViews;
}

/**
 * Get the view count for a blog post
 */
export async function getViewCount(postId: string): Promise<number> {
  // In a real implementation, this would call Firebase
  // For now, we'll use localStorage with a persistent key pattern
  const persistentKey = PERSISTENT_VIEW_COUNT_PREFIX + postId;
  const persistentViews = localStorage.getItem(persistentKey);

  if (persistentViews) {
    return parseInt(persistentViews, 10);
  }

  // Try the versioned key
  const versionedKey = VIEW_COUNT_PREFIX + postId;
  const versionedViews = localStorage.getItem(versionedKey);

  if (versionedViews) {
    // Migrate to persistent storage
    localStorage.setItem(persistentKey, versionedViews);
    return parseInt(versionedViews, 10);
  }

  // Fall back to legacy key (without version)
  const legacyKey = `blog_views_${postId}`;
  const legacyViews = localStorage.getItem(legacyKey);

  if (legacyViews) {
    // Migrate to persistent storage
    const viewCount = parseInt(legacyViews, 10);
    localStorage.setItem(persistentKey, viewCount.toString());
    return viewCount;
  }

  return 0;
}

// Future implementation
// This is where you would add code to synchronize with Firebase
// when you're ready to implement server-side view counting

/*
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, updateDoc, increment } from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function incrementViewCountFirebase(postId: string): Promise<number> {
  try {
    const docRef = doc(db, "blogViews", postId);
    await updateDoc(docRef, {
      views: increment(1)
    });
    
    // Get the updated view count
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data().views : 0;
  } catch (error) {
    console.error("Error updating view count: ", error);
    return 0;
  }
}

export async function getViewCountFirebase(postId: string): Promise<number> {
  try {
    const docRef = doc(db, "blogViews", postId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data().views;
    } else {
      // Create document if it doesn't exist
      await setDoc(docRef, { views: 0 });
      return 0;
    }
  } catch (error) {
    console.error("Error getting view count: ", error);
    return 0;
  }
}
*/
