"use client";

import React, { useState, useRef, useEffect } from 'react';

interface RadioStation {
  id: string;
  name: string;
  url: string;
  icon: string;
}

const RADIO_STATIONS: RadioStation[] = [
  {
    id: 'lofi-1',
    name: 'Lo-Fi Chiptune 1',
    url: 'https://example.com/lofi-1.mp3',
    icon: '🎵'
  },
  {
    id: 'lofi-2',
    name: 'Lo-Fi Chiptune 2',
    url: 'https://example.com/lofi-2.mp3',
    icon: '🎶'
  },
  {
    id: 'lofi-3',
    name: 'Lo-Fi Chiptune 3',
    url: 'https://example.com/lofi-3.mp3',
    icon: '🎧'
  },
  {
    id: 'retro-8bit',
    name: 'Retro 8-bit',
    url: 'https://example.com/retro-8bit.mp3',
    icon: '🕹️'
  },
  {
    id: 'synthwave',
    name: 'Synthwave Dreams',
    url: 'https://example.com/synthwave.mp3',
    icon: '🌅'
  }
];

export default function RadioKampung() {
  const [currentStation, setCurrentStation] = useState<RadioStation>(RADIO_STATIONS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const play = () => {
      audio.play().catch(() => {});
      setIsPlaying(true);
    };

    const pause = () => {
      audio.pause();
      setIsPlaying(false);
    };

    if (isPlaying) {
      play();
    } else {
      pause();
    }

    return () => {
      pause();
    };
  }, [currentStation, isPlaying]);

  const handleStationChange = (station: RadioStation) => {
    setCurrentStation(station);
    setIsPlaying(true);
  };

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="retro-card p-4 w-full max-w-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{currentStation.icon}</span>
          <span className="pixel-font text-sm font-bold text-gray-800 dark:text-gray-200">
            {currentStation.name}
          </span>
        </div>
        <button
          onClick={handleTogglePlay}
          className="retro-btn-secondary w-8 h-8 flex items-center justify-center rounded-full text-sm"
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
      </div>

      {/* Start: Station Selector */}
      <div className="mb-3">
        <select
          value={currentStation.id}
          onChange={(e) => {
            const station = RADIO_STATIONS.find(s => s.id === e.target.value);
            if (station) handleStationChange(station);
          }}
          className="w-full retro-input text-sm bg-gray-100 dark:bg-gray-800 border-cyan-400 text-gray-800 dark:text-gray-200"
        >
          {RADIO_STATIONS.map((station) => (
            <option key={station.id} value={station.id}>
              {station.name}
            </option>
          ))}
        </select>
      </div>
      {/* End: Station Selector */}

      <audio ref={audioRef} src={currentStation.url} loop />

      <div className="text-xs text-gray-500 dark:text-gray-400 text-center pixel-font">
        Radio Kampung Siber Retro
      </div>
    </div>
  );
}
