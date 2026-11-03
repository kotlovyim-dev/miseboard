import { and, eq, gte, inArray, lt, sql } from "drizzle-orm";
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

export async function adjustInventoryQty(db: Database, id: string, delta: number) {
  const newQty = sql`${inventoryItems.qty} + ${delta}`;
  const [item] = await db
    .update(inventoryItems)
    .set({ qty: newQty })
    .where(and(eq(inventoryItems.id, id), gte(newQty, sql`0`)))
    .returning();
  return item;
}
