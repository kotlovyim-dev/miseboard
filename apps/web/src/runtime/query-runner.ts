import { gql } from "@apollo/client";
import type { DocumentNode } from "graphql";
import type { QueryConfig } from "@miseboard/config";
import type { EvaluationResult } from "@miseboard/engine";
import { debounce } from "./debounce";
import type { RuntimeStore } from "./runtime-store";

export const VARIABLE_DEBOUNCE_MS = 250;

export interface WatchedQueryResult {
  data?: unknown;
  loading: boolean;
  error?: { message: string };
}

export interface WatchedQuery {
  subscribe: (onResult: (result: WatchedQueryResult) => void) => { unsubscribe: () => void };
  refetch: (variables?: Record<string, unknown>) => Promise<unknown>;
}

export interface QueryClient {
  watchQuery: (options: {
    query: DocumentNode;
    variables: Record<string, unknown>;
  }) => WatchedQuery;
}

export interface QueryRunner {
  retry: (queryId: string) => void;
  stop: () => void;
}

interface QueryTask {
  retry: () => void;
  stop: () => void;
}

type Variables = { ok: true; values: Record<string, unknown> } | { ok: false; error: string };

export function startQueryRunner(
  client: QueryClient,
  queries: readonly QueryConfig[],
  store: RuntimeStore,
): QueryRunner {
  const onLoadQueries = queries.filter(isOnLoadQuery);
  const tasks = new Map(onLoadQueries.map((query) => [query.id, startTask(client, query, store)]));

  return {
    retry: (queryId) => tasks.get(queryId)?.retry(),
    stop: () => tasks.forEach((task) => task.stop()),
  };
}

function isOnLoadQuery(query: QueryConfig) {
  return query.kind === "query" && query.trigger === "onLoad";
}

function startTask(client: QueryClient, query: QueryConfig, store: RuntimeStore): QueryTask {
  let watched: WatchedQuery | undefined;
  let subscription: { unsubscribe: () => void } | undefined;
  let lastVariables = "";

  const fail = (error: string) => {
    store.getState().setQueryState(query.id, { data: undefined, isLoading: false, error });
  };

  const start = () => {
    const variables = readVariables(store, query.id);
    const document = parseDocument(query.document);
    if (!variables.ok) return fail(variables.error);
    if (!document.ok) return fail(document.error);
    lastVariables = JSON.stringify(variables.values);
    watched = client.watchQuery({ query: document.value, variables: variables.values });
    subscription = watched.subscribe((result) => {
      store.getState().setQueryState(query.id, {
        data: result.data,
        isLoading: result.loading,
        error: result.error?.message ?? null,
      });
    });
  };

  const refetch = (variables?: Record<string, unknown>) => {
    const current = store.getState().queryStates[query.id];
    store.getState().setQueryState(query.id, {
      data: current?.data,
      isLoading: true,
      error: null,
    });
    watched?.refetch(variables).catch(() => undefined);
  };

  const applyVariables = () => {
    const variables = readVariables(store, query.id);
    if (!variables.ok) return fail(variables.error);
    if (!watched) return start();
    const serialized = JSON.stringify(variables.values);
    if (serialized === lastVariables) return;
    lastVariables = serialized;
    refetch(variables.values);
  };

  const scheduleVariables = debounce(applyVariables, VARIABLE_DEBOUNCE_MS);
  const unwatchStore = store.subscribe((state, previous) => {
    if (state.evaluations.get(query.id) !== previous.evaluations.get(query.id)) scheduleVariables();
  });

  start();

  return {
    retry: () => (watched ? refetch() : start()),
    stop: () => {
      scheduleVariables.cancel();
      unwatchStore();
      subscription?.unsubscribe();
    },
  };
}

export function readVariables(store: RuntimeStore, queryId: string): Variables {
  const evaluation = store.getState().evaluations.get(queryId) ?? {};
  const failed = Object.entries(evaluation).find(([, result]) => !result.ok);
  if (failed) return { ok: false, error: `${failed[0]}: ${describeFailure(failed[1])}` };
  const values = Object.fromEntries(
    Object.entries(evaluation).map(([name, result]) => [name, valueOf(result)]),
  );
  return { ok: true, values };
}

function describeFailure(result: EvaluationResult) {
  return result.ok ? "" : result.error;
}

function valueOf(result: EvaluationResult) {
  return result.ok ? result.value : undefined;
}

export function parseDocument(source: string) {
  try {
    return { ok: true, value: gql(source) } as const;
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) } as const;
  }
}
