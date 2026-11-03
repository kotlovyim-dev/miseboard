"use client";

import { useState } from "react";
import type { RunResult } from "@/runtime/query-runner";
import { useRuntime } from "@/runtime/runtime-context";

export function useRunQuery(queryId: string) {
  const { runQuery } = useRuntime();
  const [result, setResult] = useState<RunResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const run = async () => {
    setIsRunning(true);
    setResult(await runQuery(queryId));
    setIsRunning(false);
  };

  return { result, isRunning, run };
}
