import type { SupabaseClient } from "@supabase/supabase-js";
import type { AdminCategory, AdminMenu, AdminRepository } from "./types";
import { validatePhoto } from "./validation";

export class ConflictError extends Error {
  constructor() {
    super(
      "다른 화면에서 수정되었거나 삭제된 항목이에요. 목록을 새로 불러온 뒤 다시 수정해 주세요.",
    );
  }
}

export function adminError(error: unknown): string {
  if (error instanceof ConflictError) return error.message;
  const code = (error as { code?: string })?.code;
  if (code === "23503")
    return "메뉴가 남아 있는 카테고리는 삭제할 수 없어요. 메뉴를 먼저 이동해 주세요.";
  if (code === "23505")
    return "이미 등록된 항목이에요. 목록을 새로 불러와 확인해 주세요.";
  if (code === "23514" || code === "23502")
    return "필수 번역, 가격, 원산지와 알레르기 입력값을 확인해 주세요.";
  if (code === "42501" || code === "PGRST301" || code === "PGRST303")
    return "로그인 상태와 관리자 권한을 확인해 주세요.";
  return "요청을 완료하지 못했어요. 연결 상태를 확인한 후 다시 시도해 주세요.";
}

const categoryColumns =
  "id,name_ko,name_en,name_zh_hans,name_zh_hant,sort_order,version";
const menuColumns =
  "id,category_id,name_ko,name_en,name_zh_hans,name_zh_hant,description_ko,description_en,description_zh_hans,description_zh_hant,price,image_path,status,origin_info,allergen_codes,allergen_review_status,sort_order,version";

export function createAdminRepository(client: SupabaseClient): AdminRepository {
  return {
    async getCatalog(signal) {
      signal?.throwIfAborted();
      const categories = client
        .from("categories")
        .select(categoryColumns)
        .order("sort_order")
        .order("id");
      const menus = client
        .from("menu_items")
        .select(menuColumns)
        .order("sort_order")
        .order("id");
      const timeout = AbortSignal.timeout(15_000);
      // AbortSignal.any is available in current browsers; avoid requiring it on older phones.
      const controller = new AbortController();
      const abort = () => controller.abort();
      signal?.addEventListener("abort", abort, { once: true });
      timeout.addEventListener("abort", abort, { once: true });
      try {
        const [a, b] = await Promise.all([
          categories
            .abortSignal(controller.signal)
            .returns<AdminCategory[]>()
            .throwOnError(),
          menus
            .abortSignal(controller.signal)
            .returns<AdminMenu[]>()
            .throwOnError(),
        ]);
        signal?.throwIfAborted();
        if (!a.data || !b.data) throw new Error("Missing catalog");
        return { categories: a.data, items: b.data };
      } finally {
        controller.abort();
        signal?.removeEventListener("abort", abort);
        timeout.removeEventListener("abort", abort);
      }
    },
    async saveMenu(id, version, input) {
      const table = client.from("menu_items");
      const query = version
        ? table.update(input).eq("id", id).eq("version", version)
        : table.insert({ ...input, id });
      const { data } = await query
        .select(menuColumns)
        .abortSignal(AbortSignal.timeout(20_000))
        .returns<AdminMenu[]>()
        .throwOnError();
      if (!data?.[0]) throw new ConflictError();
      return data[0];
    },
    async setStatus(item, status) {
      const { data } = await client
        .from("menu_items")
        .update({ status })
        .eq("id", item.id)
        .eq("version", item.version)
        .select(menuColumns)
        .abortSignal(AbortSignal.timeout(20_000))
        .returns<AdminMenu[]>()
        .throwOnError();
      if (!data?.[0]) throw new ConflictError();
      return data[0];
    },
    async deleteMenu(item) {
      const { data } = await client
        .from("menu_items")
        .delete()
        .eq("id", item.id)
        .eq("version", item.version)
        .select("id")
        .abortSignal(AbortSignal.timeout(20_000))
        .throwOnError();
      if (!data?.length) throw new ConflictError();
    },
    async saveCategory(id, version, input) {
      const table = client.from("categories");
      const query = version
        ? table.update(input).eq("id", id).eq("version", version)
        : table.insert({ ...input, id });
      const { data } = await query
        .select(categoryColumns)
        .abortSignal(AbortSignal.timeout(20_000))
        .returns<AdminCategory[]>()
        .throwOnError();
      if (!data?.[0]) throw new ConflictError();
      return data[0];
    },
    async deleteCategory(item) {
      const { data } = await client
        .from("categories")
        .delete()
        .eq("id", item.id)
        .eq("version", item.version)
        .select("id")
        .abortSignal(AbortSignal.timeout(20_000))
        .throwOnError();
      if (!data?.length) throw new ConflictError();
    },
    async uploadPhoto(file) {
      const error = validatePhoto(file);
      if (error) throw new Error(error);
      const extension = {
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/webp": "webp",
      }[file.type]!;
      const path = `${crypto.randomUUID()}.${extension}`;
      const bucket = client.storage.from("menu-images");
      const { error: uploadError } = await bucket.upload(path, file, {
        contentType: file.type,
        upsert: false,
        cacheControl: "3600",
      });
      if (uploadError) throw uploadError;
      return bucket.getPublicUrl(path).data.publicUrl;
    },
  };
}
