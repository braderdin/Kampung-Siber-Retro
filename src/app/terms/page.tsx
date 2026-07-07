// Start: Imports
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
// End: Imports

// Start: Type Definitions
interface TermsPageProps {
  className?: string;
}

interface TermsSection {
  id: string;
  title: string;
  content: string[];
}
// End: Type Definitions

// Start: TermsPage Component
export default function TermsPage({ className }: TermsPageProps) {
  // Start: State Management
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const router = useRouter();
  // End: State Management

  // Start: Terms Data
  const termsData: TermsSection[] = [
    {
      id: 'acceptance',
      title: 'Penerimaan Terma',
      content: [
        'Dengan mengakses atau menggunakan platform Kampung Siber Retro, anda bersetuju untuk terikat dengan Terma Perkhidmatan ini.',
        'Terma ini membentuk perjanjian yang mengikat secara sah antara anda dan Kampung Siber Retro.',
      ],
    },
    {
      id: 'use',
      title: 'Penggunaan Perkhidmatan',
      content: [
        'Platform ini bertujuan untuk tujuan pendidikan dan hiburan semata-mata.',
        'Anda bersetuju untuk menggunakan perkhidmatan ini mengikut undang-undang dan peraturan yang berkenaan.',
      ],
    },
    {
      id: 'content',
      title: 'Kandungan Pengguna',
      content: [
        'Anda mengekalkan semua hak ke atas kandungan yang anda hantar ke platform ini.',
        'Dengan menghantar kandungan, anda memberi kami lesen dunia yang tidak eksklusif dan tanpa royalti untuk menggunakannya.',
      ],
    },
  ];
  // End: Terms Data

  // Start: Handle Section Click
  const handleSectionClick = (sectionId: string) => {
    setActiveSection((current) => (current === sectionId ? null : sectionId));
  };
  // End: Handle Section Click

  // Start: Render Terms Page
  return (
    <div className={`rounded border border-gray-300 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900 ${className || ''}`}>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Terma Perkhidmatan</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Semakan ringkas untuk setiap bahagian yang penting dalam platform.</p>
        </div>
        <button onClick={() => router.push('/privacy')} className="retro-btn-secondary px-3 py-2 text-xs">
          Dasar Privasi
        </button>
      </div>

      <div className="space-y-2">
        {termsData.map((section) => {
          const isOpen = activeSection === section.id;
          return (
            <div key={section.id} className="overflow-hidden rounded border border-gray-300 dark:border-gray-700">
              <button
                onClick={() => handleSectionClick(section.id)}
                className="flex w-full items-center justify-between bg-gray-50 px-3 py-2 text-left text-sm font-semibold text-gray-800 dark:bg-gray-800 dark:text-gray-200"
              >
                <span>{section.title}</span>
                <span className="text-xs">{isOpen ? '▾' : '▸'}</span>
              </button>
              <div className={`grid transition-all duration-300 ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                <div className="overflow-hidden">
                  <ul className="space-y-2 px-3 py-3 text-sm text-gray-600 dark:text-gray-400">
                    {section.content.map((paragraph, index) => (
                      <li key={`${section.id}-${index}`}>{paragraph}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
// End: TermsPage Component
