"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguageStore } from '@/store/useLanguageStore';
import { enDictionary, msDictionary } from '@/i18n/dictionaries';

interface Zone {
  id: string;
  name: string;
  icon: string;
  description: string;
  href: string;
  gridPosition: { x: number; y: number };
}

const HUBS: Zone[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: '🏠',
    description: 'Your main hub for activity and statistics',
    href: '/dashboard',
    gridPosition: { x: 4, y: 1 }
  },
  {
    id: 'directory',
    name: 'Directory',
    icon: '👥',
    description: 'Browse all residents and communities',
    href: '/directory',
    gridPosition: { x: 6, y: 1 }
  },
  {
    id: 'guestbook',
    name: 'Guestbook',
    icon: '📘',
    description: 'Leave messages for other residents',
    href: '/guestbook',
    gridPosition: { x: 2, y: 2 }
  },
  {
    id: 'cyber-cafe',
    name: 'Cyber Cafe',
    icon: '☕',
    description: 'Relax and browse the web',
    href: '/cyber-cafe',
    gridPosition: { x: 8, y: 2 }
  },
  {
    id: 'cyber-museum',
    name: 'Cyber Museum',
    icon: '🏛️',
    description: 'Explore digital art and history',
    href: '/cyber-museum',
    gridPosition: { x: 2, y: 4 }
  },
  {
    id: 'tutorials',
    name: 'Tutorials',
    icon: '📚',
    description: 'Learn about the platform',
    href: '/tutorials',
    gridPosition: { x: 6, y: 4 }
  },
  {
    id: 'town-hall',
    name: 'Town Hall',
    icon: '🗣️',
    description: 'Community discussions and announcements',
    href: '/town-hall',
    gridPosition: { x: 4, y: 3 }
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: '⚙️',
    description: 'Manage your profile and preferences',
    href: '/settings',
    gridPosition: { x: 8, y: 4 }
  },
  {
    id: 'support',
    name: 'Support',
    icon: '🆘',
    description: 'Get help and contact support',
    href: '/contact',
    gridPosition: { x: 10, y: 3 }
  }
];

export default function MapPage() {
  const { language } = useLanguageStore();
  const t = language === 'ms' ? msDictionary : enDictionary;
  const router = useRouter();
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);

  const handleZoneClick = (zone: Zone) => {
    router.push(zone.href);
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Start: Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 pixel-font mb-2">
            {t.mapTitle || 'Kampung Directory Map'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Click on any hub to navigate
          </p>
        </div>
        {/* End: Page Header */}

        {/* Start: Grid Map */}
        <div className="relative">
          {/* Grid Background */}
          <div className="grid grid-cols-12 gap-4 p-8 bg-gray-100 dark:bg-gray-900 rounded-lg border border-gray-300 dark:border-gray-600 retro-card">
            {Array.from({ length: 12 }).map((_, col) => (
              <div
                key={col}
                className={`border border-gray-200 dark:border-gray-700 ${
                  col % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800' : 'bg-gray-100 dark:bg-gray-850'
                }`}
              />
            ))}
          </div>

          {/* Zones */}
          {HUBS.map((zone) => (
            <div
              key={zone.id}
              onClick={() => handleZoneClick(zone)}
              onMouseEnter={() => setHoveredZone(zone.id)}
              onMouseLeave={() => setHoveredZone(null)}
              className={`
                absolute cursor-pointer transition-all duration-200
                transform ${hoveredZone === zone.id ? 'scale-110' : 'hover:scale-105'}
                ${hoveredZone === zone.id ? 'z-20' : 'z-10'}
              `}
              style={{
                left: `calc(${zone.gridPosition.x * 8.33}% - 40px)`,
                top: `calc(${zone.gridPosition.y * 8.33}% - 30px)`,
              }}
            >
              <div className="relative retro-card border-2 border-cyan-500/30 bg-white dark:bg-gray-800 shadow-lg">
                <div className="text-3xl text-center">{zone.icon}</div>
                <div className="pixel-font text-xs text-center text-gray-600 dark:text-gray-400 mt-1">
                  {zone.name}
                </div>
              </div>
              
              {/* Tooltip */}
              {hoveredZone === zone.id && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-2 bg-gray-800 text-white text-xs rounded retro-card border border-cyan-500 whitespace-nowrap z-30">
                  {zone.description}
                </div>
              )}
            </div>
          ))}
        </div>
        {/* End: Grid Map */}

        {/* Start: Legend */}
        <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-900 rounded-lg border border-gray-300 dark:border-gray-600">
          <h3 className="pixel-font text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">
            {t.legend || 'Legend'}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
            {HUBS.map((zone) => (
              <div key={zone.id} className="flex items-center gap-1">
                <span className="text-lg">{zone.icon}</span>
                <span className="text-gray-600 dark:text-gray-400">{zone.name}</span>
              </div>
            ))}
          </div>
        </div>
        {/* End: Legend */}
      </div>
    </main>
  );
}
