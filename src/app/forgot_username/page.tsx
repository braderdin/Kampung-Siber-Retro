// Start: Imports
'use client';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import HumanFeedbackToast from '@/components/HumanFeedbackToast';
// End: Imports

// Start: Supabase Client Configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || 'placeholder-key';
const supabase = createClient(supabaseUrl, supabaseAnonKey);
// End: Supabase Client Configuration

// Start: Type Definitions
interface ForgotUsernameFormData {
  email: string;
}
// End: Type Definitions

// Start: ForgotUsernamePage Component
export default function ForgotUsernamePage() {
  // Start: State Management
  const [formData, setFormData] = useState<ForgotUsernameFormData>({ email: '' });
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  // End: State Management

  // Start: Handle Input Changes
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ email: event.target.value });
  };
  // End: Handle Input Changes

  // Start: Handle Form Submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setToastMessage(null);

    try {
      const { data, error: fetchError } = await supabase.from('profiles').select('username').eq('email', formData.email).single();

      if (fetchError || !data) {
        setToastMessage('Tiada rekod padanan ditemui dalam pelayan.');
        setUsername(null);
        return;
      }

      setUsername(data.username);
      setToastMessage('Pemberitahuan berjaya dimuatkan.');
    } catch {
      setToastMessage('Tiada rekod padanan ditemui dalam pelayan.');
      setUsername(null);
    } finally {
      setLoading(false);
    }
  };
  // End: Handle Form Submission

  // Start: Render ForgotUsernamePage Component
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-12 dark:bg-gray-900 sm:px-6">
      <div className="w-full max-w-md space-y-8 rounded border border-gray-300 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">Lupa Nama Pengguna</h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">Masukkan emel anda untuk mendapatkan nama pengguna anda.</p>
        </div>

        {username ? (
          <div className="rounded border border-emerald-300 bg-emerald-50 p-4 text-center text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
            Nama pengguna anda ialah: <strong>{username}</strong>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="w-full rounded border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              placeholder="Emel"
            />

            <button type="submit" disabled={loading} className="w-full rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
              {loading ? 'Mencari...' : 'Cari Nama Pengguna'}
            </button>
          </form>
        )}

        {toastMessage ? <HumanFeedbackToast message={toastMessage} type="warning" duration={2600} onClose={() => setToastMessage(null)} /> : null}
      </div>
    </div>
  );
}
// End: ForgotUsernamePage Component
