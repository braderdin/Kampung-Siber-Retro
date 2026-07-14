// Start: Kampung Siber Environment Validation Guard (Rule 35 Security Guard)
// Provides a non-fatal build/runtime guard that emits clear, technical warning
// logs when required Supabase env keys are missing or still set to placeholder
// values — preventing silent failure (anti "Tiada padanan" bug).

const REQUIRED_SUPABASE_KEYS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_KEY",
] as const;

// Placeholder values that must NEVER reach production (see .env.example).
const PLACEHOLDER_VALUES = new Set<string>([
  "https://placeholder.supabase.co",
  "placeholder-key",
  "",
]);

export interface EnvValidationResult {
  isValid: boolean;
  warnings: string[];
}

// Start: validateSupabaseEnv — call BEFORE createClient in client/server modules
export function validateSupabaseEnv(): EnvValidationResult {
  const warnings: string[] = [];

  for (const key of REQUIRED_SUPABASE_KEYS) {
    const value = process.env[key];
    if (!value || PLACEHOLDER_VALUES.has(value.trim())) {
      warnings.push(
        `[Kampung Siber ENV GUARD] Required key "${key}" is missing or still ` +
          `set to a placeholder value. Copy .env.example to .env.local and ` +
          `supply real Supabase credentials before deploying.`
      );
    }
  }

  if (warnings.length > 0 && typeof console !== "undefined") {
    console.warn(
      `\n[Kampung Siber ENV GUARD] ${warnings.length} environment issue(s) detected:\n` +
        warnings.map((w) => `  • ${w}`).join("\n") +
        `\n  Fix: cp .env.example .env.local\n`
    );
  }

  return { isValid: warnings.length === 0, warnings };
}
// End: validateSupabaseEnv

// End: Kampung Siber Environment Validation Guard (Rule 35 Security Guard)