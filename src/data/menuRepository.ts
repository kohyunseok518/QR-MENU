import type { MenuRepository } from "../domain/menu";
import { createSupabaseMenuRepository } from "./supabaseMenuRepository";

export const menuRepository: MenuRepository = {
  async getCatalog(signal) {
    // Initialize inside the request so configuration errors reach the retry UI.
    const { getPublicMenuClient } = await import("../lib/supabase");
    signal?.throwIfAborted();
    return createSupabaseMenuRepository(getPublicMenuClient()).getCatalog(signal);
  },
};
