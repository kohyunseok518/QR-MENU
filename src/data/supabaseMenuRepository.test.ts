import { afterEach, describe, expect, it, vi } from "vitest";
import { createPublicMenuClient } from "../lib/supabase";
import { categoryRows, menuRows } from "./restaurantMenu";
import { createSupabaseMenuRepository } from "./supabaseMenuRepository";

const url = "https://menu-test.supabase.co";
const key = "sb_publishable_test";
const repository = () => createSupabaseMenuRepository(createPublicMenuClient(url, key));
const response = (data: unknown, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { "Content-Type": "application/json" },
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("Supabase guest menu API", () => {
  it("loads both tables with a public key, published filter and existing photo paths", async () => {
    const fetch = vi.fn(async (input: string, _options?: RequestInit) =>
      response(new URL(input).pathname.endsWith("/categories") ? categoryRows : menuRows),
    );
    vi.stubGlobal("fetch", fetch);
    const catalog = await repository().getCatalog();
    expect(catalog.categories).toHaveLength(4);
    expect(catalog.items).toHaveLength(19);
    expect(catalog.items.filter((item) => item.imageUrl)).toHaveLength(8);
    expect(catalog.items[0]!.imageUrl).toMatch(/^\/images\/restaurant\//);
    expect(catalog.items[0]!.name["zh-Hant"]).toBe(menuRows[0]!.name_zh_hant);
    expect(fetch).toHaveBeenCalledTimes(2);
    for (const [input, options] of fetch.mock.calls) {
      expect(new Headers(options?.headers).get("apikey")).toBe(key);
      expect(options?.signal).toBeInstanceOf(AbortSignal);
      expect(new URL(input).searchParams.get("select")).not.toContain("created_at");
    }
    const menuRequest = fetch.mock.calls.find(([input]) => input.includes("/menu_items"))!;
    expect(new URL(menuRequest[0]).searchParams.get("status")).toBe("in.(available,sold_out)");
  });

  it.each(["categories", "menu_items"])("rejects %s errors instead of using static menus", async (table) => {
    vi.stubGlobal("fetch", vi.fn(async (input: string) =>
      new URL(input).pathname.endsWith(`/${table}`)
        ? response({ code: "42501", message: "permission denied" }, 403)
        : response(table === "categories" ? menuRows : categoryRows),
    ));
    await expect(repository().getCatalog()).rejects.toMatchObject({ message: "permission denied" });
  });

  it("returns an empty catalog when the API has no published menus", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => response([])));
    await expect(repository().getCatalog()).resolves.toEqual({ categories: [], items: [] });
  });

  it("rejects a missing response and incomplete translations", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => response(null)));
    await expect(repository().getCatalog()).rejects.toThrow("Missing menu response");
    vi.stubGlobal("fetch", vi.fn(async (input: string) => response(
      input.includes("/categories") ? categoryRows : [{ ...menuRows[0], name_zh_hant: null }],
    )));
    await expect(repository().getCatalog()).rejects.toThrow("translation");
  });

  it("cancels both in-flight requests and preserves AbortError", async () => {
    let requestsStarted!: () => void;
    const started = new Promise<void>((resolve) => { requestsStarted = resolve; });
    const signals: AbortSignal[] = [];
    vi.stubGlobal("fetch", vi.fn((_input: string, options: RequestInit) => {
      const signal = options.signal!;
      signals.push(signal);
      if (signals.length === 2) requestsStarted();
      return new Promise<Response>((_resolve, reject) => {
        signal.addEventListener("abort", () => reject(signal.reason), { once: true });
      });
    }));
    const controller = new AbortController();
    const request = repository().getCatalog(controller.signal);
    const rejected = expect(request).rejects.toMatchObject({ name: "AbortError" });
    await started;
    controller.abort();
    await rejected;
    expect(signals).toHaveLength(2);
    expect(signals.every((signal) => signal.aborted)).toBe(true);
  });

  it("rejects a previously cancelled request without making a network call", async () => {
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    const controller = new AbortController();
    controller.abort();
    await expect(repository().getCatalog(controller.signal)).rejects.toMatchObject({ name: "AbortError" });
    expect(fetch).not.toHaveBeenCalled();
  });

  it("aborts a stalled API after 15 seconds", async () => {
    vi.useFakeTimers();
    vi.stubGlobal("fetch", vi.fn((_input: string, options: RequestInit) =>
      new Promise<Response>((_resolve, reject) => {
        options.signal!.addEventListener("abort", () => reject(options.signal!.reason), { once: true });
      }),
    ));
    const request = repository().getCatalog();
    const rejected = expect(request).rejects.toMatchObject({ name: "TimeoutError" });
    await vi.advanceTimersByTimeAsync(15_000);
    await rejected;
  });

  it("requires configuration and refuses secret keys", () => {
    expect(() => createPublicMenuClient("", key)).toThrow("required");
    expect(() => createPublicMenuClient(url, "sb_secret_test")).toThrow("required");
  });
});
