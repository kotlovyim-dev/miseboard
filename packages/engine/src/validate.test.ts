import { describe, expect, it } from "vitest";
import { HELPER_NAMES } from "./fixtures";
import { parseExpression } from "./parse";
import { validateExpression } from "./validate";

function validate(source: string) {
  const parsed = parseExpression(source);
  if (!parsed.ok) return parsed;
  return validateExpression(parsed.ast, HELPER_NAMES);
}

describe("validateExpression", () => {
  it.each([
    "42",
    "'text'",
    "true",
    "null",
    "orders.data.edges",
    "rows[0]",
    "row['name']",
    "rows[index]",
    "!a && -b",
    "a + b * c ?? d",
    "a ? [1, 2] : []",
    "sum(orders.data, 'total')",
    "formatUAH(sum(map(orders.data, 'total')))",
    "count([])",
  ])("allows %s", (source) => {
    expect(validate(source)).toEqual({ ok: true });
  });

  it.each([
    ["this", "this.a", "this is not allowed"],
    ["new", "new Date()", "Only one expression is allowed"],
    ["assignment", "a = 1", "Unexpected"],
    ["an arrow function", "x => x", "Unexpected"],
    ["a function literal", "function () {}", "Unexpected"],
    ["an object literal", "{ a: 1 }", "Unexpected"],
    ["a comma expression", "(a, b)", "Comma expressions are not allowed"],
    ["an array hole", "[1, , 2]", "Empty array slots are not allowed"],
    ["an empty expression", " ", "Expression is empty"],
    ["two expressions", "a b", "Only one expression is allowed"],
    ["an unknown helper", "eval('1')", "Unknown helper eval"],
    ["a method call", "orders.data.map('x')", "Only helper functions can be called"],
    ["a call result call", "sum(a)(b)", "Only helper functions can be called"],
    ["a bare __proto__", "__proto__", "Access to __proto__ is not allowed"],
    ["a constructor property", "a.constructor", "Access to constructor is not allowed"],
    ["a prototype property", "a.b.prototype", "Access to prototype is not allowed"],
    ["a computed constructor key", "a['constructor']", "Access to constructor is not allowed"],
    ["a computed __proto__ key", "a['__proto__']", "Access to __proto__ is not allowed"],
    ["a blocked name in a call argument", "sum(a.__proto__)", "Access to __proto__ is not allowed"],
    [
      "a blocked name in a ternary",
      "a ? b : c.constructor",
      "Access to constructor is not allowed",
    ],
    ["a blocked name in an array", "[a.prototype]", "Access to prototype is not allowed"],
  ])("rejects %s", (_name, source, error) => {
    const result = validate(source);

    expect(result.ok).toBe(false);
    expect(result).toMatchObject({ error: expect.stringContaining(error) });
  });

  it("rejects a bitwise operator even when it parses", () => {
    const result = validateExpression(
      {
        type: "BinaryExpression",
        operator: "|",
        left: { type: "Literal", value: 1 },
        right: { type: "Literal", value: 2 },
      },
      HELPER_NAMES,
    );

    expect(result).toEqual({ ok: false, error: "Operator | is not allowed" });
  });
});
