"use client";

import { useState, useEffect } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { enDictionary, msDictionary } from '@/i18n/dictionaries';

interface ProfileStatusBadgeProps {
  initialStatus?: 'online' | 'coding' | 'makan';
  onStatusChange?: (status: string) => void;
  className?: string;
}

type StatusOption = {
  value: 'online' | 'coding' | 'makan';
  label: string;
  color: string;
  icon: string;
};

const STATUS_OPTIONS: StatusOption[] = [
  {
    value: 'online',
    label: '🟢 Online',
    color: 'bg-green-500',
    icon: '🟢'
  },
  {
    value: 'coding',
    label: '💻 Koding',
    color: 'bg-blue-500',
    icon: '💻'
  },
  {
    value: 'makan',
    label: '☕ Makan',
    color: 'bg-amber-500',
    icon: '☕'
  }
];

export default function ProfileStatusBadge({ 
  initialStatus = 'online',
  onStatusChange,
  className 
}: ProfileStatusBadgeProps) {
  const { language } = useLanguageStore();
  const t = language === 'ms' ? msDictionary : enDictionary;
  
  const [selectedStatus, setSelectedStatus] = useState<'online' | 'coding' | 'makan'>(initialStatus);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    const storedStatus = localStorage.getItem('user_status');
    if (storedStatus && STATUS_OPTIONS.some(opt => opt.value === storedStatus)) {
      setSelectedStatus(storedStatus as 'online' | 'coding' | 'makan');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('user_status', selectedStatus);
    if (onStatusChange) {
      onStatusChange(selectedStatus);
    }
  }, [selectedStatus, onStatusChange]);

  const handleStatusSelect = (status: 'online' | 'coding' | 'makan') => {
    setSelectedStatus(status);
    setShowOptions(false);
  };

  const getCurrentStatus = () => STATUS_OPTIONS.find(opt => opt.value === selectedStatus);

  return (
    <div className={`profile-status-badge ${className || ''}`}>
      <div className="retro-window retro-border">
        <div className="retro-window-header bg-gray-200 dark:bg-gray-700 px-3 py-2 border-b border-gray-300 dark:border-gray-600">
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">
            <span className="mr-2">🎯</span>
            Status Hidup
          </h3>
        </div>
        <div className="retro-window-client p-4">
          <div 
            className="retro-status-display flex items-center gap-3 cursor-pointer"
            onClick={() => setShowOptions(!showOptions)}
          >
            <span className={`retro-status-dot ${getCurrentStatus()?.color || 'bg-green-500'} animate-pulse`}></span>
            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {getCurrentStatus()?.label || '🟢 Online'}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {showOptions ? '▼' : '▶'}
            </span>
          </div>

          {showOptions && (
            <div className="retro-status-options mt-3 p-2 bg-gray-50 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600">
              {STATUS_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleStatusSelect(option.value)}
                  className={`w-full text-left px-3 py-2 mb-1 rounded transition-all ${
                    selectedStatus === option.value
                      ? 'bg-blue-500 text-white font-bold'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="text-xl mr-2">{option.icon}</span>
                  <span className="font-mono">{option.label}</span>
                </button>
              ))}
            </div>
          )}

          <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            Status disimpan secara tempatan
          </div>
        </div>
      </div>
    </div>
  );
}