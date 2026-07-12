import { useState, useEffect, useCallback, useRef } from 'react';

interface UseTerminalCommandHistoryReturn {
  history: string[];
  addCommand: (command: string) => void;
  navigateUp: () => string | null;
  navigateDown: () => string | null;
  resetIndex: () => void;
}

const STORAGE_KEY = 'terminal_command_history';
const MAX_HISTORY = 15;

export default function useTerminalCommandHistory(): UseTerminalCommandHistoryReturn {
  const [history, setHistory] = useState<string[]>([]);
  const historyIndexRef = useRef<number>(-1);
  const tempCommandRef = useRef<string>('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setHistory(parsed.slice(0, MAX_HISTORY));
        }
      }
    } catch (error) {
      console.error('Error loading command history:', error);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Error saving command history:', error);
    }
  }, [history]);

  const addCommand = useCallback((command: string) => {
    if (!command || command.trim() === '') return;
    
    const trimmed = command.trim();
    
    setHistory(prev => {
      const exists = prev.includes(trimmed);
      if (exists) return prev;
      
      const newHistory = [trimmed, ...prev];
      return newHistory.slice(0, MAX_HISTORY);
    });
    
    historyIndexRef.current = -1;
  }, []);

  const navigateUp = useCallback(() => {
    if (history.length === 0) return null;
    
    if (historyIndexRef.current === -1) {
      tempCommandRef.current = '';
    }
    
    if (historyIndexRef.current < history.length - 1) {
      historyIndexRef.current += 1;
      return history[historyIndexRef.current];
    }
    
    return history[historyIndexRef.current];
  }, [history]);

  const navigateDown = useCallback(() => {
    if (history.length === 0 || historyIndexRef.current <= 0) {
      historyIndexRef.current = -1;
      return tempCommandRef.current || null;
    }
    
    if (historyIndexRef.current > -1) {
      historyIndexRef.current -= 1;
      return history[historyIndexRef.current];
    }
    
    return null;
  }, [history]);

  const resetIndex = useCallback(() => {
    historyIndexRef.current = -1;
    tempCommandRef.current = '';
  }, []);

  return {
    history,
    addCommand,
    navigateUp,
    navigateDown,
    resetIndex,
  };
}
