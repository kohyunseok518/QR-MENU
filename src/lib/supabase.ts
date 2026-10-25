import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export function createPublicMenuClient(url: string, publishableKey: string) {
  if (!url || !publishableKey.startsWith("sb_publishable_")) {
    throw new Error("Supabase URL and publishable key are required");
  }
  // A guest menu must not inherit an administrator's stored Auth session.
  return createClient(url, publishableKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

let publicMenuClient: SupabaseClient | undefined;

export function getPublicMenuClient() {
  publicMenuClient ??= createPublicMenuClient(
    import.meta.env.VITE_SUPABASE_URL?.trim() ?? "",
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim() ?? "",
  );
  return publicMenuClient;
}
