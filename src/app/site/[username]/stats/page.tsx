import { notFound } from 'next/navigation';

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="retro-window w-full max-w-4xl">
        <div className="retro-window-title-bar">
          <div className="retro-window-title">Statistics - {username}</div>
        </div>
        <div className="retro-window-client p-6">
          <h1 className="text-2xl font-bold mb-6 retro-heading">
            Site Statistics
          </h1>
          
          <div className="retro-stats-grid">
            <div className="retro-stat-card">
              <div className="retro-stat-value">{stats.visitors.toLocaleString()}</div>
              <div className="retro-stat-label">Total Visitors</div>
            </div>
            
            <div className="retro-stat-card">
              <div className="retro-stat-value">{stats.pageViews.toLocaleString()}</div>
              <div className="retro-stat-label">Page Views</div>
            </div>
            
            <div className="retro-stat-card">
              <div className="retro-stat-value">{stats.uniqueVisitors.toLocaleString()}</div>
              <div className="retro-stat-label">Unique Visitors</div>
            </div>
            
            <div className="retro-stat-card">
              <div className="retro-stat-value">{stats.avgTime}</div>
              <div className="retro-stat-label">Avg. Time</div>
            </div>
            
            <div className="retro-stat-card">
              <div className="retro-stat-value">{stats.bounceRate}%</div>
              <div className="retro-stat-label">Bounce Rate</div>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-white rounded border-2 retro-border">
            <h2 className="text-lg font-semibold mb-2">Visitor Counter</h2>
            <div className="retro-counter">
              <div className="retro-counter-display">
                {stats.visitors.toLocaleString().split('').map((digit, index) => (
                  <div key={index} className="retro-counter-digit">
                    {digit}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
