"use client";

import { useEditorStore } from "@/store/useEditorStore";
import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";
import { useRef } from "react";

interface CodeMirrorEditorProps {
  className?: string;
}

export default function CodeMirrorEditor({ className }: CodeMirrorEditorProps) {
  const { htmlCode, cssCode, jsCode, activeTab, setHtmlCode, setCssCode, setJsCode } = useEditorStore();
  const editorRef = useRef<any>(null);

  // Determine current code based on active tab
  const getCurrentCode = () => {
    switch (activeTab) {
      case 'html': return htmlCode;
      case 'css': return cssCode;
      case 'js': return jsCode;
      default: return htmlCode;
    }
  };

  // Determine setter function based on active tab
  const setCurrentCode = (value: string) => {
    switch (activeTab) {
      case 'html': return setHtmlCode(value);
      case 'css': return setCssCode(value);
      case 'js': return setJsCode(value);
      default: return setHtmlCode(value);
    }
  };

  // Get language extension based on active tab
  const getLanguageExtension = () => {
    switch (activeTab) {
      case 'html': return html();
      case 'css': return css();
      case 'js': return javascript();
      default: return html();
    }
  };

  // Handle code changes and auto-save to store
  const handleCodeChange = (value: string) => {
    setCurrentCode(value);
  };

  return (
    <div className={className || "w-full h-full"}>
      <CodeMirror
        ref={editorRef}
        value={getCurrentCode()}
        height="100%"
        extensions={[getLanguageExtension()]}
        onChange={handleCodeChange}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLine: true,
          foldGutter: true,
          autocompletion: true,
        }}
        className="retro-editor-bg retro-editor-fg retro-editor-border"
        theme="light"
      />
    </div>
  );
}
