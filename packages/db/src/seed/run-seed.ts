import { createDatabase } from "../client";
import { runMigrations } from "../migrate";
import { resetDemo } from "./reset";

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL is not set");
}

const { db, pool } = createDatabase(url);

try {
  await runMigrations(db);
  await resetDemo(db, new Date());
} finally {
  await pool.end();
}
