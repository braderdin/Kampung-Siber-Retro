"use client";

import React, { useState, useRef, useEffect } from "react";

interface CustomCssSandboxProps {
  initialCode?: string;
  className?: string;
}

export const CustomCssSandbox: React.FC<CustomCssSandboxProps> = ({
  initialCode = "",
  className = "",
}) => {
  const [cssCode, setCssCode] = useState(initialCode);
  const [htmlContent, setHtmlContent] = useState("");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { margin: 0; padding: 20px; font-family: monospace; background: #0a0a0a; color: #fff; }
              ${cssCode}
            </style>
          </head>
          <body>
            <div id="sandbox-content"></div>
          </body>
          </html>
        `);
        doc.close();
      }
    }
  }, [cssCode]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCssCode(e.target.value);
  };

  const applyCode = () => {
    setHtmlContent(cssCode);
  };

  const resetCode = () => {
    setCssCode("");
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(cssCode);
    } catch (error) {
      console.error("Failed to copy code:", error);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-pixel text-sm text-gray-300">CSS Editor</h3>
            <div className="flex gap-2">
              <button
                onClick={applyCode}
                className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white font-pixel text-xs rounded transition-colors"
              >
                Apply
              </button>
              <button
                onClick={copyCode}
                className="px-2 py-1 bg-gray-800/30 hover:bg-gray-700/50 text-gray-300 font-pixel text-xs rounded transition-colors"
              >
                Copy
              </button>
              <button
                onClick={resetCode}
                className="px-2 py-1 bg-gray-800/30 hover:bg-gray-700/50 text-gray-300 font-pixel text-xs rounded transition-colors"
              >
                Reset
              </button>
            </div>
          </div>

          <textarea
            value={cssCode}
            onChange={handleCodeChange}
            placeholder="Enter your CSS code here..."
            rows={12}
            className="retro-textarea w-full font-mono text-xs bg-black/50 border border-gray-700/50 rounded focus:outline-none focus:border-blue-500/50 resize-y"
          />
        </div>

        <div className="space-y-3">
          <h3 className="font-pixel text-sm text-gray-300">Preview</h3>
          
          <div className="border border-gray-700/50 rounded overflow-hidden">
            <iframe
              ref={iframeRef}
              title="CSS Sandbox Preview"
              className="w-full h-64"
              sandbox="allow-scripts"
            />
          </div>

          <div className="bg-gray-800/30 border border-gray-700/50 rounded p-3">
            <div className="font-pixel text-xs text-gray-400 mb-2">
              Sample HTML to test with:
            </div>
            <div className="font-pixel text-xs text-gray-500 bg-gray-800/50 p-2 rounded">
              <div class="test">Your content here</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomCssSandbox;