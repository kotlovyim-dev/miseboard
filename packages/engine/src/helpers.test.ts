import { describe, expect, it } from "vitest";
import { evaluateTemplate } from "./evaluate-template";

const scope = {
  rows: [
    { kind: "food", total: 10000 },
    { kind: "drink", total: 5000 },
    { kind: "food", total: 3000 },
  ],
};
const now = () => new Date("2026-11-01T12:00:00Z");

function run(expression: string, clock = now) {
  return evaluateTemplate(`{{ ${expression} }}`, scope, { now: clock });
}

describe("helpers", () => {
  it.each([
    ["sum([1, 2, 3])", 6],
    ["sum(rows, 'total')", 18000],
    ["avg(rows, 'total')", 6000],
    ["avg([])", 0],
    ["count(rows)", 3],
    ["map(rows, 'kind')", ["food", "drink", "food"]],
    ["filter(rows, 'kind', 'food')", [rows(0), rows(2)]],
    ["round(3.14159, 2)", 3.14],
    ["round(2.5)", 3],
    ["len('abc')", 3],
    ["len(rows)", 3],
  ])("evaluates %s", (expression, expected) => {
    expect(run(expression)).toEqual({ ok: true, value: expected });
  });

  it("formats kopecks as hryvnias", () => {
    const result = run("formatUAH(123450)");

    expect(result).toMatchObject({ ok: true });
    expect(String(result.ok && result.value).replace(/\s/g, " ")).toBe("1 234,50 ₴");
  });

  it("formats an ISO date in Kyiv time", () => {
    expect(run("formatDate('2026-11-01T12:05:00Z')")).toEqual({ ok: true, value: "1 Nov, 14:05" });
    expect(run("formatDate('2026-11-01T22:30:00Z')")).toEqual({ ok: true, value: "2 Nov, 00:30" });
  });

  it("rejects bad helper arguments with a message", () => {
    expect(run("sum(5)")).toEqual({ ok: false, error: "sum expects an array", at: 0 });
    expect(run("sum(['a'])")).toEqual({ ok: false, error: "sum expects a number", at: 0 });
    expect(run("formatDate('nope')")).toEqual({
      ok: false,
      error: "formatDate expects an ISO date",
      at: 0,
    });
    expect(run("len(5)").ok).toBe(false);
  });

  it("returns the start of the Kyiv day from the injected clock", () => {
    expect(run("today()")).toEqual({ ok: true, value: "2026-10-31T22:00:00.000Z" });
    expect(run("daysAgo(8)")).toEqual({ ok: true, value: "2026-10-23T21:00:00.000Z" });
    expect(run("today()", () => new Date("2026-07-15T21:30:00Z"))).toEqual({
      ok: true,
      value: "2026-07-15T21:00:00.000Z",
    });
  });
});

function rows(index: number) {
  return scope.rows[index];
}
