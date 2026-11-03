import { ApolloLink, HttpLink } from "@apollo/client";
import { ApolloClient, InMemoryCache } from "@apollo/client-integration-nextjs";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { isSubscriptionOperation } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";

const DEFAULT_INTERNAL_GRAPHQL_URL = "http://localhost:4000/graphql";
const SOCKET_RETRY_ATTEMPTS = 2;

function socketUrl() {
  const scheme = window.location.protocol === "https:" ? "wss" : "ws";
  return process.env.NEXT_PUBLIC_GRAPHQL_WS_URL ?? `${scheme}://${window.location.host}/graphql`;
}

function withSubscriptions(httpLink: HttpLink) {
  const socketLink = new GraphQLWsLink(
    createClient({ url: socketUrl, retryAttempts: SOCKET_RETRY_ATTEMPTS }),
  );
  return ApolloLink.split(({ query }) => isSubscriptionOperation(query), socketLink, httpLink);
}

export function makeClient(forwardedHeaders: Record<string, string> = {}) {
  const isServer = typeof window === "undefined";
  const uri = isServer
    ? (process.env.INTERNAL_GRAPHQL_URL ?? DEFAULT_INTERNAL_GRAPHQL_URL)
    : "/graphql";
  const httpLink = new HttpLink({
    uri,
    headers: { "x-miseboard-csrf": "1", ...forwardedHeaders },
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: isServer ? httpLink : withSubscriptions(httpLink),
  });
}
