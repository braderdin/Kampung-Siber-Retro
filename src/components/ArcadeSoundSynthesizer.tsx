"use client";

import { useCallback, useRef } from 'react';

export interface SoundEffect {
  type: 'crash' | 'laser' | 'gameOver' | 'beep' | 'explosion';
  volume?: number;
}

export interface ArcadeSoundSynthesizerRef {
  playSound: (effect: SoundEffect) => void;
  stopAll: () => void;
  setMasterVolume: (volume: number) => void;
}

export default function useArcadeSoundSynthesizer(): ArcadeSoundSynthesizerRef {
  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const activeOscillatorsRef = useRef<Map<string, OscillatorNode>>(new Map());

  const initAudioContext = useCallback(() => {
    if (typeof window === 'undefined') return null;
    
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      masterGainRef.current = audioContextRef.current.createGain();
      masterGainRef.current.gain.value = 0.3;
      masterGainRef.current.connect(audioContextRef.current.destination);
    }
    return audioContextRef.current;
  }, []);

  const playSound = useCallback((effect: SoundEffect) => {
    const ctx = initAudioContext();
    if (!ctx || !masterGainRef.current) return;

    const volume = effect.volume ?? 0.3;
    const now = ctx.currentTime;

    switch (effect.type) {
      case 'crash':
        playCrashSound(ctx, now, volume);
        break;
      case 'laser':
        playLaserSound(ctx, now, volume);
        break;
      case 'gameOver':
        playGameOverSound(ctx, now, volume);
        break;
      case 'beep':
        playBeepSound(ctx, now, volume);
        break;
      case 'explosion':
        playExplosionSound(ctx, now, volume);
        break;
    }
  }, [initAudioContext]);

  const stopAll = useCallback(() => {
    activeOscillatorsRef.current.forEach((oscillator) => {
      try {
        oscillator.stop();
      } catch (e) {}
    });
    activeOscillatorsRef.current.clear();
  }, []);

  const setMasterVolume = useCallback((volume: number) => {
    if (masterGainRef.current) {
      masterGainRef.current.gain.value = Math.max(0, Math.min(1, volume));
    }
  }, []);

  const playCrashSound = (ctx: AudioContext, startTime: number, volume: number) => {
    const noiseBuffer = ctx.createBuffer(2, ctx.sampleRate * 0.5, ctx.sampleRate);
    const outputL = noiseBuffer.getChannelData(0);
    const outputR = noiseBuffer.getChannelData(1);
    
    for (let i = 0; i < noiseBuffer.length; i++) {
      const noise = Math.random() * 2 - 1;
      outputL[i] = noise;
      outputR[i] = noise;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, startTime);
    filter.frequency.exponentialRampToValueAtTime(100, startTime + 0.5);

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(volume * 0.5, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.5);

    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(masterGainRef.current!);
    noise.start(startTime);
    noise.stop(startTime + 0.5);
  };

  const playLaserSound = (ctx: AudioContext, startTime: number, volume: number) => {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(80, startTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, startTime + 0.1);

    gainNode.gain.setValueAtTime(volume * 0.3, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.15);

    oscillator.connect(gainNode);
    gainNode.connect(masterGainRef.current!);
    oscillator.start(startTime);
    oscillator.stop(startTime + 0.15);
  };

  const playGameOverSound = (ctx: AudioContext, startTime: number, volume: number) => {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(200, startTime);
    oscillator.frequency.exponentialRampToValueAtTime(50, startTime + 1.0);

    gainNode.gain.setValueAtTime(volume * 0.4, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 1.0);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, startTime);

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(masterGainRef.current!);
    oscillator.start(startTime);
    oscillator.stop(startTime + 1.0);
  };

  const playBeepSound = (ctx: AudioContext, startTime: number, volume: number) => {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(440, startTime);

    gainNode.gain.setValueAtTime(volume * 0.3, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2);

    oscillator.connect(gainNode);
    gainNode.connect(masterGainRef.current!);
    oscillator.start(startTime);
    oscillator.stop(startTime + 0.2);
  };

  const playExplosionSound = (ctx: AudioContext, startTime: number, volume: number) => {
    const noiseBuffer = ctx.createBuffer(2, ctx.sampleRate * 0.8, ctx.sampleRate);
    const outputL = noiseBuffer.getChannelData(0);
    const outputR = noiseBuffer.getChannelData(1);
    
    for (let i = 0; i < noiseBuffer.length; i++) {
      const t = i / noiseBuffer.length;
      const envelope = Math.exp(-t * 3);
      const noise = (Math.random() * 2 - 1) * envelope;
      outputL[i] = noise;
      outputR[i] = noise * 0.8;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(200, startTime);
    filter.frequency.exponentialRampToValueAtTime(100, startTime + 0.8);

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(volume * 0.6, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.8);

    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(masterGainRef.current!);
    noise.start(startTime);
    noise.stop(startTime + 0.8);
  };

  return { playSound, stopAll, setMasterVolume };
}

export const playArcadeSound = (type: SoundEffect['type'], volume?: number) => {
  if (typeof window === 'undefined') return;
  
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const masterGain = ctx.createGain();
  masterGain.gain.value = volume ?? 0.3;
  masterGain.connect(ctx.destination);
  
  const now = ctx.currentTime;
  
  switch (type) {
    case 'crash':
      const noiseBuffer = ctx.createBuffer(2, ctx.sampleRate * 0.5, ctx.sampleRate);
      const outputL = noiseBuffer.getChannelData(0);
      const outputR = noiseBuffer.getChannelData(1);
      for (let i = 0; i < noiseBuffer.length; i++) {
        const noise = Math.random() * 2 - 1;
        outputL[i] = noise;
        outputR[i] = noise;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(100, now + 0.5);
      const crashGain = ctx.createGain();
      crashGain.gain.setValueAtTime(0.5, now);
      crashGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      noise.connect(filter);
      filter.connect(crashGain);
      crashGain.connect(masterGain);
      noise.start(now);
      noise.stop(now + 0.5);
      break;
      
    case 'laser':
      const laserOsc = ctx.createOscillator();
      const laserGain = ctx.createGain();
      laserOsc.type = 'square';
      laserOsc.frequency.setValueAtTime(80, now);
      laserOsc.frequency.exponentialRampToValueAtTime(400, now + 0.1);
      laserGain.gain.setValueAtTime(0.3, now);
      laserGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      laserOsc.connect(laserGain);
      laserGain.connect(masterGain);
      laserOsc.start(now);
      laserOsc.stop(now + 0.15);
      break;
      
    case 'gameOver':
      const gameOsc = ctx.createOscillator();
      const gameGain = ctx.createGain();
      gameOsc.type = 'sawtooth';
      gameOsc.frequency.setValueAtTime(200, now);
      gameOsc.frequency.exponentialRampToValueAtTime(50, now + 1.0);
      gameGain.gain.setValueAtTime(0.4, now);
      gameGain.gain.exponentialRampToValueAtTime(0.001, now + 1.0);
      const gameFilter = ctx.createBiquadFilter();
      gameFilter.type = 'lowpass';
      gameFilter.frequency.setValueAtTime(300, now);
      gameOsc.connect(gameFilter);
      gameFilter.connect(gameGain);
      gameGain.connect(masterGain);
      gameOsc.start(now);
      gameOsc.stop(now + 1.0);
      break;
  }
};
