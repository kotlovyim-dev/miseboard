import { describe, expect, it } from "vitest";
import { findCompletions } from "./completions";

const scope = {
  venuesQuery: { data: [], isLoading: false, error: null },
  venuesTable: { selectedRow: null },
  stat1: {},
};

describe("findCompletions", () => {
  it("suggests node ids right after the opening braces", () => {
    const result = findCompletions("{{ ", 3, scope);
    expect(result?.items.map((item) => item.label)).toEqual([
      "stat1",
      "venuesQuery",
      "venuesTable",
    ]);
    expect(result?.from).toBe(3);
  });

  it("filters ids by the typed prefix", () => {
    const result = findCompletions("{{ venues", 9, scope);
    expect(result?.items.map((item) => item.label)).toEqual(["venuesQuery", "venuesTable"]);
    expect(result?.from).toBe(3);
  });

  it("suggests members after a dot", () => {
    const result = findCompletions("{{ venuesQuery.", 15, scope);
    expect(result?.items.map((item) => item.insert)).toEqual([
      "venuesQuery.data",
      "venuesQuery.error",
      "venuesQuery.isLoading",
    ]);
    expect(result?.from).toBe(3);
  });

  it("returns nothing outside braces", () => {
    expect(findCompletions("plain venues", 12, scope)).toBeNull();
    expect(findCompletions("{{ a }} venues", 14, scope)).toBeNull();
  });

  it("returns nothing once the name is fully typed", () => {
    expect(findCompletions("{{ stat1", 8, scope)).toBeNull();
  });
});
