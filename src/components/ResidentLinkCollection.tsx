"use client";

import { useState, useEffect } from 'react';

interface ResidentLink {
  id: string;
  title: string;
  url: string;
  description: string;
  icon: string;
  category: string;
  isFavorite?: boolean;
}

interface ResidentLinkCollectionProps {
  links?: ResidentLink[];
  onLinkClick?: (link: ResidentLink) => void;
  className?: string;
}

const DEFAULT_LINKS: ResidentLink[] = [
  {
    id: '1',
    title: 'Vintage Computer Museum',
    url: 'https://vintagecomputer.com',
    description: 'Muse baharu komputer vintage dengan koleksi lengkap peralatan 80-an dan 90-an.',
    icon: '🖥️',
    category: 'Museum',
    isFavorite: true
  },
  {
    id: '2',
    title: 'Internet Archive',
    url: 'https://archive.org',
    description: 'Arkib bersenaryan internet dengan jutaan laman web lama untuk diselidiki.',
    icon: '🗃️',
    category: 'Arkib',
    isFavorite: true
  },
  {
    id: '3',
    title: 'Old Computer Museum',
    url: 'https://old-computer-museum.com',
    description: 'Museum dengan galeri lengkap komputer personal dari 1970-an hingga 2000-an.',
    icon: '💻',
    category: 'Museum',
    isFavorite: false
  },
  {
    id: '4',
    title: 'Classic Gaming Community',
    url: 'https://classicgaming.cc',
    description: 'Komuniti pereka dan pemerjudi permainan klasik dengan rahsia dan cheat.',
    icon: '🎮',
    category: 'Permainan',
    isFavorite: true
  },
  {
    id: '5',
    title: 'ASCII Art Archive',
    url: 'https://asciiart.eu',
    description: 'Koleksi ASCII art dengan seni piksel dari 70-an hingga 90-an.',
    icon: '🎨',
    category: 'Seni',
    isFavorite: false
  },
  {
    id: '6',
    title: 'Retro Software Archive',
    url: 'https://retrosoftwarearchive.com',
    description: 'Muat turun perisian retro untuk DOS, Windows 95, dan lain-lain.',
    icon: '📦',
    category: 'Perisian',
    isFavorite: false
  },
  {
    id: '7',
    title: 'Nokia Phone Museum',
    url: 'https://nokia-phone.com',
    description: 'Koleksi telefon mudah alih Nokia dari 1990-an hingga 2000-an.',
    icon: '📱',
    category: 'Telefon',
    isFavorite: true
  },
  {
    id: '8',
    title: 'Pixel Art Paradise',
    url: 'https://pixelartparadise.com',
    description: 'Galeri memelihara karya pixel art dari artist retro.',
    icon: '⭐',
    category: 'Seni',
    isFavorite: false
  },
  {
    id: '9',
    title: 'Game Boy Collection',
    url: 'https://gameboy-collection.com',
    description: 'Koleksi lengkap permainan Game Boy dengan maklumat dan statistik.',
    icon: '🎯',
    category: 'Permainan',
    isFavorite: true
  },
  {
    id: '10',
    title: 'Retro Web Design',
    url: 'https://retrowebdesign.com',
    description: 'Tutorial dan contoh reka bentuk laman web gaya 90-an.',
    icon: '🌐',
    category: 'Web',
    isFavorite: false
  }
];

export default function ResidentLinkCollection({
  links = DEFAULT_LINKS,
  onLinkClick,
  className
}: ResidentLinkCollectionProps) {
  const [isClient, setIsClient] = useState(false);
  const [sortBy, setSortBy] = useState<'favorites' | 'title' | 'category'>('favorites');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  useEffect(() => {
    setIsClient(true);
  }, []);

  const sortedLinks = [...links].sort((a, b) => {
    if (sortBy === 'favorites') {
      return (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0);
    }
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    if (sortBy === 'category') {
      return a.category.localeCompare(b.category);
    }
    return 0;
  });

  const filteredLinks = filterCategory === 'all'
    ? sortedLinks
    : sortedLinks.filter(link => link.category === filterCategory);

  const categories = ['all', ...Array.from(new Set(links.map(l => l.category)))];

  const handleLinkClick = (link: ResidentLink) => {
    if (onLinkClick) {
      onLinkClick(link);
    }
  };

  if (!isClient) {
    return (
      <div className={`resident-link-collection ${className || ''}`}>
        <div className="retro-card p-4 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className={`resident-link-collection ${className || ''}`}>
      {/* Start: Controls */}
      <div className="retro-card mb-4 p-3 border-2 border-dashed border-purple-400/30">
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="retro-input w-auto"
          >
            <option value="all">Semua Kategori</option>
            {categories.slice(1).map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="retro-input w-auto"
          >
            <option value="favorites">Urutkan: Kepalangan</option>
            <option value="title">Urutkan: Tajuk</option>
            <option value="category">Urutkan: Kategori</option>
          </select>
        </div>
      </div>
      {/* End: Controls */}

      {/* Start: Link Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredLinks.length === 0 ? (
          <div className="retro-card text-center py-8 col-span-full border-2 border-dashed border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400 pixel-font mb-4">
              Tiada pautan yang padu dengan penapis.
            </p>
          </div>
        ) : (
          filteredLinks.map(link => (
            <div
              key={link.id}
              onClick={() => handleLinkClick(link)}
              className="link-card cursor-pointer transform transition-all duration-300 hover:scale-102 hover:shadow-xl"
            >
              <div className={`
                retro-card border-2 ${link.isFavorite ? 'border-yellow-400 bg-yellow-50/30' : 'border-purple-400/20'}
                hover:border-cyan-400/50 transition-all duration-300
              `}>
                {/* Start: Card Header */}
                <div className="retro-card-header bg-gray-100/80 dark:bg-gray-800/80 px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{link.icon}</span>
                    <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 pixel-font break-words">
                      {link.title}
                    </h3>
                    {link.isFavorite && (
                      <span className="text-yellow-400">⭐</span>
                    )}
                  </div>
                  <span className="text-xs px-2 py-0.5 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded ml-auto">
                    {link.category}
                  </span>
                </div>
                {/* End: Card Header */}

                {/* Start: Card Content */}
                <div className="p-3">
                  <p className="text-xs text-gray-600 dark:text-gray-400 pixel-font mb-2 line-clamp-2">
                    {link.description}
                  </p>
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-mono break-all">
                    {link.url}
                  </div>
                </div>
                {/* End: Card Content */}

                {/* Start: Card Footer */}
                <div className="retro-card-footer bg-gray-50/80 dark:bg-gray-800/80 px-3 py-2 border-t border-gray-200 dark:border-gray-700">
                  <button className="retro-btn-secondary text-xs px-2 py-1">
                    🔗 Pautan
                  </button>
                </div>
                {/* End: Card Footer */}
              </div>
            </div>
          ))
        )}
      </div>
      {/* End: Link Grid */}

      {/* Start: Custom Styles */}
      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .link-card:hover {
          transform: scale(1.02);
        }
      `}</style>
      {/* End: Custom Styles */}
    </div>
  );
}