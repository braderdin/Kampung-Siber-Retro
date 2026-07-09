"use client";

import { useState } from 'react';

interface WebringSite {
  id: number;
  name: string;
  url: string;
  description: string;
  avatar: string;
  tagline: string;
  visits: number;
}

interface WebringFooterProps {
  className?: string;
}

const webringSites: WebringSite[] = [
  {
    id: 1,
    name: 'Retro Code Haven',
    url: 'https://retrocode.haven',
    description: 'A sanctuary for retro coding enthusiasts building pixel-perfect websites',
    avatar: '🖥️',
    tagline: 'Code in 8-bit',
    visits: 1245,
  },
  {
    id: 2,
    name: 'Pixel Paradise',
    url: 'https://pixel.paradise',
    description: 'Where pixels meet purpose - crafting digital dreams one frame at a time',
    avatar: '🎨',
    tagline: 'Art in pixels',
    visits: 987,
  },
  {
    id: 3,
    name: 'Neon Nexus',
    url: 'https://neon.nexus',
    description: 'Connect the neon dots - bridging retro aesthetics with modern functionality',
    avatar: '⚡',
    tagline: 'Neon vibes',
    visits: 876,
  },
  {
    id: 4,
    name: 'Byte Bazaar',
    url: 'https://byte.bazaar',
    description: 'Trading bytes since forever - a marketplace of code and creativity',
    avatar: '🛒',
    tagline: 'Trade in bytes',
    visits: 754,
  },
  {
    id: 5,
    name: 'Glitch Garden',
    url: 'https://glitch.garden',
    description: 'Cultivating digital anomalies - where bugs become features',
    avatar: '🌿',
    tagline: 'Grow glitches',
    visits: 642,
  },
  {
    id: 6,
    name: 'Synthwave Station',
    url: 'https://synth.station',
    description: 'Streaming retro waves and coding to the beat of 80s synth',
    avatar: '🎹',
    tagline: 'Wave after wave',
    visits: 543,
  },
  {
    id: 7,
    name: 'Terminal Tavern',
    url: 'https://terminal.tavern',
    description: 'Pull up a chair at the digital bar - where CLI commands flow like drinks',
    avatar: '🍺',
    tagline: 'CLI & Chill',
    visits: 432,
  },
  {
    id: 8,
    name: 'Vintage Vibes',
    url: 'https://vintage.vibes',
    description: 'Capturing the essence of digital nostalgia with modern flair',
    avatar: '📻',
    tagline: 'Old school new cool',
    visits: 389,
  },
  {
    id: 9,
    name: 'Circuit Circus',
    url: 'https://circuit.circus',
    description: 'A electrifying showcase of hardware-inspired web design',
    avatar: '⚙️',
    tagline: 'Electric webs',
    visits: 321,
  },
  {
    id: 10,
    name: 'DOS Domain',
    url: 'https://dos.domain',
    description: 'Pure command-line experience with a retro interface twist',
    avatar: '💿',
    tagline: 'Dust to digital',
    visits: 287,
  },
];

export default function WebringFooter({ className }: WebringFooterProps) {
  const [currentSiteIndex, setCurrentSiteIndex] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);

  const navigateToPrevious = () => {
    setIsNavigating(true);
    const newIndex = currentSiteIndex === 0 
      ? webringSites.length - 1 
      : currentSiteIndex - 1;
    setCurrentSiteIndex(newIndex);
    setTimeout(() => setIsNavigating(false), 500);
  };

  const navigateToRandom = () => {
    setIsNavigating(true);
    const randomIndex = Math.floor(Math.random() * webringSites.length);
    setCurrentSiteIndex(randomIndex);
    setTimeout(() => setIsNavigating(false), 500);
  };

  const navigateToNext = () => {
    setIsNavigating(true);
    const newIndex = currentSiteIndex === webringSites.length - 1 
      ? 0 
      : currentSiteIndex + 1;
    setCurrentSiteIndex(newIndex);
    setTimeout(() => setIsNavigating(false), 500);
  };

  const currentSite = webringSites[currentSiteIndex];

  const handleSiteClick = (url: string) => {
    if (url.startsWith('https://') || url.startsWith('http://')) {
      window.open(url, '_blank');
    }
  };

  return (
    <div className={`retro-webring-footer ${className || ''}`}>
      <div className="retro-footer-grid">
        <div className="retro-nav-buttons flex flex-col sm:flex-row gap-2">
          <button
            onClick={navigateToPrevious}
            disabled={isNavigating}
            className="retro-btn-secondary text-xs px-3 py-1"
          >
            ⏪ Sebelum
          </button>
          
          <button
            onClick={navigateToRandom}
            disabled={isNavigating}
            className="retro-btn-secondary text-xs px-3 py-1"
          >
            🎲 Rawak
          </button>
          
          <button
            onClick={navigateToNext}
            disabled={isNavigating}
            className="retro-btn-secondary text-xs px-3 py-1"
          >
            Seterus ⏩
          </button>
        </div>

        <div className="retro-site-info text-center sm:text-right">
          <div className="font-mono text-sm text-gray-700 dark:text-gray-300">
            <span className="text-gray-500 dark:text-gray-400">Situs Semasa: </span>
            <span className="font-bold text-purple-400 dark:text-purple-300">
              {currentSite.name}
            </span>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {currentSite.description}
          </div>
          <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            <span className="mr-1">👁️:</span> {currentSite.visits.toLocaleString()} kunjungan
          </div>
        </div>

        <div className="retro-site-list hidden sm:block">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Rangkaian Wargalaya:
          </div>
          <ul className="space-y-1">
            {webringSites.map((site, index) => (
              <li
                key={site.id}
                onClick={() => handleSiteClick(site.url)}
                className={`text-xs cursor-pointer hover:text-purple-400 dark:hover:text-purple-300 transition-colors ${
                  index === currentSiteIndex 
                    ? 'font-bold text-purple-400 dark:text-purple-300' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                <span className="mr-1">{site.avatar}</span>
                {site.name}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="retro-footer-bar mt-2 pt-2 border-t border-gray-300 dark:border-gray-600 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
        <span>
          {isNavigating ? '🔄 Menavigasi...' : '🕹️ Lawan webring'}
        </span>
        <span>
          {currentSiteIndex + 1} / {webringSites.length}
        </span>
      </div>
    </div>
  );
}