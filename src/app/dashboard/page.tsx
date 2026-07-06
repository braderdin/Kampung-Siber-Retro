// Start: Imports
"use client";
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { useLanguageStore } from "@/store/useLanguageStore";
import { enDictionary, msDictionary } from "@/i18n/dictionaries";
import ModernRetroCard from '@/components/ModernRetroCard';
import PaginationButton from '@/components/PaginationButton';
// End: Imports

// Start: Type Definitions
interface DashboardProps {
  className?: string;
}

interface PageInfo {
  number: number;
  totalPages: number;
}

interface FileItem {
  id: number;
  name: string;
  type: 'folder' | 'file';
  path: string;
  size: string;
}

interface DirectoryView {
  [key: string]: FileItem[];
}

const mockDirectories: DirectoryView = {
  'galeri': [
    { id: 1, name: 'projek1.png', type: 'file', path: '/images/projek1.png', size: '2.4 MB' },
    { id: 2, name: 'projek2.jpg', type: 'file', path: '/images/projek2.jpg', size: '1.8 MB' },
    { id: 3, name: 'aset', type: 'folder', path: '/aset', size: '-' },
  ],
  'aset': [
    { id: 1, name: 'logo.svg', type: 'file', path: '/logo.svg', size: '12 KB' },
    { id: 2, name: 'ikon', type: 'folder', path: '/ikon', size: '-' },
  ],
  'dokumen': [
    { id: 1, name: 'bacaan.txt', type: 'file', path: '/bacaan.txt', size: '4 KB' },
    { id: 2, name: 'panduan.pdf', type: 'file', path: '/panduan.pdf', size: '3.2 MB' },
  ],
};
// End: Type Definitions

// Start: DashboardContent Component
function DashboardContent({ className }: DashboardProps) {
  const searchParams = useSearchParams();
  const { language } = useLanguageStore();
  const t = language === 'ms' ? msDictionary : enDictionary;
  
  const [pageInfo, setPageInfo] = useState<PageInfo>({ number: 1, totalPages: 10 });
  const [currentDir, setCurrentDir] = useState<string>('root');
  const [files, setFiles] = useState<FileItem[]>([]);

  // Start: Effect for URL Parameters
  useEffect(() => {
    const pageParam = searchParams.get('page');
    if (pageParam) {
      const pageNumber = parseInt(pageParam, 10);
      if (!isNaN(pageNumber) && pageNumber > 0) {
        setPageInfo(prev => ({
          ...prev,
          number: pageNumber,
        }));
      }
    }

    const dirParam = searchParams.get('dir');
    if (dirParam) {
      setCurrentDir(dirParam);
      setFiles(mockDirectories[dirParam] || []);
    } else {
      setFiles([]);
    }
  }, [searchParams]);
  // End: Effect for URL Parameters

  // Start: Render Dashboard Content
  return (
    <div className={`p-6 max-w-7xl mx-auto ${className || ''}`}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {t.dashboardTitle}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {t.dashboardSubtitle}
        </p>
      </div>

      {currentDir !== 'root' && (
        <div className="mb-4">
          <button
            onClick={() => {
              setCurrentDir('root');
              setFiles([]);
            }}
            className="text-sm text-blue-600 hover:underline"
          >
            ← Kembali ke Akar
          </button>
        </div>
      )}

      {currentDir !== 'root' && files.length > 0 && (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {t.pageInfoTitle} - {currentDir}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {files.map((file) => (
              <ModernRetroCard
                key={file.id}
                title={file.name}
                description={file.size}
                icon={file.type === 'folder' ? '📁' : '📄'}
                className="w-full"
              />
            ))}
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          {t.pageInfoTitle}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t.currentPage}
            </p>
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {pageInfo.number}
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t.totalPages}
            </p>
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {pageInfo.totalPages}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
            {t.quickActions}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <ModernRetroCard
              title={t.myFiles}
              description="Akses fail anda secara terus"
              icon="📁"
              className="w-full"
            />
            <ModernRetroCard
              title={t.analytics}
              description="Lihat statistik penggunaan"
              icon="📊"
              className="w-full"
            />
            <ModernRetroCard
              title={t.settings}
              description="Sesuaikan tetapan laman"
              icon="⚙️"
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
            Navigasi Halaman
          </h3>
          <PaginationButton
            currentPage={pageInfo.number}
            totalPages={pageInfo.totalPages}
            onPageChange={(page) => setPageInfo(prev => ({ ...prev, number: page }))}
          />
        </div>
      </div>
    </div>
  );
}
// End: DashboardContent Component

// Start: Dashboard Page Export
export default function DashboardPage({ className }: DashboardProps) {
  return (
    <Suspense fallback={<div className="p-6 max-w-7xl mx-auto">Memuat papan pemuka...</div>}>
      <DashboardContent className={className} />
    </Suspense>
  );
}
// End: Dashboard Page Export
