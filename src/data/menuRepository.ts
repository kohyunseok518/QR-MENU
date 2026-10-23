import type { MenuRepository } from "../domain/menu";
import { categoryRows, menuRows } from "./fixtures";
import { mapCatalog } from "./mapper";

export const mockMenuRepository: MenuRepository = {
  async getCatalog(signal) {
    signal?.throwIfAborted();
    await new Promise<void>((resolve, reject) => {
      const finish = () => {
        signal?.removeEventListener("abort", abort);
        resolve();
      };
      const timeout = setTimeout(finish, 180);
      const abort = () => {
        clearTimeout(timeout);
        reject(new DOMException("Request aborted", "AbortError"));
      };
      signal?.addEventListener("abort", abort, { once: true });
    });
    signal?.throwIfAborted();
    return mapCatalog(structuredClone(categoryRows), structuredClone(menuRows));
  },
};

// Composition root: replace this implementation to connect Supabase without changing UI components.
export const menuRepository: MenuRepository = mockMenuRepository;
