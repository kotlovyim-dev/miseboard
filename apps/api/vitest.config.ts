import { createRequire } from "node:module";
import { defineConfig } from "vitest/config";

const graphqlEntry = createRequire(import.meta.url).resolve("graphql");

export default defineConfig({
  resolve: { alias: { graphql: graphqlEntry } },
});
