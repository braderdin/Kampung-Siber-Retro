"use client";
import { useState, useEffect, useRef } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { enDictionary, msDictionary } from '@/i18n/dictionaries';

interface ShoutboxMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

interface ShoutboxProps {
  className?: string;
  maxMessages?: number;
}

export default function Shoutbox({ 
  className,
  maxMessages = 10 
}: ShoutboxProps) {
  const [messages, setMessages] = useState<ShoutboxMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [username, setUsername] = useState('Anonymous');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Rate limiting constants
  const COOLDOWN_DURATION = 3000;
  const [isCooldownActive, setIsCooldownActive] = useState(false);
  const [cooldownTimeLeft, setCooldownTimeLeft] = useState(0);
  const cooldownTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username') || 'Anonymous';
    setUsername(storedUsername);
  }, []);

  useEffect(() => {
    const loadMessages = async () => {
      setIsLoading(true);
      try {
        const storedMessages = localStorage.getItem('shoutbox_messages');
        if (storedMessages) {
          const parsedMessages = JSON.parse(storedMessages) as ShoutboxMessage[];
          const sortedMessages = parsedMessages
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, maxMessages);
          setMessages(sortedMessages);
        } else {
          setMessages([]);
        }
      } catch (error) {
        console.error('Error loading messages:', error);
        setMessages([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [maxMessages]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (!isCooldownActive) return;

    const timer = setInterval(() => {
      setCooldownTimeLeft(prev => {
        if (prev <= 1000) {
          setIsCooldownActive(false);
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    cooldownTimerRef.current = timer;

    return () => {
      if (cooldownTimerRef.current) {
        clearInterval(cooldownTimerRef.current);
      }
    };
  }, [isCooldownActive]);

  const formatTimeAgo = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === '' || isCooldownActive) return;

    const newMessage: ShoutboxMessage = {
      id: Date.now().toString(),
      sender: username,
      content: inputValue.trim(),
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    const updatedMessages = [newMessage, ...messages];
    setMessages(updatedMessages.slice(0, maxMessages));
    setInputValue('');
    setIsCooldownActive(true);
    setCooldownTimeLeft(COOLDOWN_DURATION);

    // Save to localStorage
    localStorage.setItem('shoutbox_messages', JSON.stringify(updatedMessages.slice(0, maxMessages)));
  };

  const markAsRead = (id: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === id ? { ...msg, isRead: true } : msg
      )
    );
  };

  if (isLoading) {
    return (
      <div className={`shoutbox ${className || ''}`}>
        <div className="text-center py-4 text-gray-500 dark:text-gray-400 pixel-font">
          Loading messages...
        </div>
      </div>
    );
  }

  const cooldownProgress = isCooldownActive 
    ? ((COOLDOWN_DURATION - cooldownTimeLeft) / COOLDOWN_DURATION) * 100 
    : 0;
  
  const cooldownSeconds = Math.ceil(cooldownTimeLeft / 1000);

  return (
    <div className={`shoutbox ${className || ''}`}>
      {/* Start: Box Header */}
      <div className="shoutbox-header bg-gray-800 dark:bg-gray-700 px-3 py-2 border-b border-gray-600 dark:border-gray-500 flex justify-between items-center">
        <h3 className="text-sm font-bold text-gray-100 dark:text-gray-200 pixel-font flex items-center gap-2">
          <span className="text-lg">💬</span>
          <span>Shoutbox Komuniti</span>
        </h3>
      </div>
      {/* End: Box Header */}

      {/* Start: Message List */}
      <div className="shoutbox-messages max-h-60 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="shoutbox-empty p-4 text-center">
            <div className="text-3xl mb-2">📭</div>
            <p className="text-gray-500 dark:text-gray-400 text-sm pixel-font">
              No messages yet
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-700 dark:divide-gray-600">
            {messages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => markAsRead(msg.id)}
                className={`shoutbox-item p-3 hover:bg-gray-700 dark:hover:bg-gray-600 cursor-pointer transition-colors ${
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
        )}
      </div>
      {/* End: Message List */}

      {/* Start: Rate Limit Indicator */}
      {isCooldownActive && (
        <div className="mb-2">
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center mb-1">
            Wait {cooldownSeconds}s... (Spam blocked)
          </div>
          <div className="w-full h-1 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden">
            <div 
              className="h-full bg-yellow-500 transition-all duration-1000"
              style={{ width: `${100 - cooldownProgress}%` }}
            />
          </div>
        </div>
      )}
      {/* End: Rate Limit Indicator */}

      {/* Start: Message Form */}
      <form onSubmit={handleSendMessage} className="flex space-x-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 retro-input text-sm px-3 py-2"
          maxLength={200}
          disabled={isCooldownActive}
        />
        <button
          type="submit"
          disabled={isCooldownActive || !inputValue.trim()}
          className={`retro-btn-primary px-4 py-2 text-sm ${isCooldownActive ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isCooldownActive ? `Wait ${cooldownSeconds}s...` : 'Send'}
        </button>
      </form>
      {/* End: Message Form */}

      {/* Start: Footer */}
      {messages.length > 0 && (
        <div className="shoutbox-footer bg-gray-800 dark:bg-gray-700 px-3 py-2 border-t border-gray-600 dark:border-gray-500 text-center">
          <span className="text-xs text-gray-400 dark:text-gray-300 pixel-font">
            {messages.length} messages
          </span>
        </div>
      )}
      {/* End: Footer */}
    </div>
  );
}
