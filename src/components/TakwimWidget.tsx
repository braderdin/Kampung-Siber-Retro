'use client';

import { useState, useEffect, useRef } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { enDictionary, msDictionary } from '@/i18n/dictionaries';

interface PrayerTime {
  name: string;
  time: string;
}

interface TakwimWidgetProps {
  className?: string;
  timezone?: string;
}

const DEFAULT_TIMEZONE = 'Asia/Kuala_Lumpur';
const LATITUDE = 3.1390;
const LONGITUDE = 101.6869;

const PRAYER_TIME_NAMES_MS = [
  'Subuh',
  'Syuruk',
  'Zuhur',
  'Asar',
  'Maghrib',
  'Isyak'
];

const PRAYER_TIME_NAMES_EN = [
  'Fajr',
  'Sunrise',
  'Dhuhr',
  'Asr',
  'Maghrib',
  'Imsak'
];

// Mock prayer times for demonstration
const getMockPrayerTimes = (date: Date): PrayerTime[] => {
  const hour = date.getHours();
  const minute = date.getMinutes();
  
  return [
    { name: 'Subuh', time: '05:45' },
    { name: 'Syuruk', time: '06:30' },
    { name: 'Zuhur', time: '12:30' },
    { name: 'Asar', time: '16:00' },
    { name: 'Maghrib', time: '19:00' },
    { name: 'Isyak', time: '20:15' }
  ];
};

export default function TakwimWidget({ 
  className,
  timezone = DEFAULT_TIMEZONE
}: TakwimWidgetProps) {
  const { language } = useLanguageStore();
  const t = language === 'ms' ? msDictionary : enDictionary;
  
  const [currentTime, setCurrentTime] = useState(new Date());
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [currentPrayer, setCurrentPrayer] = useState<string>('');
  const [isNight, setIsNight] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setPrayerTimes(getMockPrayerTimes(currentTime));
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setPrayerTimes(getMockPrayerTimes(currentTime));
    
    const hour = currentTime.getHours();
    const minute = currentTime.getMinutes();
    
    if (hour >= 18 || hour < 6) {
      setIsNight(true);
    } else {
      setIsNight(false);
    }
  }, [currentTime]);

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('ms-MY', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    };
    return date.toLocaleDateString('ms-MY', options);
  };

  const getNextPrayer = (): string => {
    const hour = currentTime.getHours();
    const minute = currentTime.getMinutes();
    const currentMinutes = hour * 60 + minute;
    
    const prayerMinutes = prayerTimes.map(pt => {
      const [h, m] = pt.time.split(':').map(Number);
      return h * 60 + m;
    });
    
    for (let i = 0; i < prayerMinutes.length; i++) {
      if (prayerMinutes[i] > currentMinutes) {
        return prayerTimes[i].name;
      }
    }
    
    return prayerTimes[0].name;
  };

  const getTimeUntilNextPrayer = (): string => {
    const hour = currentTime.getHours();
    const minute = currentTime.getMinutes();
    const currentMinutes = hour * 60 + minute;
    
    const prayerMinutes = prayerTimes.map(pt => {
      const [h, m] = pt.time.split(':').map(Number);
      return h * 60 + m;
    });
    
    for (const pm of prayerMinutes) {
      if (pm > currentMinutes) {
        const diff = pm - currentMinutes;
        const hours = Math.floor(diff / 60);
        const mins = diff % 60;
        return `${hours}m ${mins}s`;
      }
    }
    
    return '0m 0s';
  };

  const getIconForPrayer = (prayerName: string): string => {
    const icons: Record<string, string> = {
      'Subuh': '🌙',
      'Syuruk': '🌅',
      'Zuhur': '☀️',
      'Asar': '🌤️',
      'Maghrib': '🌇',
      'Isyak': '🌌'
    };
    return icons[prayerName] || '⏰';
  };

  const islamicDays = ['Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu', 'Had'];

  return (
    <div className={`takwim-widget ${className || ''}`}>
      {/* Start: Main Container */}
      <div className="retro-window-client rounded-lg shadow-lg overflow-hidden">
        {/* Start: Header */}
        <div className="retro-card-header bg-purple-600 dark:bg-purple-700 px-4 py-2 border-b border-purple-500 dark:border-purple-600">
          <h3 className="text-sm font-bold text-white pixel-font flex items-center gap-2">
            <span className="text-lg">
              {isNight ? '⭐' : '🌞'}
            </span>
            <span>
              {language === 'ms' ? 'Takwim & Jam' : 'Prayer Times & Clock'}
            </span>
          </h3>
        </div>
        {/* End: Header */}

        {/* Start: Digital Clock */}
        <div className="p-4 text-center bg-white dark:bg-gray-900">
          <div className="retro-digital-clock text-3xl font-mono pixel-font text-gray-900 dark:text-gray-100 mb-2">
            {formatTime(currentTime)}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 pixel-font mb-4">
            {formatDate(currentTime)}
          </div>
        </div>
        {/* End: Digital Clock */}

        {/* Start: Current Date in Islamic Style */}
        <div className="px-4 py-2 bg-purple-50 dark:bg-purple-900/20 border-b border-purple-100 dark:border-purple-800">
          <div className="text-xs text-gray-600 dark:text-gray-400 pixel-font">
            {language === 'ms' ? 'Hari:' : 'Day:'} {islamicDays[currentTime.getDay()]}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-500 pixel-font">
            {language === 'ms' ? 'Amanah berjalan' : 'Time flows on'}
          </div>
        </div>
        {/* End: Current Date in Islamic Style */}

        {/* Start: Prayer Times */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800">
          <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase pixel-font mb-2">
            {language === 'ms' ? 'Jadual Doa' : 'Prayer Schedule'}
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {prayerTimes.map((prayer, index) => (
              <div 
                key={index}
                className={`
                  flex justify-between items-center p-2 rounded
                  ${currentPrayer === prayer.name ? 'bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300' : 'bg-white dark:bg-gray-700'}
                `}
              >
                <span className="text-xs pixel-font">
                  {prayer.name}
                </span>
                <span className="text-xs font-mono pixel-font text-gray-700 dark:text-gray-300">
                  {prayer.time}
                </span>
              </div>
            ))}
          </div>
        </div>
        {/* End: Prayer Times */}

        {/* Start: Next Prayer Indicator */}
        <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border-t border-blue-100 dark:border-blue-800">
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg">{getIconForPrayer(getNextPrayer())}</span>
            <div className="text-center">
              <div className="text-xs text-gray-500 dark:text-gray-400 pixel-font">
                {language === 'ms' ? 'Doa Seterusnya' : 'Next Prayer'}
              </div>
              <div className="text-sm font-bold text-blue-700 dark:text-blue-300 pixel-font">
                {getNextPrayer()}
              </div>
            </div>
          </div>
        </div>
        {/* End: Next Prayer Indicator */}

        {/* Start: Night Mode Info */}
        {isNight && (
          <div className="px-4 pb-3">
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center pixel-font">
              <span className="block">🌙</span>
              <span>{language === 'ms' ? 'Moda Malam Aktif' : 'Night Mode Active'}</span>
            </div>
          </div>
        )}
        {/* End: Night Mode Info */}
      </div>
      {/* End: Main Container */}
    </div>
  );
}

/**
 * Hook for calculating prayer times based on location
 */
export function usePrayerTimes(latitude: number = LATITUDE, longitude: number = LONGITUDE) {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const calculatePrayerTimes = async (date: Date) => {
    setIsLoading(true);
    try {
      // In production, this would call an API like Aladhan or similar
      // For now, we use mock data
      const times = getMockPrayerTimes(date);
      setPrayerTimes(times);
    } catch (error) {
      console.error('Error calculating prayer times:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    calculatePrayerTimes(new Date());
  }, [latitude, longitude]);

  return { prayerTimes, isLoading, calculatePrayerTimes };
}
