// Start: Bento-Box Documentation Grid Primitive (Rule 31 Structural Layout)
import { ReactNode } from "react";

interface BentoCardProps {
  title: string;
  description?: string;
  icon?: string;
  href?: string;
  accent?: "cyan" | "magenta" | "volt";
  span?: "sm" | "md" | "lg";
  children?: ReactNode;
}

const ACCENT_RING: Record<NonNullable<BentoCardProps["accent"]>, string> = {
  cyan: "border-cyan-500/40 hover:border-cyan-300 hover:shadow-[0_0_18px_rgba(0,255,255,0.18)]",
  magenta: "border-pink-500/40 hover:border-pink-300 hover:shadow-[0_0_18px_rgba(255,0,127,0.20)]",
  volt: "border-lime-400/40 hover:border-lime-300 hover:shadow-[0_0_18px_rgba(170,255,0,0.18)]",
};

const SPAN_CLASS: Record<NonNullable<BentoCardProps["span"]>, string> = {
  sm: "md:col-span-1 md:row-span-1",
  md: "md:col-span-2 md:row-span-1",
  lg: "md:col-span-2 md:row-span-2",
};

export function BentoCard({
  title,
  description,
  icon,
  href,
  accent = "cyan",
  span = "sm",
  children,
}: BentoCardProps) {
  const inner = (
    <div
      className={[
        "group h-full rounded-xl border bg-[#0e1330]/80 backdrop-blur-sm p-5 transition-all duration-300",
        "flex flex-col gap-2",
        ACCENT_RING[accent],
      ].join(" ")}
    >
      <div className="flex items-center gap-2">
        {icon ? <span className="text-2xl leading-none">{icon}</span> : null}
        <h3 className="font-pixel text-base tracking-wide text-gray-100">{title}</h3>
      </div>
      {description ? <p className="text-sm text-gray-400 leading-relaxed">{description}</p> : null}
      {children}
      {href ? (
        <span className="mt-auto pt-2 text-xs font-pixel text-cyan-300/80 group-hover:text-cyan-200 transition-colors">
          Buka &rarr;
        </span>
      ) : null}
    </div>
  );

  return (
    <div className={["col-span-1", SPAN_CLASS[span]].join(" ")}>
      {href ? (
        <a href={href} className="block h-full no-underline">
          {inner}
        </a>
      ) : (
        inner
      )}
    </div>
  );
}

export default function BentoGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[minmax(140px,auto)]">{children}</div>
  );
}
// End: Bento-Box Documentation Grid Primitive