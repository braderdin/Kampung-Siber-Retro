'use client';

// Start: Type Definitions
interface DonateWindowProps {
  title?: string;
  className?: string;
}
// End: Type Definitions

// Start: DonateWindow Component
export default function DonateWindow({ title = 'Penderma', className }: DonateWindowProps) {
  // Start: Render Donation Window
  return (
    <aside className={`retro-window border-2 border-gray-400 bg-white p-4 retro-shadow ${className || ''}`}>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-800">{title}</h3>
        <span className="rounded bg-emerald-100 px-2 py-1 text-[10px] font-semibold text-emerald-700">Selamat</span>
      </div>
      <div className="mb-3 rounded border border-dashed border-gray-300 bg-gray-50 p-3 text-center">
        <div className="mb-2 text-3xl">📱</div>
        <p className="text-xs font-semibold text-gray-700">Imbas kod QR untuk sumbangan</p>
        <p className="mt-1 text-[11px] text-gray-500">Sumbangan membantu mengekalkan kerja bukan untung dan infrastruktur komuniti.</p>
      </div>
      <div className="space-y-2 text-xs text-gray-700">
        <div className="rounded bg-blue-50 p-2">• Pemindahan selamat melalui platform yang dipercayai.</div>
        <div className="rounded bg-amber-50 p-2">• Terima kasih kepada semua penyokong yang menjaga projek.</div>
      </div>
    </aside>
  );
}
// End: DonateWindow Component
