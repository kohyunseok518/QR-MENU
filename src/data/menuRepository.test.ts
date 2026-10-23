import { describe, expect, it } from "vitest";
import { categoryRows, menuRows } from "./fixtures";
import { mapCatalog } from "./mapper";
import { mockMenuRepository } from "./menuRepository";

describe("menu data boundary", () => {
  it("omits hidden menus and now-empty categories, but retains sold-out menus", () => {
    const hidden = {
      ...menuRows[0]!,
      category_id: categoryRows[3]!.id,
      status: "hidden" as const,
    };
    const result = mapCatalog(categoryRows, [hidden, menuRows[5]!]);
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
  it("supports cancelled requests", async () => {
    const controller = new AbortController();
    const request = mockMenuRepository.getCatalog(controller.signal);
    controller.abort();
    await expect(request).rejects.toMatchObject({ name: "AbortError" });
  });
  it("returns independent snapshots and four translations for every sample item", async () => {
    const first = await mockMenuRepository.getCatalog();
    const second = await mockMenuRepository.getCatalog();
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
