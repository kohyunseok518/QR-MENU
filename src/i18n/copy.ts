import type { Locale, LocalizedText } from '../domain/menu';

interface Copy {
  restaurant: string; tagline: string; heroEyebrow: string; heroTitle: string;
  heroDescription: string; orderNote: string; all: string; menu: string;
  menuCount: (count: number) => string; details: string; soldOut: string;
  language: string; close: string; description: string; origins: string;
  allergens: string; originUnknown: string; allergenUnknown: string;
  allergenNone: string; allergenCheck: string; perServing: string;
  loading: string; errorTitle: string; errorDescription: string; retry: string;
  emptyTitle: string; emptyDescription: string; photoMissing: string;
  sample: string; credits: string; skip: string; category: string;
  footerLine: string; stamp: string; originalName: string;
}

export const copy: Record<Locale, Copy> = {
  ko: {
    restaurant: '소담식당', tagline: '정성을 담은 한 끼', heroEyebrow: '좋은 재료, 소박한 정성',
    heroTitle: '오늘도, 따뜻한 한 끼.',
    heroDescription: '익숙한 맛에 정성을 더했습니다.\n소담하게 차린 우리 식탁에 오신 걸 환영해요.',
    orderNote: '주문은 직원에게 말씀해 주세요.', all: '전체', menu: '메뉴',
    menuCount: n => `${n}가지의 정성`, details: '자세히 보기', soldOut: '오늘은 품절',
    language: '언어 선택', close: '닫기', description: '이런 메뉴예요', origins: '재료 원산지',
    allergens: '알레르기 정보', originUnknown: '원산지 정보를 확인하고 있어요.',
    allergenUnknown: '알레르기 정보 확인이 필요해요.', allergenNone: '등록된 알레르기 유발 재료가 없어요.',
    allergenCheck: '알레르기가 있다면 주문 전 직원에게 꼭 확인해 주세요.', perServing: '1인분 기준',
    loading: '정성껏 메뉴를 준비하고 있어요', errorTitle: '메뉴를 불러오지 못했어요',
    errorDescription: '연결 상태를 확인한 후 다시 시도해 주세요.', retry: '다시 불러오기',
    emptyTitle: '메뉴를 준비하고 있어요', emptyDescription: '잠시 후 다시 찾아주세요.',
    photoMissing: '사진 준비 중', sample: '디자인 확인용 샘플 메뉴판입니다.', credits: '사진 출처',
    skip: '메뉴로 바로가기', category: '메뉴 종류', footerLine: '좋은 한 끼가, 좋은 하루로.', stamp: '소담한 한 상', originalName: '한국어 메뉴명',
  },
  en: {
    restaurant: 'Sodam', tagline: 'A meal made with care', heroEyebrow: 'HONEST INGREDIENTS. WARM HEARTS.',
    heroTitle: 'A little comfort, served warm.',
    heroDescription: 'Familiar Korean flavors, thoughtfully prepared.\nThere’s always a place for you at our table.',
    orderNote: 'Please order with a member of our team.', all: 'All', menu: 'Our menu',
    menuCount: n => `${n} dishes, made with care`, details: 'View details', soldOut: 'Sold out today',
    language: 'Choose language', close: 'Close', description: 'About this dish', origins: 'Ingredient origins',
    allergens: 'Allergen information', originUnknown: 'Origin information is being checked.',
    allergenUnknown: 'Allergen information needs confirmation.', allergenNone: 'No allergenic ingredients are listed.',
    allergenCheck: 'If you have an allergy, please check with our team before ordering.', perServing: 'Per serving',
    loading: 'Preparing your menu', errorTitle: 'We couldn’t load the menu',
    errorDescription: 'Please check your connection and try again.', retry: 'Try again',
    emptyTitle: 'Our menu is being prepared', emptyDescription: 'Please check back shortly.',
    photoMissing: 'Photo coming soon', sample: 'A sample menu for design preview.', credits: 'Photo credits',
    skip: 'Skip to menu', category: 'Menu categories', footerLine: 'A good meal. A better day.', stamp: 'Made with care', originalName: 'Korean menu name',
  },
  'zh-Hans': {
    restaurant: 'Sodam 食堂', tagline: '用心做的一餐', heroEyebrow: '好食材，暖心意',
    heroTitle: '今天，也要好好吃饭。',
    heroDescription: '用心烹调熟悉的韩式滋味。\n欢迎来到我们温暖的餐桌。',
    orderNote: '点餐请告知店员。', all: '全部', menu: '菜单',
    menuCount: n => `${n} 道用心之作`, details: '查看详情', soldOut: '今日售罄',
    language: '选择语言', close: '关闭', description: '菜品介绍', origins: '食材产地',
    allergens: '过敏原信息', originUnknown: '正在确认食材产地。',
    allergenUnknown: '过敏原信息需要进一步确认。', allergenNone: '未登记含过敏原的食材。',
    allergenCheck: '如有食物过敏，请在点餐前向店员确认。', perServing: '每份',
    loading: '正在准备菜单', errorTitle: '暂时无法加载菜单',
    errorDescription: '请检查网络连接后重试。', retry: '重新加载',
    emptyTitle: '菜单正在准备中', emptyDescription: '请稍后再来看看。',
    photoMissing: '图片准备中', sample: '本菜单为设计预览示例。', credits: '图片来源',
    skip: '跳转到菜单', category: '菜品分类', footerLine: '好好吃饭，好好生活。', stamp: '用心的一餐', originalName: '韩语菜名',
  },
  'zh-Hant': {
    restaurant: 'Sodam 食堂', tagline: '用心做的一餐', heroEyebrow: '好食材，暖心意',
    heroTitle: '今天，也要好好吃飯。',
    heroDescription: '用心烹調熟悉的韓式滋味。\n歡迎來到我們溫暖的餐桌。',
    orderNote: '點餐請告知店員。', all: '全部', menu: '菜單',
    menuCount: n => `${n} 道用心之作`, details: '查看詳情', soldOut: '今日售罄',
    language: '選擇語言', close: '關閉', description: '餐點介紹', origins: '食材產地',
    allergens: '過敏原資訊', originUnknown: '正在確認食材產地。',
    allergenUnknown: '過敏原資訊需要進一步確認。', allergenNone: '未登記含過敏原的食材。',
    allergenCheck: '如有食物過敏，請在點餐前向店員確認。', perServing: '每份',
    loading: '正在準備菜單', errorTitle: '暫時無法載入菜單',
    errorDescription: '請檢查網路連線後重試。', retry: '重新載入',
    emptyTitle: '菜單正在準備中', emptyDescription: '請稍後再來看看。',
    photoMissing: '圖片準備中', sample: '本菜單為設計預覽範例。', credits: '圖片來源',
    skip: '跳至菜單', category: '餐點分類', footerLine: '好好吃飯，好好生活。', stamp: '用心的一餐', originalName: '韓語菜名',
  },
};

const dictionary: Record<string, LocalizedText> = {
  beef: { ko: '소고기', en: 'Beef', 'zh-Hans': '牛肉', 'zh-Hant': '牛肉' },
  pork: { ko: '돼지고기', en: 'Pork', 'zh-Hans': '猪肉', 'zh-Hant': '豬肉' },
  rice: { ko: '쌀', en: 'Rice', 'zh-Hans': '大米', 'zh-Hant': '稻米' },
  kimchi_cabbage: { ko: '김치 배추', en: 'Kimchi cabbage', 'zh-Hans': '泡菜白菜', 'zh-Hant': '泡菜白菜' },
  egg: { ko: '달걀', en: 'Egg', 'zh-Hans': '鸡蛋', 'zh-Hant': '雞蛋' },
  soybean: { ko: '대두', en: 'Soy', 'zh-Hans': '大豆', 'zh-Hant': '大豆' },
  wheat: { ko: '밀', en: 'Wheat', 'zh-Hans': '小麦', 'zh-Hant': '小麥' },
  shrimp: { ko: '새우', en: 'Shrimp', 'zh-Hans': '虾', 'zh-Hant': '蝦' },
  squid: { ko: '오징어', en: 'Squid', 'zh-Hans': '鱿鱼', 'zh-Hant': '魷魚' },
  shellfish: { ko: '조개류', en: 'Shellfish', 'zh-Hans': '贝类', 'zh-Hant': '貝類' },
};

export function ingredientLabel(code: string, locale: Locale): string {
  return dictionary[code]?.[locale] ?? copy[locale].allergenUnknown;
}

export function countryLabel(code: string, locale: Locale): string {
  try {
    const value = new Intl.DisplayNames([locale], { type: 'region' }).of(code);
    return value && value !== code ? value : copy[locale].originUnknown;
  } catch { return copy[locale].originUnknown; }
}
