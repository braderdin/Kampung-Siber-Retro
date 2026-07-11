// Start: Editor HTML Preview Component
import React, { useEffect, useRef, useState } from 'react';

// Start: Editor HTML Preview Props Interface
interface EditorHtmlPreviewProps {
  content: string;
  className?: string;
  onContentChange?: (content: string) => void;
}
// End: Editor HTML Preview Props Interface

export default function EditorHtmlPreview({ content, className, onContentChange }: EditorHtmlPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);

  // Start: Update Iframe Content Effect
  useEffect(() => {
    if (iframeRef.current && content) {
      try {
        const iframe = iframeRef.current;
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        
        if (iframeDoc) {
          iframeDoc.open();
          iframeDoc.write(content);
          iframeDoc.close();
        }
        
        setPreviewError(null);
      } catch (error) {
        console.error('Preview error:', error);
        setPreviewError('Gagal memaparkan pratonton');
      }
    }
  }, [content]);
  // End: Update Iframe Content Effect

  // Start: Sandbox Security Attributes
  const sandboxAttributes = 'allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox';
  // End: Sandbox Security Attributes

  return (
    // Start: Preview Container Wrapper
    <div className={`flex flex-col h-full bg-gray-800 ${className || ''}`}>
      {/* Start: Preview Title Bar */}
      <div className="retro-window-title-bar-slate flex items-center justify-between px-3 py-2">
        <span className="text-xs font-mono text-gray-300">
          🔍 Pratonton Langsung
        </span>
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-gray-500">HTML Preview</span>
        </div>
      </div>
      {/* End: Preview Title Bar */}

      {/* Start: Iframe Preview Area */}
      <div className="flex-1 overflow-hidden bg-white relative">
        {previewError ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-red-500 text-sm pixel-font">{previewError}</p>
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            title="HTML Preview"
            className="w-full h-full border-none"
            sandbox={sandboxAttributes}
            style={{ backgroundColor: 'white' }}
          />
        )}
      </div>
      {/* End: Iframe Preview Area */}
    </div>
    // End: Preview Container Wrapper
  );
}