import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { QueryConfig } from "@miseboard/config";
import type { Evaluations } from "@miseboard/engine";
import { createRuntimeStore } from "./runtime-store";
import { createQueryRunner } from "./query-runner";
import type { QueryClient, WatchedQueryResult } from "./query-runner";

const ordersQuery: QueryConfig = {
  id: "ordersQuery",
  kind: "query",
  document: "query ($venueId: ID!) { orders(venueId: $venueId) { id } }",
  variables: { venueId: "{{ venueSelect.value }}" },
  trigger: "onLoad",
};

function evaluateVenue(venueId: string): Evaluations {
  return new Map([["ordersQuery", { venueId: { ok: true, value: venueId } }]]);
}

function setup(queries: QueryConfig[]) {
  const store = createRuntimeStore({
    role: "ADMIN",
    widgetStates: {},
    queryStates: { ordersQuery: { data: undefined, isLoading: true, error: null } },
  });
  store.getState().mergeEvaluations(evaluateVenue("v1"));
  const refetch = vi.fn(() => Promise.resolve());
  let emit: (result: WatchedQueryResult) => void = () => undefined;
  const watchQuery = vi.fn(() => ({
    subscribe: (onResult: (result: WatchedQueryResult) => void) => {
      emit = onResult;
      return { unsubscribe: () => undefined };
    },
    refetch,
  }));
  const client: QueryClient = { watchQuery };
  const runner = createQueryRunner(client, store);
  runner.sync(queries);
  return { store, watchQuery, refetch, runner, emit: (result: WatchedQueryResult) => emit(result) };
}

describe("createQueryRunner", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("starts an on-load query with its evaluated variables and stores the result", () => {
    const { store, watchQuery, emit } = setup([ordersQuery]);

    emit({ data: { orders: [] }, loading: false });

    expect(watchQuery).toHaveBeenCalledWith(
      expect.objectContaining({ variables: { venueId: "v1" } }),
    );
    expect(store.getState().queryStates["ordersQuery"]).toEqual({
      data: { orders: [] },
      isLoading: false,
      error: null,
    });
  });

  it("refetches once, 250 ms after the variables stop changing", () => {
    const { store, refetch } = setup([ordersQuery]);

    store.getState().mergeEvaluations(evaluateVenue("v2"));
    vi.advanceTimersByTime(100);
    store.getState().mergeEvaluations(evaluateVenue("v3"));
    vi.advanceTimersByTime(249);
    expect(refetch).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(refetch).toHaveBeenCalledOnce();
    expect(refetch).toHaveBeenCalledWith({ venueId: "v3" });
  });

  it("does not refetch when the variables come back equal", () => {
    const { store, refetch } = setup([ordersQuery]);

    store.getState().mergeEvaluations(evaluateVenue("v1"));
    vi.advanceTimersByTime(250);

    expect(refetch).not.toHaveBeenCalled();
  });

  it("reports a document that does not parse as the query error", () => {
    const { store, watchQuery } = setup([{ ...ordersQuery, document: "query {" }]);

    expect(watchQuery).not.toHaveBeenCalled();
    expect(store.getState().queryStates["ordersQuery"]?.error).toMatch(/Syntax Error/);
  });

  it("never runs mutations or manual queries on load", () => {
    const { watchQuery } = setup([
      { ...ordersQuery, kind: "mutation" },
      { ...ordersQuery, id: "manualQuery", trigger: "manual" },
    ]);

    expect(watchQuery).not.toHaveBeenCalled();
  });

  it("keeps the subscription when an unrelated config edit syncs the same queries", () => {
    const { watchQuery, refetch, runner } = setup([ordersQuery]);

    runner.sync([{ ...ordersQuery }]);
    vi.advanceTimersByTime(250);

    expect(watchQuery).toHaveBeenCalledOnce();
    expect(refetch).not.toHaveBeenCalled();
  });

  it("watches the document again once, 250 ms after the last document edit", () => {
    const { watchQuery, runner } = setup([ordersQuery]);

    runner.sync([
      {
        ...ordersQuery,
        document: "query ($venueId: ID!) { orders(venueId: $venueId) { id status } }",
      },
    ]);
    runner.sync([
      {
        ...ordersQuery,
        document: "query ($venueId: ID!) { orders(venueId: $venueId) { id total } }",
      },
    ]);
    vi.advanceTimersByTime(250);

    expect(watchQuery).toHaveBeenCalledTimes(2);
  });

  it("stops following a query that was removed or made manual", () => {
    const { store, refetch, runner } = setup([ordersQuery]);

    runner.sync([{ ...ordersQuery, trigger: "manual" }]);
    store.getState().mergeEvaluations(evaluateVenue("v2"));
    vi.advanceTimersByTime(250);

    expect(refetch).not.toHaveBeenCalled();
  });
});
