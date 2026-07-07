// Start: Imports
"use client";

import { usePathname, useRouter } from 'next/navigation';
import { useLanguageStore } from '@/store/useLanguageStore';
import { enDictionary, msDictionary } from '@/i18n/dictionaries';
import { useEffect, useState } from 'react';
import UserDropdownMenu from '@/components/UserDropdownMenu';
// End: Imports

// Start: Type Definitions
interface NavItem {
  name: string;
  href: string;
  icon: string;
}
// End: Type Definitions

// Start: RetroNavbar Component
export default function RetroNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { language, setLanguage } = useLanguageStore();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const t = language === 'ms' ? msDictionary : enDictionary;
  
  // Start: Navigation Items
  const navItems: NavItem[] = [
    { name: t.dashboardTitle, href: '/dashboard', icon: '🏠' },
    { name: t.fileEditor, href: '/site_files', icon: '📝' },
    { name: t.guestbookTitle, href: '/browse', icon: '📘' },
    { name: t.settings, href: '/search', icon: '⚙️' },
  ];
  // End: Navigation Items

  // Start: Dark Mode Initialization
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);
  // End: Dark Mode Initialization

  // Start: Handle Language Change
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as 'en' | 'ms');
  };
  // End: Handle Language Change

  // Start: Handle Dark Mode Toggle
  const handleDarkModeToggle = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };
  // End: Handle Dark Mode Toggle

  // Start: Handle Navigation Click
  const handleNavClick = (href: string) => {
    router.push(href);
  };
  // End: Handle Navigation Click

  // Start: Render Navbar
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 retro-nav bg-black/30 backdrop-blur-md border-b border-cyan-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Start: Logo/Brand */}
          <div className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-pixel text-pink-500 dark:text-pink-400">
              🖥️ Penjelajah Laman
            </span>
          </div>
          {/* End: Logo/Brand */}

          {/* Start: Navigation Items */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? 'bg-pink-500/20 text-pink-400 dark:bg-pink-500/30 dark:text-pink-300'
                      : 'text-gray-300 hover:text-white hover:bg-cyan-500/10 dark:text-gray-400 dark:hover:text-white dark:hover:bg-cyan-500/10'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
          </div>
          {/* End: Navigation Items */}

          {/* Start: Controls Container */}
          <div className="flex items-center space-x-4">
            {/* Start: Language Selector */}
            <div>
              <select
                value={language}
                onChange={handleLanguageChange}
                className="retro-input w-auto text-sm bg-black/50 border-cyan-400 text-white"
              >
                <option value="en">EN</option>
                <option value="ms">MS</option>
              </select>
            </div>
            {/* End: Language Selector */}

            {/* Start: User Dropdown Menu */}
            <UserDropdownMenu />
            {/* End: User Dropdown Menu */}

            {/* Start: Dark Mode Toggle */}
            <button
              onClick={handleDarkModeToggle}
              className="retro-btn-secondary text-xs px-3 py-1 flex items-center space-x-1 border-pink-400 hover:border-pink-300"
            >
              <span>{isDarkMode ? '🌙' : '☀️'}</span>
              <span>{isDarkMode ? t.greetings.hello : 'Penapis CRT'}</span>
            </button>
            {/* End: Dark Mode Toggle */}
          </div>
          {/* End: Controls Container */}
        </div>
      </div>
    </nav>
  );
}
// End: RetroNavbar Component
