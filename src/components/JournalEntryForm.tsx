"use client";

import { useState, useRef, useEffect } from 'react';

interface JournalEntryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, content: string) => void;
  username: string;
}

export default function JournalEntryForm({ 
  isOpen, 
  onClose, 
  onSubmit,
  username 
}: JournalEntryFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const MAX_CHARS = 2000;

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setContent(text);
    setCharacterCount(text.length);
    setWordCount(text.trim().split(/\s+/).filter(w => w.length > 0).length);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      return;
    }

    setIsSaving(true);
    
    // Simulate async save operation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onSubmit(title, content);
    setIsSaving(false);
    onClose();
  };

  const handleCancel = () => {
    setTitle('');
    setContent('');
    setCharacterCount(0);
    setWordCount(0);
    setIsSaving(false);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Start: Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-all duration-300"
        onClick={handleCancel}
      />
      {/* End: Backdrop */}

      {/* Start: Modal Content */}
      <div className="relative retro-card w-full max-w-2xl mx-auto bg-gray-50 dark:bg-gray-900 border-2 border-dashed border-purple-400/50">
        {/* Start: Modal Header */}
        <div className="retro-card-header bg-gradient-to-r from-purple-900/80 to-pink-900/80 text-white px-4 py-3 border-b-2 border-dashed border-white/30">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold pixel-font flex items-center gap-2">
              <span className="text-2xl">✍️</span>
              <span>Buat Entri Baru</span>
            </h2>
            <button
              onClick={handleCancel}
              className="retro-btn-secondary text-xs px-2 py-1 bg-white/20 hover:bg-white/30"
              disabled={isSaving}
            >
              ✕
            </button>
          </div>
        </div>
        {/* End: Modal Header */}

        {/* Start: Modal Body */}
        <div className="p-4 max-h-96 overflow-y-auto">
          {/* Start: Title Input */}
          <div className="mb-4">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300 pixel-font mb-2 block">
              Tajuk Entri
            </label>
            <input
              type="text"
              placeholder="Masukkan tajuk entri anda..."
              value={title}
              onChange={handleTitleChange}
              className="retro-input w-full"
              maxLength={100}
              disabled={isSaving}
            />
            <div className="text-xs text-gray-500 dark:text-gray-400 pixel-font mt-1">
              {title.length}/100
            </div>
          </div>
          {/* End: Title Input */}

          {/* Start: Content Textarea */}
          <div className="mb-4">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300 pixel-font mb-2 block">
              Kandungan
            </label>
            <textarea
              ref={textareaRef}
              placeholder="Ceritakan apa yang anda alami hari ini..."
              value={content}
              onChange={handleContentChange}
              className="retro-textarea w-full resize-y"
              rows={6}
              maxLength={MAX_CHARS}
              disabled={isSaving}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-500 dark:text-gray-400 pixel-font">
                {wordCount} perkataan
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 dark:text-gray-400 pixel-font">
                  {characterCount.toLocaleString()}/{MAX_CHARS}
                </span>
                {characterCount >= MAX_CHARS * 0.9 && characterCount < MAX_CHARS && (
                  <span className="text-xs text-amber-500 pixel-font">⚠️ Hampir penuh</span>
                )}
                {characterCount >= MAX_CHARS && (
                  <span className="text-xs text-red-500 pixel-font">❌ Penuh</span>
                )}
              </div>
            </div>
          </div>
          {/* End: Content Textarea */}

          {/* Start: Preview */}
          <div className="retro-card bg-white dark:bg-gray-800 border-2 border-dashed border-cyan-400/30">
            <div className="retro-card-header bg-gray-100 dark:bg-gray-800 px-3 py-2 border-b-2 border-dashed border-gray-200 dark:border-gray-700">
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300 pixel-font">
                Penonton Keseluruhan
              </span>
            </div>
            <div className="p-3">
              <h3 className="text-sm font-bold text-purple-600 dark:text-purple-300 pixel-font mb-2 break-words">
                {title || 'Tajuk tidak tersedia'}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 pixel-font leading-relaxed whitespace-pre-wrap break-words">
                {content || 'Tiada kandungan...'}
              </p>
              <div className="mt-3 flex gap-2 text-xs text-gray-500 dark:text-gray-400 pixel-font">
                <span>👤 {username}</span>
                <span>⏱️ {new Date().toLocaleDateString('ms-MY')}</span>
              </div>
            </div>
          </div>
          {/* End: Preview */}
        </div>
        {/* End: Modal Body */}

        {/* Start: Modal Footer */}
        <div className="retro-card-footer bg-gray-100 dark:bg-gray-800 px-4 py-3 border-t-2 border-dashed border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className={`retro-btn-primary text-xs px-4 py-2 ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isSaving || !title.trim() || !content.trim()}
            >
              {isSaving ? '⏳ Menyimpan...' : '💾 Simpan Entri'}
            </button>
            <button
              onClick={handleCancel}
              className="retro-btn-secondary text-xs px-4 py-2"
              disabled={isSaving}
            >
              ❌ Batal
            </button>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400 pixel-font">
            Tekan ESC untuk tutup
          </span>
        </div>
        {/* End: Modal Footer */}

        {/* Start: Custom Styles */}
        <style jsx>{`
          .retro-textarea {
            background-color: #00000020;
            border: 1px solid #d1d5db;
            border-radius: 0.375rem;
            padding: 0.75rem;
            color: #065f46;
            font-family: inherit;
            font-size: 0.875rem;
            line-height: 1.5rem;
            resize: vertical;
            transition: border-color 0.2s, box-shadow 0.2s;
          }
          
          .retro-textarea:focus {
            outline: none;
            border-color: #0891b2;
            box-shadow: 0 0 0 3px rgba(8, 145, 178, 0.3);
          }
          
          .retro-textarea::placeholder {
            color: #6b7280;
          }
        `}</style>
        {/* End: Custom Styles */}
      </div>
      {/* End: Modal Content */}
    </div>
  );
}