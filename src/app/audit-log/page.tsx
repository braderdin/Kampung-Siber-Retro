"use client";

import { useState, useEffect } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { enDictionary, msDictionary } from '@/i18n/dictionaries';

interface AuditLog {
  id: number;
  action: string;
  user: string;
  timestamp: string;
  details: string;
  type: 'navigation' | 'edit' | 'auth' | 'system';
}

const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    id: 1,
    action: 'User Signed In',
    user: 'admin',
    timestamp: '2024-01-15 08:30:22',
    details: 'Successful login from IP 192.168.1.100',
    type: 'auth'
  },
  {
    id: 2,
    action: 'Page Viewed',
    user: 'cyber-pioneer',
    timestamp: '2024-01-15 08:25:15',
    details: '/dashboard - Dashboard accessed',
    type: 'navigation'
  },
  {
    id: 3,
    action: 'Profile Updated',
    user: 'pixel-warrior',
    timestamp: '2024-01-15 08:20:45',
    details: 'Changed display name and bio',
    type: 'edit'
  },
  {
    id: 4,
    action: 'Content Edited',
    user: 'byte-collector',
    timestamp: '2024-01-15 08:15:33',
    details: 'Modified site_files/index.html',
    type: 'edit'
  },
  {
    id: 5,
    action: 'User Signed Up',
    user: 'new-resident',
    timestamp: '2024-01-15 08:10:12',
    details: 'New account created, email verification pending',
    type: 'auth'
  }
];

export default function AuditLogPage() {
  const { language } = useLanguageStore();
  const t = language === 'ms' ? msDictionary : enDictionary;
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filter, setFilter] = useState<'all' | 'auth' | 'edit' | 'navigation' | 'system'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // In a real app, this would fetch from an API
    setLogs(MOCK_AUDIT_LOGS);
  }, []);

  const filteredLogs = logs.filter(log => {
    if (filter !== 'all' && log.type !== filter) return false;
    if (searchQuery) {
      return (
        log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.details.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });

  const getTypeColor = (type: AuditLog['type']) => {
    switch (type) {
      case 'auth': return 'bg-green-500/20 text-green-600';
      case 'edit': return 'bg-blue-500/20 text-blue-600';
      case 'navigation': return 'bg-purple-500/20 text-purple-600';
      case 'system': return 'bg-gray-500/20 text-gray-600';
      default: return 'bg-gray-500/20 text-gray-600';
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Start: Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 pixel-font mb-2">
            {t.auditLog || 'Audit Log'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t.auditLogDesc || 'Log masuk aktiviti utama pengguna - hanya baca'}
          </p>
        </div>
        {/* End: Page Header */}

        {/* Start: Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex gap-2">
            {(['all', 'auth', 'edit', 'navigation', 'system'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`
                  px-3 py-1 text-sm rounded pixel-font transition-colors
                  ${filter === type 
                    ? 'bg-cyan-500 text-white' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }
                `}
              >
                {type === 'all' ? 'Semua' : type}
              </button>
            ))}
          </div>
          
          <div className="relative flex-1">
            <input
              type="text"
              placeholder={t.search || 'Cari...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full retro-input text-sm pl-3"
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          </div>
        </div>
        {/* End: Filters */}

        {/* Start: Audit Log Table */}
        <div className="retro-card overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <th className="px-3 py-2 text-left text-xs font-bold text-gray-800 dark:text-gray-200 pixel-font">
                  {t.timestamp || 'Masa'}
                </th>
                <th className="px-3 py-2 text-left text-xs font-bold text-gray-800 dark:text-gray-200 pixel-font">
                  {t.action || 'Tindakan'}
                </th>
                <th className="px-3 py-2 text-left text-xs font-bold text-gray-800 dark:text-gray-200 pixel-font">
                  {t.user || 'Pengguna'}
                </th>
                <th className="px-3 py-2 text-left text-xs font-bold text-gray-800 dark:text-gray-200 pixel-font">
                  {t.details || 'Butir'}
                </th>
                <th className="px-3 py-2 text-left text-xs font-bold text-gray-800 dark:text-gray-200 pixel-font">
                  {t.type || 'Jenis'}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr 
                  key={log.id} 
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-850 transition-colors"
                >
                  <td className="px-3 py-2 text-xs text-gray-600 dark:text-gray-400 pixel-font">
                    {log.timestamp}
                  </td>
                  <td className="px-3 py-2 text-xs font-medium text-gray-800 dark:text-gray-200 pixel-font">
                    {log.action}
                  </td>
                  <td className="px-3 py-2 text-xs text-gray-600 dark:text-gray-400 pixel-font">
                    {log.user}
                  </td>
                  <td className="px-3 py-2 text-xs text-gray-500 dark:text-gray-500 pixel-font">
                    {log.details}
                  </td>
                  <td className="px-3 py-2">
                    <span className={`px-2 py-0.5 text-xs rounded pixel-font ${getTypeColor(log.type)}`}>
                      {log.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredLogs.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400 pixel-font">
                {t.noLogs || 'Tiada log yang ditemui.'}
              </p>
            </div>
          )}
        </div>
        {/* End: Audit Log Table */}
      </div>
    </main>
  );
}
