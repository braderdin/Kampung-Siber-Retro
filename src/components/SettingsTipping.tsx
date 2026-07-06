"use client";

// Start: Imports
import { useState } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { enDictionary, msDictionary } from '@/i18n/dictionaries';
// End: Imports

// Start: Type Definitions
interface TippingSettings {
  enabled: boolean;
  provider: 'paypal' | 'ko-fi' | 'buycoffee';
  customLink: string;
  message: string;
}
// End: Type Definitions

// Start: SettingsTipping Component
export default function SettingsTipping() {
  const { language } = useLanguageStore();
  const t = language === 'ms' ? msDictionary : enDictionary;
  
  const [settings, setSettings] = useState<TippingSettings>({
    enabled: false,
    provider: 'ko-fi',
    customLink: '',
    message: 'Support my work!',
  });

  // Start: Handle Toggle
  const handleToggle = () => {
    setSettings(prev => ({
      ...prev,
      enabled: !prev.enabled,
    }));
  };

  // Start: Handle Provider Change
  const handleProviderChange = (provider: 'paypal' | 'ko-fi' | 'buycoffee') => {
    setSettings(prev => ({
      ...prev,
      provider,
    }));
  };

  // Start: Handle Link Change
  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings(prev => ({
      ...prev,
      customLink: e.target.value,
    }));
  };

  // Start: Handle Message Change
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSettings(prev => ({
      ...prev,
      message: e.target.value,
    }));
  };

  // Start: Handle Save
  const handleSave = () => {
    console.log('Tipping settings saved:', settings);
    // Save to localStorage or API
  };

  // Start: Render Component
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
        <span>💰</span>
        <span>Tipping Settings</span>
      </h2>
      
      {/* Start: Enable Toggle */}
      <div className="mb-6">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-gray-700 dark:text-gray-300">Enable Tipping</span>
          <button
            onClick={handleToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
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

      {/* Start: Provider Selection */}
      {settings.enabled && (
        <>
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Tipping Provider
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => handleProviderChange('ko-fi')}
                className={`w-full p-3 rounded-md border text-sm font-medium transition-colors ${
                  settings.provider === 'ko-fi'
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span>☕</span>
                  <span>Ko-fi</span>
                </div>
              </button>
              <button
                onClick={() => handleProviderChange('paypal')}
                className={`w-full p-3 rounded-md border text-sm font-medium transition-colors ${
                  settings.provider === 'paypal'
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span>💳</span>
                  <span>PayPal</span>
                </div>
              </button>
              <button
                onClick={() => handleProviderChange('buycoffee')}
                className={`w-full p-3 rounded-md border text-sm font-medium transition-colors ${
                  settings.provider === 'buycoffee'
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span>☕</span>
                  <span>Buy Me a Coffee</span>
                </div>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Start: Custom Link */}
      {settings.enabled && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Custom Tipping Link
          </label>
          <input
            type="url"
            value={settings.customLink}
            onChange={handleLinkChange}
            placeholder="https://..."
            className="retro-input w-full"
          />
        </div>
      )}

      {/* Start: Message */}
      {settings.enabled && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Message
          </label>
          <textarea
            value={settings.message}
            onChange={handleMessageChange}
            placeholder="Thank you message..."
            rows={3}
            className="retro-textarea w-full"
          />
        </div>
      )}

      {/* Start: Save Button */}
      <button
        onClick={handleSave}
        className="retro-btn-primary w-full"
      >
        Save Tipping Settings
      </button>
      {/* End: Save Button */}
    </div>
  );
}
// End: SettingsTipping Component
