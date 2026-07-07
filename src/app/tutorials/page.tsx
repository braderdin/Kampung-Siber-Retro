'use client';

// Start: Imports
import { useMemo, useState } from 'react';
import CrtThemeController from '@/components/CrtThemeController';
import RetroHitCounter from '@/components/RetroHitCounter';
import RetroTerminalWidget from '@/components/RetroTerminalWidget';
import TutorialCard from '@/components/TutorialCard';
// End: Imports

// Start: Type Definitions
interface Tutorial {
  id: number;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  completed: boolean;
}

interface TutorialsPageProps {
  className?: string;
}
// End: Type Definitions

// Start: TutorialsPage Component
export default function TutorialsPage({ className }: TutorialsPageProps) {
  // Start: State Management
  const [tutorials] = useState<Tutorial[]>([
    {
      id: 1,
      title: 'Asas HTML untuk Pembangunan Web Retro',
      description: 'Pelajari asas HTML dengan penekanan pada teknik gaya retro yang bersih dan mudah difahami.',
      difficulty: 'Beginner',
      category: 'HTML',
      completed: false,
    },
    {
      id: 2,
      title: 'Gaya CSS dengan Estetika Windows 95',
      description: 'Kuasali teknik CSS untuk mencipta antara muka yang terdengar klasik dan berfungsi dengan baik.',
      difficulty: 'Beginner',
      category: 'CSS',
      completed: false,
    },
    {
      id: 3,
      title: 'Asas JavaScript untuk Permainan Retro',
      description: 'Bina permainan gaya arked menggunakan JavaScript tulen dengan struktur yang jelas.',
      difficulty: 'Intermediate',
      category: 'JavaScript',
      completed: false,
    },
    {
      id: 4,
      title: 'Teknik Seni Piksel untuk Paparan Retro',
      description: 'Pelajari cara menghasilkan seni piksel yang bersih dan mudah dioptimumkan untuk laman web.',
      difficulty: 'Intermediate',
      category: 'Reka Bentuk',
      completed: true,
    },
    {
      id: 5,
      title: 'Sintesis Audio untuk Kesan Bunyi Retro',
      description: 'Cipta kesan bunyi retro yang berkesan menggunakan Web Audio API secara teratur.',
      difficulty: 'Advanced',
      category: 'Audio',
      completed: false,
    },
  ]);
  const [filter, setFilter] = useState<'all' | 'Beginner' | 'Intermediate' | 'Advanced'>('all');
  // End: State Management

  // Start: Progress Metrics
  const completedCount = useMemo(() => tutorials.filter((tutorial) => tutorial.completed).length, [tutorials]);
  const progressPercent = Math.round((completedCount / tutorials.length) * 100);
  const filteredTutorials = tutorials.filter((tutorial) => filter === 'all' || tutorial.difficulty === filter);
  // End: Progress Metrics

  // Start: Render Tutorials Page
  return (
    <div className={`p-4 ${className || ''}`}>
      <div className="retro-title-bar mb-4 flex items-center justify-between px-3 py-2">
        <h2 className="text-lg font-bold text-white">📚 Siri Tutorial</h2>
        <CrtThemeController className="hidden sm:inline-flex" />
      </div>

      <div className="mb-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="retro-window border-2 border-pink-500 bg-white p-3 retro-shadow">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-800">Peta Kursus</h3>
            <span className="rounded bg-blue-100 px-2 py-1 text-[10px] font-semibold text-blue-700">Kemajuan {progressPercent}%</span>
          </div>
          <p className="mb-3 text-xs leading-relaxed text-gray-600">
            Navigasi Siri Tutorial dengan penunjuk kemajuan yang bersih bagi setiap modul retro yang disusun.
          </p>
          <div className="h-2 rounded bg-gray-200">
            <div className="h-2 rounded bg-emerald-500" style={{ width: `${progressPercent}%` }} />
          </div>
          <p className="mt-2 text-[11px] text-gray-500">{completedCount} daripada {tutorials.length} modul siap.</p>
        </div>
        <div className="space-y-3">
          <RetroHitCounter value={1200 + completedCount * 340} label="Kaunter Pelawat" />
          <RetroTerminalWidget title="Coretan Terminal" />
        </div>
      </div>

      <div className="retro-window border-2 border-pink-500 bg-white p-3 retro-shadow">
        <div className="mb-3 flex flex-wrap gap-2">
          <button onClick={() => setFilter('all')} className={`rounded px-3 py-1 text-xs border-2 border-pink-500 ${filter === 'all' ? 'bg-pink-500 text-white' : 'bg-pink-50 hover:bg-pink-100'}`}>
            Semua Siri
          </button>
          <button onClick={() => setFilter('Beginner')} className={`rounded px-3 py-1 text-xs border-2 border-emerald-500 ${filter === 'Beginner' ? 'bg-emerald-500 text-white' : 'bg-emerald-50 hover:bg-emerald-100'}`}>
            Pemula
          </button>
          <button onClick={() => setFilter('Intermediate')} className={`rounded px-3 py-1 text-xs border-2 border-amber-500 ${filter === 'Intermediate' ? 'bg-amber-500 text-white' : 'bg-amber-50 hover:bg-amber-100'}`}>
            Pertengahan
          </button>
          <button onClick={() => setFilter('Advanced')} className={`rounded px-3 py-1 text-xs border-2 border-rose-500 ${filter === 'Advanced' ? 'bg-rose-500 text-white' : 'bg-rose-50 hover:bg-rose-100'}`}>
            Lanjutan
          </button>
        </div>
        <p className="text-xs text-gray-600">Menunjukkan {filteredTutorials.length} daripada {tutorials.length} modul.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {filteredTutorials.length > 0 ? (
          filteredTutorials.map((tutorial) => (
            <TutorialCard
              key={tutorial.id}
              title={tutorial.title}
              description={tutorial.description}
              difficulty={tutorial.difficulty}
              category={tutorial.category}
              completed={tutorial.completed}
              onStart={() => alert(`Memulakan ${tutorial.title}`)}
            />
          ))
        ) : (
          <div className="retro-window border-2 border-pink-500 bg-white p-4 text-center retro-shadow md:col-span-2">
            <p className="text-sm text-gray-500">Tiada modul yang sepadan dengan penapis yang dipilih.</p>
          </div>
        )}
      </div>
    </div>
  );
}
// End: TutorialsPage Component
