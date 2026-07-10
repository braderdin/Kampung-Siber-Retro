// Start: Interactive Background Component
"use client";

import { useState } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useRouter } from 'next/navigation';

export default function InteractiveBackground() {
  const { language } = useLanguageStore();
  const router = useRouter();
  
  // Mouse position state for potential interactive background effects
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMouseX(((e.clientX - rect.left) / rect.width) * 100);
    setMouseY(((e.clientY - rect.top) / rect.height) * 100);
  };

  const handleEnterWorkspace = () => {
    router.push('/signin');
  };

  return (
    <div 
      className="flex flex-col flex-1 items-center justify-center bg-gradient-to-br from-[#060814] to-[#0c102b] font-sans"
      onMouseMove={handleMouseMove}
    >
      <main className="flex flex-1 w-full max-w-4xl flex-col items-center justify-between py-8 px-4 sm:px-8">
        {/* Start: Cyber Marquee Message Ticker - Rigid Overflow Container */}
        <div className="marquee-rigid-container w-full text-center mb-8">
          <div className="marquee-content inline-block whitespace-nowrap animate-marquee text-white font-bold text-sm tracking-wider" style={{ textShadow: '0 0 5px #ff007f' }}>
            ✨ Selamat Datang ke Pusat Siber Komuniti Nusantara • Jumlah Teratak Digital Terkini: 1,240 buah • Pastakan kod HTML anda comel dan kreatif! ✨
          </div>
        </div>
        {/* End: Cyber Marquee Message Ticker */}

        <div className="text-center py-16">
          {/* Start: Cozy Traditional Malay House Emblem */}
          <div className="inline-block mb-6">
            <svg 
              className="w-20 h-20 cozy-house-emblem" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              style={{ filter: 'drop-shadow(0 0 10px #00ffff)' }}
            >
              {/* Pitched Roof with Gabled Design */}
              <path d="M4 18 L12 6 L20 18 Z" className="cozy-house-path"/>
              {/* Walls */}
              <rect x="6" y="18" width="12" height="8" className="cozy-house-path"/>
              {/* Window Frames - Traditional Malay Style */}
              <rect x="7" y="19" width="3" height="3" className="cozy-house-fill"/>
              <rect x="14" y="19" width="3" height="3" className="cozy-house-fill"/>
              {/* Pixel Door - Center Entry */}
              <rect x="10" y="20" width="4" height="4" className="cozy-house-fill"/>
              {/* Glowing Curved Ambient Webring Halo Paths */}
              <path d="M8 16 C10 14, 14 14, 16 16" className="webring-halo"/>
              <path d="M8 18 C10 16, 14 16, 16 18" className="webring-halo"/>
              <path d="M8 20 C10 18, 14 18, 16 20" className="webring-halo"/>
            </svg>
          </div>
          {/* End: Cozy Traditional Malay House Emblem */}

          <h1 className="text-5xl md:text-6xl font-bold text-white dark:text-gray-200 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-cyan-400 to-purple-600 uppercase tracking-wider" style={{ textShadow: '0 0 15px #ff007f' }}>
            KAMPUNG SIBER
          </h1>
          
          {/* Start: Bilingual Welcome Message */}
          <p className="text-xl text-gray-300 dark:text-gray-400 mb-10 max-w-2xl mx-auto" style={{ textShadow: '0 0 10px #00ffff' }}>
            {language === 'ms' 
              ? 'Ekosistem pembinaan teratak digital tanpa kekangan algoritma dan pengiklanan. Bina dan miliki laman web HTML & CSS tulen anda secara bebas selamanya! / An algorithmic-free and ad-free digital workspace ecosystem. Build and own your pure HTML & CSS websites freely forever!'
              : 'An algorithmic-free and ad-free digital workspace ecosystem. Build and own your pure HTML & CSS websites freely forever! / Ekosistem pembinaan teratak digital tanpa kekangan algoritma dan pengiklanan. Bina dan miliki laman web HTML & CSS tulen anda secara bebas selamanya!'}
          </p>
          {/* End: Bilingual Welcome Message */}
          
          {/* Start: Core Action Button */}
          <button
            onClick={handleEnterWorkspace}
            className="retro-btn-primary text-xl px-12 py-4 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 font-bold"
            style={{ 
              filter: 'drop-shadow(0 0 10px #ff007f)',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}
          >
            MASUK & LOG MASUK SEKARANG
          </button>
          {/* End: Core Action Button */}
        </div>
      </main>
    </div>
  );
}
// End: Interactive Background Component