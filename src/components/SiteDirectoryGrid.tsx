'use client';

// Start: Type Definitions
interface SiteDirectoryGridProps {
  sites: Array<{
    id: string;
    title: string;
    description: string;
    tags: string[];
    href: string;
  }>;
  className?: string;
}
// End: Type Definitions

// Start: SiteDirectoryGrid Component
export default function SiteDirectoryGrid({ sites, className }: SiteDirectoryGridProps) {
  // Start: Render Grid
  return (
    <div className={`grid gap-3 md:grid-cols-2 xl:grid-cols-3 ${className || ''}`}>
      {sites.map((site) => (
        <a
          key={site.id}
          href={site.href}
          rel="noreferrer"
          className="rounded border border-slate-300 bg-white p-4 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
        >
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{site.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">{site.description}</p>
            </div>
            <span className="rounded bg-amber-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
              Penjelajah Laman
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {site.tags.map((tag) => (
              <span key={tag} className="rounded bg-slate-100 px-2 py-1 text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                #{tag}
              </span>
            ))}
          </div>
        </a>
      ))}
    </div>
  );
}
// End: SiteDirectoryGrid Component
