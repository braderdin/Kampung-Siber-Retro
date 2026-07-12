import { notFound } from 'next/navigation';
import RetroHitCounter from '@/components/RetroHitCounter';

interface StatsPageProps {
  params: {
    username: string;
  };
}

interface StatsData {
  visitors: number;
  pageViews: number;
  uniqueVisitors: number;
  avgTime: string;
  bounceRate: number;
}

const mockStats: Record<string, StatsData> = {
  'user1': {
    visitors: 1247,
    pageViews: 3421,
    uniqueVisitors: 892,
    avgTime: '3m 24s',
    bounceRate: 34.2,
  },
  'user2': {
    visitors: 563,
    pageViews: 1205,
    uniqueVisitors: 432,
    avgTime: '2m 15s',
    bounceRate: 45.8,
  },
};

export default function StatsPage({ params }: StatsPageProps) {
  const { username } = params;

  if (!username || username.length < 2) {
    notFound();
  }

  const stats = mockStats[username] || {
    visitors: 0,
    pageViews: 0,
    uniqueVisitors: 0,
    avgTime: '0m 0s',
    bounceRate: 0,
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="retro-window w-full max-w-4xl">
        <div className="retro-window-title-bar">
          <div className="retro-window-title">Statistik - {username}</div>
        </div>
        <div className="retro-window-client p-6">
          <h1 className="retro-heading mb-6 text-2xl font-bold">Papan Pemuka Statstik Laman</h1>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <div className="rounded border border-gray-300 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{stats.visitors.toLocaleString()}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Jumlah Pelawat</div>
            </div>
            <div className="rounded border border-gray-300 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{stats.pageViews.toLocaleString()}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Paparan Laman</div>
            </div>
            <div className="rounded border border-gray-300 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{stats.uniqueVisitors.toLocaleString()}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Pelawat Unik</div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded border border-gray-300 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">Kaunter Pelawat</h2>
              <RetroHitCounter value={stats.visitors} label="Kaunter Pelawat" />
            </div>
            <div className="rounded border border-gray-300 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">Tetapan Ringkas</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Purata masa lawatan ialah {stats.avgTime} dengan kadar lantunan {stats.bounceRate}%.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
