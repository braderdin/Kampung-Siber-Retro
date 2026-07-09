"use client";

import { useState, useEffect, useRef } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { enDictionary, msDictionary } from '@/i18n/dictionaries';

interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  timestamp: string;
  priority: 'high' | 'normal' | 'low';
}

interface PondokNotisProps {
  className?: string;
  maxAnnouncements?: number;
}

export default function PondokNotis({ 
  className,
  maxAnnouncements = 5 
}: PondokNotisProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguageStore();
  const t = language === 'ms' ? msDictionary : enDictionary;
  const subscriptionRef = useRef<any>(null);

  useEffect(() => {
    const loadAnnouncements = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const storedAnnouncements = localStorage.getItem('announcements');
        if (storedAnnouncements) {
          const parsed = JSON.parse(storedAnnouncements) as Announcement[];
          const sorted = parsed
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, maxAnnouncements);
          setAnnouncements(sorted);
        } else {
          setAnnouncements([]);
        }
      } catch (err) {
        console.error('Error loading announcements:', err);
        setError('Failed to load announcements');
        setAnnouncements([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadAnnouncements();
  }, [maxAnnouncements]);

  const getPriorityColor = (priority: Announcement['priority']): string => {
    switch (priority) {
      case 'high':
        return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'normal':
        return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
      case 'low':
        return 'border-green-500 bg-green-50 dark:bg-green-900/20';
      default:
        return 'border-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getPriorityLabel = (priority: Announcement['priority']): string => {
    switch (priority) {
      case 'high':
        return 'IMPORTANT';
      case 'normal':
        return 'NOTICE';
      case 'low':
        return 'INFO';
      default:
        return 'INFO';
    }
  };

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className={`pondok-notis ${className || ''}`}>
        <div className="text-center py-3 text-gray-500 dark:text-gray-400 pixel-font text-xs">
          Loading announcements...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`pondok-notis ${className || ''}`}>
        <div className="text-center py-3 text-red-500 dark:text-red-400 pixel-font text-xs">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className={`pondok-notis ${className || ''}`}>
      {/* Start: Header */}
      <div className="pondok-notis-header bg-yellow-100 dark:bg-yellow-900/20 px-3 py-2 border-b border-yellow-300 dark:border-yellow-600 mb-2">
        <h3 className="text-sm font-bold text-yellow-800 dark:text-yellow-300 pixel-font flex items-center gap-2">
          <span className="text-lg">📢</span>
          <span>Pondok Rukun Tetangga</span>
        </h3>
      </div>
      {/* End: Header */}

      {/* Start: Announcement List */}
      <div className="pondok-notis-list space-y-2 max-h-48 overflow-y-auto">
        {announcements.length === 0 ? (
          <div className="text-center py-3 text-gray-500 dark:text-gray-400 pixel-font text-xs">
            No announcements yet
          </div>
        ) : (
          announcements.map((announcement, index) => (
            <div
              key={announcement.id}
              className={`pondok-announcement p-3 rounded border-l-4 ${getPriorityColor(announcement.priority)} pixel-font`}
              style={{
                animation: `slideIn ${0.1 * (index + 1)}s ease-out`,
                borderLeftWidth: '4px'
              }}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-bold uppercase text-yellow-700 dark:text-yellow-400">
                  {getPriorityLabel(announcement.priority)}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatTimestamp(announcement.timestamp)}
                </span>
              </div>
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
                {announcement.title}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                {announcement.content.length > 120
                  ? `${announcement.content.substring(0, 120)}...`
                  : announcement.content
                }
              </p>
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                By: {announcement.author}
              </div>
            </div>
          ))
        )}
      </div>
      {/* End: Announcement List */}

      {/* Start: Footer */}
      {announcements.length > 0 && (
        <div className="pondok-notis-footer mt-2 pt-2 border-t border-yellow-200 dark:border-yellow-600">
          <span className="text-xs text-gray-500 dark:text-gray-400 pixel-font">
            {announcements.length} announcements
          </span>
        </div>
      )}
      {/* End: Footer */}
    </div>
  );
}