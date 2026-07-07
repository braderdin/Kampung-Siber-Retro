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
      className={`group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${className}`}
    >
      <div className="relative overflow-hidden rounded-lg border-2 border-cyan-400/30 dark:border-pink-400/30">
        {/* Start: Card Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0e1330] to-[#121b4a] opacity-90 dark:from-[#0e1330] dark:to-[#121b4a]"></div>
        {/* End: Card Background Gradient */}
        
        <div className="relative retro-card-header px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl group-hover:scale-110 transition-transform">{icon}</span>
              <h3 className="font-bold text-sm text-white font-mono tracking-wider">
                {title}
              </h3>
            </div>
            {badge && (
              <span className="retro-badge text-xs font-mono text-pink-400 bg-pink-500/20 px-2 py-1 rounded">
                {badge}
              </span>
            )}
          </div>
        </div>
        <div className="relative retro-card-body px-4 py-3">
          <p className="text-xs text-cyan-200 dark:text-cyan-300 font-mono leading-relaxed">
            {description}
          </p>
        </div>
        <div className="relative retro-card-footer px-4 py-2 bg-black/20 border-t border-cyan-400/20 dark:border-pink-400/20 rounded-b">
          <div className="flex items-center justify-between">
            <span className="text-xs text-cyan-300 font-mono">
              Klik untuk lihat
            </span>
            <span className="text-cyan-400 group-hover:text-pink-400 transition-colors">
              →
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
// End: ModernRetroCard Component
