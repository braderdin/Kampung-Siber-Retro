// Start: Premium Neon Card Primitive (Rule 31 1px Border Grid)
import { ReactNode } from "react";

interface NeonCardProps {
  title?: string;
  icon?: string;
  accent?: "cyan" | "magenta" | "volt";
  className?: string;
  bodyClassName?: string;
  children?: ReactNode;
  onClick?: () => void;
}

const ACCENT_BORDER: Record<NonNullable<NeonCardProps["accent"]>, string> = {
  cyan: "border-cyan-500/40 hover:border-cyan-300 hover:shadow-[0_0_15px_rgba(0,255,255,0.15)]",
  magenta: "border-pink-500/40 hover:border-pink-300 hover:shadow-[0_0_15px_rgba(255,0,127,0.20)]",
  volt: "border-lime-400/40 hover:border-lime-300 hover:shadow-[0_0_15px_rgba(170,255,0,0.18)]",
};

export default function NeonCard({
  title,
  icon,
  accent = "cyan",
  className = "",
  bodyClassName = "",
  children,
  onClick,
}: NeonCardProps) {
  return (
    <div
      onClick={onClick}
      className={[
        "rounded-lg border bg-[#0e1330]/80 backdrop-blur-sm transition-all duration-200",
        ACCENT_BORDER[accent],
        onClick ? "cursor-pointer active:scale-[0.99]" : "",
        className,
      ].join(" ")}
    >
      {title ? (
        <div className="flex items-center gap-2 border-b border-white/5 px-4 py-2.5">
          {icon ? <span className="text-lg leading-none">{icon}</span> : null}
          <h3 className="font-pixel text-sm tracking-wide text-gray-100">{title}</h3>
        </div>
      ) : null}
      <div className={`p-4 ${bodyClassName}`}>{children}</div>
    </div>
  );
}
// End: Premium Neon Card Primitive