// Start: Imports
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
        setError(data.error || 'Failed to load items');
      }
    } catch (err) {
      console.error('Error fetching items:', err);
      setError('Failed to load items');
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

  // Start: Get Item Icon
  const getItemIcon = (type: BrowseItem['type']): string => {
    const icons: Record<BrowseItem['type'], string> = {
      tutorial: '📚',
      asset: '📦',
      project: '🎮',
      template: '📄',
    };
    return icons[type] || '🔧';
  };
  // End: Get Item Icon

  // Start: Render Browse Item
  const renderBrowseItem = (item: BrowseItem) => {
    return (
      <div
        key={item.id}
        onClick={() => handleItemClick(item)}
        className="retro-browse-item p-3 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 hover:shadow-lg cursor-pointer transition-shadow"
      >
        <div className="flex items-start">
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center mr-3 text-2xl">
            {getItemIcon(item.type)}
          </div>
          <div className="flex-1">
            <h4 className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">
              {item.title}
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
              {item.description}
            </p>
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>by {item.author}</span>
              <div className="flex items-center space-x-2">
                <span>📥 {item.downloads}</span>
                <span>⭐ {item.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  // End: Render Browse Item

  // Start: Render Browse Page
  return (
    <div className={`retro-window flex flex-col ${className || ''}`}>
      {/* Start: Window Header */}
      <div className="retro-window-header bg-gray-200 dark:bg-gray-700 px-3 py-2 border-b border-gray-300 dark:border-gray-600">
        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 flex items-center">
          <span className="mr-2">🛒</span>
          Browse Resources
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
              <option value="all">All Types</option>
              <option value="tutorial">Tutorials</option>
              <option value="asset">Assets</option>
              <option value="project">Projects</option>
              <option value="template">Templates</option>
            </select>

            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="retro-select text-xs"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest</option>
              <option value="rating">Highest Rated</option>
            </select>

            <input
              type="text"
              placeholder="Search..."
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
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading resources...</p>
          </div>
        ) : error ? (
          <div className="text-center py-4">
            <p className="text-sm text-red-500 mb-2">{error}</p>
            <button
              onClick={fetchItems}
              className="retro-btn-secondary text-xs"
            >
              Retry
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">No resources found</p>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map(renderBrowseItem)}
          </div>
        )}
      </div>
      {/* End: Window Content */}

      {/* Start: Window Footer */}
      <div className="retro-window-footer bg-gray-200 dark:bg-gray-700 px-3 py-2 border-t border-gray-300 dark:border-gray-600 flex justify-between items-center">
        <span className="text-xs text-gray-600 dark:text-gray-300">
          Page {currentPage} of {totalPages}
        </span>
        <div className="flex space-x-1">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="retro-btn-secondary text-xs"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="retro-btn-secondary text-xs"
          >
            Next
          </button>
        </div>
      </div>
      {/* End: Window Footer */}
    </div>
  );
}
// End: BrowsePage Component
