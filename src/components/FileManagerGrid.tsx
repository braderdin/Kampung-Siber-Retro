// Start: Imports
"use client";

import { useLanguageStore } from '@/store/useLanguageStore';
import { enDictionary, msDictionary } from '@/i18n/dictionaries';
import type { FileAction, FileManagerItem, SiteFile, SiteFolder } from '@/types/fileManager';
// End: Imports

// Start: Type Definitions
interface FileManagerGridProps {
  files: SiteFile[];
  folders: SiteFolder[];
  onFileAction: (file: FileManagerItem, action: FileAction, newName?: string) => void;
  className?: string;
}
// End: Type Definitions

// Start: FileManagerGrid Component
export default function FileManagerGrid({ files, folders, onFileAction, className }: FileManagerGridProps) {
  const { language } = useLanguageStore();
  const t = language === 'ms' ? msDictionary : enDictionary;

  // Start: Handle Double Click
  const handleFolderDoubleClick = (folder: SiteFolder) => {
    onFileAction(folder, 'navigate');
  };
  // End: Handle Double Click

  // Start: Render Grid View
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 ${className || ''}`}>
      {/* Start: Folders Grid */}
      {folders.map((folder) => (
        <div
          key={folder.id}
          className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 flex flex-col items-center justify-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors cursor-pointer"
          onDoubleClick={() => handleFolderDoubleClick(folder)}
        >
          <span className="text-3xl mb-2">📁</span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
            {folder.name}
          </span>
        </div>
      ))}
      {/* End: Folders Grid */}

      {/* Start: Files Grid */}
      {files.map((file) => (
        <div
          key={file.id}
          className="border-2 border-gray-300 dark:border-gray-600 rounded-lg p-3 flex flex-col items-center justify-center hover:shadow-lg transition-shadow"
        >
          <span className="text-2xl mb-2">📄</span>
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center truncate w-full">
            {file.filename}
          </span>
          <div className="flex space-x-1 mt-2">
            <button
              onClick={() => onFileAction(file, 'edit')}
              className="text-blue-500 hover:text-blue-700 text-sm"
              title="Edit"
            >
              ✏️
            </button>
            <button
              onClick={() => onFileAction(file, 'rename')}
              className="text-green-500 hover:text-green-700 text-sm"
              title="Rename"
            >
              ✏️
            </button>
            <button
              onClick={() => onFileAction(file, 'delete')}
              className="text-red-500 hover:text-red-700 text-sm"
              title="Delete"
            >
              🗑️
            </button>
          </div>
        </div>
      ))}
      {/* End: Files Grid */}
    </div>
  );
}
