import { useRef, useState } from "react";
import {
  Coffee,
  LayoutGrid,
  Leaf,
  RefreshCw,
  Soup,
  Utensils,
  CircleAlert,
} from "lucide-react";
import { BrandMark } from "./components/BrandMark";
import { BrandWordmark } from "./components/BrandWordmark";
import { LanguageSelect } from "./components/LanguageSelect";
import { MenuCard } from "./components/MenuCard";
import { MenuDetail } from "./components/MenuDetail";
import { useLocale } from "./hooks/useLocale";
import { useMenuCatalog } from "./hooks/useMenuCatalog";
import { useMenuDialog } from "./hooks/useMenuDialog";
import "./styles.css";

const categoryIcons = [Utensils, Soup, Leaf, Coffee];

export default function App() {
  const { locale, setLocale, t } = useLocale();
  const { state, reload } = useMenuCatalog();
  const dialog = useMenuDialog();
  const [categoryId, setCategoryId] = useState("all");
  const menuStart = useRef<HTMLElement>(null);
  const catalog = state.status === "ready" ? state.catalog : null;
  const selectedCategory = catalog?.categories.find(
    (category) => category.id === categoryId,
  );
  const visibleItems =
    catalog?.items.filter(
      (item) => !selectedCategory || item.categoryId === selectedCategory.id,
    ) ?? [];
  const selectedItem =
    catalog?.items.find((item) => item.id === dialog.selectedId) ?? null;
  function selectCategory(id: string, button: HTMLButtonElement) {
    setCategoryId(id);
    button.scrollIntoView({
      block: "nearest",
      inline: "nearest",
      behavior: "auto",
    });
    if (
      menuStart.current &&
      menuStart.current.getBoundingClientRect().top < 0
    )
      menuStart.current.scrollIntoView({ block: "start", behavior: "auto" });
  }
  return (
    <>
      <a className="skip-link" href="#menu">
        {t.skip}
      </a>
      <header className="site-header container">
        <a
          className="brand"
          href={`/menu?lang=${locale}`}
          aria-label={t.restaurant}
        >
          <BrandWordmark />
        </a>
        <LanguageSelect locale={locale} onChange={setLocale} />
      </header>
      <main id="menu" ref={menuStart} tabIndex={-1} aria-labelledby="menu-heading">
        <h1 id="menu-heading" className="sr-only">
          {t.menu}
        </h1>
        <nav className="category-nav" aria-label={t.category}>
          <div className="container category-scroll">
            <button
              className={`category-button ${!selectedCategory ? "active" : ""}`}
              aria-pressed={!selectedCategory}
              onClick={(event) => selectCategory("all", event.currentTarget)}
            >
              <LayoutGrid size={16} aria-hidden="true" />
              {t.all}
            </button>
            {catalog?.categories.map((category, index) => {
              const Icon = categoryIcons[index] ?? Utensils;
              return (
                <button
                  key={category.id}
                  className={`category-button ${selectedCategory?.id === category.id ? "active" : ""}`}
                  aria-pressed={selectedCategory?.id === category.id}
                  onClick={(event) =>
                    selectCategory(category.id, event.currentTarget)
                  }
                >
                  <Icon size={17} aria-hidden="true" />
                  {category.name[locale]}
                </button>
              );
            })}
          </div>
        </nav>
        <section
          className="menu-section container"
          aria-label={selectedCategory?.name[locale] ?? t.menu}
          aria-busy={state.status === "loading"}
        >
          {state.status === "loading" && (
            <>
              <p className="sr-only" role="status">
                {t.loading}
              </p>
              <div className="menu-grid" aria-hidden="true">
                {Array.from({ length: 8 }, (_, index) => (
                  <div className="skeleton-card" key={index}>
                    <span />
                    <i />
                    <i />
                  </div>
                ))}
              </div>
            </>
          )}
          {state.status === "error" && (
            <div className="state-message" role="alert">
              <CircleAlert size={32} />
              <h3>{t.errorTitle}</h3>
              <p>{t.errorDescription}</p>
              <button className="retry-button" onClick={reload}>
                <RefreshCw size={15} />
                {t.retry}
              </button>
            </div>
          )}
          {catalog &&
            (visibleItems.length ? (
              <div className="menu-grid">
                {visibleItems.map((item, index) => (
                  <MenuCard
                    key={item.id}
                    item={item}
                    locale={locale}
                    priority={index < 2}
                    onOpen={() => dialog.open(item.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="state-message">
                <BrandMark />
                <h3>{t.emptyTitle}</h3>
                <p>{t.emptyDescription}</p>
              </div>
            ))}
        </section>
      </main>
      <MenuDetail
        item={selectedItem}
        locale={locale}
        setLocale={setLocale}
        close={dialog.close}
        restoreFocus={dialog.restoreFocus}
      />
    </>
  );
}
