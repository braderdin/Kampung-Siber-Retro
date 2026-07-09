"use client";

import { useState, useEffect, useRef } from 'react';

interface PixelCursorEffectProps {
  particleCount?: number;
  particleSize?: number;
  className?: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
}

export default function PixelCursorEffect({ 
  particleCount = 8,
  particleSize = 3,
  className 
}: PixelCursorEffectProps) {
  const [isEnabled, setIsEnabled] = useState(true);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>();
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const particleIdRef = useRef(0);

  useEffect(() => {
    const checkTouchDevice = () => {
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsTouchDevice(isTouch);
      if (isTouch) {
        setIsEnabled(false);
      }
    };

    checkTouchDevice();
    
    window.addEventListener('resize', checkTouchDevice);
    
    return () => {
      window.removeEventListener('resize', checkTouchDevice);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isEnabled || isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const createParticle = (): Particle => {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2 + 1;
      
      return {
        id: particleIdRef.current++,
        x: mousePositionRef.current.x,
        y: mousePositionRef.current.y,
        vx: Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1),
        vy: Math.sin(angle) * speed * (Math.random() > 0.5 ? 1 : -1),
        size: Math.random() * particleSize + 1,
        opacity: 1,
        color: `hsl(${Math.random() * 60 + 180}, 100%, 70%)`,
        life: 0,
        maxLife: 60 + Math.random() * 60,
      };
    };

    const updateParticles = () => {
      if (!isEnabled) return;

      const existingParticles = particlesRef.current;
      const newParticles: Particle[] = [];

      for (const particle of existingParticles) {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.05;
        particle.life++;
        particle.opacity = 1 - (particle.life / particle.maxLife);

        if (particle.opacity > 0.1) {
          newParticles.push(particle);
        }
      }

      if (Math.random() < 0.7) {
        newParticles.push(createParticle());
      }

      particlesRef.current = newParticles;
      animationFrameRef.current = requestAnimationFrame(updateParticles);
    };

    const renderParticles = () => {
      const canvas = document.getElementById('pixel-cursor-canvas') as HTMLCanvasElement;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach(particle => {
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = particle.color;
        ctx.fillRect(
          particle.x - particle.size / 2,
          particle.y - particle.size / 2,
          particle.size,
          particle.size
        );
      });

      ctx.globalAlpha = 1;
    };

    const animationLoop = () => {
      if (!isEnabled) return;
      
      renderParticles();
      animationFrameRef.current = requestAnimationFrame(animationLoop);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animationFrameRef.current = requestAnimationFrame(animationLoop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isEnabled, isTouchDevice, particleCount, particleSize]);

  useEffect(() => {
    const canvas = document.getElementById('pixel-cursor-canvas') as HTMLCanvasElement;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const canvas = document.getElementById('pixel-cursor-canvas') as HTMLCanvasElement;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isEnabled || isTouchDevice) {
    return null;
  }

  return (
    <canvas
      id="pixel-cursor-canvas"
      className={`pixel-cursor-effect ${className || ''}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  );
}