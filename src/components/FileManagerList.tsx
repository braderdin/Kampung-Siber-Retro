// Start: Imports
"use client";

import { useLanguageStore } from '@/store/useLanguageStore';
import { enDictionary, msDictionary } from '@/i18n/dictionaries';
import type { FileAction, FileManagerItem, SiteFile, SiteFolder } from '@/types/fileManager';
// End: Imports

// Start: Type Definitions
interface FileManagerListProps {
  files: SiteFile[];
  folders: SiteFolder[];
  onFileAction: (file: FileManagerItem, action: FileAction, newName?: string) => void;
  className?: string;
}
// End: Type Definitions

// Start: FileManagerList Component
export default function FileManagerList({ files, folders, onFileAction, className }: FileManagerListProps) {
  const { language } = useLanguageStore();
  const t = language === 'ms' ? msDictionary : enDictionary;

  // Start: Handle Rename
  const handleRename = (item: FileManagerItem) => {
    const promptLabel = item.type === 'folder' ? item.name : item.filename;
    const newName = prompt('Masukkan nama baru:', promptLabel);
    if (newName && newName.trim() !== promptLabel) {
      onFileAction(item, 'rename', newName.trim());
    }
  };
  // End: Handle Rename

  // Start: Handle Delete
  const handleDelete = (item: FileManagerItem) => {
    const itemName = item.type === 'folder' ? item.name : item.filename;
    if (window.confirm(`Anda yakin mahu memadamkan ${itemName}?`)) {
      onFileAction(item, 'delete');
    }
  };
  // End: Handle Delete

  // Start: Render List View
  return (
    <div className={`space-y-2 ${className || ''}`}>
      {/* Start: Folders List */}
      {folders.map((folder) => (
        <div
          key={folder.id}
          className="flex items-center justify-between p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
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
              onClick={() => handleRename(folder)}
              className="text-green-500 hover:text-green-700"
              title="Tukar Nama"
            >
              ✏️
            </button>
            <button
              onClick={() => handleDelete(folder)}
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
          className="flex items-center justify-between p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <span className="text-2xl">📄</span>
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {file.filename}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onFileAction(file, 'edit')}
              className="text-blue-500 hover:text-blue-700"
              title="Edit"
            >
              ✏️
            </button>
            <button
              onClick={() => handleRename(file)}
              className="text-green-500 hover:text-green-700"
              title="Tukar Nama"
            >
              ✏️
            </button>
            <button
              onClick={() => handleDelete(file)}
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
