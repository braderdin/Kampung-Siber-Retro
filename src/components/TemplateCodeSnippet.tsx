"use client";

import React, { useState } from "react";

interface TemplateCodeSnippetProps {
  title: string;
  code: string;
  language?: "html" | "css" | "javascript" | "typescript";
  className?: string;
}

export const TemplateCodeSnippet: React.FC<TemplateCodeSnippetProps> = ({
  title,
  code,
  language = "html",
  className = "",
}) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy code:", error);
    }
  };

  const getLanguageColor = () => {
    switch (language) {
      case "css": return "bg-purple-900/30";
      case "javascript": return "bg-yellow-900/30";
      case "typescript": return "bg-blue-900/30";
      default: return "bg-orange-900/30";
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-pixel text-xs text-gray-300">{title}</h3>
        <button
          onClick={copyToClipboard}
          className="px-2 py-1 bg-gray-800/30 hover:bg-gray-700/50 rounded font-pixel text-xs text-gray-300 transition-colors"
        >
          {copied ? "✓ Copied!" : "Copy"}
        </button>
      </div>

      <div className="relative">
        <pre className="overflow-x-auto">
          <code
            className={`font-pixel text-xs ${getLanguageColor()} p-3 rounded bg-gray-800/50 border border-gray-700/30`}
          >
            <span className="text-green-400">&lt;</span>
            {code}
            <span className="text-green-400">&gt;</span>
          </code>
        </pre>

        <div className="absolute top-2 right-2 flex gap-1">
          <button
            onClick={() => navigator.clipboard.writeText(code)}
            className="p-1 bg-gray-800/50 hover:bg-gray-700/50 rounded text-gray-400 hover:text-white transition-colors"
            aria-label="Copy"
          >
            📋
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateCodeSnippet;
