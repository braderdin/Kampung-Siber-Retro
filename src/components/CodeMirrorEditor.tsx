"use client";

import { useEditorStore } from "@/store/useEditorStore";
import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import useDebounce from "@/hooks/useDebounce";
import { useRef, useState, useEffect } from "react";
import DraftSyncIndicator from "./DraftSyncIndicator";

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
  const { htmlCode, cssCode, jsCode, activeTab, setHtmlCode, setCssCode, setJsCode, isSaving, setIsSaving } = useEditorStore();
  const editorRef = useRef<any>(null);
  const { isDark } = useDarkMode();

  // Start: Local State for Raw Input Value
  const [rawInputValue, setRawInputValue] = useState<string>(() => {
    if (value !== undefined) return value;
    switch (activeTab) {
      case "html": return htmlCode;
      case "css": return cssCode;
      case "js": return jsCode;
      default: return htmlCode;
    }
  });
  // End: Local State for Raw Input Value

  // Start: Debounced Value for State Synchronization
  const debouncedValue = useDebounce(rawInputValue, { delay: 500 });
  // End: Debounced Value for State Synchronization

  // Start: Determine Current Code
  const getCurrentCode = () => {
    return rawInputValue;
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

  // Start: Handle Code Changes with Debounce
  const handleCodeChange = (newValue: string) => {
    setRawInputValue(newValue);
  };
  // End: Handle Code Changes with Debounce

  // Start: Sync Raw Input Value with External Changes
  useEffect(() => {
    if (value !== undefined) {
      setRawInputValue(value);
    }
  }, [value]);

  // Start: Sync Raw Input Value with Active Tab Changes
  useEffect(() => {
    switch (activeTab) {
      case "html": setRawInputValue(htmlCode); break;
      case "css": setRawInputValue(cssCode); break;
      case "js": setRawInputValue(jsCode); break;
      default: setRawInputValue(htmlCode);
    }
  }, [activeTab, htmlCode, cssCode, jsCode]);
  // End: Sync Raw Input Value with Active Tab Changes

  // Start: Sync Debounced Value to Store
  useEffect(() => {
    setCurrentCode(debouncedValue);
  }, [debouncedValue, activeTab, onChange, setHtmlCode, setCssCode, setJsCode]);
  // End: Sync Debounced Value to Store

  // Start: Simulate Auto-save
  useEffect(() => {
    if (rawInputValue !== getCurrentCode()) {
      setIsSaving(true);
      const timer = setTimeout(() => {
        setIsSaving(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [rawInputValue, getCurrentCode, setIsSaving]);
  // End: Simulate Auto-save

  // Start: Cyberpunk Theme Configuration
  const theme = vscodeDark;
  // End: Cyberpunk Theme Configuration

  return (
    <div className={className || "w-full h-full"} >
      <DraftSyncIndicator />
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
