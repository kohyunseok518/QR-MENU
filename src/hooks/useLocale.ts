import { useEffect, useState } from "react";
import { copy } from "../i18n/copy";
import { initialLocale, localeStorageKey } from "../i18n/locale";
import type { Locale } from "../domain/menu";

export function useLocale() {
  const [locale, setLocale] = useState<Locale>(initialLocale);
  const [historyRevision, setHistoryRevision] = useState(0);
  useEffect(() => {
    const onPop = () => setHistoryRevision(value => value + 1);
    addEventListener("popstate", onPop);
    return () => removeEventListener("popstate", onPop);
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(localeStorageKey, locale);
    } catch {
      /* Selection still works without storage. */
    }
    const syncPageLanguage = () => {
      document.documentElement.lang = locale;
      document.title = `${copy[locale].restaurant} · ${copy[locale].tagline}`;
      const url = new URL(window.location.href);
      url.searchParams.set("lang", locale);
      history.replaceState(history.state, "", url);
    };
    syncPageLanguage();
  }, [locale, historyRevision]);
  return { locale, setLocale, t: copy[locale] };
}
