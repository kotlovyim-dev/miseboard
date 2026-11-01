import { orders, venues } from "@miseboard/db";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { createTestClient, createTestDatabase, seedTestDatabase } from "./fixtures";

const { db, pool } = createTestDatabase();
const { query: runQuery, queryRaw } = createTestClient(db);
const MAX_PAGE_SIZE = 100;
const MAX_QUERIES_PER_PAGE = 4;
const MINUTE_MS = 60 * 1000;

interface OrderEdge {
  cursor: string;
  node: { id: string; createdAt: string };
}

const PAGE_QUERY = `
  query ($first: Int, $after: String) {
    orders(first: $first, after: $after) {
      pageInfo { hasNextPage endCursor }
      edges { cursor node { id createdAt } }
    }
  }
`;

const TIED_PAGE_QUERY = `
  query ($venueId: ID, $after: String) {
    orders(first: 1, venueId: $venueId, after: $after) {
      pageInfo { endCursor }
      edges { cursor node { id createdAt } }
    }
  }
`;

const RELATIONS_QUERY = `
  { orders(first: 20) {
    edges { node { id venue { name } items { qty menuItem { name } } } }
  } }
`;

async function fetchPage(first: number, after?: string) {
  const data = await runQuery(PAGE_QUERY, { first, after });
  return data.orders as {
    pageInfo: { hasNextPage: boolean; endCursor: string };
    edges: OrderEdge[];
  };
}

function nodeIds(edges: OrderEdge[]) {
  return edges.map((edge) => edge.node.id);
}

beforeAll(() => seedTestDatabase(db));
afterAll(() => pool.end());

describe("orders connection", () => {
  it("keeps pages disjoint and ordered by created_at descending", async () => {
    const first = await fetchPage(20);
    const second = await fetchPage(20, first.pageInfo.endCursor);

    const combined = [...first.edges, ...second.edges];
    const times = combined.map((edge) => new Date(edge.node.createdAt).getTime());

    expect(new Set(nodeIds(combined)).size).toBe(40);
    expect(times).toEqual([...times].sort((a, b) => b - a));
  });

  it("returns the same second page after a newer order is inserted", async () => {
    const first = await fetchPage(20);
    const before = await fetchPage(20, first.pageInfo.endCursor);
    const [anyOrder] = await db.select().from(orders).limit(1);

    await db.insert(orders).values({
      venueId: anyOrder?.venueId ?? "",
      totalKopecks: 1000,
      createdAt: new Date(Date.now() + MINUTE_MS),
    });
    const after = await fetchPage(20, first.pageInfo.endCursor);

    expect(nodeIds(after.edges)).toEqual(nodeIds(before.edges));
  });

  it("pages through orders created in one transaction without skipping or repeating", async () => {
    const [venue] = await db.insert(venues).values({ name: "Tie", city: "Test" }).returning();
    const venueId = venue?.id ?? "";
    await db.transaction(async (tx) => {
      await tx.insert(orders).values([1, 2, 3].map(() => ({ venueId, totalKopecks: 100 })));
    });
    const globalVenueId = Buffer.from(`Venue:${venueId}`).toString("base64");
    const seen: string[] = [];
    let after: string | undefined;

    for (let index = 0; index < 3; index += 1) {
      const data = await runQuery(TIED_PAGE_QUERY, { venueId: globalVenueId, after });
      seen.push(...nodeIds(data.orders.edges));
      after = data.orders.pageInfo.endCursor;
    }

    expect(new Set(seen).size).toBe(3);
  });

  it("costs at most four queries for a page with venue, items and menu items", async () => {
    const querySpy = vi.spyOn(pool, "query");

    const data = await runQuery(RELATIONS_QUERY);

    expect(data.orders.edges).toHaveLength(20);
    expect(querySpy.mock.calls.length).toBeLessThanOrEqual(MAX_QUERIES_PER_PAGE);
    querySpy.mockRestore();
  });

  it("rejects an invalid cursor with BAD_USER_INPUT", async () => {
    const body = await queryRaw(PAGE_QUERY, { first: 5, after: "not-a-cursor" });

    expect(body.errors[0].extensions.code).toBe("BAD_USER_INPUT");
  });

  it("caps first at 100", async () => {
    const page = await fetchPage(500);

    expect(page.edges).toHaveLength(MAX_PAGE_SIZE);
    expect(page.pageInfo.hasNextPage).toBe(true);
  });
});
