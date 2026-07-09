"use client";

import { useState, useEffect } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { enDictionary, msDictionary } from '@/i18n/dictionaries';

interface TippingSettings {
  enabled: boolean;
  provider: 'paypal' | 'ko-fi' | 'buycoffee';
  customLink: string;
  message: string;
}

interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
}

export default function SettingsTipping() {
  const { language } = useLanguageStore();
  const t = language === 'ms' ? msDictionary : enDictionary;
  
  const [settings, setSettings] = useState<TippingSettings>({
    enabled: false,
    provider: 'ko-fi',
    customLink: '',
    message: 'Support my work!',
  });

  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiParticles, setConfettiParticles] = useState<ConfettiParticle[]>([]);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(isTouch);
  }, []);

  const handleToggle = () => {
    if (settings.enabled) {
      setSettings(prev => ({
        ...prev,
        enabled: !prev.enabled,
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        enabled: true,
      }));
      triggerConfetti();
    }
  };

  const triggerConfetti = () => {
    if (showConfetti) return;
    
    const particles: ConfettiParticle[] = [];
    const heartChars = ['💖', '💕', '💗', '💓', '💞', '💝'];
    
    for (let i = 0; i < 30; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3 + 2;
      
      particles.push({
        id: Date.now() + i,
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        vx: Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1),
        vy: Math.sin(angle) * speed - 5,
        size: Math.random() * 20 + 15,
        color: `hsl(${Math.random() * 60 + 0}, 100%, 70%)`,
        life: 0,
        maxLife: 60,
      });
    }
    
    setConfettiParticles(particles);
    setShowConfetti(true);
    
    const interval = setInterval(() => {
      setConfettiParticles(prev => {
        const updated = prev.map(p => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          vy: p.vy + 0.1,
          life: p.life + 1,
        }));
        
        const alive = updated.filter(p => p.life < p.maxLife);
        
        if (alive.length === 0) {
          clearInterval(interval);
          setShowConfetti(false);
        }
        
        return alive;
      });
    }, 16);
  };

  const handleProviderChange = (provider: 'paypal' | 'ko-fi' | 'buycoffee') => {
    setSettings(prev => ({
      ...prev,
      provider,
    }));
  };

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings(prev => ({
      ...prev,
      customLink: e.target.value,
    }));
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSettings(prev => ({
      ...prev,
      message: e.target.value,
    }));
  };

  const handleSave = () => {
    console.log('Tipping settings saved:', settings);
  };

  return (
    <div className="p-6">
      <style>{`
        .confetti-canvas {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 9999;
        }
      `}</style>
      
      {showConfetti && !isTouchDevice && (
        <canvas
          className="confetti-canvas"
          id="confetti-canvas"
        />
      )}

      <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
        <span>💖</span>
        <span>Belanja Kopi / Give a Treat</span>
      </h2>
      
      <div className="retro-btn-secondary flex items-center justify-center gap-2 mb-6" onClick={handleToggle}>
        <span className="text-2xl">{settings.enabled ? '☕️' : '☕'}</span>
        <span className="font-bold">
          {settings.enabled ? 'Berhentikan Tipping' : 'Aktifkan Tipping'}
        </span>
      </div>
      
      {settings.enabled && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Penyedia Tipping
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => handleProviderChange('ko-fi')}
                className={`w-full p-3 rounded-md border text-sm font-medium transition-colors ${
                  settings.provider === 'ko-fi'
                    ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-xl">☕</span>
                  <span>Ko-fi</span>
                </div>
              </button>
              <button
                onClick={() => handleProviderChange('paypal')}
                className={`w-full p-3 rounded-md border text-sm font-medium transition-colors ${
                  settings.provider === 'paypal'
                    ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-xl">💳</span>
                  <span>PayPal</span>
                </div>
              </button>
              <button
                onClick={() => handleProviderChange('buycoffee')}
                className={`w-full p-3 rounded-md border text-sm font-medium transition-colors ${
                  settings.provider === 'buycoffee'
                    ? 'border-green-400 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-xl">🍪</span>
                  <span>Buy Me a Coffee</span>
                </div>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Pautan Tipping Custom
            </label>
            <input
              type="url"
              value={settings.customLink}
              onChange={handleLinkChange}
              placeholder="https://..."
              className="retro-input w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mesej
            </label>
            <textarea
              value={settings.message}
              onChange={handleMessageChange}
              placeholder="Terima kasih atas sokongan anda!"
              rows={3}
              className="retro-textarea w-full"
            />
          </div>

          <button
            onClick={handleSave}
            className="retro-btn-primary w-full"
          >
            Simpan Tetapan
          </button>
        </div>
      )}
    </div>
  );
}