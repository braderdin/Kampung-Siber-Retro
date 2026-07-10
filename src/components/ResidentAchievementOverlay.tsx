"use client";

import { useState, useEffect, useCallback } from 'react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  date: string;
  level?: 'bronze' | 'silver' | 'gold' | 'platinum';
}

interface ResidentAchievementOverlayProps {
  achievement?: Achievement;
  isVisible: boolean;
  onClose: () => void;
}

export default function ResidentAchievementOverlay({
  achievement,
  isVisible,
  onClose
}: ResidentAchievementOverlayProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isVisible && achievement) {
      setIsAnimating(true);
      
      // Position in top-right corner
      setPosition({ x: '80%', y: 20 });
      
      // Auto-close after 5 seconds
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setTimeout(onClose, 500);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, achievement, onClose]);

  const getLevelColor = useCallback((level?: string) => {
    switch (level) {
      case 'bronze': return 'bg-amber-600 border-amber-400';
      case 'silver': return 'bg-gray-300 border-gray-400';
      case 'gold': return 'bg-yellow-500 border-yellow-400';
      case 'platinum': return 'bg-purple-600 border-purple-400';
      default: return 'bg-cyan-500 border-cyan-400';
    }
  }, []);

  const getLevelEmoji = useCallback((level?: string) => {
    switch (level) {
      case 'bronze': return '🥉';
      case 'silver': return '🥈';
      case 'gold': return '🥇';
      case 'platinum': return '💎';
      default: return '🏆';
    }
  }, []);

  if (!isVisible || !achievement) {
    return null;
  }

  return (
    <div 
      className="fixed z-50 pointer-events-none"
      style={{ 
        top: `${position.y}px`,
        left: typeof position.x === 'string' ? position.x : `${position.x}px`
      }}
    >
      <div 
        className={`
          retro-badge transform transition-all duration-500
          ${isAnimating ? 'scale-100 opacity-100 translate-y-0' : 'scale-0.5 opacity-0 -translate-y-4'}
          ${getLevelColor(achievement.level)}
        `}
      >
        <div className="flex items-start gap-2">
          <span className="text-2xl">{getLevelEmoji(achievement.level)}</span>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-white pixel-font">
              {achievement.title}
            </h3>
            <p className="text-xs text-white/90 pixel-font mt-1">
              {achievement.description}
            </p>
            <p className="text-xs text-white/70 pixel-font mt-1">
              {new Date(achievement.date).toLocaleDateString('ms-MY')}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="absolute top-1 right-1 retro-btn-secondary text-xs px-1 py-1 opacity-70 hover:opacity-100"
        >
          ✕
        </button>
      </div>

      {/* Start: Sparkle Effect */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute -top-2 -right-2 w-3 h-3 bg-white rounded-full animate-pulse opacity-50" />
        <div className="absolute -bottom-1 -left-2 w-2 h-2 bg-white rounded-full animate-pulse opacity-50" />
        <div className="absolute top-1/2 -left-2 w-2 h-2 bg-white rounded-full animate-pulse opacity-50" />
      </div>
      {/* End: Sparkle Effect */}

      {/* Start: Custom Styles */}
      <style jsx>{`
        .retro-badge {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: 2px solid;
          border-radius: 0.5rem;
          padding: 12px 16px;
          position: relative;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          backdrop-filter: blur(4px);
        }
      `}</style>
      {/* End: Custom Styles */}
    </div>
  );
}