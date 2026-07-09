"use client";

import { useState, useEffect } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { enDictionary, msDictionary } from '@/i18n/dictionaries';

interface Resident {
  id: number;
  username: string;
  avatar: string;
  visitors: number;
  rank: number;
  badges: string[];
}

interface TopResidentsLeaderboardProps {
  className?: string;
}

const mockResidents: Resident[] = [
  {
    id: 1,
    username: 'pixel_wizard',
    avatar: '👨‍💻',
    visitors: 12450,
    rank: 1,
    badges: ['👑', '⭐', '🔥']
  },
  {
    id: 2,
    username: 'retro_king',
    avatar: '👑',
    visitors: 9876,
    rank: 2,
    badges: ['⭐', '💎']
  },
  {
    id: 3,
    username: 'neon_dreamer',
    avatar: '🌙',
    visitors: 8543,
    rank: 3,
    badges: ['⭐']
  },
  {
    id: 4,
    username: 'code_slinger',
    avatar: '🎮',
    visitors: 7231,
    rank: 4,
    badges: ['🔥']
  },
  {
    id: 5,
    username: 'byte_bard',
    avatar: '🎵',
    visitors: 6120,
    rank: 5,
    badges: []
  }
];

export default function TopResidentsLeaderboard({ className }: TopResidentsLeaderboardProps) {
  const { language } = useLanguageStore();
  const t = language === 'ms' ? msDictionary : enDictionary;
  
  const [residents, setResidents] = useState<Resident[]>([]);
  const [time, setTime] = useState(Date.now());

  useEffect(() => {
    const sortedResidents = [...mockResidents].sort((a, b) => b.visitors - a.visitors);
    setResidents(sortedResidents);
    
    const interval = setInterval(() => {
      setTime(Date.now());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const getRankBadge = (rank: number): string => {
    const badges = ['🥇', '🥈', '🥉'];
    if (rank <= 3) return badges[rank - 1];
    return `#${rank}`;
  };

  const formatVisitors = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const getRankClass = (rank: number): string => {
    if (rank === 1) return 'text-yellow-400 bg-yellow-900/30 border-yellow-500';
    if (rank === 2) return 'text-silver text-silver-400 bg-silver-900/30 border-silver-400';
    if (rank === 3) return 'text-amber-400 bg-amber-900/30 border-amber-500';
    return 'text-gray-400 bg-gray-800/30 border-gray-600';
  };

  return (
    <div className={`top-residents-leaderboard ${className || ''}`}>
      <div className="retro-window retro-border">
        <div className="retro-window-header bg-gradient-to-r from-purple-900 to-indigo-900 px-3 py-2 border-b border-purple-500">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span className="text-2xl">🏆</span>
            <span>Pemain Teratas</span>
          </h3>
        </div>
        <div className="retro-window-client p-4">
          <div className="space-y-3">
            {residents.map((resident, index) => (
              <div 
                key={resident.id}
                className="retro-leaderboard-card flex items-center gap-3 p-3 rounded-lg border transition-all hover:scale-[1.02]"
                style={{
                  background: index < 3 
                    ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' 
                    : 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
                }}
              >
                <div className="text-2xl">{resident.avatar}</div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`retro-rank-badge pixel-font text-lg font-bold ${getRankClass(resident.rank)}`}>
                      {getRankBadge(resident.rank)}
                    </span>
                    <span className="text-lg font-semibold text-white">
                      @{resident.username}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {formatVisitors(resident.visitors)} pengunjung hari ini
                  </div>
                  {resident.badges.length > 0 && (
                    <div className="flex gap-1 mt-2">
                      {resident.badges.map((badge, i) => (
                        <span key={i} className="text-lg">{badge}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-700 text-xs text-gray-500 flex justify-between items-center">
            <span>Di kemas kini: {new Date(time).toLocaleTimeString()}</span>
            <span className="font-mono text-green-400">🔄 Auto-refresh</span>
          </div>
        </div>
      </div>
    </div>
  );
}