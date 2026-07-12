"use client";

import React from 'react';

const VERSION = 'v0.2.1-beta';

export default function VersionIndicator() {
  return (
    <div className="fixed bottom-4 right-4 z-40 bg-gray-800/70 dark:bg-gray-700/70 backdrop-blur-sm px-2 py-1 rounded-full border border-cyan-500/30 text-xs text-gray-300 dark:text-gray-300 pixel-font">
      <span className="flex items-center gap-1">
        <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
        <span>Version: {VERSION}</span>
      </span>
    </div>
  );
}
