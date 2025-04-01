"use client";

import { useEffect } from 'react';
import { useCacheRecovery } from '@/lib/cache-utils';

/**
 * Client component that runs cache recovery on mount
 * This component doesn't render anything visible
 */
export function CacheRecovery() {
  useEffect(() => {
    // Run cache recovery check when component mounts
    useCacheRecovery();
  }, []);

  // This component doesn't render anything
  return null;
} 