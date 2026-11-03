import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { QueryConfig } from "@miseboard/config";
import type { Evaluations } from "@miseboard/engine";
import { createRuntimeStore } from "./runtime-store";
import { createQueryRunner } from "./query-runner";
import type { QueryClient, WatchedQuery, WatchedQueryResult } from "./query-runner";

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

function setup(
  queries: QueryConfig[],
  transform = vi.fn(() => Promise.resolve(undefined as unknown)),
) {
  const store = createRuntimeStore({
    role: "ADMIN",
    widgetStates: {},
    queryStates: { ordersQuery: { data: undefined, isLoading: true, error: null } },
  });
  store.getState().mergeEvaluations(evaluateVenue("v1"));
  const refetch = vi.fn(() => Promise.resolve());
  let emit: (result: WatchedQueryResult) => void = () => undefined;
  const stopLive = vi.fn();
  const subscribeToMore = vi.fn<WatchedQuery["subscribeToMore"]>(() => stopLive);
  const startPolling = vi.fn();
  const watchQuery = vi.fn(() => ({
    subscribe: (onResult: (result: WatchedQueryResult) => void) => {
      emit = onResult;
      return { unsubscribe: () => undefined };
    },
    refetch,
    subscribeToMore,
    startPolling,
  }));
  const query = vi.fn(() => Promise.resolve({ data: { orders: [{ id: "o9" }] } }));
  const client: QueryClient = { watchQuery, query };
  const runner = createQueryRunner(client, store, transform);
  runner.sync(queries);
  return {
    store,
    watchQuery,
    query,
    refetch,
    subscribeToMore,
    startPolling,
    stopLive,
    runner,
    emit: (result: WatchedQueryResult) => emit(result),
  };
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

  it("runs a manual query on demand and exposes the result to expressions", async () => {
    const manualQuery: QueryConfig = { ...ordersQuery, id: "manualQuery", trigger: "manual" };
    const { store, watchQuery, query, runner } = setup([manualQuery]);
    store
      .getState()
      .mergeEvaluations(new Map([["manualQuery", { venueId: { ok: true, value: "v1" } }]]));

    const result = await runner.run("manualQuery");

    expect(watchQuery).not.toHaveBeenCalled();
    expect(query).toHaveBeenCalledWith(expect.objectContaining({ variables: { venueId: "v1" } }));
    expect(result.data).toEqual({ orders: [{ id: "o9" }] });
    expect(store.getState().queryStates["manualQuery"]).toEqual({
      data: { orders: [{ id: "o9" }] },
      isLoading: false,
      error: null,
    });
  });

  it("reports a failed run as the query error", async () => {
    const { store, query, runner } = setup([ordersQuery]);
    query.mockRejectedValueOnce(new Error("boom"));

    const result = await runner.run("ordersQuery");

    expect(result.error).toBe("boom");
    expect(store.getState().queryStates["ordersQuery"]?.error).toBe("boom");
  });

  it("exposes the transformed result of a watched query", async () => {
    const transform = vi.fn(() => Promise.resolve([{ id: "o1" }]));
    const { store, emit } = setup(
      [{ ...ordersQuery, transformer: "return data.orders" }],
      transform,
    );

    emit({ data: { orders: [{ id: "o1" }] }, loading: false });
    await vi.advanceTimersByTimeAsync(0);

    expect(transform).toHaveBeenCalledWith("return data.orders", { orders: [{ id: "o1" }] });
    expect(store.getState().queryStates["ordersQuery"]).toEqual({
      data: [{ id: "o1" }],
      isLoading: false,
      error: null,
    });
  });

  it("reports a failing transformer as the query error", async () => {
    const transform = vi.fn(() => Promise.reject(new Error("Transformer timed out after 1000 ms")));
    const { store, emit } = setup([{ ...ordersQuery, transformer: "while (true) {}" }], transform);

    emit({ data: { orders: [] }, loading: false });
    await vi.advanceTimersByTimeAsync(0);

    expect(store.getState().queryStates["ordersQuery"]).toEqual({
      data: undefined,
      isLoading: false,
      error: "Transformer timed out after 1000 ms",
    });
  });

  it("transforms the result of a manual run and reports its failure", async () => {
    const transform = vi.fn(() => Promise.resolve(3));
    const { runner } = setup([{ ...ordersQuery, transformer: "return 3" }], transform);

    const succeeded = await runner.run("ordersQuery");
    transform.mockRejectedValueOnce(new Error("data is not iterable"));
    const failed = await runner.run("ordersQuery");

    expect(succeeded.data).toBe(3);
    expect(failed.error).toBe("data is not iterable");
  });

  it("follows order updates and polls when the live feed fails", () => {
    const { subscribeToMore, startPolling } = setup([ordersQuery]);

    expect(subscribeToMore).toHaveBeenCalledOnce();
    subscribeToMore.mock.calls[0]?.[0].onError();

    expect(startPolling).toHaveBeenCalledWith(5000);
  });

  it("does not follow queries that do not select orders", () => {
    const { subscribeToMore } = setup([{ ...ordersQuery, document: "query { venues { id } }" }]);

    expect(subscribeToMore).not.toHaveBeenCalled();
  });

  it("stops the live feed with the query", () => {
    const { stopLive, runner } = setup([ordersQuery]);

    runner.stop();

    expect(stopLive).toHaveBeenCalledOnce();
  });
});
