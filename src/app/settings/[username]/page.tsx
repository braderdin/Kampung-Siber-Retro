"use client";

import { useEffect, useState } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { enDictionary, msDictionary } from '@/i18n/dictionaries';
import SettingsTipping from '@/components/SettingsTipping';
import SettingsApiKey from '@/components/SettingsApiKey';
import SettingsNsfw from '@/components/SettingsNsfw';
import SettingsGithub from '@/components/SettingsGithub';
import SettingsDeleteAccount from '@/components/SettingsDeleteAccount';
import ProfileStatusBadge from '@/components/ProfileStatusBadge';
import ProfileBioEditor from '@/components/ProfileBioEditor';

// Start: Type Definitions
type SettingsPageProps = {
  params: Promise<{ username: string }>;
};

type ActiveSection = 'tipping' | 'api_key' | 'nsfw' | 'github' | 'delete' | 'profile' | null;

type BackgroundTheme = 'space_neon' | 'windows_gray' | 'retro_matrix';

interface ThemeOption {
  id: BackgroundTheme;
  name: string;
  description: string;
  preview: string;
  colors: string[];
}
// End: Type Definitions

// Start: Theme Options
const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'space_neon',
    name: 'Space Neon',
    description: 'Lantakan latar belakang neon di antara malang kosmos dengan cahaya biru dan purple.',
    preview: 'bg-gradient-to-b from-indigo-900 via-purple-900 to-cyan-900',
    colors: ['#1e3a8a', '#5b21b6', '#06b6d4', '#a855f7'],
  },
  {
    id: 'windows_gray',
    name: 'Windows Gray',
    description: 'Tema abu-abu bersih yang mengingatkan pada antara muka Windows 95 klasik.',
    preview: 'bg-gradient-to-b from-gray-200 via-gray-300 to-gray-400',
    colors: ['#c0c0c0', '#a0a0a0', '#808080', '#606060'],
  },
  {
    id: 'retro_matrix',
    name: 'Retro Matrix',
    description: 'Aliran kod hijau bergerak di latar belakang hitam gaya Matrix.',
    preview: 'bg-gradient-to-b from-black via-green-900 to-black',
    colors: ['#00ff00', '#00aa00', '#005500', '#000000'],
  },
];
// End: Theme Options

// Start: Main Component
export default function SettingsPage({ params }: SettingsPageProps) {
  // Start: State Management
  const [username, setUsername] = useState('');
  const [activeSection, setActiveSection] = useState<ActiveSection>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<BackgroundTheme>('space_neon');
  const [bio, setBio] = useState('Saya warga kampung siber retro yang antara.');
  const [userStatus, setUserStatus] = useState<'online' | 'coding' | 'makan'>('online');
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

  // Start: Initialize Theme from Storage
  useEffect(() => {
    const savedTheme = localStorage.getItem('background_theme');
    if (savedTheme && THEME_OPTIONS.some(t => t.id === savedTheme)) {
      setSelectedTheme(savedTheme as BackgroundTheme);
    }
  }, []);
  // End: Initialize Theme from Storage

  // Start: Apply Theme Styles
  useEffect(() => {
    const applyThemeStyles = () => {
      const root = document.documentElement;
      const theme = THEME_OPTIONS.find(t => t.id === selectedTheme);
      if (theme) {
        root.style.setProperty('--theme-primary', theme.colors[0]);
        root.style.setProperty('--theme-secondary', theme.colors[1]);
        root.style.setProperty('--theme-accent', theme.colors[2]);
        root.style.setProperty('--theme-background', theme.colors[3]);
      }
    };
    applyThemeStyles();
    localStorage.setItem('background_theme', selectedTheme);
  }, [selectedTheme]);
  // End: Apply Theme Styles

  // Start: Handle Hash Navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (['tipping', 'api_key', 'nsfw', 'github', 'delete', 'profile'].includes(hash)) {
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

  // Start: Handle Theme Change
  const handleThemeChange = (theme: BackgroundTheme) => {
    setSelectedTheme(theme);
  };
  // End: Handle Theme Change

  // Start: Handle Bio Change
  const handleBioChange = (newBio: string) => {
    setBio(newBio);
  };
  // End: Handle Bio Change

  // Start: Handle Status Change
  const handleStatusChange = (status: string) => {
    setUserStatus(status as 'online' | 'coding' | 'makan');
  };
  // End: Handle Status Change

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

        {/* Start: Profile Customization Section */}
        {activeSection === 'profile' && (
          <div className="retro-card mb-6">
            <div className="retro-card-header bg-gray-200 dark:bg-gray-700 px-4 py-2 border-b border-gray-300 dark:border-gray-600">
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                🎨 Pilihan Profil
              </h2>
            </div>
            <div className="p-4 retro-window-client">
              {/* Start: Live Status Indicator */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Status Hidup</h3>
                <ProfileStatusBadge 
                  initialStatus={userStatus}
                  onStatusChange={handleStatusChange}
                />
              </div>
              {/* End: Live Status Indicator */}

              {/* Start: Bio Editor */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Bio Peribadi</h3>
                <ProfileBioEditor 
                  initialBio={bio}
                  onBioChange={handleBioChange}
                />
              </div>
              {/* End: Bio Editor */}

              {/* Start: Background Theme Picker */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Tema Latar Belakang</h3>
                <div className="grid gap-3 sm:grid-cols-3">
                  {THEME_OPTIONS.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => handleThemeChange(theme.id)}
                      className={`p-3 rounded-lg border transition-all ${
                        selectedTheme === theme.id
                          ? 'border-purple-500 ring-2 ring-purple-200 dark:ring-purple-800'
                          : 'border-gray-300 dark:border-gray-600 hover:shadow-md'
                      }`}
                    >
                      <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {theme.name}
                      </div>
                      <div className={`h-12 rounded ${theme.preview} flex items-center justify-center`}>
                        <span className="text-xs text-gray-800 dark:text-gray-200 font-mono">
                          {theme.description.split(' ')[0]}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                  Tema semasa: <span className="font-bold text-purple-400">{THEME_OPTIONS.find(t => t.id === selectedTheme)?.name}</span>
                </div>
              </div>
              {/* End: Background Theme Picker */}
            </div>
          </div>
        )}
        {/* End: Profile Customization Section */}

        <nav className="mb-8">
          <div className="flex flex-wrap gap-2">
            {[
              ['profile', 'Profil'],
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