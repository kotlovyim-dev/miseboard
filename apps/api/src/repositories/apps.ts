import { desc, eq, inArray } from "drizzle-orm";
import { apps } from "@miseboard/db";
import type { Database } from "@miseboard/db";

export function listApps(db: Database) {
  return db.select().from(apps).orderBy(apps.isTemplate, desc(apps.updatedAt));
}

export function findAppsByIds(db: Database, ids: string[]) {
  return db.select().from(apps).where(inArray(apps.id, ids));
}

export async function findAppBySlug(db: Database, slug: string) {
  const [app] = await db.select().from(apps).where(eq(apps.slug, slug));
  return app;
}
