import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
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
    createdAt: timestamp("created_at", { withTimezone: true, precision: 3 }).notNull().defaultNow(),
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

export const inventoryItems = pgTable(
  "inventory_items",
  {
    id: primaryId(),
    venueId: uuid("venue_id")
      .notNull()
      .references(() => venues.id),
    name: text("name").notNull(),
    unit: text("unit").notNull(),
    qty: numeric("qty", { mode: "number" }).notNull(),
    minQty: numeric("min_qty", { mode: "number" }).notNull(),
  },
  (table) => [check("inventory_items_qty_non_negative", sql`${table.qty} >= 0`)],
);

export const apps = pgTable(
  "apps",
  {
    id: primaryId(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    config: jsonb("config").$type<unknown>().notNull(),
    isTemplate: boolean("is_template").notNull().default(false),
    updatedAt: timestamp("updated_at", { withTimezone: true, precision: 3 }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("apps_slug_idx").on(table.slug)],
);

export type Venue = typeof venues.$inferSelect;
export type MenuItem = typeof menuItems.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
export type InventoryItem = typeof inventoryItems.$inferSelect;
export type App = typeof apps.$inferSelect;
export type OrderStatus = (typeof orderStatuses)[number];
