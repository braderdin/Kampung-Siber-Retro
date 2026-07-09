"use client";

import { useState, useEffect } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { enDictionary, msDictionary } from '@/i18n/dictionaries';

interface StorageStats {
  total: number;
  used: number;
  available: number;
  quota: number;
}

const FREE_TIER_LIMIT = 4.5 * 1024 * 1024;

export default function AccountAllocationBox() {
  const { language } = useLanguageStore();
  const t = language === 'ms' ? msDictionary : enDictionary;
  
  const [storage, setStorage] = useState<StorageStats>({
    total: FREE_TIER_LIMIT,
    used: 0,
    available: FREE_TIER_LIMIT,
    quota: FREE_TIER_LIMIT,
  });
  
  const [isWarning, setIsWarning] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const mockUsed = Math.random() * FREE_TIER_LIMIT * 0.85;
    
    setStorage({
      total: FREE_TIER_LIMIT,
      used: mockUsed,
      available: FREE_TIER_LIMIT - mockUsed,
      quota: FREE_TIER_LIMIT,
    });
    
    const usagePercentage = (mockUsed / FREE_TIER_LIMIT) * 100;
    if (usagePercentage > 80) {
      setIsWarning(true);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 5000);
    } else {
      setIsWarning(false);
      setShowAlert(false);
    }
  }, []);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const usagePercentage = (storage.used / storage.quota) * 100;
  const availablePercentage = (storage.available / storage.quota) * 100;

  return (
    <div className="mb-6 retro-card">
      {showAlert && (
        <div className="retro-alert-pulse mb-4 p-3 bg-red-900/20 border border-red-500 rounded-lg animate-pulse">
          <div className="flex items-center gap-2">
            <span className="text-red-500 text-xl">⚠️</span>
            <span className="text-red-300 font-medium">
              Amanah saiz mendekati had percuma 4.5MB!
            </span>
          </div>
        </div>
      )}
      
      <div className="retro-card-header">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <span>📦</span>
          Penggunaan Akaun
        </h3>
      </div>
      
      <div className="retro-window-client p-4">
        {/* Start: Storage Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Isyaddah Digunakan</span>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {formatBytes(storage.used)} / {formatBytes(storage.quota)}
            </span>
          </div>
          
          <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden retro-border">
            <div 
              className={`h-full transition-all duration-500 ${isWarning ? 'bg-red-500 animate-pulse' : 'bg-gradient-to-r from-cyan-500 to-purple-500'}`}
              style={{ width: `${Math.min(usagePercentage, 100)}%` }}
            />
          </div>
          
          {isWarning && (
            <div className="mt-2 text-xs text-red-500 dark:text-red-400 flex items-center gap-1 animate-pulse">
              <span>⚠️</span>
              <span>Amanah saiz mendekati had percuma 4.5MB!</span>
            </div>
          )}
        </div>
        {/* End: Storage Progress Bar */}
        
        {/* Start: Storage Stats Grid */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-cyan-500/20">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Digunakan</div>
            <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {formatBytes(storage.used)}
            </div>
          </div>
                    
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-cyan-500/20">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Tersisa</div>
            <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {formatBytes(storage.available)}
            </div>
          </div>
                  
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-cyan-500/20">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Was Penuh</div>
            <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {formatBytes(storage.quota)}
            </div>
          </div>
        </div>
        {/* End: Storage Stats Grid */}
        
        {/* Start: Free Tier Notice */}
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 text-center">
          <span>Free Tier Limit:</span>
          <span className="ml-1 text-yellow-500 font-medium">4.5 MB</span>
        </div>
        {/* End: Free Tier Notice */}
      </div>
    </div>
  );
}