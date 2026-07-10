"use client";

import { useState, useEffect } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { enDictionary, msDictionary } from '@/i18n/dictionaries';

interface Quote {
  id: number;
  text: string;
  author: string;
  category: string;
}

const QUOTE_DATA: Record<string, Quote[]> = {
  en: [
    {
      id: 1,
      text: "In the digital age, we are all connected through the wires of imagination and code.",
      author: "Kampung Siber Collective",
      category: "philosophy",
    },
    {
      id: 2,
      text: "Every line of code is a pixel in the masterpiece of our digital civilization.",
      author: "Retro Coder",
      category: "coding",
    },
    {
      id: 3,
      text: "The future is built on the foundations of retro innovation and timeless design.",
      author: "Digital Pioneer",
      category: "future",
    },
    {
      id: 4,
      text: "Connect with fellow explorers in the vast digital landscape of the 90s revival.",
      author: "Surf Network Admin",
      category: "community",
    },
    {
      id: 5,
      text: "Where CRT monitors glow and pixels dance, the heart of the digital village beats.",
      author: "Kampung Siber Elder",
      category: "nostalgia",
    },
  ],
  ms: [
    {
      id: 1,
      text: "Dalam era digital, kami semua terhubung melalui wayar imajinasi dan kod.",
      author: "Kumpulan Kampung Siber",
      category: "filosofi",
    },
    {
      id: 2,
      text: "Setiap baris kod adalah piksel dalam karya seni kehidupan digital kami.",
      author: "Pemprogram Retro",
      category: "coding",
    },
    {
      id: 3,
      text: "Bangunan masa depan dibangun berdasarkan asas inovasi retro dan reka bentuk yang masa lalu.",
      author: "Pengevast Digital",
      category: "masa depan",
    },
    {
      id: 4,
      text: "Sambungkan diri dengan rakan penjelajah lain di dalam lansangan digital yang luas revivasi 90-an.",
      author: "Pentadbir Rangkaian Surfs",
      category: "komuniti",
    },
    {
      id: 5,
      text: "Di mana pemantul CRT bersinar dan piksel menari, hati kampung digital berdetak.",
      author: "Tuaan Kampung Siber",
      category: "nostalgia",
    },
  ],
};

export default function DashboardQuotes() {
  const { language } = useLanguageStore();
  const t = language === 'ms' ? msDictionary : enDictionary;
  
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const quotes = QUOTE_DATA[language];
  
  useEffect(() => {
    // Set initial quote
    if (quotes && quotes.length > 0) {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setCurrentQuote(quotes[randomIndex]);
    }
  }, [language, quotes]);
  
  const handleNewQuote = () => {
    setIsAnimating(true);
    
    // Find a different quote
    if (!currentQuote) return;
    
    const availableQuotes = quotes.filter(q => q.id !== currentQuote.id);
    if (availableQuotes.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * availableQuotes.length);
    const newQuote = availableQuotes[randomIndex];
    
    setTimeout(() => {
      setCurrentQuote(newQuote);
      setIsAnimating(false);
    }, 300);
  };
  
  if (!currentQuote) {
    return (
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Kutipan Pengguna
        </h2>
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-cyan-500/30 dark:border-pink-500/30">
          <p className="text-gray-600 dark:text-gray-400">Memuat kutipan...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Kutipan Pengguna
      </h2>
      
      <div className={`p-6 bg-white dark:bg-gray-800 rounded-lg border-l-4 ${currentQuote.category === 'philosophy' ? 'border-cyan-500' : currentQuote.category === 'coding' ? 'border-green-500' : currentQuote.category === 'future' ? 'border-purple-500' : currentQuote.category === 'community' ? 'border-pink-500' : 'border-yellow-500'} shadow-sm transition-all duration-300 ${isAnimating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
        <div className="flex items-start">
          <span className="text-2xl mr-3">💭</span>
          <div className="flex-1">
            <blockquote className="text-lg text-gray-700 dark:text-gray-300 italic mb-3">
              {currentQuote.text}
            </blockquote>
            <div className="flex items-center justify-between">
              <cite className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                — {currentQuote.author}
              </cite>
              <button
                onClick={handleNewQuote}
                className="retro-btn-secondary text-xs px-3 py-1"
                aria-label="Dapatkan kutipan baharu"
              >
                🔄 Baru
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
