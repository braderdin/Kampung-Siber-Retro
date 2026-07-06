// Start: Imports
"use client";

import { useState, useEffect } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { enDictionary, msDictionary } from '@/i18n/dictionaries';
// End: Imports

// Start: Type Definitions
interface ActivityEntry {
  id: number;
  user: string;
  action: string;
  timestamp: string;
  type: 'code' | 'join' | 'leave' | 'update';
}

interface FollowActivityFeedProps {
  className?: string;
}
// End: Type Definitions

// Start: FollowActivityFeed Component
export default function FollowActivityFeed({ className }: FollowActivityFeedProps) {
  const { language } = useLanguageStore();
  const t = language === 'ms' ? msDictionary : enDictionary;
  const [activities, setActivities] = useState<ActivityEntry[]>([]);

  // Start: Simulated Activity Stream
  useEffect(() => {
    const initialActivities: ActivityEntry[] = [
      { id: 1, user: 'user1', action: 'joined the platform', timestamp: '2 mins ago', type: 'join' },
      { id: 2, user: 'user2', action: 'updated their profile', timestamp: '5 mins ago', type: 'update' },
      { id: 3, user: 'user3', action: 'left the platform', timestamp: '10 mins ago', type: 'leave' },
      { id: 4, user: 'user1', action: 'uploaded a file', timestamp: '15 mins ago', type: 'code' },
    ];
    setActivities(initialActivities);
  }, []);
  // End: Simulated Activity Stream

  // Start: Get Activity Icon
  const getActivityIcon = (type: ActivityEntry['type']): string => {
    switch (type) {
      case 'join':
        return '👋';
      case 'leave':
        return '👋';
      case 'update':
        return '✏️';
      case 'code':
        return '📝';
      default:
        return '📌';
    }
  };
  // End: Get Activity Icon

  // Start: Render FollowActivityFeed
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 ${className || ''}`}>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
        {t.dashboardTitle}
      </h3>
      <div className="space-y-3 max-h-60 overflow-y-auto">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-md"
          >
            <span className="text-lg">{getActivityIcon(activity.type)}</span>
            <div className="flex-1">
              <p className="text-sm text-gray-900 dark:text-gray-100">
                <span className="font-medium">{activity.user}</span>{' '}
                <span className="text-gray-600 dark:text-gray-400">{activity.action}</span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {activity.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
// End: FollowActivityFeed Component
