'use client';

import { notFound } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { enDictionary, msDictionary } from '@/i18n/dictionaries';
import CommunityInteraction from '@/components/CommunityInteraction';
import CrtThemeController from '@/components/CrtThemeController';
import WinampPlayer from '@/components/WinampPlayer';
import CyberBadges from '@/components/CyberBadges';
import ProfileStatusBadge from '@/components/ProfileStatusBadge';
import ProfileBioEditor from '@/components/ProfileBioEditor';
import HydrationGuard from '@/components/HydrationGuard';

interface UserSitePageProps {
  params: {
    username: string;
  };
}

type BackgroundTheme = 'space_neon' | 'windows_gray' | 'retro_matrix';

interface ThemeConfig {
  id: BackgroundTheme;
  name: string;
  className: string;
  textClass: string;
  accentClass: string;
}

const THEME_CONFIGS: Record<BackgroundTheme, ThemeConfig> = {
  space_neon: {
    id: 'space_neon',
    name: 'Space Neon',
    className: 'bg-gradient-to-br from-indigo-900 via-purple-900 to-cyan-900',
    textClass: 'text-cyan-100',
    accentClass: 'text-purple-400',
  },
  windows_gray: {
    id: 'windows_gray',
    name: 'Windows Gray',
    className: 'bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300',
    textClass: 'text-gray-800',
    accentClass: 'text-blue-600',
  },
  retro_matrix: {
    id: 'retro_matrix',
    name: 'Retro Matrix',
    className: 'bg-gradient-to-br from-black via-green-900 to-black',
    textClass: 'text-green-300',
    accentClass: 'text-lime-400',
  },
};

export default function UserSitePage({ params }: UserSitePageProps) {
  const { username } = params;
  const { language } = useLanguageStore();
  const t = language === 'ms' ? msDictionary : enDictionary;
  
  const [liked, setLiked] = useState(false);
  const [following, setFollowing] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<BackgroundTheme>('space_neon');
  const [userStatus, setUserStatus] = useState<'online' | 'coding' | 'makan'>('online');
  const [bio, setBio] = useState('Saya warga kampung siber retro yang antara. Menyukai HTML, CSS, dan JavaScript.');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedTheme = localStorage.getItem('background_theme') as BackgroundTheme;
    if (savedTheme && THEME_CONFIGS[savedTheme]) {
      setSelectedTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    document.documentElement.className = `theme-${selectedTheme}`;
  }, [selectedTheme, isMounted]);

  if (!username || username.length < 2) {
    notFound();
  }

  const currentTheme = THEME_CONFIGS[selectedTheme];

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleFollow = () => {
    setFollowing(!following);
  };

  const handleStatusChange = (status: string) => {
    setUserStatus(status as 'online' | 'coding' | 'makan');
  };

  const handleBioChange = (newBio: string) => {
    setBio(newBio);
  };

  return (
    <div className={`flex min-h-screen flex-col items-center justify-center p-4 transition-all duration-500 ${currentTheme.className} ${currentTheme.textClass}`}>
      <WinampPlayer />

      <div className="retro-window w-full max-w-4xl">
        <div className="retro-window-title-bar">
          <div className="retro-window-title">Laman {username}</div>
        </div>
        <div className="retro-window-client p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h1 className="retro-heading text-2xl font-bold">Laman Peribadi {username}</h1>
            <CrtThemeController />
          </div>

          {/* Start: Live Status Indicator */}
          <div className="mb-4">
            <ProfileStatusBadge 
              initialStatus={userStatus}
              onStatusChange={handleStatusChange}
            />
          </div>
          {/* End: Live Status Indicator */}

          {/* Start: Bio Preview */}
          <div className="mb-4 retro-terminal-preview">
            <div className="retro-terminal-header bg-gray-800 px-3 py-2 border-b border-gray-700">
              <span className="text-xs text-gray-400 font-mono">bio.txt</span>
            </div>
            <div className="retro-terminal-body p-3 font-mono text-sm">
              <div className="flex items-start gap-2">
                <span className="text-cyan-400">retro@{username}~</span>
                <span className="whitespace-pre-wrap break-words">
                  <span className="text-green-400">{bio}</span>
                </span>
              </div>
            </div>
          </div>
          {/* End: Bio Preview */}

          <div className="mb-4 flex flex-wrap gap-2">
            <button onClick={handleLike} className={`retro-btn-secondary text-xs ${liked ? 'bg-green-500 text-white' : ''}`}>
              ❤️ Suka
            </button>
            <button onClick={handleFollow} className={`retro-btn-secondary text-xs ${following ? 'bg-blue-500 text-white' : ''}`}>
              👤 Ikut
            </button>
          </div>

          <div className="retro-controls-grid">
            <div className="retro-control-item">
              <span className="retro-control-label">📁</span>
              <span className="retro-control-name">Paparan Fail</span>
            </div>
            <div className="retro-control-item">
              <span className="retro-control-label">📊</span>
              <span className="retro-control-name">Paparkan Statistik</span>
            </div>
            <div className="retro-control-item">
              <span className="retro-control-label">⚙️</span>
              <span className="retro-control-name">Siri Tutorial</span>
            </div>
          </div>

          <div className="mt-6 rounded border-2 border-gray-300 bg-white dark:bg-gray-800 p-4 retro-border">
            <p className="text-gray-600 dark:text-gray-400">
              Inilah ruang canvas portfolio awam untuk laman web HTML, CSS, dan JS yang dibina oleh warga resident. Kandungan akan dimuatkan secara dinamik berdasarkan pilihan pengguna.
            </p>
          </div>

          <div className="mt-6">
            <CommunityInteraction username={username} />
          </div>

          <div className="mt-6">
            <CyberBadges />
          </div>
        </div>
      </div>
    </div>
  );
}