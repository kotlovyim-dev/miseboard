import { createServer } from "node:http";
import type { ServerResponse } from "node:http";
import { sql } from "drizzle-orm";
import { createYoga } from "graphql-yoga";
import type { Database } from "@miseboard/db";
import { createContext } from "./context";
import { schema } from "./schema";

export function createGraphqlServer(db: Database) {
  return createYoga({
    schema,
    graphqlEndpoint: "/graphql",
    context: () => createContext(db),
  });
}

export function createHttpServer(db: Database) {
  const yoga = createGraphqlServer(db);
  return createServer((request, response) => {
    if (request.url === "/healthz") return respondHealth(db, response);
    return yoga(request, response);
  });
}

async function respondHealth(db: Database, response: ServerResponse) {
  const isHealthy = await db.execute(sql`select 1`).then(
    () => true,
    () => false,
  );
  response.writeHead(isHealthy ? 200 : 503, { "content-type": "application/json" });
  response.end(JSON.stringify({ status: isHealthy ? "ok" : "unavailable" }));
}
