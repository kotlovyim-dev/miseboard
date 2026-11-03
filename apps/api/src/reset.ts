import { createDatabase, resetDemo } from "@miseboard/db";

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL is not set");
}

const { db, pool } = createDatabase(url);

try {
  await resetDemo(db, new Date());
} finally {
  await pool.end();
}
