import { readFileSync } from "node:fs";
import { buildSchema, parse, validate } from "graphql";
import { describe, expect, it } from "vitest";
import { AppConfig, findDuplicateIds } from "@miseboard/config";
import { widgetRegistry } from "@/widgets/registry";
import { createRuntime } from "./create-runtime";
import { demoApp } from "./demo-app";

const schema = buildSchema(
  readFileSync(new URL("../../../../packages/schema/schema.graphql", import.meta.url), "utf8"),
);

describe("demoApp", () => {
  it("is a valid app config", () => {
    expect(AppConfig.safeParse(demoApp.config).success).toBe(true);
    expect(findDuplicateIds(demoApp.config)).toEqual([]);
  });

  it("evaluates every widget field without errors before the queries return", () => {
    const { store } = createRuntime(demoApp.config, "ADMIN", widgetRegistry);

    const failures = [...store.getState().evaluations.values()]
      .flatMap((fields) => Object.values(fields))
      .filter((result) => !result.ok);

    expect(failures).toEqual([]);
  });

  it("queries only fields that exist in the API schema", () => {
    for (const query of demoApp.config.queries) {
      expect(validate(schema, parse(query.document))).toEqual([]);
    }
  });
});
