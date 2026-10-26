import { useEffect, useRef, useState, type FormEvent } from "react";
import { Plus, Trash2, Upload } from "lucide-react";
import type { AdminCategory, AdminMenu, AdminRepository } from "./types";
import { EditorDialog } from "./Dialogs";
import {
  allergenCodes,
  countryCodes,
  ingredientCodes,
  languageFields,
  statusLabels,
} from "./fields";
import { countryLabel, ingredientLabel } from "../i18n/copy";
import { menuInput, validatePhoto } from "./validation";
import { adminError } from "./repository";

const countries = countryCodes
  .map((code) => ({ code, label: countryLabel(code, "ko") }))
  .sort((a, b) => a.label.localeCompare(b.label, "ko"));

export function MenuEditor({
  item,
  categories,
  repository,
  onSaved,
  onClose,
}: {
  item: AdminMenu;
  categories: AdminCategory[];
  repository: AdminRepository;
  onSaved: () => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState(() => structuredClone(item));
  const [price, setPrice] = useState(String(item.price));
  const [order, setOrder] = useState(String(item.sort_order));
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const uploaded = useRef<{ file: File; url: string } | null>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    if (error) errorRef.current?.focus();
  }, [error]);
  useEffect(() => {
    if (!photo) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(photo);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [photo]);
  const change = (value: Partial<AdminMenu>) => {
    setDraft((previous) => ({ ...previous, ...value }));
    setDirty(true);
  };
  async function save(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    setError("");
    let input;
    try {
      input = menuInput(draft, price, order);
    } catch (error) {
      setError((error as Error).message);
      return;
    }
    setBusy(true);
    try {
      if (photo) {
        if (uploaded.current?.file !== photo)
          uploaded.current = {
            file: photo,
            url: await repository.uploadPhoto(photo),
          };
        input.image_path = uploaded.current.url;
      }
      await repository.saveMenu(item.id, item.version, input);
      onSaved();
    } catch (error) {
      setError(adminError(error));
    } finally {
      setBusy(false);
    }
  }
  function updateOrigin(
    index: number,
    value: Partial<AdminMenu["origin_info"][number]>,
  ) {
    change({
      origin_info: draft.origin_info.map((origin, i) =>
        i === index ? { ...origin, ...value } : origin,
      ),
    });
  }
  return (
    <EditorDialog
      title={item.version ? "메뉴 수정" : "메뉴 등록"}
      description="저장하면 손님 메뉴판의 다음 조회부터 반영됩니다."
      dirty={dirty}
      busy={busy}
      onClose={onClose}
      focusId={item.version ? `edit-${item.id}` : "admin-add-menu"}
    >
      <form className="admin-editor-form" onSubmit={save} noValidate>
        <div className="admin-editor-scroll">
          {error && (
            <p
              role="alert"
              tabIndex={-1}
              ref={errorRef}
              className="admin-error"
            >
              {error}
            </p>
          )}
          <fieldset disabled={busy} className="admin-fields">
            <section className="admin-form-section">
              <h3>기본 정보</h3>
              <div className="admin-form-grid">
                <label>
                  카테고리
                  <select
                    value={draft.category_id}
                    onChange={(event) =>
                      change({ category_id: event.target.value })
                    }
                  >
                    <option value="">선택해 주세요</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name_ko}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  판매 상태
                  <select
                    value={draft.status}
                    onChange={(event) =>
                      change({
                        status: event.target.value as AdminMenu["status"],
                      })
                    }
                  >
                    {Object.entries(statusLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  가격 (원)
                  <input
                    inputMode="numeric"
                    type="number"
                    min="0"
                    step="1"
                    value={price}
                    onChange={(event) => {
                      setPrice(event.target.value);
                      setDirty(true);
                    }}
                  />
                </label>
                <label>
                  정렬 순서
                  <input
                    inputMode="numeric"
                    type="number"
                    min="0"
                    step="1"
                    value={order}
                    onChange={(event) => {
                      setOrder(event.target.value);
                      setDirty(true);
                    }}
                  />
                  <span className="admin-help">작은 숫자부터 표시됩니다.</span>
                </label>
              </div>
            </section>
            <section className="admin-form-section">
              <h3>메뉴명과 설명</h3>
              <p className="admin-help">
                판매 중·품절 메뉴는 네 언어를 모두 입력합니다. 번역 전에는
                숨김으로 저장하세요.
              </p>
              <div className="admin-language-grid">
                {languageFields.map(({ suffix, label }) => (
                  <fieldset key={suffix} className="admin-language-card">
                    <legend>{label}</legend>
                    <label>
                      {label} 메뉴명
                      <input
                        lang={suffix.replace("_", "-")}
                        value={draft[`name_${suffix}`] ?? ""}
                        onChange={(event) =>
                          change({ [`name_${suffix}`]: event.target.value })
                        }
                      />
                    </label>
                    <label>
                      {label} 설명
                      <textarea
                        rows={3}
                        value={draft[`description_${suffix}`] ?? ""}
                        onChange={(event) =>
                          change({
                            [`description_${suffix}`]: event.target.value,
                          })
                        }
                      />
                    </label>
                  </fieldset>
                ))}
              </div>
            </section>
            <section className="admin-form-section">
              <h3>메뉴 사진</h3>
              <div className="admin-photo-editor">
                <div className="admin-photo-preview">
                  {preview || draft.image_path ? (
                    <img
                      src={preview ?? draft.image_path!}
                      alt="메뉴 사진 미리보기"
                    />
                  ) : (
                    <span>사진 없음</span>
                  )}
                </div>
                <div>
                  <label className="admin-upload">
                    <Upload size={17} />
                    사진 파일 선택
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        event.target.value = "";
                        if (!file) return;
                        const message = validatePhoto(file);
                        if (message) {
                          setError(message);
                          return;
                        }
                        setError("");
                        setPhoto(file);
                        setDirty(true);
                      }}
                    />
                  </label>
                  <p className="admin-help">
                    JPG·PNG·WebP, 최대 5MB. 저장할 때 업로드합니다.
                  </p>
                  {photo && (
                    <p className="admin-help">선택한 파일: {photo.name}</p>
                  )}
                  <button
                    type="button"
                    className="admin-text-button"
                    onClick={() => {
                      setPhoto(null);
                      change({ image_path: null });
                    }}
                  >
                    사진 연결 없애기
                  </button>
                </div>
              </div>
              <label>
                사진 주소
                <input
                  type="url"
                  disabled={!!photo}
                  placeholder="https://… 또는 /images/…"
                  value={draft.image_path ?? ""}
                  onChange={(event) =>
                    change({ image_path: event.target.value })
                  }
                />
              </label>
            </section>
            <section className="admin-form-section">
              <div className="admin-section-title">
                <h3>원산지</h3>
                <button
                  type="button"
                  className="admin-button small"
                  disabled={draft.origin_info.length >= ingredientCodes.length}
                  onClick={() => {
                    const code = ingredientCodes.find(
                      (code) =>
                        !draft.origin_info.some(
                          (origin) => origin.ingredient_code === code,
                        ),
                    );
                    if (code)
                      change({
                        origin_info: [
                          ...draft.origin_info,
                          { ingredient_code: code, country_codes: [] },
                        ],
                      });
                  }}
                >
                  <Plus size={15} />
                  재료 추가
                </button>
              </div>
              <p className="admin-help">
                원산지를 확인한 재료만 추가하세요. 제주산 등 지역 표기는 메뉴
                설명에 함께 적어 주세요.
              </p>
              {draft.origin_info.map((origin, index) => (
                <div className="admin-origin-row" key={index}>
                  <label>
                    원산지 재료 {index + 1}
                    <select
                      value={origin.ingredient_code}
                      onChange={(event) =>
                        updateOrigin(index, {
                          ingredient_code: event.target.value,
                        })
                      }
                    >
                      {ingredientCodes.map((code) => (
                        <option
                          value={code}
                          key={code}
                          disabled={draft.origin_info.some(
                            (other, i) =>
                              i !== index && other.ingredient_code === code,
                          )}
                        >
                          {ingredientLabel(code, "ko")}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div>
                    <label>
                      원산지 국가 {index + 1}
                      <select
                        value=""
                        onChange={(event) => {
                          if (event.target.value)
                            updateOrigin(index, {
                              country_codes: [
                                ...origin.country_codes,
                                event.target.value,
                              ],
                            });
                        }}
                      >
                        <option value="">국가 추가</option>
                        {countries
                          .filter(
                            ({ code }) => !origin.country_codes.includes(code),
                          )
                          .map(({ code, label }) => (
                            <option value={code} key={code}>
                              {label}
                            </option>
                          ))}
                      </select>
                    </label>
                    <div className="admin-country-tags">
                      {origin.country_codes.map((code) => (
                        <button
                          type="button"
                          key={code}
                          aria-label={`${ingredientLabel(origin.ingredient_code, "ko")} ${countryLabel(code, "ko")} 원산지 제거`}
                          onClick={() =>
                            updateOrigin(index, {
                              country_codes: origin.country_codes.filter(
                                (other) => other !== code,
                              ),
                            })
                          }
                        >
                          {countryLabel(code, "ko")} ×
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="icon-button"
                    aria-label={`원산지 재료 ${index + 1} 삭제`}
                    onClick={() =>
                      change({
                        origin_info: draft.origin_info.filter(
                          (_, i) => i !== index,
                        ),
                      })
                    }
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              ))}
            </section>
            <section className="admin-form-section">
              <h3>알레르기 정보</h3>
              <label>
                알레르기 검수 상태
                <select
                  value={draft.allergen_review_status}
                  onChange={(event) =>
                    change({
                      allergen_review_status: event.target
                        .value as AdminMenu["allergen_review_status"],
                    })
                  }
                >
                  <option value="unreviewed">미검수 — 직원 확인 필요</option>
                  <option value="reviewed">검수 완료</option>
                </select>
              </label>
              <p className="admin-help">
                재료 확인을 마친 경우에만 검수 완료로 바꿔 주세요. 빈 목록만으로
                알레르기 없음으로 표시하지 않습니다.
              </p>
              <div className="admin-checkbox-grid">
                {allergenCodes.map((code) => (
                  <label key={code}>
                    <input
                      type="checkbox"
                      checked={draft.allergen_codes.includes(code)}
                      onChange={(event) =>
                        change({
                          allergen_codes: event.target.checked
                            ? [...draft.allergen_codes, code]
                            : draft.allergen_codes.filter(
                                (other) => other !== code,
                              ),
                        })
                      }
                    />
                    {ingredientLabel(code, "ko")}
                  </label>
                ))}
              </div>
            </section>
          </fieldset>
        </div>
        <footer className="admin-editor-footer">
          <span className="admin-help">
            {dirty ? "저장하지 않은 변경 내용이 있어요." : ""}
          </span>
          <button
            type="submit"
            className="admin-button primary"
            disabled={busy}
          >
            {busy ? "저장 중…" : "메뉴 저장"}
          </button>
        </footer>
      </form>
    </EditorDialog>
  );
}
