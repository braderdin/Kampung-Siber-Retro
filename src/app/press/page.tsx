// Start: Imports
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ModernRetroCard from '@/components/ModernRetroCard';
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
}
// End: Type Definitions

// Start: PressPage Component
export default function PressPage({ className }: PressPageProps) {
  // Start: State Management
  const [pressReleases, setPressReleases] = useState<PressRelease[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  // End: State Management

  // Start: Component Lifecycle
  useEffect(() => {
    let isMounted = true;

    const loadPressReleases = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/press');
        const data = await response.json();
        if (isMounted) {
          if (data.success && Array.isArray(data.data)) {
            setPressReleases(data.data);
          } else {
            setError('Tidak dapat memuatkan Bilik Berita pada masa ini.');
          }
        }
      } catch {
        if (isMounted) {
          setError('Tidak dapat memuatkan Bilik Berita pada masa ini.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadPressReleases();
    return () => {
      isMounted = false;
    };
  }, []);
  // End: Component Lifecycle

  // Start: Render Press Page
  return (
    <div className={`rounded border border-gray-300 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900 ${className || ''}`}>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Bilik Berita</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Penerbitan terkini dan pengumuman komuniti yang disusun dengan kemas.</p>
        </div>
        <button onClick={() => router.push('/contact')} className="retro-btn-secondary px-3 py-2 text-xs">
          Soal Jawab Media
        </button>
      </div>

      {loading ? (
        <div className="rounded border border-dashed border-gray-300 p-4 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-400">Memuatkan Bilik Berita...</div>
      ) : error ? (
        <div className="rounded border border-red-300 bg-red-50 p-4 text-sm text-red-600 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      ) : pressReleases.length === 0 ? (
        <div className="rounded border border-dashed border-gray-300 p-4 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-400">Tiada siaran berita pada masa ini.</div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {pressReleases.map((release) => (
            <ModernRetroCard
              key={release.id}
              title={release.title}
              description={`${release.excerpt} — ${release.author}`}
              icon="📰"
              onClick={() => window.open(release.url, '_blank')}
              badge={new Date(release.date).toLocaleDateString('ms-MY', { day: 'numeric', month: 'short', year: 'numeric' })}
            />
          ))}
        </div>
      )}
    </div>
  );
}
// End: PressPage Component
