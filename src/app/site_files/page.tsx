'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CrtThemeController from '@/components/CrtThemeController';
import DashboardProfileBanner from '@/components/DashboardProfileBanner';
import FileManagerActions from '@/components/FileManagerActions';
import FileManagerGrid from '@/components/FileManagerGrid';
import { useLanguageStore } from '@/store/useLanguageStore';
import { enDictionary, msDictionary } from '@/i18n/dictionaries';
import type { FileAction, FileManagerItem, SiteFile, SiteFolder } from '@/types/fileManager';

// Helper function to format file size
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Helper function to check if file size needs warning (approaches 4.0MB)
function needsSizeWarning(size: number): boolean {
  const threeMB = 3 * 1024 * 1024; // 3MB in bytes
  return size >= threeMB;
}

// Helper function to check if file size exceeds 4.5MB Free Tier limit
function exceedsFreeTierLimit(size: number): boolean {
  const fourPointFiveMB = 4.5 * 1024 * 1024; // 4.5MB in bytes
  return size >= fourPointFiveMB;
}

// File size warning badge component
interface FileSizeBadgeProps {
  size: number;
}

function FileSizeBadge({ size }: FileSizeBadgeProps) {
  const isWarning = needsSizeWarning(size);
  const isExceeded = exceedsFreeTierLimit(size);
  const formattedSize = formatFileSize(size);
  
  if (!isWarning) {
    return (
      <span className="text-xs text-gray-500 dark:text-gray-400">
        {formattedSize}
      </span>
    );
  }
  
  if (isExceeded) {
    return (
      <div className="flex items-center gap-1">
        <span className="text-xs text-red-500 font-bold">⚠️</span>
        <span className="text-xs text-red-500 font-bold">{formattedSize}</span>
      </div>
    );
  }
  
  return (
    <div className="flex items-center gap-1">
      <span className="text-xs text-yellow-500 animate-pulse">⚠️</span>
      <span className="text-xs text-yellow-500">{formattedSize}</span>
    </div>
  );
}

// Start: Pure File Explorer Directory - SiteFilesPage Component
export default function SiteFilesPage() {
  // Start: State Management
  const { language } = useLanguageStore();
  const t = language === 'ms' ? msDictionary : enDictionary;

  const [files, setFiles] = useState<SiteFile[]>([]);
  const [folders, setFolders] = useState<SiteFolder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<SiteFile[]>([]);
  const [crtEnabled, setCrtEnabled] = useState(false);
  const router = useRouter();
  // End: State Management

  // Start: Fetch Files
  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true);
      setError(null);

      try {
        const mockFiles: SiteFile[] = [
          {
            id: '1',
            filename: 'index.html',
            size: 1024,
            contentType: 'text/html',
            uploadedAt: new Date().toISOString(),
            url: '/files/index.html',
            type: 'file',
          },
          {
            id: '2',
            filename: 'style.css',
            size: 2048,
            contentType: 'text/css',
            uploadedAt: new Date().toISOString(),
            url: '/files/style.css',
            type: 'file',
          },
          {
            id: '3',
            filename: 'script.js',
            size: 1536,
            contentType: 'text/javascript',
            uploadedAt: new Date().toISOString(),
            url: '/files/script.js',
            type: 'file',
          },
          {
            id: '4',
            filename: 'large-document.pdf',
            size: 4.2 * 1024 * 1024, // 4.2 MB - warning threshold
            contentType: 'application/pdf',
            uploadedAt: new Date().toISOString(),
            url: '/files/large-document.pdf',
            type: 'file',
          },
          {
            id: '5',
            filename: 'big-file.zip',
            size: 4.8 * 1024 * 1024, // 4.8 MB - exceeds free tier
            contentType: 'application/zip',
            uploadedAt: new Date().toISOString(),
            url: '/files/big-file.zip',
            type: 'file',
          },
        ];

        const mockFolders: SiteFolder[] = [
          {
            id: 'f1',
            name: 'images',
            createdAt: new Date().toISOString(),
            type: 'folder',
          },
          {
            id: 'f2',
            name: 'documents',
            createdAt: new Date().toISOString(),
            type: 'folder',
          },
        ];

        setFiles(mockFiles);
        setFolders(mockFolders);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch files';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);
  // End: Fetch Files

  // Start: Theme Sync
  useEffect(() => {
    const syncCrtState = () => {
      setCrtEnabled(document.documentElement.classList.contains('crt-enabled'));
    };

    syncCrtState();
    const observer = new MutationObserver(syncCrtState);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);
  // End: Theme Sync

  // Start: Handle File Actions - Pure Directory Browser
  const handleFileAction = (file: FileManagerItem, action: FileAction, newName?: string) => {
    if (action === 'edit' && file.type === 'file') {
      router.push('/site_files/text_editor?filename=' + encodeURIComponent(file.filename));
    } else if (action === 'navigate' && file.type === 'folder') {
      console.log('Navigating to folder:', file.name);
    } else if (action === 'rename' && newName) {
      console.log('Renaming item to:', newName);
    } else if (action === 'delete') {
      console.log('Deleting item:', file);
    }
  };
  // End: Handle File Actions

  // Start: Handle File Upload
  const handleFileUpload = () => {
    console.log('File upload triggered');
  };
  // End: Handle File Upload

  // Start: Handle Folder Creation
  const handleFolderCreate = () => {
    console.log('Folder creation triggered');
  };
  // End: Handle Folder Creation

  // Start: Handle File Creation
  const handleFileCreate = () => {
    console.log('File creation triggered');
  };
  // End: Handle File Creation

  // Start: Handle Batch Delete
  const handleBatchDelete = () => {
    console.log('Batch delete triggered', selectedFiles);
  };
  // End: Handle Batch Delete

  // Start: Calculate total size for warning display
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  const totalSizeFormatted = formatFileSize(totalSize);
  const freeTierLimit = 4.5 * 1024 * 1024; // 4.5 MB
  const sizePercentage = Math.min((totalSize / freeTierLimit) * 100, 100);
  
  // Find files that need warnings
  const warningFiles = files.filter(f => needsSizeWarning(f.size));
  const exceededFiles = files.filter(f => exceedsFreeTierLimit(f.size));
  // End: Calculate total size for warning display

  // Start: Render Site Files Page - Pure File Explorer Directory
  return (
    <div className="mx-auto max-w-7xl p-6">
      <DashboardProfileBanner />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Paparan Fail</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">{t.dashboardTitle}</p>
        </div>
        <CrtThemeController />
      </div>

      {/* Start: File Size Warning Banner */}
      {totalSize >= freeTierLimit * 0.8 && (
        <div className="mb-4 p-3 bg-yellow-900/30 border-2 border-yellow-500 rounded-lg retro-border retro-alert-blink">
          <div className="flex items-center justify-center gap-2">
            <span className="text-yellow-400 font-bold text-sm">⚠️ Amanah Saiz Fail mendekati had 4.5MB Percuma!</span>
            <span className="text-xs text-yellow-300">({totalSizeFormatted} / 4.5 MB)</span>
          </div>
        </div>
      )}
      {/* End: File Size Warning Banner */}

      {/* Start: Exceeded Files Warning */}
      {exceededFiles.length > 0 && (
        <div className="mb-4 p-3 bg-red-900/30 border-2 border-red-500 rounded-lg retro-border">
          <div className="flex items-center justify-center gap-2">
            <span className="text-red-400 font-bold text-sm">🚨 Had Sazen Tersampaikan!</span>
            <span className="text-xs text-red-300">{exceededFiles.length} fail melebihi 4.5MB</span>
          </div>
        </div>
      )}
      {/* End: Exceeded Files Warning */}

      <FileManagerActions
        onFileUpload={handleFileUpload}
        onFolderCreate={handleFolderCreate}
        onFileCreate={handleFileCreate}
        selectedCount={selectedFiles.length}
        onBatchDelete={handleBatchDelete}
      />

      {loading && (
        <div className="py-8 text-center">
          <div className="mx-auto mb-2 inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-500 dark:text-gray-400">{t.loadingDashboard}</p>
        </div>
      )}

      {error && (
        <div className="py-8 text-center">
          <p className="text-red-500 dark:text-red-400">{error}</p>
        </div>
      )}

        {!loading && !error && (
        <div className={'mt-4 rounded-2xl border p-4 transition-all duration-200 ' + (crtEnabled ? 'border-slate-400 bg-slate-100/90' : 'border-slate-300 bg-white/80 shadow-sm')} style={crtEnabled ? { boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.4)' } : undefined}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-3">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{t.myFiles}</h2>
              
              {/* Start: File Size Summary */}
              <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-cyan-500/20">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total File Size:</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{totalSizeFormatted}</span>
                    <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${sizePercentage >= 90 ? 'bg-red-500' : sizePercentage >= 75 ? 'bg-yellow-500' : 'bg-green-500'}`}
                        style={{ width: `${Math.min(sizePercentage, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* End: File Size Summary */}
              
              {/* Start: Files with Warning Badges */}
              <div className="space-y-3">
                {warningFiles.length > 0 && (
                  <div className="mb-2">
                    <h3 className="text-sm font-medium text-yellow-600 dark:text-yellow-400 mb-2">⚠️ Fail Besar (Mendekati Had)</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {warningFiles.map((file) => (
                        <div
                          key={file.id}
                          className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded border-l-4 border-yellow-400"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-mono text-xs font-bold text-yellow-800 dark:text-yellow-200">
                              📄 {file.filename}
                            </span>
                            <FileSizeBadge size={file.size} />
                          </div>
                          <p className="text-xs text-yellow-600 dark:text-yellow-400">
                            {file.contentType}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {/* End: Files with Warning Badges */}
              
              <FileManagerGrid files={files} folders={folders} onFileAction={handleFileAction} />
            </div>
          </div>
        </div>
      )}
      {/* End: Render Site Files Page - Pure File Explorer Directory */}
    </div>
  );
}
