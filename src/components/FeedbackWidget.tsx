"use client";

import { useState } from 'react';

export default function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (feedback.trim()) {
      // In a real app, this would submit to an API
      localStorage.setItem('user_feedback', feedback);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFeedback('');
        setIsOpen(false);
      }, 2000);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-pink-500 hover:bg-pink-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105 pixel-font"
        >
          💬
        </button>
      )}

      {isOpen && (
        <div className="retro-card p-4 w-80 shadow-2xl animate-fade-in">
          <div className="flex justify-between items-center mb-3">
            <h4 className="pixel-font text-sm font-bold text-gray-800 dark:text-gray-200">
              Feedback Kamu
            </h4>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-lg"
            >
              ✕
            </button>
          </div>

          {submitted ? (
            <div className="text-center py-4">
              <div className="text-3xl mb-2">✓</div>
              <p className="pixel-font text-sm text-gray-600 dark:text-gray-400">
                Terima kasih atas nasihat anda!
              </p>
            </div>
          ) : (
            <>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Cadangkan ciri atau berkongsi pendapat anda..."
                className="w-full h-24 p-2 text-sm retro-input bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded mb-3 pixel-font resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500"
                maxLength={200}
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {feedback.length}/200
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-3 py-1 text-xs pixel-font text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!feedback.trim()}
                    className="px-3 py-1 text-xs pixel-font text-white bg-cyan-500 hover:bg-cyan-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Hantar
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
