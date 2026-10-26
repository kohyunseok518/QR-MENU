import { createClient } from "@supabase/supabase-js";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createAdminRepository, ConflictError, adminError } from "./repository";
import { categoryRows, menuRows } from "../data/restaurantMenu";
import { menuInput } from "./validation";

const item = { ...menuRows[0]!, version: 7 };
const client = () =>
  createClient("https://admin-test.supabase.co", "sb_publishable_test", {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
const response = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
afterEach(() => vi.unstubAllGlobals());

describe("admin Data API", () => {
  it("uploads a photo at a unique public URL without overwriting existing files", async () => {
    const fetch = vi.fn(async (_url: string, _options?: RequestInit) =>
      response({ Key: "menu-images/photo.jpg" }),
    );
    vi.stubGlobal("fetch", fetch);
    const url = await createAdminRepository(client()).uploadPhoto(
      new File(["test"], "menu.jpg", { type: "image/jpeg" }),
    );
    expect(url).toMatch(
      /^https:\/\/admin-test.supabase.co\/storage\/v1\/object\/public\/menu-images\/[0-9a-f-]+\.jpg$/,
    );
    expect(fetch.mock.calls[0]?.[1]?.method).toBe("POST");
    expect(new Headers(fetch.mock.calls[0]?.[1]?.headers).get("x-upsert")).toBe(
      "false",
    );
  });
  it("reads hidden drafts and versions instead of using the guest filter", async () => {
    const fetch = vi.fn(async (url: string) =>
      response(
        url.includes("/categories")
          ? categoryRows.map((row) => ({ ...row, version: 1 }))
          : [{ ...item, status: "hidden" }],
      ),
    );
    vi.stubGlobal("fetch", fetch);
    expect(
      (await createAdminRepository(client()).getCatalog()).items[0]?.status,
    ).toBe("hidden");
    expect(
      fetch.mock.calls.every(
        ([url]) => !new URL(url).searchParams.has("status"),
      ),
    ).toBe(true);
    expect(
      fetch.mock.calls.every(([url]) =>
        new URL(url).searchParams.get("select")?.includes("version"),
      ),
    ).toBe(true);
  });
  it("uses version conditions for edits and deletes", async () => {
    const fetch = vi.fn(async (_url: string, _options?: RequestInit) =>
      response([{ ...item, version: 8 }]),
    );
    vi.stubGlobal("fetch", fetch);
    const repository = createAdminRepository(client());
    await repository.saveMenu(item.id, 7, menuInput(item, "11000", "0"));
    await repository.deleteMenu(item);
    for (const [url] of fetch.mock.calls) {
      expect(new URL(url).searchParams.get("version")).toBe("eq.7");
      expect(new URL(url).searchParams.get("id")).toBe(`eq.${item.id}`);
    }
    expect(fetch.mock.calls[0]?.[1]?.method).toBe("PATCH");
    expect(fetch.mock.calls[1]?.[1]?.method).toBe("DELETE");
    expect(
      JSON.parse(fetch.mock.calls[0]![1]!.body as string),
    ).not.toHaveProperty("version");
  });
  it("reports stale or unauthorized zero-row writes as a conflict", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => response([])),
    );
    const repository = createAdminRepository(client());
    await expect(repository.setStatus(item, "sold_out")).rejects.toBeInstanceOf(
      ConflictError,
    );
    await expect(repository.deleteMenu(item)).rejects.toBeInstanceOf(
      ConflictError,
    );
    await expect(
      repository.saveCategory("id", 1, { ...categoryRows[0]! }),
    ).rejects.toBeInstanceOf(ConflictError);
  });
  it("updates status without overwriting other fields", async () => {
    const fetch = vi.fn(async (_url: string, _options?: RequestInit) =>
      response([{ ...item, status: "sold_out" }]),
    );
    vi.stubGlobal("fetch", fetch);
    await createAdminRepository(client()).setStatus(item, "sold_out");
    expect(JSON.parse(fetch.mock.calls[0]![1]!.body as string)).toEqual({
      status: "sold_out",
    });
  });
  it("keeps FK and permission errors actionable", () => {
    expect(adminError({ code: "23503" })).toContain("메뉴를 먼저 이동");
    expect(adminError({ code: "42501" })).toContain("권한");
  });
});
