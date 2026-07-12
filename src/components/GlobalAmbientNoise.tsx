"use client";

import { useState, useEffect, useCallback, useRef } from 'react';

interface AmbientNoiseConfig {
  rain: boolean;
  forest: boolean;
  city: boolean;
  volume: number;
}

export default function GlobalAmbientNoise() {
  const [isClient, setIsClient] = useState(false);
  const [config, setConfig] = useState<AmbientNoiseConfig>({
    rain: false,
    forest: false,
    city: false,
    volume: 0.3
  });
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});

  useEffect(() => {
    setIsClient(true);
    
    // Load saved preferences
    const savedConfig = localStorage.getItem('ambient_noise_config');
    if (savedConfig) {
      const parsed = JSON.parse(savedConfig);
      setConfig(parsed);
      setIsEnabled(parsed.rain || parsed.forest || parsed.city);
    }
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
    // Save config to localStorage
    localStorage.setItem('ambient_noise_config', JSON.stringify(config));
  }, [config, isClient]);

  const createAudio = useCallback((sound: string): HTMLAudioElement | null => {
    if (!isClient) return null;
    
    const audio = new Audio();
    audio.loop = true;
    audio.volume = config.volume;
    
    // Set source based on sound type (using free ambient sound URLs)
    const soundUrls: Record<string, string> = {
      rain: 'https://assets.mixkit.co/sfx/preview/mixkit-rain-in-the-forest-1749.mp3',
      forest: 'https://assets.mixkit.co/sfx/preview/mixkit-forest-birds-1748.mp3',
      city: 'https://assets.mixkit.co/sfx/preview/mixkit-cafe-city-noise-1750.mp3'
    };
    
    audio.src = soundUrls[sound] || '';
    return audio;
  }, [config.volume, isClient]);

  const playSound = useCallback(async (sound: string) => {
    if (!isClient) return;
    
    if (!audioRefs.current[sound]) {
      audioRefs.current[sound] = await createAudio(sound);
    }
    
    const audio = audioRefs.current[sound];
    if (audio) {
      audio.volume = config.volume;
      try {
        await audio.play();
      } catch (e) {
        console.warn('Audio play failed:', e);
      }
    }
  }, [createAudio, config.volume, isClient]);

  const stopSound = useCallback((sound: string) => {
    const audio = audioRefs.current[sound];
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }, []);

  const toggleSound = useCallback((sound: string) => {
    setConfig(prev => {
      const newState = { ...prev, [sound]: !prev[sound as keyof AmbientNoiseConfig] };
      return newState;
    });
  }, []);

  const toggleAll = useCallback(() => {
    const anyEnabled = config.rain || config.forest || config.city;
    setIsEnabled(!anyEnabled);
    
    if (!anyEnabled) {
      // Enable all sounds
      setConfig(prev => ({ ...prev, rain: true, forest: true, city: false }));
    } else {
      // Disable all sounds
      setConfig(prev => ({ ...prev, rain: false, forest: false, city: false }));
    }
  }, [config.rain, config.forest, config.city]);

  // Handle sound playback when config changes
  useEffect(() => {
    if (!isClient) return;
    
    if (config.rain && isEnabled) {
      playSound('rain');
    } else {
      stopSound('rain');
    }
    
    if (config.forest && isEnabled) {
      playSound('forest');
    } else {
      stopSound('forest');
    }
    
    if (config.city && isEnabled) {
      playSound('city');
    } else {
      stopSound('city');
    }
  }, [config.rain, config.forest, config.city, isEnabled, playSound, stopSound, isClient]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      Object.values(audioRefs.current).forEach(audio => {
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
      });
    };
  }, []);

  const getActiveSounds = useCallback(() => {
    const active: string[] = [];
    if (config.rain) active.push('🌧️ Rain');
    if (config.forest) active.push('🌲 Forest');
    if (config.city) active.push('🏙️ City');
    return active;
  }, [config.rain, config.forest, config.city]);

  if (!isClient) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <div className="retro-card border-2 border-dashed border-cyan-400/30">
        <div className="flex items-center gap-3 p-3">
          {/* Start: Toggle Switch */}
          <div className="relative inline-block w-12 h-6">
            <button
              onClick={toggleAll}
              className={`relative inline-block w-12 h-6 transition-colors duration-200 rounded-full ${
                isEnabled ? 'bg-cyan-500' : 'bg-gray-400'
              }`}
            >
              <span 
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                  isEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
          {/* End: Toggle Switch */}

          {/* Start: Status Text */}
          <div className="text-xs pixel-font">
            <span className="text-gray-600 dark:text-gray-400">Ambient:</span>
            <span className={`ml-1 ${isEnabled ? 'text-green-400' : 'text-gray-400'}`}>
              {isEnabled ? 'ON' : 'OFF'}
            </span>
          </div>
          {/* End: Status Text */}

          {/* Start: Volume Control */}
          <div className="flex items-center gap-1">
            <span className="text-xs pixel-font text-gray-500">🔊</span>
            <input
              type="range"
              min="0"
              max="100"
              value={Math.round(config.volume * 100)}
              onChange={(e) => setConfig(prev => ({ ...prev, volume: parseInt(e.target.value, 10) / 100 }))}
              className="w-16 h-1 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          {/* End: Volume Control */}
        </div>

        {/* Start: Sound Options (collapsed) */}
        {isEnabled && (
          <div className="border-t-2 border-dashed border-cyan-400/30 p-3">
            <div className="flex gap-2 text-xs pixel-font">
              <button
                onClick={() => toggleSound('rain')}
                className={`px-2 py-1 rounded transition-all ${
                  config.rain 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}
              >
                🌧️
              </button>
              <button
                onClick={() => toggleSound('forest')}
                className={`px-2 py-1 rounded transition-all ${
                  config.forest 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}
              >
                🌲
              </button>
              <button
                onClick={() => toggleSound('city')}
                className={`px-2 py-1 rounded transition-all ${
                  config.city 
                    ? 'bg-yellow-500 text-white' 
                    : 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}
              >
                🏙️
              </button>
            </div>
          </div>
        )}
        {/* End: Sound Options */}
      </div>
    </div>
  );
}
