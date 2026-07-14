// Start: Vertical Navigation Rail for Tabbed Experiences (Rule 31)
"use client";

import { ReactNode } from "react";

export interface RailTab {
  id: string;
  label: string;
  icon: string;
}

interface TabRailProps {
  tabs: RailTab[];
  active: string;
  onChange: (id: string) => void;
  orientation?: "vertical" | "horizontal";
}

export default function TabRail({ tabs, active, onChange, orientation = "vertical" }: TabRailProps) {
  const isVertical = orientation === "vertical";
  return (
    <nav
      role="tablist"
      aria-orientation={orientation}
      className={[
        "flex gap-1 p-1 rounded-lg border border-white/5 bg-[#060814]/80 backdrop-blur-sm",
        isVertical ? "flex-col w-full md:w-56" : "flex-row overflow-x-auto md:flex-wrap md:overflow-visible",
      ].join(" ")}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={[
              "retro-tab-button font-pixel text-xs sm:text-sm tracking-wide rounded-md px-3 py-2.5",
              "flex items-center gap-2 transition-all duration-200 whitespace-nowrap",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60",
              isActive
                ? "bg-cyan-500/15 text-cyan-200 border border-cyan-400/50 shadow-[0_0_12px_rgba(0,255,255,0.20)]"
                : "text-gray-400 border border-transparent hover:text-white hover:bg-white/5",
            ].join(" ")}
          >
            <span className="text-base leading-none">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
// End: Vertical Navigation Rail