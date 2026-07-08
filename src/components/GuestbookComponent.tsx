// Start: Imports
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
// End: Imports

// Start: Supabase Client Configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || 'placeholder-key';
const supabase = createClient(supabaseUrl, supabaseAnonKey);
// End: Supabase Client Configuration

// Start: Type Definitions
interface GuestbookEntry {
  id: number;
  username: string;
  message: string;
  timestamp: string;
}

interface GuestbookComponentProps {
  className?: string;
}
// End: Type Definitions

// Start: GuestbookComponent
export default function GuestbookComponent({ className }: GuestbookComponentProps) {
  // Start: State Management
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<any>(null);
  // End: State Management

  // Start: Ref for auto-scroll
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // End: Ref for auto-scroll

  // Start: Load Initial Entries
  useEffect(() => {
    fetchEntries();
  }, []);
  // End: Load Initial Entries

  // Start: Fetch Entries from Supabase
  const fetchEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('guestbook_entries')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      setEntries(data as GuestbookEntry[] || []);
    } catch (err) {
      console.error('Error fetching entries:', err);
      setError('Gagal memuat entri buku pelawat');
    }
  };
  // End: Fetch Entries from Supabase

  // Start: Realtime Subscription Setup
  useEffect(() => {
    const subscription = supabase
      .channel('guestbook_entries')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'guestbook_entries' },
        (payload) => {
          const newEntry = payload.new as GuestbookEntry;
          setEntries(prev => [newEntry, ...prev]);
        }
      )
      .subscribe();
    
    setSubscription(subscription);
    
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);
  // End: Realtime Subscription Setup

  // Start: Auto Scroll to Bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries]);
  // End: Auto Scroll to Bottom

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

  // Start: Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !message.trim()) {
      setError('Nama pengguna dan mesej adalah diperlukan');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    const newEntry: GuestbookEntry = {
      id: Date.now(),
      username: username.trim(),
      message: message.trim(),
      timestamp: new Date().toISOString(),
    };
    
    try {
      const { error } = await supabase
        .from('guestbook_entries')
        .insert([newEntry]);
      
      if (error) throw error;
      setMessage('');
    } catch (err) {
      console.error('Error adding entry:', err);
      setError('Gagal menambah entri');
    }
    
    setLoading(false);
  };
  // End: Handle Form Submission

  // Start: Render Guestbook Card
  return (
    <div className={`retro-card ${className || ''}`}>
      {/* Start: Card Header */}
      <div className="retro-card-header">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">
          🖋️ Buku Pelawat Retro
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Tandatangani buku dan lihat apa yang orang lain telah katakan!
        </p>
      </div>
      {/* End: Card Header */}

      {/* Start: Entries List */}
      <div className="mb-4 max-h-60 overflow-y-auto retroscrollbar">
        {entries.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm py-4">
            Tiada entri lagi. Jadilah yang pertama menandatangani!
          </p>
        ) : (
          entries.map((entry) => (
            <div
              key={entry.id}
              className="retro-entry mb-3 p-3 bg-gray-50 dark:bg-gray-800 rounded border-l-4 border-blue-500"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                  {entry.username}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {formatTimestamp(entry.timestamp)}
                </span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {entry.message}
              </p>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      {/* End: Entries List */}

      {/* Start: Submission Form */}
      <form onSubmit={handleSubmit} className="retro-form">
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Nama anda..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="retro-input w-full"
            maxLength={30}
            disabled={loading}
          />
          <textarea
            placeholder="Mesej anda..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="retro-textarea w-full"
            rows={2}
            maxLength={200}
            disabled={loading}
          />
        </div>
        
        {error && (
          <p className="text-xs text-red-500 mt-1">{error}</p>
        )}
        
        <button
          type="submit"
          disabled={loading || !username.trim() || !message.trim()}
          className="retro-btn-primary w-full mt-2"
        >
          {loading ? 'Menandatangani...' : 'Tandatangani Buku Pelawat'}
        </button>
      </form>
      {/* End: Submission Form */}

      {/* Start: Footer Controls */}
      <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div className="text-xs text-gray-400 dark:text-gray-500">
          {entries.length} {entries.length === 1 ? 'entri' : 'entri'}
        </div>
      </div>
      {/* End: Footer Controls */}
    </div>
  );
}
