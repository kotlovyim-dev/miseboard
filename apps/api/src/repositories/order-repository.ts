import { and, count, desc, eq, inArray, sql } from "drizzle-orm";
import { orders } from "@miseboard/db";
import type { Database, OrderStatus } from "@miseboard/db";
import type { OrderCursor } from "../connections/cursor";

export interface OrderFilters {
  venueId?: string;
  status?: OrderStatus;
}

export interface OrderPageQuery extends OrderFilters {
  limit: number;
  after?: OrderCursor;
}

export function listOrdersPage(db: Database, { limit, after, ...filters }: OrderPageQuery) {
  return db
    .select()
    .from(orders)
    .where(and(matchesFilters(filters), isBefore(after)))
    .orderBy(desc(orders.createdAt), desc(orders.id))
    .limit(limit);
}

export async function countOrders(db: Database, filters: OrderFilters) {
  const [row] = await db.select({ total: count() }).from(orders).where(matchesFilters(filters));
  return row?.total ?? 0;
}

export function findOrdersByIds(db: Database, ids: string[]) {
  return db.select().from(orders).where(inArray(orders.id, ids));
}

function matchesFilters({ venueId, status }: OrderFilters) {
  return and(
    venueId === undefined ? undefined : eq(orders.venueId, venueId),
    status === undefined ? undefined : eq(orders.status, status),
  );
}

function isBefore(cursor?: OrderCursor) {
  if (!cursor) return undefined;
  return sql`(${orders.createdAt}, ${orders.id}) < (${cursor.createdAt.toISOString()}::timestamptz, ${cursor.id}::uuid)`;
}
