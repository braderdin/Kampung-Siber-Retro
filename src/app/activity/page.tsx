// Start: Imports
'use client';
import { useState, useEffect } from 'react';
import { ActivityEntry } from '@/components/LiveActivityFeed';
import CommunityInteraction from '@/components/CommunityInteraction';
import CrtThemeController from '@/components/CrtThemeController';
import ProfileUpdateBox from '@/components/ProfileUpdateBox';
// End: Imports

// Start: Type Definitions
interface ActivityPageProps {
  className?: string;
}

interface ActivityFeedResponse {
  success: boolean;
  data?: ActivityEntry[];
  error?: string;
}
// End: Type Definitions

// Start: ActivityPage Component
export default function ActivityPage({ className }: ActivityPageProps) {
  // Start: State Management
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);
  const [username] = useState('Pengguna');
  // End: State Management

  // Start: Component Lifecycle
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#new') {
      console.log('New post detected from hash');
    }

    fetchActivityFeed();

    const interval = setInterval(fetchActivityFeed, 30000);
    setRefreshInterval(interval);

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, []);
  // End: Component Lifecycle

  // Start: Fetch Activity Feed
  const fetchActivityFeed = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/activity');
      const data: ActivityFeedResponse = await response.json();

      if (data.success && data.data) {
        setActivities(data.data);
      } else {
        setError(data.error || 'Gagal memuat aliran aktiviti');
      }
    } catch (err) {
      console.error('Error fetching activity feed:', err);
      setError('Gagal memuat aliran aktiviti');
    } finally {
      setLoading(false);
    }
  };
  // End: Fetch Activity Feed

  // Start: Format Timestamp
  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  // End: Format Timestamp

  // Start: Get Activity Icon
  const getActivityIcon = (type: ActivityEntry['type']): string => {
    const icons: Record<ActivityEntry['type'], string> = {
      code: '💻',
      join: '👋',
      leave: '👋',
      update: '🔄',
    };
    return icons[type] || '📝';
  };
  // End: Get Activity Icon

  // Start: Render Activity Entry
  const renderActivityEntry = (entry: ActivityEntry) => {
    const toneClasses: Record<ActivityEntry['type'], string> = {
      code: 'border-cyan-500 bg-cyan-50 text-cyan-700',
      join: 'border-emerald-500 bg-emerald-50 text-emerald-700',
      leave: 'border-amber-500 bg-amber-50 text-amber-700',
      update: 'border-violet-500 bg-violet-50 text-violet-700',
    };

    return (
      <div key={entry.id} className={`mb-2 rounded border-l-4 p-3 ${toneClasses[entry.type]}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{getActivityIcon(entry.type)}</span>
            <span className="font-mono text-xs font-bold">{entry.user}</span>
          </div>
          <span className="text-xs opacity-75">{formatTimestamp(entry.timestamp)}</span>
        </div>
        <p className="mt-1 text-sm">{entry.action}</p>
      </div>
    );
  };
  // End: Render Activity Entry

  // Start: Render Activity Page
  return (
    <div className={`retro-window ${className || ''}`}>
      <div className="retro-window-header border-b border-gray-300 bg-gray-200 px-3 py-2 dark:border-gray-600 dark:bg-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center text-sm font-bold text-gray-800 dark:text-gray-200">
            <span className="mr-2">📊</span>
            Aliran Aktiviti
          </h3>
          <CrtThemeController className="hidden sm:inline-flex" />
        </div>
      </div>

      <div className="p-3">
        <div className="mb-4">
          <ProfileUpdateBox username={username} />
        </div>

        <div className="mb-4">
          <CommunityInteraction username={username} />
        </div>

        {loading ? (
          <div className="py-4 text-center">
            <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500"></div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Memuat aliran aktiviti...</p>
          </div>
        ) : error ? (
          <div className="py-4 text-center">
            <p className="mb-2 text-sm text-red-500">{error}</p>
            <button onClick={fetchActivityFeed} className="retro-btn-secondary text-xs">
              Cuba Semula
            </button>
          </div>
        ) : activities.length === 0 ? (
          <div className="py-4 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Tiada aktiviti terkini</p>
          </div>
        ) : (
          <div className="space-y-2">{activities.map(renderActivityEntry)}</div>
        )}
      </div>

      <div className="retro-window-footer flex items-center justify-between border-t border-gray-300 bg-gray-200 px-3 py-2 dark:border-gray-600 dark:bg-gray-700">
        <span className="text-xs text-gray-600 dark:text-gray-300">
          {activities.length} {activities.length === 1 ? 'aktiviti' : 'aktiviti'}
        </span>
        <button onClick={fetchActivityFeed} className="retro-btn-primary text-xs">
          Segar Semula
        </button>
      </div>
    </div>
  );
}
// End: ActivityPage Component
