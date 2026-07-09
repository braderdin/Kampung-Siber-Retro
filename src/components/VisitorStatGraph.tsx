"use client";

import { useState, useEffect } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { enDictionary, msDictionary } from '@/i18n/dictionaries';

interface VisitorStatGraphProps {
  className?: string;
}

interface TimeSlot {
  hour: number;
  visitors: number;
}

export default function VisitorStatGraph({ className }: VisitorStatGraphProps) {
  const { language } = useLanguageStore();
  const t = language === 'ms' ? msDictionary : enDictionary;

  const [data, setData] = useState<TimeSlot[]>([]);

  useEffect(() => {
    const generateMockData = (): TimeSlot[] => {
      const slots: TimeSlot[] = [];
      const hours = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
      
      hours.forEach((hour, index) => {
        const spike = index >= 9 && index <= 11 || index >= 18 && index <= 20;
        const baseVisitors = spike ? 45 : 15;
        const variance = Math.floor(Math.random() * 10);
        slots.push({
          hour: index,
          visitors: baseVisitors + variance
        });
      });
      
      return slots;
    };

    setData(generateMockData());
  }, []);

  const maxVisitors = Math.max(...data.map(d => d.visitors), 1);

  const getBarColor = (visitors: number): string => {
    const percentage = (visitors / maxVisitors) * 100;
    if (percentage > 70) return 'bg-red-500';
    if (percentage > 40) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className={`retro-window ${className || ''}`}>
      <div className="retro-window-header bg-gray-200 dark:bg-gray-700 px-3 py-2 border-b border-gray-300 dark:border-gray-600">
        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">
          <span className="mr-2">📊</span>
          Stat Visitor Harian
        </h3>
      </div>
      <div className="retro-window-client p-4">
        <div className="flex items-end gap-1 h-48">
          {data.map((slot, index) => {
            const height = (slot.visitors / maxVisitors) * 100;
            const barColor = getBarColor(slot.visitors);
            
            return (
              <div 
                key={index}
                className="flex-1 flex flex-col items-center"
              >
                <div 
                  className={`w-full ${barColor} transition-all duration-300 hover:scale-105`}
                  style={{ height: `${height}%` }}
                ></div>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {slot.hour.toString().padStart(2, '0')}:00
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-3 text-xs text-gray-600 dark:text-gray-400">
          <span className="font-mono">Peak: {maxVisitors} pengunjung</span>
        </div>
      </div>
    </div>
  );
}