"use client";
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { useLanguageStore } from "@/store/useLanguageStore";
import { enDictionary, msDictionary } from "@/i18n/dictionaries";
import CodeMirrorEditor from "@/components/CodeMirrorEditor";

interface TextEditorProps {
  className?: string;
}

interface FileContent {
  filename: string;
  content: string;
  language: string;
}

const mockFiles: Record<string, FileContent> = {
  'galeri/index.html': {
    filename: 'index.html',
    content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Galeri Project</title>
  <style>
    body {
      font-family: 'Courier New', monospace;
      background: #000;
      color: #0f0;
      padding: 20px;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Galeri Project</h1>
    <p>Welcome to the galeri project page.</p>
  </div>
</body>
</html>`,
    language: 'html',
  },
  'styles.css': {
    filename: 'styles.css',
    content: `/* Main Styles */
body {
  margin: 0;
  padding: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Inter', sans-serif;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}`,
    language: 'css',
  },
};

function TextEditorContent({ className }: TextEditorProps) {
  const searchParams = useSearchParams();
  const { language } = useLanguageStore();
  const t = language === 'ms' ? msDictionary : enDictionary;

  const [filename, setFilename] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [fileLanguage, setFileLanguage] = useState<string>('html');

  useEffect(() => {
    const filenameParam = searchParams.get('filename');
    if (filenameParam) {
      setFilename(filenameParam);
      const fileData = mockFiles[filenameParam];
      if (fileData) {
        setContent(fileData.content);
        setFileLanguage(fileData.language);
      } else {
        setContent('');
        setFileLanguage('html');
      }
    }
  }, [searchParams]);

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 ${className || ''}`}>
      <div className="retro-window w-full max-w-4xl">
        <div className="retro-window-title-bar">
          <div className="retro-window-title">
            {filename || t.fileEditor}
          </div>
        </div>
        <div className="retro-window-client p-6">
          <div className="retro-editor-container">
            <CodeMirrorEditor 
              value={content}
              language={fileLanguage}
              onChange={setContent}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TextEditorPage({ className }: TextEditorProps) {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading editor...</div>}>
      <TextEditorContent className={className} />
    </Suspense>
  );
}
