"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import TermsModal from '@/components/TermsModal';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || 'placeholder-key';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface SignInFormData {
  email: string;
  password: string;
}

interface SignInResponse {
  success: boolean;
  error?: string;
  needsVerification?: boolean;
}

interface RetroErrorNotificationProps {
  message: string;
  onClose: () => void;
  isBlinking?: boolean;
}

function RetroErrorNotification({ message, onClose, isBlinking = false }: RetroErrorNotificationProps) {
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isBlinking && notificationRef.current) {
      const interval = setInterval(() => {
        if (notificationRef.current) {
          notificationRef.current.classList.toggle('retro-blink-animation');
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isBlinking]);

  return (
    <div 
      ref={notificationRef}
      className="retro-error-notification animate-fade-in retro-blinking"
    >
      <div className="retro-error-window">
        <div className="retro-error-title-bar">
          <span className="retro-error-title">⚠️ Notifikasi Ralat</span>
          <button
            onClick={onClose}
            className="retro-error-close"
            title="Tutup"
          >
            ×
          </button>
        </div>
        <div className="retro-error-content">
          <div className="retro-error-icon">⚠️</div>
          <div className="retro-error-message">{message}</div>
          <div className="retro-error-instructions">
            <div className="retro-error-instruction">
              <span className="retro-error-step">1.</span>
              <span>Sila semak emel anda untuk pautan verifikasi</span>
            </div>
            <div className="retro-error-instruction">
              <span className="retro-error-step">2.</span>
              <span>Tekan "Set Semula Kata Laluan" di bawah</span>
            </div>
            <div className="retro-error-instruction">
              <span className="retro-error-step">3.</span>
              <span>Atau hubungi sokongan jika masih ada masalah</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  const [formData, setFormData] = useState<SignInFormData>({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [errorNotificationMessage, setErrorNotificationMessage] = useState('');
  const [isBlinking, setIsBlinking] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setNeedsVerification(false);
    setShowErrorNotification(false);
    setIsBlinking(false);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) {
        if (signInError.message === 'User not found' || signInError.message === 'Invalid login credentials') {
          const errorMsg = 'Emasukan tidak sah';
          setError(errorMsg);
          setErrorNotificationMessage('Emel atau kata laluan tidak tepat. Sila semak dan cuba semula.');
          setShowErrorNotification(true);
          setIsBlinking(true);
        } else if (signInError.message === 'User not confirmed') {
          setNeedsVerification(true);
        } else {
          throw signInError;
        }
      }

      if (data?.user && !data.user.email_confirmed_at) {
        setNeedsVerification(true);
      }

      if (!needsVerification && !error) {
        // Check if user has accepted terms from localStorage
        const hasAcceptedTerms = localStorage.getItem('terms_accepted') === 'true';
        if (!hasAcceptedTerms) {
          setShowTermsModal(true);
        } else {
          router.push('/dashboard');
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Log masuk gagal';
      setError(errorMessage);
      setErrorNotificationMessage(errorMessage);
      setShowErrorNotification(true);
      setIsBlinking(true);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    setNeedsVerification(false);
    setShowErrorNotification(false);
    setIsBlinking(false);

    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (oauthError) {
        throw oauthError;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Log masuk Google gagal';
      setError(errorMessage);
      setErrorNotificationMessage(errorMessage);
      setShowErrorNotification(true);
      setIsBlinking(true);
      setLoading(false);
    }
  };

  const handleCloseErrorNotification = () => {
    setShowErrorNotification(false);
    setError(null);
    setIsBlinking(false);
  };

  const handleTermsAccept = () => {
    localStorage.setItem('terms_accepted', 'true');
    setShowTermsModal(false);
    router.push('/dashboard');
  };

  const handleTermsDecline = () => {
    setShowTermsModal(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6">
      {showErrorNotification && (
        <RetroErrorNotification
          message={errorNotificationMessage}
          onClose={handleCloseErrorNotification}
          isBlinking={isBlinking}
        />
      )}
      
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100 pixel-font">
            Hey there! Log Masuk ke akaun anda
          </h2>
        </div>
        
        {needsVerification && (
          <div className="rounded-md bg-yellow-100 dark:bg-yellow-900 p-4 retro-blinking">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              akaun anda belum diverifikasi. Sila semak emel anda untuk pautan verifikasi.
            </p>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-none shadow-sm -space-y-px">
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
                onChange={handleInputChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 dark:text-gray-100 dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Emel"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Kata Laluan
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 dark:text-gray-100 dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Kata Laluan"
              />
            </div>
          </div>

          {error && !showErrorNotification && (
            <div className="text-sm text-red-600 dark:text-red-400 text-center">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Log Masuk...' : 'Log Masuk'}
            </button>
          </div>
          
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-100 dark:bg-gray-900 text-gray-500">ATAU</span>
            </div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Log Masuk dengan Google...' : 'Log Masuk dengan Google'}
          </button>
          
          {/* Start: Password Recovery Links */}
          <div className="text-center text-sm">
            <a
              href="/password_reset"
              className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Set Semula Kata Laluan
            </a>
            <span className="mx-2 text-gray-500">|</span>
            <a
              href="/forgot_username"
              className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Lupa Nama Pengguna
            </a>
          </div>
          {/* End: Password Recovery Links */}
        </form>
      </div>

      {/* Terms Modal */}
      <TermsModal
        isOpen={showTermsModal}
        onClose={handleTermsDecline}
        onAccept={handleTermsAccept}
      />
    </main>
  );
}