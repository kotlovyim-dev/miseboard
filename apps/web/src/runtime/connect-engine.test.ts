import { describe, expect, it } from "vitest";
import { connectEngine } from "./connect-engine";
import { createRuntime } from "./create-runtime";
import { sampleConfig, tableDefinition } from "./fixtures";

function setup(role = "ADMIN") {
  const runtime = createRuntime(sampleConfig, role, { table: tableDefinition });
  connectEngine(runtime.store, runtime.engine);
  return runtime.store;
}

describe("connectEngine", () => {
  it("evaluates widgets once when the runtime is created", () => {
    const store = setup();

    expect(store.getState().evaluations.get("ordersTable")).toEqual({
      data: { ok: true, value: undefined },
    });
  });

  it("re-evaluates the dependents of a query when its state changes", () => {
    const store = setup();

    store
      .getState()
      .setQueryState("ordersQuery", { data: [{ id: "o1" }], isLoading: false, error: null });

    expect(store.getState().evaluations.get("ordersTable")).toEqual({
      data: { ok: true, value: [{ id: "o1" }] },
    });
  });

  it("feeds a widget's state into the variables of the queries that read it", () => {
    const store = setup();

    store.getState().setWidgetState("venueSelect", { value: "v7" });

    expect(store.getState().evaluations.get("ordersQuery")).toEqual({
      venueId: { ok: true, value: "v7" },
    });
  });
});
