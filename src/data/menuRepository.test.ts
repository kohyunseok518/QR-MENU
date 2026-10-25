import { describe, expect, it } from "vitest";
import { categoryRows, menuRows } from "./restaurantMenu";
import { mapCatalog } from "./mapper";

describe("menu data boundary", () => {
  it("omits hidden menus and now-empty categories, but retains sold-out menus", () => {
    const hidden = {
      ...menuRows[0]!,
      category_id: categoryRows[3]!.id,
      status: "hidden" as const,
    };
    const soldOut = {
      ...menuRows[0]!,
      category_id: categoryRows[2]!.id,
      status: "sold_out" as const,
    };
    const result = mapCatalog(categoryRows, [hidden, soldOut]);
    expect(result.items).toHaveLength(1);
    expect(result.items[0]!.status).toBe("sold_out");
    expect(result.categories.map((x) => x.id)).toEqual([categoryRows[2]!.id]);
  });
  it("resolves stored image paths at the data boundary", () => {
    expect(
      mapCatalog(
        categoryRows,
        [menuRows[0]!],
        (path) => `https://example.test${path}`,
      ).items[0]!.imageUrl,
    ).toContain("https://example.test/");
  });
  it("rejects missing categories rather than silently showing an empty success", () =>
    expect(() => mapCatalog([], menuRows)).toThrow("category"));
  it("rejects negative and fractional prices", () => {
    for (const price of [-1, 1.5])
      expect(() =>
        mapCatalog(categoryRows, [{ ...menuRows[0]!, price }]),
      ).toThrow("price");
  });
  it("does not silently replace a missing Chinese translation with another language", () => {
    expect(() =>
      mapCatalog(categoryRows, [{ ...menuRows[0]!, name_zh_hant: null }]),
    ).toThrow("translation");
  });
  it("returns independent snapshots and four translations for every menu item", async () => {
    const first = mapCatalog(structuredClone(categoryRows), structuredClone(menuRows));
    const second = mapCatalog(structuredClone(categoryRows), structuredClone(menuRows));
    first.items[0]!.allergens.push("test");
    expect(second.items[0]!.allergens).not.toContain("test");
    for (const item of second.items) {
      for (const locale of ["ko", "en", "zh-Hans", "zh-Hant"] as const) {
        expect(item.name[locale]).not.toBe("");
        expect(item.description[locale]).not.toBe("");
      }
    }
  });
});
