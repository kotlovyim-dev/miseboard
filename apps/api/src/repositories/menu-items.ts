import { eq, inArray } from "drizzle-orm";
import { menuItems } from "@miseboard/db";
import type { Database, MenuItem } from "@miseboard/db";

export function listMenuItems(db: Database, category?: string) {
  return db
    .select()
    .from(menuItems)
    .where(category === undefined ? undefined : eq(menuItems.category, category))
    .orderBy(menuItems.category, menuItems.name);
}

export function findMenuItemsByIds(db: Database, ids: string[]) {
  return db.select().from(menuItems).where(inArray(menuItems.id, ids));
}

export type MenuItemPatch = Partial<Pick<MenuItem, "name" | "priceKopecks" | "isActive">>;

export async function updateMenuItem(db: Database, id: string, patch: MenuItemPatch) {
  if (Object.values(patch).every((field) => field === undefined))
    return (await findMenuItemsByIds(db, [id]))[0];
  const [menuItem] = await db.update(menuItems).set(patch).where(eq(menuItems.id, id)).returning();
  return menuItem;
}
