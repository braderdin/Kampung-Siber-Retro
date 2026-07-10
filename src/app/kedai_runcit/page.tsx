'use client';

import { useState } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { enDictionary, msDictionary } from '@/i18n/dictionaries';
import ProductCard from '@/components/ProductCard';
import RetroMarqueeTicker from '@/components/RetroMarqueeTicker';
import HydrationGuard from '@/components/HydrationGuard';
import ArcadeGame from '@/components/ArcadeGame';

interface AssetTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  code: string;
  tags: string[];
  downloads: number;
}

const ASSET_CATALOG: AssetTemplate[] = [
  {
    id: 'retro-btn-secondary',
    title: 'Butang Sekunder Retro',
    category: 'UI Components',
    description: 'Butang sekunder dengan batasan berwarna dan transisi halus',
    code: `.retro-btn-secondary {
  padding: 8px 16px;
  border: 2px solid var(--border-color);
  border-radius: 6px;
  color: #ffffff;
  font-weight: 500;
  transition: all 0.2s ease;
  background: transparent;
}

.retro-btn-secondary:hover {
  background: rgba(0, 255, 255, 0.1);
  border-color: #ff007f;
}`,
    tags: ['button', 'ui', 'retro'],
    downloads: 1247
  },
  {
    id: 'marquee-animation',
    title: 'Animasi Marquee',
    category: 'Animations',
    description: 'Animasi melengkar untuk ticker teks atau pengumuman',
    code: `@keyframes marquee {
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
}

.animate-marquee {
  animation: marquee 25s linear infinite;
  white-space: nowrap;
}`,
    tags: ['animation', 'marquee', 'ticker'],
    downloads: 892
  },
  {
    id: 'crt-flicker',
    title: 'Effek Flicker CRT',
    category: 'Animations',
    description: 'Effek flicker layar mono-krom untuk estetika retro',
    code: `@keyframes micro-flicker {
  0% { opacity: 1; filter: brightness(1); }
  20% { opacity: 0.98; filter: brightness(0.98); }
  40% { opacity: 1; filter: brightness(1.01); }
  60% { opacity: 0.99; filter: brightness(0.99); }
  80% { opacity: 1; filter: brightness(1.01); }
  100% { opacity: 1; filter: brightness(1); }
}

.crt-flicker {
  animation: micro-flicker 0.1s infinite;
}`,
    tags: ['crt', 'flicker', 'retro'],
    downloads: 654
  },
  {
    id: 'winamp-player',
    title: 'Pemain Winamp',
    category: 'Media',
    description: 'Widget pemain audio dengan antara muka Winamp klasik',
    code: `import { useState, useRef, useEffect } from 'react';

export default function WinampPlayer({ 
  src,
  title = 'Kampung Siber Radio',
  artist = 'Digital Vibes'
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="winamp-player retro-window">
      <audio ref={audioRef} src={src} loop />
      <div className="winamp-header">
        <span className="winamp-title">{title}</span>
        <span className="winamp-artist">{artist}</span>
      </div>
      <button onClick={togglePlay} className="winamp-play-btn">
        {isPlaying ? '⏸' : '▶'}
      </button>
    </div>
  );
}`,
    tags: ['audio', 'player', 'winamp', 'media'],
    downloads: 2103
  },
  {
    id: 'pixel-cursor',
    title: 'Kursor 8-bit',
    category: 'Effects',
    description: 'Kursor custom dengan efek partikel 8-bit',
    code: `import { useState } from 'react';

export default function PixelCursorEffect() {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="pixel-cursor" style={{
      left: cursorPos.x,
      top: cursorPos.y
    }}>
      <div className="pixel-dot" />
    </div>
  );
}`,
    tags: ['cursor', 'effect', 'pixel'],
    downloads: 567
  },
  {
    id: 'retro-terminal',
    title: 'Terminal Retro',
    category: 'UI Components',
    description: 'Terminal gaya 90an dengan prompt perintah',
    code: `import { useState } from 'react';

export default function RetroTerminalWidget({ 
  title = 'Terminal',
  commands = []
}) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<string[]>([]);

  const handleCommand = (cmd: string) => {
    const command = cmd.toLowerCase().trim();
    
    if (command === 'help') {
      setOutput(['Available commands:', 'help', 'clear', 'date', 'whoami']);
    } else if (command === 'clear') {
      setOutput([]);
    } else if (command === 'date') {
      setOutput([new Date().toString()]);
    } else {
      setOutput([\`bash: \${command}: command not found\`]);
    }
    
    setInput('');
  };

  return (
    <div className="retro-terminal">
      <div className="terminal-header">{title}</div>
      <div className="terminal-output">
        {output.map((line, i) => (
          <div key={i} className="terminal-line">{line}</div>
        ))}
      </div>
      <div className="terminal-input">
        <span className="prompt">> </span>
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleCommand(input)}
          className="terminal-input-field"
        />
      </div>
    </div>
  );
}`,
    tags: ['terminal', 'cli', 'retro'],
    downloads: 1342
  },
  {
    id: 'matrix-rain',
    title: 'Hujan Matrix',
    category: 'Effects',
    description: 'Efek hujan kod hijau gaya Matrix',
    code: `const MATRIX_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#\$%^&*()*&^%';

function createMatrixRain(canvas, fontSize = 16) {
  const ctx = canvas.getContext('2d');
  const columns = canvas.width / fontSize;
  const drops = Array(Math.floor(columns)).fill(0);

  function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#0f0';
    ctx.font = \`\${fontSize}px monospace\`;

    for (let i = 0; i < drops.length; i++) {
      const text = MATRIX_CHARS.charAt(Math.floor(Math.random() * MATRIX_CHARS.length));
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);
      
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  return draw;
}`,
    tags: ['matrix', 'effect', 'rain'],
    downloads: 789
  },
  {
    id: 'retro-counter',
    title: 'Pemanderaan Retro',
    category: 'Utilities',
    description: 'Pemanderaan digit dengan animasi rollover',
    code: `import { useState, useEffect } from 'react';

export function RetroCounter({ 
  target = 0, 
  duration = 2000,
  prefix = '',
  suffix = ''
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target, duration]);

  return (
    <div className="retro-counter">
      <span className="prefix">{prefix}</span>
      <span className="number">{count}</span>
      <span className="suffix">{suffix}</span>
    </div>
  );
}`,
    tags: ['counter', 'animation', 'number'],
    downloads: 423
  }
];

export default function KedaiRuncitPage() {
  const { language } = useLanguageStore();
  const t = language === 'ms' ? msDictionary : enDictionary;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showArcade, setShowArcade] = useState(false);

  const categories = ['All', 'UI Components', 'Animations', 'Media', 'Effects', 'Utilities'];

  const filteredAssets = ASSET_CATALOG.filter(asset => {
    const matchesSearch = asset.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          asset.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          asset.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || asset.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <HydrationGuard>
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Start: Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 pixel-font mb-2 flex items-center justify-center gap-3">
              <span className="text-4xl">🛍️</span>
              <span>Kedai Runcit Digital Pak Samad</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 pixel-font text-sm">
              {language === 'ms' 
                ? 'Katalog template HTML, CSS, dan JavaScript retro' 
                : 'Catalog of retro HTML, CSS, and JavaScript templates'}
            </p>
          </div>
          {/* End: Header */}

          {/* Start: Arcade Link */}
          <div className="mb-6 flex justify-center">
            <button
              onClick={() => setShowArcade(true)}
              className="retro-btn-primary flex items-center gap-2"
            >
              <span>🎮</span>
              <span>{language === 'ms' ? 'Kafe Siber Arcade' : 'Kafe Siber Arcade'}</span>
            </button>
          </div>
          {/* End: Arcade Link */}

          {/* Start: Marquee Ticker */}
          <div className="mb-6">
            <RetroMarqueeTicker />
          </div>
          {/* End: Marquee Ticker */}

          {/* Start: Search and Filter */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder={language === 'ms' ? 'Cari template...' : 'Search templates...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 pixel-font text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 pixel-font text-sm focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          {/* End: Search and Filter */}

          {/* Start: Asset Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssets.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 pixel-font">
                  {language === 'ms' 
                    ? 'Tiada template yang sepadan' 
                    : 'No matching templates found'}
                </p>
              </div>
            ) : (
              filteredAssets.map(asset => (
                <ProductCard
                  key={asset.id}
                  id={asset.id}
                  title={asset.title}
                  category={asset.category}
                  description={asset.description}
                  code={asset.code}
                  tags={asset.tags}
                  downloads={asset.downloads}
                />
              ))
            )}
          </div>
          {/* End: Asset Grid */}

          {/* Start: Stats */}
          <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400 pixel-font">
            <p>
              {language === 'ms' ? 'Menunjukkan' : 'Showing'} {filteredAssets.length} {language === 'ms' ? 'dari' : 'of'} {ASSET_CATALOG.length} {language === 'ms' ? 'template' : 'templates'}
            </p>
          </div>
          {/* End: Stats */}
        </div>
      </main>

      {/* Start: Arcade Modal */}
      {showArcade && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg p-4 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-cyan-400 pixel-font">
                {language === 'ms' ? 'Kafe Siber Arcade' : 'Kafe Siber Arcade'}
              </h3>
              <button
                onClick={() => setShowArcade(false)}
                className="text-gray-400 hover:text-white pixel-font text-xl"
              >
                ✕
              </button>
            </div>
            <ArcadeGame className="w-full" />
          </div>
        </div>
      )}
      {/* End: Arcade Modal */}
    </HydrationGuard>
  );
}
