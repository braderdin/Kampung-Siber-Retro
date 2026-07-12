'use client';

// Start: Type Definitions
interface TutorialCardProps {
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  completed?: boolean;
  onStart?: () => void;
}
// End: Type Definitions

// Start: TutorialCard Component
export default function TutorialCard({
  title,
  description,
  difficulty,
  category,
  completed = false,
  onStart,
}: TutorialCardProps) {
  // Start: Dynamic Difficulty Badge System
  const getDifficultyConfig = (level: string) => {
    const configs: Record<string, { color: string; icon: string; bg: string; glow: string }> = {
      Beginner: {
        color: '#00ff66',
        icon: '🟢',
        bg: 'bg-emerald-500/20',
        glow: 'shadow-emerald-500/50',
      },
      Intermediate: {
        color: '#ffaa00',
        icon: '🟠',
        bg: 'bg-amber-500/20',
        glow: 'shadow-amber-500/50',
      },
      Advanced: {
        color: '#ff0055',
        icon: '🔴',
        bg: 'bg-rose-500/20',
        glow: 'shadow-rose-500/50',
      },
    };
    return configs[level] || configs.Beginner;
  };

  const config = getDifficultyConfig(difficulty);
  // End: Dynamic Difficulty Badge System

  // Start: Render Tutorial Card
  return (
    <article className="retro-window border-2 border-pink-500 bg-white p-4 retro-shadow transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h4 className="text-sm font-bold text-gray-800">{title}</h4>
        <div className={`flex items-center gap-1 rounded px-2 py-1 text-[10px] font-semibold ${config.bg} border-2`}>
          <span className="text-base">{config.icon}</span>
          <span className="font-bold" style={{ color: config.color }}>{difficulty}</span>
        </div>
      </div>
      <p className="mb-3 text-xs leading-relaxed text-gray-600">{description}</p>
      <div className="mb-3 flex items-center justify-between text-[11px] text-gray-500">
        <span className="rounded bg-gray-100 px-2 py-1">{category}</span>
        <span className="font-semibold text-gray-700">{completed ? 'Selesai' : 'Dalam Siri Tutorial'}</span>
      </div>
      <div className="mb-3 h-2 overflow-hidden rounded-full bg-gray-200">
        <div className={`h-full rounded-full ${completed ? 'w-full bg-emerald-500' : 'w-2/3 bg-sky-500'}`} />
      </div>
      <button onClick={onStart} className="retro-btn-primary w-full px-3 py-2 text-xs">
        {completed ? 'Semak Semula' : 'Mulakan Siri'}
      </button>
    </article>
  );
}
// End: TutorialCard Component
