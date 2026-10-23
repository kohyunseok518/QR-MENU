import { locales, type Locale } from '../domain/menu';

export const localeLabels: Record<Locale, string> = {
  ko: '한국어', en: 'English', 'zh-Hans': '简体中文', 'zh-Hant': '繁體中文',
};
export const localeStorageKey = 'sodam-menu-language';

export function matchLocale(value: string | null | undefined): Locale | null {
  if (!value) return null;
  try {
    const parsed = new Intl.Locale(value);
    if (parsed.language === 'ko') return 'ko';
    if (parsed.language === 'en') return 'en';
    if (parsed.language !== 'zh') return null;
    if (parsed.script === 'Hant') return 'zh-Hant';
    if (parsed.script === 'Hans') return 'zh-Hans';
    return ['TW', 'HK', 'MO'].includes(parsed.region ?? '') ? 'zh-Hant' : 'zh-Hans';
  } catch { return null; }
}

export function resolveLocale(search: string, stored: string | null, browserLanguages: readonly string[]): Locale {
  const candidates = [new URLSearchParams(search).get('lang'), stored, ...browserLanguages];
  for (const candidate of candidates) {
    const match = matchLocale(candidate);
    if (match) return match;
  }
  return locales[0];
}

export function initialLocale(): Locale {
  let stored: string | null = null;
  try { stored = window.localStorage.getItem(localeStorageKey); } catch { /* Private browsing can disable storage. */ }
  return resolveLocale(window.location.search, stored, navigator.languages);
}

export function formatPrice(price: number, locale: Locale): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency', currency: 'KRW', maximumFractionDigits: 0,
  }).format(price);
}
