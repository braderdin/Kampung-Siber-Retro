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

  // Start: Apply Theme with Glow Protection
  useEffect(() => {
    if (!isClient) return;
    
    const root = document.documentElement;
    root.classList.toggle('crt-enabled', enabled);
    window.localStorage.setItem('retro-crt-enabled', enabled ? 'true' : 'false');
    
    // Start: Neon Glow Protection
    if (enabled) {
      root.style.setProperty('--neon-glow-protection', 'true');
      root.style.setProperty('--shadow-clipping-fix', '0 0 15px rgba(255, 0, 127, 0.3)');
    } else {
      root.style.removeProperty('--neon-glow-protection');
      root.style.removeProperty('--shadow-clipping-fix');
    }
    // End: Neon Glow Protection
  }, [enabled, isClient]);
  // End: Apply Theme with Glow Protection

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
          ? 'border-pink-400 bg-pink-500/20 text-pink-300 hover:bg-pink-500/30 shadow-[0_0_15px_rgba(255,0,127,0.3)]'
          : 'border-cyan-400 bg-cyan-500/10 text-cyan-200 hover:bg-cyan-500/20'
      } ${className || ''}`}
    >
      {enabled ? 'Penapis CRT Aktif' : 'Aktifkan Penapis CRT'}
    </button>
  );
}
// End: CrtThemeController Component
