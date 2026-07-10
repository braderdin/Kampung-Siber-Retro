"use client";

import { useState, useRef, useEffect } from 'react';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  url: string;
}

interface WinampPlaylistDrawerProps {
  className?: string;
}

const CHIPTUNE_TRACKS: Track[] = [
  { id: '1', title: 'Pixel Dreams', artist: '8-Bit Collective', duration: '2:45', url: '/music/pixel-dreams.mp3' },
  { id: '2', title: 'Neon Runner', artist: 'Retro Wave', duration: '3:12', url: '/music/neon-runner.mp3' },
  { id: '3', title: 'Digital Sunset', artist: 'Synthwave Dreams', duration: '4:01', url: '/music/digital-sunset.mp3' },
  { id: '4', title: 'Arcade Hero', artist: 'Chiptune Masters', duration: '2:30', url: '/music/arcade-hero.mp3' },
  { id: '5', title: 'Cyber Night', artist: 'Future Bass', duration: '3:45', url: '/music/cyber-night.mp3' },
  { id: '6', title: 'Retro Game Start', artist: 'Game Boy Sounds', duration: '0:15', url: '/music/game-start.mp3' },
  { id: '7', title: 'Level Complete', artist: '8-Bit Victory', duration: '0:30', url: '/music/level-complete.mp3' },
];

export default function WinampPlaylistDrawer({ className }: WinampPlaylistDrawerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [volume, setVolume] = useState(0.7);
  const [filter, setFilter] = useState('');
  const [filteredTracks, setFilteredTracks] = useState<Track[]>(CHIPTUNE_TRACKS);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const lowerFilter = filter.toLowerCase();
    const filtered = CHIPTUNE_TRACKS.filter(track =>
      track.title.toLowerCase().includes(lowerFilter) ||
      track.artist.toLowerCase().includes(lowerFilter)
    );
    setFilteredTracks(filtered);
  }, [filter]);

  const handlePlay = (track: Track) => {
    if (audioRef.current) {
      audioRef.current.src = track.url;
      audioRef.current.volume = volume;
      audioRef.current.play();
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  return (
    <div className={`winamp-player bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg p-3 ${className || ''}`}>
      {/* Start: Winamp Header */}
      <div className="winamp-header flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">🎵</span>
          <span className="text-sm font-bold text-cyan-400 pixel-font">
            Winamp Retro Player
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-400">🔊</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            className="w-20 h-1"
          />
        </div>
      </div>
      {/* End: Winamp Header */}

      {/* Start: Filter Field */}
      <div className="mb-2">
        <input
          type="text"
          placeholder="Cari trek (taip untuk menapis)..."
          value={filter}
          onChange={handleFilterChange}
          className="winamp-filter w-full px-2 py-1 text-xs bg-gray-700 text-gray-200 rounded border border-gray-600 focus:border-cyan-400 outline-none pixel-font"
        />
      </div>
      {/* End: Filter Field */}

      {/* Start: Playlist Tracks */}
      <div className="winamp-playlist max-h-48 overflow-y-auto retroscrollbar">
        {filteredTracks.length === 0 ? (
          <div className="text-center py-4 text-xs text-gray-500 pixel-font">
            Tiada trek ditemui
          </div>
        ) : (
          filteredTracks.map(track => (
            <div
              key={track.id}
              className={`
                flex items-center justify-between p-2 rounded
                transition-all duration-200 text-xs pixel-font
                ${currentTrack?.id === track.id 
                  ? 'bg-cyan-500/20 text-cyan-300' 
                  : 'text-gray-300 hover:bg-gray-700/50'
                }
              `}
            >
              {/* Track Info */}
              <div className="flex-1 min-w-0">
                <div className="truncate font-bold">{track.title}</div>
                <div className="text-gray-500 truncate">{track.artist}</div>
              </div>
              
              {/* Duration */}
              <span className="text-gray-500 mx-2">{track.duration}</span>
              
              {/* Play Button */}
              <button
                onClick={() => currentTrack?.id === track.id && isPlaying ? handlePause() : handlePlay(track)}
                className="text-cyan-400 hover:text-cyan-300 px-1"
                title={currentTrack?.id === track.id && isPlaying ? 'Jeda' : 'Main'}
              >
                {currentTrack?.id === track.id && isPlaying ? '⏸️' : '▶️'}
              </button>
            </div>
          ))
        )}
      </div>
      {/* End: Playlist Tracks */}

      {/* Start: Now Playing */}
      {currentTrack && (
        <div className="mt-2 pt-2 border-t border-gray-700">
          <div className="text-xs text-cyan-400 pixel-font">
            <span>Now Playing: </span>
            <span className="text-gray-300">{currentTrack.title}</span>
          </div>
        </div>
      )}
      {/* End: Now Playing */}

      {/* Hidden Audio Element */}
      <audio ref={audioRef} />
    </div>
  );
}