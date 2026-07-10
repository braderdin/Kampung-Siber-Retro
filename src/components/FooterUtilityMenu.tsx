"use client";

import { useState } from 'react';

interface FooterUtilityMenuProps {
  className?: string;
}

export default function FooterUtilityMenu({ className }: FooterUtilityMenuProps) {
  const [isClient, setIsClient] = useState(false);
  const [showStatus, setShowStatus] = useState(false);

  const footerLinks = [
    { label: 'Terms of Service', href: '/terms', icon: '📜' },
    { label: 'Privacy Policy', href: '/privacy', icon: '🔒' },
    { label: 'Site Status', href: '#', icon: '📊' },
    { label: 'Contact', href: '/contact', icon: '✉️' },
    { label: 'API', href: '/api', icon: '🔌' }
  ];

  const statusItems = [
    { label: 'Server Uptime', value: '99.9%' },
    { label: 'Last Checked', value: '2 mins ago' },
    { label: 'Response Time', value: '42ms' }
  ];

  return (
    <div className={`footer-utility-menu ${className || ''}`}>
      <div className="retro-card border-2 border-dashed border-cyan-400/30">
        {/* Start: Utility Links Header */}
        <div className="retro-card-header bg-gray-200 dark:bg-gray-700 px-4 py-2 border-b-2 border-dashed border-gray-300 dark:border-gray-600">
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 pixel-font flex items-center gap-2">
            <span className="text-xl">🔧</span>
            <span>Technical Links</span>
          </h3>
        </div>
        {/* End: Utility Links Header */}

        {/* Start: Utility Links Grid */}
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {footerLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="
                  flex items-center gap-2 p-2 rounded
                  bg-gray-100 dark:bg-gray-800
                  hover:bg-cyan-500/20 dark:hover:bg-cyan-900/30
                  transition-all duration-200
                  pixel-font text-xs
                "
              >
                <span className="text-lg">{link.icon}</span>
                <span className="text-gray-700 dark:text-gray-300">
                  {link.label}
                </span>
              </a>
            ))}
          </div>
        </div>
        {/* End: Utility Links Grid */}

        {/* Start: Site Status Toggle */}
        <div className="border-t-2 border-dashed border-cyan-400/30">
          <button
            onClick={() => setShowStatus(!showStatus)}
            className="w-full flex items-center justify-between px-4 py-2 text-xs pixel-font text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <span className="flex items-center gap-2">
              <span className="text-lg">📊</span>
              <span>Site Status</span>
            </span>
            <span className="text-gray-500 dark:text-gray-400">
              {showStatus ? '▲' : '▼'}
            </span>
          </button>
          
          {/* Start: Status Details */}
          {showStatus && (
            <div className="px-4 pb-3 border-b-2 border-dashed border-cyan-400/30">
              <div className="grid grid-cols-2 gap-3 text-xs pixel-font">
                {statusItems.map((item) => (
                  <div key={item.label} className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">{item.label}:</span>
                    <span className="text-cyan-400 font-mono">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* End: Status Details */}
        </div>
        {/* End: Site Status Toggle */}

        {/* Start: Copyright */}
        <div className="border-t-2 border-dashed border-cyan-400/30 p-3 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 pixel-font">
            © {new Date().getFullYear()} Kampung Siber Retro. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 pixel-font mt-1">
            Made with ❤️ in the digital village
          </p>
        </div>
        {/* End: Copyright */}
      </div>
    </div>
  );
}