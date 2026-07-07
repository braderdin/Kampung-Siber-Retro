'use client';

// Start: Type Definitions
interface RetroHitCounterProps {
  value: number;
  label?: string;
  className?: string;
}
// End: Type Definitions

// Start: RetroHitCounter Component
export default function RetroHitCounter({ value, label = 'Kaunter Pelawat', className }: RetroHitCounterProps) {
  // Start: Counter Display
  const digits = value.toString().padStart(6, '0').split('');
  // End: Counter Display

  // Start: Render Counter
  return (
    <div className={`rounded border border-gray-300 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-900 ${className || ''}`}>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-700 dark:text-gray-300">{label}</span>
        <span className="rounded bg-emerald-100 px-2 py-1 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">Live</span>
      </div>
      <div className="flex flex-wrap gap-1 rounded bg-black p-2 text-lg font-mono text-emerald-300 shadow-inner">
        {digits.map((digit, index) => (
          <span key={`${digit}-${index}`} className="min-w-6 rounded bg-gray-950 px-2 py-1 text-center shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]">
            {digit}
          </span>
        ))}
      </div>
    </div>
  );
}
// End: RetroHitCounter Component
