import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "./schema.graphql",
  documents: ["../../apps/web/src/**/*.{ts,tsx}"],
  ignoreNoDocuments: true,
  generates: {
    "./src/gql/": {
      preset: "client",
      config: {
        enumType: "string-literal",
        useTypeImports: true,
        scalars: { DateTime: "string", JSON: "unknown" },
      },
    },
  },
};

export default config;
