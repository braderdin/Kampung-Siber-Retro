// Start: Imports
'use client';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import HumanFeedbackToast from '@/components/HumanFeedbackToast';
import ModernRetroCard from '@/components/ModernRetroCard';
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
// End: Type Definitions

// Start: SearchPage Component
export default function SearchPage({ className }: SearchPageProps) {
  // Start: State Management
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const router = useRouter();
  // End: State Management

  // Start: Demo Search Data
  const demoResults = useMemo<SearchResult[]>(() => [
    {
      id: '1',
      title: 'Siri Tutorial Retro',
      description: 'Peta kursus untuk pembelajaran web klasik dan teknik visual moden.',
      type: 'tutorial',
      url: '/tutorials',
      tags: ['html', 'css', 'retro'],
    },
    {
      id: '2',
      title: 'Papan Pemuka Aset',
      description: 'Koleksi elemen visual untuk membina halaman retro yang tersusun.',
      type: 'asset',
      url: '/site_files',
      tags: ['asset', 'ui'],
    },
    {
      id: '3',
      title: 'Bilik Berita Projek',
      description: 'Penerbitan terkini dan kemas kini komuniti untuk laman projek anda.',
      type: 'project',
      url: '/press',
      tags: ['news', 'project'],
    },
  ], []);
  // End: Demo Search Data

  // Start: Handle Search
  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setToast(null);
      return;
    }

    setLoading(true);
    const filtered = demoResults.filter((result) =>
      [result.title, result.description, ...result.tags].some((value) => value.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    setTimeout(() => {
      setResults(filtered);
      setLoading(false);
      setToast(filtered.length > 0 ? 'Carian berjaya dikemas kini.' : 'Tiada padanan untuk istilah ini.');
    }, 220);
  };
  // End: Handle Search

  // Start: Handle Result Click
  const handleResultClick = (url: string) => {
    router.push(url);
  };
  // End: Handle Result Click

  // Start: Render Search Page
  return (
    <div className={`rounded border border-gray-300 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900 ${className || ''}`}>
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Carian</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">Cari siri tutorial, aset, dan kemas kini papan pemuka dengan cepat.</p>
      </div>

      <div className="mb-4 rounded border border-gray-300 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
        <input
          value={query}
          onChange={(event) => {
            const value = event.target.value;
            setQuery(value);
            if (value.length > 2) {
              handleSearch(value);
            } else {
              setResults([]);
              setToast(null);
            }
          }}
          className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          placeholder="Cari dalam Carian"
        />
      </div>

      {loading ? (
        <div className="rounded border border-dashed border-gray-300 p-4 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-400">Memproses Carian...</div>
      ) : results.length > 0 ? (
        <div className="grid gap-3 md:grid-cols-2">
          {results.map((result) => (
            <ModernRetroCard
              key={result.id}
              title={result.title}
              description={result.description}
              icon={result.type === 'tutorial' ? '📚' : result.type === 'asset' ? '🧰' : result.type === 'project' ? '🛠️' : '📄'}
              onClick={() => handleResultClick(result.url)}
              badge={result.tags[0]}
            />
          ))}
        </div>
      ) : (
        <div className="rounded border border-dashed border-gray-300 p-4 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-400">
          Tiada hasil sehingga masa ini. Mulakan dengan istilah yang lebih khusus.
        </div>
      )}

      {toast ? <HumanFeedbackToast message={toast} type="info" duration={2200} onClose={() => setToast(null)} /> : null}
    </div>
  );
}
// End: SearchPage Component
