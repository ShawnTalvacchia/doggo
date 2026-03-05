// Supabase anon keys come in two formats:
//   Legacy JWT:      eyJ...
//   Newer publishable key: sb_publishable_...
// If the value is still a placeholder like "your-anon-key", treat it as missing.
function isRealKey(value: string): boolean {
  return value.startsWith("eyJ") || value.startsWith("sb_");
}

export function getSupabasePublicEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) return null;
  if (!isRealKey(anonKey)) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[Doggo] NEXT_PUBLIC_SUPABASE_ANON_KEY looks like a placeholder. " +
          "Copy the anon/public key from Supabase Dashboard → Settings → API. " +
          "Falling back to local mock data.",
      );
    }
    return null;
  }

  return { url, anonKey };
}

export function hasSupabasePublicEnv() {
  return Boolean(getSupabasePublicEnv());
}
