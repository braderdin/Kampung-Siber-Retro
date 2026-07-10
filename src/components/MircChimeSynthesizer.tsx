"use client";

import React, { useEffect, useRef, useCallback } from "react";

interface MircChimeSynthesizerProps {
  className?: string;
  volume?: number;
  onChime?: () => void;
}

export const MircChimeSynthesizer: React.FC<MircChimeSynthesizerProps> = ({
  className = "",
  volume = 0.5,
  onChime,
}) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const isPlayingRef = useRef(false);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playChime = useCallback(async () => {
    if (isPlayingRef.current) return;

    isPlayingRef.current = true;

    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      const oscillator1 = ctx.createOscillator();
      const oscillator2 = ctx.createOscillator();
      const gainNode1 = ctx.createGain();
      const gainNode2 = ctx.createGain();

      oscillator1.type = "sine";
      oscillator1.frequency.setValueAtTime(523.25, now);
      oscillator1.frequency.exponentialRampToValueAtTime(329.63, now + 0.15);

      oscillator2.type = "square";
      oscillator2.frequency.setValueAtTime(659.25, now + 0.05);
      oscillator2.frequency.exponentialRampToValueAtTime(493.97, now + 0.2);

      gainNode1.gain.setValueAtTime(0, now);
      gainNode1.gain.linearRampToValueAtTime(volume, now + 0.02);
      gainNode1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      gainNode2.gain.setValueAtTime(0, now + 0.02);
      gainNode2.gain.linearRampToValueAtTime(volume * 0.7, now + 0.05);
      gainNode2.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      oscillator1.connect(gainNode1);
      oscillator2.connect(gainNode2);
      gainNode1.connect(ctx.destination);
      gainNode2.connect(ctx.destination);

      oscillator1.start(now);
      oscillator2.start(now + 0.05);

      oscillator1.stop(now + 0.35);
      oscillator2.stop(now + 0.35);

      if (onChime) {
        onChime();
      }

      setTimeout(() => {
        isPlayingRef.current = false;
      }, 400);
    } catch (error) {
      console.error("Failed to play chime:", error);
      isPlayingRef.current = false;
    }
  }, [getAudioContext, volume, onChime]);

  useEffect(() => {
    const handleNotification = () => {
      playChime();
    };

    window.addEventListener("notification-chime", handleNotification);
    return () => {
      window.removeEventListener("notification-chime", handleNotification);
    };
  }, [playChime]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !isPlayingRef.current) {
        playChime();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [playChime]);

  return (
    <div className={className}>
      <button
        onClick={playChime}
        className="font-pixel text-xs text-gray-400 hover:text-white transition-colors"
        aria-label="Play notification chime"
      >
        Play Chime
      </button>
    </div>
  );
};

export default MircChimeSynthesizer;
