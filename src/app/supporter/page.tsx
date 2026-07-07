'use client';

// Start: Imports
import { useMemo, useState } from 'react';
import CrtThemeController from '@/components/CrtThemeController';
import DonateWindow from '@/components/DonateWindow';
import RetroHitCounter from '@/components/RetroHitCounter';
import SiteDirectoryGrid from '@/components/SiteDirectoryGrid';
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

  // Start: Visitor Controls
  const communitySites = useMemo(() => [
    {
      id: 'site-1',
      title: 'Rangkaian Laman Komuniti',
      description: 'Pusat penjelajahan laman yang berkongsi nilai seni retro dan faedah interaksi.',
      tags: ['retro', 'komuniti', 'rangkaian'],
      href: '/browse',
    },
    {
      id: 'site-2',
      title: 'Siri Tutorial Penyelenggaraan',
      description: 'Jalur modul latihan yang memudahkan pemula memahami seni bina laman dengan lebih yakin.',
      tags: ['tutorial', 'pembelajaran', 'sokongan'],
      href: '/tutorials',
    },
  ], []);
  // End: Visitor Controls

  // Start: Render Supporter Page
  return (
    <div className={`p-4 ${className || ''}`}>
      <div className="retro-title-bar mb-4 flex items-center justify-between px-3 py-2">
        <h2 className="text-lg font-bold text-white">🏆 Papan Pemuka</h2>
        <CrtThemeController className="hidden sm:inline-flex" />
      </div>

      <div className="mb-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="retro-window border-2 border-pink-500 bg-gradient-to-br from-[#0e1330] to-[#121b4a] p-3 retro-shadow">
          <h3 className="mb-2 text-sm font-bold text-white">Papan Pemuka Penyokong</h3>
          <p className="text-xs leading-relaxed text-cyan-200">
            Senarai penyumbang yang menjaga projek ini dengan dedikasi, kepakaran, dan semangat komuniti yang kukuh.
          </p>
        </div>
        <div className="space-y-3">
          <RetroHitCounter value={18432} label="Kaunter Pelawat" />
          <DonateWindow title="Sumbangan" />
        </div>
      </div>

      <SupporterHallOfFame supporters={supporters} />

      <div className="retro-window mt-4 border-2 border-pink-500 bg-gradient-to-br from-[#0e1330] to-[#121b4a] p-3 retro-shadow">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Penjelajah Laman</h3>
          <span className="rounded bg-amber-100 px-2 py-1 text-[10px] font-semibold text-amber-700">Rangkaian Komuniti</span>
        </div>
        <SiteDirectoryGrid sites={communitySites} className="mb-3" />
      </div>

      <div className="retro-window mt-4 border-2 border-pink-500 bg-gradient-to-br from-[#0e1330] to-[#121b4a] p-3 retro-shadow">
        <h3 className="mb-2 text-sm font-bold text-white">Tetapan Penyertaan</h3>
        <p className="mb-3 text-xs leading-relaxed text-cyan-200">
          Sertai usaha ini dengan menyumbang kod, reka bentuk, dokumentasi, atau sokongan komuniti yang berterusan.
        </p>
        <button className="retro-btn-primary px-3 py-1 text-xs">Lihat Garis Panduan</button>
      </div>
    </div>
  );
}
// End: SupporterPage Component
