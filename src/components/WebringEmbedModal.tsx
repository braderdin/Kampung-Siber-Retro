"use client";
import { useState } from 'react';
import HumanFeedbackToast from '@/components/HumanFeedbackToast';

interface WebringEmbedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WebringEmbedModal({ isOpen, onClose }: WebringEmbedModalProps) {
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info' | 'warning'>('success');

  const embedCode = `<iframe src="https://kampung-siber.vercel.app/api/webring" width="300" height="100" frameborder="0" scrolling="no"></iframe>`;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setToastMessage('Kod embed berjaya disalin ke papan klip!');
      setToastType('success');
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (err) {
      console.error('Gagal menyalin kod:', err);
      setToastMessage('Gagal menyalin kod. Sila cuba semula.');
      setToastType('error');
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="retro-window-title-bar bg-gray-200 dark:bg-gray-700 px-4 py-2 border-b border-gray-300 dark:border-gray-600 flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">
            Sisitkan Webring
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:text-gray-200 font-bold text-lg leading-none"
            title="Tutup"
          >
            ✕
          </button>
        </div>
        <div className="p-4 sm:p-5 xs:p-4">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            Salin kod HTML di bawah untuk menyisitkan laman web kami ke laman anda.
          </p>

          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
              Kod Embed:
            </label>
            <textarea
              value={embedCode}
              readOnly
              rows={3}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md font-mono text-xs text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              onClick={(e) => (e.target as HTMLTextAreaElement).select()}
            />
          </div>

          <div className="flex flex-col sm:flex-row xs:flex-col gap-2">
            <button
              onClick={handleCopyCode}
              className="w-full sm:w-auto retro-btn-primary text-sm"
            >
              Salin Kod
            </button>
            <button
              onClick={handleClose}
              className="w-full sm:w-auto retro-btn-secondary text-sm"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>

      {showToast && (
        <HumanFeedbackToast
          message={toastMessage}
          type={toastType}
          duration={3000}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}