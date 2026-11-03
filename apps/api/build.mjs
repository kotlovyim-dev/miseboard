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
  entryPoints: ["src/main.ts", "src/reset.ts"],
  bundle: true,
  platform: "node",
  format: "esm",
  outdir: "dist",
  plugins: [externalNpmPackages],
});

cpSync("../../packages/db/drizzle", "drizzle", { recursive: true });
