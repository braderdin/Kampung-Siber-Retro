// Start: Imports
"use client";

import { useLanguageStore } from '@/store/useLanguageStore';
import { enDictionary, msDictionary } from '@/i18n/dictionaries';
// End: Imports

// Start: Type Definitions
interface FileManagerListProps {
  files: any[];
  folders: any[];
  onFileAction: (file: any, action: string) => void;
  className?: string;
}
// End: Type Definitions

// Start: FileManagerList Component
export default function FileManagerList({ files, folders, onFileAction, className }: FileManagerListProps) {
  const { language } = useLanguageStore();
  const t = language === 'ms' ? msDictionary : enDictionary;

  // Start: Render List View
  return (
    <div className={`space-y-2 ${className || ''}`}>
      {/* Start: Folders List */}
      {folders.map((folder) => (
        <div
          key={folder.id}
          className="flex items-center justify-between p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <span className="text-2xl">📁</span>
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {folder.name}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onFileAction(folder, 'view')}
              className="text-blue-500 hover:text-blue-700"
              title="Lihat"
            >
              👁️
            </button>
            <button
              onClick={() => onFileAction(folder, 'rename')}
              className="text-green-500 hover:text-green-700"
              title="Tukar Nama"
            >
              ✏️
            </button>
            <button
              onClick={() => onFileAction(folder, 'delete')}
              className="text-red-500 hover:text-red-700"
              title="Padam"
            >
              🗑️
            </button>
          </div>
        </div>
      ))}
      {/* End: Folders List */}

      {/* Start: Files List */}
      {files.map((file) => (
        <div
          key={file.id}
          className="flex items-center justify-between p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <span className="text-2xl">📄</span>
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {file.name}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onFileAction(file, 'edit')}
              className="text-blue-500 hover:text-blue-700"
              title="Urus"
            >
              ✏️
            </button>
            <button
              onClick={() => onFileAction(file, 'rename')}
              className="text-green-500 hover:text-green-700"
              title="Tukar Nama"
            >
              ✏️
            </button>
            <button
              onClick={() => onFileAction(file, 'delete')}
              className="text-red-500 hover:text-red-700"
              title="Padam"
            >
              🗑️
            </button>
          </div>
        </div>
      ))}
      {/* End: Files List */}
    </div>
  );
}
// End: FileManagerList Component
