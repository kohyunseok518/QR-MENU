import { ChevronDown, Globe } from "lucide-react";
import { locales, type Locale } from "../domain/menu";
import { copy } from "../i18n/copy";
import { localeLabels } from "../i18n/locale";

export function LanguageSelect({
  locale,
  onChange,
  compact = false,
}: {
  locale: Locale;
  onChange: (value: Locale) => void;
  compact?: boolean;
}) {
  return (
    <label className={`language-select ${compact ? "compact" : ""}`}>
      <Globe size={16} aria-hidden="true" />
      <select
        value={locale}
        onChange={(event) => onChange(event.target.value as Locale)}
        aria-label={copy[locale].language}
      >
        {locales.map((value) => (
          <option key={value} value={value}>
            {localeLabels[value]}
          </option>
        ))}
      </select>
      <ChevronDown size={13} aria-hidden="true" />
    </label>
  );
}
