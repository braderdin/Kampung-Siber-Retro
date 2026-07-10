'use client';

import { useState, useEffect } from 'react';
import { useProfilesStore } from '@/store/useProfilesStore';

interface SuratLayangMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

interface SuratLayangBoxProps {
  className?: string;
  maxMessages?: number;
}

export default function SuratLayangBox({ 
  className,
  maxMessages = 10 
}: SuratLayangBoxProps) {
  const [messages, setMessages] = useState<SuratLayangMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const profiles = useProfilesStore();

  useEffect(() => {
    const loadMessages = async () => {
      setIsLoading(true);
      try {
        if (profiles?.profiles && Array.isArray(profiles.profiles)) {
          const fetchedMessages: SuratLayangMessage[] = [];
          
          profiles.profiles.forEach((profile: any, index: number) => {
            if (profile?.suratLayang && Array.isArray(profile.suratLayang)) {
              profile.suratLayang.forEach((msg: any) => {
                fetchedMessages.push({
                  id: `${profile.username || 'unknown'}-${index}-${Math.random()}`,
                  sender: profile.username || 'Penduduk',
                  content: msg.content || msg,
                  timestamp: msg.timestamp || new Date().toISOString(),
                  isRead: msg.isRead || false
                });
              });
            }
          });

          const sortedMessages = fetchedMessages
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, maxMessages);

          setMessages(sortedMessages);
        } else {
          setMessages([]);
        }
      } catch (error) {
        console.error('Error loading surat layang:', error);
        setMessages([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [profiles?.profiles, maxMessages]);

  const formatTimeAgo = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
    
    if (diffMinutes < 1) return 'Baru sahaja';
    if (diffMinutes < 60) return `${diffMinutes} min yang lalu`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} j dah lalu`;
    return date.toLocaleDateString('ms-MY');
  };

  const markAsRead = (id: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === id ? { ...msg, isRead: true } : msg
      )
    );
  };

  const clearMessages = () => {
    setMessages([]);
  };

  if (isLoading) {
    return (
      <div className={`surat-layang-box ${className || ''}`}>
        <div className="text-center py-4 text-gray-500 dark:text-gray-400 pixel-font">
          Memuatkan surat...
        </div>
      </div>
    );
  }

  return (
    <div className={`surat-layang-box ${className || ''}`}>
      {/* Start: Box Header */}
      <div className="surat-layang-header bg-gray-800 dark:bg-gray-700 px-3 py-2 border-b border-gray-600 dark:border-gray-500 flex justify-between items-center">
        <h3 className="text-sm font-bold text-gray-100 dark:text-gray-200 pixel-font flex items-center gap-2">
          <span className="text-lg">📬</span>
          <span>Surat Layang</span>
        </h3>
        {messages.length > 0 && (
          <button
            onClick={clearMessages}
            className="text-xs text-gray-300 hover:text-red-400 pixel-font"
            title="Bersihkan semua surat"
          >
            🗑️
          </button>
        )}
      </div>
      {/* End: Box Header */}

      {/* Start: Message List */}
      <div className="surat-layang-messages max-h-60 overflow-y-auto">
        {messages.length === 0 ? (
          /* Start: Empty State */
          <div className="surat-layang-empty p-4 text-center">
            <div className="text-3xl mb-2">📭</div>
            <p className="text-gray-500 dark:text-gray-400 text-sm pixel-font">
              Tiada surat layang diterima
            </p>
            <p className="text-gray-600 dark:text-gray-500 text-xs pixel-font mt-1">
              Semak semula kemudian
            </p>
          </div>
          /* End: Empty State */
        ) : (
          /* Start: Message Items */
          <div className="divide-y divide-gray-700 dark:divide-gray-600">
            {messages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => markAsRead(msg.id)}
                className={`surat-layang-item p-3 hover:bg-gray-700 dark:hover:bg-gray-600 cursor-pointer transition-colors ${
                  !msg.isRead ? 'bg-gray-750 dark:bg-gray-650' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-medium text-purple-300 pixel-font">
                    {msg.sender}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 pixel-font">
                    {formatTimeAgo(msg.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-gray-200 dark:text-gray-300 pixel-font break-words">
                  {msg.content.length > 100 
                    ? `${msg.content.substring(0, 100)}...` 
                    : msg.content
                  }
                </p>
                {!msg.isRead && (
                  <div className="mt-2 w-2 h-2 bg-purple-400 rounded-full"></div>
                )}
              </div>
            ))}
          </div>
          /* End: Message Items */
        )}
      </div>
      {/* End: Message List */}

      {/* Start: Box Footer */}
      {messages.length > 0 && (
        <div className="surat-layang-footer bg-gray-800 dark:bg-gray-700 px-3 py-2 border-t border-gray-600 dark:border-gray-500 text-center">
          <span className="text-xs text-gray-400 dark:text-gray-300 pixel-font">
            {messages.length} surat diterima
          </span>
        </div>
      )}
      {/* End: Box Footer */}
    </div>
  );
}
