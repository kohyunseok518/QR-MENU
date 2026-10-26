import { useRef, useEffect, useState, type FormEvent } from "react";
import type { AdminCategory, AdminRepository } from "./types";
import { EditorDialog } from "./Dialogs";
import { languageFields } from "./fields";
import { categoryInput } from "./validation";
import { adminError } from "./repository";

export function CategoryEditor({
  category,
  repository,
  onSaved,
  onClose,
}: {
  category: AdminCategory;
  repository: AdminRepository;
  onSaved: () => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState({ ...category });
  const [order, setOrder] = useState(String(category.sort_order));
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const errorRef = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    if (error) errorRef.current?.focus();
  }, [error]);
  async function save(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    setError("");
    let input;
    try {
      input = categoryInput(draft, order);
    } catch (error) {
      setError((error as Error).message);
      return;
    }
    setBusy(true);
    try {
      await repository.saveCategory(category.id, category.version, input);
      onSaved();
    } catch (error) {
      setError(adminError(error));
    } finally {
      setBusy(false);
    }
  }
  return (
    <EditorDialog
      title={category.version ? "카테고리 수정" : "카테고리 등록"}
      description="카테고리는 네 언어 이름을 모두 입력합니다."
      dirty={dirty}
      busy={busy}
      onClose={onClose}
      focusId={category.version ? `edit-${category.id}` : "admin-add-category"}
    >
      <form className="admin-editor-form" onSubmit={save} noValidate>
        <div className="admin-editor-scroll">
          {error && (
            <p
              className="admin-error"
              role="alert"
              tabIndex={-1}
              ref={errorRef}
            >
              {error}
            </p>
          )}
          <fieldset disabled={busy} className="admin-fields admin-form-grid">
            {languageFields.map(({ suffix, label }) => (
              <label key={suffix}>
                {label} 카테고리명
                <input
                  value={draft[`name_${suffix}`]}
                  onChange={(event) => {
                    setDraft({
                      ...draft,
                      [`name_${suffix}`]: event.target.value,
                    });
                    setDirty(true);
                  }}
                />
              </label>
            ))}
            <label>
              정렬 순서
              <input
                type="number"
                min="0"
                step="1"
                inputMode="numeric"
                value={order}
                onChange={(event) => {
                  setOrder(event.target.value);
                  setDirty(true);
                }}
              />
              <span className="admin-help">작은 숫자부터 표시됩니다.</span>
            </label>
          </fieldset>
        </div>
        <footer className="admin-editor-footer">
          <span className="admin-help">
            {dirty ? "저장하지 않은 변경 내용이 있어요." : ""}
          </span>
          <button
            className="admin-button primary"
            disabled={busy}
            type="submit"
          >
            {busy ? "저장 중…" : "카테고리 저장"}
          </button>
        </footer>
      </form>
    </EditorDialog>
  );
}
