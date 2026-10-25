import type { SupabaseClient } from "@supabase/supabase-js";
import type { CategoryRow, MenuItemRow, MenuRepository } from "../domain/menu";
import { mapCatalog } from "./mapper";

const categoryColumns = "id,name_ko,name_en,name_zh_hans,name_zh_hant,sort_order";
const menuColumns = [
  "id", "category_id", "name_ko", "name_en", "name_zh_hans", "name_zh_hant",
  "description_ko", "description_en", "description_zh_hans", "description_zh_hant",
  "price", "image_path", "status", "origin_info", "allergen_codes",
  "allergen_review_status", "sort_order",
].join(",");

export function createSupabaseMenuRepository(client: SupabaseClient): MenuRepository {
  return {
    async getCatalog(signal) {
      signal?.throwIfAborted();
      const controller = new AbortController();
      const abort = () => controller.abort(signal?.reason);
      signal?.addEventListener("abort", abort, { once: true });
      const timeout = setTimeout(() => {
        controller.abort(new DOMException("Menu request timed out", "TimeoutError"));
      }, 15_000);

      try {
        const [categories, menus] = await Promise.all([
          client.from("categories").select(categoryColumns)
            .order("sort_order").order("id")
            .abortSignal(controller.signal).returns<CategoryRow[]>().throwOnError(),
          client.from("menu_items").select(menuColumns)
            .in("status", ["available", "sold_out"])
            .order("sort_order").order("id")
            .abortSignal(controller.signal).returns<MenuItemRow[]>().throwOnError(),
        ]);
        signal?.throwIfAborted();
        if (!categories.data || !menus.data) throw new Error("Missing menu response");
        // Existing image paths are served from this site's public/images directory.
        return mapCatalog(categories.data, menus.data);
      } catch (error) {
        controller.abort();
        signal?.throwIfAborted();
        throw error;
      } finally {
        clearTimeout(timeout);
        signal?.removeEventListener("abort", abort);
      }
    },
  };
}
