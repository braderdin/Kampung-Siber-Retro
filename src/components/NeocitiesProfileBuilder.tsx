// Start: Neocities-Style Live Profile Builder (Modern-Retro Cyber-Village)
"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useProfilesStore } from "@/store/useProfilesStore";

interface NeocitiesProfileBuilderProps {
  className?: string;
}

interface SessionIdentity {
  userId: string;
  username: string;
}

// Start: Local labels (Formal Bahasa Malaysia)
const LABEL = {
  builderTitle: "Bengkel Profil Teratak Anda",
  builderSubtitle: "Susun bio, khabar dan pautan secara langsung ke pangkalan data.",
  bio: "Bio / Penerangan Diri",
  location: "Lokasi",
  website: "Laman Web",
  twitter: "Twitter / X",
  github: "GitHub",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  status: "Khabar Terkini",
  statusPlaceholder: "Apa khabar hari ini, wahai warga Kampung Siber?",
  save: "Simpan Perubahan",
  saving: "Menyimpan...",
  publish: "Terbit Khabar",
  publishing: "Menerbit...",
  back: "Kembali ke Paparan Utama",
  openHtml: "Buka Editor HTML Teratak",
  savedOk: "Profil berjaya dikemas kini.",
  statusOk: "Khabar berjaya diterbitkan.",
  errSession: "Sesi tidak dikesan. Sila log masuk terlebih dahulu.",
  errSave: "Gagal menyimpan profil.",
  errStatus: "Gagal menerbit khabar.",
  needsLogin: "Log masuk diperlukan untuk mengubah suai profil.",
};
// End: Local labels

// Start: Neon field styles (Modern-Retro Cyber-Village palette #060814)
const FIELD_CLASS =
  "w-full bg-[#0a0e1f] border border-cyan-500/30 rounded-md px-3 py-2 text-sm " +
  "text-cyan-100 placeholder-cyan-500/40 focus:outline-none focus:border-pink-500/70 " +
  "focus:ring-1 focus:ring-pink-500/50 transition-colors";

const LABEL_CLASS = "block text-xs font-pixel uppercase tracking-wider text-cyan-300/80 mb-1";

const NEON_PINK = "bg-pink-500 hover:bg-pink-400 text-black font-bold";
const NEON_CYAN = "bg-cyan-500 hover:bg-cyan-400 text-black font-bold";
// End: Neon field styles

export default function NeocitiesProfileBuilder({
  className,
}: NeocitiesProfileBuilderProps) {
  // Start: Store bindings
  const profiles = useProfilesStore((s) => s.profiles);
  const fetchProfile = useProfilesStore((s) => s.fetchProfile);
  const updateProfile = useProfilesStore((s) => s.updateProfile);
  const saveProfile = useProfilesStore((s) => s.saveProfile);
  const publishStatus = useProfilesStore((s) => s.publishStatus);
  // End: Store bindings

  // Start: Local state
  const [identity, setIdentity] = useState<SessionIdentity | null>(null);
  const [sessionReady, setSessionReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [form, setForm] = useState({
    bio: "",
    location: "",
    website: "",
    twitter: "",
    github: "",
    instagram: "",
    linkedin: "",
  });
  const [statusText, setStatusText] = useState("");
  const [toast, setToast] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);
  // End: Local state

  // Start: Resolve session + seed form from live profile
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase.auth.getSession();
      const userId = data.session?.user?.id ?? "";
      const username =
        (data.session?.user?.user_metadata?.username as string) ??
        (data.session?.user?.email?.split("@")[0] ?? "");

      if (!cancelled) {
        if (userId) {
          setIdentity({ userId, username });
          await fetchProfile(userId, { forceRefresh: true });
        }
        setSessionReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [fetchProfile]);
  // End: Resolve session + seed form

  // Start: Seed form when profile arrives
  const activeProfile = useMemo(() => {
    if (!identity) return undefined;
    return profiles.find((p) => p.id === identity.userId);
  }, [profiles, identity]);

  useEffect(() => {
    if (!activeProfile) return;
    setForm({
      bio: activeProfile.bio ?? "",
      location: activeProfile.location ?? "",
      website: activeProfile.website ?? "",
      twitter: activeProfile.socials?.twitter ?? "",
      github: activeProfile.socials?.github ?? "",
      instagram: activeProfile.socials?.instagram ?? "",
      linkedin: activeProfile.socials?.linkedin ?? "",
    });
  }, [activeProfile]);
  // End: Seed form when profile arrives

  // Start: Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(id);
  }, [toast]);
  // End: Auto-dismiss toast

  // Start: Handle field change
  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };
  // End: Handle field change

  // Start: Live Save to Supabase (profiles table)
  const handleSave = useCallback(async () => {
    if (!identity) return;
    setSaving(true);
    setToast(null);
    try {
      const patch = {
        bio: form.bio,
        location: form.location,
        website: form.website,
        twitter: form.twitter || null,
        github: form.github || null,
        instagram: form.instagram || null,
        linkedin: form.linkedin || null,
      };

      // Optimistic reactive update
      updateProfile(identity.userId, {
        bio: form.bio,
        location: form.location,
        website: form.website,
        socials: {
          twitter: form.twitter || undefined,
          github: form.github || undefined,
          instagram: form.instagram || undefined,
          linkedin: form.linkedin || undefined,
        },
      });

      const ok = await saveProfile(identity.userId, patch);
      if (ok) {
        setToast({ kind: "ok", msg: LABEL.savedOk });
      } else {
        setToast({ kind: "err", msg: LABEL.errSave });
      }
    } catch {
      setToast({ kind: "err", msg: LABEL.errSave });
    } finally {
      setSaving(false);
    }
  }, [identity, form, updateProfile, saveProfile]);
  // End: Live Save to Supabase

  // Start: Live Publish Status to Supabase (status_updates table)
  const handlePublish = useCallback(async () => {
    if (!identity || !statusText.trim()) return;
    setPublishing(true);
    setToast(null);
    try {
      const ok = await publishStatus(
        identity.userId,
        identity.username,
        statusText.trim()
      );
      if (ok) {
        setStatusText("");
        setToast({ kind: "ok", msg: LABEL.statusOk });
      } else {
        setToast({ kind: "err", msg: LABEL.errStatus });
      }
    } catch {
      setToast({ kind: "err", msg: LABEL.errStatus });
    } finally {
      setPublishing(false);
    }
  }, [identity, statusText, publishStatus]);
  // End: Live Publish Status

  // Start: Render builder
  return (
    <div
      className={`${className || ""} w-full rounded-xl border border-cyan-500/30 bg-[#060814] p-4 sm:p-6 shadow-[0_0_40px_rgba(0,255,255,0.08)]`}
    >
      {/* Start: Builder Header */}
      <div className="mb-6 flex flex-col gap-1 border-b border-pink-500/20 pb-4">
        <h2 className="text-xl sm:text-2xl font-pixel text-pink-400 drop-shadow-[0_0_8px_rgba(255,0,127,0.6)]">
          ✦ {LABEL.builderTitle}
        </h2>
        <p className="text-xs sm:text-sm text-cyan-300/70">{LABEL.builderSubtitle}</p>
      </div>
      {/* End: Builder Header */}

      {/* Start: Session gate */}
      {sessionReady && !identity && (
        <div className="mb-4 rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-300">
          {LABEL.errSession}
        </div>
      )}
      {/* End: Session gate */}

      {/* Start: Toast */}
      {toast && (
        <div
          className={`mb-4 rounded-md border p-3 text-sm ${
            toast.kind === "ok"
              ? "border-green-500/50 bg-green-500/10 text-green-300"
              : "border-red-500/50 bg-red-500/10 text-red-300"
          }`}
        >
          {toast.msg}
        </div>
      )}
      {/* End: Toast */}

      {/* Start: Profile Form Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Bio */}
        <div className="lg:col-span-2">
          <label className={LABEL_CLASS}>{LABEL.bio}</label>
          <textarea
            value={form.bio}
            onChange={(e) => handleChange("bio", e.target.value)}
            rows={4}
            className={`${FIELD_CLASS} resize-none`}
            placeholder="Ceritakan sedikit tentang diri anda..."
          />
        </div>

        {/* Location */}
        <div>
          <label className={LABEL_CLASS}>{LABEL.location}</label>
          <input
            type="text"
            value={form.location}
            onChange={(e) => handleChange("location", e.target.value)}
            className={FIELD_CLASS}
            placeholder="Kuala Lumpur, MY"
          />
        </div>

        {/* Website */}
        <div>
          <label className={LABEL_CLASS}>{LABEL.website}</label>
          <input
            type="url"
            value={form.website}
            onChange={(e) => handleChange("website", e.target.value)}
            className={FIELD_CLASS}
            placeholder="https://teratak-anda.web.app"
          />
        </div>

        {/* Twitter */}
        <div>
          <label className={LABEL_CLASS}>{LABEL.twitter}</label>
          <input
            type="text"
            value={form.twitter}
            onChange={(e) => handleChange("twitter", e.target.value)}
            className={FIELD_CLASS}
            placeholder="@warga_siber"
          />
        </div>

        {/* GitHub */}
        <div>
          <label className={LABEL_CLASS}>{LABEL.github}</label>
          <input
            type="text"
            value={form.github}
            onChange={(e) => handleChange("github", e.target.value)}
            className={FIELD_CLASS}
            placeholder="warga-siber"
          />
        </div>

        {/* Instagram */}
        <div>
          <label className={LABEL_CLASS}>{LABEL.instagram}</label>
          <input
            type="text"
            value={form.instagram}
            onChange={(e) => handleChange("instagram", e.target.value)}
            className={FIELD_CLASS}
            placeholder="@warga_siber"
          />
        </div>

        {/* LinkedIn */}
        <div>
          <label className={LABEL_CLASS}>{LABEL.linkedin}</label>
          <input
            type="text"
            value={form.linkedin}
            onChange={(e) => handleChange("linkedin", e.target.value)}
            className={FIELD_CLASS}
            placeholder="warga-siber"
          />
        </div>
      </div>
      {/* End: Profile Form Grid */}

      {/* Start: Save action */}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving || !identity}
          className={`rounded-md px-5 py-2.5 text-sm font-pixel transition-all disabled:opacity-50 ${NEON_PINK}`}
        >
          {saving ? LABEL.saving : LABEL.save}
        </button>
        {identity && (
          <a
            href="/site_files/text_editor"
            className={`rounded-md px-5 py-2.5 text-sm font-pixel transition-all ${NEON_CYAN}`}
          >
            {LABEL.openHtml}
          </a>
        )}
      </div>
      {/* End: Save action */}

      {/* Start: Status publisher */}
      <div className="mt-8 border-t border-cyan-500/20 pt-6">
        <label className={LABEL_CLASS}>{LABEL.status}</label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={statusText}
            onChange={(e) => setStatusText(e.target.value)}
            className={`${FIELD_CLASS} flex-1`}
            placeholder={LABEL.statusPlaceholder}
            onKeyDown={(e) => {
              if (e.key === "Enter") handlePublish();
            }}
          />
          <button
            onClick={handlePublish}
            disabled={publishing || !statusText.trim() || !identity}
            className={`rounded-md px-5 py-2.5 text-sm font-pixel transition-all disabled:opacity-50 ${NEON_CYAN}`}
          >
            {publishing ? LABEL.publishing : LABEL.publish}
          </button>
        </div>
      </div>
      {/* End: Status publisher */}
    </div>
  );
  // End: Render builder
}
// End: Neocities-Style Live Profile Builder