"use client";

import { createContext, useContext } from "react";
import { useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";
import type { AppConfigData } from "@miseboard/config";
import type { Engine } from "@miseboard/engine";
import { buildScope } from "./connect-engine";
import type { RunResult } from "./query-runner";
import type { RuntimeState, RuntimeStore } from "./runtime-store";

export interface RuntimeContextValue {
  store: RuntimeStore;
  engine: Engine;
  config: AppConfigData;
  retryQuery: (queryId: string) => void;
  runQuery: (queryId: string) => Promise<RunResult>;
}

export const RuntimeContext = createContext<RuntimeContextValue | null>(null);

export function useRuntime() {
  const runtime = useContext(RuntimeContext);
  if (!runtime) throw new Error("useRuntime must be used within AppRuntimeProvider");
  return runtime;
}

export function useRuntimeStore<TSelected>(selector: (state: RuntimeState) => TSelected) {
  return useStore(useRuntime().store, selector);
}

export function useRuntimeScope() {
  return useRuntimeStore(useShallow(buildScope));
}
