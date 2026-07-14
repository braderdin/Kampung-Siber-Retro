// Start: Imports
"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useLanguageStore } from "@/store/useLanguageStore";
import { enDictionary, msDictionary } from "@/i18n/dictionaries";
import FooterLinks from "./footer-links";
// End: Imports

// Start: Type Definitions
interface RetroFooterProps {
  className?: string;
}
// End: Type Definitions

// Start: Legal Routes Configuration (directory-tree anchors)
const LEGAL_ROUTES = [
  { name: "~/privacy", href: "/privacy", label: "Privasi" },
  { name: "~/terms", href: "/terms", label: "Terma" },
  { name: "~/status", href: "/status", label: "System Status" },
  { name: "~/sitemap", href: "/sitemap", label: "Peta Laman" },
];
// End: Legal Routes Configuration

// Start: Retro Pixel Badges (malap-glowing)
const PIXEL_BADGES = [
  "100% PURE HTML",
  "MADE FOR NETSCAPE",
  "NO-ALGO ZONE",
  "RSS 1.0 READY",
  "BEST VIEWED @ 800x600",
];
// End: Retro Pixel Badges

// Start: RetroFooter Component (Premium Cyber-Console Aesthetic)
export default function RetroFooter({ className }: RetroFooterProps) {
  const router = useRouter();
  const { language } = useLanguageStore();
  const t = language === "ms" ? msDictionary : enDictionary;

  // Start: Get Sectioned Footer Links
  const sections = FooterLinks();
  // End: Get Sectioned Footer Links

  // Start: Handle Navigation (SPA-friendly)
  const handleNavigation = (href: string) => {
    router.push(href);
  };
  // End: Handle Navigation

  // Start: Rebrand section titles into retro directory trees
  const rebrandTitle = (raw: string): string => {
    const map: Record<string, string> = {
      [t.dashboardTitle]: "~/dashboard",
      [t.settings]: "~/hub/settings",
      Community: "~/hub/community",
    };
    return map[raw] ?? `~/docs/${raw.toLowerCase().replace(/\s+/g, "-")}`;
  };
  // End: Rebrand section titles

  // Start: Render RetroFooter
  return (
    <footer
      className={`relative w-full ${className || ""}`}
      style={{
        background:
          "linear-gradient(180deg, #060814 0%, #0e1330 100%)",
        borderTop: "1px solid #ff007f",
        boxShadow: "0 -1px 24px rgba(255, 0, 127, 0.35), inset 0 1px 0 rgba(0, 255, 255, 0.12)",
      }}
    >
      {/* Start: Console Header Bar */}
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-3 flex items-center justify-between"
        style={{ borderBottom: "1px solid rgba(0, 255, 255, 0.15)" }}
      >
        <div className="flex items-center gap-2 font-mono text-[11px] sm:text-xs text-[#00ffff]">
          <span className="text-[#aaff00]">root@kampung-siber</span>
          <span className="text-white/40">:</span>
          <span className="text-[#ff007f]">~</span>
          <span className="text-white/40">$</span>
          <span className="text-white/70">footer --render --console</span>
          <motion.span
            aria-hidden
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="text-[#00ffff]"
          >
            █
          </motion.span>
        </div>
        <div className="hidden sm:block font-mono text-[10px] text-white/30">
          v0.1.0 // RETRO-MODERN
        </div>
      </div>
      {/* End: Console Header Bar */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Start: Cyber Grid Console Panel */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-px rounded-lg overflow-hidden"
          style={{
            background: "rgba(0, 255, 255, 0.10)",
            border: "1px solid rgba(0, 255, 255, 0.18)",
          }}
        >
          {sections.map((section) => (
            <div
              key={section.title}
              className="p-5"
              style={{ background: "#060814" }}
            >
              <h4
                className="font-mono text-sm font-semibold mb-4 tracking-tight"
                style={{ color: "#00ffff", textShadow: "0 0 8px rgba(0,255,255,0.55)" }}
              >
                {rebrandTitle(section.title)}
              </h4>
              <ul className="space-y-1.5 font-mono text-[13px]">
                {section.links.map((link, idx) => {
                  const isLast = idx === section.links.length - 1;
                  return (
                    <li key={link.href}>
                      <button
                        onClick={() => handleNavigation(link.href)}
                        className="group flex items-center gap-2 w-full text-left transition-colors"
                        style={{ color: "rgba(255,255,255,0.62)" }}
                      >
                        <span className="text-[#ff007f] select-none">
                          {isLast ? "└─" : "├─"}
                        </span>
                        <span className="group-hover:text-[#aaff00] group-hover:underline decoration-dotted underline-offset-4">
                          {link.name}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
        {/* End: Cyber Grid Console Panel */}

        {/* Start: Legal Routing Anchors + Live System Status */}
        <div
          className="mt-8 pt-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          style={{ borderTop: "1px solid rgba(0, 255, 255, 0.12)" }}
        >
          <div className="flex flex-wrap gap-2.5">
            {LEGAL_ROUTES.map((route) => {
              const isStatus = route.href === "/status";
              return (
                <button
                  key={route.href}
                  onClick={() => handleNavigation(route.href)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded font-mono text-[11px] transition-all"
                  style={{
                    border: "1px solid rgba(0,255,255,0.25)",
                    color: isStatus ? "#aaff00" : "rgba(255,255,255,0.6)",
                    background: "rgba(14,19,48,0.6)",
                  }}
                >
                  {isStatus && (
                    <motion.span
                      aria-hidden
                      className="inline-block rounded-full"
                      style={{ width: 8, height: 8, background: "#aaff00" }}
                      animate={{ opacity: [1, 0.25, 1], scale: [1, 1.25, 1] }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                    />
                  )}
                  <span>{route.name}</span>
                </button>
              );
            })}
          </div>
          <p className="font-mono text-[11px] text-white/40">
            &copy; {new Date().getFullYear()} Kampung Siber Retro
          </p>
        </div>
        {/* End: Legal Routing Anchors */}

        {/* Start: Malap-Glowing Pixel Badges Row */}
        <div className="mt-6 flex flex-wrap justify-center gap-2.5">
          {PIXEL_BADGES.map((badge) => (
            <span
              key={badge}
              className="px-2.5 py-1 rounded-sm font-mono text-[10px] tracking-wider uppercase select-none"
              style={{
                color: "rgba(0,255,255,0.45)",
                border: "1px solid rgba(0,255,255,0.18)",
                background: "rgba(6,8,20,0.7)",
                textShadow: "0 0 4px rgba(0,255,255,0.25)",
              }}
            >
              {badge}
            </span>
          ))}
        </div>
        {/* End: Malap-Glowing Pixel Badges Row */}
      </div>
    </footer>
  );
}
// End: RetroFooter Component (Premium Cyber-Console Aesthetic)