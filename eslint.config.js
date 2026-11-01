import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

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
]);
