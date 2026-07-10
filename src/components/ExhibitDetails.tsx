"use client";

import { useState, useEffect } from 'react';

interface ExhibitDetailsProps {
  artifact: {
    id: string;
    title: string;
    era: string;
    description: string;
    imagePlaceholder: string;
    codeSnippet: string;
    historicalSignificance: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ExhibitDetails({ artifact, isOpen, onClose }: ExhibitDetailsProps) {
  const [showCode, setShowCode] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !artifact) {
    return null;
  }

  const getEraColor = (era: string): string => {
    if (era.includes('1980')) return 'from-orange-500 to-amber-600';
    if (era.includes('1990')) return 'from-purple-500 to-pink-600';
    if (era.includes('1995')) return 'from-blue-500 to-cyan-600';
    if (era.includes('2000')) return 'from-green-500 to-emerald-600';
    return 'from-gray-500 to-slate-600';
  };

  const getEraBadgeColor = (era: string): string => {
    if (era.includes('1980')) return 'bg-orange-500';
    if (era.includes('1990')) return 'bg-purple-500';
    if (era.includes('1995')) return 'bg-blue-500';
    if (era.includes('2000')) return 'bg-green-500';
    return 'bg-gray-500';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Start: Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-all duration-300"
        onClick={onClose}
      />
      {/* End: Backdrop */}

      {/* Start: Modal Content */}
      <div 
        className={`
          relative retro-card w-full max-w-2xl mx-auto
          transform transition-all duration-300 ease-out
          ${isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Start: 90s Style Header */}
        <div className={`
          retro-card-header 
          bg-gradient-to-r ${getEraColor(artifact.era)} 
          text-white px-4 py-3 border-b-2 border-dashed border-white/30
        `}>
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold pixel-font flex items-center gap-2">
              <span className="text-2xl">{artifact.imagePlaceholder}</span>
              <span className="break-words">{artifact.title}</span>
            </h2>
            <span className={`text-xs px-2 py-1 rounded ${getEraBadgeColor(artifact.era)}`}>
              {artifact.era}
            </span>
          </div>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => setShowCode(!showCode)}
              className="retro-btn-secondary text-xs px-3 py-1 bg-white/20 hover:bg-white/30"
            >
              {showCode ? '🔒 Tutup Kod' : '👁️ Lihat Kod'}
            </button>
            <button
              onClick={onClose}
              className="retro-btn-secondary text-xs px-3 py-1 bg-white/20 hover:bg-white/30"
            >
              ✕ Tutup
            </button>
          </div>
        </div>
        {/* End: 90s Style Header */}

        {/* Start: Modal Body */}
        <div className="p-4 max-h-96 overflow-y-auto">
          {/* Start: Description Section */}
          <div className="mb-4">
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 pixel-font mb-2 flex items-center gap-2">
              <span className="text-blue-400">📋</span>
              Perihak
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 pixel-font leading-relaxed border-l-2 border-dashed border-cyan-400 pl-3">
              {artifact.description}
            </p>
          </div>
          {/* End: Description Section */}

          {/* Start: Historical Significance Section */}
          <div className="mb-4">
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 pixel-font mb-2 flex items-center gap-2">
              <span className="text-purple-400">⏳</span>
              Kesan Sejarah
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 pixel-font leading-relaxed bg-gray-50 dark:bg-gray-800 p-3 rounded border border-dashed border-gray-200 dark:border-gray-700">
              {artifact.historicalSignificance}
            </p>
          </div>
          {/* End: Historical Significance Section */}

          {/* Start: Code Snippet Section */}
          {showCode && (
            <div className="retro-details border-t-2 border-dashed border-gray-200 dark:border-gray-700 pt-4">
              <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 pixel-font mb-2 flex items-center gap-2">
                <span className="text-green-400">💻</span>
                Kod Contoh
              </h3>
              <div className="bg-gray-100 dark:bg-gray-800 rounded p-3 border-2 border-dashed border-gray-300 dark:border-gray-600">
                <pre className="whitespace-pre-wrap break-all text-xs font-mono text-gray-800 dark:text-gray-200 pixel-font">
                  {artifact.codeSnippet}
                </pre>
              </div>
            </div>
          )}
          {/* End: Code Snippet Section */}
        </div>
        {/* End: Modal Body */}

        {/* Start: 90s Style Footer */}
        <div className="retro-card-footer bg-gray-100 dark:bg-gray-800 px-4 py-2 border-t-2 border-dashed border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div className="flex gap-2">
            <button className="retro-btn-secondary text-xs px-2 py-1">
              📋 Salin
            </button>
            <button className="retro-btn-secondary text-xs px-2 py-1">
              ⭐ Tagih
            </button>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400 pixel-font">
            Museum Khazanah Siber
          </span>
        </div>
        {/* End: 90s Style Footer */}
      </div>
      {/* End: Modal Content */}

      {/* Start: Custom Styles for 90s Glow */}
      <style jsx>{`
        .retro-card-header {
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
          background-image: linear-gradient(to right, rgba(255, 255, 255, 0.1), transparent);
        }
        
        .retro-card-footer {
          box-shadow: inset 0 -2px 4px rgba(0, 0, 0, 0.2);
          background-image: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.1));
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
      {/* End: Custom Styles */}
    </div>
  );
}