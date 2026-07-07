"use client";

import { useState } from 'react';
import { useLanguageStore } from "@/store/useLanguageStore";
import { enDictionary, msDictionary } from "@/i18n/dictionaries";
import { useRouter } from 'next/navigation';

export default function Home() {
  const { language } = useLanguageStore();
  const router = useRouter();
  
  const t = language === 'ms' ? msDictionary : enDictionary;
  
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMouseX(((e.clientX - rect.left) / rect.width) * 100);
    setMouseY(((e.clientY - rect.top) / rect.height) * 100);
  };

  // Start: Navigation Handler
  const handleEnterWorkspace = () => {
    router.push('/signin');
  };
  // End: Navigation Handler

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-gradient-to-br from-[#060814] to-[#0c102b] font-sans">
      <main className="flex flex-1 w-full max-w-4xl flex-col items-center justify-between py-8 px-4 sm:px-8">
        {/* Start: Cyber Marquee Message Ticker */}
        <div className="w-full text-center mb-8 overflow-hidden">
          <div className="inline-block whitespace-nowrap animate-marquee text-white font-bold text-sm tracking-wider drop-shadow-[0_0_5px_#ff007f]">
            ✨ Selamat Datang ke Pusat Siber Komuniti Nusantara • Jumlah Teratak Digital Terkini: 1,240 buah • Pastikan kod HTML anda comel dan kreatif! ✨
          </div>
        </div>
        {/* End: Cyber Marquee Message Ticker */}

        <div className="text-center py-16">
          {/* Start: Cyber Teratak Emblem */}
          <div className="inline-block mb-6">
            <svg 
              className="w-20 h-20 cyber-emblem drop-shadow-[0_0_10px_#00ffff]" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              {/* Traditional Malay Teratak House - Roof */}
              <path d="M4 18 L12 6 L20 18 Z" fill="none" stroke="#00ffff"/>
              {/* Walls */}
              <rect x="6" y="18" width="12" height="8" fill="none" stroke="#00ffff"/>
              {/* Center Pixel Door */}
              <rect x="10" y="20" width="4" height="4" fill="#ff007f" stroke="#00ffff" strokeWidth="0.5"/>
              {/* Soft Glowing Digital Webring Arcs */}
              <path d="M8 16 C10 14, 14 14, 16 16" fill="none" stroke="rgba(0,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M8 18 C10 16, 14 16, 16 18" fill="none" stroke="rgba(0,255,255,0.2)" strokeWidth="1" strokeLinecap="round"/>
              <path d="M8 20 C10 18, 14 18, 16 20" fill="none" stroke="rgba(0,255,255,0.1)" strokeWidth="0.5" strokeLinecap="round"/>
            </svg>
          </div>
          {/* End: Cyber Teratak Emblem */}

          <h1 className="text-5xl md:text-6xl font-bold text-white dark:text-gray-200 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-cyan-400 to-purple-600 uppercase tracking-wider drop-shadow-[0_0_15px_#ff007f]">
            KAMPUNG SIBER
          </h1>
          
          {/* Start: Bilingual Welcome Message */}
          <p className="text-xl text-gray-300 dark:text-gray-400 mb-10 max-w-2xl mx-auto drop-shadow-[0_0_10px_#00ffff]">
            {language === 'ms' 
              ? 'Ekosistem pembinaan teratak digital tanpa kekangan algoritma dan pengiklanan. Bina dan miliki laman web HTML & CSS tulunya secara bebas selamanya!'
              : 'An algorithmic-free and ad-free digital workspace ecosystem. Build and own your pure HTML & CSS websites freely forever!'}
          </p>
          {/* End: Bilingual Welcome Message */}
          
          {/* Start: Core Action Button */}
          <button
            onClick={handleEnterWorkspace}
            className="retro-btn-primary text-xl px-12 py-4 rounded-full shadow-2xl hover:shadow-cyan-500/50 transform hover:scale-105 transition-all duration-300 font-bold drop-shadow-[0_0_10px_#ff007f]"
          >
            MASUK & LOG MASUK SEKARANG
          </button>
          {/* End: Core Action Button */}
        </div>
      </main>
    </div>
  );
}
