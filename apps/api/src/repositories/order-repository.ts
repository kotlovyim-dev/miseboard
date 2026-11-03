import { and, count, desc, eq, inArray, sql } from "drizzle-orm";
import { orderItems, orders } from "@miseboard/db";
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

export async function updateOrderStatus(db: Database, id: string, status: OrderStatus) {
  const [order] = await db.update(orders).set({ status }).where(eq(orders.id, id)).returning();
  return order;
}

export async function findOrderItemsByOrderIds(db: Database, orderIds: string[]) {
  const rows = await db.select().from(orderItems).where(inArray(orderItems.orderId, orderIds));
  return orderIds.map((orderId) => rows.filter((row) => row.orderId === orderId));
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
