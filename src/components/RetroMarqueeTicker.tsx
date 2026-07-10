"use client";

import { useState, useEffect, useRef } from 'react';

interface RetroMarqueeTickerProps {
  messages?: string[];
  speed?: number;
  className?: string;
}

export default function RetroMarqueeTicker({ 
  messages = [
    '🚀 System Update: New features coming soon!',
    '🌟 Spotlight: Welcome our newest resident warga!',
    '🔧 Maintenance: Scheduled downtime tomorrow 2AM',
    '🎉 Celebration: 1000th resident milestone achieved!',
    '💡 Tip: Try the new retro terminal command "matrix"'
  ],
  speed = 30,
  className
}: RetroMarqueeTickerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const [isTouching, setIsTouching] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused && !isTouching) {
        setCurrentIndex(prev => (prev + 1) % messages.length);
      }
    }, speed * 1000);

    return () => clearInterval(interval);
  }, [isPaused, isTouching, messages.length, speed]);

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  const handleTouchStart = () => {
    setIsTouching(true);
  };

  const handleTouchEnd = () => {
    setIsTouching(false);
  };

  const handleTouchCancel = () => {
    setIsTouching(false);
  };

  return (
    <div 
      ref={marqueeRef}
      className={`retro-marquee-ticker ${className || ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
    >
      {/* Start: Marquee Container */}
      <div className="marquee-rigid-container">
        <div className="marquee-content flex items-center justify-center">
          <span className="pixel-font text-sm md:text-base font-medium text-gray-200 dark:text-gray-100">
            {messages[currentIndex]}
          </span>
        </div>
      </div>
      {/* End: Marquee Container */}

      {/* Start: Status Indicator */}
      <div className="absolute top-0 right-0 flex items-center gap-2 px-2 py-1 bg-black/50 rounded-l">
        {isPaused && (
          <span className="text-xs text-yellow-400 pixel-font animate-pulse">
            ⏸ Paused
          </span>
        )}
        {isTouching && (
          <span className="text-xs text-blue-400 pixel-font">
            📱 Touch
          </span>
        )}
      </div>
      {/* End: Status Indicator */}
    </div>
  );
}
