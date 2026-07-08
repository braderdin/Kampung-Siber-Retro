"use client";

import { useEditorStore } from "@/store/useEditorStore";
import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { useRef, useState, useEffect } from "react";

interface CodeMirrorEditorProps {
  className?: string;
  value?: string;
  language?: string;
  onChange?: (value: string) => void;
}

// Start: Dark Mode Detection Hook
const useDarkMode = () => {
  const [isDark, setIsDark] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const checkDarkMode = () => {
      const darkClass = document.documentElement.classList.contains("dark");
      setIsDark(darkClass);
    };
    checkDarkMode();

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  return { isDark, isClient };
};
// End: Dark Mode Detection Hook

export default function CodeMirrorEditor({ 
  className, 
  value, 
  language = "html",
  onChange 
}: CodeMirrorEditorProps) {
  const { htmlCode, cssCode, jsCode, activeTab, setHtmlCode, setCssCode, setJsCode } = useEditorStore();
  const editorRef = useRef<any>(null);
  const { isDark } = useDarkMode();

  // Start: Determine Current Code
  const getCurrentCode = () => {
    if (value !== undefined) {
      return value;
    }
    switch (activeTab) {
      case "html": return htmlCode;
      case "css": return cssCode;
      case "js": return jsCode;
      default: return htmlCode;
    }
  };
  // End: Determine Current Code

  // Start: Determine Setter Function
  const setCurrentCode = (newValue: string) => {
    if (onChange) {
      onChange(newValue);
    } else {
      switch (activeTab) {
        case "html": return setHtmlCode(newValue);
        case "css": return setCssCode(newValue);
        case "js": return setJsCode(newValue);
        default: return setHtmlCode(newValue);
      }
    }
  };
  // End: Determine Setter Function

  // Start: Get Language Extension
  const getLanguageExtension = () => {
    if (language) {
      switch (language) {
        case "css": return css();
        case "javascript": return javascript();
        default: return html();
      }
    }
    switch (activeTab) {
      case "html": return html();
      case "css": return css();
      case "js": return javascript();
      default: return html();
    }
  };
  // End: Get Language Extension

  // Start: Handle Code Changes
  const handleCodeChange = (value: string) => {
    setCurrentCode(value);
  };
  // End: Handle Code Changes

  // Start: Cyberpunk Theme Configuration
  const theme = vscodeDark;
  // End: Cyberpunk Theme Configuration

  return (
    <div className={className || "w-full h-full"} >
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
        className="retro-editor-bg retro-editor-fg retro-editor-border cyber-editor-glow"
        theme={theme}
      />
    </div>
  );
}
