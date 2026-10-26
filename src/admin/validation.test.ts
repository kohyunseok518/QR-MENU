import { describe, expect, it } from "vitest";
import { menuRows } from "../data/restaurantMenu";
import {
  categoryInput,
  menuInput,
  newCategory,
  newMenu,
  validatePhoto,
} from "./validation";

describe("administrator input", () => {
  it("permits incomplete translations only for hidden drafts", () => {
    const draft = newMenu("category-id", 0);
    draft.name_ko = "신메뉴";
    expect(menuInput(draft, "10000", "0")).toMatchObject({
      name_en: null,
      status: "hidden",
    });
    draft.status = "available";
    expect(() => menuInput(draft, "10000", "0")).toThrow(
      "한국어 메뉴명과 설명",
    );
  });
  it("rejects blank, negative, fractional and overflowing integers", () => {
    const draft = { ...menuRows[0]!, version: 1 };
    for (const price of ["", "-1", "1.1", "2147483648", "1e4"])
      expect(() => menuInput(draft, price, "0")).toThrow();
  });
  it("builds only writable fields, keeps unknown allergens and trims translations", () => {
    const draft = { ...menuRows[0]!, version: 12, name_ko: " 해장국 " };
    const input = menuInput(draft, "10000", "0");
    expect(input).not.toHaveProperty("version");
    expect(input).not.toHaveProperty("id");
    expect(input.name_ko).toBe("해장국");
    expect(input.allergen_review_status).toBe("unreviewed");
    expect(input.allergen_codes).toEqual([]);
  });
  it("rejects origins with no country or duplicate ingredients and unsafe image URLs", () => {
    const draft = { ...menuRows[0]!, version: 1 };
    expect(() =>
      menuInput(
        {
          ...draft,
          origin_info: [{ ingredient_code: "beef", country_codes: [] }],
        },
        "10000",
        "0",
      ),
    ).toThrow("국가");
    expect(() =>
      menuInput(
        {
          ...draft,
          origin_info: [
            { ingredient_code: "beef", country_codes: ["AU"] },
            { ingredient_code: "beef", country_codes: ["KR"] },
          ],
        },
        "10000",
        "0",
      ),
    ).toThrow("중복");
    expect(() =>
      menuInput({ ...draft, image_path: "javascript:alert(1)" }, "10000", "0"),
    ).toThrow("사진 주소");
  });
  it("requires all category names", () => {
    const category = newCategory(0);
    category.name_ko = "식사";
    expect(() => categoryInput(category, "0")).toThrow("영어");
  });
  it("rejects unsupported or oversized photo files", () => {
    expect(
      validatePhoto({ type: "image/svg+xml", size: 100 } as File),
    ).toContain("JPG");
    expect(
      validatePhoto({ type: "image/jpeg", size: 5242881 } as File),
    ).toContain("5MB");
    expect(
      validatePhoto({ type: "image/webp", size: 1000 } as File),
    ).toBeNull();
  });
});
