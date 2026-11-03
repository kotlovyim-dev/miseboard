# 0001. Code-first schema with Pothos

Status: accepted

## Context

The API needs a hand-designed GraphQL schema with Relay-style ids, per-role authorization, DataLoader and Zod validation. The web app needs typed operations. Schema-first SDL plus hand-written resolver types keeps two descriptions of the same schema that can drift apart.

## Decision

The schema is written in TypeScript with Pothos (`apps/api/src/schema`), using the relay, dataloader, scope-auth and zod plugins. `pnpm codegen` prints the SDL to `packages/schema/schema.graphql` and runs graphql-codegen to produce typed documents in `packages/schema/src/gql`. Both outputs are committed, and `pnpm codegen:check` fails CI if they are stale.

## Consequences

- Resolver types come from the schema definition, so a field and its resolver cannot disagree.
- Authorization sits on the field (`authScopes: { admin: true }`) and is checked by the plugin.
- The printed SDL is the contract the client codegen reads; a schema change shows up as a diff in review.
- Pothos is a smaller community than plain SDL tooling, and the builder generics are harder to read at first.
- Generated files are committed, so every schema change touches them.
