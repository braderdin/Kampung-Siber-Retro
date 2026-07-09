'use client';

import { useState } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { enDictionary, msDictionary } from '@/i18n/dictionaries';

interface MuseumExhibit {
  id: string;
  title: string;
  description: string;
  era: string;
  imagePlaceholder: string;
  artifacts: string[];
  year?: number;
  rarity: 'common' | 'rare' | 'legendary';
}

interface MuseumExhibitCardProps {
  exhibit: MuseumExhibit;
  onSelect: () => void;
}

export default function MuseumExhibitCard({ exhibit, onSelect }: MuseumExhibitCardProps) {
  const { language } = useLanguageStore();
  const [isHovered, setIsHovered] = useState(false);

  const getRarityColor = (rarity: string): string => {
    switch (rarity) {
      case 'legendary':
        return 'text-purple-400 bg-purple-900/30 border-purple-500';
      case 'rare':
        return 'text-blue-400 bg-blue-900/30 border-blue-500';
      case 'common':
        return 'text-green-400 bg-green-900/30 border-green-500';
      default:
        return 'text-gray-400 bg-gray-900/30 border-gray-500';
    }
  };

  const getRarityLabel = (rarity: string): string => {
    const labels: Record<string, string> = {
      legendary: language === 'ms' ? 'Legendaran' : 'Legendary',
      rare: language === 'ms' ? 'Langka' : 'Rare',
      common: language === 'ms' ? 'Biasa' : 'Common'
    };
    return labels[rarity] || rarity;
  };

  const getRarityBadge = (rarity: string): string => {
    const badges: Record<string, string> = {
      legendary: '★',
      rare: '★★',
      common: '★★★'
    };
    return badges[rarity] || '★★★';
  };

  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        retro-museum-card
        retro-window-client
        rounded-lg
        p-4
        cursor-pointer
        transition-all duration-200
        ${isHovered ? 'scale-105 shadow-xl' : 'shadow-md'}
        border-2
        ${getRarityColor(exhibit.rarity)}
      `}
    >
      {/* Start: Card Header */}
      <div className="flex items-start gap-3">
        {/* Artifact Icon */}
        <div className="text-4xl flex-shrink-0">
          {exhibit.imagePlaceholder}
        </div>

        {/* Title and Rarity */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 pixel-font break-words">
              {exhibit.title}
            </h3>
            <span 
              className={`
                text-xs px-2 py-1 rounded pixel-font font-bold
                ${getRarityColor(exhibit.rarity)}
              `}
            >
              {getRarityLabel(exhibit.rarity)}
            </span>
          </div>

          {/* Era and Year */}
          <div className="text-xs text-gray-500 dark:text-gray-400 pixel-font">
            <span className="font-medium">{exhibit.era}</span>
            {exhibit.year && (
              <span className="ml-1">•</span>
            )}
            {exhibit.year && (
              <span className="ml-1">{exhibit.year}</span>
            )}
          </div>
        </div>
      </div>
      {/* End: Card Header */}

      {/* Start: Description */}
      <p className="mt-3 text-xs text-gray-600 dark:text-gray-400 pixel-font leading-relaxed break-words">
        {exhibit.description}
      </p>
      {/* End: Description */}

      {/* Start: Artifacts List */}
      <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400 uppercase pixel-font mb-1">
          {language === 'ms' ? 'Artefak' : 'Artifacts'}
        </div>
        <div className="flex flex-wrap gap-1">
          {exhibit.artifacts.slice(0, 3).map((artifact, index) => (
            <span
              key={index}
              className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded pixel-font"
            >
              {artifact}
            </span>
          ))}
          {exhibit.artifacts.length > 3 && (
            <span className="text-xs text-gray-500 dark:text-gray-400 pixel-font">
              +{exhibit.artifacts.length - 3} {language === 'ms' ? 'lagi' : 'more'}
            </span>
          )}
        </div>
      </div>
      {/* End: Artifacts List */}

      {/* Start: Action Button */}
      <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          className="retro-btn-secondary text-xs w-full py-1 pixel-font"
        >
          {language === 'ms' ? 'Lihat Detail' : 'View Details'}
        </button>
      </div>
      {/* End: Action Button */}

      {/* Start: Hover Effect Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        
        .retro-museum-card:hover {
          animation: float 2s ease-in-out infinite;
        }
      `}</style>
      {/* End: Hover Effect Styles */}
    </div>
  );
}