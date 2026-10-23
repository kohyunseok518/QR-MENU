import { ArrowUpRight } from "lucide-react";
import type { Locale, MenuItem } from "../domain/menu";
import { copy } from "../i18n/copy";
import { formatPrice } from "../i18n/locale";
import { MenuImage } from "./MenuImage";

export function MenuCard({
  item,
  locale,
  onOpen,
  priority,
}: {
  item: MenuItem;
  locale: Locale;
  onOpen: () => void;
  priority: boolean;
}) {
  const t = copy[locale];
  return (
    <button
      type="button"
      className={`menu-card ${item.status === "sold_out" ? "is-sold-out" : ""}`}
      onClick={onOpen}
      aria-label={`${item.name[locale]} · ${formatPrice(item.price, locale)} · ${t.details}${item.status === "sold_out" ? ` · ${t.soldOut}` : ""}`}
    >
      <span className="card-image">
        <MenuImage
          key={item.imageUrl}
          src={item.imageUrl}
          alt=""
          fallback={t.photoMissing}
          priority={priority}
        />
        {item.status === "sold_out" && (
          <span className="sold-out-badge">{t.soldOut}</span>
        )}
        <span className="image-arrow" aria-hidden="true">
          <ArrowUpRight size={19} />
        </span>
      </span>
      <span className="card-body">
        <span className="card-name">{item.name[locale]}</span>
        <span className="card-bottom">
          <span className="card-price">{formatPrice(item.price, locale)}</span>
          <span className="card-detail">
            {t.details}
            <ArrowUpRight size={13} aria-hidden="true" />
          </span>
        </span>
      </span>
    </button>
  );
}
