"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguageStore } from '@/store/useLanguageStore';
import { enDictionary, msDictionary } from '@/i18n/dictionaries';
import CustomDomainSetupForm from '@/components/CustomDomainSetupForm';
import { toastSuccess, toastError, toastInfo } from '@/components/NotificationCenter';

export default function CustomDomainPage({ params }: { params: { username: string } }) {
  const { username } = params;
  const router = useRouter();
  const { language } = useLanguageStore();
  const t = language === 'ms' ? msDictionary : enDictionary;

  const [isClient, setIsClient] = useState(false);
  const [savedDomain, setSavedDomain] = useState<string>('');
  const [savedCname, setSavedCname] = useState<string>('');
  const [savedTxt, setSavedTxt] = useState<string>('');

  useEffect(() => {
    setIsClient(true);
    
    // Load saved domain configuration
    const saved = localStorage.getItem(`custom_domain_${username}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSavedDomain(parsed.domain || '');
        setSavedCname(parsed.cname || '');
        setSavedTxt(parsed.txt || '');
      } catch {
        // Invalid JSON, ignore
      }
    }
  }, [username]);

  const handleDomainChange = (domain: string, cname: string, txt: string) => {
    setSavedDomain(domain);
    setSavedCname(cname);
    setSavedTxt(txt);
  };

  const handleSaveDomain = () => {
    if (!savedDomain) {
      toastError('Domain is required', 'Please enter a domain name');
      return;
    }

    const domainConfig = {
      domain: savedDomain,
      cname: savedCname,
      txt: savedTxt,
      savedAt: new Date().toISOString()
    };

    localStorage.setItem(`custom_domain_${username}`, JSON.stringify(domainConfig));
    toastSuccess('Custom Domain Saved', `Your domain ${savedDomain} is now configured!`);
  };

  const handleRemoveDomain = () => {
    localStorage.removeItem(`custom_domain_${username}`);
    setSavedDomain('');
    setSavedCname('');
    setSavedTxt('');
    toastInfo('Domain Removed', 'Your custom domain has been removed');
  };

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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Start: Page Header */}
        <div className="retro-card mb-6 p-4 border-2 border-dashed border-cyan-400/30">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🌐</span>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 pixel-font">
                {t.customDomainTitle || 'Custom Domain Setup'}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 pixel-font">
                {t.customDomainSubtitle || `Configure a custom domain for ${username}'s site`}
              </p>
            </div>
          </div>
        </div>
        {/* End: Page Header */}

        {/* Start: Domain Status Card */}
        {savedDomain && (
          <div className="retro-card mb-6 p-4 border-2 border-green-400/30">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 pixel-font">
                  {t.domainConfigured || 'Domain Configured'}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-mono">
                  {savedDomain}
                </p>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={handleRemoveDomain}
                className="retro-btn-secondary text-xs px-3 py-1"
              >
                {t.removeDomain || 'Remove Domain'}
              </button>
            </div>
          </div>
        )}
        {/* End: Domain Status Card */}

        {/* Start: Custom Domain Form */}
        <div className="retro-card border-2 border-dashed border-cyan-400/30">
          <div className="retro-card-header bg-gray-200 dark:bg-gray-700 px-4 py-2 border-b-2 border-dashed border-gray-300 dark:border-gray-600">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 pixel-font flex items-center gap-2">
              <span className="text-2xl">⚙️</span>
              <span>{t.domainConfiguration || 'Domain Configuration'}</span>
            </h2>
          </div>
          
          <div className="p-4">
            <CustomDomainSetupForm
              residentUsername={username}
              existingDomain={savedDomain || undefined}
              onDomainChange={handleDomainChange}
            />
          </div>
        </div>
        {/* End: Custom Domain Form */}

        {/* Start: Navigation Back Button */}
        <div className="mt-6">
          <button
            onClick={() => router.push(`/settings/${username}`)}
            className="retro-btn-secondary text-xs px-4 py-2"
          >
            <span className="mr-2">←</span>
            {t.backToSettings || 'Back to Settings'}
          </button>
        </div>
        {/* End: Navigation Back Button */}
      </div>
    </main>
  );
}

// Start: Custom Styles
const styles = `
  @keyframes slide-in {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  .animate-slide-in {
    animation: slide-in 0.3s ease-out forwards;
  }
`;
// End: Custom Styles