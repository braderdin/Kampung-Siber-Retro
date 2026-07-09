"use client";
import { useState, useEffect, useRef } from 'react';
import { ShoutboxMessage } from '@/types/shoutbox';
import { supabase } from '@/lib/supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface BroadcastPayload {
  new_message_id?: string;
  username?: string;
  message?: string;
  timestamp?: string;
  avatar?: string;
}

type AnyChannel = {
  on: (...args: unknown[]) => AnyChannel;
  subscribe: () => AnyChannel;
  send: (...args: unknown[]) => AnyChannel;
};

// Rate limiting constants
const COOLDOWN_DURATION = 5000; // 5 seconds in milliseconds
const COOLDOWN_LABEL = 'Tunggu';

export default function Shoutbox() {
  const [messages, setMessages] = useState<ShoutboxMessage[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [username, setUsername] = useState<string>('Anonymous');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<AnyChannel | null>(null);
  
  // Start: Rate Limiting State
  const [isCooldownActive, setIsCooldownActive] = useState(false);
  const [cooldownTimeLeft, setCooldownTimeLeft] = useState(0);
  const cooldownTimerRef = useRef<NodeJS.Timeout | null>(null);
  // End: Rate Limiting State

  useEffect(() => {
    const storedUsername = localStorage.getItem('username') || 'Anonymous';
    setUsername(storedUsername);
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    const channel = supabase.channel('shoutbox');
    channelRef.current = channel as unknown as AnyChannel;

    (channel as unknown as { on: (event: string, opts: Record<string, string>, cb: (payload: BroadcastPayload) => void) => RealtimeChannel })
      .on('broadcast', { event: 'new_message' }, (payload: BroadcastPayload) => {
        const receivedMessage: ShoutboxMessage = {
          id: payload.new_message_id || Date.now().toString(),
          username: payload.username || 'Anonymous',
          message: payload.message || '',
          timestamp: payload.timestamp || new Date().toISOString(),
          avatar: payload.avatar,
        };

        setMessages(prev => [...prev, receivedMessage]);
      });

    channel.subscribe();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channel);
        channelRef.current = null;
      }
      // Clear cooldown timer on unmount
      if (cooldownTimerRef.current) {
        clearInterval(cooldownTimerRef.current);
      }
    };
  }, []);

  // Start: Cooldown Timer Effect
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
  // End: Cooldown Timer Effect

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const startCooldown = () => {
    setIsCooldownActive(true);
    setCooldownTimeLeft(COOLDOWN_DURATION);
  };

  const handleBroadcast = (message: ShoutboxMessage) => {
    setMessages(prev => [...prev, message]);
    setInputValue('');

    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'new_message',
        payload: {
          new_message_id: message.id,
          username: message.username,
          message: message.message,
          timestamp: message.timestamp,
          avatar: message.avatar,
        },
      });
    }
  };

  // Start: Handle Form Submission with Rate Limiting
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    // Check if cooldown is active
    if (isCooldownActive) {
      return;
    }

    const newMessage: ShoutboxMessage = {
      id: Date.now().toString(),
      username: username,
      message: inputValue.trim(),
      timestamp: new Date().toISOString(),
      avatar: undefined,
    };

    handleBroadcast(newMessage);
    
    // Start cooldown period
    startCooldown();
  };
  // End: Handle Form Submission with Rate Limiting

  // Start: Calculate progress for cooldown bar
  const cooldownProgress = isCooldownActive 
    ? ((COOLDOWN_DURATION - cooldownTimeLeft) / COOLDOWN_DURATION) * 100 
    : 0;
  
  const cooldownSeconds = Math.ceil(cooldownTimeLeft / 1000);
  // End: Calculate progress for cooldown bar

  // Start: Render Shoutbox Component
  return (
    <div className="w-full retro-window retro-border">
      <div className="retro-window-title-bar bg-gray-200 dark:bg-gray-700 px-3 py-2 border-b border-gray-300 dark:border-gray-600">
        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">
          <span className="mr-2">💬</span>
          Shoutbox Komuniti
        </h3>
      </div>
      <div className="retro-window-client p-4">
        <div className="mb-4 max-h-[350px] overflow-y-auto space-y-2">
          {messages.map((msg) => (
            <div key={msg.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
              <div className="flex items-start space-x-2">
                {msg.avatar ? (
                  <img src={msg.avatar} alt={msg.username} className="w-8 h-8 rounded-full" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-xs font-bold text-gray-700 dark:text-gray-300">
                    {msg.username.charAt(0)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">{msg.username}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{msg.message}</p>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Start: Rate Limit Indicator */}
        {isCooldownActive && (
          <div className="mb-2">
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center mb-1">
              Tunggu {cooldownSeconds}s... (Spam blocked)
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
        
        {/* Start: Submission Form */}
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Tulis mesej anda di sini..."
            className="flex-1 retro-input text-sm px-3 py-2"
            maxLength={200}
            disabled={isCooldownActive}
          />
          <button
            type="submit"
            disabled={isCooldownActive || !inputValue.trim()}
            className={`retro-btn-primary px-4 py-2 text-sm ${isCooldownActive ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isCooldownActive ? `Tunggu ${cooldownSeconds}s...` : 'Hantar'}
          </button>
        </form>
        {/* End: Submission Form */}
      </div>
    </div>
  );
}