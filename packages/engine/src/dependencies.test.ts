import { describe, expect, it } from "vitest";
import { extractDependencies } from "./dependencies";

function namesIn(source: string, locals: string[] = []) {
  return extractDependencies(source, { locals: new Set(locals) }).map(({ name }) => name);
}

describe("extractDependencies", () => {
  it("returns the root identifier of a member chain", () => {
    expect(namesIn("{{ ordersQuery.data.edges[0].node }}")).toEqual(["ordersQuery"]);
  });

  it("finds identifiers used as computed keys", () => {
    expect(namesIn("{{ prices[selectedKey] }}")).toEqual(["prices", "selectedKey"]);
  });

  it("ignores helper names and keeps their arguments", () => {
    expect(namesIn("{{ sum(ordersQuery.data, 'total') }}")).toEqual(["ordersQuery"]);
  });

  it("handles optional chaining", () => {
    expect(namesIn("{{ table1?.selectedRow?.id }}")).toEqual(["table1"]);
  });

  it("looks through operators, ternaries and arrays", () => {
    expect(namesIn("{{ a > 1 ? [b, -c] : d ?? e }}")).toEqual(["a", "b", "c", "d", "e"]);
  });

  it("skips local names", () => {
    expect(namesIn("{{ row.total * rate }}", ["row"])).toEqual(["rate"]);
  });

  it("reads every block and reports its offset", () => {
    expect(extractDependencies("A {{ x }} B {{ y }}")).toEqual([
      { name: "x", at: 2 },
      { name: "y", at: 12 },
    ]);
  });

  it("returns nothing for text and broken expressions", () => {
    expect(namesIn("plain text")).toEqual([]);
    expect(namesIn("{{ 1 + }}")).toEqual([]);
    expect(namesIn("{{ unclosed")).toEqual([]);
  });
});
