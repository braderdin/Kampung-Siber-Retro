'use client';

import { useEffect, useState } from 'react';

// Start: Type Definitions
interface CrtThemeControllerProps {
  className?: string;
}
// End: Type Definitions

// Start: CrtThemeController Component
export default function CrtThemeController({ className }: CrtThemeControllerProps) {
  // Start: State Management
  const [enabled, setEnabled] = useState(false);
  const [isClient, setIsClient] = useState(false);
  // End: State Management

  // Start: Client Side Hydration
  useEffect(() => {
    setIsClient(true);
    const storedValue = window.localStorage.getItem('retro-crt-enabled');
    if (storedValue !== null) {
      setEnabled(storedValue === 'true');
    }
  }, []);
  // End: Client Side Hydration

  // Start: Apply Theme
  useEffect(() => {
    if (!isClient) return;
    
    const root = document.documentElement;
    root.classList.toggle('crt-enabled', enabled);
    window.localStorage.setItem('retro-crt-enabled', enabled ? 'true' : 'false');
  }, [enabled, isClient]);
  // End: Apply Theme

  // Start: Handle Toggle
  const handleToggle = () => {
    setEnabled((current) => !current);
  };
  // End: Handle Toggle

  // Start: Render Controller
  return (
    <button
      type="button"
      aria-pressed={enabled}
      onClick={handleToggle}
      className={`rounded border px-3 py-2 text-xs font-semibold transition-all duration-300 ${
        enabled
          ? 'border-pink-400 bg-pink-500/20 text-pink-300 hover:bg-pink-500/30'
          : 'border-cyan-400 bg-cyan-500/10 text-cyan-200 hover:bg-cyan-500/20'
      } ${className || ''}`}
    >
      {enabled ? 'Penapis CRT Aktif' : 'Aktifkan Penapis CRT'}
    </button>
  );
}
// End: CrtThemeController Component
