'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

function GlitchText({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const [glitch, setGlitch] = useState(false);
  const [charIndex, setCharIndex] = useState(0);
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitch(true);
      setCharIndex(Math.floor(Math.random() * String(children).length));
      setTimeout(() => setGlitch(false), 300);
    }, 2000);
    return () => clearInterval(glitchInterval);
  }, [children]);
  const text = String(children);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
  return (
    <span className={className}>
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          animate={glitch && index === charIndex ? {
            color: ['#ff00ff', '#00ffff', '#ff007f', '#ffffff'],
            textShadow: '0 0 10px currentColor',
            filter: 'hue-rotate(180deg)'
          } : {}}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {glitch && index === charIndex ? chars[Math.floor(Math.random() * chars.length)] : char}
        </motion.span>
      ))}
    </span>
  );
}

export default function Error404({ error, reset }: ErrorProps) {
  const router = useRouter();
  const [glitchActive, setGlitchActive] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; opacity: number }>>([]);
  const [isClient, setIsClient] = useState(false);
  const [recoveryUsername, setRecoveryUsername] = useState('');

  // Self-healing recovery state
  const [recoveryMode, setRecoveryMode] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const initialParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      opacity: Math.random() * 0.5 + 0.3,
    }));
    setParticles(initialParticles);
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 500);
    }, 3000);
    return () => clearInterval(glitchInterval);
  }, []);

  const handleReset = () => reset();
  const handleGoHome = () => router.push('/');

  // Self-healing recovery handler
  const handleRecoverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (recoveryUsername.trim()) {
      // Client-side route hot-swap recovery without full page reload
      router.push(`/site/${recoveryUsername.trim()}`);
    }
  };

  // Toggle recovery mode
  const toggleRecoveryMode = () => {
    setRecoveryMode(!recoveryMode);
    setRecoveryUsername('');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black relative overflow-hidden">
      {/* CRT Scanlines */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="scanline-animation" />
      </div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0 z-5 pointer-events-none">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute w-2 h-2 bg-pink-500/30 rounded-full"
            style={{
              top: `${p.y}%`,
              left: `${p.x}%`,
              opacity: p.opacity,
            }}
            animate={{
              y: [p.y, p.y + 10],
              opacity: [p.opacity, p.opacity + 0.3, p.opacity],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Glitch Overlay */}
      <AnimatePresence>
        {glitchActive && (
          <motion.div
            className="absolute inset-0 z-6 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0"
              animate={{
                background: [
                  'linear-gradient(45deg, transparent 0%, rgba(255,0,127,0.1) 50%, transparent 100%)',
                  'linear-gradient(45deg, transparent 0%, rgba(0,255,255,0.1) 50%, transparent 100%)',
                ],
              }}
              transition={{ duration: 0.5 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Window */}
      <motion.div
        className="retro-window w-full max-w-md mx-4 relative z-20"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="retro-window-title-bar bg-red-900/80 border-b-2 border-red-700">
          <div className="retro-window-title pixel-font text-red-200 flex items-center">
            <span className="mr-2">❌ SYSTEM ERROR</span>
          </div>
        </div>
        <div className="retro-window-client p-8 bg-gray-900/90">
          {/* Alert Box */}
          <div className="mb-6 p-4 bg-yellow-900/50 border-2 border-yellow-500 retro-border retro-alert-blink">
            <div className="flex items-start">
              <span className="text-2xl mr-3">⚠️</span>
              <div>
                <GlitchText className="pixel-font text-2xl font-bold text-yellow-300 mb-2 block glitch-title">
                  Ralat Kod 404: Teratak Digital Tidak Ditemui!
                </GlitchText>
                <GlitchText className="text-sm text-yellow-200 pixel-font">
                  Sila Semak Ejaan Nama Pengguna
                </GlitchText>
              </div>
            </div>
          </div>

          {/* Error Details */}
          <div className="mb-6 p-4 bg-gray-800/50 border-2 border-gray-600 rounded retro-border retro-details">
            <div className="pixel-font text-xs text-gray-400 font-mono">
              <div className="mb-1"><span className="text-pink-400">SYSTEM:</span> Digital Terrace Engine v2.0</div>
              <div className="mb-1"><span className="text-cyan-400">ERROR_TYPE:</span> USER_NOT_FOUND</div>
              <div className="mb-1"><span className="text-green-400">SOURCE:</span> Site Retrieval Module</div>
              <div><span className="text-blue-400">ACTION:</span> User Data Resolution Failed</div>
            </div>
          </div>

          {/* Self-Healing Recovery Input Field */}
          {recoveryMode && isClient && (
            <div className="mb-6">
              <form onSubmit={handleRecoverySubmit} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 pixel-font">
                    Masukkan Nama Pengguna Baru:
                  </label>
                  <input
                    type="text"
                    value={recoveryUsername}
                    onChange={(e) => setRecoveryUsername(e.target.value)}
                    placeholder="contoh: pengguna123"
                    className="w-full retro-input px-3 py-2 pixel-font text-sm"
                    maxLength={50}
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  className="w-full retro-btn-primary text-sm pixel-font py-2 px-4"
                >
                  PUNCHI 🔫 (Hot-Swap Recovery)
                </button>
              </form>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={handleReset} className="retro-btn-primary text-sm pixel-font flex-1 py-2 px-4">
              🔄 Cuba Semula
            </button>
            <button onClick={handleGoHome} className="retro-btn-secondary text-sm pixel-font flex-1 py-2 px-4 border-pink-500 text-pink-400">
              🏠 Halaman Utama
            </button>
            {!recoveryMode && isClient && (
              <button
                onClick={toggleRecoveryMode}
                className="retro-btn-secondary text-sm pixel-font flex-1 py-2 px-4 border-cyan-500 text-cyan-400"
              >
                🩹 PULIHKAN (Self-Healing)
              </button>
            )}
            {recoveryMode && isClient && (
              <button
                onClick={toggleRecoveryMode}
                className="retro-btn-secondary text-sm pixel-font flex-1 py-2 px-4 border-gray-500 text-gray-400"
              >
                ✖️ BATAL
              </button>
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t-2 border-dashed border-gray-600/50 retro-footer-terminal">
            <div className="pixel-font text-xs text-gray-500 text-center">
              <div className="flex items-center justify-center gap-2">
                <span className="text-green-400">💚</span>
                <span>Kampung Siber Retro - Digital Village Hub</span>
                <span className="text-green-400">💚</span>
              </div>
              <div className="mt-1 text-xs text-gray-600/70">
                [System: Online] [Status: Error Recovered] [Protocol: HTTP/1.1]
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* CRT Flicker Effect */}
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.02)] pointer-events-none z-10 crt-flicker" />
    </div>
  );
}
/* Start: 90s-Style CSS Animations */
<style jsx>{`
  @keyframes pulse {
    0%, 100% { opacity: 0.5; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.05); }
  }

  @keyframes retro-alert-blink {
    0%, 100% { box-shadow: 0 0 5px rgba(255, 255, 0, 0.3); }
    50% { box-shadow: 0 0 15px rgba(255, 255, 0, 0.8), 0 0 25px rgba(255, 255, 0, 0.5); }
  }

  .retro-alert-blink {
    animation: retro-alert-blink 2s ease-in-out infinite;
  }

  .retro-details {
    animation: retro-pulse-border 3s infinite;
  }

  @keyframes retro-pulse-border {
    0%, 100% { border-color: #4b5563; }
    50% { border-color: #ec4899; }
  }

  .pixel-font {
    font-family: var(--font-pixel, 'VT323', monospace);
    letter-spacing: 1px;
  }

  .glitch-title {
    position: relative;
    display: inline-block;
  }

  .glitch-title::after {
    content: attr(data-glitch);
    position: absolute;
    left: 0;
    top: 0;
    color: #ff0000;
    opacity: 0.7;
    clip-path: polygon(0 0, 100% 0, 100% 0, 0 0);
    animation: glitch-clip 0.3s infinite;
  }

  @keyframes glitch-clip {
    0% { clip-path: polygon(0 0, 100% 0, 100% 0, 0 0); }
    25% { clip-path: polygon(0 0, 100% 0, 100% 50%, 0 50%); }
    50% { clip-path: polygon(0 50%, 100% 50%, 100% 100%, 0 100%); }
    75% { clip-path: polygon(0 0, 100% 0, 100% 0, 0 0); }
    100% { clip-path: polygon(0 0, 100% 0, 100% 0, 0 0); }
  }
`}</style>
/* End: 90s-Style CSS Animations */