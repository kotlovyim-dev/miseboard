import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const repoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: repoRoot,
  transpilePackages: ["@miseboard/schema"],
  typedRoutes: true,
  async rewrites() {
    if (process.env.NODE_ENV === "production") return [];
    return [{ source: "/graphql", destination: "http://localhost:4000/graphql" }];
  },
};

export default nextConfig;
