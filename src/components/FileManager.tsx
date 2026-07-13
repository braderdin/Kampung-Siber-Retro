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
import { convertImageToWebp, isConvertibleImage } from '@/utils/webpConverter';
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

// Start: Storage Thresholds (Rule 30)
const STORAGE_LIMIT_BYTES = 25 * 1024 * 1024; // 25MB exact cap per user
const MAX_RAW_IMAGE_BYTES = 2 * 1024 * 1024; // 2MB raw image gate
// End: Storage Thresholds

// Start: Session Token Helper
function getSessionToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('sb-access-token');
}
// End: Session Token Helper

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

// Start: Toast Component (Rule 30 Hard Limit Alert)
interface ToastState {
  message: string;
  variant: 'error' | 'success' | 'info';
}

function StorageToast({ toast }: { toast: ToastState | null }) {
  if (!toast) return null;
  const base =
    'fixed top-4 left-1/2 -translate-x-1/2 z-[60] px-4 py-2 rounded-lg border text-sm font-bold shadow-lg retro-border';
  const variants: Record<ToastState['variant'], string> = {
    error: 'bg-red-900/40 border-red-500 text-red-200',
    success: 'bg-green-900/40 border-green-500 text-green-200',
    info: 'bg-cyan-900/40 border-cyan-500 text-cyan-200',
  };
  return (
    <div className={`${base} ${variants[toast.variant]}`} role="alert">
      {toast.message}
    </div>
  );
}
// End: Toast Component

// Start: FileManager Component (Unified, R2-Wired, No Mocks)
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
  const [totalSize, setTotalSize] = useState(0);
  const [toast, setToast] = useState<ToastState | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Start: Toast Dispatcher
  const showToast = (message: string, variant: ToastState['variant'] = 'info') => {
    setToast({ message, variant });
    window.setTimeout(() => setToast(null), 4000);
  };
  // End: Toast Dispatcher

  // Start: Authentic R2 List Fetch (replaces mock arrays)
  const fetchFiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getSessionToken();
      if (!token) {
        setError('Sesi tidak sah - sila log masuk semula');
        setLoading(false);
        return;
      }
      const res = await fetch('/api/storage/list', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Gagal menyenaraikan simpanan');
      }
      setFiles(data.files ?? []);
      setFolders(data.folders ?? []);
      setTotalSize(data.totalSize ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuatkan fail');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // End: Authentic R2 List Fetch

  // Start: Theme Sync
  useEffect(() => {
    const syncCrtState = () => setCrtEnabled(document.documentElement.classList.contains('crt-enabled'));
    syncCrtState();
    const observer = new MutationObserver(syncCrtState);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);
  // End: Theme Sync

  // Start: Direct R2 Presigned Upload with Rule 30 Safeguards
  const handleFileUpload = async () => {
    fileInputRef.current?.click();
  };

  const onFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    let payloadFile = file;
    let payloadName = file.name;
    let payloadType = file.type || 'application/octet-stream';
    let payloadSize = file.size;

    // Rule 30: hard 2MB raw image gate (pre-compression)
    if (isConvertibleImage(file)) {
      if (file.size > MAX_RAW_IMAGE_BYTES) {
        showToast('🚨 Imej mentah melebihi had 2MB!', 'error');
        return;
      }
      // Convert to crisp WebP (80-85% quality, <200KB)
      try {
        const converted = await convertImageToWebp(file);
        payloadFile = converted.blob as unknown as File;
        payloadName = converted.filename;
        payloadType = converted.contentType;
        payloadSize = converted.size;
        showToast(`Imej ditukar ke WebP (${formatFileSize(payloadSize)})`, 'success');
      } catch (convErr) {
        setError(convErr instanceof Error ? convErr.message : 'Penukaran WebP gagal');
        return;
      }
    }

    // Rule 30: exact 25MB total storage ceiling
    if (totalSize + payloadSize > STORAGE_LIMIT_BYTES) {
      showToast('🚨 Had Saiz Dilampaui!', 'error');
      return;
    }

    setUploading(true);
    setError(null);
    try {
      const token = getSessionToken();
      if (!token) {
        throw new Error('Sesi tidak sah - sila log masuk semula');
      }

      const presignRes = await fetch('/api/storage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: payloadName,
          contentType: payloadType,
          size: payloadSize,
        }),
      });
      const presignData = await presignRes.json();
      if (!presignData.success) {
        throw new Error(presignData.error || 'Gagal menjana pautan muat naik');
      }

      const uploadRes = await fetch(presignData.data.presignedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': payloadType },
        body: payloadFile,
      });
      if (!uploadRes.ok) {
        throw new Error('Muat naik ke Cloudflare R2 gagal');
      }

      // Re-sync from genuine R2 inventory so state never drifts
      await fetchFiles();
      showToast('Fail berjaya dimuat naik ke R2', 'success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ralat muat naik');
    } finally {
      setUploading(false);
    }
  };
  // End: Direct R2 Presigned Upload

  // Start: Folder Persistence (writes .keep placeholder into R2 tree)
  const handleFolderCreate = async (name: string) => {
    const clean = name.trim();
    if (!clean) return;
    try {
      const token = getSessionToken();
      if (!token) {
        throw new Error('Sesi tidak sah - sila log masuk semula');
      }
      const res = await fetch('/api/storage/list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ folderName: clean }),
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Gagal mencipta folder');
      }
      await fetchFiles();
      showToast('Folder berjaya diwujudkan', 'success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ralat folder');
    }
  };
  // End: Folder Persistence

  // Start: New File Creation -> open editor
  const handleFileCreate = (name: string) => {
    const clean = name.trim();
    if (!clean) return;
    router.push('/site_files/text_editor?filename=' + encodeURIComponent(clean));
  };
  // End: New File Creation

  // Start: Batch Delete (real R2 hard delete)
  const handleBatchDelete = async () => {
    if (selectedFiles.length === 0) return;
    try {
      const token = getSessionToken();
      if (!token) throw new Error('Sesi tidak sah');
      const res = await fetch('/api/storage/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ keys: selectedFiles.map((f) => f.id) }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Gagal memadam');
      await fetchFiles();
      setSelectedFiles([]);
      showToast('Fail terpilih berjaya dipadam', 'success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ralat padam');
    }
  };
  // End: Batch Delete

  // Start: Select All Toggle
  const handleSelectAll = () => {
    setSelectedFiles((prev) => (prev.length === files.length ? [] : files));
  };
  // End: Select All Toggle

  // Start: Handle File Actions
  const handleFileAction = async (item: FileManagerItem, action: FileAction, newName?: string) => {
    const token = getSessionToken();
    if (action === 'edit' && item.type === 'file') {
      router.push('/site_files/text_editor?filename=' + encodeURIComponent(item.filename));
    } else if (action === 'navigate' && item.type === 'folder') {
      // Placeholder for sub-directory navigation (root-level view only)
      showToast(`Membuka folder: ${item.name}`, 'info');
    } else if (action === 'rename' && newName) {
      // Start: Real R2 Rename (Copy + Delete via /api/storage/rename)
      // Flat object stores have no atomic rename, so we compute the new key by
      // preserving the existing user-prefix directory layout and swapping the
      // trailing filename/folder segment with the user-supplied newName.
      if (!token) {
        setError('Sesi tidak sah');
        return;
      }
      const cleanName = newName.trim().replace(/\/+$/g, '');
      if (!cleanName || cleanName.includes('/')) {
        showToast('Nama fail tidak sah', 'error');
        return;
      }
      const oldKey = item.id;
      const lastSlash = oldKey.lastIndexOf('/');
      const parentPrefix = lastSlash >= 0 ? oldKey.substring(0, lastSlash + 1) : '';
      const newKey = `${parentPrefix}${cleanName}`;
      try {
        const res = await fetch('/api/storage/rename', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ oldKey, newKey }),
        });
        const data = await res.json();
        if (!data.success) {
          throw new Error(
            (data.results && data.results[0] && data.results[0].error) ||
              data.error ||
              'Gagal menamakan semula'
          );
        }
        await fetchFiles();
        showToast('Fail berjaya dinamakan semula', 'success');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ralat tukar nama');
      }
      // End: Real R2 Rename
    } else if (action === 'delete') {
      if (!token) {
        setError('Sesi tidak sah');
        return;
      }
      try {
        const res = await fetch('/api/storage/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(
            item.type === 'file'
              ? { keys: [item.id] }
              : { folderNames: [item.name] }
          ),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error || 'Gagal memadam');
        await fetchFiles();
        setSelectedFiles((prev) => prev.filter((f) => f.id !== item.id));
        showToast('Berjaya dipadam', 'success');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ralat padam');
      }
    }
  };
  // End: Handle File Actions

  // Start: Live Storage Metric
  const totalSizeFormatted = formatFileSize(totalSize);
  const sizePercentage = Math.min((totalSize / STORAGE_LIMIT_BYTES) * 100, 100);
  const warningFiles = files.filter((f) => needsSizeWarning(f.size));
  const exceededFiles = files.filter((f) => exceedsFreeTierLimit(f.size));
  const approachingLimit = totalSize >= STORAGE_LIMIT_BYTES * 0.8;
  // End: Live Storage Metric

  // Start: Render FileManager
  return (
    <div className={embedded ? '' : 'mx-auto max-w-7xl p-6'}>
      <StorageToast toast={toast} />
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