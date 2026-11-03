import { readFileSync } from "node:fs";
import { buildSchema, parse, validate } from "graphql";
import { describe, expect, it } from "vitest";
import { findDuplicateIds, parseAppConfig } from "@miseboard/config";
import { parseExpression, parseTemplate } from "@miseboard/engine";
import { restaurantOps } from "./restaurant-ops";

const schema = buildSchema(
  readFileSync(new URL("../../../schema/schema.graphql", import.meta.url), "utf8"),
);
const { config } = restaurantOps;

describe("restaurantOps", () => {
  it("is a valid app config", () => {
    expect(parseAppConfig(config)).toEqual({ ok: true, config });
    expect(findDuplicateIds(config)).toEqual([]);
  });

  it("uses documents the API schema accepts", () => {
    for (const query of config.queries) {
      expect(validate(schema, parse(query.document))).toEqual([]);
    }
  });

  it("only contains expressions the engine can parse", () => {
    const failures = collectExpressions(config).filter((source) => !parseExpression(source).ok);

    expect(failures).toEqual([]);
  });

  it("contains expressions to check", () => {
    expect(collectExpressions(config).length).toBeGreaterThan(10);
  });
});

function collectExpressions(node: unknown, key?: string): string[] {
  if (key === "document") return [];
  if (typeof node === "string") return expressionsIn(node);
  if (Array.isArray(node)) return node.flatMap((child) => collectExpressions(child));
  if (node && typeof node === "object") {
    return Object.entries(node).flatMap(([name, child]) => collectExpressions(child, name));
  }
  return [];
}

function expressionsIn(text: string): string[] {
  const template = parseTemplate(text);
  if (!template.ok) return [text];
  return template.segments.flatMap((segment) =>
    segment.kind === "expression" ? [segment.source] : [],
  );
}
