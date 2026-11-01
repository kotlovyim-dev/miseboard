import { eq, sql } from "drizzle-orm";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { createDatabase } from "../client";
import { runMigrations } from "../migrate";
import { apps, inventoryItems, orders, venues } from "../schema";
import { resetDemo } from "./reset";
import { seedDatabase, seedIfEmpty } from "./seed";

const url = process.env.TEST_DATABASE_URL;
if (!url) {
  throw new Error("TEST_DATABASE_URL is not set; point it at a dedicated test database");
}

const { db, pool } = createDatabase(url);
const now = new Date("2026-06-15T14:30:00Z");
const DAY_MS = 24 * 60 * 60 * 1000;

async function snapshot() {
  const rows = await db
    .select({ total: orders.totalKopecks, status: orders.status, createdAt: orders.createdAt })
    .from(orders)
    .orderBy(orders.createdAt, orders.totalKopecks);
  return { venues: await db.$count(venues), rows };
}

beforeAll(() => runMigrations(db));
beforeEach(async () => {
  await db.execute(
    sql`truncate table order_items, orders, inventory_items, menu_items, venues, apps cascade`,
  );
});
afterAll(() => pool.end());

describe("seedDatabase", () => {
  it("produces identical data for the same now", async () => {
    await seedDatabase(db, now);
    const first = await snapshot();
    await resetDemo(db, now);
    const second = await snapshot();

    expect(first.venues).toBe(3);
    expect(first.rows.length).toBeGreaterThan(1400);
    expect(first.rows.length).toBeLessThan(1600);
    expect(second).toEqual(first);
  });

  it("seeds exactly 8 low stock items", async () => {
    await seedDatabase(db, now);

    const low = await db.$count(
      inventoryItems,
      sql`${inventoryItems.qty} < ${inventoryItems.minQty}`,
    );
    expect(await db.$count(inventoryItems)).toBe(60);
    expect(low).toBe(8);
  });

  it("has open orders today and only finished ones before", async () => {
    await seedDatabase(db, now);
    const { rows } = await snapshot();
    const startOfToday = now.getTime() - (now.getTime() % DAY_MS);

    const today = rows.filter((row) => row.createdAt.getTime() >= startOfToday);
    const past = rows.filter((row) => row.createdAt.getTime() < startOfToday);
    expect(today.map((row) => row.status)).toEqual(expect.arrayContaining(["NEW", "PREPARING"]));
    expect(past.every((row) => row.status === "SERVED" || row.status === "CANCELLED")).toBe(true);
  });
});

describe("seedIfEmpty", () => {
  it("seeds once", async () => {
    await seedIfEmpty(db, now);
    await seedIfEmpty(db, now);

    expect(await db.$count(venues)).toBe(3);
    expect(await db.$count(apps, eq(apps.isTemplate, true))).toBe(1);
  });
});

describe("resetDemo", () => {
  it("keeps the template and removes user apps older than 7 days", async () => {
    await seedDatabase(db, now);
    await db.insert(apps).values([
      { name: "Old", slug: "old", config: {}, updatedAt: new Date(now.getTime() - 8 * DAY_MS) },
      { name: "Fresh", slug: "fresh", config: {}, updatedAt: new Date(now.getTime() - DAY_MS) },
    ]);

    await resetDemo(db, now);

    const slugs = (await db.select({ slug: apps.slug }).from(apps)).map((app) => app.slug);
    expect(slugs.sort()).toEqual(["fresh", "restaurant-ops"]);
  });
});
