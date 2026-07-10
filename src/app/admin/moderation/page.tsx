"use client";

import { useState, useEffect } from 'react';
import HydrationGuard from '@/components/HydrationGuard';
import ReportModerationCard from '@/components/admin/ReportModerationCard';

interface Report {
  id: string;
  type: 'spam' | 'inappropriate' | 'abuse' | 'other';
  content: string;
  reportedBy: string;
  reportedAt: string;
  status: 'pending' | 'reviewed' | 'resolved';
  targetId?: string;
}

export default function AdminModerationPage() {
  const [isClient, setIsClient] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setReports([
      {
        id: '1',
        type: 'spam',
        content: 'Buy cheap viagra now! Click here for amazing deals.',
        reportedBy: 'moderator_1',
        reportedAt: '2026-07-10T12:30:00Z',
        status: 'pending',
        targetId: 'entry_123',
      },
      {
        id: '2',
        type: 'inappropriate',
        content: 'Inappropriate language in chat message.',
        reportedBy: 'user_report',
        reportedAt: '2026-07-09T18:45:00Z',
        status: 'pending',
        targetId: 'msg_456',
      },
      {
        id: '3',
        type: 'abuse',
        content: 'Harassment in guestbook entry.',
        reportedBy: 'community_member',
        reportedAt: '2026-07-08T09:15:00Z',
        status: 'reviewed',
        targetId: 'entry_789',
      },
    ]);
    
    setLoading(false);
  };

  const handleResolveReport = (reportId: string) => {
    setReports(prev => prev.map(r => 
      r.id === reportId ? { ...r, status: 'resolved' } : r
    ));
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300 pt-16 px-4">
      <div className="max-w-4xl mx-auto py-8">
        {/* Start: Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 pixel-font flex items-center gap-3">
            <span className="text-4xl">🛡️</span>
            <span>Panel Moderasi</span>
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 pixel-font">
            Pantau dan selesaikan aduan daripada komuniti
          </p>
        </div>
        {/* End: Page Header */}

        {/* Start: Reports Grid */}
        <HydrationGuard>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="retro-card animate-pulse">
                  <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              ))
            ) : reports.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 pixel-font">
                  Tiada aduan tertunda
                </p>
              </div>
            ) : (
              reports.map((report) => (
                <ReportModerationCard
                  key={report.id}
                  report={report}
                  onResolve={handleResolveReport}
                />
              ))
            )}
          </div>
        </HydrationGuard>
        {/* End: Reports Grid */}
      </div>
    </div>
  );
}
