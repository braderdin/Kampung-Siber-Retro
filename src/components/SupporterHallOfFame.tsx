'use client';

// Start: Type Definitions
interface SupporterHallOfFameProps {
  supporters: Array<{
    id: number;
    name: string;
    role: string;
    contribution: string;
    avatar: string;
    verified?: boolean;
  }>;
}
// End: Type Definitions

// Start: SupporterHallOfFame Component
export default function SupporterHallOfFame({ supporters }: SupporterHallOfFameProps) {
  // Start: Render Supporter List
  return (
    <section className="space-y-3">
      {supporters.map((supporter) => (
        <div key={supporter.id} className="retro-window border-2 border-gray-400 bg-white p-3 retro-shadow">
          <div className="flex items-start gap-3">
            <div className="text-2xl">{supporter.avatar}</div>
            <div className="flex-1">
              <div className="mb-1 flex items-center gap-2">
                <h4 className="text-sm font-bold text-gray-800">{supporter.name}</h4>
                {supporter.verified ? <span className="text-[11px] text-blue-600">✓ Disahkan</span> : null}
              </div>
              <p className="mb-1 font-mono text-[11px] text-gray-600">{supporter.role}</p>
              <p className="text-xs text-gray-500">{supporter.contribution}</p>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
// End: SupporterHallOfFame Component
