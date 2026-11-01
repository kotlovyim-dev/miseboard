import { and, eq, inArray, lt } from "drizzle-orm";
import { inventoryItems } from "@miseboard/db";
import type { Database } from "@miseboard/db";

export function listInventoryItems(db: Database, venueId: string, lowStockOnly: boolean) {
  return db
    .select()
    .from(inventoryItems)
    .where(
      and(
        eq(inventoryItems.venueId, venueId),
        lowStockOnly ? lt(inventoryItems.qty, inventoryItems.minQty) : undefined,
      ),
    )
    .orderBy(inventoryItems.name);
}

export function findInventoryItemsByIds(db: Database, ids: string[]) {
  return db.select().from(inventoryItems).where(inArray(inventoryItems.id, ids));
}
