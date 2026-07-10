"use client";

import React, { useState, useCallback } from "react";
import { JournalEntry } from "@/types/journal";

interface JournalEntryFormProps {
  onSubmit?: (entry: JournalEntry) => Promise<void> | void;
  initialEntry?: Partial<JournalEntry>;
  className?: string;
  username?: string;
}

export const JournalEntryForm: React.FC<JournalEntryFormProps> = ({
  onSubmit,
  initialEntry,
  className = "",
}) => {
  const [title, setTitle] = useState(initialEntry?.title || "");
  const [slug, setSlug] = useState(initialEntry?.slug || "");
  const [content, setContent] = useState(initialEntry?.content || "");
  const [isPublic, setIsPublic] = useState(initialEntry?.isPublic ?? true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSlug = useCallback((text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }, []);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTitle(value);
    if (!slug) {
      setSlug(generateSlug(value) || "untitled");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const entry: JournalEntry = {
        id: initialEntry?.id || crypto.randomUUID(),
        username: initialEntry?.username || "anonymous",
        title,
        slug: slug || generateSlug(title) || "untitled",
        content,
        createdAt: initialEntry?.createdAt || new Date().toISOString(),
        isPublic,
      };

      if (onSubmit) {
        await onSubmit(entry);
      }

      if (!initialEntry) {
        setTitle("");
        setSlug("");
        setContent("");
        setIsPublic(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit entry");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopySlug = () => {
    navigator.clipboard.writeText(slug);
  };

  return (
    <form onSubmit={handleSubmit} className={`w-full ${className}`}>
      <div className="space-y-4">
        <div>
          <label className="font-pixel text-xs text-gray-400 block mb-1">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Enter journal title..."
            className="retro-textarea w-full px-3 py-2 bg-gray-800/30 border border-gray-700/50 rounded focus:outline-none focus:border-blue-500/50 transition-colors"
            maxLength={100}
            required
          />
        </div>

        <div>
          <label className="font-pixel text-xs text-gray-400 block mb-1">
            URL Slug
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="url-slug"
              className="retro-textarea flex-1 px-3 py-2 bg-gray-800/30 border border-gray-700/50 rounded focus:outline-none focus:border-blue-500/50 transition-colors"
            />
            <button
              type="button"
              onClick={handleCopySlug}
              className="px-3 py-2 bg-gray-800/30 hover:bg-gray-700/50 border border-gray-700/50 rounded font-pixel text-xs text-gray-300 transition-colors"
            >
              Copy
            </button>
          </div>
        </div>

        <div>
          <label className="font-pixel text-xs text-gray-400 block mb-1">
            Visibility
          </label>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="w-4 h-4 bg-gray-800/30 border border-gray-700/50 rounded focus:ring-2 focus:ring-blue-500/50"
              />
              <span className="font-pixel text-xs text-gray-300">Public</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={!isPublic}
                onChange={() => setIsPublic(false)}
                className="w-4 h-4 bg-gray-800/30 border border-gray-700/50 rounded focus:ring-2 focus:ring-blue-500/50"
              />
              <span className="font-pixel text-xs text-gray-300">Private</span>
            </label>
          </div>
        </div>

        <div>
          <label className="font-pixel text-xs text-gray-400 block mb-1">
            Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your journal entry..."
            rows={10}
            className="retro-textarea w-full px-3 py-2 bg-gray-800/30 border border-gray-700/50 rounded focus:outline-none focus:border-blue-500/50 transition-colors resize-y"
            required
          />
        </div>

        {error && (
          <div className="p-2 bg-red-500/10 border border-red-500/20 rounded">
            <p className="font-pixel text-xs text-red-400">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !title || !content}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-pixel text-xs rounded transition-colors"
        >
          {isSubmitting
            ? initialEntry
              ? "Updating Entry..."
              : "Publishing..."
            : initialEntry
              ? "Update Entry"
              : "Publish Entry"}
        </button>
      </div>
    </form>
  );
};

export default JournalEntryForm;
