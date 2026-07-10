"use client";

import React from 'react';

interface LanguageToggleSwitchProps {
  currentLanguage: 'en' | 'ms';
  onToggle: (lang: 'en' | 'ms') => void;
}

export default function LanguageToggleSwitch({ currentLanguage, onToggle }: LanguageToggleSwitchProps) {
  const isEnglish = currentLanguage === 'en';

  return (
    <div className="flex items-center gap-2 px-2 py-1">
      <span className="text-sm pixel-font text-gray-600 dark:text-gray-400">EN</span>
      <button
        onClick={() => onToggle(isEnglish ? 'ms' : 'en')}
        className={`
          relative w-10 h-5 rounded-full transition-all duration-300 pixel-font
          ${isEnglish 
            ? 'bg-gray-300 dark:bg-gray-600' 
            : 'bg-cyan-400 hover:bg-cyan-500'
          }
        `}
      >
        <div 
          className={`
            absolute top-0.5 bottom-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-md transition-transform duration-300
            ${isEnglish ? 'translate-x-0.5' : 'translate-x-5'}
          `}
        />
      </button>
      <span className="text-sm pixel-font text-gray-600 dark:text-gray-400">MS</span>
    </div>
  );
}
