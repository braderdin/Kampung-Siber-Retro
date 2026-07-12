'use client';

// Start: Imports
import { useState } from 'react';
import HumanFeedbackToast from '@/components/HumanFeedbackToast';
// End: Imports

// Start: Type Definitions
interface SettingsGithubProps {
  username?: string;
  className?: string;
}
// End: Type Definitions

// Start: SettingsGithub Component
export default function SettingsGithub({ username = 'pengguna', className }: SettingsGithubProps) {
  // Start: State Management
  const [githubUsername, setGithubUsername] = useState('');
  const [repository, setRepository] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  // End: State Management

  // Start: Handle Connection
  const handleConnection = (event: React.FormEvent) => {
    event.preventDefault();

    if (!githubUsername.trim() || !repository.trim()) {
      setToastMessage('Sila lengkapkan medan GitHub sebelum menyambung.');
      return;
    }

    setToastMessage(`Sambungan GitHub untuk ${username} sedang disediakan.`);
    setGithubUsername('');
    setRepository('');
  };
  // End: Handle Connection

  // Start: Render SettingsGithub
  return (
    <div className={`rounded border border-gray-300 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900 ${className || ''}`}>
      <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">Sambungan GitHub</h2>
      <p className="mb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        Sambungkan akaun GitHub anda untuk menyelaraskan repositori, tugasan, dan kerja kolaboratif dalam Tetapan ini.
      </p>

      <form className="space-y-3" onSubmit={handleConnection}>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="githubUsername">
            Nama pengguna GitHub
          </label>
          <input
            id="githubUsername"
            value={githubUsername}
            onChange={(event) => setGithubUsername(event.target.value)}
            className="w-full rounded border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none ring-0 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            placeholder="contoh: open-source"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="repository">
            Nama repositori
          </label>
          <input
            id="repository"
            value={repository}
            onChange={(event) => setRepository(event.target.value)}
            className="w-full rounded border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none ring-0 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            placeholder="contoh: kampung-siber-retro"
          />
        </div>

        <button type="submit" className="retro-btn-primary px-4 py-2 text-sm">
          Sambung GitHub
        </button>
      </form>

      {toastMessage ? (
        <HumanFeedbackToast
          message={toastMessage}
          type="info"
          duration={2800}
          onClose={() => setToastMessage(null)}
        />
      ) : null}
    </div>
  );
}
// End: SettingsGithub Component
