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
        {/* Start: Purple Marquee Message Ticker */}
        <div className="w-full text-center mb-8 overflow-hidden">
          <div className="inline-block whitespace-nowrap animate-marquee text-white font-bold text-sm tracking-wider">
            ✨ Selamat Datang ke Pusat Siber Komuniti Nusantara • Jumlah Teratak Digital Terkini: 1,240 buah • Pastikan kod HTML anda comel dan kreatif! ✨
          </div>
        </div>
        {/* End: Purple Marquee Message Ticker */}

        {/* Start: Cyber Neon Glow Effects */}
        <style jsx>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-100%); }
          }
          .animate-marquee {
            animation: marquee 20s linear infinite;
          }
        `}</style>
        {/* End: Cyber Neon Glow Effects */}

        <div className="text-center py-16">
          {/* Start: Digital Teratak House Emblem */}
          <div className="inline-block mb-6">
            <svg 
              className="w-20 h-20 text-cyan-400 drop-shadow-[0_0_10px_#00ffff]" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h5a2 2 0 0 1 2 2z" />
              <line x1="12" y1="11" x2="12" y2="17" />
              <line x1="10" y1="15" x2="14" y2="15" />
            </svg>
          </div>
          {/* End: Digital Teratak House Emblem */}

          <h1 className="text-5xl md:text-6xl font-bold text-white dark:text-gray-200 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-cyan-400 to-purple-600 uppercase tracking-wider drop-shadow-[0_0_15px_#ff007f]">
            KAMPUNG SIBER
          </h1>
          
          {/* Start: Bilingual Welcome Message */}
          <p className="text-xl text-gray-300 dark:text-gray-400 mb-10 max-w-2xl mx-auto drop-shadow-[0_0_10px_#00ffff]">
            {t.dashboardSubtitle}
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
