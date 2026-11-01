import { and, eq, lt, sql } from "drizzle-orm";
import type { Database } from "../client";
import { apps } from "../schema";
import { insertSeed } from "./seed";

const USER_APP_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export async function resetDemo(db: Database, now: Date) {
  await db.transaction(async (tx) => {
    await tx.execute(
      sql`truncate table order_items, orders, inventory_items, menu_items, venues restart identity cascade`,
    );
    await tx
      .delete(apps)
      .where(
        and(
          eq(apps.isTemplate, false),
          lt(apps.updatedAt, new Date(now.getTime() - USER_APP_TTL_MS)),
        ),
      );
    await insertSeed(tx, now);
  });
}
