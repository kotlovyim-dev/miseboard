import { v7 } from "uuid";
import type { Database } from "../client";
import { menuItems, orderItems, orders, venues } from "../schema";
import { menuSeeds } from "./menu";
import { buildOrders } from "./orders";
import { createRandom } from "./random";
import { venueSeeds } from "./venues";

export type Transaction = Parameters<Parameters<Database["transaction"]>[0]>[0];

function withIds<T extends object>(rows: readonly T[]) {
  return rows.map((row) => ({ id: v7(), ...row }));
}

export async function insertSeed(tx: Transaction, now: Date) {
  const venueRows = withIds(venueSeeds);
  const menuRows = withIds(menuSeeds);
  const built = buildOrders(
    createRandom(),
    now,
    venueRows.map((venue) => venue.id),
    menuRows,
  );
  await tx.insert(venues).values(venueRows);
  await tx.insert(menuItems).values(menuRows);
  await tx.insert(orders).values(built.orders);
  await tx.insert(orderItems).values(built.orderItems);
}

export async function seedDatabase(db: Database, now: Date) {
  await db.transaction((tx) => insertSeed(tx, now));
}
