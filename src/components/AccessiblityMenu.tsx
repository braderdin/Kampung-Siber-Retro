"use client";

import { useState, useEffect } from 'react';

interface AccessibilityOption {
  id: string;
  label: string;
  icon: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

export default function AccessibilityMenu() {
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [largeText, setLargeText] = useState(false);

  useEffect(() => {
    // Load saved preferences
    const savedHighContrast = localStorage.getItem('accessibility_high_contrast') === 'true';
    const savedReducedMotion = localStorage.getItem('accessibility_reduced_motion') === 'true';
    const savedLargeText = localStorage.getItem('accessibility_large_text') === 'true';
    
    setHighContrast(savedHighContrast);
    setReducedMotion(savedReducedMotion);
    setLargeText(savedLargeText);

    // Apply settings
    if (savedHighContrast) document.documentElement.classList.add('high-contrast');
    if (savedReducedMotion) document.documentElement.classList.add('reduced-motion');
    if (savedLargeText) document.documentElement.classList.add('large-text');
  }, []);

  useEffect(() => {
    localStorage.setItem('accessibility_high_contrast', String(highContrast));
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [highContrast]);

  useEffect(() => {
    localStorage.setItem('accessibility_reduced_motion', String(reducedMotion));
    if (reducedMotion) {
      document.documentElement.classList.add('reduced-motion');
    } else {
      document.documentElement.classList.remove('reduced-motion');
    }
  }, [reducedMotion]);

  useEffect(() => {
    localStorage.setItem('accessibility_large_text', String(largeText));
    if (largeText) {
      document.documentElement.classList.add('large-text');
    } else {
      document.documentElement.classList.remove('large-text');
    }
  }, [largeText]);

  const options: AccessibilityOption[] = [
    {
      id: 'high-contrast',
      label: 'High Contrast Mode',
      icon: '🔆',
      value: highContrast,
      onChange: setHighContrast
    },
    {
      id: 'reduced-motion',
      label: 'Reduced Motion',
      icon: '🎯',
      value: reducedMotion,
      onChange: setReducedMotion
    },
    {
      id: 'large-text',
      label: 'Large Text',
      icon: '🔤',
      value: largeText,
      onChange: setLargeText
    }
  ];

  return (
    <div className="space-y-3">
      <h4 className="pixel-font text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
        <span className="text-lg">⚙️</span>
        Penyesuaian
      </h4>
      
      {options.map((option) => (
        <div key={option.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded retro-card">
          <div className="flex items-center gap-2">
            <span className="text-lg">{option.icon}</span>
            <span className="text-sm text-gray-700 dark:text-gray-300 pixel-font">{option.label}</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={option.value}
              onChange={(e) => option.onChange(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan-300 dark:peer-focus:ring-cyan-800 rounded-full peer peer-checked:ml-6 peer-checked:bg-cyan-400 transition-all duration-300">
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300 peer-checked:translate-x-5" />
            </div>
          </label>
        </div>
      ))}

      <div className="text-xs text-gray-500 dark:text-gray-400 pixel-font mt-2">
        Pilihan akan disimpan dan digunakan semasa sesi berikutnya
      </div>
    </div>
  );
}