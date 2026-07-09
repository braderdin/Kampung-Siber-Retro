"use client";
import { useState } from 'react';

interface Badge {
  id: number;
  name: string;
  emoji: string;
  description: string;
  unlocked: boolean;
}

export default function CyberBadges() {
  const [hoveredBadge, setHoveredBadge] = useState<Badge | null>(null);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  const badges: Badge[] = [
    {
      id: 1,
      name: 'Early Resident',
      emoji: '🌅',
      description: 'Sudah berdiri sejak hari pertama di Kampung Siber Retro',
      unlocked: true,
    },
    {
      id: 2,
      name: 'HTML King',
      emoji: '🌐',
      description: 'Ahli tauladan HTML dengan kod yang sempurna',
      unlocked: true,
    },
    {
      id: 3,
      name: 'Cyber Friend',
      emoji: '🤖',
      description: 'Dikenali sebagai rakan yang baik dalam komuniti',
      unlocked: true,
    },
    {
      id: 4,
      name: 'Code Warrior',
      emoji: '⚔️',
      description: 'Beransum-ansum menulis kod retro dengan mudah',
      unlocked: false,
    },
    {
      id: 5,
      name: 'Pixel Master',
      emoji: '🎨',
      description: 'Mahir mencipta grafik pixel yang menakjubkan',
      unlocked: false,
    },
    {
      id: 6,
      name: 'Retro Guru',
      emoji: '🎓',
      description: 'Mengajar atau menyanturkan pengetahuan retro kepada lain',
      unlocked: false,
    },
    {
      id: 7,
      name: 'Bug Hunter',
      emoji: '🐛',
      description: 'Mengatasi lebih daripada 10 bug dalam kod',
      unlocked: false,
    },
    {
      id: 8,
      name: 'Theme Master',
      emoji: '🌓',
      description: 'Menggunakan lebih daripada 5 tema berbeza',
      unlocked: false,
    },
    {
      id: 9,
      name: 'Shoutbox Regular',
      emoji: '💬',
      description: 'Sudah menulis komentar di shoutbox 50+ kali',
      unlocked: false,
    },
    {
      id: 10,
      name: 'Webring Traveller',
      emoji: '🧭',
      description: 'Sudah menyisitkan 10+ laman web dalam webring',
      unlocked: false,
    },
    {
      id: 11,
      name: 'CSS Wizard',
      emoji: '⚡',
      description: 'Menggunakan CSS untuk mencipta efek retro yang memukau',
      unlocked: false,
    },
    {
      id: 12,
      name: 'Retro Veteran',
      emoji: '🏆',
      description: 'Berhijau di Kampung Siber Retro selama lebih daripada 60 hari',
      unlocked: false,
    },
  ];

  const unlockedBadges = badges.filter((b) => b.unlocked);
  const lockedBadges = badges.filter((b) => !b.unlocked);

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
        <span>🏅</span>
        Lencana Pengguna
      </h3>

      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Lencana yang dinyangkan: {unlockedBadges.length} / {badges.length}
        </p>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className="relative"
            onMouseEnter={() => {
              setHoveredBadge(badge);
              setShowTooltip(true);
            }}
            onMouseLeave={() => {
              setShowTooltip(false);
              setHoveredBadge(null);
            }}
          >
            <div
              className={`w-12 h-12 sm:w-10 sm:h-10 xs:w-8 xs:h-8 rounded-full flex items-center justify-center text-xl transition-all duration-200 ${
                badge.unlocked
                  ? 'bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg'
                  : 'bg-gray-300 dark:bg-gray-600 grayscale opacity-50'
              }`}
            >
              {badge.emoji}
            </div>

            {showTooltip && hoveredBadge?.id === badge.id && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-md shadow-lg whitespace-nowrap z-10">
                <div className="font-semibold">{badge.name}</div>
                <div className="text-gray-300 max-w-xs">
                  {badge.description}
                </div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-800"></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {lockedBadges.length > 0 && (
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            🔒 Lencana lain masih belum dinyangkan. Teruskan berkarya untuk membukakannya!
          </p>
        </div>
      )}
    </div>
  );
}