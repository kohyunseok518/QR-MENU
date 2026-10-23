import type {
  CategoryRow,
  LocalizedText,
  MenuCatalog,
  MenuItemRow,
} from "../domain/menu";

function localized(
  row: CategoryRow | MenuItemRow,
  prefix: "name" | "description",
): LocalizedText {
  const fields = row as unknown as Record<string, string | null>;
  const value = (suffix: string) => {
    const text = fields[`${prefix}_${suffix}`]?.trim();
    if (!text) throw new Error("Incomplete menu translation");
    return text;
  };
  return {
    ko: value("ko"),
    en: value("en"),
    "zh-Hans": value("zh_hans"),
    "zh-Hant": value("zh_hant"),
  };
}

export function mapCatalog(
  categoryRows: CategoryRow[],
  menuRows: MenuItemRow[],
  resolveImage: (path: string) => string = (path) => path,
): MenuCatalog {
  const visibleRows = menuRows.filter((item) => item.status !== "hidden");
  const categories = categoryRows
    .filter((row) => visibleRows.some((item) => item.category_id === row.id))
    .map((row) => ({
      id: row.id,
      name: localized(row, "name"),
      sortOrder: row.sort_order,
    }))
    .sort((a, b) => a.sortOrder - b.sortOrder || a.id.localeCompare(b.id));
  const categoryIndex = new Map(
    categories.map((category, index) => [category.id, index]),
  );
  const items = visibleRows
    .map((row) => {
      if (!categoryIndex.has(row.category_id))
        throw new Error("Menu category is missing");
      if (!Number.isInteger(row.price) || row.price < 0)
        throw new Error("Invalid menu price");
      return {
        id: row.id,
        categoryId: row.category_id,
        name: localized(row, "name"),
        description: localized(row, "description"),
        price: row.price,
        imageUrl: row.image_path ? resolveImage(row.image_path) : null,
        status: row.status as "available" | "sold_out",
        origins: row.origin_info,
        allergens: row.allergen_codes,
        allergenReviewStatus: row.allergen_review_status,
        sortOrder: row.sort_order,
      };
    })
    .sort(
      (a, b) =>
        categoryIndex.get(a.categoryId)! - categoryIndex.get(b.categoryId)! ||
        a.sortOrder - b.sortOrder ||
        a.id.localeCompare(b.id),
    );
  return { categories, items };
}
