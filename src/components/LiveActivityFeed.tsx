// Start: Imports
import { useState, useEffect } from 'react';
// End: Imports

// Start: Type Definitions
interface ActivityEntry {
  id: number;
  user: string;
  action: string;
  timestamp: string;
  type: 'code' | 'join' | 'leave' | 'update';
}

interface LiveActivityFeedProps {
  className?: string;
}
// End: Type Definitions

// Start: LiveActivityFeed
export default function LiveActivityFeed({ className }: LiveActivityFeedProps) {
  // Start: State Management
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [isStreaming, setIsStreaming] = useState(true);
  // End: State Management

  // Start: Mock Activity Generator
  const generateMockActivity = (): ActivityEntry => {
    const users = ['RetroCoder', 'PixelPioneer', 'ByteBandit', 'NeonNomad', 'GlitchGuru'];
    const actions = [
      { action: 'updated code', type: 'update' as const },
      { action: 'joined the workspace', type: 'join' as const },
      { action: 'left the workspace', type: 'leave' as const },
      { action: 'compiled HTML', type: 'code' as const },
      { action: 'debugged CSS', type: 'code' as const },
      { action: 'ran JavaScript', type: 'code' as const },
    ];
    
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    
    return {
      id: Date.now() + Math.random(),
      user: randomUser,
      action: randomAction.action,
      timestamp: new Date().toISOString(),
      type: randomAction.type,
    };
  };
  // End: Mock Activity Generator

  // Start: Initialize Activities
  useEffect(() => {
    const initialActivities: ActivityEntry[] = [];
    for (let i = 0; i < 5; i++) {
      initialActivities.unshift(generateMockActivity());
    }
    setActivities(initialActivities);
  }, []);
  // End: Initialize Activities

  // Start: Streaming Simulation
  useEffect(() => {
    if (!isStreaming) return;
    
    const interval = setInterval(() => {
      const newActivity = generateMockActivity();
      setActivities(prev => [newActivity, ...prev.slice(0, 19)]);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [isStreaming]);
  // End: Streaming Simulation

  // Start: Format Timestamp
  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };
  // End: Format Timestamp

  // Start: Get Action Icon
  const getActionIcon = (type: string): string => {
    switch (type) {
      case 'code':
        return '💻';
      case 'join':
        return '👋';
      case 'leave':
        return '👋';
      case 'update':
        return '✏️';
      default:
        return '📌';
    }
  };
  // End: Get Action Icon

  // Start: Get Action Color
  const getActionColor = (type: string): string => {
    switch (type) {
      case 'code':
        return 'text-green-600 dark:text-green-400';
      case 'join':
        return 'text-blue-600 dark:text-blue-400';
      case 'leave':
        return 'text-purple-600 dark:text-purple-400';
      case 'update':
        return 'text-orange-600 dark:text-orange-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };
  // End: Get Action Color

  // Start: Toggle Streaming
  const toggleStreaming = () => {
    setIsStreaming(prev => !prev);
  };
  // End: Toggle Streaming

  // Start: Render Activity Feed
  return (
    <div className={`retro-card ${className || ''}`}>
      {/* Start: Card Header */}
      <div className="retro-card-header flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">
          📡 Live Activity Feed
        </h3>
        <button
          onClick={toggleStreaming}
          className="text-xs px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          {isStreaming ? 'Pause' : 'Resume'}
        </button>
      </div>
      {/* End: Card Header */}

      {/* Start: Marquee Ticker */}
      <div className="mb-3">
        <div className="retro-marquee overflow-hidden whitespace-nowrap">
          <div className="inline-flex space-x-6 animate-marquee">
            {activities.slice(0, 8).map((activity) => (
              <span
                key={activity.id}
                className={`inline-flex items-center space-x-1 text-sm ${getActionColor(activity.type)}`}
              >
                <span className="text-base">{getActionIcon(activity.type)}</span>
                <span className="font-mono">
                  <span className="font-bold text-blue-600 dark:text-blue-400">{activity.user}</span>
                  <span className="mx-1">•</span>
                  <span>{activity.action}</span>
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  [{formatTimestamp(activity.timestamp)}]
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
      {/* End: Marquee Ticker */}

      {/* Start: Activity List */}
      <div className="max-h-40 overflow-y-auto retro-scrollbar text-xs">
        {activities.map((activity, index) => (
          <div
            key={activity.id}
            className="flex items-center space-x-2 p-1 hover:bg-gray-50 dark:hover:bg-gray-800 rounded transition-colors"
          >
            <span className="text-base">{getActionIcon(activity.type)}</span>
            <span className="flex-1 font-mono text-gray-700 dark:text-gray-300">
              <span className={getActionColor(activity.type)}>
                {activity.user}
              </span>
              <span className="mx-1">•</span>
              {activity.action}
            </span>
            <span className="text-gray-400 dark:text-gray-500">
              {formatTimestamp(activity.timestamp)}
            </span>
          </div>
        ))}
      </div>
      {/* End: Activity List */}

      {/* Start: Footer Info */}
      <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
        <span>
          {isStreaming ? '🔴 Live' : '⏸️ Paused'} • {activities.length} recent activities
        </span>
      </div>
      {/* End: Footer Info */}
    </div>
  );
}
