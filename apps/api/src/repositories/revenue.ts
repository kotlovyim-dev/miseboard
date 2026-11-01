import { and, eq, gte, lt, ne, sql } from "drizzle-orm";
import { orders } from "@miseboard/db";
import type { Database } from "@miseboard/db";

const dayInKyiv = sql<Date>`date_trunc('day', ${orders.createdAt} at time zone 'Europe/Kyiv') at time zone 'Europe/Kyiv'`;

export function listDailyRevenue(db: Database, venueId: string, from: Date, to: Date) {
  return db
    .select({
      day: dayInKyiv.mapWith((day: string) => new Date(day)),
      total: sql<number>`sum(${orders.totalKopecks})`.mapWith(Number),
      orders: sql<number>`count(*)`.mapWith(Number),
    })
    .from(orders)
    .where(
      and(
        eq(orders.venueId, venueId),
        ne(orders.status, "CANCELLED"),
        gte(orders.createdAt, from),
        lt(orders.createdAt, to),
      ),
    )
    .groupBy(dayInKyiv)
    .orderBy(dayInKyiv);
}
