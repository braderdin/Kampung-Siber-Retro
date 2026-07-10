"use client";

import { useState, useRef, useEffect } from 'react';

interface CodeSnippetPreviewerProps {
  code: string;
  language?: string;
  title?: string;
  className?: string;
}

export default function CodeSnippetPreviewer({
  code,
  language = 'html',
  title,
  className,
}: CodeSnippetPreviewerProps) {
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !previewRef.current) return;
    
    const previewEl = previewRef.current;
    previewEl.innerHTML = code;
  }, [code]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className={`retro-card ${className || ''}`}>
      {/* Start: Card Header */}
      <div className="retro-card-header flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 pixel-font">
          {title || 'Code Snippet Preview'}
        </h3>
        
        <div className="flex gap-1">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="retro-btn-secondary text-xs px-2 py-1"
          >
            {showPreview ? '📋' : '👁️'} {showPreview ? 'Kod' : 'Preview'}
          </button>
        </div>
      </div>
      {/* End: Card Header */}

      {/* Start: CRT Scanline Container */}
      <div className="relative p-3 bg-black rounded-b-lg overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-full opacity-10"
            style={{
              background: 'linear-gradient(transparent 50%, rgba(0,255,0,0.03) 50%)',
              backgroundSize: '100% 4px',
            }}
          />
        </div>
        
        {/* Start: Live Preview Window */}
        {showPreview ? (
          <div 
            ref={previewRef}
            className="min-h-32 bg-white border border-green-500 rounded overflow-auto retroscrollbar relative z-10"
            style={{
              fontFamily: 'monospace',
              fontSize: '12px',
            }}
          />
        ) : (
          <pre className="min-h-32 bg-gray-900 border border-green-500 rounded overflow-auto retroscrollbar relative z-10 p-2">
            <code className="text-green-400 font-mono text-xs whitespace-pre-wrap break-all">
              {code}
            </code>
          </pre>
        )}
        {/* End: Live Preview Window */}
      </div>
      {/* End: CRT Scanline Container */}

      {/* Start: Action Buttons */}
      <div className="p-2 border-t border-gray-200 dark:border-gray-700 flex gap-2">
        <button
          onClick={handleCopy}
          className="retro-btn-secondary text-xs px-3 py-1 flex items-center gap-1"
        >
          {copied ? '✅' : '📋'} 
          <span>{copied ? 'Disalin!' : 'Salin Kod'}</span>
        </button>
        
        <span className="text-xs text-gray-500 dark:text-gray-400 pixel-font self-center">
          📄 {language.toUpperCase()}
        </span>
      </div>
      {/* End: Action Buttons */}
    </div>
  );
}
