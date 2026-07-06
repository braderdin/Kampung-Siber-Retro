"use client";

import { useEditorStore } from "@/store/useEditorStore";
import useDebounce from "@/hooks/useDebounce";

interface SandboxedPreviewProps {
  className?: string;
}

export default function SandboxedPreview({ className }: SandboxedPreviewProps) {
  const { htmlCode, cssCode, jsCode } = useEditorStore();
  
  // Debounce all code values for performance
  const debouncedHtml = useDebounce(htmlCode, { delay: 100 });
  const debouncedCss = useDebounce(cssCode, { delay: 100 });
  const debouncedJs = useDebounce(jsCode, { delay: 100 });

  // Generate complete HTML document with injected CSS and JS
  const generatePreviewContent = () => {
    const fullHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Live Preview</title>
        <style>
          ${debouncedCss}
          * { box-sizing: border-box; }
          body { 
            margin: 0; 
            padding: 20px; 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            background: #fff;
            color: #333;
          }
        </style>
      </head>
      <body>
        ${debouncedHtml}
        <script>
          ${debouncedJs}
        </script>
      </body>
      </html>
    `;
    return fullHtml;
  };

  return (
    <div className={className || "w-full h-full"}>
      <iframe
        srcDoc={generatePreviewContent()}
        title="sandbox-preview"
        sandbox="allow-scripts"
        className="w-full h-full border-0 rounded bg-white"
        style={{ 
          minHeight: '200px',
          backgroundColor: '#f5f5f5'
        }}
      />
    </div>
  );
}
