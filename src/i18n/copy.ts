import type { Locale, LocalizedText } from "../domain/menu";

interface Copy {
  restaurant: string;
  tagline: string;
  all: string;
  menu: string;
  details: string;
  soldOut: string;
  language: string;
  close: string;
  origins: string;
  allergens: string;
  originUnknown: string;
  allergenUnknown: string;
  allergenNone: string;
  allergenCheck: string;
  perServing: string;
  loading: string;
  errorTitle: string;
  errorDescription: string;
  retry: string;
  emptyTitle: string;
  emptyDescription: string;
  photoMissing: string;
  skip: string;
  category: string;
  originalName: string;
}

export const copy: Record<Locale, Copy> = {
  ko: {
    restaurant: "바글바글해장국몸국",
    tagline: "정성을 담은 한 끼",
    all: "전체",
    menu: "메뉴",
    details: "자세히 보기",
    soldOut: "오늘은 품절",
    language: "언어 선택",
    close: "닫기",
    origins: "재료 원산지",
    allergens: "알레르기 정보",
    originUnknown: "원산지 정보는 직원에게 확인해 주세요.",
    allergenUnknown: "알레르기 정보 확인이 필요해요.",
    allergenNone: "등록된 알레르기 유발 재료가 없어요.",
    allergenCheck: "알레르기가 있다면 주문 전 직원에게 꼭 확인해 주세요.",
    perServing: "1인분 기준",
    loading: "정성껏 메뉴를 준비하고 있어요",
    errorTitle: "메뉴를 불러오지 못했어요",
    errorDescription: "연결 상태를 확인한 후 다시 시도해 주세요.",
    retry: "다시 불러오기",
    emptyTitle: "메뉴를 준비하고 있어요",
    emptyDescription: "잠시 후 다시 찾아주세요.",
    photoMissing: "사진 준비 중",
    skip: "메뉴로 바로가기",
    category: "메뉴 종류",
    originalName: "한국어 메뉴명",
  },
  en: {
    restaurant: "바글바글해장국몸국",
    tagline: "A meal made with care",
    all: "All",
    menu: "Our menu",
    details: "View details",
    soldOut: "Sold out today",
    language: "Choose language",
    close: "Close",
    origins: "Ingredient origins",
    allergens: "Allergen information",
    originUnknown: "Please ask our staff about ingredient origins.",
    allergenUnknown: "Allergen information needs confirmation.",
    allergenNone: "No allergenic ingredients are listed.",
    allergenCheck:
      "If you have an allergy, please check with our team before ordering.",
    perServing: "Per serving",
    loading: "Preparing your menu",
    errorTitle: "We couldn’t load the menu",
    errorDescription: "Please check your connection and try again.",
    retry: "Try again",
    emptyTitle: "Our menu is being prepared",
    emptyDescription: "Please check back shortly.",
    photoMissing: "Photo coming soon",
    skip: "Skip to menu",
    category: "Menu categories",
    originalName: "Korean menu name",
  },
  "zh-Hans": {
    restaurant: "바글바글해장국몸국",
    tagline: "用心做的一餐",
    all: "全部",
    menu: "菜单",
    details: "查看详情",
    soldOut: "今日售罄",
    language: "选择语言",
    close: "关闭",
    origins: "食材产地",
    allergens: "过敏原信息",
    originUnknown: "食材产地请向店员确认。",
    allergenUnknown: "过敏原信息需要进一步确认。",
    allergenNone: "未登记含过敏原的食材。",
    allergenCheck: "如有食物过敏，请在点餐前向店员确认。",
    perServing: "每份",
    loading: "正在准备菜单",
    errorTitle: "暂时无法加载菜单",
    errorDescription: "请检查网络连接后重试。",
    retry: "重新加载",
    emptyTitle: "菜单正在准备中",
    emptyDescription: "请稍后再来看看。",
    photoMissing: "图片准备中",
    skip: "跳转到菜单",
    category: "菜品分类",
    originalName: "韩语菜名",
  },
  "zh-Hant": {
    restaurant: "바글바글해장국몸국",
    tagline: "用心做的一餐",
    all: "全部",
    menu: "菜單",
    details: "查看詳情",
    soldOut: "今日售罄",
    language: "選擇語言",
    close: "關閉",
    origins: "食材產地",
    allergens: "過敏原資訊",
    originUnknown: "食材產地請向店員確認。",
    allergenUnknown: "過敏原資訊需要進一步確認。",
    allergenNone: "未登記含過敏原的食材。",
    allergenCheck: "如有食物過敏，請在點餐前向店員確認。",
    perServing: "每份",
    loading: "正在準備菜單",
    errorTitle: "暫時無法載入菜單",
    errorDescription: "請檢查網路連線後重試。",
    retry: "重新載入",
    emptyTitle: "菜單正在準備中",
    emptyDescription: "請稍後再來看看。",
    photoMissing: "圖片準備中",
    skip: "跳至菜單",
    category: "餐點分類",
    originalName: "韓語菜名",
  },
};

const dictionary: Record<string, LocalizedText> = {
  chicken: {
    ko: "닭고기",
    en: "Chicken",
    "zh-Hans": "鸡肉",
    "zh-Hant": "雞肉",
  },
  chili_powder: {
    ko: "고춧가루",
    en: "Chili powder",
    "zh-Hans": "辣椒粉",
    "zh-Hant": "辣椒粉",
  },
  milk: { ko: "우유", en: "Milk", "zh-Hans": "牛奶", "zh-Hant": "牛奶" },
  buckwheat: {
    ko: "메밀",
    en: "Buckwheat",
    "zh-Hans": "荞麦",
    "zh-Hant": "蕎麥",
  },
  peanut: { ko: "땅콩", en: "Peanut", "zh-Hans": "花生", "zh-Hant": "花生" },
  mackerel: {
    ko: "고등어",
    en: "Mackerel",
    "zh-Hans": "鲭鱼",
    "zh-Hant": "鯖魚",
  },
  crab: { ko: "게", en: "Crab", "zh-Hans": "蟹", "zh-Hant": "蟹" },
  peach: { ko: "복숭아", en: "Peach", "zh-Hans": "桃", "zh-Hant": "桃" },
  tomato: { ko: "토마토", en: "Tomato", "zh-Hans": "番茄", "zh-Hant": "番茄" },
  sulfites: {
    ko: "아황산류",
    en: "Sulfites",
    "zh-Hans": "亚硫酸盐",
    "zh-Hant": "亞硫酸鹽",
  },
  walnut: { ko: "호두", en: "Walnut", "zh-Hans": "核桃", "zh-Hant": "核桃" },
  pine_nut: { ko: "잣", en: "Pine nut", "zh-Hans": "松子", "zh-Hant": "松子" },
  beef: { ko: "소고기", en: "Beef", "zh-Hans": "牛肉", "zh-Hant": "牛肉" },
  pork: { ko: "돼지고기", en: "Pork", "zh-Hans": "猪肉", "zh-Hant": "豬肉" },
  rice: { ko: "쌀", en: "Rice", "zh-Hans": "大米", "zh-Hant": "稻米" },
  kimchi_cabbage: {
    ko: "김치 배추",
    en: "Kimchi cabbage",
    "zh-Hans": "泡菜白菜",
    "zh-Hant": "泡菜白菜",
  },
  egg: { ko: "달걀", en: "Egg", "zh-Hans": "鸡蛋", "zh-Hant": "雞蛋" },
  soybean: { ko: "대두", en: "Soy", "zh-Hans": "大豆", "zh-Hant": "大豆" },
  wheat: { ko: "밀", en: "Wheat", "zh-Hans": "小麦", "zh-Hant": "小麥" },
  shrimp: { ko: "새우", en: "Shrimp", "zh-Hans": "虾", "zh-Hant": "蝦" },
  squid: { ko: "오징어", en: "Squid", "zh-Hans": "鱿鱼", "zh-Hant": "魷魚" },
  shellfish: {
    ko: "조개류",
    en: "Shellfish",
    "zh-Hans": "贝类",
    "zh-Hant": "貝類",
  },
};

export function ingredientLabel(code: string, locale: Locale): string {
  return dictionary[code]?.[locale] ?? copy[locale].allergenUnknown;
}

export function countryLabel(code: string, locale: Locale): string {
  try {
    const value = new Intl.DisplayNames([locale], { type: "region" }).of(code);
    return value && value !== code ? value : copy[locale].originUnknown;
  } catch {
    return copy[locale].originUnknown;
  }
}
