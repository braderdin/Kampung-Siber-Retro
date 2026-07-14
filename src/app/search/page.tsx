"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import useDebounce from "@/hooks/useDebounce";
import HumanFeedbackToast from "@/components/HumanFeedbackToast";
import ModernRetroCard from "@/components/ModernRetroCard";
import TutorialCard from "@/components/TutorialCard";
import { supabase } from "@/lib/supabase";
import type { ProfileRow } from "@/lib/profile-types";

interface SearchPageProps {
  className?: string;
}

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: "tutorial" | "asset" | "project" | "page";
  url: string;
  tags: string[];
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
  category?: string;
  completed?: boolean;
}

export default function SearchPage({ className }: SearchPageProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const router = useRouter();

  const debouncedQuery = useDebounce(query, { delay: 300 });

  // Start: Live Resident Directory Search (Supabase-backed)
  // Wires the global query hub directly to the resident profiles table so
  // search hits render live cyber-village residents instead of mock data.
  const handleSearch = async (searchQuery: string) => {
    const term = searchQuery.trim();
    if (!term) {
      setResults([]);
      setToast(null);
      return;
    }

    setLoading(true);
    try {
      const likeTerm = `%${term}%`;
      const { data, error } = await supabase
        .from("profiles")
        .select(
          "id,user_id,username,display_name,bio,location,avatar_url,reputation,is_verified,is_premium"
        )
        .or(
          `username.ilike.${likeTerm},display_name.ilike.${likeTerm},bio.ilike.${likeTerm},location.ilike.${likeTerm}`
        )
        .order("reputation", { ascending: false })
        .limit(24);

      if (error) {
        console.error("Carian gagal:", error.message);
        setResults([]);
        setToast("Carian tidak dapat diproses buat masa ini.");
        return;
      }

      const rows = (data ?? []) as ProfileRow[];
      const mapped: SearchResult[] = rows.map((row) => {
        const username = row.username ?? "anonymous";
        const displayName = row.display_name ?? username;
        const tags: string[] = [username];
        if (row.location) tags.push(row.location);
        if (row.is_verified) tags.push("disahkan");
        if (row.is_premium) tags.push("premium");

        return {
          id: row.id ?? row.user_id ?? username,
          title: displayName,
          description: row.bio || `Profil warga siber ${displayName}.`,
          type: "page",
          url: `/site/${encodeURIComponent(username)}`,
          tags,
        };
      });

      setResults(mapped);
      setToast(
        mapped.length > 0
          ? `${mapped.length} padanan ditemui untuk "${term}".`
          : `Tiada padanan untuk istilah "${term}".`
      );
    } catch {
      setResults([]);
      setToast("Carian tidak dapat diproses buat masa ini.");
    } finally {
      setLoading(false);
    }
  };
  // End: Live Resident Directory Search

  // Start: Debounced Live Search Trigger
  useEffect(() => {
    if (debouncedQuery.trim().length > 2) {
      handleSearch(debouncedQuery);
    } else if (debouncedQuery.trim().length === 0) {
      setResults([]);
      setToast(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);
  // End: Debounced Live Search Trigger

  const handleResultClick = (url: string) => {
    router.push(url);
  };

  // Start: Memoised Empty State helpers
  const showEmptyHint = useMemo(
    () => debouncedQuery.trim().length === 0,
    [debouncedQuery]
  );
  const showThresholdHint = useMemo(
    () => debouncedQuery.trim().length > 0 && debouncedQuery.trim().length <= 2,
    [debouncedQuery]
  );
  // End: Memoised Empty State helpers

  return (
    <div
      className={`rounded border border-cyan-500/40 bg-[#060814] p-4 shadow-[0_0_24px_rgba(0,255,255,0.15)] dark:border-cyan-500/40 dark:bg-[#060814] ${className || ""}`}
    >
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-cyan-300 drop-shadow-[0_0_8px_rgba(0,255,255,0.6)]">
          Carian
        </h2>
        <p className="text-sm text-gray-400">
          Cari warga siber kampung, profil, dan laman tersuai dengan cepat.
        </p>
      </div>

      <div className="mb-4 rounded border border-cyan-500/30 bg-[#0e1330] p-3">
        <input
          value={query}
          onChange={(event) => {
            const value = event.target.value;
            setQuery(value);
          }}
          className="w-full rounded border border-cyan-500/30 bg-[#060814] px-3 py-2 text-sm text-cyan-100 outline-none placeholder:text-cyan-200/40 focus:border-cyan-400 focus:shadow-[0_0_12px_rgba(0,255,255,0.4)]"
          placeholder="Cari warga siber kampung..."
        />
      </div>

      {loading ? (
        <div className="rounded border border-dashed border-cyan-500/40 p-4 text-sm text-cyan-200/70">
          Memproses Carian...
        </div>
      ) : debouncedQuery.trim().length > 2 ? (
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {results.length > 0 ? (
            results.map((result) => {
              if (result.type === "tutorial" && result.difficulty && result.category) {
                return (
                  <TutorialCard
                    key={result.id}
                    title={result.title}
                    description={result.description}
                    difficulty={result.difficulty}
                    category={result.category}
                    completed={result.completed || false}
                    onStart={() => handleResultClick(result.url)}
                  />
                );
              }

              return (
                <ModernRetroCard
                  key={result.id}
                  title={result.title}
                  description={result.description}
                  icon={result.type === "asset" ? "🧰" : result.type === "project" ? "🛠️" : "🌐"}
                  onClick={() => handleResultClick(result.url)}
                  badge={result.tags[0]}
                />
              );
            })
          ) : (
            <div className="col-span-full rounded border border-dashed border-cyan-500/40 p-4 text-sm text-cyan-200/70">
              Tiada padanan untuk istilah "{debouncedQuery}".
            </div>
          )}
        </div>
      ) : showThresholdHint ? (
        <div className="rounded border border-dashed border-cyan-500/40 p-4 text-sm text-cyan-200/70">
          Sedang mencari...
        </div>
      ) : showEmptyHint ? (
        <div className="rounded border border-dashed border-cyan-500/40 p-4 text-sm text-cyan-200/70">
          Tiada hasil sehingga masa ini. Mulakan dengan istilah yang lebih khusus.
        </div>
      ) : null}

      {toast ? (
        <HumanFeedbackToast
          message={toast}
          type="info"
          duration={2200}
          onClose={() => setToast(null)}
        />
      ) : null}
    </div>
  );
}