import { createDatabase, runMigrations, seedDatabase } from "@miseboard/db";
import type { Database } from "@miseboard/db";
import { sql } from "drizzle-orm";
import { expect } from "vitest";
import type { RoleCookieConfig } from "./role-cookie";
import { createGraphqlServer } from "./server";

export const TEST_COOKIE: RoleCookieConfig = { secret: "test-cookie-secret", isSecure: false };

export function createTestDatabase() {
  const url = process.env.TEST_DATABASE_URL;
  if (!url) {
    throw new Error("TEST_DATABASE_URL is not set; point it at a dedicated test database");
  }
  return createDatabase(url);
}

export async function seedTestDatabase(db: Database) {
  await runMigrations(db);
  await db.execute(
    sql`truncate table order_items, orders, inventory_items, menu_items, venues, apps cascade`,
  );
  await seedDatabase(db, new Date());
}

export function createTestClient(db: Database) {
  const yoga = createGraphqlServer(db, TEST_COOKIE);

  async function queryRaw(
    query: string,
    variables?: Record<string, unknown>,
    headers: Record<string, string> = {},
  ) {
    const response = await yoga.fetch("http://localhost/graphql", {
      method: "POST",
      headers: { "content-type": "application/json", ...headers },
      body: JSON.stringify({ query, variables }),
    });
    return response.json();
  }

  async function query(document: string, variables?: Record<string, unknown>) {
    const body = await queryRaw(document, variables);
    expect(body.errors).toBeUndefined();
    return body.data;
  }

  return { query, queryRaw };
}
