// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  render,
  screen,
  within,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AdminWorkspace } from "./AdminWorkspace";
import { categoryRows, menuRows } from "../data/restaurantMenu";
import type { AdminRepository } from "./types";
import { ConflictError } from "./repository";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
function setup() {
  const catalog = {
    categories: categoryRows.map((row) => ({ ...row, version: 1 })),
    items: menuRows.map((row) => ({ ...row, version: 1 })),
  };
  const repository = {
    getCatalog: vi.fn(async () => structuredClone(catalog)),
    saveMenu: vi.fn(async (id, _version, input) => ({
      ...input,
      id,
      version: 2,
    })),
    setStatus: vi.fn(async (item, status) => ({ ...item, status, version: 2 })),
    deleteMenu: vi.fn(async () => {}),
    saveCategory: vi.fn(async (id, _version, input) => ({
      ...input,
      id,
      version: 2,
    })),
    deleteCategory: vi.fn(async () => {}),
    uploadPhoto: vi.fn(async () => "https://example.test/photo.jpg"),
  } satisfies AdminRepository;
  const logout = vi.fn(async () => {});
  render(
    <AdminWorkspace
      repository={repository}
      email="admin@example.test"
      onLogout={logout}
    />,
  );
  return { repository, logout, user: userEvent.setup() };
}

describe("administrator workflows", () => {
  it("uploads a selected photo once and reuses it when retrying a failed save", async () => {
    const createObjectURL = vi.fn(() => "blob:menu-preview");
    const revokeObjectURL = vi.fn();
    vi.stubGlobal(
      "URL",
      class extends URL {
        static createObjectURL = createObjectURL;
        static revokeObjectURL = revokeObjectURL;
      },
    );
    const { user, repository } = setup();
    repository.saveMenu.mockRejectedValueOnce(new Error("network error"));
    await user.click(
      await screen.findByRole("button", { name: "해장국 수정" }),
    );
    await user.upload(
      screen.getByLabelText("사진 파일 선택"),
      new File(["test"], "menu.jpg", { type: "image/jpeg" }),
    );
    await user.click(screen.getByRole("button", { name: "메뉴 저장" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "요청을 완료하지 못했어요",
    );
    expect(repository.uploadPhoto).toHaveBeenCalledTimes(1);
    await user.click(screen.getByRole("button", { name: "메뉴 저장" }));
    await waitFor(() => expect(repository.saveMenu).toHaveBeenCalledTimes(2));
    expect(repository.uploadPhoto).toHaveBeenCalledTimes(1);
    expect(repository.saveMenu).toHaveBeenLastCalledWith(
      menuRows[0]!.id,
      1,
      expect.objectContaining({ image_path: "https://example.test/photo.jpg" }),
    );
  });
  it("loads all menus, searches and changes sold-out status", async () => {
    const { user, repository } = setup();
    await screen.findByRole("article", { name: "해장국" });
    await user.type(
      screen.getByRole("searchbox", { name: "메뉴 검색" }),
      "몸국",
    );
    expect(screen.getAllByRole("article")).toHaveLength(1);
    await user.selectOptions(
      screen.getByLabelText("몸국 판매 상태"),
      "sold_out",
    );
    await waitFor(() =>
      expect(repository.setStatus).toHaveBeenCalledWith(
        expect.objectContaining({ name_ko: "몸국", version: 1 }),
        "sold_out",
      ),
    );
    expect(await screen.findByRole("status")).toHaveTextContent("품절");
  });
  it("edits a price and sends the existing version", async () => {
    const { user, repository } = setup();
    await user.click(
      await screen.findByRole("button", { name: "해장국 수정" }),
    );
    const dialog = screen.getByRole("dialog", { name: "메뉴 수정" });
    await user.clear(within(dialog).getByLabelText("가격 (원)"));
    await user.type(within(dialog).getByLabelText("가격 (원)"), "12000");
    await user.click(within(dialog).getByRole("button", { name: "메뉴 저장" }));
    await waitFor(() =>
      expect(repository.saveMenu).toHaveBeenCalledWith(
        menuRows[0]!.id,
        1,
        expect.objectContaining({ price: 12000 }),
      ),
    );
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
  });
  it("preserves edits on conflicts and confirms discarding unsaved changes", async () => {
    const { user, repository } = setup();
    repository.saveMenu.mockRejectedValueOnce(new ConflictError());
    await user.click(
      await screen.findByRole("button", { name: "해장국 수정" }),
    );
    await user.clear(screen.getByLabelText("가격 (원)"));
    await user.type(screen.getByLabelText("가격 (원)"), "14000");
    await user.click(screen.getByRole("button", { name: "메뉴 저장" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "다른 화면에서 수정",
    );
    expect(screen.getByLabelText("가격 (원)")).toHaveValue(14000);
    await user.click(screen.getByRole("button", { name: "편집 닫기" }));
    expect(
      screen.getByRole("dialog", { name: "수정 내용을 버릴까요?" }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "수정 내용 버리기" }));
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
  });
  it("creates an incomplete menu as hidden, and validates publication", async () => {
    const { user, repository } = setup();
    await screen.findByRole("article", { name: "해장국" });
    await user.click(screen.getByRole("button", { name: "메뉴 등록" }));
    await user.type(screen.getByLabelText("한국어 메뉴명"), "새 메뉴");
    await user.selectOptions(
      screen.getByLabelText("판매 상태", { exact: true }),
      "available",
    );
    await user.click(screen.getByRole("button", { name: "메뉴 저장" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "한국어 메뉴명과 설명",
    );
    expect(repository.saveMenu).not.toHaveBeenCalled();
    await user.selectOptions(
      screen.getByLabelText("판매 상태", { exact: true }),
      "hidden",
    );
    await user.click(screen.getByRole("button", { name: "메뉴 저장" }));
    await waitFor(() =>
      expect(repository.saveMenu).toHaveBeenCalledWith(
        expect.any(String),
        0,
        expect.objectContaining({
          name_ko: "새 메뉴",
          status: "hidden",
          allergen_review_status: "unreviewed",
        }),
      ),
    );
  });
  it("does not delete without confirmation, and cancels safely", async () => {
    const { user, repository } = setup();
    await user.click(
      await screen.findByRole("button", { name: "해장국 삭제" }),
    );
    expect(repository.deleteMenu).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "취소" }));
    expect(repository.deleteMenu).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "해장국 삭제" }));
    await user.click(
      within(screen.getByRole("dialog")).getByRole("button", { name: "삭제" }),
    );
    await waitFor(() => expect(repository.deleteMenu).toHaveBeenCalledTimes(1));
  });
  it("protects categories containing menus and creates translated categories", async () => {
    const { user, repository } = setup();
    await screen.findByRole("article", { name: "해장국" });
    await user.click(screen.getByRole("button", { name: "카테고리 관리" }));
    expect(
      screen.getByRole("button", { name: "식사류 카테고리 삭제" }),
    ).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "카테고리 등록" }));
    for (const language of ["한국어", "영어", "중국어 간체", "중국어 번체"])
      await user.type(
        screen.getByLabelText(`${language} 카테고리명`),
        "새 분류",
      );
    await user.click(screen.getByRole("button", { name: "카테고리 저장" }));
    await waitFor(() =>
      expect(repository.saveCategory).toHaveBeenCalledWith(
        expect.any(String),
        0,
        expect.objectContaining({ name_zh_hant: "새 분류" }),
      ),
    );
  });
});
