"use client";

// Start: Imports
import { useState } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { enDictionary, msDictionary } from '@/i18n/dictionaries';
// End: Imports

// Start: Type Definitions
interface ApiKeySettings {
  enabled: boolean;
  key: string;
  permissions: string[];
  createdAt: string;
}
// End: Type Definitions

// Start: SettingsApiKey Component
export default function SettingsApiKey() {
  const { language } = useLanguageStore();
  const t = language === 'ms' ? msDictionary : enDictionary;
  
  const [settings, setSettings] = useState<ApiKeySettings>({
    enabled: false,
    key: '',
    permissions: [],
    createdAt: new Date().toISOString(),
  });

  // Start: Available Permissions
  const availablePermissions = [
    'read:files',
    'write:files',
    'read:assets',
    'write:assets',
    'read:analytics',
    'admin:settings',
  ];

  // Start: Handle Toggle
  const handleToggle = () => {
    setSettings(prev => ({
      ...prev,
      enabled: !prev.enabled,
    }));
  };

  // Start: Handle Permission Toggle
  const handlePermissionToggle = (permission: string) => {
    setSettings(prev => {
      const newPermissions = prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission];
      return {
        ...prev,
        permissions: newPermissions,
      };
    });
  };

  // Start: Handle Generate Key
  const handleGenerateKey = () => {
    const newKey = `sk_${Math.random().toString(36).substring(2, 34)}`;
    setSettings(prev => ({
      ...prev,
      key: newKey,
      createdAt: new Date().toISOString(),
    }));
  };

  // Start: Handle Copy Key
  const handleCopyKey = () => {
    if (settings.key) {
      navigator.clipboard.writeText(settings.key);
    }
  };

  // Start: Handle Save
  const handleSave = () => {
    console.log('API Key settings saved:', settings);
    // Save to localStorage or API
  };

  // Start: Render Component
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
        <span>🔑</span>
        <span>API Key Settings</span>
      </h2>
      
      {/* Start: Enable Toggle */}
      <div className="mb-6">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-gray-700 dark:text-gray-300">Enable API Access</span>
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

      {/* Start: API Key Display */}
      {settings.enabled && (
        <>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              API Key
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={settings.key}
                readOnly
                className="retro-input flex-1 font-mono text-xs"
              />
              <button
                onClick={handleCopyKey}
                className="retro-btn-secondary text-xs px-2 py-1"
              >
                Copy
              </button>
            </div>
          </div>
        </>
      )}

      {/* Start: Generate Button */}
      {settings.enabled && (
        <div className="mb-6">
          <button
            onClick={handleGenerateKey}
            className="retro-btn-secondary text-sm"
          >
            Generate New Key
          </button>
        </div>
      )}

      {/* Start: Permissions */}
      {settings.enabled && (
        <>
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Permissions
            </h3>
            <div className="space-y-2">
              {availablePermissions.map((permission) => (
                <label key={permission} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.permissions.includes(permission)}
                    onChange={() => handlePermissionToggle(permission)}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 dark:border-gray-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {permission}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Start: Created At */}
      {settings.enabled && (
        <div className="mb-6">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Created: {new Date(settings.createdAt).toLocaleString()}
          </p>
        </div>
      )}

      {/* Start: Save Button */}
      <button
        onClick={handleSave}
        className="retro-btn-primary w-full"
      >
        Save API Key Settings
      </button>
      {/* End: Save Button */}
    </div>
  );
}
// End: SettingsApiKey Component
