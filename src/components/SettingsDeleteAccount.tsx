'use client';

// Start: Imports
import { useState } from 'react';
import HumanFeedbackToast from '@/components/HumanFeedbackToast';
// End: Imports

// Start: Type Definitions
interface SettingsDeleteAccountProps {
  className?: string;
}
// End: Type Definitions

// Start: SettingsDeleteAccount Component
export default function SettingsDeleteAccount({ className }: SettingsDeleteAccountProps) {
  // Start: State Management
  const [confirmText, setConfirmText] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  // End: State Management

  // Start: Handle Deletion
  const handleDeletion = (event: React.FormEvent) => {
    event.preventDefault();

    if (confirmText.trim().toLowerCase() !== 'padam akaun') {
      setToastMessage('Sila taip "Padam Akaun" untuk mengesahkan pemadaman.');
      return;
    }

    setToastMessage('Permintaan pemadaman akaun telah dihantar ke Pemberitahuan keselamatan.');
    setConfirmText('');
  };
  // End: Handle Deletion

  // Start: Render SettingsDeleteAccount
  return (
    <div className={`rounded border border-red-300 bg-white p-6 shadow-sm dark:border-red-800 dark:bg-gray-900 ${className || ''}`}>
      <h2 className="mb-2 text-xl font-semibold text-red-600">Padam Akaun</h2>
      <p className="mb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        Tindakan ini tidak boleh dibatalkan. Semua data anda akan dipadamkan secara kekal setelah pengesahan lengkap.
      </p>

      <form className="space-y-3" onSubmit={handleDeletion}>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="confirmDelete">
            Taip “Padam Akaun” untuk mengesahkan
          </label>
          <input
            id="confirmDelete"
            value={confirmText}
            onChange={(event) => setConfirmText(event.target.value)}
            className="w-full rounded border border-red-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none dark:border-red-800 dark:bg-gray-800 dark:text-gray-100"
            placeholder="Padam Akaun"
          />
        </div>

        <button type="submit" className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">
          Padam Akaun
        </button>
      </form>

      {toastMessage ? (
        <HumanFeedbackToast
          message={toastMessage}
          type="warning"
          duration={3200}
          onClose={() => setToastMessage(null)}
        />
      ) : null}
    </div>
  );
}
// End: SettingsDeleteAccount Component
