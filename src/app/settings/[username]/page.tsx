"use client";

import { useState, useEffect } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { enDictionary, msDictionary } from '@/i18n/dictionaries';
import SettingsTipping from '@/components/SettingsTipping';
import SettingsApiKey from '@/components/SettingsApiKey';
import SettingsNsfw from '@/components/SettingsNsfw';

// Start: Type Definitions
type SettingsPageProps = {
  params: Promise<{ username: string }>;
};

type ActiveSection = 'tipping' | 'api_key' | 'nsfw' | 'github' | 'delete' | null;
// End: Type Definitions

// Start: Main Component
export default function SettingsPage({ params }: SettingsPageProps) {
  const [username, setUsername] = useState<string>('');
  const [activeSection, setActiveSection] = useState<ActiveSection>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { language } = useLanguageStore();
  
  const t = language === 'ms' ? msDictionary : enDictionary;

  // Start: Load Username
  useEffect(() => {
    params.then((resolvedParams) => {
      setUsername(resolvedParams.username);
    });
  }, [params]);
  // End: Load Username

  // Start: Handle Hash Navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash === 'tipping' || hash === 'api_key' || hash === 'nsfw' || hash === 'github' || hash === 'delete') {
        setActiveSection(hash as ActiveSection);
      } else {
        setActiveSection(null);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  // End: Handle Hash Navigation

  // Start: Dark Mode Toggle
  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
    setIsDarkMode(!isDarkMode);
  };

  // Start: Initialize Dark Mode
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    } else if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
        setIsDarkMode(true);
      }
    }
  }, []);
  // End: Initialize Dark Mode

  // Start: Section Navigation
  const navigateToSection = (section: ActiveSection) => {
    setActiveSection(section);
    window.location.hash = section ? `#${section}` : '';
  };
  // End: Section Navigation

  // Start: Render Settings Page
  return (
    <main className="min-h-screen bg-gray-50 p-6 text-gray-900 dark:bg-gray-950 dark:text-gray-100 transition-colors duration-300">
      <div className="mx-auto max-w-4xl">
        {/* Start: Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {t.settings} - {username}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account settings and preferences
          </p>
        </div>
        {/* End: Page Header */}

        {/* Start: Dark Mode Toggle */}
        <div className="mb-6">
          <button
            onClick={toggleDarkMode}
            className="retro-btn-secondary flex items-center space-x-2 px-4 py-2 text-sm font-medium"
          >
            <span>{isDarkMode ? '☀️' : '🌙'}</span>
            <span>{isDarkMode ? t.modernTheme : t.crtTheme}</span>
          </button>
        </div>
        {/* End: Dark Mode Toggle */}

        {/* Start: Section Navigation */}
        <nav className="mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => navigateToSection('tipping')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeSection === 'tipping'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              Tipping
            </button>
            <button
              onClick={() => navigateToSection('api_key')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeSection === 'api_key'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              API Key
            </button>
            <button
              onClick={() => navigateToSection('nsfw')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeSection === 'nsfw'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              NSFW Content
            </button>
            <button
              onClick={() => navigateToSection('github')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeSection === 'github'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              GitHub
            </button>
            <button
              onClick={() => navigateToSection('delete')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeSection === 'delete'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              Delete Account
            </button>
          </div>
        </nav>
        {/* End: Section Navigation */}

        {/* Start: Section Content */}
        <div className="retro-card">
          {activeSection === 'tipping' && <SettingsTipping />}
          {activeSection === 'api_key' && <SettingsApiKey />}
          {activeSection === 'nsfw' && <SettingsNsfw />}
          {activeSection === 'github' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">GitHub Integration</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Connect your GitHub account to sync repositories and collaborate on projects.
              </p>
              <button className="retro-btn-primary">
                Connect GitHub
              </button>
            </div>
          )}
          {activeSection === 'delete' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-red-600 mb-4">Delete Account</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                This action cannot be undone. All your data will be permanently deleted.
              </p>
              <button className="retro-btn-secondary bg-red-600 hover:bg-red-700 text-white">
                Delete My Account
              </button>
            </div>
          )}
          {activeSection === null && (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">General Settings</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Select a section above to configure your settings.
              </p>
            </div>
          )}
        </div>
        {/* End: Section Content */}
      </div>
    </main>
  );
}
// End: Main Component
