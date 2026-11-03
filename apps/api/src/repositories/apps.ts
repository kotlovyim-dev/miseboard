import { and, desc, eq, inArray, like, sql } from "drizzle-orm";
import { apps } from "@miseboard/db";
import type { Database } from "@miseboard/db";
import { pickFreeSlug } from "../slug";

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

export async function findTemplate(db: Database) {
  const [template] = await db.select().from(apps).where(eq(apps.isTemplate, true)).limit(1);
  return template;
}

export async function insertApp(db: Database, name: string, baseSlug: string, config: unknown) {
  const slugs = await db
    .select({ slug: apps.slug })
    .from(apps)
    .where(like(apps.slug, `${baseSlug}%`));
  const slug = pickFreeSlug(
    baseSlug,
    slugs.map((row) => row.slug),
  );
  const [app] = await db.insert(apps).values({ name, slug, config }).returning();
  if (!app) throw new Error("Inserting the app returned no row");
  return app;
}

export async function updateAppConfig(
  db: Database,
  id: string,
  config: unknown,
  expectedUpdatedAt: Date,
) {
  const [app] = await db
    .update(apps)
    .set({ config, updatedAt: sql`greatest(now(), ${apps.updatedAt} + interval '1 millisecond')` })
    .where(and(eq(apps.id, id), eq(apps.isTemplate, false), eq(apps.updatedAt, expectedUpdatedAt)))
    .returning();
  return app;
}

export async function deleteUserApp(db: Database, id: string) {
  const [app] = await db
    .delete(apps)
    .where(and(eq(apps.id, id), eq(apps.isTemplate, false)))
    .returning({ id: apps.id });
  return app;
}
