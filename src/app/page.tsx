"use client";

import { useState } from 'react';
import { useEditorStore } from "@/store/useEditorStore";
import { useLanguageStore } from "@/store/useLanguageStore";
import { enDictionary, msDictionary } from "@/i18n/dictionaries";
import CodeMirrorEditor from "@/components/CodeMirrorEditor";
import SandboxedPreview from "@/components/SandboxedPreview";
import RetroToolbar from "@/components/RetroToolbar";
import AssetManagerModal from "@/components/AssetManagerModal";
import GuestbookComponent from "@/components/GuestbookComponent";
import LiveActivityFeed from "@/components/LiveActivityFeed";
import WebringFooter from "@/components/WebringFooter";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Home() {
  const { activeTab, themeMode, setActiveTab, setThemeMode, resetToDefaults } = useEditorStore();
  const { language } = useLanguageStore();
  
  const t = language === 'ms' ? msDictionary : enDictionary;
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const crtThemeClasses = themeMode === 'crt' 
    ? 'crt-scanline-filter' 
    : '';

  return (
    <div className={`flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans ${crtThemeClasses}`}>
      <main className="flex flex-1 w-full max-w-6xl flex-col items-center justify-between py-8 px-4 sm:px-8">
        <div className="flex items-center justify-between w-full mb-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            {t.workspaceTitle}
          </h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="retro-btn-secondary"
            >
              {t.assetsButton}
            </button>
            <LanguageSwitcher />
            <select
              value={themeMode}
              onChange={(e) => setThemeMode(e.target.value as 'modern' | 'crt')}
              className="retro-select"
            >
              <option value="modern">{t.modernTheme}</option>
              <option value="crt">{t.crtTheme}</option>
            </select>
            <button
              onClick={resetToDefaults}
              className="retro-btn-secondary"
            >
              {t.resetButton}
            </button>
          </div>
        </div>

        <AssetManagerModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />

        <div className="flex items-center space-x-2 mb-4 w-full">
          {(['html', 'css', 'js'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`retro-tab-btn ${
                activeTab === tab ? 'retro-tab-active' : ''
              }`}
            >
              {t[`${tab}Tab` as keyof typeof t] as string}
            </button>
          ))}
        </div>

        <div className="flex flex-col md:flex-row w-full gap-4">
          <div className="flex-1 min-h-[500px] flex flex-col">
            <div className="flex-1 border-2 border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
              <CodeMirrorEditor />
            </div>
            <RetroToolbar className="mt-2" />
          </div>

          <div className="flex-1 min-h-[500px]">
            <div className="w-full h-full border-2 border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
              <SandboxedPreview />
            </div>
          </div>
        </div>

        <div className="w-full mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <GuestbookComponent />
            </div>

            <div className="lg:col-span-1">
              <LiveActivityFeed />
            </div>

            <div className="lg:col-span-1">
              <WebringFooter />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
