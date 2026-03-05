import { createClient } from "@supabase/supabase-js";
import { getSupabasePublicEnv } from "@/lib/supabase/config";

export function getSupabaseServerClient() {
  const env = getSupabasePublicEnv();
  if (!env) return null;

  return createClient(env.url, env.anonKey, {
    auth: {
      persistSession: false,
    },
  });
}
