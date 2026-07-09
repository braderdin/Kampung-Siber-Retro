// Start: Imports
'use client';
import { useEffect, useState } from 'react';
import { createClient, type Session } from '@supabase/supabase-js';
// End: Imports

// Start: Supabase Client Configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || 'placeholder-key';
const supabase = createClient(supabaseUrl, supabaseAnonKey);
// End: Supabase Client Configuration

// Start: Type Definitions
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
// End: Type Definitions

// Start: Password Strength Evaluator
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
// End: Password Strength Evaluator

// Start: PasswordResetPage Component
export default function PasswordResetPage() {
  // Start: State Management
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
  // End: State Management

  // Start: Check for Session on Mount
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };
    getSession();
  }, []);
  // End: Check for Session on Mount

  // Start: Handle Input Changes
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
  // End: Handle Input Changes

  // Start: Handle Form Submission
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
  // End: Handle Form Submission

  // Start: Render PasswordResetPage Component
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            Set Semula Kata Laluan
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
            Masukkan kata laluan baru anda
          </p>
        </div>
        
        {success ? (
          <div className="text-center py-4">
            <div className="rounded-md bg-green-100 dark:bg-green-900 p-4">
              <p className="text-sm text-green-800 dark:text-green-200">
                Kata laluan berjaya diset semula!
              </p>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="text-sm text-red-600 dark:text-red-400 text-center">
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
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 dark:text-gray-100 dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm bg-gray-100 dark:bg-gray-700"
                placeholder="Emel"
              />
            </div>
            {/* End: Email Field (Disabled) */}

            {/* Start: New Password Field */}
            <div>
              <label htmlFor="newPassword" className="sr-only">
                Kata Laluan Baru
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.newPassword}
                onChange={handleInputChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 dark:text-gray-100 dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Kata Laluan Baru"
              />
            </div>
            {/* End: New Password Field */}

            {/* Start: Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Pastikan Kata Laluan
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 dark:text-gray-100 dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Pastikan Kata Laluan"
              />
            </div>
            {/* End: Confirm Password Field */}

            {/* Start: Password Strength Indicator */}
            <div className="retro-password-strength-indicator">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                  Kekuatan Kata Laluan:
                </span>
                <span className={`text-xs font-bold ${passwordStrength.color.replace('bg-', 'text-').replace('-500', '')}`}>
                  {passwordStrength.label}
                </span>
              </div>
              
              <div className="flex space-x-1 mb-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`w-8 h-2 rounded ${
                      passwordStrength.score >= level
                        ? passwordStrength.color
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                ))}
              </div>
              
              {passwordStrength.message && (
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  {passwordStrength.message}
                </div>
              )}
            </div>
            {/* End: Password Strength Indicator */}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sedang diset semula...' : 'Set Semula Kata Laluan'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
// End: PasswordResetPage Component