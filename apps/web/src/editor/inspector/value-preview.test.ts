import { describe, expect, it } from "vitest";
import { describeValue, findErrorSpan } from "./value-preview";

describe("describeValue", () => {
  it("counts array rows", () => {
    expect(describeValue(Array.from({ length: 20 }))).toBe("Array · 20 rows");
    expect(describeValue([1])).toBe("Array · 1 row");
  });

  it("prints primitives and objects as JSON", () => {
    expect(describeValue("Kyiv")).toBe('"Kyiv"');
    expect(describeValue({ id: 1 })).toBe('{"id":1}');
    expect(describeValue(undefined)).toBe("undefined");
  });

  it("truncates long JSON", () => {
    const preview = describeValue({ text: "x".repeat(200) });

    expect(preview).toHaveLength(81);
    expect(preview.endsWith("…")).toBe(true);
  });
});

describe("findErrorSpan", () => {
  it("covers the whole block when the error sits on its opening braces", () => {
    expect(findErrorSpan("a {{ typo }} b", 2)).toEqual({ start: 2, end: 12 });
  });

  it("covers one character for a syntax error inside a block", () => {
    expect(findErrorSpan("{{ 1 + }}", 6)).toEqual({ start: 6, end: 7 });
  });

  it("runs to the end for an unclosed block", () => {
    expect(findErrorSpan("x {{ a", 2)).toEqual({ start: 2, end: 6 });
  });
});
