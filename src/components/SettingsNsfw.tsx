"use client";

// Start: Imports
import { useState } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { enDictionary, msDictionary } from '@/i18n/dictionaries';
// End: Imports

// Start: Type Definitions
interface NsfwSettings {
  enabled: boolean;
  showPreviews: boolean;
  blurImages: boolean;
  contentFilter: 'strict' | 'moderate' | 'none';
  customKeywords: string[];
}
// End: Type Definitions

// Start: SettingsNsfw Component
export default function SettingsNsfw() {
  const { language } = useLanguageStore();
  const t = language === 'ms' ? msDictionary : enDictionary;
  
  const [settings, setSettings] = useState<NsfwSettings>({
    enabled: false,
    showPreviews: false,
    blurImages: true,
    contentFilter: 'moderate',
    customKeywords: [],
  });

  // Start: Handle Toggle
  const handleToggle = () => {
    setSettings(prev => ({
      ...prev,
      enabled: !prev.enabled,
    }));
  };

  // Start: Handle Checkbox
  const handleCheckbox = (field: keyof NsfwSettings) => {
    setSettings(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Start: Handle Content Filter
  const handleContentFilter = (filter: 'strict' | 'moderate' | 'none') => {
    setSettings(prev => ({
      ...prev,
      contentFilter: filter,
    }));
  };

  // Start: Handle Keyword Change
  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keywords = e.target.value.split(',').map(k => k.trim()).filter(k => k);
    setSettings(prev => ({
      ...prev,
      customKeywords: keywords,
    }));
  };

  // Start: Handle Save
  const handleSave = () => {
    console.log('NSFW settings saved:', settings);
    // Save to localStorage or API
  };

  // Start: Render Component
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
        <span>🔞</span>
        <span>NSFW Content Settings</span>
      </h2>
      
      {/* Start: Enable Toggle */}
      <div className="mb-6">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-gray-700 dark:text-gray-300">Enable NSFW Content</span>
          <button
            onClick={handleToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.enabled ? 'bg-red-600' : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                settings.enabled ? 'translate-x-5' : 'translate-x-1'
              }`}
            />
          </button>
        </label>
      </div>
      {/* End: Enable Toggle */}

      {/* Start: NSFW Settings */}
      {settings.enabled && (
        <>
          {/* Start: Show Previews */}
          <div className="mb-4">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-gray-700 dark:text-gray-300">Show Content Previews</span>
              <button
                onClick={() => handleCheckbox('showPreviews')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.showPreviews ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                    settings.showPreviews ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
            </label>
          </div>
          {/* End: Show Previews */}

          {/* Start: Blur Images */}
          <div className="mb-4">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-gray-700 dark:text-gray-300">Blur NSFW Images</span>
              <button
                onClick={() => handleCheckbox('blurImages')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.blurImages ? 'bg-red-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                    settings.blurImages ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
            </label>
          </div>
          {/* End: Blur Images */}

          {/* Start: Content Filter */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Content Filter Level
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => handleContentFilter('strict')}
                className={`w-full p-3 rounded-md border text-sm font-medium transition-colors ${
                  settings.contentFilter === 'strict'
                    ? 'border-red-600 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                Strict - Block all NSFW content
              </button>
              <button
                onClick={() => handleContentFilter('moderate')}
                className={`w-full p-3 rounded-md border text-sm font-medium transition-colors ${
                  settings.contentFilter === 'moderate'
                    ? 'border-yellow-600 bg-yellow-50 dark:bg-yellow-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                Moderate - Blur NSFW content
              </button>
              <button
                onClick={() => handleContentFilter('none')}
                className={`w-full p-3 rounded-md border text-sm font-medium transition-colors ${
                  settings.contentFilter === 'none'
                    ? 'border-green-600 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                None - Show all content
              </button>
            </div>
          </div>
          {/* End: Content Filter */}

          {/* Start: Custom Keywords */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Custom Keywords (comma-separated)
            </label>
            <input
              type="text"
              value={settings.customKeywords.join(', ')}
              onChange={handleKeywordChange}
              placeholder="keyword1, keyword2, ..."
              className="retro-input w-full"
            />
          </div>
          {/* End: Custom Keywords */}
        </>
      )}

      {/* Start: Save Button */}
      <button
        onClick={handleSave}
        className="retro-btn-primary w-full mt-4"
      >
        Save NSFW Settings
      </button>
      {/* End: Save Button */}
    </div>
  );
}
// End: SettingsNsfw Component
