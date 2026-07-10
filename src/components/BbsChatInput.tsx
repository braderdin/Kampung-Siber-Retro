"use client";

import React, { useState, useRef, useEffect } from "react";

interface BbsChatInputProps {
  onMessage: (message: string) => void;
  disabled?: boolean;
  maxLength?: number;
  className?: string;
}

export const BbsChatInput: React.FC<BbsChatInputProps> = ({
  onMessage,
  disabled = false,
  maxLength = 500,
  className = "",
}) => {
  const [message, setMessage] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const COOLDOWN_TIME = 3;

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setMessage(value);
      setCharCount(value.length);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled || cooldown > 0 || message.trim().length === 0) return;

    onMessage(message.trim());
    setMessage("");
    setCharCount(0);
    setCooldown(COOLDOWN_TIME);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`w-full ${className}`}>
      <div className="relative">
        <textarea
          ref={inputRef}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your message... (Shift+Enter for new line)"
          rows={2}
          disabled={disabled || cooldown > 0}
          maxLength={maxLength}
          className="retro-textarea w-full px-3 py-2 bg-gray-800/30 border border-gray-700/50 rounded focus:outline-none focus:border-blue-500/50 transition-colors resize-none disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ fontFamily: "monospace" }}
        />

        {cooldown > 0 && (
          <div className="absolute top-2 right-2">
            <span className="font-pixel text-xs text-amber-400 bg-amber-500/20 px-2 py-1 rounded">
              Wait {cooldown}s
            </span>
          </div>
        )}

        <div className="flex items-center justify-between mt-1">
          <div className="font-pixel text-xs text-gray-500">
            {charCount}/{maxLength}
          </div>
          
          <button
            type="submit"
            disabled={disabled || cooldown > 0 || message.trim().length === 0}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-pixel text-xs rounded transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </form>
  );
};

export default BbsChatInput;