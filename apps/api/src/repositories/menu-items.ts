import { eq, inArray } from "drizzle-orm";
import { menuItems } from "@miseboard/db";
import type { Database } from "@miseboard/db";

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
