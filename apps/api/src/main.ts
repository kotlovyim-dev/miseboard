import { createDatabase, runMigrations, seedIfEmpty } from "@miseboard/db";
import { logger } from "./logger";
import { createHttpServer } from "./server";

const DEFAULT_PORT = 4000;

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL is not set");
}

const secret = process.env.COOKIE_SECRET;
if (!secret) {
  throw new Error("COOKIE_SECRET is not set");
}
const cookie = { secret, isSecure: process.env.COOKIE_SECURE !== "false" };

const { db, pool } = createDatabase(url);
await runMigrations(db);
await seedIfEmpty(db, new Date());

const port = Number(process.env.PORT ?? DEFAULT_PORT);
const server = createHttpServer(db, cookie);
server.listen(port, () => logger.info({ port }, "api listening"));

async function shutdown(signal: string) {
  logger.info({ signal }, "shutting down");
  server.close();
  await pool.end();
  process.exit(0);
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
