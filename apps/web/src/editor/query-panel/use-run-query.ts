"use client";

import { useState } from "react";
import { useApolloClient } from "@apollo/client/react";
import type { QueryConfig } from "@miseboard/config";
import { parseDocument, readVariables } from "@/runtime/query-runner";
import { useRuntime } from "@/runtime/runtime-context";

export interface RunResult {
  variables: Record<string, unknown>;
  data?: unknown;
  error?: string;
  durationMs?: number;
}

export function useRunQuery(query: QueryConfig) {
  const client = useApolloClient();
  const { store } = useRuntime();
  const [result, setResult] = useState<RunResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const run = async () => {
    const variables = readVariables(store, query.id);
    const document = parseDocument(query.document);
    if (!variables.ok) return setResult({ variables: {}, error: variables.error });
    if (!document.ok) return setResult({ variables: variables.values, error: document.error });
    setIsRunning(true);
    const startedAt = performance.now();
    try {
      const { data } = await client.query({
        query: document.value,
        variables: variables.values,
        fetchPolicy: "network-only",
      });
      setResult({ variables: variables.values, data, durationMs: performance.now() - startedAt });
    } catch (error) {
      setResult({
        variables: variables.values,
        error: error instanceof Error ? error.message : String(error),
        durationMs: performance.now() - startedAt,
      });
    }
    setIsRunning(false);
  };

  return { result, isRunning, run };
}
