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
  // End: State Management

  // Start: Apply Theme
  useEffect(() => {
    const storedValue = window.localStorage.getItem('retro-crt-enabled');
    if (storedValue !== null) {
      setEnabled(storedValue === 'true');
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('crt-enabled', enabled);
    window.localStorage.setItem('retro-crt-enabled', enabled ? 'true' : 'false');
  }, [enabled]);
  // End: Apply Theme

  // Start: Render Controller
  return (
    <button
      type="button"
      aria-pressed={enabled}
      onClick={() => setEnabled((current) => !current)}
      className={`rounded border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 ${className || ''}`}
    >
      {enabled ? 'Penapis CRT Aktif' : 'Aktifkan Penapis CRT'}
    </button>
  );
}
// End: CrtThemeController Component
