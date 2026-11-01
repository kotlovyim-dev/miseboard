import { cpSync } from "node:fs";
import { build } from "esbuild";

const externalNpmPackages = {
  name: "external-npm-packages",
  setup(esbuild) {
    esbuild.onResolve({ filter: /^[^./]/ }, (args) =>
      args.path.startsWith("@miseboard/") ? undefined : { path: args.path, external: true },
    );
  },
};

await build({
  entryPoints: ["src/main.ts"],
  bundle: true,
  platform: "node",
  format: "esm",
  outfile: "dist/main.js",
  plugins: [externalNpmPackages],
});

cpSync("../../packages/db/drizzle", "drizzle", { recursive: true });
