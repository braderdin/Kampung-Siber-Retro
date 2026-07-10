"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import useTerminalCommandHistory from '@/hooks/useTerminalCommandHistory';

interface TerminalEntry {
  id: string;
  command: string;
  output: string;
  timestamp: Date;
}

interface RetroTerminalWidgetProps {
  className?: string;
}

type CommandFunction = () => string;
type CommandValue = string | CommandFunction;

const COMMANDS: Record<string, CommandValue> = {
  help: `Available commands:
  help        - Show this help message
  date        - Display current date
  time        - Display current time
  clear       - Clear terminal screen
  whoami      - Display current user
  ls          - List directory contents
  echo [text] - Echo text back
  about       - About this terminal
  matrix      - Enter the matrix mode`,
  date: () => new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
  time: () => new Date().toLocaleTimeString(),
  clear: '',
  whoami: 'resident',
  ls: 'desktop  documents  downloads  links  games',
  about: 'Kampung Siber Retro Terminal v1.0',
};

export default function RetroTerminalWidget({ className }: RetroTerminalWidgetProps) {
  const [entries, setEntries] = useState<TerminalEntry[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { addCommand, navigateUp, navigateDown, resetIndex } = useTerminalCommandHistory();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevCommand = navigateUp();
      if (prevCommand !== null) {
        setCurrentInput(prevCommand);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextCommand = navigateDown();
      setCurrentInput(nextCommand || '');
    } else if (e.key === 'Enter') {
      const command = currentInput.trim();
      if (command && !isProcessing) {
        executeCommand(command);
      }
    }
  }, [currentInput, isProcessing, navigateUp, navigateDown]);

  const executeCommand = async (command: string) => {
    addCommand(command);
    setIsProcessing(true);
    
    const newEntry: TerminalEntry = {
      id: Date.now().toString(),
      command,
      output: '',
      timestamp: new Date(),
    };

    const parts = command.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1).join(' ');

    if (cmd === 'clear') {
      setEntries([]);
    } else if (cmd === 'echo') {
      newEntry.output = args;
      setEntries(prev => [...prev, newEntry]);
    } else if (cmd === 'matrix') {
      newEntry.output = 'Entering matrix mode...';
      setEntries(prev => [...prev, newEntry]);
    } else if (COMMANDS[cmd]) {
      const commandValue = COMMANDS[cmd];
      const output = typeof commandValue === 'function'
        ? commandValue()
        : commandValue;
      newEntry.output = output;
      setEntries(prev => [...prev, newEntry]);
    } else {
      newEntry.output = `bash: ${cmd}: command not found`;
      setEntries(prev => [...prev, newEntry]);
    }

    setCurrentInput('');
    resetIndex();
    setIsProcessing(false);
  };

  return (
    <div className={`retro-terminal bg-black rounded-lg p-4 font-mono ${className || ''}`}>
      {/* Start: Terminal Header */}
      <div className="retro-terminal-header flex items-center gap-2 mb-3">
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <span className="text-xs text-gray-400">terminal@server:~</span>
      </div>
      {/* End: Terminal Header */}

      {/* Start: Terminal Output */}
      <div className="retro-terminal-output h-64 overflow-y-auto mb-3 text-green-400 text-sm">
        {entries.map(entry => (
          <div key={entry.id} className="mb-2">
            <div className="text-cyan-400">
              <span className="text-green-400">guest@retro:~$</span> {entry.command}
            </div>
            {entry.output && (
              <div className="pl-4 text-white">
                {entry.output}
              </div>
            )}
          </div>
        ))}
      </div>
      {/* End: Terminal Output */}

      {/* Start: Input Line */}
      <div className="retro-terminal-input flex items-center gap-2">
        <span className="text-green-400">guest@retro:~$</span>
        <input
          ref={inputRef}
          type="text"
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent text-green-400 outline-none caret-green-400"
          disabled={isProcessing}
          autoComplete="off"
          autoCapitalize="none"
          spellCheck="false"
        />
        {isProcessing && <span className="animate-pulse">▋</span>}
      </div>
      {/* End: Input Line */}
    </div>
  );
}