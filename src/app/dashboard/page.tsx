// Start: Dashboard Page — Cyber-Village Retro-Modern Overhaul (Rule 31)
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguageStore } from "@/store/useLanguageStore";
import { enDictionary, msDictionary } from "@/lib/dictionary";
import Shoutbox from "@/components/Shoutbox";
import RetroCalendar from "@/components/RetroCalendar";
import VisitorStatGraph from "@/components/VisitorStatGraph";
import RetroMarqueeTicker from "@/components/RetroMarqueeTicker";
import TopResidentsLeaderboard from "@/components/TopResidentsLeaderboard";
import HydrationGuard from "@/components/HydrationGuard";
import FeedbackWidget from "@/components/FeedbackWidget";
import NeocitiesWorkspace from "@/components/editor/NeocitiesWorkspace";
import FileManager from "@/components/FileManager";
import NeonCard from "@/components/ui/NeonCard";
import NeonButton from "@/components/ui/NeonButton";
import DashboardSidebar from "@/components/DashboardSidebar";

type ActiveTab = "main" | "community" | "files";
type BuilderView = "main" | "editor";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("main");
  const [builderView, setBuilderView] = useState<BuilderView>("main");
  const [showMarquee, setShowMarquee] = useState(false);
  const { language } = useLanguageStore();
  const t = language === "ms" ? msDictionary : enDictionary;

  // Start: Toggle to live profile builder sub-view
  const toggleBuilderView = () => {
    setBuilderView((prev) => (prev === "main" ? "editor" : "main"));
  };
  // End: Toggle to live profile builder sub-view

  // Start: Marquee Auto-Show Effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMarquee(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
  // End: Marquee Auto-Show Effect

  // Start: Tab Toggle Handler
  const handleTabToggle = () => {
    setActiveTab((prev) => (prev === "main" ? "community" : "main"));
  };
  // End: Tab Toggle Handler

  return (
    // Start: Main Dashboard Container — pitch-black Cyber-Village canvas
    <main className="min-h-screen bg-[#060814] text-gray-100 transition-colors duration-300">
      {/* Start: Top Navigation Toolbar with Sitemap + Sidebar hook */}
      <div className="sticky top-0 z-50 border-b border-cyan-500/20 bg-[#0e1330]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <h2 className="font-pixel text-base font-bold text-cyan-200 sm:text-lg">
              {t.dashboardTitle || "Dashboard"}
            </h2>
          </div>
          <Link
            href="/sitemap"
            className="retro-btn-secondary flex items-center gap-2 rounded-md border border-cyan-400/40 bg-cyan-500/10 px-4 py-2 font-pixel text-xs text-cyan-200 transition-all hover:border-cyan-300 hover:shadow-[0_0_15px_rgba(0,255,255,0.30)] sm:text-sm"
          >
            <span className="text-base">🗺️</span>
            <span>{t.sitemapTitle || "Peta Laman"}</span>
          </Link>
        </div>
      </div>
      {/* End: Top Navigation Toolbar */}

      {/* Start: Marquee Ticker */}
      {showMarquee && (
        <div className="fixed left-0 right-0 top-14 z-40">
          <RetroMarqueeTicker
            messages={[
              "🚀 Selamat datang di Kampung Siber Retro Dashboard!",
              "🌟 Kunjungi komuniti kami untuk berkongsi idea dan projek.",
              "🔧 Kami sentiasa memperbarui platform dengan ciri-ciri baru.",
            ]}
            speed={15}
          />
        </div>
      )}
      {/* End: Marquee Ticker */}

      {/* Start: Dashboard Header + Sidebar Grid */}
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        {/* Start: Editor Link Header */}
        <div className="mb-6">
          <h1 className="font-pixel text-2xl font-bold text-gray-50 sm:text-3xl">
            {t.dashboardTitle}
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            {t.welcomeMessage || "Selamat datang di papan pengarah retro anda!"}
          </p>
          <div className="mt-4">
            <NeonButton
              size="lg"
              variant="primary"
              icon="💻"
              onClick={toggleBuilderView}
            >
              {builderView === "main"
                ? "Buka Editor Kod Teratak Anda"
                : "Tutup Editor Kod"}
            </NeonButton>
          </div>

          {/* Start: Live Neocities Web Interactive Workspace Sub-View */}
          {builderView === "editor" && (
            <div className="mt-6">
              <NeonCard title="Editor Kod Teratak" icon="💻" accent="cyan">
                <NeocitiesWorkspace />
              </NeonCard>
            </div>
          )}
          {/* End: Live Neocities Web Interactive Workspace Sub-View */}
        </div>
        {/* End: Editor Link Header */}

        {/* Start: Sidebar + Content two-column layout (fluid on mobile) */}
        <div className="grid grid-cols-1 gap-6 pb-8 lg:grid-cols-[220px_1fr]">
          {/* Start: Sidebar column */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <NeonCard title="Navigasi" icon="🧭" accent="volt">
              <DashboardSidebar />
            </NeonCard>
          </aside>
          {/* End: Sidebar column */}

          {/* Start: Main content column */}
          <div className="min-w-0 space-y-6">
            {/* Start: Tab Navigation with Neon triggers */}
            <div className="flex flex-wrap gap-2">
              <NeonButton
                size="sm"
                variant={activeTab === "main" ? "primary" : "ghost"}
                icon="🏠"
                onClick={() => setActiveTab("main")}
              >
                Main View
              </NeonButton>
              <NeonButton
                size="sm"
                variant={activeTab === "community" ? "primary" : "ghost"}
                icon="👥"
                onClick={() => setActiveTab("community")}
              >
                Community Board
              </NeonButton>
              <NeonButton
                size="sm"
                variant={activeTab === "files" ? "primary" : "ghost"}
                icon="📁"
                onClick={() => setActiveTab("files")}
              >
                Fail Saya
              </NeonButton>
            </div>
            {/* End: Tab Navigation */}

            {/* Start: Tab Content clusters */}
            {activeTab === "main" && (
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <NeonCard title="Status Sedia" icon="📡" accent="cyan">
                  <p className="font-pixel text-sm text-gray-400">
                    {t.dashboardReady ||
                      "Dashboard bersedia menerima data berasal daripada pengguna"}
                  </p>
                </NeonCard>
                <NeonCard title="Kalendar Retro" icon="📅" accent="magenta">
                  <RetroCalendar />
                </NeonCard>
                <NeonCard title="Statistik Pelawat" icon="📈" accent="volt">
                  <VisitorStatGraph />
                </NeonCard>
                <NeonCard title="Penduduk Teratas" icon="🏆" accent="cyan">
                  <TopResidentsLeaderboard />
                </NeonCard>
              </div>
            )}

            {activeTab === "community" && (
              <NeonCard title="Papan Komuniti" icon="💬" accent="magenta">
                <Shoutbox />
              </NeonCard>
            )}

            {activeTab === "files" && (
              <NeonCard title="Pengurus Fail" icon="📁" accent="volt">
                <FileManager embedded />
              </NeonCard>
            )}
            {/* End: Tab Content clusters */}
          </div>
          {/* End: Main content column */}
        </div>
        {/* End: Sidebar + Content two-column layout */}
      </div>
      {/* End: Dashboard Header + Sidebar Grid */}

      {/* Start: Feedback Widget — fixed bottom-right */}
      <div className="fixed bottom-6 right-6 z-40">
        <FeedbackWidget />
      </div>
      {/* End: Feedback Widget */}
    </main>
    // End: Main Dashboard Container
  );
}
// End: Dashboard Page — Cyber-Village Retro-Modern Overhaul (Rule 31)