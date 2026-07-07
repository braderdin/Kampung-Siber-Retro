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

  const handleEnterWorkspace = () => {
    router.push('/site_files');
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-gradient-to-br from-[#060814] to-[#0c102b] font-sans">
      <main className="flex flex-1 w-full max-w-4xl flex-col items-center justify-between py-8 px-4 sm:px-8">
        {/* Start: Purple Marquee Message Ticker */}
        <div className="w-full text-center mb-8">
          <div className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 rounded-full text-white font-bold text-sm tracking-wider animate-pulse">
            SELAMAT DATANG KE KAMPUNG SIBER NUSANTARA - TEMPAT KITA BERKAITAN DENGAN TEKNOLOGI MALAYSIA
          </div>
        </div>
        {/* End: Purple Marquee Message Ticker */}

        <div className="text-center py-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white dark:text-gray-200 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-cyan-400 to-purple-600 uppercase tracking-wider">
            KAMPUNG SIBER
          </h1>
          <p className="text-xl text-gray-300 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
            {t.dashboardSubtitle}
          </p>
          <button
            onClick={handleEnterWorkspace}
            className="retro-btn-primary text-xl px-12 py-4 rounded-full shadow-2xl hover:shadow-cyan-500/50 transform hover:scale-105 transition-all duration-300 font-bold"
          >
            MASUK & PACAK TERATAK SEKARANG
          </button>
        </div>
      </main>
    </div>
  );
}
