import type { CategoryRow, MenuItemRow } from "../domain/menu";

// Checked against Naver store-order menus on 2026-10-24.
// Source decisions and price comparisons: docs/RESTAURANT_DATA.md.
// Translations are authored for this menu; allergens are not inferred.

export const categoryRows: CategoryRow[] = [
  {
    "id": "10000000-0000-4000-8000-000000000001",
    "name_ko": "식사류",
    "name_en": "Soups & Stews",
    "name_zh_hans": "汤饭类",
    "name_zh_hant": "湯飯類",
    "sort_order": 0
  },
  {
    "id": "10000000-0000-4000-8000-000000000002",
    "name_ko": "고기류",
    "name_en": "Meat Dishes",
    "name_zh_hans": "肉类",
    "name_zh_hant": "肉類",
    "sort_order": 1
  },
  {
    "id": "10000000-0000-4000-8000-000000000003",
    "name_ko": "냉면·사이드",
    "name_en": "Noodles & Sides",
    "name_zh_hans": "冷面·配餐",
    "name_zh_hant": "冷麵·配餐",
    "sort_order": 2
  },
  {
    "id": "10000000-0000-4000-8000-000000000004",
    "name_ko": "주류·음료",
    "name_en": "Drinks",
    "name_zh_hans": "酒水·饮料",
    "name_zh_hant": "酒水·飲料",
    "sort_order": 3
  }
];

export const menuRows: MenuItemRow[] = [
  {
    "id": "20000000-0000-4000-8000-000000000001",
    "category_id": "10000000-0000-4000-8000-000000000001",
    "price": 10000,
    "image_path": "/images/restaurant/haejangguk.jpg",
    "status": "available",
    "origin_info": [
      {
        "ingredient_code": "beef",
        "country_codes": [
          "AU"
        ]
      }
    ],
    "allergen_codes": [],
    "allergen_review_status": "unreviewed",
    "sort_order": 1,
    "name_ko": "해장국",
    "name_en": "Beef Haejangguk",
    "name_zh_hans": "牛肉醒酒汤",
    "name_zh_hant": "牛肉醒酒湯",
    "description_ko": "호주산 양지를 사용하는 해장국입니다.",
    "description_en": "Haejangguk made with Australian beef brisket.",
    "description_zh_hans": "使用澳大利亚牛胸肉制作的韩式醒酒汤。",
    "description_zh_hant": "使用澳洲牛胸肉製作的韓式醒酒湯。"
  },
  {
    "id": "20000000-0000-4000-8000-000000000002",
    "category_id": "10000000-0000-4000-8000-000000000001",
    "price": 9000,
    "image_path": "/images/restaurant/momguk.jpg",
    "status": "available",
    "origin_info": [
      {
        "ingredient_code": "pork",
        "country_codes": [
          "KR"
        ]
      }
    ],
    "allergen_codes": [],
    "allergen_review_status": "unreviewed",
    "sort_order": 2,
    "name_ko": "몸국",
    "name_en": "Momguk · Pork & Gulfweed Soup",
    "name_zh_hans": "济州海藻猪骨汤",
    "name_zh_hant": "濟州海藻豬骨湯",
    "description_ko": "제주산 돈사골과 몸(모자반)으로 끓인 제주 향토 국입니다.",
    "description_en": "A Jeju soup made with pork bones and gulfweed sourced from Jeju.",
    "description_zh_hans": "以济州产猪骨和海藻（马尾藻）烹制的济州乡土汤。",
    "description_zh_hant": "以濟州產豬骨和海藻（馬尾藻）烹製的濟州鄉土湯。"
  },
  {
    "id": "20000000-0000-4000-8000-000000000003",
    "category_id": "10000000-0000-4000-8000-000000000001",
    "price": 11000,
    "image_path": "/images/restaurant/naejangtang.jpg",
    "status": "available",
    "origin_info": [
      {
        "ingredient_code": "beef",
        "country_codes": [
          "AU"
        ]
      }
    ],
    "allergen_codes": [],
    "allergen_review_status": "unreviewed",
    "sort_order": 3,
    "name_ko": "내장탕",
    "name_en": "Beef Tripe & Intestine Soup",
    "name_zh_hans": "牛杂汤",
    "name_zh_hant": "牛雜湯",
    "description_ko": "호주산 곱창과 깐양을 사용하는 내장탕입니다.",
    "description_en": "A soup made with Australian beef intestines and tripe.",
    "description_zh_hans": "使用澳大利亚牛肠和牛肚制作的汤。",
    "description_zh_hant": "使用澳洲牛腸和牛肚製作的湯。"
  },
  {
    "id": "20000000-0000-4000-8000-000000000004",
    "category_id": "10000000-0000-4000-8000-000000000001",
    "price": 8000,
    "image_path": "/images/restaurant/hwangtae.jpg",
    "status": "available",
    "origin_info": [],
    "allergen_codes": [],
    "allergen_review_status": "unreviewed",
    "sort_order": 4,
    "name_ko": "황태해장국",
    "name_en": "Dried Pollock Soup",
    "name_zh_hans": "干明太鱼醒酒汤",
    "name_zh_hant": "乾明太魚醒酒湯",
    "description_ko": "러시아산 황태를 사용하는 해장국입니다.",
    "description_en": "A warming soup made with dried pollock from Russia.",
    "description_zh_hans": "使用俄罗斯产干明太鱼制作的韩式醒酒汤。",
    "description_zh_hant": "使用俄羅斯產乾明太魚製作的韓式醒酒湯。"
  },
  {
    "id": "20000000-0000-4000-8000-000000000005",
    "category_id": "10000000-0000-4000-8000-000000000001",
    "price": 9000,
    "image_path": "/images/restaurant/black-pork-kimchi.jpg",
    "status": "available",
    "origin_info": [
      {
        "ingredient_code": "pork",
        "country_codes": [
          "KR"
        ]
      }
    ],
    "allergen_codes": [],
    "allergen_review_status": "unreviewed",
    "sort_order": 5,
    "name_ko": "흑돼지김치찌개",
    "name_en": "Black Pork Kimchi Stew",
    "name_zh_hans": "黑猪肉泡菜汤",
    "name_zh_hant": "黑豬肉泡菜鍋",
    "description_ko": "제주산 흑돼지를 넣어 끓인 김치찌개입니다.",
    "description_en": "Kimchi stew made with Jeju black pork.",
    "description_zh_hans": "加入济州产黑猪肉烹制的泡菜汤。",
    "description_zh_hant": "加入濟州產黑豬肉烹製的泡菜鍋。"
  },
  {
    "id": "20000000-0000-4000-8000-000000000006",
    "category_id": "10000000-0000-4000-8000-000000000002",
    "price": 12000,
    "image_path": "/images/restaurant/spicy-ribs.jpg",
    "status": "available",
    "origin_info": [],
    "allergen_codes": [],
    "allergen_review_status": "unreviewed",
    "sort_order": 6,
    "name_ko": "매운갈비찜",
    "name_en": "Spicy Braised Ribs",
    "name_zh_hans": "辣炖排骨",
    "name_zh_hant": "辣燉排骨",
    "description_ko": "매운 양념으로 조리한 갈비찜입니다. 공기밥은 별도입니다.",
    "description_en": "Ribs braised in a spicy sauce. Rice is sold separately.",
    "description_zh_hans": "以辣味酱汁炖制的排骨，米饭需另点。",
    "description_zh_hant": "以辣味醬汁燉製的排骨，白飯需另點。"
  },
  {
    "id": "20000000-0000-4000-8000-000000000007",
    "category_id": "10000000-0000-4000-8000-000000000002",
    "price": 16000,
    "image_path": "/images/restaurant/marinated-ribs.jpg",
    "status": "available",
    "origin_info": [],
    "allergen_codes": [],
    "allergen_review_status": "unreviewed",
    "sort_order": 7,
    "name_ko": "양념갈비 (400g)",
    "name_en": "Marinated Pork Ribs (400 g)",
    "name_zh_hans": "腌制猪排骨（400克）",
    "name_zh_hant": "醃製豬排骨（400克）",
    "description_ko": "미주산 양념갈비 400g입니다.",
    "description_en": "A 400 g serving of marinated pork ribs sourced from the Americas.",
    "description_zh_hans": "每份400克腌制猪排骨，产地标示为美洲。",
    "description_zh_hant": "每份400克醃製豬排骨，產地標示為美洲。"
  },
  {
    "id": "20000000-0000-4000-8000-000000000008",
    "category_id": "10000000-0000-4000-8000-000000000002",
    "price": 11000,
    "image_path": null,
    "status": "available",
    "origin_info": [],
    "allergen_codes": [],
    "allergen_review_status": "unreviewed",
    "sort_order": 8,
    "name_ko": "흑돼지주물럭",
    "name_en": "Black Pork & Squid Stir-fry",
    "name_zh_hans": "黑猪肉鱿鱼炒肉",
    "name_zh_hant": "黑豬肉魷魚炒肉",
    "description_ko": "흑돼지와 오징어를 함께 조리한 주물럭입니다.",
    "description_en": "A stir-fried dish of black pork and squid.",
    "description_zh_hans": "黑猪肉与鱿鱼一起烹制的炒肉。",
    "description_zh_hant": "黑豬肉與魷魚一起烹製的炒肉。"
  },
  {
    "id": "20000000-0000-4000-8000-000000000009",
    "category_id": "10000000-0000-4000-8000-000000000002",
    "price": 15000,
    "image_path": null,
    "status": "available",
    "origin_info": [
      {
        "ingredient_code": "pork",
        "country_codes": [
          "KR"
        ]
      }
    ],
    "allergen_codes": [],
    "allergen_review_status": "unreviewed",
    "sort_order": 9,
    "name_ko": "백돼지오겹살 (200g)",
    "name_en": "Jeju Pork Belly (200 g)",
    "name_zh_hans": "济州猪五花肉（带皮·200克）",
    "name_zh_hant": "濟州豬五花肉（帶皮·200克）",
    "description_ko": "제주산 백돼지 오겹살 200g입니다.",
    "description_en": "A 200 g serving of skin-on white-pork belly from Jeju.",
    "description_zh_hans": "每份200克济州产白猪带皮五花肉。",
    "description_zh_hant": "每份200克濟州產白豬帶皮五花肉。"
  },
  {
    "id": "20000000-0000-4000-8000-000000000010",
    "category_id": "10000000-0000-4000-8000-000000000002",
    "price": 7000,
    "image_path": "/images/restaurant/uncooked-ribs.jpg",
    "status": "available",
    "origin_info": [],
    "allergen_codes": [],
    "allergen_review_status": "unreviewed",
    "sort_order": 10,
    "name_ko": "양념갈비 (비조리·400g)",
    "name_en": "Uncooked Marinated Ribs (400 g)",
    "name_zh_hans": "腌制排骨（未烹饪·400克）",
    "name_zh_hant": "醃製排骨（未烹調·400克）",
    "description_ko": "미주산 양념갈비 400g을 비조리 상태로 제공합니다. 고기만 제공하며 직접 조리해야 합니다.",
    "description_en": "400 g of uncooked marinated pork ribs from the Americas. Meat only; cook before eating.",
    "description_zh_hans": "提供400克未烹饪的美洲产腌制猪排骨，仅含肉品，需自行烹调。",
    "description_zh_hant": "提供400克未烹調的美洲產醃製豬排骨，僅含肉品，需自行烹調。"
  },
  {
    "id": "20000000-0000-4000-8000-000000000011",
    "category_id": "10000000-0000-4000-8000-000000000003",
    "price": 7000,
    "image_path": null,
    "status": "available",
    "origin_info": [],
    "allergen_codes": [],
    "allergen_review_status": "unreviewed",
    "sort_order": 11,
    "name_ko": "정식냉면 (비빔)",
    "name_en": "Bibim Naengmyeon · Regular",
    "name_zh_hans": "拌冷面（正餐份）",
    "name_zh_hant": "拌冷麵（正餐份）",
    "description_ko": "비빔으로 제공하는 정식 냉면입니다.",
    "description_en": "Bibim-style cold noodles in a regular meal serving.",
    "description_zh_hans": "正餐份量的拌冷面。",
    "description_zh_hant": "正餐份量的拌冷麵。"
  },
  {
    "id": "20000000-0000-4000-8000-000000000012",
    "category_id": "10000000-0000-4000-8000-000000000003",
    "price": 7000,
    "image_path": null,
    "status": "available",
    "origin_info": [],
    "allergen_codes": [],
    "allergen_review_status": "unreviewed",
    "sort_order": 12,
    "name_ko": "정식냉면 (물)",
    "name_en": "Mul Naengmyeon · Regular",
    "name_zh_hans": "汤冷面（正餐份）",
    "name_zh_hant": "湯冷麵（正餐份）",
    "description_ko": "육수와 함께 제공하는 정식 냉면입니다.",
    "description_en": "Cold noodles served in broth as a regular meal.",
    "description_zh_hans": "配冷汤提供的正餐份量冷面。",
    "description_zh_hant": "配冷湯提供的正餐份量冷麵。"
  },
  {
    "id": "20000000-0000-4000-8000-000000000013",
    "category_id": "10000000-0000-4000-8000-000000000003",
    "price": 5000,
    "image_path": null,
    "status": "available",
    "origin_info": [],
    "allergen_codes": [],
    "allergen_review_status": "unreviewed",
    "sort_order": 13,
    "name_ko": "후식냉면 (비빔)",
    "name_en": "Bibim Naengmyeon · After-meal",
    "name_zh_hans": "拌冷面（餐后份）",
    "name_zh_hant": "拌冷麵（餐後份）",
    "description_ko": "식사 후 곁들이는 비빔 후식 냉면입니다.",
    "description_en": "Bibim-style cold noodles to enjoy after your main dish.",
    "description_zh_hans": "适合正餐后享用的拌冷面。",
    "description_zh_hant": "適合正餐後享用的拌冷麵。"
  },
  {
    "id": "20000000-0000-4000-8000-000000000014",
    "category_id": "10000000-0000-4000-8000-000000000003",
    "price": 5000,
    "image_path": null,
    "status": "available",
    "origin_info": [],
    "allergen_codes": [],
    "allergen_review_status": "unreviewed",
    "sort_order": 14,
    "name_ko": "후식냉면 (물)",
    "name_en": "Mul Naengmyeon · After-meal",
    "name_zh_hans": "汤冷面（餐后份）",
    "name_zh_hant": "湯冷麵（餐後份）",
    "description_ko": "식사 후 곁들이는 물 후식 냉면입니다.",
    "description_en": "Cold noodles in broth to enjoy after your main dish.",
    "description_zh_hans": "适合正餐后享用的汤冷面。",
    "description_zh_hant": "適合正餐後享用的湯冷麵。"
  },
  {
    "id": "20000000-0000-4000-8000-000000000015",
    "category_id": "10000000-0000-4000-8000-000000000003",
    "price": 1000,
    "image_path": null,
    "status": "available",
    "origin_info": [
      {
        "ingredient_code": "rice",
        "country_codes": [
          "KR"
        ]
      }
    ],
    "allergen_codes": [],
    "allergen_review_status": "unreviewed",
    "sort_order": 15,
    "name_ko": "공기밥",
    "name_en": "Bowl of Rice",
    "name_zh_hans": "米饭",
    "name_zh_hant": "白飯",
    "description_ko": "국내산 쌀로 지은 공기밥입니다.",
    "description_en": "A bowl of rice made with Korean-grown rice.",
    "description_zh_hans": "使用韩国产大米烹制的一碗米饭。",
    "description_zh_hant": "使用韓國產稻米烹製的一碗白飯。"
  },
  {
    "id": "20000000-0000-4000-8000-000000000016",
    "category_id": "10000000-0000-4000-8000-000000000004",
    "price": 5000,
    "image_path": null,
    "status": "available",
    "origin_info": [],
    "allergen_codes": [],
    "allergen_review_status": "unreviewed",
    "sort_order": 16,
    "name_ko": "소주",
    "name_en": "Soju",
    "name_zh_hans": "烧酒",
    "name_zh_hant": "燒酒",
    "description_ko": "식사와 함께 곁들이는 소주입니다.",
    "description_en": "Korean soju to accompany your meal.",
    "description_zh_hans": "可搭配餐点享用的韩国烧酒。",
    "description_zh_hant": "可搭配餐點享用的韓國燒酒。"
  },
  {
    "id": "20000000-0000-4000-8000-000000000017",
    "category_id": "10000000-0000-4000-8000-000000000004",
    "price": 5000,
    "image_path": null,
    "status": "available",
    "origin_info": [],
    "allergen_codes": [],
    "allergen_review_status": "unreviewed",
    "sort_order": 17,
    "name_ko": "맥주",
    "name_en": "Beer",
    "name_zh_hans": "啤酒",
    "name_zh_hant": "啤酒",
    "description_ko": "식사와 함께 곁들이는 맥주입니다.",
    "description_en": "Beer to accompany your meal.",
    "description_zh_hans": "可搭配餐点享用的啤酒。",
    "description_zh_hant": "可搭配餐點享用的啤酒。"
  },
  {
    "id": "20000000-0000-4000-8000-000000000018",
    "category_id": "10000000-0000-4000-8000-000000000004",
    "price": 3000,
    "image_path": null,
    "status": "available",
    "origin_info": [],
    "allergen_codes": [],
    "allergen_review_status": "unreviewed",
    "sort_order": 18,
    "name_ko": "막걸리",
    "name_en": "Makgeolli",
    "name_zh_hans": "马格利浊酒",
    "name_zh_hant": "馬格利濁酒",
    "description_ko": "한국 전통 발효주인 막걸리입니다.",
    "description_en": "Makgeolli, a traditional Korean fermented alcoholic drink.",
    "description_zh_hans": "韩国传统发酵酒——马格利浊酒。",
    "description_zh_hant": "韓國傳統發酵酒——馬格利濁酒。"
  },
  {
    "id": "20000000-0000-4000-8000-000000000019",
    "category_id": "10000000-0000-4000-8000-000000000004",
    "price": 2000,
    "image_path": null,
    "status": "available",
    "origin_info": [],
    "allergen_codes": [],
    "allergen_review_status": "unreviewed",
    "sort_order": 19,
    "name_ko": "음료수",
    "name_en": "Soft Drinks",
    "name_zh_hans": "饮料",
    "name_zh_hant": "飲料",
    "description_ko": "콜라·스프라이트·환타(파인) 등의 음료입니다.",
    "description_en": "Soft drinks such as Coca-Cola, Sprite and pineapple Fanta.",
    "description_zh_hans": "可乐、雪碧、菠萝味芬达等饮料。",
    "description_zh_hant": "可樂、雪碧、鳳梨味芬達等飲料。"
  }
];
