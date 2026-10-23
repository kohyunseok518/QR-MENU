export const locales = ["ko", "en", "zh-Hans", "zh-Hant"] as const;
export type Locale = (typeof locales)[number];
export type LocalizedText = Record<Locale, string>;
export type MenuStatus = "available" | "sold_out" | "hidden";
export type AllergenReviewStatus = "unreviewed" | "reviewed";

export interface Category {
  id: string;
  name: LocalizedText;
  sortOrder: number;
}

export interface OriginInfo {
  ingredient_code: string;
  country_codes: string[];
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: LocalizedText;
  description: LocalizedText;
  price: number;
  imageUrl: string | null;
  status: Exclude<MenuStatus, "hidden">;
  origins: OriginInfo[];
  allergens: string[];
  allergenReviewStatus: AllergenReviewStatus;
  sortOrder: number;
}

export interface MenuCatalog {
  categories: Category[];
  items: MenuItem[];
}

// Fields returned by the Supabase Data API. The UI does not consume DB rows directly.
export interface CategoryRow {
  id: string;
  name_ko: string;
  name_en: string;
  name_zh_hans: string;
  name_zh_hant: string;
  sort_order: number;
}

export interface MenuItemRow {
  id: string;
  category_id: string;
  name_ko: string;
  name_en: string | null;
  name_zh_hans: string | null;
  name_zh_hant: string | null;
  description_ko: string | null;
  description_en: string | null;
  description_zh_hans: string | null;
  description_zh_hant: string | null;
  price: number;
  image_path: string | null;
  status: MenuStatus;
  origin_info: OriginInfo[];
  allergen_codes: string[];
  allergen_review_status: AllergenReviewStatus;
  sort_order: number;
}

export interface MenuRepository {
  getCatalog(signal?: AbortSignal): Promise<MenuCatalog>;
}
