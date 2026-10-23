import * as Dialog from "@radix-ui/react-dialog";
import { CircleAlert, MapPin, X } from "lucide-react";
import type { Locale, MenuItem } from "../domain/menu";
import { copy, countryLabel, ingredientLabel } from "../i18n/copy";
import { formatPrice } from "../i18n/locale";
import { LanguageSelect } from "./LanguageSelect";
import { MenuImage } from "./MenuImage";

interface Props {
  item: MenuItem | null;
  locale: Locale;
  setLocale: (locale: Locale) => void;
  close: () => void;
  restoreFocus: (event: Event) => void;
}

export function MenuDetail({
  item,
  locale,
  setLocale,
  close,
  restoreFocus,
}: Props) {
  const t = copy[locale];
  return (
    <Dialog.Root
      open={item !== null}
      onOpenChange={(open) => {
        if (!open) close();
      }}
    >
      {item && (
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-overlay" />
          <Dialog.Content
            className="dialog-content"
            onCloseAutoFocus={restoreFocus}
          >
            <div className="dialog-toolbar">
              <span className="detail-eyebrow">{t.details}</span>
              <div className="dialog-tools">
                <LanguageSelect locale={locale} onChange={setLocale} compact />
                <Dialog.Close asChild>
                  <button className="icon-button" aria-label={t.close}>
                    <X size={21} />
                  </button>
                </Dialog.Close>
              </div>
            </div>
            <div className="detail-image">
              <MenuImage
                key={item.imageUrl}
                src={item.imageUrl}
                alt={item.name[locale]}
                fallback={t.photoMissing}
                priority
              />
            </div>
            <div className="detail-body">
              <div className="detail-title-row">
                <Dialog.Title className="detail-title">
                  {item.name[locale]}
                </Dialog.Title>
                {item.status === "sold_out" && (
                  <span className="detail-sold-out">{t.soldOut}</span>
                )}
              </div>
              <p className="detail-price">{formatPrice(item.price, locale)}</p>
              <section className="detail-description">
                <Dialog.Description>
                  {item.description[locale]}
                </Dialog.Description>
              </section>
              <div className="detail-information">
                <section>
                  <h3>
                    <MapPin size={15} aria-hidden="true" />
                    {t.origins}
                  </h3>
                  {item.origins.length ? (
                    <dl className="origin-list">
                      {item.origins.map((origin) => (
                        <div key={origin.ingredient_code}>
                          <dt>
                            {ingredientLabel(origin.ingredient_code, locale)}
                          </dt>
                          <dd>
                            {origin.country_codes
                              .map((code) => countryLabel(code, locale))
                              .join(", ")}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  ) : (
                    <p className="muted-text">{t.originUnknown}</p>
                  )}
                </section>
                <section>
                  <h3>
                    <CircleAlert size={15} aria-hidden="true" />
                    {t.allergens}
                  </h3>
                  {item.allergens.length > 0 && (
                    <ul className="allergen-tags">
                      {item.allergens.map((code) => (
                        <li key={code}>{ingredientLabel(code, locale)}</li>
                      ))}
                    </ul>
                  )}
                  {item.allergenReviewStatus === "unreviewed" ? (
                    <p className="muted-text">{t.allergenUnknown}</p>
                  ) : (
                    item.allergens.length === 0 && (
                      <p className="muted-text">{t.allergenNone}</p>
                    )
                  )}
                </section>
              </div>
              <p className="allergen-note">
                <CircleAlert size={15} aria-hidden="true" />
                <span>{t.allergenCheck}</span>
              </p>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      )}
    </Dialog.Root>
  );
}
