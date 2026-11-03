# 0005. Single-instance PubSub

Status: accepted

## Context

`updateOrderStatus` should notify subscribers of `orderUpdated`. A shared broker (Redis, Postgres `LISTEN/NOTIFY`) would let several API instances see each other's events, but it is another moving part for a demo that runs on one small server.

## Decision

The API publishes through the in-memory PubSub from `graphql-yoga` (`createPubSub`), created once per process. Subscriptions are served over WebSocket with `graphql-ws` on `/graphql`, and the subscribing role is read from the cookie of the upgrade request. The deployment runs exactly one `api` container.

## Consequences

- No extra service and no serialization of events.
- A mutation handled by one API process is invisible to subscribers connected to another, so the API cannot be scaled horizontally as is. Moving to several instances means swapping the PubSub for a shared broker; the resolvers only call `publish` and `subscribe`, so most of the change would sit in `pubsub.ts`.
- Events are lost when the process restarts; subscribers reconnect and see only later events.
- The web client does not subscribe yet, so the subscription is available through the API but the UI does not use it.
