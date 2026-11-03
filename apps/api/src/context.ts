import type { Database } from "@miseboard/db";
import { logger } from "./logger";
import { createOrderPubSub } from "./pubsub";
import type { PubSub } from "./pubsub";

export const roles = ["ADMIN", "MANAGER", "VIEWER"] as const;

export type Role = (typeof roles)[number];

export interface Context {
  role: Role;
  db: Database;
  pubsub: PubSub;
  logger: typeof logger;
}

const pubsub = createOrderPubSub();

export function createContext(db: Database): Context {
  return { role: "ADMIN", db, pubsub, logger };
}
