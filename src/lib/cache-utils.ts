"use client";

import Cookies from 'js-cookie';
import { clearUserSession, getCurrentUser } from './auth';

/**
 * Utility functions to handle caching issues that may cause blank screens
 */

/**
 * Detects potential cache issues that might cause blank screens
 * Compares authentication state between cookies and session storage
 */
export function detectCacheIssue(): boolean {
  try {
    // Check if we have auth cookies but no session data (inconsistent state)
    const authCookie = Cookies.get('auth_session');
    const userFromSession = getCurrentUser();
    
    // Inconsistent state: cookie exists but no user in session (or vice versa)
    if ((authCookie && !userFromSession) || (!authCookie && userFromSession)) {
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error detecting cache issue:', error);
    return false;
  }
}

/**
 * Refreshes the app state by clearing cookies and session data, then reloading
 * This helps recover from stale cache states after server restarts
 */
export function refreshAppState(): void {
  try {
    // Clear all authentication state
    clearUserSession();
    
    // Force a clean reload of the application
    window.location.href = window.location.pathname;
  } catch (error) {
    console.error('Error refreshing app state:', error);
    
    // Fallback: try to clear everything and reload
    try {
      sessionStorage.clear();
      localStorage.clear();
      Object.keys(Cookies.get()).forEach(cookieName => {
        Cookies.remove(cookieName);
      });
      window.location.reload();
    } catch (e) {
      console.error('Fallback refresh failed:', e);
    }
  }
}

/**
 * React hook that automatically checks for and fixes cache issues
 * Should be used in a client component near the root of the app
 */
export function useCacheRecovery(): void {
  // Only run in browser
  if (typeof window === 'undefined') return;
  
  // Check if DOM is mostly empty (possible indicator of rendering issue)
  const bodyContent = document.body.innerHTML.trim();
  const isDOMEmpty = bodyContent.length < 100;
  
  // Check for cache inconsistencies
  const hasCacheIssue = detectCacheIssue();
  
  // If we detect issues, refresh app state
  if (isDOMEmpty || hasCacheIssue) {
    refreshAppState();
  }
} 