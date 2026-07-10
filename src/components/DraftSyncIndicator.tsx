"use client";

import React, { useEffect, useState } from 'react';
import { useEditorStore } from '@/store/useEditorStore';

export const DraftSyncIndicator: React.FC = () => {
  const isSaving = useEditorStore((state) => state.isSaving);
  const [visible, setVisible] = useState(false);
  const [savingState, setSavingState] = useState<'saving' | 'saved'>('saved');

  useEffect(() => {
    if (isSaving) {
      setVisible(true);
      setSavingState('saving');
    } else {
      setSavingState('saved');
      const timer = setTimeout(() => setVisible(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isSaving]);

  if (!visible) return null;

  return (
    <div className="retro-badge inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/20 border border-cyan-500/50 rounded-full pixel-font">
      <span className={`w-2 h-2 rounded-full ${savingState === 'saving' ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`} />
      <span className={`text-xs font-medium ${savingState === 'saving' ? 'text-yellow-600' : 'text-green-600'}`}>
        {savingState === 'saving' ? 'Saving...' : 'Saved'}
      </span>
    </div>
  );
};

export default DraftSyncIndicator;
