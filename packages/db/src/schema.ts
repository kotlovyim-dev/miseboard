import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { v7 } from "uuid";

export const orderStatuses = ["NEW", "PREPARING", "READY", "SERVED", "CANCELLED"] as const;

export const orderStatus = pgEnum("order_status", orderStatuses);

const primaryId = () =>
  uuid("id")
    .primaryKey()
    .$defaultFn(() => v7());

export const venues = pgTable("venues", {
  id: primaryId(),
  name: text("name").notNull(),
  city: text("city").notNull(),
});

export const menuItems = pgTable(
  "menu_items",
  {
    id: primaryId(),
    name: text("name").notNull(),
    category: text("category").notNull(),
    priceKopecks: integer("price_kopecks").notNull(),
    isActive: boolean("is_active").notNull().default(true),
  },
  (table) => [index("menu_items_category_idx").on(table.category)],
);

export const orders = pgTable(
  "orders",
  {
    id: primaryId(),
    venueId: uuid("venue_id")
      .notNull()
      .references(() => venues.id),
    status: orderStatus("status").notNull().default("NEW"),
    totalKopecks: integer("total_kopecks").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("orders_venue_created_at_id_idx").on(table.venueId, table.createdAt.desc(), table.id),
    index("orders_status_idx").on(table.status),
  ],
);

export const orderItems = pgTable(
  "order_items",
  {
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id),
    menuItemId: uuid("menu_item_id")
      .notNull()
      .references(() => menuItems.id),
    qty: integer("qty").notNull(),
    priceKopecks: integer("price_kopecks").notNull(),
  },
  (table) => [primaryKey({ columns: [table.orderId, table.menuItemId] })],
);

export type Venue = typeof venues.$inferSelect;
export type MenuItem = typeof menuItems.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
export type OrderStatus = (typeof orderStatuses)[number];
