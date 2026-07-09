'use client';

import { notFound } from 'next/navigation';
import { useState } from 'react';
import CommunityInteraction from '@/components/CommunityInteraction';
import CrtThemeController from '@/components/CrtThemeController';
import WinampPlayer from '@/components/WinampPlayer';
import CyberBadges from '@/components/CyberBadges';

interface UserSitePageProps {
  params: {
    username: string;
  };
}

export default function UserSitePage({ params }: UserSitePageProps) {
  const { username } = params;
  const [liked, setLiked] = useState(false);
  const [following, setFollowing] = useState(false);

  if (!username || username.length < 2) {
    notFound();
  }

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleFollow = () => {
    setFollowing(!following);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
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

          <div className="mt-6 rounded border-2 border-gray-300 bg-white p-4 retro-border">
            <p className="text-gray-600">
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