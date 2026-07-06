// Start: Imports
import { useState } from 'react';
// End: Imports

// Start: Type Definitions
interface WebringSite {
  id: number;
  name: string;
  url: string;
  description: string;
}

interface WebringFooterProps {
  className?: string;
}
// End: Type Definitions

// Start: WebringFooter
export default function WebringFooter({ className }: WebringFooterProps) {
  // Start: State Management
  const [currentSiteIndex, setCurrentSiteIndex] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);
  // End: State Management

  // Start: Mock Webring Sites
  const webringSites: WebringSite[] = [
    {
      id: 1,
      name: 'Retro Code Haven',
      url: 'https://retrocode.example',
      description: 'A haven for retro coding enthusiasts',
    },
    {
      id: 2,
      name: 'Pixel Paradise',
      url: 'https://pixelparadise.example',
      description: 'Where pixels meet purpose',
    },
    {
      id: 3,
      name: 'Neon Nexus',
      url: 'https://neonnexus.example',
      description: 'Connect the neon dots',
    },
    {
      id: 4,
      name: 'Byte Bazaar',
      url: 'https://bytebazaar.example',
      description: 'Trading bytes since forever',
    },
    {
      id: 5,
      name: 'Glitch Garden',
      url: 'https://glitchgarden.example',
      description: 'Cultivating digital anomalies',
    },
  ];
  // End: Mock Webring Sites

  // Start: Navigation Handlers
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
  // End: Navigation Handlers

  // Start: Current Site
  const currentSite = webringSites[currentSiteIndex];
  // End: Current Site

  // Start: Handle Site Click
  const handleSiteClick = (url: string) => {
    if (url.startsWith('https://') || url.startsWith('http://')) {
      window.open(url, '_blank');
    }
  };
  // End: Handle Site Click

  // Start: Render Webring Footer
  return (
    <div className={`retro-webring-footer ${className || ''}`}>
      {/* Start: Footer Container */}
      <div className="retro-footer-grid">
        {/* Start: Navigation Buttons */}
        <div className="retro-nav-buttons flex flex-col sm:flex-row gap-2">
          <button
            onClick={navigateToPrevious}
            disabled={isNavigating}
            className="retro-btn-secondary text-xs px-3 py-1"
          >
            ⏪ Previous Site
          </button>
          
          <button
            onClick={navigateToRandom}
            disabled={isNavigating}
            className="retro-btn-secondary text-xs px-3 py-1"
          >
            🎲 Random Site
          </button>
          
          <button
            onClick={navigateToNext}
            disabled={isNavigating}
            className="retro-btn-secondary text-xs px-3 py-1"
          >
            Next Site ⏩
          </button>
        </div>
        {/* End: Navigation Buttons */}

        {/* Start: Current Site Info */}
        <div className="retro-site-info text-center sm:text-right">
          <div className="font-mono text-sm text-gray-700 dark:text-gray-300">
            <span className="text-gray-500 dark:text-gray-400">Current: </span>
            <span className="font-bold text-blue-600 dark:text-blue-400">
              {currentSite.name}
            </span>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {currentSite.description}
          </div>
        </div>
        {/* End: Current Site Info */}

        {/* Start: Site List */}
        <div className="retro-site-list hidden sm:block">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Webring Sites:
          </div>
          <ul className="space-y-1">
            {webringSites.map((site, index) => (
              <li
                key={site.id}
                onClick={() => handleSiteClick(site.url)}
                className={`text-xs cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${
                  index === currentSiteIndex 
                    ? 'font-bold text-blue-600 dark:text-blue-400' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {site.name}
              </li>
            ))}
          </ul>
        </div>
        {/* End: Site List */}
      </div>
      {/* End: Footer Container */}

      {/* Start: Footer Bar */}
      <div className="retro-footer-bar mt-2 pt-2 border-t border-gray-300 dark:border-gray-600 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
        <span>
          {isNavigating ? '🔄 Navigating...' : '🕹️ Navigate the webring'}
        </span>
        <span>
          Site {currentSiteIndex + 1} of {webringSites.length}
        </span>
      </div>
      {/* End: Footer Bar */}
    </div>
  );
}
