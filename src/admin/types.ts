import type { CategoryRow, MenuItemRow } from "../domain/menu";

export type AdminCategory = CategoryRow & { version: number };
export type AdminMenu = MenuItemRow & { version: number };
export interface AdminCatalog {
  categories: AdminCategory[];
  items: AdminMenu[];
}
export type CategoryInput = Omit<AdminCategory, "id" | "version">;
export type MenuInput = Omit<AdminMenu, "id" | "version">;

export interface AdminRepository {
  getCatalog(signal?: AbortSignal): Promise<AdminCatalog>;
  saveMenu(id: string, version: number, input: MenuInput): Promise<AdminMenu>;
  setStatus(item: AdminMenu, status: AdminMenu["status"]): Promise<AdminMenu>;
  deleteMenu(item: AdminMenu): Promise<void>;
  saveCategory(
    id: string,
    version: number,
    input: CategoryInput,
  ): Promise<AdminCategory>;
  deleteCategory(item: AdminCategory): Promise<void>;
  uploadPhoto(file: File): Promise<string>;
}
