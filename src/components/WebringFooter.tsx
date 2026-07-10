"use client";

import { useState, useEffect } from 'react';

interface ResidentProfile {
  username: string;
  displayName: string;
  status: string;
  lastActive: string;
  avatar: string;
}

interface WebringFooterProps {
  className?: string;
}

// Comprehensive mock catalog of resident village usernames
const RESIDENT_CATALOG: ResidentProfile[] = [
  {
    username: 'cyber_pioneer',
    displayName: 'Cyber Pioneer',
    status: 'online',
    lastActive: 'Just now',
    avatar: '🚀'
  },
  {
    username: 'pixel_warrior',
    displayName: 'Pixel Warrior',
    status: 'coding',
    lastActive: '5 min ago',
    avatar: '⚔️'
  },
  {
    username: 'byte_collector',
    displayName: 'Byte Collector',
    status: 'online',
    lastActive: '2 min ago',
    avatar: '💎'
  },
  {
    username: 'retro_hacker',
    displayName: 'Retro Hacker',
    status: 'coding',
    lastActive: '1 hour ago',
    avatar: '🔧'
  },
  {
    username: 'neon_drifter',
    displayName: 'Neon Drifter',
    status: 'makan',
    lastActive: '30 min ago',
    avatar: '🌙'
  },
  {
    username: 'terminal_wizard',
    displayName: 'Terminal Wizard',
    status: 'online',
    lastActive: 'Just now',
    avatar: '🧙'
  },
  {
    username: 'code_archaeologist',
    displayName: 'Code Archaeologist',
    status: 'online',
    lastActive: '10 min ago',
    avatar: '🏺'
  },
  {
    username: 'synth_wave',
    displayName: 'Synth Wave',
    status: 'coding',
    lastActive: '3 hours ago',
    avatar: '🎹'
  },
  {
    username: 'digital_trailblazer',
    displayName: 'Digital Trailblazer',
    status: 'online',
    lastActive: 'Just now',
    avatar: '🧭'
  },
  {
    username: 'analog_dreamer',
    displayName: 'Analog Dreamer',
    status: 'makan',
    lastActive: '45 min ago',
    avatar: '🌅'
  },
  {
    username: 'floppy_disk',
    displayName: 'Floppy Disk',
    status: 'online',
    lastActive: '15 min ago',
    avatar: '💾'
  },
  {
    username: 'modem_rider',
    displayName: 'Modem Rider',
    status: 'coding',
    lastActive: '2 hours ago',
    avatar: '📡'
  },
  {
    username: 'BBS_legend',
    displayName: 'BBS Legend',
    status: 'online',
    lastActive: 'Just now',
    avatar: '📞'
  },
  {
    username: 'phreaker_legend',
    displayName: 'Phreaker Legend',
    status: 'online',
    lastActive: '5 min ago',
    avatar: '📱'
  },
  {
    username: 'telnet_navigator',
    displayName: 'Telnet Navigator',
    status: 'coding',
    lastActive: '1 hour ago',
    avatar: '🔗'
  },
  {
    username: 'gopher_guru',
    displayName: 'Gopher Guru',
    status: 'online',
    lastActive: '10 min ago',
    avatar: '🐹'
  },
  {
    username: 'usenet_explorer',
    displayName: 'Usenet Explorer',
    status: 'online',
    lastActive: 'Just now',
    avatar: '📰'
  },
  {
    username: 'ftp_finder',
    displayName: 'FTP Finder',
    status: 'makan',
    lastActive: '20 min ago',
    avatar: '📁'
  },
  {
    username: 'irc_wanderer',
    displayName: 'IRC Wanderer',
    status: 'online',
    lastActive: '30 min ago',
    avatar: '💬'
  },
  {
    username: 'glitch_master',
    displayName: 'Glitch Master',
    status: 'coding',
    lastActive: '4 hours ago',
    avatar: '⚡'
  }
];

export default function WebringFooter({ className }: WebringFooterProps) {
  const [residents, setResidents] = useState<ResidentProfile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Load residents from localStorage or use mock data
    const storedResidents = localStorage.getItem('resident_profiles');
    if (storedResidents) {
      try {
        const parsed = JSON.parse(storedResidents);
        setResidents(parsed);
      } catch (err) {
        setResidents(RESIDENT_CATALOG);
      }
    } else {
      setResidents(RESIDENT_CATALOG);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % residents.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [residents.length]);

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'online':
        return 'text-green-500';
      case 'coding':
        return 'text-blue-500';
      case 'makan':
        return 'text-amber-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string): string => {
    switch (status) {
      case 'online':
        return '●';
      case 'coding':
        return '⌨️';
      case 'makan':
        return '☕';
      default:
        return '○';
    }
  };

  const displayResidents = residents.slice(currentIndex, currentIndex + 5);
  if (displayResidents.length < 5) {
    displayResidents.push(...residents.slice(0, 5 - displayResidents.length));
  }

  return (
    <footer className={`webring-footer ${className || ''}`}>
      {/* Start: Webring Header */}
      <div className="retro-window mb-4">
        <div className="retro-window-header bg-gradient-to-r from-purple-900 to-pink-900 px-4 py-2 border-b border-pink-500">
          <h3 className="text-sm font-bold text-white pixel-font flex items-center gap-2">
            <span className="text-xl">🕸️</span>
            <span>Webring - Resident Village Loop</span>
          </h3>
        </div>
        <div className="p-4">
          {/* Start: Resident Profiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {displayResidents.map((resident, index) => (
              <div
                key={`${resident.username}-${index}`}
                className="retro-card retro-window-sm p-3"
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{resident.avatar}</span>
                  <div className="min-w-0">
                    <div className="font-bold text-sm text-gray-800 dark:text-gray-200 truncate">
                      @{resident.username}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <span className={getStatusColor(resident.status)}>
                        {getStatusIcon(resident.status)}
                      </span>
                      <span className="truncate">
                        {resident.status === 'online' ? 'Online' : resident.status === 'coding' ? 'Koding' : 'Makan'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* End: Resident Profiles */}

          {/* Start: Navigation Controls */}
          <div className="mt-3 flex justify-center gap-2">
            <button
              onClick={() => setCurrentIndex(prev => prev > 0 ? prev - 1 : residents.length - 1)}
              className="retro-btn-secondary text-xs px-2 py-1"
              aria-label="Previous residents"
            >
              ← Prev
            </button>
            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <span>{currentIndex + 1}</span>
              <span>/</span>
              <span>{residents.length}</span>
            </div>
            <button
              onClick={() => setCurrentIndex(prev => (prev + 1) % residents.length)}
              className="retro-btn-secondary text-xs px-2 py-1"
              aria-label="Next residents"
            >
              Next →
            </button>
          </div>
          {/* End: Navigation Controls */}
        </div>
      </div>
      {/* End: Webring Header */}

      {/* Start: Webring Footer */}
      <div className="retro-window-footer bg-gray-800/50 dark:bg-gray-900/50 px-4 py-3 border-t border-gray-300 dark:border-gray-600">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-400 dark:text-gray-300">
          <div className="flex items-center gap-4">
            <span className="pixel-font">
              🏠 Kampung Siber Retro Webring
            </span>
            <span className="hidden sm:inline">
              • 
            </span>
            <span className="pixel-font">
              {residents.length} Warga Aktif
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.location.reload()}
              className="retro-btn-secondary text-xs px-2 py-1 hover:text-white"
            >
              🔄 Refresh
            </button>
            <span className="pixel-font">
              © 2024 Kampung Siber Retro
            </span>
          </div>
        </div>
      </div>
      {/* End: Webring Footer */}
    </footer>
  );
}
