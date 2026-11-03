import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import globals from "globals";
import tseslint from "typescript-eslint";

const webFiles = ["apps/web/**/*.{ts,tsx}"];

export default defineConfig([
  globalIgnores([
    "**/dist/",
    "**/.next/",
    "**/coverage/",
    "packages/schema/src/gql/",
    "packages/db/drizzle/",
  ]),
  {
    linterOptions: { noInlineConfig: true },
    languageOptions: { globals: globals.node },
    extends: [js.configs.recommended, tseslint.configs.strict, tseslint.configs.stylistic],
    rules: {
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
    },
  },
  ...nextVitals.map((config) => ({ ...config, files: webFiles })),
  {
    files: webFiles,
    settings: { next: { rootDir: "apps/web" } },
    rules: { "react/no-danger": "error" },
  },
  {
    files: ["apps/web/src/widgets/table/table-widget.tsx"],
    rules: { "react-hooks/incompatible-library": "off" },
  },
]);
