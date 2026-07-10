"use client";

import { useState, useEffect } from 'react';
import CyberMuseumArchive from '@/components/CyberMuseumArchive';
import PixelCursorEffect from '@/components/PixelCursorEffect';
import HydrationGuard from '@/components/HydrationGuard';

interface MuseumArtifact {
  id: string;
  title: string;
  era: string;
  description: string;
  imagePlaceholder: string;
  codeSnippet: string;
  historicalSignificance: string;
}

const MUSEUM_COLLECTION: MuseumArtifact[] = [
  {
    id: 'dial-up-1995',
    title: 'Pautan Dial-Up 56k',
    era: '1990-an',
    description: 'Konfigurasi pautan dial-up 56k yang menjadi asas internet domestik pada hari itu.',
    imagePlaceholder: '🖥️',
    codeSnippet: `AT&F
ATZ
AT&V
ATDT#944456789;`,
    historicalSignificance: 'Pautan dial-up 56k membolehkan rumah-rumah mengakses internet pertama kali. Kecepatan 56kbps singkat namun revolusioner.'
  },
  {
    id: 'mirc-slang',
    title: 'Kumpulan Laluan mIRC',
    era: '1990-an',
    description: 'Kumpulan laluan IRC dan slang kaum pada mIRC yang menjadi bahasa digital.',
    imagePlaceholder: '💬',
    codeSnippet: `/join #kampung-siber
/mode #kampung-siber +m
/topic Selamat datang di kampung siber retro!`,
    historicalSignificance: 'mIRC dan IRC secara umum memupuk budaya komuniti dalam talian dengan perbualan langsung.'
  },
  {
    id: 'floppy-disk',
    title: 'Disket 3.5-inch 1.44MB',
    era: '1980-2000-an',
    description: 'Media penyimpanan utama untuk data komputer pada zaman sebelum USB.',
    imagePlaceholder: '💾',
    codeSnippet: `// Format disket
FORMAT A: /FS:FAT /V:"KAMPUNG-SIBER"
COPY *.* A:\
EJECT A:`,
    historicalSignificance: 'Disket 3.5-inch 1.44MB adalah standar penyimpanan utama sebelum hard disk keras menjadi murah.'
  },
  {
    id: 'win95-startup',
    title: 'Layar Masuk Windows 95',
    era: '1995',
    description: 'Pengalaman memulakan komputer Windows 95 dengan lagu inspiratif.',
    imagePlaceholder: '🎵',
    codeSnippet: `// Start menu sound
var sound = new Audio('/sounds/start.wav');
sound.play();`,
    historicalSignificance: 'Lagu "Start Me Up" Windows 95 menjadi ikon kebangkitan komputer pribadi.'
  },
  {
    id: 'geocities-site',
    title: 'Laman Geocities',
    era: '1990-an',
    description: 'Contoh kod HTML laman web pribadi pada era Geocities.',
    imagePlaceholder: '🌐',
    codeSnippet: `<html>
<head><title>My Homepage</title></head>
<body bgcolor="#0000FF" text="#FFFFFF">
<h1>Welcome to My Homepage!</h1>
<blink>Under Construction...</blink>
</body>
</html>`,
    historicalSignificance: 'Geocities membolehkan pengguna membuat laman web percuma, memupuk kebudayaan web kreatif.'
  },
  {
    id: 'bulletin-board',
    title: 'Papan Pengumuman BBS',
    era: '1980-1990-an',
    description: 'Sistem bulletin board system untuk memuat naik dan menulis mesej.',
    imagePlaceholder: '📜',
    codeSnippet: `LOGIN: user
PASSWORD: ********
POST:
Tarikh: 1994-06-15
Mesej: Selamat datang ke BBS kami!`,
    historicalSignificance: 'BBS adalah prasyatan utama sebelum internet komersial menjadi terpakai.'
  }
];

export default function CyberMuseumPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleArtifactClick = (artifact: MuseumArtifact) => {
    console.log('Artifact clicked:', artifact.title);
  };

  if (!isClient) {
    return (
      <main className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300 pt-16">
      <PixelCursorEffect />

      {/* Start: Header Section with Retro Dashed Borders */}
      <div className="sticky top-16 z-40 bg-gradient-to-r from-indigo-900/80 to-purple-900/80 backdrop-blur-md border-b-2 border-dashed border-cyan-500/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold text-cyan-400 pixel-font flex items-center gap-3">
            <span className="text-4xl">🏛️</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-cyan-300">
              Muzium Khazanah Siber
            </span>
          </h1>
          <p className="text-sm text-gray-300 dark:text-gray-400 mt-1 pixel-font border-l-2 border-dashed border-pink-400/50 pl-3">
            Arkib sejarah internet kami - 56k, mIRC, dan lagu latar
          </p>
        </div>
      </div>
      {/* End: Header Section */}

      {/* Start: Museum Gallery with CyberMuseumArchive */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <HydrationGuard>
          <CyberMuseumArchive
            artifacts={MUSEUM_COLLECTION}
            onArtifactClick={handleArtifactClick}
          />
        </HydrationGuard>
      </div>
      {/* End: Museum Gallery */}

      {/* Start: Museum Notes Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="retro-card border-2 border-dashed border-purple-400/30">
          <div className="retro-card-header bg-gray-200 dark:bg-gray-700 px-4 py-2 border-b-2 border-dashed border-gray-300 dark:border-gray-600">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 pixel-font flex items-center gap-2">
              <span className="text-xl">📝</span>
              <span>Nota Sejarah</span>
            </h2>
          </div>
          <div className="p-4">
            <div className="text-sm text-gray-700 dark:text-gray-300 pixel-font space-y-3 border-l-2 border-dashed border-cyan-400 pl-4">
              <p>
                <strong>56k Dial-Up:</strong> Kecepatan pautan dial-up 56k melambatkan muat turun tetapi membuka pintu ke internet global.
              </p>
              <p>
                <strong>mIRC & IRC:</strong> Internet Relay Chat membolehkan komunikasi langsung dalam bilik perbincangang.
              </p>
              <p>
                <strong>Geocities & Tripod:</strong> Perkhidmatan ini membolehkan pengguna membuat laman web percuma dengan ruang penyimpanan terhad.
              </p>
              <p>
                <strong>BBS & FidoNet:</strong> Sistem bulletin board adalah asas komuniti talian sebelum internet komersial.
              </p>
              <p className="border-t-2 border-dashed border-pink-400/30 pt-3">
                <strong>Kesedaran:</strong> Klik pada setiap artefak untuk melihat detail sejarahnya dengan moda interaktif.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* End: Museum Notes Section */}
    </main>
  );
}