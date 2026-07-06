// Start: Imports
import React from 'react';
// End: Imports

// Start: Type Definitions
interface ModernRetroCardProps {
  title: string;
  description: string;
  icon?: string;
  href?: string;
  onClick?: () => void;
  className?: string;
  badge?: string;
}
// End: Type Definitions

// Start: ModernRetroCard Component
export default function ModernRetroCard({
  title,
  description,
  icon = '📄',
  href,
  onClick,
  className = '',
  badge,
}: ModernRetroCardProps) {
  // Start: Handle Click
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      window.location.href = href;
    }
  };
  // End: Handle Click

  // Start: Render Card
  return (
    <div
      onClick={handleClick}
      className={`retro-card group cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-xl ${className}`}
    >
      <div className="retro-card-header bg-gray-100 dark:bg-gray-800 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-t">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl group-hover:scale-110 transition-transform">{icon}</span>
            <h3 className="font-bold text-sm text-gray-800 dark:text-gray-200 font-mono">
              {title}
            </h3>
          </div>
          {badge && (
            <span className="retro-badge text-xs font-mono">
              {badge}
            </span>
          )}
        </div>
      </div>
      <div className="retro-card-body px-4 py-3 bg-white dark:bg-gray-900 border-x-2 border-gray-300 dark:border-gray-600">
        <p className="text-xs text-gray-600 dark:text-gray-300 font-mono leading-relaxed">
          {description}
        </p>
      </div>
      <div className="retro-card-footer px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b-2 border-gray-300 dark:border-gray-600 rounded-b">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
            Klik untuk lihat
          </span>
          <span className="text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            →
          </span>
        </div>
      </div>
    </div>
  );
}
// End: ModernRetroCard Component
