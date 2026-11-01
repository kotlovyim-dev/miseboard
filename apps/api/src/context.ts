import type { Database } from "@miseboard/db";
import { logger } from "./logger";

export const roles = ["ADMIN", "MANAGER", "VIEWER"] as const;

export type Role = (typeof roles)[number];

export interface Context {
  role: Role;
  db: Database;
  logger: typeof logger;
}

export function createContext(db: Database): Context {
  return { role: "ADMIN", db, logger };
}
