// Start: Imports
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
// End: Imports

// Start: Type Definitions
interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

interface ThrottleRecord {
  stamps: number[];
}
// End: Type Definitions

// Start: Constants (Rule 15 Strategy 3/4 — Sliding Window)
const THROTTLE_COOKIE = "siber-ai-throttle";
const THROTTLE_MAX_REQUESTS = 2;
const THROTTLE_WINDOW_MS = 60 * 1000; // 60 seconds rolling
const THROTTLE_LIMIT_MESSAGE =
  "Otak KawanSiber sedang panas! Sila tunggu bertenang sebelum bertanya semula.";
// End: Constants

// Start: Cookie helpers (client-side, no DB bloat — Rule 15 Strategy 3)
function readThrottle(): ThrottleRecord {
  if (typeof document === "undefined") return { stamps: [] };
  try {
    const raw = document.cookie
      .split("; ")
      .find((c) => c.startsWith(`${THROTTLE_COOKIE}=`));
    if (!raw) return { stamps: [] };
    const value = decodeURIComponent(raw.split("=")[1] || "{}");
    const parsed = JSON.parse(value) as ThrottleRecord;
    if (!Array.isArray(parsed.stamps)) return { stamps: [] };
    return { stamps: parsed.stamps };
  } catch {
    return { stamps: [] };
  }
}

function writeThrottle(record: ThrottleRecord): void {
  if (typeof document === "undefined") return;
  document.cookie = `${THROTTLE_COOKIE}=${encodeURIComponent(
    JSON.stringify(record)
  )}; path=/; max-age=${THROTTLE_WINDOW_MS / 1000}; samesite=lax`;
}

// Returns true if the request is allowed; false if over the sliding-window limit.
function checkThrottle(): boolean {
  const now = Date.now();
  const record = readThrottle();
  const recent = record.stamps.filter((s) => now - s < THROTTLE_WINDOW_MS);
  if (recent.length >= THROTTLE_MAX_REQUESTS) {
    writeThrottle({ stamps: recent });
    return false;
  }
  recent.push(now);
  writeThrottle({ stamps: recent });
  return true;
}
// End: Cookie helpers

// Start: KawanSiber Floating AI Assistant
export default function FloatingAiAssistant() {
  const [sessionReady, setSessionReady] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [limited, setLimited] = useState(false);
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Start: Supabase session gate (hide launcher when anonymous)
  useEffect(() => {
    let active = true;
    setSessionReady(false);

    const applySession = (user: unknown) => {
      if (!active) return;
      setIsAuthed(Boolean(user));
      setSessionReady(true);
    };

    supabase.auth.getSession().then(({ data }) => {
      applySession(data.session?.user);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      applySession(session?.user);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);
  // End: Supabase session gate

  // Start: Auto-scroll chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [turns, open]);
  // End: Auto-scroll chat

  // Start: Send handler (throttle-gated)
  const send = useCallback(async () => {
    const message = input.trim();
    if (!message || busy) return;

    setLimited(false);
    if (!checkThrottle()) {
      setLimited(true);
      return;
    }

    setBusy(true);
    setInput("");
    setTurns((prev) => [...prev, { role: "user", content: message }]);

    try {
      const history = turns.map((t) => ({ role: t.role, content: t.content }));
      const res = await fetch("/api/chat/siber-bot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history }),
      });
      const data = (await res.json()) as { reply?: string; error?: string };
      const reply =
        data.reply || data.error || "KawanSiber tidak menjawab. Cuba lagi.";
      setTurns((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setTurns((prev) => [
        ...prev,
        { role: "assistant", content: "Sambungan terputus. Sila cuba lagi." },
      ]);
    } finally {
      setBusy(false);
    }
  }, [input, busy, turns]);
  // End: Send handler

  // Start: If not authenticated, render nothing (locked launcher)
  if (!sessionReady || !isAuthed) return null;
  // End: Auth gate

  // Start: Pixelated CRT computer launcher icon
  const CrtIcon = () => (
    <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden role="img">
      <rect x="3" y="4" width="28" height="22" rx="2" fill="#060814" stroke="#00ffff" strokeWidth="2" />
      <rect x="7" y="8" width="20" height="13" rx="1" fill="#0e1330" />
      <rect x="9" y="10" width="7" height="3" fill="#aaff00" opacity="0.9" />
      <rect x="9" y="15" width="13" height="2" fill="#ff007f" opacity="0.8" />
      <rect x="11" y="27" width="12" height="3" rx="1" fill="#00ffff" />
      <rect x="14" y="30" width="6" height="2" fill="#00ffff" />
    </svg>
  );
  // End: Pixelated CRT launcher icon

  // Start: Render Floating Assistant
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="w-[min(92vw,360px)] h-[460px] rounded-xl flex flex-col overflow-hidden"
            style={{
              background: "linear-gradient(180deg,#060814,#0e1330)",
              border: "1px solid #00ffff",
              boxShadow: "0 0 28px rgba(0,255,255,0.35)",
            }}
          >
            {/* Start: Console header */}
            <div
              className="px-4 py-2.5 flex items-center justify-between font-mono"
              style={{ borderBottom: "1px solid rgba(255,0,127,0.4)" }}
            >
              <span className="text-[13px] font-semibold" style={{ color: "#aaff00" }}>
                ~/kawansiber --bot
              </span>
              <button
                onClick={() => setOpen(false)}
                className="text-white/60 hover:text-[#ff007f] text-sm px-2"
                aria-label="Tutup"
              >
                ✕
              </button>
            </div>
            {/* End: Console header */}

            {/* Start: Chat transcript */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-4 py-3 space-y-3 font-mono text-[12px]"
            >
              {turns.length === 0 && (
                <p className="text-white/40">
                  KawanSiber sedia! Tanya apa-apa tentang Kampung Siber. 💻
                </p>
              )}
              {turns.map((turn, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] px-3 py-2 rounded-lg ${
                    turn.role === "user" ? "ml-auto text-right" : "mr-auto"
                  }`}
                  style={{
                    background:
                      turn.role === "user"
                        ? "rgba(255,0,127,0.15)"
                        : "rgba(0,255,255,0.10)",
                    border:
                      turn.role === "user"
                        ? "1px solid rgba(255,0,127,0.4)"
                        : "1px solid rgba(0,255,255,0.3)",
                    color: turn.role === "user" ? "#ffd6ef" : "#caffff",
                  }}
                >
                  {turn.content}
                </div>
              ))}
              {busy && (
                <div className="mr-auto px-3 py-2 rounded-lg font-mono text-[12px] text-white/50"
                  style={{ border: "1px solid rgba(0,255,255,0.25)" }}>
                  KawanSiber menaip…
                </div>
              )}
            </div>
            {/* End: Chat transcript */}

            {/* Start: Limit banner */}
            {limited && (
              <div
                className="px-4 py-2 font-mono text-[11px]"
                style={{
                  background: "rgba(255,0,127,0.12)",
                  color: "#ff7fb5",
                  borderTop: "1px solid rgba(255,0,127,0.4)",
                }}
              >
                ⚠ {THROTTLE_LIMIT_MESSAGE}
              </div>
            )}
            {/* End: Limit banner */}

            {/* Start: Input bar */}
            <div
              className="p-3 flex items-center gap-2"
              style={{ borderTop: "1px solid rgba(0,255,255,0.18)" }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") send();
                }}
                placeholder="Tanya KawanSiber…"
                className="flex-1 bg-[#060814] px-3 py-2 rounded font-mono text-[12px] text-white outline-none"
                style={{ border: "1px solid rgba(0,255,255,0.3)" }}
              />
              <button
                onClick={send}
                disabled={busy}
                className="px-3 py-2 rounded font-mono text-[12px] disabled:opacity-40"
                style={{
                  background: "#aaff00",
                  color: "#060814",
                  fontWeight: 700,
                }}
              >
                ▶
              </button>
            </div>
            {/* End: Input bar */}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Start: Floating launcher (pixel CRT) */}
      <motion.button
        onClick={() => setOpen((o) => !o)}
        aria-label="Buka KawanSiber Bot"
        initial={{ y: 0 }}
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="rounded-full p-3 flex items-center justify-center"
        style={{
          background: "linear-gradient(180deg,#0e1330,#060814)",
          border: "1px solid #00ffff",
          boxShadow: "0 0 18px rgba(0,255,255,0.45), 0 0 8px rgba(255,0,127,0.35)",
        }}
      >
        <CrtIcon />
      </motion.button>
      {/* End: Floating launcher */}
    </div>
  );
}
// End: KawanSiber Floating AI Assistant