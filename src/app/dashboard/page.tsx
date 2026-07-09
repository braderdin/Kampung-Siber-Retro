"use client";
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { useLanguageStore } from "@/store/useLanguageStore";
import { enDictionary, msDictionary } from "@/lib/dictionary";
import ModernRetroCard from '@/components/ModernRetroCard';
import PaginationButton from '@/components/PaginationButton';
import HeroSignUpCard from '@/components/HeroSignUpCard';
import FeaturedSitesGrid from '@/components/FeaturedSitesGrid';
import FollowActivityFeed from '@/components/FollowActivityFeed';
import TutorialCard from '@/components/TutorialCard';
import Shoutbox from '@/components/Shoutbox';
import AccountAllocationBox from '@/components/AccountAllocationBox';
import DashboardQuotes from '@/components/DashboardQuotes';
import VisitorStatGraph from '@/components/VisitorStatGraph';
import RetroMarqueeTicker from '@/components/RetroMarqueeTicker';

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

interface TutorialPreview {
  id: number;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  completed: boolean;
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

const mockTutorialPreviews: TutorialPreview[] = [
  {
    id: 1,
    title: 'Asas HTML untuk Pembangunan Web Retro',
    description: 'Pelajari asas HTML dengan penekanan pada teknik gaya retro yang bersih.',
    difficulty: 'Beginner',
    category: 'HTML',
    completed: false,
  },
  {
    id: 2,
    title: 'Gaya CSS dengan Estetika Windows 95',
    description: 'Kuasali teknik CSS untuk mencipta antara muka yang terdengar klasik.',
    difficulty: 'Beginner',
    category: 'CSS',
    completed: false,
  },
  {
    id: 3,
    title: 'Asas JavaScript untuk Permainan Retro',
    description: 'Bina permainan gaya arked menggunakan JavaScript tulen.',
    difficulty: 'Intermediate',
    category: 'JavaScript',
    completed: false,
  },
];

type TabView = 'main' | 'community';

function DashboardContent({ className }: DashboardProps) {
  const searchParams = useSearchParams();
  const { language } = useLanguageStore();
  const t = language === 'ms' ? msDictionary : enDictionary;
  
  const [pageInfo, setPageInfo] = useState<PageInfo>({ number: 1, totalPages: 10 });
  const [currentDir, setCurrentDir] = useState<string>('root');
  const [files, setFiles] = useState<FileItem[]>([]);
  const [activeTab, setActiveTab] = useState<TabView>('main');

  useEffect(() => {
    if (!searchParams) return;
    
    const tabParam = searchParams.get('tab');
    if (tabParam === 'community') {
      setActiveTab('community');
    } else {
      setActiveTab('main');
    }
    
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

  const handleEditorNavigation = () => {
    window.location.href = '/site_files/text_editor';
  };

  const toggleTab = () => {
    setActiveTab(prev => prev === 'main' ? 'community' : 'main');
  };

  return (
    <div className={`overflow-x-hidden w-full p-6 max-w-7xl mx-auto ${className || ''}`}>
      {/* Retro Marquee Ticker */}
      <div className="mb-4">
        <RetroMarqueeTicker />
      </div>

      {/* Clean Tab Navigation */}
      <div className="mb-6 retro-tab-navigation">
        <div className="retro-tab-header flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab('main')}
            className={`retro-tab-button ${activeTab === 'main' ? 'active' : ''}`}
          >
            <span className="retro-tab-icon">📊</span>
            <span className="retro-tab-label">Main View</span>
          </button>
          <button
            onClick={() => setActiveTab('community')}
            className={`retro-tab-button ${activeTab === 'community' ? 'active' : ''}`}
          >
            <span className="retro-tab-icon">👥</span>
            <span className="retro-tab-label">Community Board</span>
          </button>
        </div>
      </div>

      {activeTab === 'main' ? (
        <>
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {t.dashboardTitle}
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {t.dashboardSubtitle}
            </p>
          </div>

          {/* Start: Account Allocation Display */}
          <AccountAllocationBox />
          {/* End: Account Allocation Display */}

          {/* Visitor Stat Graph */}
          <div className="mb-6">
            <VisitorStatGraph />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-1">
              <HeroSignUpCard />
            </div>
            <div className="lg:col-span-2">
              <FeaturedSitesGrid />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <FollowActivityFeed />
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-cyan-500/30 dark:border-pink-500/30">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  {t.quickActions}
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={handleEditorNavigation}
                    className="w-full retro-btn-secondary"
                  >
                    {t.fileEditor}
                  </button>
                  <button
                    onClick={() => window.location.href = '/dashboard'}
                    className="w-full retro-btn-secondary"
                  >
                    {t.dashboardTitle}
                  </button>
                  <button
                    onClick={() => window.location.href = '/guestbook'}
                    className="w-full retro-btn-secondary"
                  >
                    Buku Pelawat Retro
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Start: Shoutbox Component */}
          <div className="mb-6">
            <Shoutbox />
          </div>
          {/* End: Shoutbox Component */}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-cyan-500/30 dark:border-pink-500/30">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
                  {t.tutorials}
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => alert('Buka senarai tutorial lengkap')}
                    className="w-full retro-btn-secondary text-sm"
                  >
                    📚 Lihat Semua Tutorial
                  </button>
                </div>
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-cyan-500/30 dark:border-pink-500/30">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
                  Shoutbox Komuniti
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  Sembang dengan rakan pengguna lain di sini.
                </p>
              </div>
            </div>
          </div>

          {/* Start: Recommended Tutorials Section */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {t.tutorials}
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mockTutorialPreviews.map((tutorial) => (
                <TutorialCard
                  key={tutorial.id}
                  title={tutorial.title}
                  description={tutorial.description}
                  difficulty={tutorial.difficulty}
                  category={tutorial.category}
                  completed={tutorial.completed}
                  onStart={() => alert(`Memulakan ${tutorial.title}`)}
                />
              ))}
            </div>
          </div>
          {/* End: Recommended Tutorials Section */}

          {/* Start: User Quotes Section */}
          <DashboardQuotes />
          {/* End: User Quotes Section */}

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
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6 border border-cyan-500/30 dark:border-pink-500/30">
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

          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-cyan-500/30 dark:border-pink-500/30">
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
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-cyan-500/30 dark:border-pink-500/30">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
                {t.fileEditor}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <ModernRetroCard
                  title={t.fileEditor}
                  description="Akses fail anda secara terus"
                  icon="📝"
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
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-cyan-500/30 dark:border-pink-500/30">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
                Papan Pemuka
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <ModernRetroCard
                  title={t.fileEditor}
                  description="Buka penyunting kod"
                  icon="📝"
                  onClick={handleEditorNavigation}
                  className="w-full"
                />
                <ModernRetroCard
                  title={t.dashboardTitle}
                  description="Lihat statistik halaman"
                  icon="📊"
                  className="w-full"
                />
                <ModernRetroCard
                  title={t.guestbookTitle}
                  description="Tandatangani buku pelawat"
                  icon="📘"
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-cyan-500/30 dark:border-pink-500/30">
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
        </>
      ) : (
        <>
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              🏘️ Papan Komuniti
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Bersemangat bersama rakan warga kampung siber
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <Shoutbox />
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-cyan-500/30 dark:border-pink-500/30">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
                  Stat Komuniti
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded">
                    <div className="text-xs text-cyan-600 dark:text-cyan-400">Pengguna Aktif</div>
                    <div className="text-xl font-bold text-cyan-800 dark:text-cyan-200">1,247</div>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded">
                    <div className="text-xs text-green-600 dark:text-green-400">Komen Harian</div>
                    <div className="text-xl font-bold text-green-800 dark:text-green-200">89</div>
                  </div>
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded">
                    <div className="text-xs text-purple-600 dark:text-purple-400">Sumbangan</div>
                    <div className="text-xl font-bold text-purple-800 dark:text-purple-200">234</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-cyan-500/30 dark:border-pink-500/30">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
              Pemain Teratas
            </h3>
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">Statistik pemain teratas akan ditunjukkan di sini.</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="p-6 max-w-7xl mx-auto">Memuat papan pemuka...</div>}>
      <DashboardContent />
    </Suspense>
  );
}