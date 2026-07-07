'use client';

import { notFound } from 'next/navigation';
import { useState } from 'react';
import CommunityInteraction from '@/components/CommunityInteraction';
import CrtThemeController from '@/components/CrtThemeController';

interface UserSitePageProps {
  params: {
    username: string;
  };
}

// Start: UserSitePage Component
export default function UserSitePage({ params }: UserSitePageProps) {
  const { username } = params;
  const [liked, setLiked] = useState(false);
  const [following, setFollowing] = useState(false);

  if (!username || username.length < 2) {
    notFound();
  }

  // Start: Handle Like
  const handleLike = () => {
    setLiked(!liked);
  };
  // End: Handle Like

  // Start: Handle Follow
  const handleFollow = () => {
    setFollowing(!following);
  };
  // End: Handle Follow

  // Start: Render UserSitePage Component
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
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
              <span className="retro-control-name">Fail Saya</span>
            </div>
            <div className="retro-control-item">
              <span className="retro-control-label">📊</span>
              <span className="retro-control-name">Statistik</span>
            </div>
            <div className="retro-control-item">
              <span className="retro-control-label">⚙️</span>
              <span className="retro-control-name">Tetapan</span>
            </div>
          </div>
          <div className="mt-6 rounded border-2 border-gray-300 bg-white p-4 retro-border">
            <p className="text-gray-600">
              Ini ialah ruang placeholder untuk laman retro peribadi {username}. Kandungan akan dimuatkan secara dinamik berdasarkan Tetapan pengguna.
            </p>
          </div>
          <div className="mt-6">
            <CommunityInteraction username={username} />
          </div>
        </div>
      </div>
    </div>
  );
}
// End: UserSitePage Component
