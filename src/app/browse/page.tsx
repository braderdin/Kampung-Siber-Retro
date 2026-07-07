// Start: Imports
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import HumanFeedbackToast from '@/components/HumanFeedbackToast';
import PaginationButton from '@/components/PaginationButton';
import SiteDirectoryGrid from '@/components/SiteDirectoryGrid';
// End: Imports

// Start: Type Definitions
interface BrowsePageProps {
  className?: string;
}

interface BrowseItem {
  id: string;
  title: string;
  description: string;
  type: 'tutorial' | 'asset' | 'project' | 'template';
  thumbnail: string;
  author: string;
  tags: string[];
  downloads: number;
  rating: number;
  url: string;
}

interface BrowseResponse {
  success: boolean;
  data?: BrowseItem[];
  error?: string;
}

interface FilterOptions {
  type: BrowseItem['type'] | 'all';
  sortBy: 'popular' | 'newest' | 'rating';
  search: string;
}
// End: Type Definitions

// Start: BrowsePage Component
export default function BrowsePage({ className }: BrowsePageProps) {
  // Start: State Management
  const [items, setItems] = useState<BrowseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    type: 'all',
    sortBy: 'popular',
    search: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error' | 'info' | 'warning'>('info');
  const router = useRouter();
  // End: State Management

  // Start: Fetch Browse Items
  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        type: filters.type,
        sortBy: filters.sortBy,
        search: filters.search,
        page: currentPage.toString(),
      });

      const response = await fetch(`/api/browse?${queryParams}`);
      const data: BrowseResponse = await response.json();

      if (data.success && data.data) {
        setItems(data.data);
      } else {
        setError(data.error || 'Gagal memuat sumber');
        setToastMessage(data.error || 'Gagal memuat sumber');
        setToastType('error');
      }
    } catch (err) {
      console.error('Error fetching items:', err);
      setError('Gagal memuat sumber');
      setToastMessage('Gagal memuat sumber');
      setToastType('error');
    } finally {
      setLoading(false);
    }
  };
  // End: Fetch Browse Items

  // Start: Component Lifecycle
  useEffect(() => {
    fetchItems();
  }, [filters, currentPage]);
  // End: Component Lifecycle

  // Start: Handle Filter Change
  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };
  // End: Handle Filter Change

  // Start: Handle Item Click
  const handleItemClick = (item: BrowseItem) => {
    router.push(item.url);
  };
  // End: Handle Item Click

  // Start: Map Browse Items
  const directorySites = items.map((item) => ({
    id: item.id,
    title: item.title,
    description: `${item.description} · ${item.author}`,
    tags: item.tags.slice(0, 3),
    href: item.url,
  }));
  // End: Map Browse Items

  // Start: Render Browse Page
  return (
    <div className={`retro-window flex flex-col ${className || ''}`}>
      {/* Start: Window Header */}
      <div className="retro-window-header bg-gray-200 dark:bg-gray-700 px-3 py-2 border-b border-gray-300 dark:border-gray-600">
        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 flex items-center">
          <span className="mr-2">🛒</span>
          Lihat Sumber
        </h3>
      </div>
      {/* End: Window Header */}

      {/* Start: Window Content */}
      <div className="p-3 flex-1 overflow-y-auto">
        {/* Start: Filters */}
        <div className="retro-filters mb-3 p-2 bg-gray-50 dark:bg-gray-900/20 rounded border border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-2">
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="retro-select text-xs"
            >
              <option value="all">Semua Jenis</option>
              <option value="tutorial">Tutorial</option>
              <option value="asset">Aset</option>
              <option value="project">Projek</option>
              <option value="template">Template</option>
            </select>

            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="retro-select text-xs"
            >
              <option value="popular">Paling Popular</option>
              <option value="newest">Terbaru</option>
              <option value="rating">Rating Tertinggi</option>
            </select>

            <input
              type="text"
              placeholder="Cari..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="retro-input text-xs w-32"
            />
          </div>
        </div>
        {/* End: Filters */}

        {loading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Memuat sumber...</p>
          </div>
        ) : error ? (
          <div className="text-center py-4">
            <p className="text-sm text-red-500 mb-2">{error}</p>
            <button
              onClick={fetchItems}
              className="retro-btn-secondary text-xs"
            >
              Cuba Semula
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Tiada sumber ditemui</p>
          </div>
        ) : (
          <SiteDirectoryGrid sites={directorySites} />
        )}
      </div>
      {/* End: Window Content */}

      {/* Start: Window Footer */}
      <div className="retro-window-footer border-t border-gray-300 bg-gray-200 px-3 py-2 dark:border-gray-600 dark:bg-gray-700">
        <PaginationButton currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
      {/* End: Window Footer */}
    </div>
  );
}
// End: BrowsePage Component
