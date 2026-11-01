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
