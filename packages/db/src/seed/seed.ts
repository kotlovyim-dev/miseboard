import { v7 } from "uuid";
import type { Database } from "../client";
import { apps, inventoryItems, menuItems, orderItems, orders, venues } from "../schema";
import { buildInventory } from "./inventory";
import { menuSeeds } from "./menu";
import { buildOrders } from "./orders";
import { createRandom } from "./random";
import { restaurantOps } from "./restaurant-ops";
import { venueSeeds } from "./venues";

export type Transaction = Parameters<Parameters<Database["transaction"]>[0]>[0];

function withIds<T extends object>(rows: readonly T[]) {
  return rows.map((row) => ({ id: v7(), ...row }));
}

export async function insertSeed(tx: Transaction, now: Date) {
  const venueRows = withIds(venueSeeds);
  const menuRows = withIds(menuSeeds);
  const random = createRandom();
  const venueIds = venueRows.map((venue) => venue.id);
  const built = buildOrders(random, now, venueIds, menuRows);
  await tx.insert(venues).values(venueRows);
  await tx.insert(menuItems).values(menuRows);
  await tx.insert(orders).values(built.orders);
  await tx.insert(orderItems).values(built.orderItems);
  await tx.insert(inventoryItems).values(buildInventory(random, venueIds));
  await tx.insert(apps).values(restaurantOps).onConflictDoNothing({ target: apps.slug });
}

export async function seedDatabase(db: Database, now: Date) {
  await db.transaction((tx) => insertSeed(tx, now));
}

export async function seedIfEmpty(db: Database, now: Date) {
  const existing = await db.select({ id: venues.id }).from(venues).limit(1);
  if (existing.length === 0) await seedDatabase(db, now);
}
