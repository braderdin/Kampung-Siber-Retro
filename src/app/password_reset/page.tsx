"use client";

import { useEffect, useState } from 'react';
import { createClient, type Session } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || 'placeholder-key';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface PasswordResetFormData {
  email: string;
  newPassword: string;
  confirmPassword: string;
}

interface PasswordResetResponse {
  success: boolean;
  error?: string;
}

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
  message: string;
}

function evaluatePasswordStrength(password: string): PasswordStrength {
  let score = 0;
  let feedback = '';

  if (password.length >= 8) {
    score += 1;
  }
  if (password.length >= 12) {
    score += 1;
  }
  if (/[A-Z]/.test(password)) {
    score += 1;
  }
  if (/[a-z]/.test(password)) {
    score += 1;
  }
  if (/[0-9]/.test(password)) {
    score += 1;
  }
  if (/[^A-Za-z0-9]/.test(password)) {
    score += 1;
  }

  if (score >= 5) {
    return { score: 5, label: 'Sangat Kuat', color: 'bg-green-500', message: 'Kata laluan anda sangat selamat!' };
  } else if (score >= 4) {
    return { score: 4, label: 'Kuat', color: 'bg-emerald-500', message: 'Kata laluan yang baik' };
  } else if (score >= 3) {
    return { score: 3, label: 'Sederhana', color: 'bg-yellow-500', message: 'Tambah lebih banyak simbol atau perkataan' };
  } else if (score >= 2) {
    return { score: 2, label: 'Lemah', color: 'bg-orange-500', message: 'Gunakan perkataan yang lebih panjang' };
  } else {
    return { score: 1, label: 'Sangat Lemah', color: 'bg-red-500', message: 'Sila pilih kata laluan yang lebih selamat' };
  }
}

export default function PasswordResetPage() {
  const [formData, setFormData] = useState<PasswordResetFormData>({
    email: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    label: 'Sila taip kata laluan',
    color: 'bg-gray-300',
    message: '',
  });

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };
    getSession();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'newPassword') {
      const strength = evaluatePasswordStrength(value);
      setPasswordStrength(strength);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Kata laluan baru tidak sepadan');
      setLoading(false);
      return;
    }

    if (passwordStrength.score < 3) {
      setError('Sila pilih kata laluan yang lebih selamat');
      setLoading(false);
      return;
    }

    if (!session) {
      setError('Sila log masuk untuk set kata laluan');
      setLoading(false);
      return;
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: formData.newPassword,
      });

      if (updateError) {
        throw updateError;
      }

      setSuccess(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Gagal set kata laluan';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100 pixel-font">
            Set Semula Kata Laluan
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300 pixel-font">
            Masukkan kata laluan baru anda
          </p>
        </div>
        
        {success ? (
          <div className="text-center py-4">
            <div className="retro-alert-banner bg-green-100 dark:bg-green-900 border border-green-500 dark:border-green-400 rounded p-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">✅</span>
                <p className="text-sm text-green-800 dark:text-green-200 font-bold pixel-font">
                  Kata laluan berjaya diset semula!
                </p>
              </div>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="text-sm text-red-600 dark:text-red-400 text-center retro-alert-banner">
                {error}
              </div>
            )}
            
            {/* Start: Email Field (Disabled) */}
            <div>
              <label htmlFor="email" className="sr-only">
                Emel
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                disabled
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 dark:text-gray-100 dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm bg-gray-100 dark:bg-gray-700 retro-input"
                placeholder="Emel"
              />
            </div>
            {/* End: Email Field (Disabled) */}

            {/* Start: New Password Field */}
            <div>
              <label htmlFor="newPassword" className="sr-only">
                Kata Laluan Baru
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 dark:text-gray-100 dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm retro-input"
                  placeholder="Kata Laluan Baru"
                />
                <span className="absolute inset-y-0 right-3 flex items-center text-gray-400">
                  🔒
                </span>
              </div>
            </div>
            {/* End: New Password Field */}

            {/* Start: Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Pastikan Kata Laluan
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 dark:text-gray-100 dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm retro-input"
                  placeholder="Pastikan Kata Laluan"
                />
                <span className="absolute inset-y-0 right-3 flex items-center text-gray-400">
                  ✅
                </span>
              </div>
            </div>
            {/* End: Confirm Password Field */}

            {/* Start: Password Strength Indicator */}
            <div className="retro-password-strength-indicator">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-600 dark:text-gray-400 font-medium pixel-font">
                  Kekuatan Kata Laluan:
                </span>
                <span className={`text-xs font-bold ${passwordStrength.color.replace('bg-', 'text-').replace('-500', '')}`}>
                  {passwordStrength.label}
                </span>
              </div>
              
              {/* Start: Progressive Strength Bars */}
              <div className="flex space-x-1 mb-3">
                {[
                  { label: 'Lemah', color: 'bg-red-500' },
                  { label: 'Sederhana', color: 'bg-orange-500' },
                  { label: 'Sedang', color: 'bg-yellow-500' },
                  { label: 'Kuat', color: 'bg-emerald-500' },
                  { label: 'Sangat Kuat', color: 'bg-green-500' },
                ].map((level, index) => (
                  <div key={level.label} className="flex flex-col items-center">
                    <div className={`w-8 h-2 rounded ${
                      passwordStrength.score >= index + 1
                        ? level.color
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`} />
                    <span className="text-xs text-gray-400 mt-1 pixel-font">
                      {level.label}
                    </span>
                  </div>
                ))}
              </div>
              {/* End: Progressive Strength Bars */}
              
              {passwordStrength.message && (
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 pixel-font">
                  {passwordStrength.message}
                </div>
              )}
              
              {/* Start: Password Tips */}
              <div className="text-xs text-gray-400 dark:text-gray-500 pixel-font">
                <div className="flex gap-2">
                  <span className={passwordStrength.score >= 1 ? 'text-green-500' : 'text-gray-400'}>✓</span>
                  <span>Minimum 8 aksara</span>
                </div>
                <div className="flex gap-2">
                  <span className={passwordStrength.score >= 2 ? 'text-green-500' : 'text-gray-400'}>✓</span>
                  <span>Minimal 12 aksara</span>
                </div>
                <div className="flex gap-2">
                  <span className={passwordStrength.score >= 3 ? 'text-green-500' : 'text-gray-400'}>✓</span>
                  <span>Sertakan aksara besar</span>
                </div>
                <div className="flex gap-2">
                  <span className={passwordStrength.score >= 4 ? 'text-green-500' : 'text-gray-400'}>✓</span>
                  <span>Sertakan aksara kecil</span>
                </div>
                <div className="flex gap-2">
                  <span className={passwordStrength.score >= 5 ? 'text-green-500' : 'text-gray-400'}>✓</span>
                  <span>Sertakan nombor & simbol</span>
                </div>
              </div>
              {/* End: Password Tips */}
            </div>
            {/* End: Password Strength Indicator */}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed retro-btn-primary"
              >
                {loading ? 'Sedang diset semula...' : 'Set Semula Kata Laluan'}
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
