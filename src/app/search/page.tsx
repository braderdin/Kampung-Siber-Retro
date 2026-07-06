// Start: Imports
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
// End: Imports

// Start: Type Definitions
interface SearchPageProps {
  className?: string;
}

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'tutorial' | 'asset' | 'project' | 'page';
  url: string;
  tags: string[];
}

interface SearchResponse {
  success: boolean;
  data?: SearchResult[];
  error?: string;
}
// End: Type Definitions

// Start: SearchPage Component
export default function SearchPage({ className }: SearchPageProps) {
  // Start: State Management
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const router = useRouter();
  // End: State Management

  // Start: Handle Search
  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      const data: SearchResponse = await response.json();

      if (data.success && data.data) {
        setResults(data.data);
        setShowResults(true);
      } else {
        setError(data.error || 'Search failed');
        setResults([]);
        setShowResults(false);
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to perform search');
      setResults([]);
      setShowResults(false);
    } finally {
      setLoading(false);
    }
  };
  // End: Handle Search

  // Start: Handle Result Click
  const handleResultClick = (url: string) => {
    setShowResults(false);
    router.push(url);
  };
  // End: Handle Result Click

  // Start: Handle Key Events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowResults(false);
    }
  };
  // End: Handle Key Events

  // Start: Get Result Icon
  const getResultIcon = (type: SearchResult['type']): string => {
    const icons: Record<SearchResult['type'], string> = {
      tutorial: '📚',
      asset: '📦',
      project: '🎮',
      page: '📄',
    };
    return icons[type] || '🔍';
  };
  // End: Get Result Icon

  // Start: Handle Query Change
  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.length > 2) {
      handleSearch(value);
    } else {
      setResults([]);
      setShowResults(false);
    }
  };
  // End: Handle Query Change

  // Start: Render Search Page
  return (
    <div className={`retro-window ${className || ''}`}>
      {/* Start: Window Header */}
      <div className="retro-window-header bg-gray-200 dark:bg-gray-700 px-3 py-2 border-b border-gray-300 dark:border-gray-600">
        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 flex items-center">
          <span className="mr-2">🔍</span>
          Search
        </h3>
      </div>
      {/* End: Window Header */}

      {/* Start: Window Content */}
      <div className="p-3">
        <div className="retro-search-box mb-3">
          <input
            type="text"
            placeholder="Search tutorials, assets, projects..."
            value={query}
            onChange={handleQueryChange}
            onKeyDown={handleKeyDown}
            className="retro-input w-full"
            autoFocus
          />
        </div>

        {loading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Searching...</p>
          </div>
        )}

        {error && (
          <div className="retro-alert-error p-2 mb-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded">
            {error}
          </div>
        )}

        {showResults && results.length > 0 && (
          <div className="retro-search-results border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 max-h-60 overflow-y-auto">
            {results.map((result) => (
              <div
                key={result.id}
                onClick={() => handleResultClick(result.url)}
                className="retro-search-result p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-200 dark:border-gray-700 last:border-b-0"
              >
                <div className="flex items-start">
                  <span className="text-lg mr-2">{getResultIcon(result.type)}</span>
                  <div className="flex-1">
                    <h4 className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">
                      {result.title}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                      {result.description}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {result.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && query.length > 0 && results.length === 0 && (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">No results found for "{query}"</p>
          </div>
        )}
      </div>
      {/* End: Window Content */}

      {/* Start: Window Footer */}
      <div className="retro-window-footer bg-gray-200 dark:bg-gray-700 px-3 py-2 border-t border-gray-300 dark:border-gray-600 flex justify-between items-center">
        <span className="text-xs text-gray-600 dark:text-gray-300">
          {results.length} result{results.length !== 1 ? 's' : ''}
        </span>
        <div className="flex space-x-2">
          <button
            onClick={() => setQuery('')}
            className="retro-btn-secondary text-xs"
          >
            Clear
          </button>
        </div>
      </div>
      {/* End: Window Footer */}
    </div>
  );
}
// End: SearchPage Component
