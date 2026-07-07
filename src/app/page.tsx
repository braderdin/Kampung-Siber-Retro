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
    <div className="flex flex-col flex-1 items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 font-sans">
      <main className="flex flex-1 w-full max-w-4xl flex-col items-center justify-between py-8 px-4 sm:px-8">
        <div className="text-center py-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 dark:text-gray-200 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            {t.workspaceTitle}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
            {t.dashboardSubtitle}
          </p>
          <button
            onClick={handleEnterWorkspace}
            className="retro-btn-primary text-xl px-12 py-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            {t.assetsButton}
          </button>
        </div>
      </main>
    </div>
  );
}
