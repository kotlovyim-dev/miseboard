import type { Database } from "../client";
import { menuItems, venues } from "../schema";
import { menuSeeds } from "./menu";
import { venueSeeds } from "./venues";

export type Transaction = Parameters<Parameters<Database["transaction"]>[0]>[0];

export async function insertSeed(tx: Transaction) {
  await tx.insert(venues).values([...venueSeeds]);
  await tx.insert(menuItems).values(menuSeeds);
}

export async function seedDatabase(db: Database) {
  await db.transaction(insertSeed);
}
