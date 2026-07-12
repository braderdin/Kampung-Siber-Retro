"use client";

import { useState, useRef, useEffect } from 'react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

const TERMS_TEXT = `KAMPUNG SIBER RETRO - SYARAT PENGGUNAAN

Selamat datang ke Kampung Siber Retro! Syarat-syarat ini menggambarkan dasar penggunaan platform kami. Dengan menerima syarat ini, anda bersetuju dengan kebijakan kami.

1. PENGGUNAAN PLATFORM
Platform ini adalah ruangan secara digital untuk para warga kampung siber untuk berkarya, berkomunikasi, dan bersama-sama membangun komuniti. Semua aktiviti yang dilakukan pengguna adalah secara bebas dan tanpa pendedahan pada data peribadi.

2. KESELAMATAN DATA
Kami menghargai privasi anda. Semua data yang disimpan adalah dalam bentuk yang tidak terbaca langsung dan tidak akan diserahkan kepada pihak ketiga tanpa kebenaran anda.

3. KOMUNITI DAN RESPECT
Anda diwajibkan untuk menghormati semua warga lain, tidak terlibat dalam aktiviti yang tidak baik, dan majukan budaya positif dalam komuniti.

4. AKSES KE DALAM
Platform kami mengandungi banyak sumber dan ciri-ciri yang tidak tersedia untuk semua pengguna. Akses ke ciri-ciri khusus bergantung pada tahap reputasi pengguna.

5. PENGUBAH SYARAT
Kami berhak mengubah syarat-syarat penggunaan ini sewaktu-waktu dengan memberi notis kepada pengguna.

6. HAK KAMI
Kami memiliki hak untuk menghapuskan akaun atau mengecualikan aktiviti pengguna yang melanggar syarat-syarat ini.

7. TINDAKAN PENGUSAHAAN
Dengan menggunakan platform ini, anda bersetuju kepada log audit untuk keselamatan dan pemboleh bhala.

SILAKAN BACA DENGAN SEKAT:
Dengan menerima syarat ini, anda bersetuju untuk menggunakan Kampung Siber Retro mengikut dasar-dasar yang telah ditetapkan di atas.`;

export default function TermsModal({ isOpen, onClose, onAccept }: TermsModalProps) {
  const [scrollTop, setScrollTop] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (modalRef.current) {
        setScrollTop(modalRef.current.scrollTop);
      }
    };

    if (isOpen && modalRef.current) {
      modalRef.current.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (modalRef.current) {
        modalRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, [isOpen]);

  const handleAccept = () => {
    localStorage.setItem('terms_accepted', 'true');
    onAccept();
  };

  const handleDecline = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-md">
      <div 
        ref={modalRef}
        className="bg-white dark:bg-gray-900 w-full max-w-2xl max-h-[90vh] flex flex-col rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700"
      >
        {/* Start: Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 retro-card-header">
          <h2 className="pixel-font text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <span className="text-xl">📜</span>
            Syarat Penggunaan
          </h2>
          <button
            onClick={handleDecline}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
          >
            ✕
          </button>
        </div>
        {/* End: Modal Header */}

        {/* Start: Modal Content */}
        <div 
          ref={contentRef}
          className="flex-1 overflow-y-auto p-4 sm:p-6"
        >
          <div className="prose dark:prose-invert max-w-none">
            <pre className="pixel-font text-sm whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
              {TERMS_TEXT}
            </pre>
          </div>
        </div>
        {/* End: Modal Content */}

        {/* Start: Modal Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex justify-end gap-2 retro-card-footer">
          <button
            onClick={handleDecline}
            className="px-4 py-2 text-sm pixel-font text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Tolak
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 text-sm pixel-font text-white bg-cyan-500 hover:bg-cyan-600 rounded transition-colors flex items-center gap-1"
          >
            <span className="text-lg">✓</span>
            Terima
          </button>
        </div>
        {/* End: Modal Footer */}
      </div>
    </div>
  );
}
