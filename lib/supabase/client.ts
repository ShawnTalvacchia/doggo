"use client";

import { createClient } from "@supabase/supabase-js";
import { getSupabasePublicEnv } from "@/lib/supabase/config";

let browserClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseBrowserClient() {
  const env = getSupabasePublicEnv();
  if (!env) return null;

  if (!browserClient) {
    browserClient = createClient(env.url, env.anonKey);
  }

  return browserClient;
}
