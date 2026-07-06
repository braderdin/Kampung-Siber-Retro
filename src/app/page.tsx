"use client";

import { useState } from 'react';
import { useEditorStore } from "@/store/useEditorStore";
import CodeMirrorEditor from "@/components/CodeMirrorEditor";
import SandboxedPreview from "@/components/SandboxedPreview";
import RetroToolbar from "@/components/RetroToolbar";
import AssetManagerModal from "@/components/AssetManagerModal";
// Start: New Social Ecosystem Imports
import GuestbookComponent from "@/components/GuestbookComponent";
import LiveActivityFeed from "@/components/LiveActivityFeed";
import WebringFooter from "@/components/WebringFooter";
// End: New Social Ecosystem Imports

export default function Home() {
  const { activeTab, themeMode, setActiveTab, setThemeMode, resetToDefaults } = useEditorStore();
  
  // Start: Modal State Management
  const [isModalOpen, setIsModalOpen] = useState(false);
  // End: Modal State Management

  // CRT theme filter classes
  const crtThemeClasses = themeMode === 'crt' 
    ? 'crt-scanline-filter' 
    : '';

  return (
    <div className={`flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans ${crtThemeClasses}`}>
      <main className="flex flex-1 w-full max-w-6xl flex-col items-center justify-between py-8 px-4 sm:px-8">
        {/* Workspace Header */}
        <div className="flex items-center justify-between w-full mb-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Kampung Siber Retro Editor
          </h1>
          <div className="flex items-center space-x-4">
            {/* Start: Assets Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="retro-btn-secondary"
            >
              Assets
            </button>
            {/* End: Assets Button */}
            <select
              value={themeMode}
              onChange={(e) => setThemeMode(e.target.value as 'modern' | 'crt')}
              className="retro-select"
            >
              <option value="modern">Modern Theme</option>
              <option value="crt">CRT Theme</option>
            </select>
            <button
              onClick={resetToDefaults}
              className="retro-btn-secondary"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Start: Asset Manager Modal */}
        <AssetManagerModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
        {/* End: Asset Manager Modal */}

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 mb-4 w-full">
          {(['html', 'css', 'js'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`retro-tab-btn ${
                activeTab === tab ? 'retro-tab-active' : ''
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Main Editor Layout */}
        <div className="flex flex-col md:flex-row w-full gap-4">
          {/* Code Editor Section */}
          <div className="flex-1 min-h-[500px] flex flex-col">
            <div className="flex-1 border-2 border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
              <CodeMirrorEditor />
            </div>
            <RetroToolbar className="mt-2" />
          </div>

          {/* Live Preview Section */}
          <div className="flex-1 min-h-[500px]">
            <div className="w-full h-full border-2 border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
              <SandboxedPreview />
            </div>
          </div>
        </div>

        {/* Start: Social Ecosystem Section */}
        <div className="w-full mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Start: Guestbook Component */}
            <div className="lg:col-span-1">
              <GuestbookComponent />
            </div>
            {/* End: Guestbook Component */}

            {/* Start: Live Activity Feed */}
            <div className="lg:col-span-1">
              <LiveActivityFeed />
            </div>
            {/* End: Live Activity Feed */}

            {/* Start: Webring Footer */}
            <div className="lg:col-span-1">
              <WebringFooter />
            </div>
            {/* End: Webring Footer */}
          </div>
        </div>
        {/* End: Social Ecosystem Section */}
      </main>
    </div>
  );
}
