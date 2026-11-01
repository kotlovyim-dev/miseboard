import { createDatabase, runMigrations, seedDatabase } from "@miseboard/db";
import { sql } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createGraphqlServer } from "./server";

const url = process.env.TEST_DATABASE_URL;
if (!url) {
  throw new Error("TEST_DATABASE_URL is not set; point it at a dedicated test database");
}

const { db, pool } = createDatabase(url);
const yoga = createGraphqlServer(db);
const DAY_MS = 24 * 60 * 60 * 1000;

async function runQuery(query: string, variables?: Record<string, unknown>) {
  const response = await yoga.fetch("http://localhost/graphql", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  const body = await response.json();
  expect(body.errors).toBeUndefined();
  return body.data;
}

beforeAll(async () => {
  await runMigrations(db);
  await db.execute(
    sql`truncate table order_items, orders, inventory_items, menu_items, venues, apps cascade`,
  );
  await seedDatabase(db, new Date());
});
afterAll(() => pool.end());

describe("catalog queries", () => {
  it("lists the three seeded venues", async () => {
    const data = await runQuery("{ venues { id name city } }");

    expect(data.venues).toHaveLength(3);
  });

  it("resolves a venue, a menu item and an inventory item through node", async () => {
    const data = await runQuery(`{ venues { id inventory { id } } menuItems { id } }`);
    const venue = data.venues[0];
    const ids = [venue.id, data.menuItems[0].id, venue.inventory[0].id];

    const nodes = await Promise.all(
      ids.map((id) => runQuery("query ($id: ID!) { node(id: $id) { __typename id } }", { id })),
    );

    expect(nodes.map((node) => node.node.__typename)).toEqual([
      "Venue",
      "MenuItem",
      "InventoryItem",
    ]);
    expect(nodes.map((node) => node.node.id)).toEqual(ids);
  });

  it("resolves a venue by global id", async () => {
    const { venues } = await runQuery("{ venues { id name } }");

    const data = await runQuery("query ($id: ID!) { venue(id: $id) { name } }", {
      id: venues[1].id,
    });

    expect(data.venue.name).toBe(venues[1].name);
  });

  it("filters menu items by category", async () => {
    const all = await runQuery("{ menuItems { category } }");
    const category = all.menuItems[0].category;

    const data = await runQuery(
      "query ($category: String) { menuItems(category: $category) { category price isActive } }",
      { category },
    );

    expect(data.menuItems.length).toBeGreaterThan(0);
    expect(data.menuItems.every((item: { category: string }) => item.category === category)).toBe(
      true,
    );
  });

  it("returns the eight low stock items across venues", async () => {
    const data = await runQuery(
      "{ venues { inventory(lowStockOnly: true) { qty minQty isLow } } }",
    );
    const lowItems = data.venues.flatMap(
      (venue: { inventory: { isLow: boolean }[] }) => venue.inventory,
    );

    expect(lowItems).toHaveLength(8);
    expect(lowItems.every((item: { isLow: boolean }) => item.isLow)).toBe(true);
  });

  it("returns positive daily revenue for the last seven days", async () => {
    const to = new Date();
    const from = new Date(to.getTime() - 7 * DAY_MS);

    const data = await runQuery(
      "query ($from: DateTime!, $to: DateTime!) { venues { revenue(from: $from, to: $to) { day total orders } } }",
      { from, to },
    );

    for (const venue of data.venues) {
      expect(venue.revenue.length).toBeGreaterThanOrEqual(7);
      expect(
        venue.revenue.every(
          (point: { total: number; orders: number }) => point.total > 0 && point.orders > 0,
        ),
      ).toBe(true);
    }
  });
});
