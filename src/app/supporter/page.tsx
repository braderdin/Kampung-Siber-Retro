'use client';

// Start: Imports
import { useState } from 'react';
import DonateWindow from '@/components/DonateWindow';
import SupporterHallOfFame from '@/components/SupporterHallOfFame';
// End: Imports

// Start: Type Definitions
interface Supporter {
  id: number;
  name: string;
  role: string;
  contribution: string;
  avatar: string;
  joinDate: string;
  verified: boolean;
}

interface SupporterPageProps {
  className?: string;
}
// End: Type Definitions

// Start: SupporterPage Component
export default function SupporterPage({ className }: SupporterPageProps) {
  // Start: State Management
  const [supporters] = useState<Supporter[]>([
    {
      id: 1,
      name: 'RetroCoder',
      role: 'Pengasas',
      contribution: 'Membina seni bina platform utama dan asas kod awal.',
      avatar: '👨‍💻',
      joinDate: '2023-01-15',
      verified: true,
    },
    {
      id: 2,
      name: 'PixelPioneer',
      role: 'Pereka Utama',
      contribution: 'Mereka bentuk sistem UI Windows 95 dan aset visual.',
      avatar: '🎨',
      joinDate: '2023-02-20',
      verified: true,
    },
    {
      id: 3,
      name: 'ByteBandit',
      role: 'Moderator Komuniti',
      contribution: 'Mengurus interaksi komuniti dan kualiti kandungan.',
      avatar: '🛡️',
      joinDate: '2023-03-10',
      verified: true,
    },
    {
      id: 4,
      name: 'NeonNomad',
      role: 'Pemimpin Dokumentasi',
      contribution: 'Menyelenggara modul tutorial dan dokumentasi pembangun.',
      avatar: '📖',
      joinDate: '2023-04-05',
      verified: false,
    },
  ]);
  // End: State Management

  // Start: Render Supporter Page
  return (
    <div className={`p-4 ${className || ''}`}>
      <div className="retro-title-bar mb-4 flex items-center justify-between px-3 py-2">
        <h2 className="text-lg font-bold text-white">🏆 Dewan Kemasyhuran</h2>
        <div className="flex space-x-1">
          <div className="h-8 w-8" />
          <div className="h-8 w-8" />
          <div className="h-8 w-8" />
        </div>
      </div>

      <div className="mb-4 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="retro-window border-2 border-gray-400 bg-white p-3 retro-shadow">
          <h3 className="mb-2 text-sm font-bold text-gray-800">Papan Pemuka Penyokong</h3>
          <p className="text-xs leading-relaxed text-gray-600">
            Senarai penyumbang yang menjaga projek ini dengan dedikasi, kepakaran, dan semangat komuniti yang kukuh.
          </p>
        </div>
        <DonateWindow title="Sumbangan" />
      </div>

      <SupporterHallOfFame supporters={supporters} />

      <div className="retro-window mt-4 border-2 border-gray-400 bg-white p-3 retro-shadow">
        <h3 className="mb-2 text-sm font-bold text-gray-800">Tetapan Penyertaan</h3>
        <p className="mb-3 text-xs leading-relaxed text-gray-600">
          Sertai usaha ini dengan menyumbang kod, reka bentuk, dokumentasi, atau sokongan komuniti yang berterusan.
        </p>
        <button className="retro-btn-primary px-3 py-1 text-xs">Lihat Garis Panduan</button>
      </div>
    </div>
  );
}
// End: SupporterPage Component
