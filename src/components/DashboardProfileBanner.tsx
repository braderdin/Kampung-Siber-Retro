// Start: Imports
"use client";

import { useLanguageStore } from '@/store/useLanguageStore';
import { enDictionary, msDictionary } from '@/i18n/dictionaries';
// End: Imports

// Start: Type Definitions
interface DashboardProfileBannerProps {
  className?: string;
}
// End: Type Definitions

// Start: DashboardProfileBanner Component
export default function DashboardProfileBanner({ className }: DashboardProfileBannerProps) {
  const { language } = useLanguageStore();
  const t = language === 'ms' ? msDictionary : enDictionary;

  // Start: Storage Stats
  const usedStorage = 80.77;
  const totalStorage = 25 * 1024; // 25MB in KB
  const percentage = (usedStorage / totalStorage) * 100;
  // End: Storage Stats

  // Start: Render Profile Banner
  return (
    <div className={`bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 border-2 border-gray-300 dark:border-gray-600 rounded-lg p-4 mb-4 ${className || ''}`}>
      <div className="flex items-center justify-between">
        {/* Start: Profile Info */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <span className="text-2xl">👤</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              {t.dashboardTitle}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t.dashboardSubtitle}
            </p>
          </div>
        </div>
        {/* End: Profile Info */}

        {/* Start: Storage Usage */}
        <div className="text-right">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {usedStorage.toFixed(2)} KB / {totalStorage.toFixed(0)} KB
            </span>
          </div>
          <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 dark:bg-blue-400 rounded-full"
              style={{ width: `${Math.min(percentage, 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {t.myFiles}
          </p>
        </div>
        {/* End: Storage Usage */}
      </div>
    </div>
  );
}
// End: DashboardProfileBanner Component
