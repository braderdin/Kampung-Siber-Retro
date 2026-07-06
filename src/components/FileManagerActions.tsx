// Start: Imports
"use client";

import { useLanguageStore } from '@/store/useLanguageStore';
import { enDictionary, msDictionary } from '@/i18n/dictionaries';
// End: Imports

// Start: Type Definitions
interface FileManagerActionsProps {
  onFileUpload: () => void;
  onFolderCreate: () => void;
  onFileCreate: () => void;
  selectedCount: number;
  onBatchDelete: () => void;
  className?: string;
}
// End: Type Definitions

// Start: FileManagerActions Component
export default function FileManagerActions({
  onFileUpload,
  onFolderCreate,
  onFileCreate,
  selectedCount,
  onBatchDelete,
  className
}: FileManagerActionsProps) {
  const { language } = useLanguageStore();
  const t = language === 'ms' ? msDictionary : enDictionary;

  // Start: Render Action Buttons
  return (
    <div className={`flex items-center space-x-2 mb-4 ${className || ''}`}>
      <button
        onClick={() => {}}
        className="retro-btn-secondary text-sm px-3 py-1"
        title="Select"
      >
        📋 Pilih
      </button>
      <button
        onClick={onFileCreate}
        className="retro-btn-secondary text-sm px-3 py-1"
        title="New File"
      >
        📄 Fail Baru
      </button>
      <button
        onClick={onFolderCreate}
        className="retro-btn-secondary text-sm px-3 py-1"
        title="New Folder"
      >
        📁 Folder Baru
      </button>
      <button
        onClick={onFileUpload}
        className="retro-btn-secondary text-sm px-3 py-1"
        title="Upload"
      >
        ⬆️ Muat Naik
      </button>
      {selectedCount > 0 && (
        <button
          onClick={onBatchDelete}
          className="retro-btn-secondary text-sm px-3 py-1 bg-red-500 hover:bg-red-600 text-white"
          title="Delete Selected"
        >
          🗑️ Padam
        </button>
      )}
    </div>
  );
}
// End: FileManagerActions Component
