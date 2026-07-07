'use client';

// Start: Imports
import { useState } from 'react';
// End: Imports

// Start: Type Definitions
interface MovementValue {
  title: string;
  description: string;
  icon: string;
}

interface AboutPageProps {
  className?: string;
}
// End: Type Definitions

// Start: AboutPage Component
export default function AboutPage({ className }: AboutPageProps) {
  // Start: State Management
  const [activeTab, setActiveTab] = useState<'mission' | 'values' | 'history'>('mission');
  // End: State Management

  // Start: Movement Values
  const movementValues: MovementValue[] = [
    {
      title: 'Pemeliharaan',
      description: 'Kita mengekalkan seni dan amalan pembangunan web awal, menjaga teknik serta estetika laman web era 90-an.',
      icon: '🏛️',
    },
    {
      title: 'Pendidikan',
      description: 'Kita mendidik generasi baharu pembangun melalui pengalaman retro yang praktikal dan mudah difahami.',
      icon: '🎓',
    },
    {
      title: 'Komuniti',
      description: 'Kita membina komuniti global yang berkongsi ilmu, sumber, dan projek kreatif yang menarik.',
      icon: '👥',
    },
    {
      title: 'Inovasi',
      description: 'Kita menggabungkan estetika retro dengan amalan moden untuk menghasilkan pengalaman web yang unik.',
      icon: '⚡',
    },
  ];
  // End: Movement Values

  // Start: Mission Tab
  const renderMissionTab = () => (
    <div className="space-y-3">
      <p className="text-xs leading-relaxed text-gray-700">
        Kampung Siber Retro ialah sebuah kampung digital yang meraikan dan mengekalkan zaman keemasan pembangunan web.
        Kita percaya bahawa memahami masa lalu adalah penting untuk membina masa depan web yang lebih baik.
      </p>
      <p className="text-xs leading-relaxed text-gray-700">
        Platform ini menyediakan alat, tutorial, dan ruang komuniti supaya pembangun dapat belajar, mencipta, dan berkongsi projek yang diilhamkan retro.
      </p>
    </div>
  );
  // End: Mission Tab

  // Start: Values Tab
  const renderValuesTab = () => (
    <div className="space-y-3">
      {movementValues.map((value) => (
        <div key={value.title} className="retro-window border-2 border-gray-400 bg-white p-3 retro-shadow">
          <div className="flex items-start gap-3">
            <span className="text-2xl">{value.icon}</span>
            <div>
              <h4 className="mb-1 text-sm font-bold text-gray-800">{value.title}</h4>
              <p className="text-xs text-gray-600">{value.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
  // End: Values Tab

  // Start: History Tab
  const renderHistoryTab = () => (
    <div className="space-y-3">
      <div className="retro-window border-2 border-gray-400 bg-white p-3 retro-shadow">
        <h4 className="mb-2 text-sm font-bold text-gray-800">Garis Masa</h4>
        <div className="relative space-y-4 border-l-2 border-gray-300 pl-4">
          {[
            ['2023', 'Projek dimulakan untuk mengekalkan pembangunan web retro.'],
            ['2024', 'Versi awam pertama dilancarkan dengan editor dan ruang ujian asas.'],
            ['2025', 'Komuniti, tutorial, dan alat penyokong diperluaskan dengan lebih luas.'],
          ].map(([year, detail]) => (
            <div key={year} className="relative">
              <div className="absolute -left-6 top-1 h-3 w-3 rounded-full bg-blue-500" />
              <p className="text-xs text-gray-700">
                <span className="font-bold">{year}</span> - {detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  // End: History Tab

  // Start: Render About Page
  return (
    <div className={`min-h-screen bg-gray-50 p-6 dark:bg-gray-900 ${className || ''}`}>
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Tentang Kampung Siber Retro</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Arkib hidup web awal yang disemak semula untuk pencipta moden.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="retro-window border-2 border-gray-400 bg-white p-6 retro-shadow">
            <div className="mb-4 flex space-x-2 border-b border-gray-200 pb-3">
              {(['mission', 'values', 'history'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded px-3 py-2 text-sm font-medium transition-colors ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  {tab === 'mission' ? 'Misi' : tab === 'values' ? 'Nilai' : 'Sejarah'}
                </button>
              ))}
            </div>

            {activeTab === 'mission' && renderMissionTab()}
            {activeTab === 'values' && renderValuesTab()}
            {activeTab === 'history' && renderHistoryTab()}
          </div>

          <div className="space-y-4">
            <div className="retro-window border-2 border-gray-400 bg-white p-4 retro-shadow">
              <h2 className="mb-2 text-sm font-bold text-gray-800">Apa yang kita pertahankan</h2>
              <p className="text-xs leading-relaxed text-gray-600">Kita mengekalkan kemahiran asas, mengajar prinsip teras, dan membina komuniti di sekeliling eksperimen yang menyeronokkan.</p>
            </div>
            <div className="retro-window border-2 border-gray-400 bg-white p-4 retro-shadow">
              <h2 className="mb-2 text-sm font-bold text-gray-800">Cara untuk mengambil bahagian</h2>
              <p className="text-xs leading-relaxed text-gray-600">Terokai tutorial, ubah suai fail laman, dan kongsikan ciptaan retro anda bersama komuniti.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
// End: AboutPage Component
