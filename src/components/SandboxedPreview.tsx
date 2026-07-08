"use client";

import { useEditorStore } from "@/store/useEditorStore";

interface SandboxedPreviewProps {
  className?: string;
}

export default function SandboxedPreview({ className }: SandboxedPreviewProps) {
  const { htmlCode, cssCode, jsCode } = useEditorStore();
  
  // Start: Generate Preview Content
  // Note: Code values are already debounced at 500ms in CodeMirrorEditor.tsx
  // to prevent browser freezes during continuous typing
  const generatePreviewContent = () => {
    const fullHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Live Preview</title>
        <style>
          ${cssCode}
        </style>
      </head>
      <body>
        ${htmlCode}
        <script>
          ${jsCode}
        </script>
      </body>
      </html>
    `;
    return fullHtml;
  };
  // End: Generate Preview Content

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