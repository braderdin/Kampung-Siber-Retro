"use client";

import { useState, useEffect } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { enDictionary, msDictionary } from '@/i18n/dictionaries';
import ResidentLinkCollection from '@/components/ResidentLinkCollection';
import PixelCursorEffect from '@/components/PixelCursorEffect';
import HydrationGuard from '@/components/HydrationGuard';

interface ResidentLink {
  id: string;
  title: string;
  url: string;
  description: string;
  icon: string;
  category: string;
  isFavorite?: boolean;
}

interface LinksPageProps {
  params: { username: string };
}

const DEFAULT_LINKS: ResidentLink[] = [
  {
    id: '1',
    title: 'My Retro Homepage',
    url: 'https://myretro.example.com',
    description: 'Laman web pribadi dengan gaya 90-an dan seni pixel.',
    icon: '🌐',
    category: 'Web',
    isFavorite: true
  },
  {
    id: '2',
    title: 'Pixel Art Gallery',
    url: 'https://pixelgallery.example.net',
    description: 'Galeri seni pixel dengan karya dari komuniti kami.',
    icon: '🎨',
    category: 'Seni',
    isFavorite: true
  },
  {
    id: '3',
    title: 'Game Boy Collection',
    url: 'https://gameboy.example.org',
    description: 'Koleksi lengkap permainan Game Boy dari 1989.',
    icon: '🎮',
    category: 'Permainan',
    isFavorite: false
  },
  {
    id: '4',
    title: 'Retro Software Archive',
    url: 'https://retrosoft.example.com',
    description: 'Muat turun perisian DOS dan Windows klasik.',
    icon: '📦',
    category: 'Perisian',
    isFavorite: false
  }
];

export default function LinksPage({ params }: LinksPageProps) {
  const { username } = params;
  const { language } = useLanguageStore();
  const t = language === 'ms' ? msDictionary : enDictionary;
  const [isClient, setIsClient] = useState(false);
  const [links, setLinks] = useState<ResidentLink[]>([]);

  useEffect(() => {
    setIsClient(true);
    
    // Load links from localStorage or use defaults
    const storedLinks = localStorage.getItem(`links_${username}`);
    if (storedLinks) {
      setLinks(JSON.parse(storedLinks));
    } else {
      setLinks(DEFAULT_LINKS);
    }
  }, [username]);

  const handleLinkClick = (link: ResidentLink) => {
    console.log('Link clicked:', link.title);
    window.open(link.url, '_blank');
  };

  const handleAddLink = () => {
    const newLink: ResidentLink = {
      id: Date.now().toString(),
      title: 'New Link',
      url: 'https://example.com',
      description: 'Deskripsi pautan baru',
      icon: '🔗',
      category: 'Web',
      isFavorite: false
    };
    const updatedLinks = [newLink, ...links];
    setLinks(updatedLinks);
    localStorage.setItem(`links_${username}`, JSON.stringify(updatedLinks));
  };

  if (!isClient) {
    return (
      <main className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300 pt-16">
      <PixelCursorEffect />

      {/* Start: Header Section */}
      <div className="sticky top-16 z-40 bg-gradient-to-r from-cyan-900/80 to-blue-900/80 backdrop-blur-md border-b-2 border-dashed border-pink-500/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold text-pink-400 pixel-font flex items-center gap-3">
            <span className="text-4xl">🔗</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-cyan-300">
              Jaringan Kawan {username}
            </span>
          </h1>
          <p className="text-sm text-gray-300 dark:text-gray-400 mt-1 pixel-font border-l-2 border-dashed border-pink-400/50 pl-3">
            Laman web kegemaran dan rakan - temui dunia retro bersama!
          </p>
        </div>
      </div>
      {/* End: Header Section */}

      {/* Start: Links Collection */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 pixel-font flex items-center gap-2">
            <span className="text-2xl">🌐</span>
            <span>Webring Directory</span>
          </h2>
          <button
            onClick={handleAddLink}
            className="retro-btn-primary text-xs px-3 py-1"
          >
            ➕ Tambah Pautan
          </button>
        </div>

        <HydrationGuard>
          <ResidentLinkCollection
            links={links}
            onLinkClick={handleLinkClick}
          />
        </HydrationGuard>
      </div>
      {/* End: Links Collection */}

      {/* Start: Webring Footer */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="retro-card border-2 border-dashed border-cyan-400/30">
          <div className="retro-card-header bg-gray-200 dark:bg-gray-700 px-4 py-2 border-b-2 border-dashed border-gray-300 dark:border-gray-600">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 pixel-font flex items-center gap-2">
              <span className="text-xl">⛓️</span>
              <span>Webring Navigation</span>
            </h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-3 gap-3 text-center">
              <button className="retro-btn-secondary text-xs px-2 py-1">
                ⬅️ Ring Chain
              </button>
              <button className="retro-btn-primary text-xs px-2 py-1">
                🏠 Kumpulan
              </button>
              <button className="retro-btn-secondary text-xs px-2 py-1">
                ➡️ Next Site
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* End: Webring Footer */}
    </main>
  );
}