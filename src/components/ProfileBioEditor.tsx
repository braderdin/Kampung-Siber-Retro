"use client";

import { useState, useEffect } from 'react';

interface ProfileBioEditorProps {
  initialBio?: string;
  onBioChange?: (bio: string) => void;
  className?: string;
}

export default function ProfileBioEditor({ 
  initialBio = 'Saya warga kampung siber retro yang antara.',
  onBioChange,
  className
}: ProfileBioEditorProps) {
  const [bio, setBio] = useState(initialBio);
  const [previewBio, setPreviewBio] = useState(initialBio);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setBio(initialBio);
    setPreviewBio(initialBio);
  }, [initialBio]);

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newBio = e.target.value;
    setBio(newBio);
    setPreviewBio(newBio);
    
    if (onBioChange) {
      onBioChange(newBio);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    if (onBioChange) {
      onBioChange(bio);
    }
  };

  const handleCancel = () => {
    setBio(previewBio);
    setIsEditing(false);
  };

  const handlePreviewChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPreviewBio(e.target.value);
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const formatBioForDisplay = (text: string): string => {
    return text
      .replace(/\n/g, '<br/>')
      .replace(/@/g, '<span class="text-cyan-400 font-bold">@</span>')
      .replace(/\b(Halo|Hello|Hi)\b/gi, '<span class="text-yellow-400 font-bold">$1</span>')
      .replace(/\b(kampung|siber|retro)\b/gi, '<span class="text-purple-400 font-bold">$1</span>');
  };

  return (
    <div className={`profile-bio-editor ${className || ''}`}>
      {/* Start: Editor Header */}
      <div className="retro-window-header bg-gray-200 dark:bg-gray-700 px-3 py-2 border-b border-gray-300 dark:border-gray-600 flex justify-between items-center">
        <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 pixel-font">
          <span className="mr-2">📝</span>
          Bio Editor
        </h4>
        {!isEditing ? (
          <button
            onClick={toggleEdit}
            className="retro-btn-secondary text-xs px-2 py-1"
          >
            Edit
          </button>
        ) : (
          <div className="flex gap-1">
            <button
              onClick={handleCancel}
              className="retro-btn-secondary text-xs px-2 py-1"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="retro-btn-primary text-xs px-2 py-1"
            >
              Save
            </button>
          </div>
        )}
      </div>
      {/* End: Editor Header */}

      {/* Start: Editor Content */}
      <div className="p-3">
        {/* Start: Live Preview Terminal */}
        <div className="retro-terminal mb-3">
          <div className="retro-terminal-header bg-gray-800 px-3 py-2 border-b border-gray-700 flex justify-between items-center">
            <div className="flex gap-2">
              <span className="text-xs text-gray-400">🔴</span>
              <span className="text-xs text-gray-400">🟡</span>
              <span className="text-xs text-gray-400">🟢</span>
            </div>
            <span className="text-xs text-gray-500 pixel-font">bio_preview.txt</span>
          </div>
          <div 
            className="retro-terminal-body p-3 font-mono text-xs leading-5 text-green-400"
            dangerouslySetInnerHTML={{ __html: formatBioForDisplay(previewBio) }}
          />
        </div>
        {/* End: Live Preview Terminal */}

        {/* Start: Textarea Input */}
        <div className="retro-window-sm">
          <label className="retro-window-header bg-gray-100 dark:bg-gray-800 px-3 py-2 border-b border-gray-300 dark:border-gray-600">
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300 pixel-font">
              Edit Bio
            </span>
          </label>
          <textarea
            value={bio}
            onChange={handleBioChange}
            className="w-full p-3 bg-black/20 border border-gray-300 dark:border-gray-600 rounded-b retro-textarea text-green-400 font-mono resize-vertical"
            rows={4}
            maxLength={500}
            placeholder="Type your bio here..."
          />
          <div className="retro-window-footer bg-gray-100 dark:bg-gray-800 px-3 py-2 border-t border-gray-300 dark:border-gray-600 flex justify-between items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400 pixel-font">
              {bio.length}/500
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 pixel-font">
              Ctrl+S to save
            </span>
          </div>
        </div>
        {/* End: Textarea Input */}
      </div>
      {/* End: Editor Content */}
    </div>
  );
}