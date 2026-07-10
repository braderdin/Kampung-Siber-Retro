// Start: Quick Links Sidebar Component
"use client";

import { usePathname, useRouter } from 'next/navigation';
import { useLanguageStore } from '@/store/useLanguageStore';
import { enDictionary, msDictionary } from '@/i18n/dictionaries';
import { clsx } from 'clsx';

interface QuickLink {
  name: string;
  href: string;
  icon: string;
}

export default function QuickLinksSidebar() {
  const { language } = useLanguageStore();
  const t = language === 'ms' ? msDictionary : enDictionary;
  const router = useRouter();
  const pathname = usePathname();

  const quickLinks: QuickLink[] = [
    { name: 'Dashboard', href: '/dashboard', icon: '🏠' },
    { name: 'Directory', href: '/directory', icon: '👥' },
    { name: 'Map', href: '/map', icon: '🗺️' },
    { name: 'Guestbook', href: '/guestbook', icon: '📘' },
    { name: 'Settings', href: '/settings', icon: '⚙️' },
    { name: 'Terms', href: '/terms', icon: '📜' },
    { name: 'Contact', href: '/contact', icon: '✉️' },
  ];

  return (
    <div className="hidden lg:block w-56 retro-card h-fit">
      <div className="p-3 border-b border-gray-200 dark:border-gray-700 mb-2">
        <h3 className="pixel-font text-sm font-bold text-gray-800 dark:text-gray-200">
          {t.quickLinks || 'Pautan Cepat'}
        </h3>
      </div>
      <nav className="space-y-1">
        {quickLinks.map((link) => (
          <button
            key={link.href}
            onClick={() => router.push(link.href)}
            className={clsx(
              'w-full flex items-center gap-2 px-3 py-2 text-sm rounded transition-all duration-200 pixel-font',
              pathname === link.href
                ? 'bg-cyan-500/20 text-cyan-600 dark:bg-cyan-500/30 dark:text-cyan-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            )}
          >
            <span className="text-lg">{link.icon}</span>
            <span>{link.name}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
// End: Quick Links Sidebar Component
