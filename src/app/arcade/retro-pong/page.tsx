"use client";

import { useState, useEffect } from 'react';
import PongGameEngine from '@/components/PongGameEngine';

export default function RetroPongPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-black p-4">
      <div className="max-w-4xl mx-auto">
        {/* Start: Game Title Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-200 pixel-font tracking-wider">
            🏓 RETRO PONG ARCADE
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 font-mono">
            Classic 2D Pong - Arrow Keys to Move Paddle
          </p>
        </div>
        {/* End: Game Title Header */}

        {/* Start: Win95 Border Wrapper */}
        <div className="win95-border-wrapper bg-gray-300 dark:bg-gray-800 p-2 shadow-lg">
          {/* Start: Grey Win95 Border Shell Box Context */}
          <div className="win95-shell bg-gray-100 dark:bg-gray-900 border-2 border-gray-500 dark:border-gray-400 p-4">
            {/* Start: Window Title Bar */}
            <div className="win95-title-bar bg-gradient-to-r from-blue-800 to-blue-900 px-3 py-2 border-2 border-blue-900 mb-3 flex items-center gap-2">
              <span className="text-white font-bold text-sm pixel-font">🕹️ PONG GAME</span>
            </div>
            {/* End: Window Title Bar */}

            {/* Start: Canvas Container */}
            <div className="relative bg-black border-4 border-gray-600 dark:border-gray-500 rounded-lg overflow-hidden">
              {isMounted && (
                <PongGameEngine 
                  width={800}
                  height={400}
                  className="w-full h-auto block"
                />
              )}
            </div>
            {/* End: Canvas Container */}

            {/* Start: Game Controls Footer */}
            <div className="mt-3 flex justify-between items-center text-xs text-gray-600 dark:text-gray-400 font-mono">
              <span>← → Arrow Keys</span>
              <span>Touch & Drag on Mobile</span>
            </div>
            {/* End: Game Controls Footer */}
          </div>
          {/* End: Grey Win95 Border Shell Box Context */}
        </div>
        {/* End: Win95 Border Wrapper */}
      </div>
    </div>
  );
}
