import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | undefined;
export function getAdminClient() {
  const url = import.meta.env.VITE_SUPABASE_URL?.trim() ?? "";
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim() ?? "";
  if (!url || !key.startsWith("sb_publishable_")) {
    throw new Error("Supabase 연결 설정을 확인해 주세요.");
  }
  client ??= createClient(url, key, {
    auth: {
      storageKey: "qr-menu-admin-auth",
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  });
  return client;
}
