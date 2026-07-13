// Start: Imports
'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import CrtThemeController from '@/components/CrtThemeController';
import DashboardProfileBanner from '@/components/DashboardProfileBanner';
import FileManagerActions from '@/components/FileManagerActions';
import FileManagerGrid from '@/components/FileManagerGrid';
import { useLanguageStore } from '@/store/useLanguageStore';
import { enDictionary, msDictionary } from '@/i18n/dictionaries';
import type { FileAction, FileManagerItem, SiteFile, SiteFolder } from '@/types/fileManager';
// End: Imports

// Start: Format Helpers
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function needsSizeWarning(size: number): boolean {
  const threeMB = 3 * 1024 * 1024;
  return size >= threeMB;
}

function exceedsFreeTierLimit(size: number): boolean {
  const fourPointFiveMB = 4.5 * 1024 * 1024;
  return size >= fourPointFiveMB;
}
// End: Format Helpers

// Start: Storage Thresholds
const STORAGE_LIMIT_BYTES = 25 * 1024 * 1024; // 25MB (matches StorageUsageBar)
// End: Storage Thresholds

// Start: Size Badge Component
interface FileSizeBadgeProps {
  size: number;
}

function FileSizeBadge({ size }: FileSizeBadgeProps) {
  const isWarning = needsSizeWarning(size);
  const isExceeded = exceedsFreeTierLimit(size);
  const formattedSize = formatFileSize(size);

  if (!isWarning) {
    return (
      <span className="text-xs text-gray-500 dark:text-gray-400">{formattedSize}</span>
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
// End: Size Badge Component

// Start: FileManager Component (Unified, R2-Wired)
export default function FileManager({ embedded = false }: { embedded?: boolean }) {
  const { language } = useLanguageStore();
  const t = language === 'ms' ? msDictionary : enDictionary;
  const router = useRouter();

  const [files, setFiles] = useState<SiteFile[]>([]);
  const [folders, setFolders] = useState<SiteFolder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<SiteFile[]>([]);
  const [crtEnabled, setCrtEnabled] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Start: Fetch Initial Files (client mock -> will be replaced by R2 list API)
  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true);
      setError(null);
      try {
        const mockFiles: SiteFile[] = [
          { id: '1', filename: 'index.html', size: 1024, contentType: 'text/html', uploadedAt: new Date().toISOString(), url: '/files/index.html', type: 'file' },
          { id: '2', filename: 'style.css', size: 2048, contentType: 'text/css', uploadedAt: new Date().toISOString(), url: '/files/style.css', type: 'file' },
          { id: '3', filename: 'script.js', size: 1536, contentType: 'text/javascript', uploadedAt: new Date().toISOString(), url: '/files/script.js', type: 'file' },
        ];
        const mockFolders: SiteFolder[] = [
          { id: 'f1', name: 'images', createdAt: new Date().toISOString(), type: 'folder' },
          { id: 'f2', name: 'documents', createdAt: new Date().toISOString(), type: 'folder' },
        ];
        setFiles(mockFiles);
        setFolders(mockFolders);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Gagal memuatkan fail');
      } finally {
        setLoading(false);
      }
    };
    fetchFiles();
  }, []);
  // End: Fetch Initial Files

  // Start: Theme Sync
  useEffect(() => {
    const syncCrtState = () => setCrtEnabled(document.documentElement.classList.contains('crt-enabled'));
    syncCrtState();
    const observer = new MutationObserver(syncCrtState);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);
  // End: Theme Sync

  // Start: Direct R2 Presigned Upload
  const handleFileUpload = async () => {
    fileInputRef.current?.click();
  };

  const onFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const presignRes = await fetch('/api/storage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type || 'application/octet-stream',
          size: file.size,
        }),
      });
      const presignData = await presignRes.json();
      if (!presignData.success) {
        throw new Error(presignData.error || 'Gagal menjana pautan muat naik');
      }

      const uploadRes = await fetch(presignData.data.presignedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type || 'application/octet-stream' },
        body: file,
      });
      if (!uploadRes.ok) {
        throw new Error('Muat naik ke Cloudflare R2 gagal');
      }

      const newFile: SiteFile = {
        id: presignData.data.id,
        filename: file.name,
        size: file.size,
        contentType: file.type || 'application/octet-stream',
        uploadedAt: presignData.data.uploadedAt,
        url: presignData.data.url,
        type: 'file',
      };
      setFiles((prev) => [...prev, newFile]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ralat muat naik');
    } finally {
      setUploading(false);
    }
  };
  // End: Direct R2 Presigned Upload

  // Start: Folder Creation (client-side namespace)
  const handleFolderCreate = (name: string) => {
    const clean = name.trim();
    if (!clean) return;
    setFolders((prev) => [...prev, { id: `f${Date.now()}`, name: clean, createdAt: new Date().toISOString(), type: 'folder' }]);
  };
  // End: Folder Creation

  // Start: New File Creation -> open editor
  const handleFileCreate = (name: string) => {
    const clean = name.trim();
    if (!clean) return;
    router.push('/site_files/text_editor?filename=' + encodeURIComponent(clean));
  };
  // End: New File Creation

  // Start: Batch Delete (client state removal)
  const handleBatchDelete = () => {
    if (selectedFiles.length === 0) return;
    const ids = new Set(selectedFiles.map((f) => f.id));
    setFiles((prev) => prev.filter((f) => !ids.has(f.id)));
    setSelectedFiles([]);
  };
  // End: Batch Delete

  // Start: Select All Toggle
  const handleSelectAll = () => {
    setSelectedFiles((prev) => (prev.length === files.length ? [] : files));
  };
  // End: Select All Toggle

  // Start: Handle File Actions
  const handleFileAction = (item: FileManagerItem, action: FileAction, newName?: string) => {
    if (action === 'edit' && item.type === 'file') {
      router.push('/site_files/text_editor?filename=' + encodeURIComponent(item.filename));
    } else if (action === 'navigate' && item.type === 'folder') {
      console.log('Navigasi folder:', item.name);
    } else if (action === 'rename' && newName) {
      if (item.type === 'file') {
        setFiles((prev) => prev.map((f) => (f.id === item.id ? { ...f, filename: newName } : f)));
      } else {
        setFolders((prev) => prev.map((fo) => (fo.id === item.id ? { ...fo, name: newName } : fo)));
      }
    } else if (action === 'delete') {
      if (item.type === 'file') {
        setFiles((prev) => prev.filter((f) => f.id !== item.id));
        setSelectedFiles((prev) => prev.filter((f) => f.id !== item.id));
      } else {
        setFolders((prev) => prev.filter((fo) => fo.id !== item.id));
      }
    }
  };
  // End: Handle File Actions

  // Start: Live Storage Metric
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  const totalSizeFormatted = formatFileSize(totalSize);
  const sizePercentage = Math.min((totalSize / STORAGE_LIMIT_BYTES) * 100, 100);
  const warningFiles = files.filter((f) => needsSizeWarning(f.size));
  const exceededFiles = files.filter((f) => exceedsFreeTierLimit(f.size));
  const approachingLimit = totalSize >= STORAGE_LIMIT_BYTES * 0.8;
  // End: Live Storage Metric

  // Start: Render FileManager
  return (
    <div className={embedded ? '' : 'mx-auto max-w-7xl p-6'}>
      {!embedded && <DashboardProfileBanner />}

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">{embedded ? t.myFiles : 'Paparan Fail'}</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">{t.dashboardTitle}</p>
        </div>
        <CrtThemeController />
      </div>

      {/* Start: Approaching Limit Banner */}
      {approachingLimit && (
        <div className="mb-4 p-3 bg-yellow-900/30 border-2 border-yellow-500 rounded-lg retro-border retro-alert-blink">
          <div className="flex items-center justify-center gap-2">
            <span className="text-yellow-400 font-bold text-sm">⚠️ Amaran: Saiz penggunaan fail menghampiri had simpanan!</span>
            <span className="text-xs text-yellow-300">({totalSizeFormatted} / {formatFileSize(STORAGE_LIMIT_BYTES)})</span>
          </div>
        </div>
      )}
      {/* End: Approaching Limit Banner */}

      {/* Start: Exceeded Limit Banner */}
      {exceededFiles.length > 0 && (
        <div className="mb-4 p-3 bg-red-900/30 border-2 border-red-500 rounded-lg retro-border">
          <div className="flex items-center justify-center gap-2">
            <span className="text-red-400 font-bold text-sm">🚨 Had Saiz Dilampaui!</span>
            <span className="text-xs text-red-300">{exceededFiles.length} fail melebihi 4.5MB</span>
          </div>
        </div>
      )}
      {/* End: Exceeded Limit Banner */}

      <FileManagerActions
        onFileUpload={handleFileUpload}
        onFolderCreate={handleFolderCreate}
        onFileCreate={handleFileCreate}
        onSelectAll={handleSelectAll}
        selectedCount={selectedFiles.length}
        onBatchDelete={handleBatchDelete}
      />

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={onFileInputChange}
      />

      {uploading && (
        <div className="mb-4 p-2 bg-cyan-900/30 border border-cyan-500 rounded text-center text-sm text-cyan-300">
          Memuat naik ke Cloudflare R2...
        </div>
      )}

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

              {/* Start: Live Storage Metric */}
              <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-cyan-500/20">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Jumlah Saiz Fail:</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{totalSizeFormatted} / {formatFileSize(STORAGE_LIMIT_BYTES)}</span>
                    <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${sizePercentage >= 90 ? 'bg-red-500' : sizePercentage >= 75 ? 'bg-yellow-500' : 'bg-green-500'}`}
                        style={{ width: `${Math.min(sizePercentage, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* End: Live Storage Metric */}

              {/* Start: Warning Files */}
              {warningFiles.length > 0 && (
                <div className="mb-2">
                  <h3 className="text-sm font-medium text-yellow-600 dark:text-yellow-400 mb-2">⚠️ Fail Besar (Mendekati Had)</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {warningFiles.map((file) => (
                      <div key={file.id} className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded border-l-4 border-yellow-400">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono text-xs font-bold text-yellow-800 dark:text-yellow-200">📄 {file.filename}</span>
                          <FileSizeBadge size={file.size} />
                        </div>
                        <p className="text-xs text-yellow-600 dark:text-yellow-400">{file.contentType}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* End: Warning Files */}

              <FileManagerGrid files={files} folders={folders} onFileAction={handleFileAction} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
// End: FileManager Component