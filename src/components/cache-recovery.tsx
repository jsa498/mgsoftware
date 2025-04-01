"use client";

import { useEffect } from 'react';
import { detectCacheIssue, refreshAppState } from '@/lib/cache-utils';

/**
 * Client component that runs cache recovery on mount
 * This component doesn't render anything visible
 */
export function CacheRecovery() {
  useEffect(() => {
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
  }, []);

  // This component doesn't render anything
  return null;
} 