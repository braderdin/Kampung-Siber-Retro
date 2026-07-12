"use client";

import { useState, useEffect } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { enDictionary, msDictionary } from '@/i18n/dictionaries';
import HelpCenterWidget from '@/components/HelpCenterWidget';
import PixelCursorEffect from '@/components/PixelCursorEffect';
import HydrationGuard from '@/components/HydrationGuard';

export default function HelpPage() {
  const { language } = useLanguageStore();
  const t = language === 'ms' ? msDictionary : enDictionary;

  const [isClient, setIsClient] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('getting-started');

  useEffect(() => {
    setIsClient(true);
  }, []);

  const faqCategories = [
    {
      id: 'getting-started',
      title: '🚀 Getting Started',
      icon: '🚀',
      questions: [
        {
          q: 'How do I create my profile?',
          a: 'Click the "Sign Up" button in the top right corner, fill in your details, and verify your email address.'
        },
        {
          q: 'Can I customize my resident name?',
          a: 'Yes! Your resident name can include letters, numbers, and underscores up to 20 characters.'
        },
        {
          q: 'What browsers are supported?',
          a: 'All modern browsers including Chrome, Firefox, Safari, and Edge. For the best retro experience, use Chrome.'
        }
      ]
    },
    {
      id: 'games',
      title: '🎮 Games & Arcade',
      icon: '🎮',
      questions: [
        {
          q: 'How do I play the Brick Breaker game?',
          a: 'Move your mouse over the canvas to control the paddle. Click Start to begin. Break all blocks to win!'
        },
        {
          q: 'Are there high scores?',
          a: 'Yes! Your scores are saved locally. Check the High Scores table in the Cyber Cafe section.'
        },
        {
          q: 'Can I add more games?',
          a: 'Currently we have Brick Breaker Classic. More retro games are coming soon!'
        }
      ]
    },
    {
      id: 'journal',
      title: '📝 Journal & Links',
      icon: '📝',
      questions: [
        {
          q: 'How do I write a journal entry?',
          a: 'Go to your profile page, click "Write Entry", and start sharing your cyber adventures!'
        },
        {
          q: 'Can I format my journal entries?',
          a: 'Yes! You can use markdown-like formatting. Special words like "kampung", "siber", and "retro" will be highlighted.'
        },
        {
          q: 'How do I add links to my webring?',
          a: 'Visit your Links page and click "Add Link". You can organize them by category.'
        }
      ]
    }
  ];

  if (!isClient) {
    return (
      <main className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300 pt-16">
      <PixelCursorEffect />

      {/* Start: Header Section */}
      <div className="sticky top-16 z-40 bg-gradient-to-r from-teal-900/80 to-emerald-900/80 backdrop-blur-md border-b-2 border-dashed border-cyan-500/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold text-cyan-400 pixel-font flex items-center gap-3">
            <span className="text-4xl">❓</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-cyan-300">
              {t.helpTitle || 'Help & FAQ'}
            </span>
          </h1>
          <p className="text-sm text-gray-300 dark:text-gray-400 mt-1 pixel-font border-l-2 border-dashed border-pink-400/50 pl-3">
            {t.helpSubtitle || 'Your guide to navigating the cyber village'}
          </p>
        </div>
      </div>
      {/* End: Header Section */}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Start: Category Navigation */}
        <div className="flex flex-wrap gap-2 mb-6">
          {faqCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`
                retro-btn-secondary text-xs px-3 py-1 transition-all duration-200
                ${activeCategory === category.id
                  ? 'bg-cyan-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }
              `}
            >
              <span className="mr-1">{category.icon}</span>
              {category.title}
            </button>
          ))}
        </div>
        {/* End: Category Navigation */}

        {/* Start: FAQ Content */}
        <div className="retro-card border-2 border-dashed border-pink-400/30">
          <div className="retro-card-header bg-gray-200 dark:bg-gray-700 px-4 py-2 border-b-2 border-dashed border-gray-300 dark:border-gray-600">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 pixel-font flex items-center gap-2">
              <span className="text-2xl">
                {faqCategories.find(c => c.id === activeCategory)?.icon}
              </span>
              <span>
                {faqCategories.find(c => c.id === activeCategory)?.title}
              </span>
            </h2>
          </div>
          
          <div className="p-4">
            <div className="space-y-4">
              {faqCategories.find(c => c.id === activeCategory)?.questions.map((item, index) => (
                <details key={index} className="border-b-2 border-dashed border-gray-300 dark:border-gray-600 pb-3 last:border-b-0">
                  <summary className="cursor-pointer text-sm font-medium text-cyan-400 pixel-font flex items-center gap-2">
                    <span className="text-lg">❓</span>
                    <span>{item.q}</span>
                  </summary>
                  <p className="mt-2 text-xs text-gray-600 dark:text-gray-400 pixel-font">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
        {/* End: FAQ Content */}

        {/* Start: Help Center Widget */}
        <div className="mt-6">
          <HydrationGuard>
            <HelpCenterWidget />
          </HydrationGuard>
        </div>
        {/* End: Help Center Widget */}

        {/* Start: Contact Section */}
        <div className="retro-card mt-6 border-2 border-dashed border-blue-400/30">
          <div className="retro-card-header bg-gray-200 dark:bg-gray-700 px-4 py-2 border-b-2 border-dashed border-gray-300 dark:border-gray-600">
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 pixel-font flex items-center gap-2">
              <span className="text-xl">✉️</span>
              <span>Need More Help?</span>
            </h3>
          </div>
          <div className="p-4 text-center">
            <p className="text-xs text-gray-600 dark:text-gray-400 pixel-font mb-3">
              Send us a message and we'll get back to you within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button className="retro-btn-primary text-xs px-4 py-2">
                💬 Contact Support
              </button>
              <button className="retro-btn-secondary text-xs px-4 py-2">
                📧 Email Us
              </button>
            </div>
          </div>
        </div>
        {/* End: Contact Section */}
      </div>
    </main>
  );
}
