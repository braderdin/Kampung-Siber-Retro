"use client";

import { useState, useRef, useEffect } from 'react';

interface RetroMarqueeTickerProps {
  messages?: string[];
  className?: string;
}

export default function RetroMarqueeTicker({ 
  messages = [
    '🚀 Update Sistem: Server utama dinaik taraf ke v3.2.1 - Prestasi ditingkatkan 40%!',
    '🎮 Permainan baru: Retro Pong Challenge now live - Try your high score!',
    '💾 10GB ruang simpan tambahan diberikan kepada semua pengguna!',
    '🛡️ Keamanan: SSL certificate dipermahukuhkan - koneksi lebih selamat!',
    '✨ Efek visual baru: CRT flicker mode now available in settings!',
  ],
  className 
}: RetroMarqueeTickerProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const messageIndexRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) {
        setCurrentMessageIndex(prev => (prev + 1) % messages.length);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [isPaused, messages.length]);

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsPaused(true);
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
  };

  return (
    <div 
      ref={marqueeRef}
      className={`retro-marquee-ticker ${className || ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="retro-marquee-content">
        <div className="retro-marquee-text">
          {messages[currentMessageIndex]}
        </div>
      </div>
    </div>
  );
}