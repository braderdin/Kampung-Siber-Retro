"use client";

import React, { useState } from "react";

interface ImageTagGeneratorProps {
  imageUrl?: string;
  alt?: string;
  className?: string;
}

export const ImageTagGenerator: React.FC<ImageTagGeneratorProps> = ({
  imageUrl = "",
  alt = "image",
  className = "",
}) => {
  const [url, setUrl] = useState(imageUrl);
  const [altText, setAltText] = useState(alt);
  const [copied, setCopied] = useState(false);

  const generateTag = (): string => {
    const escapedAlt = altText.replace(/"/g, '"');
    return `<img src="${url}" alt="${escapedAlt}" loading="lazy" />`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateTag());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy tag:", error);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleAltChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAltText(e.target.value);
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="space-y-4">
        <div>
          <label className="font-pixel text-xs text-gray-400 block mb-1">
            Image URL
          </label>
          <input
            type="text"
            value={url}
            onChange={handleUrlChange}
            placeholder="https://example.com/image.png"
            className="retro-textarea w-full px-3 py-2 bg-gray-800/30 border border-gray-700/50 rounded focus:outline-none focus:border-blue-500/50 transition-colors"
          />
        </div>

        <div>
          <label className="font-pixel text-xs text-gray-400 block mb-1">
            Alt Text
          </label>
          <input
            type="text"
            value={altText}
            onChange={handleAltChange}
            placeholder="Descriptive alt text for accessibility"
            className="retro-textarea w-full px-3 py-2 bg-gray-800/30 border border-gray-700/50 rounded focus:outline-none focus:border-blue-500/50 transition-colors"
          />
        </div>

        <div>
          <label className="font-pixel text-xs text-gray-400 block mb-2">
            Generated Tag
          </label>
          <div className="relative">
            <pre className="overflow-x-auto">
              <code className="font-pixel text-xs text-gray-300 bg-gray-800/50 p-3 rounded border border-gray-700/30">
                {generateTag()}
              </code>
            </pre>
            <button
              onClick={copyToClipboard}
              className="absolute top-2 right-2 p-1 bg-gray-800/30 hover:bg-gray-700/50 rounded text-gray-300 hover:text-white transition-colors"
              aria-label="Copy tag"
            >
              📋
            </button>
          </div>
          {copied && (
            <div className="mt-2 text-center">
              <span className="font-pixel text-xs text-green-400">✓ Copied to clipboard!</span>
            </div>
          )}
        </div>

        {url && (
          <div className="pt-2 border-t border-gray-700/30">
            <label className="font-pixel text-xs text-gray-400 block mb-2">
              Preview
            </label>
            <div className="bg-gray-800/20 rounded p-4 flex items-center justify-center">
              <img
                src={url}
                alt={altText}
                className="max-w-full max-h-48 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageTagGenerator;