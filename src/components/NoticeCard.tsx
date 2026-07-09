'use client';

import { useState } from 'react';

interface NoticeCardProps {
  title: string;
  content: string;
  author?: string;
  timestamp?: string;
  priority?: 'high' | 'normal' | 'low';
  className?: string;
}

export default function NoticeCard({ 
  title, 
  content, 
  author = 'Penduduk',
  timestamp,
  priority = 'normal',
  className
}: NoticeCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const getPriorityStyles = () => {
    switch (priority) {
      case 'high':
        return {
          border: 'border-red-400',
          bg: 'bg-red-50 dark:bg-red-900/20',
          accent: 'text-red-600 dark:text-red-400',
          shadow: 'shadow-red-200 dark:shadow-red-900/30'
        };
      case 'normal':
        return {
          border: 'border-blue-400',
          bg: 'bg-blue-50 dark:bg-blue-900/20',
          accent: 'text-blue-600 dark:text-blue-400',
          shadow: 'shadow-blue-200 dark:shadow-blue-900/30'
        };
      case 'low':
        return {
          border: 'border-green-400',
          bg: 'bg-green-50 dark:bg-green-900/20',
          accent: 'text-green-600 dark:text-green-400',
          shadow: 'shadow-green-200 dark:shadow-green-900/30'
        };
      default:
        return {
          border: 'border-gray-400',
          bg: 'bg-gray-50 dark:bg-gray-900/20',
          accent: 'text-gray-600 dark:text-gray-400',
          shadow: 'shadow-gray-200 dark:shadow-gray-900/30'
        };
    }
  };

  const priorityStyles = getPriorityStyles();

  return (
    <div
      className={`
        notice-card
        ${priorityStyles.border}
        ${priorityStyles.bg}
        ${priorityStyles.shadow}
        rounded-lg
        p-4
        cursor-pointer
        transition-all duration-200
        ${isHovered ? 'scale-105 rotate-1' : ''}
        ${isPressed ? 'scale-95' : ''}
        ${className || ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      style={{
        transformStyle: 'preserve-3d',
        willChange: 'transform'
      }}
    >
      {/* Start: Header */}
      <div className="flex justify-between items-start mb-2">
        <h3 className={`text-lg font-semibold pixel-font ${priorityStyles.accent}`}>
          {title}
        </h3>
        {priority === 'high' && (
          <span className="text-xs font-bold uppercase pixel-font bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 px-2 py-1 rounded">
            PENTING
          </span>
        )}
      </div>
      {/* End: Header */}

      {/* Start: Content */}
      <div className="mb-3">
        <p className="text-sm text-gray-700 dark:text-gray-300 pixel-font leading-relaxed break-words">
          {content}
        </p>
      </div>
      {/* End: Content */}

      {/* Start: Footer */}
      <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 pixel-font">
        <span>Oleh: {author}</span>
        {timestamp && (
          <span>{new Date(timestamp).toLocaleDateString('ms-MY')}</span>
        )}
      </div>
      {/* End: Footer */}

      {/* Start: Shake Animation Keyframes */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          25% { transform: translateX(-2px) rotate(-2deg); }
          75% { transform: translateX(2px) rotate(2deg); }
        }
        
        .notice-card:hover {
          animation: shake 0.5s ease-in-out;
        }
        
        @media (hover: none) and (pointer: coarse) {
          .notice-card:hover {
            animation: none;
          }
          
          .notice-card:active {
            animation: shake 0.3s ease-in-out;
          }
        }
      `}</style>
      {/* End: Shake Animation Keyframes */}
    </div>
  );
}