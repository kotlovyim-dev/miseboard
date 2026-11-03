import type { Database } from "@miseboard/db";
import { logger } from "./logger";
import { createOrderPubSub } from "./pubsub";
import type { PubSub } from "./pubsub";
import { buildRoleCookie, readRoleCookie } from "./role-cookie";
import type { RoleCookieConfig } from "./role-cookie";
import type { Role } from "./roles";

export interface Context {
  role: Role;
  db: Database;
  pubsub: PubSub;
  logger: typeof logger;
  storeRole: (role: Role) => Promise<void>;
}

const pubsub = createOrderPubSub();

export function createContext(db: Database, request: Request, cookie: RoleCookieConfig): Context {
  return {
    role: readRoleCookie(request.headers.get("cookie"), cookie.secret),
    db,
    pubsub,
    logger,
    storeRole: async (role) => request.cookieStore?.set(buildRoleCookie(role, cookie)),
  };
}
