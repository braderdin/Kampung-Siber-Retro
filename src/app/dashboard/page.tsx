"use client";
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { useLanguageStore } from "@/store/useLanguageStore";
import { enDictionary, msDictionary } from "@/i18n/dictionaries";

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
    { id: 1, name: 'project1.png', type: 'file', path: '/images/project1.png', size: '2.4 MB' },
    { id: 2, name: 'project2.jpg', type: 'file', path: '/images/project2.jpg', size: '1.8 MB' },
    { id: 3, name: 'assets', type: 'folder', path: '/assets', size: '-' },
  ],
  'assets': [
    { id: 1, name: 'logo.svg', type: 'file', path: '/logo.svg', size: '12 KB' },
    { id: 2, name: 'icons', type: 'folder', path: '/icons', size: '-' },
  ],
  'documents': [
    { id: 1, name: 'readme.txt', type: 'file', path: '/readme.txt', size: '4 KB' },
    { id: 2, name: 'manual.pdf', type: 'file', path: '/manual.pdf', size: '3.2 MB' },
  ],
};

function DashboardContent({ className }: DashboardProps) {
  const searchParams = useSearchParams();
  const { language } = useLanguageStore();
  const t = language === 'ms' ? msDictionary : enDictionary;
  
  const [pageInfo, setPageInfo] = useState<PageInfo>({ number: 1, totalPages: 10 });
  const [currentDir, setCurrentDir] = useState<string>('root');
  const [files, setFiles] = useState<FileItem[]>([]);

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
            ← Back to Root
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
              <div
                key={file.id}
                className="p-4 bg-gray-50 dark:bg-gray-800 rounded flex items-center justify-between"
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-2">
                    {file.type === 'folder' ? '📁' : '📄'}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {file.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {file.size}
                    </p>
                  </div>
                </div>
              </div>
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
            <button className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
              <span className="block text-2xl mb-2">📁</span>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {t.myFiles}
              </span>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
              <span className="block text-2xl mb-2">📊</span>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {t.analytics}
              </span>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
              <span className="block text-2xl mb-2">⚙️</span>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {t.settings}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage({ className }: DashboardProps) {
  return (
    <Suspense fallback={<div className="p-6 max-w-7xl mx-auto">Loading dashboard...</div>}>
      <DashboardContent className={className} />
    </Suspense>
  );
}
