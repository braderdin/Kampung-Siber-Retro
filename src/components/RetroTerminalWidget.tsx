'use client';

import { useState } from 'react';

// Start: Type Definitions
interface RetroTerminalWidgetProps {
  title?: string;
  className?: string;
}
// End: Type Definitions

// Start: RetroTerminalWidget Component
export default function RetroTerminalWidget({ title = 'Coretan Terminal', className }: RetroTerminalWidgetProps) {
  // Start: State Management
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([
    'Coretan Terminal aktif.',
    "Taip 'help' untuk melihat arahan.",
  ]);
  // End: State Management

  // Start: Command Handler
  const handleCommand = (rawCommand: string) => {
    const command = rawCommand.trim().toLowerCase();

    if (!command) {
      return;
    }

    const responses: Record<string, string> = {
      help: 'Arahan tersedia: help, siri, tetapan, papan pemuka, clear.',
      siri: 'Siri Tutorial sedang disusun untuk modul baharu.',
      tetapan: 'Tetapan mod retro kini aktif dan stabil.',
      'papan pemuka': 'Papan Pemuka komuniti dikemas kini setiap jam.',
      clear: '',
    };

    const response = responses[command] ?? `Arahan tidak dikenali: ${rawCommand}`;

    setHistory((current) => {
      const nextEntries = command === 'clear' ? [] : [...current, `> ${rawCommand}`, response];
      return nextEntries;
    });
    setInput('');
  };
  // End: Command Handler

  // Start: Render Terminal Widget
  return (
    <div className={`retro-window border-2 border-gray-400 bg-[#111827] p-3 text-sm text-green-200 retro-shadow ${className || ''}`}>
      <div className="mb-2 flex items-center justify-between border-b border-green-800 pb-2">
        <span className="font-bold uppercase tracking-wide text-green-300">{title}</span>
        <span className="rounded bg-green-900/70 px-2 py-1 text-[10px] text-green-100">Live</span>
      </div>
      <div className="mb-2 h-36 overflow-auto rounded border border-green-900 bg-black/80 p-2 font-mono text-xs leading-5">
        {history.map((line, index) => (
          <div key={`${line}-${index}`} className="whitespace-pre-wrap">
            {line}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 font-mono text-xs">
        <span className="text-green-300">retro@kampung:~$</span>
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              handleCommand(input);
            }
          }}
          className="w-full bg-transparent text-green-100 outline-none"
          placeholder="masukkan arahan"
          aria-label="terminal command input"
        />
      </div>
    </div>
  );
}
// End: RetroTerminalWidget Component
