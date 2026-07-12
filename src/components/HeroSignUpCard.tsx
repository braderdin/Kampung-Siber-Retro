// Start: Imports
"use client";

import { useState } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { enDictionary, msDictionary } from '@/i18n/dictionaries';
// End: Imports

// Start: Type Definitions
interface HeroSignUpCardProps {
  className?: string;
}
// End: Type Definitions

// Start: HeroSignUpCard Component
export default function HeroSignUpCard({ className }: HeroSignUpCardProps) {
  const { language } = useLanguageStore();
  const t = language === 'ms' ? msDictionary : enDictionary;
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isHumanVerified, setIsHumanVerified] = useState(false);

  // Start: Handle Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isHumanVerified) {
      return;
    }
    console.log('Form submitted:', { username, email, password });
  };
  // End: Handle Form Submission

  // Start: Handle Human Verification
  const handleHumanVerification = () => {
    setIsHumanVerified(true);
  };
  // End: Handle Human Verification

  // Start: Render HeroSignUpCard
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 ${className || ''}`}>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        {t.greetings.hello}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t.greetings.hello}
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder={language === 'ms' ? 'Nama Pengguna' : 'Username'}
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t.greetings.hello}
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder={language === 'ms' ? 'E-mail' : 'Email'}
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t.greetings.hello}
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder={language === 'ms' ? 'Kata Laluan' : 'Password'}
            required
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="human-verification"
            checked={isHumanVerified}
            onChange={handleHumanVerification}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
          />
          <label htmlFor="human-verification" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            {language === 'ms' ? 'Sahkan Anda Manusia' : 'Verify you are human'}
          </label>
        </div>
        <button
          type="submit"
          disabled={!isHumanVerified}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {language === 'ms' ? 'Daftar Percuma' : 'Sign Up Free'}
        </button>
      </form>
    </div>
  );
}
// End: HeroSignUpCard Component
