"use client";

import { useState, useEffect, useRef } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
  life: number;
  maxLife: number;
}

export default function PixelCursorEffect() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const mousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const particleIdRef = useRef(0);
  const enabledRef = useRef(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setIsEnabled(true);
      enabledRef.current = true;
    }
  }, [isMobile]);

  useEffect(() => {
    if (!isEnabled || isMobile) return;

    const createParticle = (x: number, y: number): Particle => {
      const colors = ['#ffffff', '#00ffff', '#ff00ff', '#00ff00', '#ffff00', '#ff0000'];
      const size = Math.random() * 3 + 1;
      
      return {
        id: particleIdRef.current++,
        x,
        y,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: 1,
        life: 0,
        maxLife: 50 + Math.random() * 50
      };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!enabledRef.current) return;
      
      mousePositionRef.current = { x: e.clientX, y: e.clientY };
      
      // Create particles at mouse position
      for (let i = 0; i < 3; i++) {
        particlesRef.current.push(createParticle(e.clientX, e.clientY));
      }
    };

    const animate = () => {
      if (!enabledRef.current) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      const particles = particlesRef.current;
      
      // Update particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        p.opacity = 1 - (p.life / p.maxLife);
        
        if (p.opacity <= 0 || p.life > p.maxLife) {
          particles.splice(i, 1);
        }
      }

      // Render particles
      if (typeof document !== 'undefined') {
        const canvas = document.getElementById('pixel-cursor-canvas');
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(p => {
              ctx.globalAlpha = p.opacity;
              ctx.fillStyle = p.color;
              ctx.fillRect(p.x, p.y, p.size, p.size);
            });
            
            ctx.globalAlpha = 1;
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    const resizeCanvas = () => {
      const canvas = document.getElementById('pixel-cursor-canvas');
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      enabledRef.current = false;
    };
  }, [isEnabled, isMobile]);

  if (isMobile) {
    return null;
  }

  return (
    <canvas
      id="pixel-cursor-canvas"
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-50"
      style={{ display: isEnabled ? 'block' : 'none' }}
    />
  );
}