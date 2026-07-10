"use client";

import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'How do I create an account?',
    answer: 'Click on the "Sign Up" button in the top navigation bar, fill in your email and desired username, then verify your email address when you receive the confirmation email.'
  },
  {
    question: 'How do I change my profile picture?',
    answer: 'Go to Settings > Profile, click on your current avatar, and upload a new image. We support JPG, PNG, and GIF formats up to 5MB.'
  },
  {
    question: 'Can I customize my workspace?',
    answer: 'Yes! In Settings, you can choose from 5 different background themes and toggle between modern and CRT display modes.'
  },
  {
    question: 'How does reputation work?',
    answer: 'Reputation points are earned by participating in the community - posting in the guestbook, submitting feedback, and helping other residents. Higher reputation unlocks special badges and features.'
  },
  {
    question: 'How do I report a bug or issue?',
    answer: 'Please visit the Contact page or send an email to support@kampungsiber.com. Include screenshots if possible to help us resolve issues faster.'
  },
  {
    question: 'Is my data private?',
    answer: 'Yes, all your data is encrypted and stored securely. We never share your personal information with third parties without your explicit consent.'
  }
];

export default function HelpCenterWidget() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  return (
    <div className="retro-card p-4 w-full max-w-md">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">❓</span>
        <h3 className="pixel-font text-lg font-bold text-gray-800 dark:text-gray-200">
          Pusat Bantuan
        </h3>
      </div>

      <div className="space-y-2 max-h-80 overflow-y-auto">
        {FAQ_ITEMS.map((item, index) => (
          <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <button
              onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
              className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex justify-between items-center transition-colors"
            >
              <span className="text-sm text-gray-800 dark:text-gray-200 pixel-font">{item.question}</span>
              <span className="text-xl pixel-font">
                {openFAQ === index ? '✕' : '+'}
              </span>
            </button>
            
            {openFAQ === index && (
              <div className="px-3 py-2 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-600 dark:text-gray-400 pixel-font">
                  {item.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 text-center">
        <a 
          href="/contact" 
          className="text-sm text-cyan-600 hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-cyan-300 pixel-font"
        >
          Butuh bantuan lebih lanjut? Hubungi kami
        </a>
      </div>
    </div>
  );
}
