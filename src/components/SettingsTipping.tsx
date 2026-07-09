"use client";

import { useState, useEffect, useRef } from 'react';

interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  life: number;
  maxLife: number;
}

interface SettingsTippingProps {
  className?: string;
}

export default function SettingsTipping({ className }: SettingsTippingProps) {
  const [isConfettiActive, setIsConfettiActive] = useState(false);
  const [particles, setParticles] = useState<ConfettiParticle[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const particleIdRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const colors = [
      '#ff6b6b', '#4ecdc4', '#ff6e40', '#ffe66d', 
      '#a855f7', '#f59e0b', '#10b981', '#3b82f6'
    ];

    const createHeartParticle = (x: number, y: number): ConfettiParticle => {
      const size = Math.random() * 8 + 4;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3 + 2;
      
      return {
        id: particleIdRef.current++,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 5,
        size,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        life: 0,
        maxLife: 100 + Math.random() * 50
      };
    };

    const animate = () => {
      if (!isConfettiActive) {
        setParticles([]);
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      setParticles(prev => {
        return prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.1,
            rotation: p.rotation + p.rotationSpeed,
            life: p.life + 1
          }))
          .filter(p => p.life < p.maxLife && p.y < window.innerHeight + 100);
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    if (isConfettiActive) {
      animate();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isConfettiActive]);

  const handleTipClick = () => {
    setIsConfettiActive(true);
    
    // Create initial heart particles
    const initialParticles: ConfettiParticle[] = [];
    const colors = ['#ff6b6b', '#4ecdc4', '#ff6e40', '#ffe66d', '#a855f7', '#f59e0b', '#10b981', '#3b82f6'];
    
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * window.innerWidth;
      const y = window.innerHeight * 0.7;
      const size = Math.random() * 8 + 4;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3 + 2;
      
      initialParticles.push({
        id: particleIdRef.current++,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 5,
        size,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        life: 0,
        maxLife: 100 + Math.random() * 50
      });
    }
    
    setParticles(initialParticles);
    
    setTimeout(() => {
      setIsConfettiActive(false);
      setParticles([]);
    }, 3000);
  };

  const renderHeartShape = (x: number, y: number, size: number, rotation: number, color: string) => {
    const transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`;
    
    return (
      <svg
        key={`heart-${x}-${y}-${rotation}`}
        className="absolute"
        style={{ transform }}
        width={size}
        height={size}
        viewBox="0 0 24 24"
      >
        <path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          fill={color}
          strokeWidth={0}
        />
      </svg>
    );
  };

  return (
    <div className={`settings-tipping ${className || ''}`}>
      {/* Start: Tipping Button */}
      <div className="retro-card">
        <div className="retro-card-header bg-gray-200 dark:bg-gray-700 px-4 py-2 border-b border-gray-300 dark:border-gray-600">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 pixel-font">
            🍵 Belanja Kopi / Give a Treat
          </h3>
        </div>
        <div className="p-4">
          <button
            onClick={handleTipClick}
            disabled={isConfettiActive}
            className={`
              w-full retro-btn-primary text-lg font-bold
              ${isConfettiActive ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {isConfettiActive ? 'Sedang Menghantar...' : 'Belanja Kopi ☕'}
          </button>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 pixel-font">
              Sentu untuk memberi sedikit semangat kepada warga kami!
            </p>
          </div>
        </div>
      </div>
      {/* End: Tipping Button */}

      {/* Start: Confetti Canvas */}
      <div 
        ref={containerRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-40 overflow-hidden"
      >
        {particles.map(particle => 
          renderHeartShape(
            particle.x, 
            particle.y, 
            particle.size, 
            particle.rotation, 
            particle.color
          )
        )}
      </div>
      {/* End: Confetti Canvas */}
    </div>
  );
}