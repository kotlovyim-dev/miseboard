import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const DEFAULT_GRAPHQL_URL = "http://localhost:4000/graphql";

const repoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");

const nextConfig: NextConfig = {
  output: "standalone",
  agentRules: false,
  outputFileTracingRoot: repoRoot,
  transpilePackages: ["@miseboard/schema", "@miseboard/config", "@miseboard/engine"],
  typedRoutes: true,
  async rewrites() {
    if (process.env.NODE_ENV === "production") return [];
    return [
      { source: "/graphql", destination: process.env.INTERNAL_GRAPHQL_URL ?? DEFAULT_GRAPHQL_URL },
    ];
  },
};

export default nextConfig;
