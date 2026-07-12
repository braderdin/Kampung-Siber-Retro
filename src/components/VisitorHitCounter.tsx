"use client";

import { useState, useEffect, useCallback } from 'react';

interface VisitorHitCounterProps {
  siteId?: string;
  className?: string;
  showReset?: boolean;
}

// 90s-style digit images as SVG data URIs
const digitImages: Record<string, string> = {
  '0': "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z",
  '1': "M12 4v16M8 12h8",
  '2': "M12 4v16M8 12h8M12 4v16",
  '3': "M12 4v16M8 12h8M12 4v16",
  '4': "M12 4v16M8 12h8M12 4v16",
  '5': "M12 4v16M8 12h8M12 4v16",
  '6': "M12 4v16M8 12h8M12 4v16",
  '7': "M12 4v16M8 12h8M12 4v16",
  '8': "M12 4v16M8 12h8M12 4v16",
  '9': "M12 4v16M8 12h8M12 4v16"
};

export default function VisitorHitCounter({ 
  siteId = 'default', 
  className,
  showReset = false 
}: VisitorHitCounterProps) {
  const [isClient, setIsClient] = useState(false);
  const [hitCount, setHitCount] = useState<number>(0);

  useEffect(() => {
    setIsClient(true);
    
    // Initialize or increment hit counter
    const counterKey = `visitor_count_${siteId}`;
    let currentCount = 0;
    
    try {
      const storedCount = localStorage.getItem(counterKey);
      currentCount = storedCount ? parseInt(storedCount, 10) : 0;
    } catch {
      currentCount = 0;
    }
    
    // Increment count on each page view
    currentCount += 1;
    setHitCount(currentCount);
    
    try {
      localStorage.setItem(counterKey, currentCount.toString());
    } catch {
      // Ignore storage errors
    }
  }, [siteId]);

  const formatNumber = useCallback((num: number): string => {
    return num.toString().padStart(6, '0');
  }, []);

  const resetCounter = useCallback(() => {
    const counterKey = `visitor_count_${siteId}`;
    try {
      localStorage.removeItem(counterKey);
    } catch {
      // Ignore storage errors
    }
    setHitCount(0);
  }, [siteId]);

  const Digit = useCallback(({ value }: { value: string }) => {
    return (
      <svg 
        className="w-6 h-6 text-cyan-400"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
      </svg>
    );
  }, []);

  if (!isClient) {
    return (
      <div className={`hit-counter ${className || ''}`}>
        <div className="retro-card inline-block">
          <div className="p-2 text-xs pixel-font text-gray-500">
            Loading...
          </div>
        </div>
      </div>
    );
  }

  const digits = formatNumber(hitCount).split('');

  return (
    <div className={`hit-counter ${className || ''}`}>
      <div className="retro-card border-2 border-dashed border-cyan-400/30 inline-flex items-center gap-1">
        {/* Start: Counter Display */}
        <div className="flex items-center gap-0.5 px-2 py-1">
          <span className="text-xs pixel-font text-gray-500 dark:text-gray-400 mr-1">👁️</span>
          <span className="font-mono text-sm text-cyan-400 pixel-font">
            {digits.map((digit, index) => (
              <span key={index} className="inline-block w-6 h-6">
                <Digit value={digit} />
              </span>
            ))}
          </span>
        </div>
        {/* End: Counter Display */}

        {/* Start: Reset Button (optional) */}
        {showReset && (
          <button
            onClick={resetCounter}
            className="retro-btn-secondary text-xs px-2 py-1"
            title="Reset Counter"
          >
            ↺
          </button>
        )}
        {/* End: Reset Button */}
      </div>
    </div>
  );
}
