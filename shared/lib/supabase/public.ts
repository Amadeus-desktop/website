import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "@/shared/lib/supabase/env";

/**
 * Cookie-less Supabase client for public, read-only catalog data.
 * Safe to use inside `unstable_cache` (no request-scoped dynamic APIs).
 */
export function createPublicClient() {
  const env = getSupabaseEnv();
  if (!env) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  }

  return createSupabaseClient(env.url, env.key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
