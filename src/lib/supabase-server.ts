// Start: Server-side Supabase Client (Route Handlers only)
// Uses the service role key when available to bypass RLS for internal reads,
// and falls back gracefully to the anon key when secrets are absent.
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || "placeholder-key";

// Start: Shared 7-day session TTL parity with browser client (Rule 31 Auth)
export const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // Exactly 7 days
export const SESSION_UPDATE_AGE_SECONDS = 24 * 60 * 60; // Refresh token expiry max every 24h
// End: Shared 7-day session TTL parity with browser client (Rule 31 Auth)

let cachedClient: SupabaseClient | null = null;

export function getServerSupabase(): SupabaseClient {
  if (cachedClient) return cachedClient;

  const key = supabaseServiceKey || supabaseAnonKey;
  cachedClient = createClient(supabaseUrl, key, {
    auth: {
      // Server-side client never persists to local storage; it validates
      // incoming bearer tokens. The 7-day bound is enforced by Supabase JWT
      // (project-level) + browser cookie maxAge (see src/lib/supabase.ts).
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return cachedClient;
}
// End: Server-side Supabase Client
