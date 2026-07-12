"use client";

import { useState, useRef, useCallback } from 'react';

interface MidiMusicControllerProps {
  className?: string;
}

export default function MidiMusicController({ className }: MidiMusicControllerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.5);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const initAudio = useCallback(() => {
    if (typeof window === 'undefined') return null;
    
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      gainRef.current = audioContextRef.current.createGain();
      gainRef.current.gain.value = volume;
      gainRef.current.connect(audioContextRef.current.destination);
    }
    return audioContextRef.current;
  }, [volume]);

  const playChiptuneMelody = useCallback(() => {
    const ctx = initAudio();
    if (!ctx || !gainRef.current || isPlaying) return;
    
    const notes = [261.63, 329.63, 392.00, 523.25, 392.00, 329.63, 261.63];
    let index = 0;
    
    const playNote = () => {
      if (index >= notes.length) {
        setIsPlaying(false);
        setCurrentTrack(null);
        return;
      }
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'square';
      osc.frequency.value = notes[index];
      
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      
      osc.connect(gain);
      gain.connect(gainRef.current!);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
      
      index++;
      setTimeout(playNote, 350);
    };
    
    setIsPlaying(true);
    setCurrentTrack('chiptune-demo');
    playNote();
  }, [initAudio, isPlaying]);

  const stopMusic = useCallback(() => {
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
      } catch (e) {}
    }
    setIsPlaying(false);
    setCurrentTrack(null);
  }, []);

  const handlePlay = () => {
    if (isPlaying) {
      stopMusic();
    } else {
      playChiptuneMelody();
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (gainRef.current) {
      gainRef.current.gain.value = newVolume;
    }
  };

  return (
    <div className={`bg-gray-800 dark:bg-gray-900 p-3 rounded border border-gray-600 dark:border-gray-500 ${className || ''}`}>
      {/* Start: Header */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">🎵</span>
        <span className="text-sm font-bold text-gray-200 dark:text-gray-300 pixel-font">
          MIDI Controller
        </span>
      </div>
      {/* End: Header */}

      {/* Start: Track Info */}
      {currentTrack && (
        <div className="text-xs text-gray-400 mb-2 pixel-font">
          Playing: {currentTrack}
        </div>
      )}
      {/* End: Track Info */}

      {/* Start: Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={handlePlay}
          className={`
            retro-btn-secondary text-xs px-3 py-1.5 flex items-center gap-1
            ${isPlaying ? 'bg-red-600 hover:bg-red-700 text-white' : ''}
          `}
        >
          {isPlaying ? '⏹️' : '▶️'}
          <span>{isPlaying ? 'Stop' : 'Play'}</span>
        </button>

        <div className="flex-1 flex items-center gap-1">
          <span className="text-xs text-gray-400">🔊</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
      {/* End: Controls */}

      {/* Start: Track List */}
      <div className="mt-2 text-xs text-gray-500 pixel-font">
        <div className="truncate">♪ Chiptune Demo</div>
      </div>
      {/* End: Track List */}
    </div>
  );
}
