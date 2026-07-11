// Start: Vintage Drop-Down Toolbar Component
"use client";

import { useLanguageStore } from '@/store/useLanguageStore';
import { enDictionary, msDictionary } from '@/i18n/dictionaries';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface ToolbarItem {
  name: string;
  icon: string;
  action: () => void;
}

interface NavigationBarProps {
  className?: string;
}

export default function NavigationBar({ className }: NavigationBarProps) {
  const { language, setLanguage } = useLanguageStore();
  const router = useRouter();
  const [isToolbarOpen, setIsToolbarOpen] = useState(false);
  const [isCrtEnabled, setIsCrtEnabled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const t = language === 'ms' ? msDictionary : enDictionary;

  // Start: Load CRT Theme State
  useEffect(() => {
    const loadDataFromStorage = () => {
      try {
        const storedTheme = localStorage.getItem('theme');
        const storedCrt = localStorage.getItem('crt-theme');
        if (storedCrt === 'true') {
          setIsCrtEnabled(true);
          document.documentElement.classList.add('dark');
        }
      } catch (e) {}
    };
    loadDataFromStorage();
  }, []);
  // End: Load CRT Theme State

  // Start: Click Outside Handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsToolbarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  // End: Click Outside Handler

  // Start: Language Toggle Handler
  const handleLanguageToggle = () => {
    const newLang = language === 'en' ? 'ms' : 'en';
    setLanguage(newLang);
  };
  // End: Language Toggle Handler

  // Start: CRT Theme Toggle Handler
  const handleCrtThemeToggle = () => {
    const newState = !isCrtEnabled;
    setIsCrtEnabled(newState);
    localStorage.setItem('crt-theme', String(newState));
    if (newState) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  // End: CRT Theme Toggle Handler

  // Start: Utility Toolbar Items
  const toolbarItems: ToolbarItem[] = [
    {
      name: language === 'en' ? 'Bahasa Malaysia' : 'English',
      icon: '🌐',
      action: handleLanguageToggle,
    },
    {
      name: t.crtTheme,
      icon: isCrtEnabled ? '🖥️' : '🌓',
      action: handleCrtThemeToggle,
    },
    {
      name: t.dashboardTitle,
      icon: '🏠',
      action: () => router.push('/dashboard'),
    },
  ];
  // End: Utility Toolbar Items

  return (
    // Start: Toolbar Container
    <div className={`fixed top-4 right-4 z-50 ${className || ''}`} ref={dropdownRef}>
      {/* Start: Toolbar Trigger Button */}
      <button
        onClick={() => setIsToolbarOpen(!isToolbarOpen)}
        className="
          flex items-center justify-center w-10 h-10 
          bg-gray-800 border-2 border-gray-600 rounded-full
          hover:bg-gray-700 transition-colors
          focus:outline-none focus:ring-2 focus:ring-cyan-400
          shadow-lg
        "
        aria-label="Toggle utility toolbar"
        aria-expanded={isToolbarOpen}
      >
        <span className="text-lg">⚙️</span>
      </button>
      {/* End: Toolbar Trigger Button */}

      {/* Start: Toolbar Dropdown */}
      {isToolbarOpen && (
        <div className="
          absolute top-14 right-0 
          w-56 
          bg-gray-800 border border-gray-600 rounded-lg 
          shadow-xl 
          py-2 px-1
          animate-fade-in
        ">
          {toolbarItems.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                item.action();
                setIsToolbarOpen(false);
              }}
              className="
                flex items-center w-full px-3 py-2 
                text-left text-sm text-gray-300 
                hover:text-white hover:bg-cyan-500/10 
                rounded transition-colors
                gap-2
              "
            >
              <span className="text-base inline-flex items-center justify-center w-5 h-5">{item.icon}</span>
              <span className="inline-flex items-center gap-1 align-middle">{item.name}</span>
            </button>
          ))}
        </div>
      )}
      {/* End: Toolbar Dropdown */}
    </div>
    // End: Toolbar Container
  );
}