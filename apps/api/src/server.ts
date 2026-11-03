import { createServer } from "node:http";
import type { ServerResponse } from "node:http";
import { sql } from "drizzle-orm";
import { maxAliasesPlugin } from "@escape.tech/graphql-armor-max-aliases";
import { maxDepthPlugin } from "@escape.tech/graphql-armor-max-depth";
import { maxTokensPlugin } from "@escape.tech/graphql-armor-max-tokens";
import { createYoga } from "graphql-yoga";
import type { Database } from "@miseboard/db";
import { createContext } from "./context";
import { useExecutionTimeout } from "./execution-timeout";
import { schema } from "./schema";
import { serveSubscriptions } from "./websocket";

const MAX_DEPTH = 6;
const MAX_TOKENS = 1000;
const MAX_ALIASES = 20;

export function createGraphqlServer(db: Database) {
  return createYoga({
    schema,
    graphqlEndpoint: "/graphql",
    context: () => createContext(db),
    plugins: [
      maxDepthPlugin({ n: MAX_DEPTH }),
      maxTokensPlugin({ n: MAX_TOKENS }),
      maxAliasesPlugin({ n: MAX_ALIASES }),
      useExecutionTimeout(),
    ],
  });
}

export function createHttpServer(db: Database) {
  const yoga = createGraphqlServer(db);
  const server = createServer((request, response) => {
    if (request.url === "/healthz") return respondHealth(db, response);
    return yoga(request, response);
  });
  serveSubscriptions(server, yoga);
  return server;
}

async function respondHealth(db: Database, response: ServerResponse) {
  const isHealthy = await db.execute(sql`select 1`).then(
    () => true,
    () => false,
  );
  response.writeHead(isHealthy ? 200 : 503, { "content-type": "application/json" });
  response.end(JSON.stringify({ status: isHealthy ? "ok" : "unavailable" }));
}
