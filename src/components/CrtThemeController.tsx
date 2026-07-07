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
    const root = document.documentElement;
    if (enabled) {
      root.classList.add('crt-enabled');
    } else {
      root.classList.remove('crt-enabled');
    }
  }, [enabled]);
  // End: Apply Theme

  // Start: Render Controller
  return (
    <button
      type="button"
      onClick={() => setEnabled((current) => !current)}
      className={`rounded border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 ${className || ''}`}
    >
      {enabled ? 'Penapis CRT Aktif' : 'Aktifkan Penapis CRT'}
    </button>
  );
}
// End: CrtThemeController Component
