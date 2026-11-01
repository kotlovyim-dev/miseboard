import { describe, expect, it } from "vitest";
import { parseExpression } from "./parse";

describe("parseExpression", () => {
  it.each([
    ["a literal", "42"],
    ["an identifier", "orders"],
    ["dot access", "orders.data.edges"],
    ["index access", "rows[0]"],
    ["string key access", "row['name']"],
    ["unary operators", "!isLoading && -total"],
    ["arithmetic", "(a + b) * c / d % e - 1"],
    ["comparisons", "a < b || a <= b || a > b || a >= b"],
    ["equality", "a == b && a != b && a === b && a !== b"],
    ["nullish coalescing", "selected.name ?? 'none'"],
    ["a ternary", "role === 'ADMIN' ? 1 : 2"],
    ["an array literal", "[1, 2, a]"],
    ["a helper call", "sum(orders.data, 'total')"],
  ])("parses %s", (_name, source) => {
    expect(parseExpression(source)).toMatchObject({ ok: true });
  });

  it("gives ?? the same precedence as ||", () => {
    const parsed = parseExpression("a ?? b || c");

    expect(parsed).toMatchObject({ ok: true, ast: { type: "BinaryExpression", operator: "||" } });
  });

  it.each(["a | b", "a & b", "a ^ b", "a << 1", "a >> 1", "a >>> 1", "~a", "+a"])(
    "does not parse the operator in %s as an operator",
    (source) => {
      const parsed = parseExpression(source);

      expect(parsed.ok && parsed.ast.type).not.toBe("BinaryExpression");
      expect(parsed.ok && parsed.ast.type).not.toBe("UnaryExpression");
    },
  );

  it("reports the jsep index for a syntax error", () => {
    expect(parseExpression("a + (b")).toEqual({
      ok: false,
      error: "Unclosed (",
      at: 6,
    });
  });

  it("returns the same result object for the same source", () => {
    expect(parseExpression("a + b")).toBe(parseExpression("a + b"));
  });
});
