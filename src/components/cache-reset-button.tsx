"use client";

import { Button } from "@/components/ui/button";
import { refreshAppState } from "@/lib/cache-utils";

interface CacheResetButtonProps {
  className?: string;
}

/**
 * Button component for manually resetting cache when experiencing blank screens
 */
export function CacheResetButton({ className }: CacheResetButtonProps) {
  const handleResetCache = () => {
    if (window.confirm("Reset app cache? This will clear your current session and reload the page.")) {
      refreshAppState();
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className={className}
      onClick={handleResetCache}
    >
      Reset Cache
    </Button>
  );
} 