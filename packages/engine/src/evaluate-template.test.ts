import { describe, expect, it } from "vitest";
import { evaluateTemplate } from "./evaluate-template";

const scope = {
  orders: { data: [{ total: 100 }, { total: 250 }], isLoading: false },
  name: "Mise",
  nothing: null,
};

function valueOf(source: string, extra: Record<string, unknown> = {}) {
  return evaluateTemplate(source, { ...scope, ...extra });
}

describe("evaluateTemplate", () => {
  it("keeps the type for a single-block template", () => {
    expect(valueOf("{{ orders.data }}")).toEqual({ ok: true, value: scope.orders.data });
    expect(valueOf("{{ 1 + 2 }}")).toEqual({ ok: true, value: 3 });
    expect(valueOf("{{ orders.isLoading }}")).toEqual({ ok: true, value: false });
  });

  it("stringifies mixed templates", () => {
    expect(valueOf("Hello {{ name }}, {{ 1 + 1 }} items")).toEqual({
      ok: true,
      value: "Hello Mise, 2 items",
    });
    expect(valueOf("rows: {{ orders.data[0] }}")).toEqual({
      ok: true,
      value: 'rows: {"total":100}',
    });
  });

  it("renders undefined and null as empty text inside mixed templates", () => {
    expect(valueOf("[{{ missing }}][{{ nothing }}]")).toEqual({ ok: true, value: "[][]" });
  });

  it("returns plain text and empty templates unchanged", () => {
    expect(valueOf("plain")).toEqual({ ok: true, value: "plain" });
    expect(valueOf("")).toEqual({ ok: true, value: "" });
  });

  it("returns undefined for missing properties", () => {
    expect(valueOf("{{ orders.nope.deeper }}")).toEqual({ ok: true, value: undefined });
    expect(valueOf("{{ orders.data[99].total }}")).toEqual({ ok: true, value: undefined });
    expect(valueOf("{{ orders?.nope?.deeper }}")).toEqual({ ok: true, value: undefined });
  });

  it("short-circuits logical operators", () => {
    expect(valueOf("{{ false && 1 / 'x' }}")).toEqual({ ok: true, value: false });
    expect(valueOf("{{ 1 || 1 / 'x' }}")).toEqual({ ok: true, value: 1 });
    expect(valueOf("{{ nothing ?? 'fallback' }}")).toEqual({ ok: true, value: "fallback" });
    expect(valueOf("{{ 0 ?? 'fallback' }}")).toEqual({ ok: true, value: 0 });
  });

  it("compares strictly", () => {
    expect(valueOf("{{ 1 == '1' }}")).toEqual({ ok: true, value: false });
    expect(valueOf("{{ 1 != '1' }}")).toEqual({ ok: true, value: true });
    expect(valueOf("{{ 2 >= 2 }}")).toEqual({ ok: true, value: true });
  });

  it("evaluates ternaries and array literals", () => {
    expect(valueOf("{{ orders.isLoading ? 'wait' : [1, 2] }}")).toEqual({
      ok: true,
      value: [1, 2],
    });
  });

  it("reads from extra scope names such as row", () => {
    expect(valueOf("{{ row.total * 2 }}", { row: { total: 21 } })).toEqual({ ok: true, value: 42 });
  });

  it("blocks prototype access at runtime", () => {
    const blocked = valueOf("{{ orders['__' + 'proto__'] }}");
    expect(blocked.ok).toBe(false);
    expect(valueOf("{{ name['constr' + 'uctor'] }}").ok).toBe(false);
    expect(valueOf("{{ name.length }}")).toEqual({ ok: true, value: 4 });
    expect(valueOf("{{ name.toUpperCase }}")).toEqual({ ok: true, value: undefined });
  });

  it("rejects operations on the wrong types", () => {
    expect(valueOf("{{ 'a' - 1 }}")).toEqual({
      ok: false,
      error: "Operator - needs numbers",
      at: 0,
    });
  });

  it("stops expressions longer than the step limit", () => {
    const result = valueOf(`{{ [[${ones(5000)}], [${ones(5000)}]] }}`);

    expect(result).toEqual({ ok: false, error: "Expression is longer than 10000 steps", at: 0 });
  });

  it("stops array literals over the item limit", () => {
    const result = valueOf(`{{ [${ones(10_001)}] }}`);

    expect(result).toEqual({ ok: false, error: "Arrays are limited to 10000 items", at: 0 });
  });

  it("stops arrays over the item limit", () => {
    const result = valueOf("{{ count(items) }}", { items: new Array(10_001).fill(1) });

    expect(result).toEqual({ ok: false, error: "Arrays are limited to 10000 items", at: 0 });
  });

  it("reports template errors at the block offset", () => {
    expect(valueOf("ab {{ 1 + }}")).toMatchObject({ ok: false, at: 3 + 2 + 5 });
    expect(valueOf("ab {{ this }}")).toMatchObject({ ok: false, at: 3 });
    expect(valueOf("ab {{ 1 / 'x' }}")).toMatchObject({ ok: false, at: 3 });
    expect(valueOf("ab {{ 1")).toMatchObject({ ok: false, at: 3 });
  });

  it("accepts a replacement helper registry", () => {
    const calls: string[] = [];
    const helpers = { ping: () => calls.push("ping") };

    expect(evaluateTemplate("{{ ping() }}", {}, { helpers })).toEqual({ ok: true, value: 1 });
    expect(evaluateTemplate("{{ sum([1]) }}", {}, { helpers }).ok).toBe(false);
    expect(calls).toEqual(["ping"]);
  });
});

function ones(length: number) {
  return new Array(length).fill("1").join(",");
}

describe("evaluateTemplate nesting", () => {
  it("reports an overly long chain as an error instead of throwing", () => {
    const chain = Array(50_000).fill("1").join(" + ");

    const result = evaluateTemplate(`{{ ${chain} }}`, {});

    expect(result).toMatchObject({ ok: false, error: "Expression is too complex" });
  });
});
