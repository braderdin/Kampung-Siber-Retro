// Start: Community Hub Consolidation (Phase 1 - Activity/Search/Browse/Guestbook/Cyber-Cafe)
"use client";

import { useEffect, useState, Suspense, type ChangeEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TabRail, { RailTab } from "@/components/ui/TabRail";
import NeonCard from "@/components/ui/NeonCard";

import LiveActivityFeed, { ActivityEntry } from "@/components/LiveActivityFeed";
import CommunityInteraction from "@/components/CommunityInteraction";
import ProfileUpdateBox from "@/components/ProfileUpdateBox";
import GuestbookComponent from "@/components/GuestbookComponent";
import PixelGameCanvas from "@/components/PixelGameCanvas";
import ArcadeLeaderboard from "@/components/ArcadeLeaderboard";
import { NeonInput } from "@/components/ui/NeonInput";
import NeonButton from "@/components/ui/NeonButton";

const HUB_TABS: RailTab[] = [
  { id: "activity", label: "Aktiviti", icon: "📊" },
  { id: "search", label: "Carian", icon: "🔍" },
  { id: "browse", label: "Lihat", icon: "🛒" },
  { id: "guestbook", label: "Buku Pelawat", icon: "📘" },
  { id: "cyber-cafe", label: "Kafe Siber", icon: "🎮" },
];

function ActivityPanel() {
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [username] = useState("Pengguna");

  const fetchFeed = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/activity");
      const data = (await res.json()) as { success: boolean; data?: ActivityEntry[]; error?: string };
      if (data.success && data.data) setActivities(data.data);
      else setError(data.error || "Gagal memuat aliran aktiviti");
    } catch {
      setError("Gagal memuat aliran aktiviti");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
    const interval = setInterval(fetchFeed, 30000);
    return () => clearInterval(interval);
  }, []);

  const tone: Record<ActivityEntry["type"], string> = {
    code: "border-cyan-500/50 bg-cyan-500/5 text-cyan-200",
    join: "border-lime-400/50 bg-lime-400/5 text-lime-200",
    leave: "border-amber-400/50 bg-amber-400/5 text-amber-200",
    update: "border-pink-500/50 bg-pink-500/5 text-pink-200",
  };

  return (
    <div className="space-y-4">
      <NeonCard title="Kemas Kini Profil" icon="📝" accent="cyan">
        <ProfileUpdateBox username={username} />
      </NeonCard>
      <NeonCard title="Interaksi Komuniti" icon="💬" accent="magenta">
        <CommunityInteraction username={username} />
      </NeonCard>
      <NeonCard title="Aliran Aktiviti" icon="📊" accent="volt">
        {loading ? (
          <p className="text-sm text-gray-400">Memuat aliran aktiviti...</p>
        ) : error ? (
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-red-300">{error}</p>
            <NeonButton size="sm" variant="secondary" onClick={fetchFeed}>Cuba Semula</NeonButton>
          </div>
        ) : activities.length === 0 ? (
          <p className="text-sm text-gray-400">Tiada aktiviti terkini</p>
        ) : (
          <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
            {activities.map((entry) => (
              <div key={entry.id} className={`rounded border-l-4 p-3 ${tone[entry.type]}`}>
                <div className="flex items-center justify-between">
                  <span className="font-pixel text-xs truncate">{entry.user}</span>
                  <span className="text-xs opacity-70 flex-shrink-0">{new Date(entry.timestamp).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                </div>
                <p className="mt-1 text-sm truncate">{entry.action}</p>
              </div>
            ))}
          </div>
        )}
      </NeonCard>
    </div>
  );
}

function SearchPanel() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const router = useRouter();

  const runSearch = (q: string) => {
    setQuery(q);
    if (q.trim().length > 2) {
      setResults([`Laman: ${q}`, `Aset: ${q}`, `Tutorial: ${q}`]);
    } else {
      setResults([]);
    }
  };

  return (
    <NeonCard title="Carian Global" icon="🔍" accent="cyan">
      <div className="space-y-3">
        <NeonInput
          icon="🔍"
          placeholder="Cari laman, aset, atau tutorial..."
          value={query}
          onChange={(e: ChangeEvent<HTMLInputElement>) => runSearch(e.target.value)}
        />
        {query.trim().length > 2 ? (
          <div className="space-y-2">
            {results.map((r) => (
              <button
                key={r}
                onClick={() => router.push("/browse")}
                className="block w-full text-left rounded-md border border-white/5 bg-[#060814]/60 px-3 py-2 text-sm text-gray-200 hover:border-cyan-400/50 hover:shadow-[0_0_12px_rgba(0,255,255,0.15)] transition-all"
              >
                {r}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">Taip sekurang-kurangnya 3 aksara untuk mencari.</p>
        )}
      </div>
    </NeonCard>
  );
}

function BrowsePanel() {
  const router = useRouter();
  const items = [
    { title: "Tutorial Asas HTML", tag: "tutorial", href: "/tutorials" },
    { title: "Aet Piksel Retro", tag: "asset", href: "/asset-store" },
    { title: "Projek Komuniti", tag: "project", href: "/directory" },
  ];
  return (
    <NeonCard title="Lihat Sumber" icon="🛒" accent="volt">
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <button
            key={item.title}
            onClick={() => router.push(item.href)}
            className="rounded-md border border-cyan-500/30 bg-[#060814]/60 p-4 text-left hover:border-cyan-300 hover:shadow-[0_0_12px_rgba(0,255,255,0.15)] transition-all"
          >
            <span className="font-pixel text-sm text-cyan-200">{item.title}</span>
            <span className="block mt-1 text-xs text-gray-400">#{item.tag}</span>
          </button>
        ))}
      </div>
    </NeonCard>
  );
}

function GuestbookPanel() {
  return (
    <NeonCard title="Buku Pelawat Retro" icon="📘" accent="magenta">
      <GuestbookComponent className="w-full" />
    </NeonCard>
  );
}

function CyberCafePanel() {
  const [score, setScore] = useState(0);
  const [active, setActive] = useState<"games" | "chat">("games");
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <NeonButton size="sm" variant={active === "games" ? "primary" : "ghost"} onClick={() => setActive("games")}>🎮 Games</NeonButton>
        <NeonButton size="sm" variant={active === "chat" ? "primary" : "ghost"} onClick={() => setActive("chat")}>💬 Chat</NeonButton>
      </div>
      {active === "games" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 rounded-lg border border-cyan-500/30 bg-[#0e1330]/80 p-4">
            <h3 className="font-pixel text-cyan-200 mb-2">🕹️ Brick Breaker</h3>
            <PixelGameCanvas className="w-full" onScoreUpdate={setScore} onGameOver={(s) => setScore(s)} />
          </div>
          <ArcadeLeaderboard gameId="retro-pong" />
        </div>
      ) : (
        <NeonCard title="Siber Chat Room" icon="💬" accent="magenta">
          <p className="text-sm text-gray-400">Selamat datang ke kafe siber! Main game atau chat dengan rakan.</p>
        </NeonCard>
      )}
    </div>
  );
}

function HubInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [active, setActive] = useState<string>("activity");

  useEffect(() => {
    const tab = searchParams?.get("tab");
    if (tab && HUB_TABS.some((t) => t.id === tab)) setActive(tab);
  }, [searchParams]);

  const handleTab = (id: string) => {
    setActive(id);
    router.replace(`/hub?tab=${id}`, { scroll: false });
  };

  return (
    <main className="min-h-screen bg-[#060814] text-gray-100 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-pixel text-cyan-300 tracking-wide">Hab Komuniti</h1>
          <p className="text-sm text-gray-400 mt-1">Satu pengalaman bersepadu untuk aktiviti, carian, lihat, buku pelawat, dan kafe siber.</p>
        </header>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:sticky md:top-20 md:self-start">
            <TabRail tabs={HUB_TABS} active={active} onChange={handleTab} />
          </div>
          <div className="flex-1 min-w-0">
            {active === "activity" && <ActivityPanel />}
            {active === "search" && <SearchPanel />}
            {active === "browse" && <BrowsePanel />}
            {active === "guestbook" && <GuestbookPanel />}
            {active === "cyber-cafe" && <CyberCafePanel />}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function HubPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#060814] flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-400" /></div>}>
      <HubInner />
    </Suspense>
  );
}
// End: Community Hub Consolidation
