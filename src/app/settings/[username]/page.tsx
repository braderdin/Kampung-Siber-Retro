"use client";

import { useEffect, useState } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { enDictionary, msDictionary } from '@/i18n/dictionaries';
import SettingsTipping from '@/components/SettingsTipping';
import SettingsApiKey from '@/components/SettingsApiKey';
import SettingsNsfw from '@/components/SettingsNsfw';
import SettingsGithub from '@/components/SettingsGithub';
import SettingsDeleteAccount from '@/components/SettingsDeleteAccount';

// Start: Type Definitions
type SettingsPageProps = {
  params: Promise<{ username: string }>;
};

type ActiveSection = 'tipping' | 'api_key' | 'nsfw' | 'github' | 'delete' | null;
// End: Type Definitions

// Start: Main Component
export default function SettingsPage({ params }: SettingsPageProps) {
  // Start: State Management
  const [username, setUsername] = useState('');
  const [activeSection, setActiveSection] = useState<ActiveSection>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { language } = useLanguageStore();
  const t = language === 'ms' ? msDictionary : enDictionary;
  // End: State Management

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
    setIsDarkMode((current) => !current);
  };
  // End: Dark Mode Toggle

  // Start: Initialize Dark Mode
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const applyTheme = () => {
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
        setIsDarkMode(true);
      } else if (savedTheme === 'light') {
        document.documentElement.classList.remove('dark');
        setIsDarkMode(false);
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
        setIsDarkMode(true);
      }
    };

    const timer = window.setTimeout(applyTheme, 0);
    return () => window.clearTimeout(timer);
  }, []);
  // End: Initialize Dark Mode

  // Start: Section Navigation
  const navigateToSection = (section: ActiveSection) => {
    setActiveSection(section);
    window.history.replaceState({}, '', `${window.location.pathname}${section ? `#${section}` : ''}`);
  };
  // End: Section Navigation

  // Start: Render Settings Page
  return (
    <main className="min-h-screen bg-gray-50 p-6 text-gray-900 transition-colors duration-300 dark:bg-gray-950 dark:text-gray-100">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
            {t.settings} - {username}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Tetapan akaun dan keutamaan anda.</p>
        </div>

        <div className="mb-6">
          <button onClick={toggleDarkMode} className="retro-btn-secondary flex items-center space-x-2 px-4 py-2 text-sm font-medium">
            <span>{isDarkMode ? '☀️' : '🌙'}</span>
            <span>{isDarkMode ? t.modernTheme : t.crtTheme}</span>
          </button>
        </div>

        <nav className="mb-8">
          <div className="flex flex-wrap gap-2">
            {[
              ['tipping', 'Pemindahan'],
              ['api_key', 'Kunci API'],
              ['nsfw', 'Kandungan NSFW'],
              ['github', 'GitHub'],
              ['delete', 'Padam Akaun'],
            ].map(([value, label]) => (
              <button
                key={value}
                onClick={() => navigateToSection(value as ActiveSection)}
                className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${activeSection === value ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </nav>

        <div className="retro-card">
          {activeSection === 'tipping' && <SettingsTipping />}
          {activeSection === 'api_key' && <SettingsApiKey />}
          {activeSection === 'nsfw' && <SettingsNsfw />}
          {activeSection === 'github' && <SettingsGithub username={username} />}
          {activeSection === 'delete' && <SettingsDeleteAccount />}
          {activeSection === null && (
            <div className="p-6">
              <h2 className="mb-4 text-xl font-semibold">Papan Pemuka Tetapan</h2>
              <p className="text-gray-600 dark:text-gray-400">Pilih bahagian di atas untuk mengurus Tetapan anda.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
// End: Main Component
