"use client";

interface Report {
  id: string;
  type: 'spam' | 'inappropriate' | 'abuse' | 'other';
  content: string;
  reportedBy: string;
  reportedAt: string;
  status: 'pending' | 'reviewed' | 'resolved';
  targetId?: string;
}

interface ReportModerationCardProps {
  report: Report;
  onResolve: (reportId: string) => void;
}

const TYPE_LABELS: Record<Report['type'], string> = {
  spam: 'Spam',
  inappropriate: 'Tidak Sesuai',
  abuse: ' penyalahgunaan',
  other: 'Lain-lain',
};

const STATUS_COLORS: Record<Report['status'], string> = {
  pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-300',
  reviewed: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-300',
  resolved: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-300',
};

export default function ReportModerationCard({ report, onResolve }: ReportModerationCardProps) {
  const formatDate = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleString('ms-MY', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleResolve = async () => {
    try {
      const response = await fetch('/api/admin/reports/resolve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reportId: report.id }),
      });

      const result = await response.json();
      
      if (result.success) {
        onResolve(report.id);
      }
    } catch (error) {
      console.error('Error resolving report:', error);
    }
  };

  return (
    <div className="retro-card h-full flex flex-col border-2 border-dashed border-red-400/30">
      {/* Start: Card Header */}
      <div className="retro-card-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">🚨</span>
          <span className="font-bold text-sm pixel-font">
            {TYPE_LABELS[report.type]}
          </span>
        </div>
        <span className={`
          text-xs px-2 py-1 rounded border pixel-font
          ${STATUS_COLORS[report.status]}
        `}>
          {report.status === 'pending' ? 'Tertunda' : report.status === 'reviewed' ? 'Dilihat' : 'Selesai'}
        </span>
      </div>
      {/* End: Card Header */}

      {/* Start: Card Content */}
      <div className="p-3 flex-1 flex flex-col">
        <div className="mb-2">
          <span className="text-xs text-gray-500 dark:text-gray-400 pixel-font">
            Dikirim oleh: 
          </span>
          <span className="text-xs font-bold text-gray-700 dark:text-gray-300 ml-1">
            {report.reportedBy}
          </span>
        </div>

        <div className="mb-2">
          <span className="text-xs text-gray-500 dark:text-gray-400 pixel-font">
            Kandungan:
          </span>
          <p className="text-xs text-gray-800 dark:text-gray-200 mt-1 p-2 bg-gray-100 dark:bg-gray-800 rounded break-words">
            {report.content}
          </p>
        </div>

        <div className="mt-auto pt-2 border-t border-gray-200 dark:border-gray-700">
          <span className="text-xs text-gray-500 dark:text-gray-400 pixel-font">
            {formatDate(report.reportedAt)}
          </span>
          
          {report.status !== 'resolved' && (
            <button
              onClick={handleResolve}
              className="retro-btn-primary text-xs px-3 py-1 mt-2 w-full"
            >
              Selesaikan Aduan
            </button>
          )}
        </div>
      </div>
      {/* End: Card Content */}
    </div>
  );
}
