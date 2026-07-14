// Start: Premium Neon Button Primitive (Rule 31 Brand Compliance)
"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";

type NeonVariant = "primary" | "secondary" | "ghost" | "danger";
type NeonSize = "sm" | "md" | "lg";

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: NeonVariant;
  size?: NeonSize;
  icon?: string;
}

const VARIANT_CLASSES: Record<NeonVariant, string> = {
  primary:
    "border-cyan-400/60 text-cyan-200 bg-cyan-500/10 hover:bg-cyan-500/20 hover:border-cyan-300 hover:shadow-[0_0_15px_rgba(0,255,255,0.35)]",
  secondary:
    "border-pink-500/50 text-pink-200 bg-pink-500/5 hover:bg-pink-500/15 hover:border-pink-400 hover:shadow-[0_0_15px_rgba(255,0,127,0.30)]",
  ghost:
    "border-transparent text-gray-300 bg-transparent hover:text-white hover:bg-white/5",
  danger:
    "border-red-500/60 text-red-200 bg-red-500/10 hover:bg-red-500/20 hover:border-red-400 hover:shadow-[0_0_15px_rgba(239,68,68,0.35)]",
};

const SIZE_CLASSES: Record<NeonSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

const NeonButton = forwardRef<HTMLButtonElement, NeonButtonProps>(
  ({ variant = "primary", size = "md", icon, className = "", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={[
          "retro-btn font-pixel tracking-wide rounded-md border transition-all duration-200",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 focus-visible:ring-offset-0",
          "active:scale-95 hover:scale-[1.02] inline-flex items-center justify-center gap-2",
          "disabled:opacity-50 disabled:pointer-events-none",
          VARIANT_CLASSES[variant],
          SIZE_CLASSES[size],
          className,
        ].join(" ")}
        {...props}
      >
        {icon ? <span className="text-base leading-none">{icon}</span> : null}
        {children}
      </button>
    );
  }
);

NeonButton.displayName = "NeonButton";
export default NeonButton;
// End: Premium Neon Button Primitive