import type { CategoryRow, LocalizedText, MenuItemRow } from "../domain/menu";

const categoryId = (number: number) =>
  `10000000-0000-4000-8000-${String(number).padStart(12, "0")}`;
const menuId = (number: number) =>
  `20000000-0000-4000-8000-${String(number).padStart(12, "0")}`;

export const categoryRows: CategoryRow[] = [
  {
    id: categoryId(1),
    name_ko: "든든한 한 끼",
    name_en: "Rice & mains",
    name_zh_hans: "饭与主菜",
    name_zh_hant: "飯與主菜",
    sort_order: 0,
  },
  {
    id: categoryId(2),
    name_ko: "따뜻한 국물",
    name_en: "Soups & stews",
    name_zh_hans: "暖心汤锅",
    name_zh_hant: "暖心湯鍋",
    sort_order: 1,
  },
  {
    id: categoryId(3),
    name_ko: "함께 나눌 요리",
    name_en: "To share",
    name_zh_hans: "分享小菜",
    name_zh_hant: "分享小菜",
    sort_order: 2,
  },
  {
    id: categoryId(4),
    name_ko: "마실거리",
    name_en: "Drinks",
    name_zh_hans: "饮品",
    name_zh_hant: "飲品",
    sort_order: 3,
  },
];

function row(
  number: number,
  category: number,
  image: string,
  price: number,
  name: LocalizedText,
  description: LocalizedText,
  extra: Partial<MenuItemRow> = {},
): MenuItemRow {
  return {
    id: menuId(number),
    category_id: categoryId(category),
    name_ko: name.ko,
    name_en: name.en,
    name_zh_hans: name["zh-Hans"],
    name_zh_hant: name["zh-Hant"],
    description_ko: description.ko,
    description_en: description.en,
    description_zh_hans: description["zh-Hans"],
    description_zh_hant: description["zh-Hant"],
    price,
    image_path: `/images/${image}.jpg`,
    status: "available",
    origin_info: [],
    allergen_codes: [],
    allergen_review_status: "unreviewed",
    sort_order: number,
    ...extra,
  };
}

// All names, prices, translations, origins and allergens below are fictional demo content.
export const menuRows: MenuItemRow[] = [
  row(
    1,
    1,
    "bibimbap",
    12000,
    {
      ko: "돌솥 비빔밥",
      en: "Stone-pot Bibimbap",
      "zh-Hans": "石锅拌饭",
      "zh-Hant": "石鍋拌飯",
    },
    {
      ko: "따끈한 돌솥에 다채로운 나물과 소고기, 달걀을 올렸어요. 고소한 참기름과 특제 고추장을 취향껏 넣어 비벼 드세요.",
      en: "Colorful vegetables, beef and an egg over rice in a warm stone pot. Mix with sesame oil and our gochujang sauce to taste.",
      "zh-Hans":
        "热石锅中盛上米饭、时蔬、牛肉和鸡蛋，搭配香油与辣椒酱，按喜好拌匀享用。",
      "zh-Hant":
        "熱石鍋中盛上米飯、時蔬、牛肉和雞蛋，搭配香油與辣椒醬，按喜好拌勻享用。",
    },
    {
      origin_info: [
        { ingredient_code: "rice", country_codes: ["KR"] },
        { ingredient_code: "beef", country_codes: ["AU"] },
      ],
      allergen_codes: ["egg", "soybean", "wheat"],
      allergen_review_status: "reviewed",
    },
  ),
  row(
    2,
    1,
    "bulgogi",
    16000,
    {
      ko: "소담 소불고기",
      en: "Sodam Beef Bulgogi",
      "zh-Hans": "招牌烤牛肉",
      "zh-Hant": "招牌烤牛肉",
    },
    {
      ko: "얇게 썬 소고기를 달큰한 간장 양념에 재워 채소와 함께 볶았어요. 따뜻한 밥과 곁들이기 좋은 든든한 메뉴예요.",
      en: "Thinly sliced beef, marinated in a gently sweet soy sauce and stir-fried with vegetables. A comforting companion to warm rice.",
      "zh-Hans": "薄切牛肉以微甜酱油腌制，与蔬菜一同炒制，搭配热米饭格外美味。",
      "zh-Hant": "薄切牛肉以微甜醬油醃製，與蔬菜一同拌炒，搭配熱米飯格外美味。",
    },
    {
      origin_info: [{ ingredient_code: "beef", country_codes: ["AU"] }],
      allergen_codes: ["soybean", "wheat", "beef"],
      allergen_review_status: "reviewed",
    },
  ),
  row(
    3,
    2,
    "kimchi",
    10000,
    {
      ko: "잘 익은 김치찌개",
      en: "Kimchi & Pork Stew",
      "zh-Hans": "猪肉泡菜汤",
      "zh-Hant": "豬肉泡菜鍋",
    },
    {
      ko: "잘 익은 김치와 돼지고기를 푹 끓여 깊은 맛을 냈어요. 두부를 넉넉히 넣어 마지막 한 숟갈까지 든든해요.",
      en: "Well-fermented kimchi and pork simmered into a rich, warming stew, with generous pieces of tofu.",
      "zh-Hans": "熟成泡菜与猪肉慢炖出浓郁汤底，加入足量豆腐，暖胃又满足。",
      "zh-Hant": "熟成泡菜與豬肉慢燉出濃郁湯底，加入足量豆腐，暖胃又滿足。",
    },
    {
      origin_info: [
        { ingredient_code: "pork", country_codes: ["KR"] },
        { ingredient_code: "kimchi_cabbage", country_codes: ["KR"] },
      ],
      allergen_codes: ["pork", "soybean"],
      allergen_review_status: "reviewed",
    },
  ),
  row(
    4,
    2,
    "tofu",
    11000,
    {
      ko: "바지락 순두부찌개",
      en: "Soft Tofu & Clam Stew",
      "zh-Hans": "蛤蜊嫩豆腐汤",
      "zh-Hant": "蛤蜊嫩豆腐鍋",
    },
    {
      ko: "부드러운 순두부와 바지락을 얼큰하게 끓였어요. 몽글몽글한 순두부와 시원한 국물의 조화를 즐겨보세요.",
      en: "Silky soft tofu and clams in a pleasantly spicy broth. A delicate texture with a deep, savory finish.",
      "zh-Hans": "嫩滑豆腐与蛤蜊在微辣汤底中炖煮，口感柔软，汤鲜味浓。",
      "zh-Hant": "嫩滑豆腐與蛤蜊在微辣湯底中燉煮，口感柔軟，湯鮮味濃。",
    },
    {
      allergen_codes: ["soybean", "egg", "shellfish"],
      allergen_review_status: "reviewed",
    },
  ),
  row(
    5,
    3,
    "japchae",
    9000,
    {
      ko: "채소 가득 잡채",
      en: "Glass Noodles & Vegetables",
      "zh-Hans": "时蔬炒粉丝",
      "zh-Hant": "時蔬炒冬粉",
    },
    {
      ko: "쫄깃한 당면에 버섯과 제철 채소를 듬뿍 넣었어요. 고소하고 담백해서 함께 나눠 먹기 좋아요.",
      en: "Springy glass noodles tossed with mushrooms and seasonal vegetables. Savory, light and lovely to share.",
      "zh-Hans": "弹滑粉丝搭配菌菇与时令蔬菜，清香可口，适合一起分享。",
      "zh-Hant": "彈滑冬粉搭配菇類與時令蔬菜，清香可口，適合一起分享。",
    },
    {
      allergen_codes: ["soybean", "wheat"],
      allergen_review_status: "reviewed",
    },
  ),
  row(
    6,
    3,
    "pajeon",
    15000,
    {
      ko: "바삭한 해물파전",
      en: "Seafood & Scallion Pancake",
      "zh-Hans": "海鲜葱饼",
      "zh-Hant": "海鮮蔥煎餅",
    },
    {
      ko: "파의 향긋함에 새우와 오징어를 더해 노릇하게 부쳤어요. 겉은 바삭하고 속은 촉촉한 나눔 메뉴예요.",
      en: "Scallions, shrimp and squid in a golden pancake: crisp at the edges and tender in the middle.",
      "zh-Hans": "香葱搭配虾仁与鱿鱼，煎至金黄酥脆，外脆内软。",
      "zh-Hant": "香蔥搭配蝦仁與魷魚，煎至金黃酥脆，外脆內軟。",
    },
    {
      status: "sold_out",
      allergen_codes: ["wheat", "egg", "shrimp", "squid"],
      allergen_review_status: "reviewed",
    },
  ),
  row(
    7,
    3,
    "mandu",
    7000,
    {
      ko: "노릇한 군만두",
      en: "Crispy Pan-fried Dumplings",
      "zh-Hans": "香煎饺子",
      "zh-Hant": "香煎餃子",
    },
    {
      ko: "고기와 채소로 속을 채운 만두를 바삭하게 구웠어요. 한 입 베어 물면 촉촉한 육즙이 퍼져요.",
      en: "Golden pan-fried dumplings with a juicy meat and vegetable filling, served crisp and warm.",
      "zh-Hans": "肉与蔬菜馅饺子煎至金黄，外皮酥脆，内馅多汁。",
      "zh-Hant": "肉與蔬菜餡餃子煎至金黃，外皮酥脆，內餡多汁。",
    },
    {
      origin_info: [{ ingredient_code: "pork", country_codes: ["KR"] }],
      allergen_codes: ["wheat", "pork", "soybean"],
      allergen_review_status: "reviewed",
    },
  ),
  row(
    8,
    4,
    "sikhye",
    4000,
    {
      ko: "시원한 전통 식혜",
      en: "Chilled Sweet Rice Drink",
      "zh-Hans": "冰镇传统甜米露",
      "zh-Hant": "冰鎮傳統甜米露",
    },
    {
      ko: "은은한 단맛과 고소한 밥알이 어우러진 전통 식혜예요. 식사 끝에 시원하게 즐겨보세요.",
      en: "A traditional chilled rice drink with a gentle sweetness. A refreshing way to finish your meal.",
      "zh-Hans": "香甜清爽的传统米饮，带着软糯米粒，为一餐画上清凉句号。",
      "zh-Hant": "香甜清爽的傳統米飲，帶著軟糯米粒，為一餐畫上清涼句號。",
    },
    { origin_info: [{ ingredient_code: "rice", country_codes: ["KR"] }] },
  ),
];
