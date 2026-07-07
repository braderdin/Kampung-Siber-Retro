// Start: Imports
'use client';
import { useState, useEffect } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { enDictionary, msDictionary } from '@/i18n/dictionaries';
import DashboardProfileBanner from '@/components/DashboardProfileBanner';
import FileManagerActions from '@/components/FileManagerActions';
import FileManagerGrid from '@/components/FileManagerGrid';
import FileManagerList from '@/components/FileManagerList';
import CodeMirrorEditor from '@/components/CodeMirrorEditor';
import SandboxedPreview from '@/components/SandboxedPreview';
import RetroToolbar from '@/components/RetroToolbar';
// End: Imports

// Start: Type Definitions
interface SiteFile {
  id: string;
  filename: string;
  size: number;
  contentType: string;
  uploadedAt: string;
  url: string;
}

interface SiteFolder {
  id: string;
  name: string;
  createdAt: string;
}

interface SiteFilesResponse {
  success: boolean;
  data?: SiteFile[];
  error?: string;
}
// End: Type Definitions

// Start: SiteFilesPage Component
export default function SiteFilesPage() {
  // Start: State Management
  const { language } = useLanguageStore();
  const t = language === 'ms' ? msDictionary : enDictionary;
  
  const [files, setFiles] = useState<SiteFile[]>([]);
  const [folders, setFolders] = useState<SiteFolder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<SiteFile[]>([]);
  const [showEditor, setShowEditor] = useState(false);
  // End: State Management

  // Start: Fetch Files
  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true);
      setError(null);

      try {
        // Simulated file data
        const mockFiles: SiteFile[] = [
          {
            id: '1',
            filename: 'index.html',
            size: 1024,
            contentType: 'text/html',
            uploadedAt: new Date().toISOString(),
            url: '/files/index.html'
          },
          {
            id: '2',
            filename: 'style.css',
            size: 2048,
            contentType: 'text/css',
            uploadedAt: new Date().toISOString(),
            url: '/files/style.css'
          },
          {
            id: '3',
            filename: 'script.js',
            size: 1536,
            contentType: 'text/javascript',
            uploadedAt: new Date().toISOString(),
            url: '/files/script.js'
          }
        ];

        const mockFolders: SiteFolder[] = [
          {
            id: 'f1',
            name: 'images',
            createdAt: new Date().toISOString()
          },
          {
            id: 'f2',
            name: 'documents',
            createdAt: new Date().toISOString()
          }
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

  // Start: Handle File Actions
  const handleFileAction = (file: SiteFile | SiteFolder, action: string) => {
    console.log(`Action ${action} on file/folder:`, file);
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

  // Start: Render Site Files Page
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Start: Profile Banner */}
      <DashboardProfileBanner />
      {/* End: Profile Banner */}

      {/* Start: View Toggle */}
      <div className="flex items-center justify-end mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {t.dashboardTitle}
          </span>
        </div>
      </div>
      {/* End: View Toggle */}

      {/* Start: File Manager Actions */}
      <FileManagerActions
        onFileUpload={handleFileUpload}
        onFolderCreate={handleFolderCreate}
        onFileCreate={handleFileCreate}
        selectedCount={selectedFiles.length}
        onBatchDelete={handleBatchDelete}
      />
      {/* End: File Manager Actions */}

      {/* Start: File Manager Content */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            {t.loadingDashboard}
          </p>
        </div>
      )}

      {error && (
        <div className="text-center py-8">
          <p className="text-red-500 dark:text-red-400">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              {t.myFiles}
            </h2>
            <FileManagerGrid
              files={files}
              folders={folders}
              onFileAction={handleFileAction}
            />
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              {t.fileEditor}
            </h2>
            <div className="grid grid-cols-2 gap-2 mb-2">
              {(['html', 'css', 'js'] as const).map((tab) => (
                <button
                  key={tab}
                  className="retro-tab-btn retro-tab-active"
                >
                  {t[`${tab}Tab` as keyof typeof t] as string}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border-2 border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
                <CodeMirrorEditor />
              </div>
              <div className="border-2 border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
                <SandboxedPreview />
              </div>
            </div>
            <RetroToolbar className="mt-2" />
          </div>
        </div>
      )}
      {/* End: File Manager Content */}
    </div>
  );
}
// End: SiteFilesPage Component
