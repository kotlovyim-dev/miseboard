import { describe, expect, it, vi } from "vitest";
import { defaultHelpers } from "./helpers";
import { createEngine } from "./engine";
import type { EngineNode } from "./graph";

function node(id: string, source: string): EngineNode {
  return { id, fields: { value: source } };
}

function spyEngine(nodes: EngineNode[]) {
  const spy = vi.fn(() => 1);
  const engine = createEngine(nodes, { helpers: { ...defaultHelpers, spy } });
  return { engine, spy };
}

const diamond = [
  node("a", "{{ spy(1) }}"),
  node("b", "{{ spy(a) }}"),
  node("c", "{{ spy(a) }}"),
  node("d", "{{ spy(b, c) }}"),
];

describe("createEngine", () => {
  it("evaluates a diamond once per node", () => {
    const { engine, spy } = spyEngine(diamond);

    const evaluations = engine.evaluateAll({ a: 1, b: 2, c: 3, d: 4 });

    expect(spy).toHaveBeenCalledTimes(4);
    expect([...evaluations.keys()]).toEqual(["a", "b", "c", "d"]);
  });

  it("re-evaluates only the downstream nodes after a change", () => {
    const { engine, spy } = spyEngine([...diamond, node("lonely", "{{ spy(1) }}")]);

    const evaluations = engine.update("b", {});

    expect([...evaluations.keys()]).toEqual(["d"]);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("re-evaluates a diamond once when its root changes", () => {
    const { engine, spy } = spyEngine(diamond);

    const evaluations = engine.update("a", {});

    expect([...evaluations.keys()]).toEqual(["b", "c", "d"]);
    expect(spy).toHaveBeenCalledTimes(3);
  });

  it("lists direct references and all dependents", () => {
    const engine = createEngine([node("a", "1"), node("b", "{{ a }}"), node("c", "{{ b }}")]);

    expect(engine.referencesTo("a")).toEqual(["b"]);
    expect(engine.dependentsOf("a")).toEqual(["b", "c"]);
    expect(engine.dependentsOf("c")).toEqual([]);
    expect(engine.dependentsOf("missing")).toEqual([]);
  });

  it("reports the path of a three node cycle on every member field", () => {
    const engine = createEngine([
      { id: "a", fields: { first: "{{ b }}", second: "{{ 1 }}" } },
      node("b", "{{ c }}"),
      node("c", "{{ a }}"),
      node("free", "{{ 1 }}"),
    ]);

    const evaluations = engine.evaluateAll({});

    const error = "Circular dependency: a → b → c → a";
    expect(evaluations.get("a")).toMatchObject({
      first: { ok: false, error },
      second: { ok: false, error },
    });
    expect(evaluations.get("b")).toMatchObject({ value: { ok: false, error } });
    expect(evaluations.get("c")).toMatchObject({ value: { ok: false, error } });
    expect(evaluations.get("free")).toEqual({ value: { ok: true, value: 1 } });
  });

  it("reports a node that references itself as a cycle", () => {
    const engine = createEngine([node("a", "{{ a }}")]);

    expect(engine.evaluateAll({}).get("a")).toMatchObject({
      value: { ok: false, error: "Circular dependency: a → a" },
    });
  });

  it("reports an unknown identifier on the field that uses it", () => {
    const engine = createEngine([
      { id: "a", fields: { title: "Hi {{ ghost.name }}", subtitle: "{{ role }}" } },
    ]);

    const evaluation = engine.evaluateAll({ role: "ADMIN" }).get("a");

    expect(evaluation).toEqual({
      title: { ok: false, error: "Unknown identifier ghost", at: 3 },
      subtitle: { ok: true, value: "ADMIN" },
    });
  });

  it("passes the state to the expressions", () => {
    const engine = createEngine([
      node("orders", "1"),
      node("total", "{{ sum(orders.data, 'amount') }}"),
    ]);

    const evaluation = engine.evaluateAll({ orders: { data: [{ amount: 2 }, { amount: 3 }] } });

    expect(evaluation.get("total")).toEqual({ value: { ok: true, value: 5 } });
  });
});
