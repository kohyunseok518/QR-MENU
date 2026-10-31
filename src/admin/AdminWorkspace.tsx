import { useEffect, useMemo, useState } from "react";
import {
  ExternalLink,
  LogOut,
  Plus,
  RefreshCw,
  Search,
  Pencil,
  Trash2,
} from "lucide-react";
import { BrandWordmark } from "../components/BrandWordmark";
import { MenuImage } from "../components/MenuImage";
import type {
  AdminCatalog,
  AdminCategory,
  AdminMenu,
  AdminRepository,
} from "./types";
import { CategoryEditor } from "./CategoryEditor";
import { MenuEditor } from "./MenuEditor";
import { ConfirmDialog } from "./Dialogs";
import { adminError } from "./repository";
import { newCategory, newMenu } from "./validation";
import { statusLabels } from "./fields";

export function AdminWorkspace({
  repository,
  email,
  onLogout,
}: {
  repository: AdminRepository;
  email: string;
  onLogout: () => Promise<void>;
}) {
  const [catalog, setCatalog] = useState<AdminCatalog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [revision, setRevision] = useState(0);
  const [tab, setTab] = useState<"menus" | "categories">("menus");
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [editMenu, setEditMenu] = useState<AdminMenu | null>(null);
  const [editCategory, setEditCategory] = useState<AdminCategory | null>(null);
  const [remove, setRemove] = useState<
    | { kind: "menu"; item: AdminMenu }
    | { kind: "category"; item: AdminCategory }
    | null
  >(null);
  const [deleteError, setDeleteError] = useState("");
  const [logout, setLogout] = useState(false);
  const refresh = () => setRevision((value) => value + 1);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    repository.getCatalog(controller.signal).then(
      (data) => {
        if (!controller.signal.aborted) {
          setCatalog(data);
          setLoading(false);
        }
      },
      (error) => {
        if (!controller.signal.aborted) {
          setError(adminError(error));
          setLoading(false);
        }
      },
    );
    return () => controller.abort();
  }, [repository, revision]);
  const categories = catalog?.categories ?? [];
  const items = catalog?.items ?? [];
  const filtered = useMemo(
    () =>
      items.filter((item) => {
        const query = search.trim().toLocaleLowerCase();
        return (
          (!categoryId || item.category_id === categoryId) &&
          (!status || item.status === status) &&
          (!query ||
            [
              item.name_ko,
              item.name_en,
              item.name_zh_hans,
              item.name_zh_hant,
            ].some((name) => name?.toLocaleLowerCase().includes(query)))
        );
      }),
    [items, search, categoryId, status],
  );
  const blocked = busy || loading || !!error;
  async function setItemStatus(item: AdminMenu, value: AdminMenu["status"]) {
    if (blocked) return;
    setBusy(true);
    setNotice("");
    try {
      const updated = await repository.setStatus(item, value);
      setCatalog(
        (previous) =>
          previous && {
            ...previous,
            items: previous.items.map((row) =>
              row.id === updated.id ? updated : row,
            ),
          },
      );
      setNotice(`${item.name_ko}: ${statusLabels[value]} 상태로 변경했어요.`);
    } catch (error) {
      setNotice(adminError(error));
    } finally {
      setBusy(false);
    }
  }
  async function deleteItem() {
    if (!remove || busy) return;
    setBusy(true);
    setDeleteError("");
    try {
      if (remove.kind === "menu") await repository.deleteMenu(remove.item);
      else await repository.deleteCategory(remove.item);
      setRemove(null);
      setNotice("삭제했어요.");
      refresh();
    } catch (error) {
      setDeleteError(adminError(error));
    } finally {
      setBusy(false);
    }
  }
  async function signOut() {
    setBusy(true);
    try {
      await onLogout();
    } catch {
      setNotice(
        "로그아웃하지 못했어요. 연결 상태를 확인하고 다시 시도해 주세요.",
      );
    } finally {
      setBusy(false);
      setLogout(false);
    }
  }
  function saved() {
    setEditMenu(null);
    setEditCategory(null);
    setNotice("저장했어요. 손님 메뉴판을 새로고침하면 반영됩니다.");
    refresh();
  }
  return (
    <div className="admin-shell">
      <header className="admin-header">
        <div className="admin-header-inner">
          <a href="/admin" className="admin-brand" aria-label="바글바글해장국몸국 관리자">
            <BrandWordmark />
            <span>관리자</span>
          </a>
          <div className="admin-header-actions">
            <a
              className="admin-button"
              href="/menu?lang=ko"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink size={15} />
              메뉴판 보기
            </a>
            <button
              className="admin-button"
              aria-label="로그아웃"
              disabled={busy}
              onClick={() => setLogout(true)}
            >
              <LogOut size={15} />
              <span>로그아웃</span>
            </button>
          </div>
        </div>
      </header>
      <main className="admin-main">
        <div className="admin-page-title">
          <div>
            <p className="admin-kicker">메뉴판 관리</p>
            <h1>가게 메뉴</h1>
            <p className="admin-help admin-account">{email}</p>
          </div>
          <button
            className="admin-button"
            disabled={busy || loading}
            onClick={refresh}
          >
            <RefreshCw size={16} className={loading ? "admin-spin" : ""} />
            새로 불러오기
          </button>
        </div>
        <div className="admin-stats" aria-label="메뉴 현황">
          <div>
            <span>전체 메뉴</span>
            <strong>{catalog ? items.length : "—"}</strong>
          </div>
          <div>
            <span>판매 중</span>
            <strong>
              {catalog
                ? items.filter((item) => item.status === "available").length
                : "—"}
            </strong>
          </div>
          <div>
            <span>품절</span>
            <strong>
              {catalog
                ? items.filter((item) => item.status === "sold_out").length
                : "—"}
            </strong>
          </div>
          <div>
            <span>숨김</span>
            <strong>
              {catalog
                ? items.filter((item) => item.status === "hidden").length
                : "—"}
            </strong>
          </div>
        </div>
        <nav className="admin-tabs" aria-label="관리 항목">
          <button
            aria-pressed={tab === "menus"}
            onClick={() => setTab("menus")}
          >
            메뉴 관리
          </button>
          <button
            aria-pressed={tab === "categories"}
            onClick={() => setTab("categories")}
          >
            카테고리 관리
          </button>
        </nav>
        {notice && (
          <div className="admin-notice" role="status">
            {notice}
            <button aria-label="알림 닫기" onClick={() => setNotice("")}>
              ×
            </button>
          </div>
        )}
        {error && (
          <div className="admin-error" role="alert">
            {error}
            <button className="admin-text-button" onClick={refresh}>
              다시 불러오기
            </button>
          </div>
        )}
        {loading && !catalog && (
          <p className="admin-empty" role="status">
            메뉴를 불러오고 있어요…
          </p>
        )}
        {catalog && tab === "menus" && (
          <section aria-label="메뉴 관리 목록">
            <div className="admin-list-heading">
              <p>{filtered.length}개 메뉴</p>
              <button
                id="admin-add-menu"
                className="admin-button primary"
                disabled={blocked || !categories.length}
                onClick={() =>
                  setEditMenu(
                    newMenu(
                      categories[0]!.id,
                      items.reduce(
                        (max, item) => Math.max(max, item.sort_order + 1),
                        0,
                      ),
                    ),
                  )
                }
              >
                <Plus size={17} />
                메뉴 등록
              </button>
            </div>
            {!categories.length && (
              <p className="admin-notice">
                메뉴를 등록하려면 카테고리를 먼저 추가해 주세요.
              </p>
            )}
            <div className="admin-filters">
              <label className="admin-search">
                <span className="sr-only">메뉴 검색</span>
                <Search size={17} />
                <input
                  type="search"
                  placeholder="메뉴 이름 검색"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </label>
              <label>
                <span className="sr-only">카테고리 필터</span>
                <select
                  value={categoryId}
                  onChange={(event) => setCategoryId(event.target.value)}
                >
                  <option value="">전체 카테고리</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name_ko}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span className="sr-only">판매 상태 필터</span>
                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                >
                  <option value="">전체 상태</option>
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="admin-menu-list">
              {filtered.map((item) => (
                <article
                  className="admin-menu-row"
                  key={item.id}
                  aria-label={item.name_ko}
                >
                  <div className="admin-row-photo">
                    <MenuImage
                      key={item.image_path}
                      src={item.image_path}
                      alt=""
                      fallback="사진 없음"
                    />
                  </div>
                  <div className="admin-row-info">
                    <span className="admin-help">
                      {
                        categories.find(
                          (category) => category.id === item.category_id,
                        )?.name_ko
                      }
                    </span>
                    <h2>{item.name_ko}</h2>
                    <p>₩{item.price.toLocaleString("ko-KR")}</p>
                  </div>
                  <label className={`admin-status-select ${item.status}`}>
                    <span className="sr-only">{item.name_ko} 판매 상태</span>
                    <select
                      disabled={blocked}
                      value={item.status}
                      onChange={(event) =>
                        void setItemStatus(
                          item,
                          event.target.value as AdminMenu["status"],
                        )
                      }
                    >
                      {Object.entries(statusLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div className="admin-row-actions">
                    <button
                      id={`edit-${item.id}`}
                      className="admin-button small"
                      disabled={blocked}
                      aria-label={`${item.name_ko} 수정`}
                      onClick={() => setEditMenu(item)}
                    >
                      <Pencil size={15} />
                      수정
                    </button>
                    <button
                      className="icon-button"
                      disabled={blocked}
                      aria-label={`${item.name_ko} 삭제`}
                      onClick={() => {
                        setDeleteError("");
                        setRemove({ kind: "menu", item });
                      }}
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
            {!filtered.length && (
              <p className="admin-empty">
                {items.length
                  ? "조건에 맞는 메뉴가 없어요."
                  : "등록된 메뉴가 없어요. 첫 메뉴를 추가해 보세요."}
              </p>
            )}
          </section>
        )}
        {catalog && tab === "categories" && (
          <section aria-label="카테고리 관리 목록">
            <div className="admin-list-heading">
              <p>{categories.length}개 카테고리</p>
              <button
                id="admin-add-category"
                className="admin-button primary"
                disabled={blocked}
                onClick={() =>
                  setEditCategory(
                    newCategory(
                      categories.reduce(
                        (max, item) => Math.max(max, item.sort_order + 1),
                        0,
                      ),
                    ),
                  )
                }
              >
                <Plus size={17} />
                카테고리 등록
              </button>
            </div>
            <div className="admin-category-list">
              {categories.map((category) => {
                const count = items.filter(
                  (item) => item.category_id === category.id,
                ).length;
                return (
                  <article
                    className="admin-category-row"
                    key={category.id}
                    aria-label={category.name_ko}
                  >
                    <div>
                      <span className="admin-help">
                        순서 {category.sort_order} · 메뉴 {count}개
                      </span>
                      <h2>{category.name_ko}</h2>
                      <p className="admin-help">
                        {category.name_en} · {category.name_zh_hans} ·{" "}
                        {category.name_zh_hant}
                      </p>
                    </div>
                    <div className="admin-row-actions">
                      <button
                        id={`edit-${category.id}`}
                        className="admin-button small"
                        disabled={blocked}
                        aria-label={`${category.name_ko} 카테고리 수정`}
                        onClick={() => setEditCategory(category)}
                      >
                        <Pencil size={15} />
                        수정
                      </button>
                      <button
                        className="icon-button"
                        disabled={blocked || count > 0}
                        title={
                          count
                            ? "메뉴를 먼저 다른 카테고리로 이동해 주세요."
                            : "카테고리 삭제"
                        }
                        aria-label={`${category.name_ko} 카테고리 삭제`}
                        onClick={() => {
                          setDeleteError("");
                          setRemove({ kind: "category", item: category });
                        }}
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
            {!categories.length && (
              <p className="admin-empty">등록된 카테고리가 없어요.</p>
            )}
          </section>
        )}
      </main>
      {editMenu && (
        <MenuEditor
          item={editMenu}
          categories={categories}
          repository={repository}
          onSaved={saved}
          onClose={() => setEditMenu(null)}
        />
      )}
      {editCategory && (
        <CategoryEditor
          category={editCategory}
          repository={repository}
          onSaved={saved}
          onClose={() => setEditCategory(null)}
        />
      )}
      {remove && (
        <ConfirmDialog
          title={
            remove.kind === "menu"
              ? "메뉴를 삭제할까요?"
              : "카테고리를 삭제할까요?"
          }
          confirmLabel="삭제"
          busy={busy}
          error={deleteError}
          onConfirm={() => void deleteItem()}
          onCancel={() => setRemove(null)}
        >
          <strong>{remove.item.name_ko}</strong> 항목을 삭제합니다. 삭제한
          항목은 복구할 수 없습니다.
        </ConfirmDialog>
      )}
      {logout && (
        <ConfirmDialog
          title="로그아웃할까요?"
          confirmLabel="로그아웃"
          busy={busy}
          onConfirm={() => void signOut()}
          onCancel={() => setLogout(false)}
        >
          이 기기의 관리자 세션을 종료합니다.
        </ConfirmDialog>
      )}
    </div>
  );
}
