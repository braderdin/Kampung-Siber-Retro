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
  const milestone = value >= 20000 ? 'Tahap cemerlang' : value >= 10000 ? 'Pertumbuhan aktif' : 'Penerokaan baharu';
  // End: Counter Display

  // Start: Render Counter
  return (
    <div className={`rounded border border-slate-300 bg-white p-3 shadow-sm transition-all duration-200 dark:border-slate-700 dark:bg-slate-900 ${className || ''}`}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-700 dark:text-slate-300">{label}</span>
        <span className="rounded bg-emerald-100 px-2 py-1 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">Live</span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-1 rounded bg-black p-2 text-lg font-mono text-emerald-300 shadow-inner">
          {digits.map((digit, index) => (
              <span key={`${digit}-${index}`} className="min-w-6 rounded bg-slate-950 px-2 py-1 text-center" style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)' }}>
              {digit}
            </span>
          ))}
        </div>
        <div className="rounded border border-emerald-200 bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
          {milestone}
        </div>
      </div>
    </div>
  );
}
// End: RetroHitCounter Component
