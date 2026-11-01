import { HttpLink } from "@apollo/client";
import { ApolloClient, InMemoryCache } from "@apollo/client-integration-nextjs";

const DEFAULT_INTERNAL_GRAPHQL_URL = "http://localhost:4000/graphql";

export function makeClient(forwardedHeaders: Record<string, string> = {}) {
  const isServer = typeof window === "undefined";
  const uri = isServer
    ? (process.env.INTERNAL_GRAPHQL_URL ?? DEFAULT_INTERNAL_GRAPHQL_URL)
    : "/graphql";

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri,
      headers: { "x-miseboard-csrf": "1", ...forwardedHeaders },
    }),
  });
}
