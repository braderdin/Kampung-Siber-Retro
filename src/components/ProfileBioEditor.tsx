"use client";

import { useState, useEffect } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { enDictionary, msDictionary } from '@/i18n/dictionaries';

interface ProfileBioEditorProps {
  initialBio?: string;
  onBioChange?: (bio: string) => void;
  className?: string;
}

const TERMINAL_COLORS = {
  background: 'bg-black',
  text: 'text-green-400',
  cursor: 'bg-green-400',
  prompt: 'text-cyan-400',
};

export default function ProfileBioEditor({ 
  initialBio = 'Saya pengguna kampung siber retro yang antara. Menyukai HTML, CSS, dan JavaScript.',
  onBioChange,
  className 
}: ProfileBioEditorProps) {
  const { language } = useLanguageStore();
  const t = language === 'ms' ? msDictionary : enDictionary;
  
  const [bio, setBio] = useState<string>(initialBio);
  const [preview, setPreview] = useState<string>(initialBio);
  const [charCount, setCharCount] = useState<number>(bio.length);
  const MAX_CHARS = 200;

  useEffect(() => {
    const sanitized = bio
      .replace(/</g, '<')
      .replace(/>/g, '>')
      .replace(/&/g, '&')
      .replace(/"/g, '"')
      .replace(/'/g, '&#039;');
    setPreview(sanitized);
  }, [bio]);

  useEffect(() => {
    setCharCount(bio.length);
    if (onBioChange) {
      onBioChange(bio);
    }
  }, [bio, onBioChange]);

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newBio = e.target.value;
    if (newBio.length <= MAX_CHARS) {
      setBio(newBio);
    }
  };

  const handleClear = () => {
    setBio('');
  };

  const handleLoadSample = () => {
    const samples = [
      '🎮 Penggemar permainan retro 90-an',
      '💻 Coder, artist, dan penyelidik siber',
      '☕ Hobi makan kopi dan dengar chiptune',
      '🌐 Penyerta aktif komuniti kampung siber',
      '⭐ Pembangun perisian siber retro',
    ];
    const random = samples[Math.floor(Math.random() * samples.length)];
    setBio(random);
  };

  return (
    <div className={`profile-bio-editor ${className || ''}`}>
      <div className="retro-window retro-border">
        <div className="retro-window-header bg-gray-200 dark:bg-gray-700 px-3 py-2 border-b border-gray-300 dark:border-gray-600">
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">
            <span className="mr-2">📝</span>
            Penulis Bio Peribadi
          </h3>
        </div>
        <div className="retro-window-client p-4">
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
              Tulis bio anda di bawah:
            </label>
            <textarea
              value={bio}
              onChange={handleBioChange}
              placeholder="Apa yang boleh saya kongsikan tentang diri saya?"
              className="retro-textarea w-full min-h-[100px] font-mono text-sm resize-none"
              maxLength={MAX_CHARS}
              rows={5}
            />
            <div className="flex justify-between items-center mt-2">
              <span className={`text-xs ${charCount >= MAX_CHARS ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
                {charCount} / {MAX_CHARS} aksara
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handleLoadSample}
                  className="retro-btn-secondary text-xs px-2 py-1"
                >
                  Contoh
                </button>
                <button
                  onClick={handleClear}
                  className="retro-btn-secondary text-xs px-2 py-1"
                >
                  Bersihkan
                </button>
              </div>
            </div>
          </div>

          <div className="retro-terminal-preview">
            <div className="retro-terminal-header bg-gray-800 px-3 py-2 border-b border-gray-700">
              <span className="text-xs text-gray-400 font-mono">preview.png</span>
            </div>
            <div className="retro-terminal-body p-3 font-mono text-sm">
              <div className="flex items-start gap-2">
                <span className="text-cyan-400">retro@kampung-siber:~$</span>
                <span className="break-words">
                  <span className="text-green-400">{preview || 'Bio anda akan dipaparkan di sini...'}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            <span className="font-mono">💡 Tips:</span> Gunakan HTML sederhana seperti <span className="text-blue-400"><b></b></span> untuk bool, <span className="text-blue-400"><i></i></span> untuk miring
          </div>
        </div>
      </div>
    </div>
  );
}