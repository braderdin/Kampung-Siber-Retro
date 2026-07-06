// Start: Imports
"use client";

import { useLanguageStore } from '@/store/useLanguageStore';
import { enDictionary, msDictionary } from '@/i18n/dictionaries';
// End: Imports

// Start: Type Definitions
interface FeaturedSite {
  id: number;
  name: string;
  description: string;
  url: string;
  tags: string[];
  visitors: number;
}

interface FeaturedSitesGridProps {
  className?: string;
}
// End: Type Definitions

// Start: FeaturedSitesGrid Component
export default function FeaturedSitesGrid({ className }: FeaturedSitesGridProps) {
  const { language } = useLanguageStore();
  const t = language === 'ms' ? msDictionary : enDictionary;

  // Start: Featured Sites Data
  const featuredSites: FeaturedSite[] = [
    {
      id: 1,
      name: 'Retro Paradise',
      description: 'A nostalgic journey through retro computing',
      url: 'https://retroparadise.example',
      tags: ['retro', 'nostalgia', 'computing'],
      visitors: 12500,
    },
    {
      id: 2,
      name: 'Pixel Palace',
      description: 'Where pixels come to life',
      url: 'https://pixelpalace.example',
      tags: ['pixel', 'art', 'design'],
      visitors: 8750,
    },
    {
      id: 3,
      name: 'Code Haven',
      description: 'A sanctuary for developers',
      url: 'https://codehaven.example',
      tags: ['coding', 'development', 'community'],
      visitors: 15300,
    },
    {
      id: 4,
      name: 'Digital Garden',
      description: 'Grow your digital presence',
      url: 'https://digitalgarden.example',
      tags: ['digital', 'growth', 'presence'],
      visitors: 6420,
    },
  ];
  // End: Featured Sites Data

  // Start: Render FeaturedSitesGrid
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 ${className || ''}`}>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
        {t.dashboardTitle}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {featuredSites.map((site) => (
          <div
            key={site.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
              {site.name}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {site.description}
            </p>
            <div className="flex flex-wrap gap-1 mb-2">
              {site.tags.map((tag, index) => (
                <span
                  key={index}
                  className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {language === 'ms' ? 'Pelawat' : 'Visitors'}: {site.visitors}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
// End: FeaturedSitesGrid Component
