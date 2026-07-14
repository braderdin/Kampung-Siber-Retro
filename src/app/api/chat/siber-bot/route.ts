// Start: KawanSiber Bot Proxy Route (Phase 3 — Stream Ingestion)
// Tunnels authenticated chat queries to the Cloudflare Worker proxy which
// rotates our free models. Falls back to a graceful local echo if the proxy
// is not configured, so the UI never hard-crashes in dev.
import { NextRequest, NextResponse } from "next/server";

// Start: Runtime — Node only (server-side fetch + optional Supabase auth)
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// End: Runtime

// Start: Request contract
interface SiberBotRequest {
  message: string;
  history?: { role: "user" | "assistant"; content: string }[];
}
// End: Request contract

// Start: Local fallback responder (used when proxy URL is absent)
function fallbackRespond(message: string): string {
  const trimmed = message.trim();
  if (!trimmed) return "Taip sesuatu untuk mula berbual dengan KawanSiber. 💬";
  return (
    `[KawanSiber // OFFLINE-ECHO] Mesej anda diterima: "${trimmed}". ` +
    `Sambungan ke Cloudflare Worker proxy belum dikonfigurasi (SIBER_BOT_PROXY_URL). ` +
    `Sila tetapkan pemboleh ubah persekitaran untuk mengaktifkan mod AI penuh.`
  );
}
// End: Local fallback responder

export async function POST(request: NextRequest) {
  try {
    // Start: Parse + validate body
    const body = (await request.json()) as Partial<SiberBotRequest>;
    const message = typeof body.message === "string" ? body.message.trim() : "";
    if (!message) {
      return NextResponse.json(
        { error: "Mesej kosong tidak dibenarkan." },
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const history = Array.isArray(body.history) ? body.history.slice(-12) : [];
    // End: Parse + validate body

    // Start: Proxy target (rotated free models via Cloudflare Worker)
    const proxyUrl = process.env.SIBER_BOT_PROXY_URL || "";
    const authHeader = request.headers.get("authorization") || "";
    // End: Proxy target

    if (!proxyUrl) {
      // Start: Graceful offline echo (no proxy configured)
      return NextResponse.json(
        { reply: fallbackRespond(message), mode: "offline-echo" },
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
      // End: Graceful offline echo
    }

    // Start: Forward to Cloudflare Worker proxy
    const upstream = await fetch(proxyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
      body: JSON.stringify({ message, history }),
      // Abort if the worker is slow to protect server threads.
      signal: AbortSignal.timeout(25000),
    });
    // End: Forward to Cloudflare Worker proxy

    if (!upstream.ok) {
      const errText = await upstream.text().catch(() => "");
      console.error("[siber-bot] upstream error", upstream.status, errText);
      return NextResponse.json(
        { reply: fallbackRespond(message), mode: "proxy-degraded" },
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = (await upstream.json().catch(() => ({}))) as {
      reply?: string;
    };
    const reply = data.reply?.trim() || fallbackRespond(message);

    return NextResponse.json(
      { reply, mode: "proxy-live" },
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[siber-bot] route failure", error);
    return NextResponse.json(
      { error: "KawanSiber sedang berehat seketika. Cuba lagi nanti." },
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
// End: KawanSiber Bot Proxy Route