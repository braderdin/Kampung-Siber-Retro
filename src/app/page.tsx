"use client";

import { useEditorStore } from "@/store/useEditorStore";
import CodeMirrorEditor from "@/components/CodeMirrorEditor";
import SandboxedPreview from "@/components/SandboxedPreview";
import RetroToolbar from "@/components/RetroToolbar";

export default function Home() {
  const { activeTab, themeMode, setActiveTab, setThemeMode, resetToDefaults } = useEditorStore();

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
      </main>
    </div>
  );
}
