// Start: Imports
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// End: Imports

// Start: Type Definitions
interface PressPageProps {
  className?: string;
}

interface PressRelease {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  url: string;
  tags: string[];
}

interface PressResponse {
  success: boolean;
  data?: PressRelease[];
  error?: string;
}
// End: Type Definitions

// Start: PressPage Component
export default function PressPage({ className }: PressPageProps) {
  // Start: State Management
  const [pressReleases, setPressReleases] = useState<PressRelease[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRelease, setSelectedRelease] = useState<PressRelease | null>(null);
  const router = useRouter();
  // End: State Management

  // Start: Fetch Press Releases
  const fetchPressReleases = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/press');
      const data: PressResponse = await response.json();

      if (data.success && data.data) {
        setPressReleases(data.data);
      } else {
        setError(data.error || 'Failed to load press releases');
      }
    } catch (err) {
      console.error('Error fetching press releases:', err);
      setError('Failed to load press releases');
    } finally {
      setLoading(false);
    }
  };
  // End: Fetch Press Releases

  // Start: Component Lifecycle
  useEffect(() => {
    fetchPressReleases();
  }, []);
  // End: Component Lifecycle

  // Start: Handle Press Release Click
  const handlePressReleaseClick = (release: PressRelease) => {
    setSelectedRelease(release);
  };
  // End: Handle Press Release Click

  // Start: Handle Close Modal
  const handleCloseModal = () => {
    setSelectedRelease(null);
  };
  // End: Handle Close Modal

  // Start: Handle External Link
  const handleExternalLink = (url: string) => {
    window.open(url, '_blank');
  };
  // End: Handle External Link

  // Start: Format Date
  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  // End: Format Date

  // Start: Render Press Release List
  const renderPressReleaseList = () => {
    return (
      <div className="space-y-2">
        {pressReleases.map((release) => (
          <div
            key={release.id}
            onClick={() => handlePressReleaseClick(release)}
            className="retro-press-item p-3 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 hover:shadow-lg cursor-pointer transition-shadow"
          >
            <div className="flex items-start">
              <div className="flex-1">
                <h4 className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">
                  {release.title}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                  {release.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>{formatDate(release.date)}</span>
                  <span>by {release.author}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  // End: Render Press Release List

  // Start: Render Press Release Modal
  const renderPressReleaseModal = () => {
    if (!selectedRelease) return null;

    return (
      <div 
        className="retro-modal fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={handleCloseModal}
      >
        <div 
          className="retro-modal-content bg-white dark:bg-gray-800 rounded-lg p-4 max-w-2xl w-full"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">
              {selectedRelease.title}
            </h3>
            <button
              onClick={handleCloseModal}
              className="retro-btn-secondary text-xs"
            >
              ✕
            </button>
          </div>
          
          <div className="mb-3">
            <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
              {selectedRelease.excerpt}
            </p>
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
              <span>{formatDate(selectedRelease.date)}</span>
              <span>by {selectedRelease.author}</span>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={() => handleExternalLink(selectedRelease.url)}
              className="retro-btn-primary text-xs"
            >
              Read More
            </button>
            <button
              onClick={handleCloseModal}
              className="retro-btn-secondary text-xs"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };
  // End: Render Press Release Modal

  // Start: Render Press Page
  return (
    <div className={`retro-window ${className || ''}`}>
      {/* Start: Window Header */}
      <div className="retro-window-header bg-gray-200 dark:bg-gray-700 px-3 py-2 border-b border-gray-300 dark:border-gray-600">
        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 flex items-center">
          <span className="mr-2">📰</span>
          Press Room
        </h3>
      </div>
      {/* End: Window Header */}

      {/* Start: Window Content */}
      <div className="p-3">
        {loading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading press releases...</p>
          </div>
        ) : error ? (
          <div className="text-center py-4">
            <p className="text-sm text-red-500 mb-2">{error}</p>
            <button
              onClick={fetchPressReleases}
              className="retro-btn-secondary text-xs"
            >
              Retry
            </button>
          </div>
        ) : pressReleases.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">No press releases available</p>
          </div>
        ) : (
          renderPressReleaseList()
        )}
      </div>
      {/* End: Window Content */}

      {/* Start: Window Footer */}
      <div className="retro-window-footer bg-gray-200 dark:bg-gray-700 px-3 py-2 border-t border-gray-300 dark:border-gray-600 flex justify-between items-center">
        <span className="text-xs text-gray-600 dark:text-gray-300">
          {pressReleases.length} {pressReleases.length === 1 ? 'release' : 'releases'}
        </span>
        <button
          onClick={() => router.push('/contact')}
          className="retro-btn-secondary text-xs"
        >
          Media Inquiries
        </button>
      </div>
      {/* End: Window Footer */}
    </div>
  );
}
// End: PressPage Component
