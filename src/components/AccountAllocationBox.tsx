"use client";

import { useState, useEffect } from 'react';

interface AccountAllocationBoxProps {
  allocatedBytes?: number;
  usedBytes?: number;
  className?: string;
}

export default function AccountAllocationBox({ 
  allocatedBytes = 10737418240, // 10GB default
  usedBytes = 8589934592, // 8GB default
  className
}: AccountAllocationBoxProps) {
  const [usagePercent, setUsagePercent] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const percent = ((usedBytes || 0) / (allocatedBytes || 1)) * 100;
    setUsagePercent(percent);

    // Check if usage exceeds 80% threshold
    if (percent > 80) {
      setShowAlert(true);
      setIsAnimating(true);
      
      // Stop animation after 3 seconds
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    } else {
      setShowAlert(false);
      setIsAnimating(false);
    }
  }, [allocatedBytes, usedBytes]);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const getProgressColor = (percent: number): string => {
    if (percent >= 90) return 'bg-red-500';
    if (percent >= 80) return 'bg-amber-500';
    return 'bg-green-500';
  };

  const getAlertColor = (percent: number): string => {
    if (percent >= 90) return 'border-red-500 bg-red-50 dark:bg-red-900/20';
    return 'border-amber-500 bg-amber-50 dark:bg-amber-900/20';
  };

  return (
    <div className={`account-allocation-box ${className || ''}`}>
      {/* Start: Alert Banner */}
      {showAlert && (
        <div className={`
          retro-alert-banner p-3 mb-4 border rounded
          ${getAlertColor(usagePercent)}
          ${isAnimating ? 'neon-pulse' : ''}
        `}>
          <div className="flex items-center gap-2">
            <span className="text-xl">⚠️</span>
            <span className="font-bold text-gray-800 dark:text-gray-200 pixel-font text-sm">
              PERINGATAN: Penggunaan R2 Storage mendekati hadapan!
            </span>
          </div>
        </div>
      )}
      {/* End: Alert Banner */}

      {/* Start: Allocation Card */}
      <div className="retro-card">
        <div className="retro-card-header bg-gray-200 dark:bg-gray-700 px-4 py-2 border-b border-gray-300 dark:border-gray-600">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 pixel-font flex items-center gap-2">
            <span className="text-xl">💾</span>
            <span>R2 Storage Allocation</span>
          </h3>
        </div>
        <div className="p-4">
          {/* Start: Usage Summary */}
          <div className="flex justify-between items-center mb-2">
            <div>
              <span className="text-xs text-gray-500 dark:text-gray-400 pixel-font">
                Digunakan
              </span>
              <div className="font-bold text-gray-800 dark:text-gray-200 text-sm">
                {formatBytes(usedBytes)}
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-500 dark:text-gray-400 pixel-font">
                dari
              </span>
              <div className="font-bold text-gray-800 dark:text-gray-200 text-sm">
                {formatBytes(allocatedBytes)}
              </div>
            </div>
          </div>
          {/* End: Usage Summary */}

          {/* Start: Progress Bar */}
          <div className="mb-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-500 dark:text-gray-400 pixel-font">
                Penggunaan
              </span>
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                {usagePercent.toFixed(1)}%
              </span>
            </div>
            <div className="w-full h-3 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden">
              <div 
                className={`
                  h-full transition-all duration-500
                  ${getProgressColor(usagePercent)}
                `}
                style={{ width: `${Math.min(usagePercent, 100)}%` }}
              />
            </div>
          </div>
          {/* End: Progress Bar */}

          {/* Start: Threshold Indicator */}
          <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400 pixel-font">
            <span>0%  25%  50%  75%  100%</span>
          </div>
          {/* End: Threshold Indicator */}

          {/* Start: Status Message */}
          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
            {usagePercent >= 90 ? (
              <div className="text-red-600 dark:text-red-400 font-bold pixel-font text-sm">
                ⚠️ RUANG STORAGE HAMBAR! Segera bersihkan data lama.
              </div>
            ) : usagePercent >= 80 ? (
              <div className="text-amber-600 dark:text-amber-400 font-bold pixel-font text-sm">
                ⚡ Penggunaan storage mendekati hadapan. Pertimbangkan untuk mengarsir.
              </div>
            ) : (
              <div className="text-green-600 dark:text-green-400 font-bold pixel-font text-sm">
                ✅ Ruang storage cukup untuk digunakan
              </div>
            )}
          </div>
          {/* End: Status Message */}
        </div>
      </div>
      {/* End: Allocation Card */}
    </div>
  );
}
