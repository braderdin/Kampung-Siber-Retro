// Start: Imports
"use client";

import { useLanguageStore } from '@/store/useLanguageStore';
import { enDictionary, msDictionary } from '@/i18n/dictionaries';
import { useRouter } from 'next/navigation';
import { useRef, useEffect } from 'react';
// End: Imports

// Start: Type Definitions
interface UserDropdownMenuProps {
  className?: string;
}
// End: Type Definitions

// Start: UserDropdownMenu Component
export default function UserDropdownMenu({ className }: UserDropdownMenuProps) {
  const { language, setLanguage } = useLanguageStore();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  const t = language === 'ms' ? msDictionary : enDictionary;

  // Start: Handle Navigation
  const handleNavigation = (path: string) => {
    router.push(path);
    closeDropdown();
  };
  // End: Handle Navigation

  // Start: Handle Sign Out
  const handleSignOut = () => {
    // Sign out logic here
    console.log('Signing out...');
    closeDropdown();
  };
  // End: Handle Sign Out

  // Start: Handle Language Change
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as 'en' | 'ms');
  };
  // End: Handle Language Change

  // Start: Toggle Dropdown
  const toggleDropdown = () => {
    if (dropdownRef.current) {
      dropdownRef.current.classList.toggle('hidden');
    }
  };
  // End: Toggle Dropdown

  // Start: Close Dropdown
  const closeDropdown = () => {
    if (dropdownRef.current) {
      dropdownRef.current.classList.add('hidden');
    }
  };
  // End: Close Dropdown

  // Start: Click Outside Handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        buttonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  // End: Click Outside Handler

  // Start: Render Dropdown Menu
  return (
    <div className={`relative inline-block text-left ${className || ''}`}>
      <div>
        <button
          ref={buttonRef}
          type="button"
          onClick={toggleDropdown}
          className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
          id="menu-button"
          aria-expanded="false"
          aria-haspopup="true"
        >
          User
          <svg className="-ml-2 mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Start: Dropdown Menu */}
      <div
        ref={dropdownRef}
        className="hidden origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 dark:bg-gray-800 dark:ring-gray-700"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
      >
        <div className="py-1" role="none">
          {/* Start: Menu Items */}
          <button
            onClick={() => handleNavigation('/profile')}
            className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
            role="menuitem"
          >
            📋 {t.dashboardTitle}
          </button>
          <button
            onClick={() => handleNavigation('/activity')}
            className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
            role="menuitem"
          >
            📈 {t.analytics}
          </button>
          <button
            onClick={() => handleNavigation('/settings')}
            className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
            role="menuitem"
          >
            ⚙️ {t.settings}
          </button>
          <button
            onClick={() => handleNavigation('/stats')}
            className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
            role="menuitem"
          >
            📊 {t.statsTitle}
          </button>
          <button
            onClick={handleSignOut}
            className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
            role="menuitem"
          >
            🚪 {t.greetings.hello}
          </button>
          {/* End: Menu Items */}
        </div>
      </div>
      {/* End: Dropdown Menu */}
    </div>
  );
}
// End: UserDropdownMenu Component
