import type {
  AdminCategory,
  AdminMenu,
  CategoryInput,
  MenuInput,
} from "./types";
import {
  allergenCodes,
  countryCodes,
  ingredientCodes,
  languageFields,
} from "./fields";

export function newMenu(categoryId: string, sortOrder: number): AdminMenu {
  return {
    id: crypto.randomUUID(),
    version: 0,
    category_id: categoryId,
    name_ko: "",
    name_en: "",
    name_zh_hans: "",
    name_zh_hant: "",
    description_ko: "",
    description_en: "",
    description_zh_hans: "",
    description_zh_hant: "",
    price: 0,
    image_path: null,
    status: "hidden",
    origin_info: [],
    allergen_codes: [],
    allergen_review_status: "unreviewed",
    sort_order: sortOrder,
  };
}

export function newCategory(sortOrder: number): AdminCategory {
  return {
    id: crypto.randomUUID(),
    version: 0,
    name_ko: "",
    name_en: "",
    name_zh_hans: "",
    name_zh_hant: "",
    sort_order: sortOrder,
  };
}

function integer(value: string, name: string) {
  if (!/^\d+$/.test(value.trim()))
    throw new Error(`${name}은 0 이상의 정수로 입력해 주세요.`);
  const result = Number(value);
  if (!Number.isSafeInteger(result) || result > 2_147_483_647)
    throw new Error(`${name}이 너무 커요.`);
  return result;
}

export function validatePhoto(file: File): string | null {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type))
    return "사진은 JPG, PNG, WebP 파일을 선택해 주세요.";
  if (!file.size || file.size > 5 * 1024 * 1024)
    return "사진은 0바이트보다 크고 5MB 이하인 파일을 선택해 주세요.";
  return null;
}

export function menuInput(
  draft: AdminMenu,
  price: string,
  order: string,
): MenuInput {
  if (!draft.category_id) throw new Error("카테고리를 먼저 선택해 주세요.");
  if (!draft.name_ko.trim()) throw new Error("한국어 메뉴명을 입력해 주세요.");
  const input = {
    category_id: draft.category_id,
    name_ko: draft.name_ko.trim(),
    name_en: draft.name_en?.trim() || null,
    name_zh_hans: draft.name_zh_hans?.trim() || null,
    name_zh_hant: draft.name_zh_hant?.trim() || null,
    description_ko: draft.description_ko?.trim() || null,
    description_en: draft.description_en?.trim() || null,
    description_zh_hans: draft.description_zh_hans?.trim() || null,
    description_zh_hant: draft.description_zh_hant?.trim() || null,
    price: integer(price, "가격"),
    sort_order: integer(order, "정렬 순서"),
    status: draft.status,
    image_path: draft.image_path?.trim() || null,
    origin_info: structuredClone(draft.origin_info),
    allergen_codes: [...draft.allergen_codes],
    allergen_review_status: draft.allergen_review_status,
  };
  if (input.status !== "hidden") {
    for (const { suffix, label } of languageFields) {
      if (!input[`name_${suffix}`] || !input[`description_${suffix}`]) {
        throw new Error(
          `공개하려면 ${label} 메뉴명과 설명을 모두 입력해 주세요. 번역 전에는 숨김으로 저장할 수 있어요.`,
        );
      }
    }
  }
  if (
    input.image_path &&
    !/^https:\/\/[^\s]+$|^\/images\/[^\s]+$/.test(input.image_path)
  ) {
    throw new Error(
      "사진 주소는 HTTPS URL 또는 /images/ 경로를 입력해 주세요.",
    );
  }
  const seen = new Set<string>();
  for (const origin of input.origin_info) {
    if (
      !(ingredientCodes as readonly string[]).includes(
        origin.ingredient_code,
      ) ||
      seen.has(origin.ingredient_code)
    )
      throw new Error("원산지 재료는 중복 없이 선택해 주세요.");
    seen.add(origin.ingredient_code);
    if (
      !origin.country_codes.length ||
      origin.country_codes.some(
        (code) => !(countryCodes as readonly string[]).includes(code),
      )
    )
      throw new Error("원산지 국가를 선택해 주세요.");
  }
  if (
    input.allergen_codes.some(
      (code) => !(allergenCodes as readonly string[]).includes(code),
    )
  )
    throw new Error("알레르기 재료를 확인해 주세요.");
  return input;
}

export function categoryInput(
  draft: AdminCategory,
  order: string,
): CategoryInput {
  const input = {
    name_ko: draft.name_ko.trim(),
    name_en: draft.name_en.trim(),
    name_zh_hans: draft.name_zh_hans.trim(),
    name_zh_hant: draft.name_zh_hant.trim(),
    sort_order: integer(order, "정렬 순서"),
  };
  for (const { suffix, label } of languageFields) {
    if (!input[`name_${suffix}`])
      throw new Error(`${label} 카테고리명을 입력해 주세요.`);
  }
  return input;
}
