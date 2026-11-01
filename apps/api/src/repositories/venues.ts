import { inArray } from "drizzle-orm";
import { venues } from "@miseboard/db";
import type { Database } from "@miseboard/db";

export function listVenues(db: Database) {
  return db.select().from(venues).orderBy(venues.name);
}

export function findVenuesByIds(db: Database, ids: string[]) {
  return db.select().from(venues).where(inArray(venues.id, ids));
}
