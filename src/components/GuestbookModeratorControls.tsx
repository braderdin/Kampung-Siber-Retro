"use client";

import { useState } from 'react';

interface GuestbookModeratorControlsProps {
  entryId: number;
  username: string;
  onEntryDelete?: (entryId: number) => void;
  onUserFlag?: (username: string) => void;
  className?: string;
}

export default function GuestbookModeratorControls({
  entryId,
  username,
  onEntryDelete,
  onUserFlag,
  className,
}: GuestbookModeratorControlsProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch('/api/guestbook/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ entryId, username }),
      });

      const result = await response.json();
      
      if (result.success) {
        onEntryDelete?.(entryId);
      } else {
        console.error('Failed to delete entry:', result.message);
      }
    } catch (error) {
      console.error('Error deleting entry:', error);
    } finally {
      setIsProcessing(false);
      setShowConfirm(false);
    }
  };

  const handleFlagUser = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/guestbook/flag', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      const result = await response.json();
      
      if (result.success) {
        onUserFlag?.(username);
      } else {
        console.error('Failed to flag user:', result.message);
      }
    } catch (error) {
      console.error('Error flagging user:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  return (
    <div className={`flex items-center gap-2 ${className || ''}`}>
      <button
        onClick={handleDelete}
        disabled={isProcessing}
        className={`
          retro-btn-secondary text-xs px-2 py-1 flex items-center gap-1
          ${showConfirm 
            ? 'bg-red-600 hover:bg-red-700 text-white border-red-500' 
            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors duration-200
        `}
        title={showConfirm ? 'Klik lagi untuk sahkan padam' : 'Padam Entri'}
      >
        <span className="text-red-500">🗑️</span>
        <span>{showConfirm ? 'Sahkan Padam' : 'Padam'}</span>
      </button>

      {showConfirm && (
        <button
          onClick={handleCancel}
          disabled={isProcessing}
          className="retro-btn-secondary text-xs px-2 py-1 bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400"
        >
          Batal
        </button>
      )}

      <button
        onClick={handleFlagUser}
        disabled={isProcessing || showConfirm}
        className={`
          retro-btn-secondary text-xs px-2 py-1 flex items-center gap-1
          bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-300
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors duration-200
        `}
        title="Tandakan Pengguna"
      >
        <span>⚠️</span>
        <span>Tandakan</span>
      </button>
    </div>
  );
}
