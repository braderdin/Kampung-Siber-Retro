// Start: Premium Neon Input + Textarea Primitive (Rule 31 Brand Compliance)
"use client";

import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";

interface NeonInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: string;
}

interface NeonTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const NeonInput = forwardRef<HTMLInputElement, NeonInputProps>(
  ({ label, icon, className = "", id, ...props }, ref) => {
    const inputId = id || props.name || `neon-input-${Math.random().toString(36).slice(2, 8)}`;
    return (
      <div className="w-full">
        {label ? (
          <label htmlFor={inputId} className="block text-xs font-pixel text-cyan-200/80 mb-1 tracking-wide">
            {label}
          </label>
        ) : null}
        <div className="relative flex items-center">
          {icon ? <span className="absolute left-3 text-cyan-300/70 text-sm pointer-events-none">{icon}</span> : null}
          <input
            ref={ref}
            id={inputId}
            className={[
              "retro-input w-full rounded-md bg-[#0e1330] border border-cyan-500/30 text-gray-100 placeholder:text-gray-500",
              "px-3 py-2 text-sm transition-all duration-200 focus:outline-none",
              "focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40 focus:shadow-[0_0_15px_rgba(0,255,255,0.15)]",
              icon ? "pl-9" : "",
              className,
            ].join(" ")}
            {...props}
          />
        </div>
      </div>
    );
  }
);
NeonInput.displayName = "NeonInput";

export const NeonTextarea = forwardRef<HTMLTextAreaElement, NeonTextareaProps>(
  ({ label, className = "", id, ...props }, ref) => {
    const inputId = id || props.name || `neon-textarea-${Math.random().toString(36).slice(2, 8)}`;
    return (
      <div className="w-full">
        {label ? (
          <label htmlFor={inputId} className="block text-xs font-pixel text-cyan-200/80 mb-1 tracking-wide">
            {label}
          </label>
        ) : null}
        <textarea
          ref={ref}
          id={inputId}
          className={[
            "retro-input w-full rounded-md bg-[#0e1330] border border-cyan-500/30 text-gray-100 placeholder:text-gray-500",
            "px-3 py-2 text-sm transition-all duration-200 focus:outline-none resize-y min-h-[96px]",
            "focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40 focus:shadow-[0_0_15px_rgba(0,255,255,0.15)]",
            className,
          ].join(" ")}
          {...props}
        />
      </div>
    );
  }
);
NeonTextarea.displayName = "NeonTextarea";
// End: Premium Neon Input + Textarea Primitive