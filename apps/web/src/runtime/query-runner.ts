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

export interface RunResult {
  variables: Record<string, unknown>;
  data?: unknown;
  error?: string;
  durationMs?: number;
}

export interface QueryClient {
  query: (options: {
    query: DocumentNode;
    variables: Record<string, unknown>;
    fetchPolicy: "network-only";
  }) => Promise<unknown>;
  watchQuery: (options: {
    query: DocumentNode;
    variables: Record<string, unknown>;
  }) => WatchedQuery;
}

export interface QueryRunner {
  run: (queryId: string) => Promise<RunResult>;
  sync: (queries: readonly QueryConfig[]) => void;
  retry: (queryId: string) => void;
  stop: () => void;
}

interface QueryTask {
  update: (query: QueryConfig) => void;
  retry: () => void;
  stop: () => void;
}

type Variables = { ok: true; values: Record<string, unknown> } | { ok: false; error: string };

export function createQueryRunner(client: QueryClient, store: RuntimeStore): QueryRunner {
  const tasks = new Map<string, QueryTask>();
  let known: readonly QueryConfig[] = [];

  const stopTask = (queryId: string) => {
    tasks.get(queryId)?.stop();
    tasks.delete(queryId);
  };

  return {
    run: (queryId) =>
      runQuery(
        client,
        store,
        known.find((query) => query.id === queryId),
      ),
    sync: (queries) => {
      known = queries;
      const onLoad = queries.filter(isOnLoadQuery);
      const ids = new Set(onLoad.map((query) => query.id));
      [...tasks.keys()].filter((id) => !ids.has(id)).forEach(stopTask);
      for (const query of onLoad) {
        const task = tasks.get(query.id);
        if (task) task.update(query);
        else tasks.set(query.id, startTask(client, query, store));
      }
    },
    retry: (queryId) => tasks.get(queryId)?.retry(),
    stop: () => [...tasks.keys()].forEach(stopTask),
  };
}

function isOnLoadQuery(query: QueryConfig) {
  return query.kind === "query" && query.trigger === "onLoad";
}

function startTask(client: QueryClient, initial: QueryConfig, store: RuntimeStore): QueryTask {
  let query = initial;
  let watched: WatchedQuery | undefined;
  let subscription: { unsubscribe: () => void } | undefined;
  let watchedDocument = "";
  let lastVariables = "";

  const fail = (error: string) => {
    store.getState().setQueryState(query.id, { data: undefined, isLoading: false, error });
  };

  const stopWatching = () => {
    subscription?.unsubscribe();
    watched = undefined;
  };

  const watch = (document: DocumentNode, variables: Record<string, unknown>) => {
    stopWatching();
    watchedDocument = query.document;
    lastVariables = JSON.stringify(variables);
    watched = client.watchQuery({ query: document, variables });
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

  const apply = () => {
    const variables = readVariables(store, query.id);
    const document = parseDocument(query.document);
    if (!variables.ok) return fail(variables.error);
    if (!document.ok) {
      stopWatching();
      return fail(document.error);
    }
    if (!watched || watchedDocument !== query.document)
      return watch(document.value, variables.values);
    const serialized = JSON.stringify(variables.values);
    if (serialized === lastVariables) return;
    lastVariables = serialized;
    refetch(variables.values);
  };

  const scheduleApply = debounce(apply, VARIABLE_DEBOUNCE_MS);
  const unwatchStore = store.subscribe((state, previous) => {
    if (state.evaluations.get(query.id) !== previous.evaluations.get(query.id)) scheduleApply();
  });

  apply();

  return {
    update: (next) => {
      if (next === query) return;
      query = next;
      scheduleApply();
    },
    retry: () => (watched ? refetch() : apply()),
    stop: () => {
      scheduleApply.cancel();
      unwatchStore();
      stopWatching();
    },
  };
}

async function runQuery(
  client: QueryClient,
  store: RuntimeStore,
  query: QueryConfig | undefined,
): Promise<RunResult> {
  if (!query) return { variables: {}, error: "Unknown query" };
  const variables = readVariables(store, query.id);
  const document = parseDocument(query.document);
  if (!variables.ok) return { variables: {}, error: variables.error };
  if (!document.ok) return { variables: variables.values, error: document.error };
  const previous = store.getState().queryStates[query.id];
  const setState = store.getState().setQueryState;
  setState(query.id, { data: previous?.data, isLoading: true, error: null });
  const startedAt = performance.now();
  try {
    const { data } = (await client.query({
      query: document.value,
      variables: variables.values,
      fetchPolicy: "network-only",
    })) as { data?: unknown };
    setState(query.id, { data, isLoading: false, error: null });
    return { variables: variables.values, data, durationMs: performance.now() - startedAt };
  } catch (caught) {
    const error = caught instanceof Error ? caught.message : String(caught);
    setState(query.id, { data: previous?.data, isLoading: false, error });
    return { variables: variables.values, error, durationMs: performance.now() - startedAt };
  }
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
