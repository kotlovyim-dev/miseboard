import SchemaBuilder from "@pothos/core";
import DataloaderPlugin from "@pothos/plugin-dataloader";
import RelayPlugin from "@pothos/plugin-relay";
import ScopeAuthPlugin from "@pothos/plugin-scope-auth";
import ZodPlugin from "@pothos/plugin-zod";
import { DateTimeResolver, JSONResolver } from "graphql-scalars";
import type { Context } from "../context";

export const builder = new SchemaBuilder<{
  Context: Context;
  AuthScopes: { admin: boolean; manager: boolean };
  Scalars: {
    DateTime: { Input: Date; Output: Date };
    JSON: { Input: unknown; Output: unknown };
  };
}>({
  plugins: [ScopeAuthPlugin, RelayPlugin, DataloaderPlugin, ZodPlugin],
  relay: {},
  scopeAuth: {
    authScopes: (context) => ({
      admin: context.role === "ADMIN",
      manager: context.role === "ADMIN" || context.role === "MANAGER",
    }),
  },
});

builder.addScalarType("DateTime", DateTimeResolver);
builder.addScalarType("JSON", JSONResolver);
